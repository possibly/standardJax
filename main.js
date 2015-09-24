var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var Runner = require('./lib/Runner.js');
var Interpreter = require('./lib/Interpreter.js');
var World = require('./lib/World.js');

var emitter = new EventEmitter();
var runner = new Runner(emitter);
var interpreter = new Interpreter(emitter);
var world = new World(emitter);

var programsDir = './programs/';

//loop -> world -> interpreter -> runner -> interpreter -> interpreter ->  world -> world -> interpreter
function loop(files){
  files.forEach(function(file){
    var player = world.find(file)[0];
    var state = interpreter.interpretPlayer(player);
    var playerOutput = runner.run(getFullPath(file), state);
    var playerAction = interpreter.interpretAction(file, playerOutput);

    emitter.emit('playerTurnStart', file, playerOutput);
    emitter.emit('playerAction', file, playerAction);
  });
}

function getFullPath(file){
  return programsDir.concat(file);
}

// runner -> world
function setupAndStartLoop(err, files){
  var fullPathFiles = files.map(getFullPath);
  fullPathFiles.forEach(runner.setup);

  files.forEach( function(file){
    emitter.emit('playerSetup', file)
  });

  loop(files);
}

//output processing
emitter.on('playerSetup', function(file){
  console.log(file+' is now setup.');
});
emitter.on('playerTurnStart', function(player){
  console.log("It is "+player+"'s turn.");
});
emitter.on('turnEnd', function(player, success){
  console.log('The player '+success);
  console.log('The player model now looks like this:');
  console.log(interpreter.interpretPlayer(player));
  console.log(interpreter.getPlayerName(player)+"'s turn is now over.")
  console.log('-------------------------------------');
});

emitter.on('playerAction', function(player,action){
  console.log(player+' tried to '+action);
});

//game flow
emitter.on('playerSetup', world.addPlayer.bind(world));
emitter.on('playerAction', world.act.bind(world));

//player - world interaction
emitter.on('move', world.move.bind(world));
emitter.on('playerCommunicate', function playerCommunicate(currentPlayerAction, currentPlayer){
  var targetPlayerName = currentPlayerAction[1];
  var targetPlayerRunPath = getFullPath(targetPlayerName);
  var state = interpreter.stealOrShare(currentPlayer.name);
  var targetPlayerOutput = runner.run(targetPlayerRunPath, state);
  var targetPlayer = world.find(targetPlayerName);
  var targetPlayerAction = interpreter.interpretAction(targetPlayer.name, targetPlayerOutput);
  emitter.emit('playerCommunicateAction', currentPlayerAction, currentPlayer, targetPlayerAction, targetPlayer);
});
emitter.on('playerCommunicateAction', world.playerCommunicateAction.bind(world));

fs.readdir(programsDir, setupAndStartLoop);