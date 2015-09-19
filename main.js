var fs = require('fs');
var spawn = require('child_process').spawnSync;
var exec = require('child_process').execSync;
var api = require('./api.js')();

function   run(file){
  var state = api.state.get(file);
  var result = spawn('programs/'+file, {input: JSON.stringify(state)});
  var action = convertStringToAction(""+result.stdout);
  var verb = action['verb'];
  var modifier = action['modifier'];
  try {
    api.world.findGameObjectByName(file)[0].actions[verb](modifier);
  }
  catch(err){
    console.log(err);
    console.log('Errors here are from malformed actions by players.');
  }
}

function convertStringToAction(string){
  string = string.trim().split(' ');
  var verb = string[0];
  var modifier = string[1];
  return {verb: verb, modifier: modifier};
}

function setup(file){
  exec('chmod +x programs/'+file);
  api.world.addPlayer(file);
}

function loop(err, files){
  if (api.world.players.length < files.length){
    files.forEach(setup);
  }
  files.forEach(run);
}

fs.readdir('./programs', loop);