//my modules
var World = require('./lib/World.js');
var world = new World();

//node modules
var fs = require('fs');
var exec = require('child_process').exec;
var stream = require('stream');

//third party modules
var concat = require('concat-stream');
var Rounds = require('rounds-emitter');
var rounds = new Rounds();
var readdir = require('readdir-stream');
var through2 = require('through2');
var fromArray = require('stream-from-array');
var split = require('split');

var programsDir = './programs/';



// function loop(files){
//   files.forEach(function(file){
//     var player = world.find(file)[0];
//     var state = interpreter.interpretPlayer(player);
//     var playerOutput = runProgram(getFullPath(file), state);
//     var playerAction = interpreter.interpretAction(file, playerOutput);

//     emitter.emit('playerTurnStart', file, playerOutput);
//     emitter.emit('playerAction', file, playerAction);
//   });
// }

// function runProgram(path, input){
//   var player = spawn(path, {input: input});
//   var stdout = ""+player.stdout
//   return stdout;
// }

//output processing
// emitter.on('playerSetup', function(file){
//   console.log(file+' is now setup.');
// });
// emitter.on('playerTurnStart', function(player){
//   console.log("It is "+player+"'s turn.");
// });
// emitter.on('turnEnd', function(player, success){
//   console.log('The player '+success);
//   console.log('The player model now looks like this:');
//   console.log(interpreter.interpretPlayer(player));
//   console.log(interpreter.getPlayerName(player)+"'s turn is now over.")
//   console.log('-------------------------------------');
// });

// emitter.on('playerAction', function(player,action){
//   console.log(player+' tried to '+action);
// });

//game flow
// emitter.on('playerSetup', world.addPlayer.bind(world));
// emitter.on('playerAction', world.act.bind(world));

//player - world interaction
// emitter.on('move', world.move.bind(world));
// emitter.on('playerCommunicate', function playerCommunicate(currentPlayerAction, currentPlayer){
//   var targetPlayerName = currentPlayerAction[1];
//   var targetPlayerRunPath = getFullPath(targetPlayerName);
//   var state = interpreter.stealOrShare(currentPlayer.name);
//   var targetPlayerOutput = runProgram(targetPlayerRunPath, state);
//   var targetPlayer = world.find(targetPlayerName);
//   var targetPlayerAction = interpreter.interpretAction(targetPlayer.name, targetPlayerOutput);
//   emitter.emit('playerCommunicateAction', currentPlayerAction, currentPlayer, targetPlayerAction, targetPlayer);
// });
// emitter.on('playerCommunicateAction', world.playerCommunicateAction.bind(world));

function getPlayerName(path){
  return path.split('/')[path.split('/').length-1];
}

rounds.on('setup', function(){
  readdir(programsDir)
    .pipe(through2.obj(function preparePrograms(chunk,_,cb){
      if (chunk.path === programsDir){ return cb(); }
      chunk = './'+chunk.path;
      exec('chmod +x '+chunk);
      var playerName = getPlayerName(chunk);
      world.addPlayer(playerName);
      this.push(chunk+'\n');
      cb();
    }))
    .pipe(concat(function(data){ 
      rounds.next(data) 
    }));
});

rounds.on('roundStart', function(round, args){
  var playerList = Array.prototype.slice.call(args[0])
  fromArray(playerList)
    .pipe(split())
    .pipe(through2(function(chunk,_,cb){
      if (chunk.length == 0){ return cb(); }
      var playerName = getPlayerName(chunk.toString());
      var player = world.find(playerName)[0];
      console.log(player);
      cb();
    }));
  if (round == 3){
    rounds.setNext('gameOver');
  } else{
    rounds.setNext('roundStart');
  }
  rounds.next();
})

rounds.next();