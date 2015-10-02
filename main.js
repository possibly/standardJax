//my modules
var World = require('./lib/World.js');
var world = new World();

//node modules
var execFileSync = require('child_process').execFileSync;
var execSync = require('child_process').execSync;

//third party modules
var concat = require('concat-stream');
var Rounds = require('rounds-emitter');
var rounds = new Rounds();
var readdir = require('readdir-stream');
var through2 = require('through2');
var fromArray = require('stream-from-array');
var split = require('split');

var programsDir = './programs/';

function getPlayerName(path){
  return path.split('/')[path.split('/').length-1];
}

rounds.on('setup', function(){
  readdir(programsDir)
    .pipe(through2.obj(function preparePrograms(chunk,_,next){
      if (chunk.path === programsDir){ return next(); }
      chunk = './'+chunk.path;
      execSync('chmod +x '+chunk);
      var playerName = getPlayerName(chunk);
      world.addPlayer(playerName);
      this.push([chunk]);
      next();
    }))
    .pipe(concat(function(data){ 
      rounds.next(data) 
    }));
});

rounds.on('roundStart', function(round, args){
  rounds.next(args[0]);
})

rounds.on('turnStart', function(round, turn, args){
  var playerList = args[0];
  fromArray(playerList)
  .pipe(through2(function(playerPath,_,next){
    var playerName = getPlayerName(playerPath.toString());
    var player = world.find(playerName)[0];
    var playerOutput = execFileSync(playerPath.toString(), [], { input: JSON.stringify(player) });
    world.act(playerOutput, player);
    console.log(JSON.stringify(player));
    next()
  }));
})

rounds.next();