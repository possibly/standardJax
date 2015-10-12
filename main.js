//my modules
var World = require('./lib/World.js');
var world = new World();
var createAction = require('./lib/Action.js');

//node modules
var execFileSync = require('child_process').execFileSync;
var execSync = require('child_process').execSync;

//third party modules
var Rounds = require('rounds-emitter');
var rounds = new Rounds(1);
var fs = require('fs');

var programsDir = '/programs/';

function nameFromPath(path){
  return path.split('/')[path.split('/').length-1];
}

rounds.on('setup', function(){
  fs.readdir(process.cwd()+programsDir, function(err, files){
    var playerPaths = files.map(function(file){
      return process.cwd()+programsDir+file;
    })
    playerPaths.forEach(function(playerPath){
      execSync('chmod +x '+playerPath);
      var playerName = nameFromPath(playerPath);
      world.addPlayer(playerName);
    });
    rounds.setActors(playerPaths);
    rounds.next();
  });
});

rounds.on('roundStart', function(round, actorPaths, args){
  rounds.next();
});

function actionFromPath(playerPath, verb){
  var playerName = nameFromPath(playerPath);
  var player = world.getPlayer(playerName);
  var playerInput = {'action': verb, 'info': player.toString()};
  console.log(player.name+": input was "+JSON.stringify(playerInput));
  var playerOutput = execFileSync(player.path, [], { input: JSON.stringify(playerInput) });
  var action = createAction();
  action.raw = playerOutput.toString().trim('\n').split(' ');
  action.player = player;
  return action
}

function interpret(action){
  if ( action.raw[0] === 'move' ){
    action.fn = world.move;
  }
  else if( action.raw[0] === 'steal' || action.raw[0] === 'share' ){
    action.otherAction = actionFromPath(world.getPlayer(action.raw[1]).path, 'decide');
    if (action.otherAction.raw[0] !== 'steal' || action.otherAction.raw[0] !== 'share'){ action.otherAction.raw = ['steal']; }
    action.fn = world.decide;
  }
  else if( action.raw[0] === 'gather' ){
    action.fn = world.gather;
  }
  else{
    throw new Error(action.raw+' is not a valid action.');
  }

  return action;
}

rounds.on('turnStart', function(round, turn, actorPath, actorOrder, args){
  var action = actionFromPath(actorPath, 'play');
  try{
    interpret(action).perform(world);
  }catch(err){
    console.log(err);
  }
  console.log(action.player.toString());
  rounds.next();
});

rounds.on('turnEnd', function(){
  rounds.next();
});

rounds.on('roundEnd', function(round, args){
  rounds.next();
});

rounds.on('gameOver', function(){
  console.log('game over');
});

rounds.next();