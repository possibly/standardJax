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

function loop(files){
  files.forEach(function(file){
    var player = world.find(file)
    var state = interpreter.interpretPlayer(player);
    runner.run(file, state);
  });
}

function getFullPath(files){
  var fullPathFiles = files.map(function(file){
    return programsDir.concat(file);
  });
  return fullPathFiles;
}

function setupAndStartLoop(err, files){
  var fullPathFiles = getFullPath(files);
  // console.log(fullPathFiles);
  fullPathFiles.forEach(runner.setup, runner);
  loop(fullPathFiles);
}

emitter.on('playerSetup', world.addPlayer.bind(world));
emitter.on('playerTurnStart', interpreter.interpretAction.bind(interpreter));
emitter.on('playerAction', world.act.bind(world));
emitter.on('move', world.move.bind(world));
emitter.on('turnEnd', interpreter.display.bind(interpreter));

fs.readdir(programsDir, setupAndStartLoop);