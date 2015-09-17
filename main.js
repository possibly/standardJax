var fs = require('fs');
var spawn = require('child_process').spawnSync;
var exec = require('child_process').execSync;
var jsdiff = require('diff');

// player.stdout -> validation
  // good validation -> next player
  // bad validation -> removal from list, notification to player.
// validation -> graphical display!

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

function playerInfo(file){
  return startingPlayer();
}

function worldInfo(filter){
  return startingPlayer();
}

function stateInfo(file){
  return{
    player: playerInfo(),
    world: worldInfo()
  };
}

function play(file){
  // console.log("play");
  // console.log(JSON.stringify(stateInfo()));
  var result = spawn('programs/'+file, {input: JSON.stringify(stateInfo(file))});
  console.log("play: "+result.stdout);
  // goodTurn(stateInfo(file),result.stdout);
}

function setup(file){
  exec('chmod +x programs/'+file);
  // db.put(file, startingPlayer);
}

function fileHandler(err, files){
  console.log(files);
  files.forEach(setup);
  files.forEach(play);
}

fs.readdir('./programs', fileHandler);