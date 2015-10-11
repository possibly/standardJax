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

  player.toString = function(){
    var representation = {};
    representation.status = player.status;
    representation.name = name;
    representation.vision = this.vision;
    representation.speed = this.speed;
    representation.apples = this.apples;
    representation.row = this.row;
    representation.col = this.col;
    representation.myWorld = this.myWorld;
    return representation;    
  }

  return player;
}

module.exports = createPlayer;