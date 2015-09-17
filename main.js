var fs = require('fs');
var spawn = require('child_process').spawnSync;
var exec = require('child_process').execSync;
var worldState = {};
var playersState = {};
var playersActions = {};
// player.stdout -> validation
  // good validation -> next player
  // bad validation -> removal from list, notification to player.
// validation -> graphical display!

playersActions.move = function(modifier){
  console.log("move: "+modifier);
  return "moved!";
}

function startingPlayer(){
  return {
    health: 100,
    position: [0,0]
  };
}

function getState(file){
  //if there is a file, reduce world state to what the player should be able to see
  //otherwise, give them a birds eye view
  var playerStats = playersState[file];
  return {
    worldState,
    stats: playerStats
  };
}

function run(file){
  var result = spawn('programs/'+file, {input: JSON.stringify(getState(file))});
  // interpret program return stream as buffer
  var action = ""+result.stdout;
  // interpret that buffer as a string, prettify it
  action = action.trim().split(' ');
  var verb = action[0];
  var modifier = action[1];
  // run the program's prettified string as a function
  try {
    playersActions[verb](modifier);
  }
  catch(err){
    console.log(err);
  }
}

function setup(file){
  exec('chmod +x programs/'+file);
  playersState[file] = startingPlayer();
}

function loop(err, files){
  if (Object.keys(playersState).length < files.length){
    files.forEach(setup);
  }
  files.forEach(run);
}

fs.readdir('./programs', loop);