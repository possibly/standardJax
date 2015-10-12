var twoD = require('2d-array');

function createPlayer(name){
  var player = {}
  player.status = 'alive';
  player.name = name;
  player.vision = '2';
  player.speed = '1';
  player.apples = 0;
  player.path = process.cwd()+'/programs/'+name;

  player.move = function(action){
    var newCoords = [];
    if (action.raw[1] == 'left')  { newCoords = [this.row, this.col-this.speed]; }
    else if (action.raw[1] == 'up')    { newCoords = [this.row-this.speed, this.col]; }
    else if (action.raw[1] == 'right') { newCoords = [this.row, this.col+this.speed]; }
    else if (action.raw[1] == 'down')  { newCoords = [this.row+this.speed, this.col]; }
    return newCoords;
  }

  player.getPosition = function(){
    return [this.row, this.col];
  }

  player.hasEnoughApples = function(myAction, otherAction){
    if (myAction.raw[0] === 'steal' && otherAction.raw[0] === 'steal'){
      if (this.apples > 1){ return true; }
      else{ return false; }
    }
    else if (myAction.raw[0] === 'share' && otherAction.raw[0] === 'steal'){
      if (this.apples > 8){ return true; }
      else{ return false; }
    }
    else{ return true; }
  }

  player.canSee = function(gameObjName){
    var filteredMyWorld = this.myWorld.filter(function(gameObj){
      if (gameObj === gameObjName){
        return true;
      }else{ return false; }
    });
    if (filteredMyWorld[0] === gameObjName){
      return true;
    }else{
      return false;
    }
  }

  player._toTwoD = function(myWorld){
    //bending backwards since fixed-2d-array returns a 1d array of neighbours,
    //and I want players to have a 2d array of their masked myWorld.
    var numRows = (player.row + Number(player.vision)) - (player.row - player.vision) + 1;
    myWorld.splice( (myWorld.length/2), 0, player.name );
    return twoD(myWorld, numRows);
  }

  player.toString = function(){
    var representation = {};
    representation.status = player.status;
    representation.name = name;
    representation.vision = player.vision;
    representation.speed = player.speed;
    representation.apples = player.apples;
    representation.row = player.row;
    representation.col = player.col;
    representation.myWorld = player._toTwoD(player.myWorld.slice());
    return representation;    
  }

  return player;
}

module.exports = createPlayer;