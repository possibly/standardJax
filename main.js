//my modules
var World = require('./lib/World.js');
var world = new World();

//node modules
var execFileSync = require('child_process').execFileSync;
var execSync = require('child_process').execSync;

//third party modules
var Rounds = require('rounds-emitter');
var rounds = new Rounds();
var fs = require('fs');

var programsDir = '/programs/';

function getPlayerName(path){
  return path.split('/')[path.split('/').length-1];
}

rounds.on('roundStart', function(round, args){
  var playerPaths = args[0];
  playerPaths.forEach(function(playerPath){
    rounds.next(playerPath); //turn start
    rounds.next(playerPath); //turn end
    rounds.setNext('turnStart');
  });
  rounds.setNext('roundEnd');
  rounds.next(args[0]);
});

rounds.on('turnStart', function(round, turn, args){
  var playerPath = args[0];
  var playerName = getPlayerName(playerPath);
  var player = world.getPlayer(playerName);
  var playerOutput = execFileSync(playerPath, [], { input: JSON.stringify(player) });
  var action = playerOutput.toString().trim('\n').split(' ');
  if (action[0] === 'move'){
    var oldCoords = player.getPosition();
    var newCoords = player.move(action);
    if (!world.collision(newCoords)){
      world.remove(oldCoords[0], oldCoords[1]);
      world.put(newCoords[0], newCoords[1], player);
      console.log(player.name+' '+action+' successfully.');
    }
    else {
      console.log(player.name+" can not "+action+" since "+world.get(newCoords[0], newCoords[1])+" is in the way.");
    }
  }
  else{
    console.log(action+' is not a valid action.');
  }
  console.log(JSON.stringify(player));
});

rounds.on('roundEnd', function(round, args){
  rounds.next(args[0]);
});

rounds.on('gameOver', function(){
  console.log('game over');
})

fs.readdir(process.cwd()+programsDir, function(err, files){
  var playerPaths = files.map(function(file){
    return process.cwd()+programsDir+file;
  })
  playerPaths.forEach(function(playerPath){
    execSync('chmod +x '+playerPath);
    var playerName = getPlayerName(playerPath);
    world.addPlayer(playerName);
  });
  rounds.setNext('roundStart');
  rounds.next(playerPaths);
});