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

playersActions.move = function(){
  console.log("moved!");
  return "moved!";
}

function goodTurn(oldstate, newstate){
  //run a diff between oldstate and newstate, check game rules.
  var diff = jsdiff.diffJson(oldstate,newstate);
  diff.forEach(function(part){
    console.log(part.added);
  });
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
    playerState: playerStats
  };
}

function play(file){
  var result = spawn('programs/'+file, {input: JSON.stringify(getState(file))});
  // interpret program return stream as buffer
  var action = ""+result.stdout;
  // interpret that buffer as a string, prettify it
  action = action.trim();
  // run the program's prettified string as an action.
  try {
    playersActions[action]();
  }
  catch(err){
    console.log(err);
  }
}

function setup(file){
  exec('chmod +x programs/'+file);
  playersState[file] = startingPlayer();
  // console.dir(playersState);
}

function fileHandler(err, files){
  // console.log(files);
  files.forEach(setup);
  files.forEach(play);
}

fs.readdir('./programs', fileHandler);