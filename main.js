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
    runner.run(getFullPath(file), state);
  });
}

function getFullPath(file){
  return programsDir.concat(file);
}

// runner -> world
function setupAndStartLoop(err, files){
  var fullPathFiles = files.map(getFullPath);
  fullPathFiles.forEach(runner.setup, runner);
  loop(files);
}

//output processing
emitter.on('playerTurnStart', function(player){
  console.log("It is "+player+"'s turn.");
});
emitter.on('turnEnd', function(player){
  console.log('The player now looks like this:');
  console.log(interpreter.interpretPlayer(player));
  console.log(player.stats.name+"'s turn is now over.")
  console.log('-------------------------------------');
});

emitter.on('playerAction', function(player,action){
  console.log(player+' tried to '+JSON.stringify(action));
});

//game flow
emitter.on('playerSetup', world.addPlayer.bind(world));
emitter.on('playerTurnStart', interpreter.interpretAction.bind(interpreter));
emitter.on('playerAction', world.act.bind(world));
emitter.on('move', world.move.bind(world));

fs.readdir(programsDir, setupAndStartLoop);