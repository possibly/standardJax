const sjcore = require('standardjax-core');
const reader = require('./lib/reader.js');

const programsDir = '/programs/';
var playerPaths = [];
var rounds = 1;
var turns = 4;
var turnIndex = 0;

reader.getPaths( process.cwd()+programsDir, setup );

function setup( paths ){
  playerPaths = paths;
  setupPlayers( playerPaths );
  setupWorld();

  loop();
}

function loop(){
  while ( rounds ){

    var pName = reader.getName( playerPaths[turnIndex] );
    var pInput = reader.read( playerPaths[turnIndex], getPlayerKnowledge( pName, 'decide' ) );
    try {
      var state = sjcore.trigger( pName, pInput.toString().trim() );
      if ( state.moreInput ){
        var targetPath = playerPaths.find( p => reader.getName(p) === state.moreInput.target);
        var targetName = reader.getName( targetPath );
        var targetInput = reader.read( targetPath, getPlayerKnowledge( targetName, 'exchange' ) );
        var targetState = sjcore.trigger( targetName, targetInput.toString().trim() );
        if ( !targetState.hasOwnProperty('exchange') ){ sjcore.setComponent( targetName, 'exchange', ['steal', pName] ); }
        // TODO: Revert player state to previous state if they did not send an "exchange" action.
      }
    }catch(err) {
      console.log(err);
    }

    turns-=1;
    turnIndex+=1;

    if ( turns === 0 ){
      rounds-=1;
      turns = playerPaths.length;
      render();
    }

  }
}

function setupWorld(){
  sjcore.addEntity('tree');
}

function setupPlayers( playerPaths ){
  for (path in playerPaths){
    sjcore.addEntity( reader.getName( playerPaths[path] ) );
  }
}

function getPlayerKnowledge( pName, action ){
  var knowledge = {};
  knowledge.action = action;
  knowledge.info = sjcore.getComponents(pName);
  knowledge.info.surroundings = sjcore.getSurroundings( pName );
  return knowledge;
}

function render(){
  console.log(sjcore.tick());
  console.log('Notice that thief and another stole from one another.');
  console.log('Notice that poop failed.');
  /*TODO: other stuff to display whats going on in the game world. */
}