var FixedArray = require('fixed-2d-array');
var createPlayer = require('./Player.js');

var World = function World(){
  var board = new FixedArray(10,10,0);
  this._board = board;
  this._players = {};
}

World.prototype.get = function get(row,col){
  return this._board.get(row,col);
}

World.prototype.put = function put(row, col, gameObj){
  gameObj.row = row;
  gameObj.col = col;
  this._board.set(row, col, gameObj);
  for (p in this._players){
    var player = this._players[p];
    player.myWorld = this.mask(player);
  }
}

World.prototype.remove = function remove(row, col){
  this.put(row,col, 0);
}

World.prototype.collision = function collision(newCoords){
  try {
    this._board.validateCoords(newCoords[0], newCoords[1]);
    //expand the board!
  }catch(err){
    return true;
  }

  if (this.get(newCoords[0], newCoords[1]) === 0){
    return false;
  }else{
    return true;
  }
}

World.prototype.exchangeApples = function exchangeApples(action, otherAction){
  if (action.raw[0] === 'steal' && otherAction.raw[0] === 'steal'){
    action.player.apples -= 1;
    otherAction.player.apples -= 1;
  }
  else if (action.raw[0] === 'steal' && otherAction.raw[0] === 'share'){
    action.player.apples += 8;
    otherAction.player.apples -= 2;
  }
  else if (action.raw[0] === 'share' && otherAction.raw[0] === 'steal'){
    action.player.apples -= 2;
    otherAction.player.apples += 8;
  }
  else if (action.raw[0] === 'share' && otherAction.raw[0] === 'share'){
    action.player.apples += 1;
    otherAction.player.apples += 1;
  }
}

World.prototype.move = function move(action){
  var oldCoords = action.player.getPosition();
  var newCoords = action.player.move(action);
  if (!this.collision(newCoords)){
    this.remove(oldCoords[0], oldCoords[1]);
    this.put(newCoords[0], newCoords[1], action.player);
    console.log(action.player.name+' '+action.raw+' successfully.');
  }
  else {
    throw new Error(action.player.name+" can not "+action.raw+" since something is in the way or its the edge of the board.");
  }
}

World.prototype.decide = function decide(action){
  var otherAction = action.otherAction;
  if (!action.player.canSee(otherAction.player.name)){
    throw new Error(action.raw+' did not work since '+action.player.name+' could not see '+otherAction.player.name);
  }else{
    if (action.player.hasEnoughApples(action, otherAction) && otherAction.player.hasEnoughApples(otherAction, action)){
      this.exchangeApples(action, otherAction);
    }else{
      throw new Error(action.raw+' did not work since both players did not have enough apples.');
    }
  }
}

// Player representation

World.prototype.getPlayer = function(playerName){
  for (p in this._players){
    if (p === playerName){
      return this._players[p];
    }
  }
  
}

World.prototype.addPlayer = function addPlayer(file){
  var newPlayer = createPlayer(file);
  
  var row = Math.floor((Math.random() * this._board.getWidth()) + 1);
  var col = Math.floor((Math.random() * this._board.getHeight()) + 1);
  if (this.collision([row, col])){
    this.addPlayer(file);
  }else{
    this.put(row, col, newPlayer);
    this._players[newPlayer.name] = newPlayer;
  }
}

World.prototype.mask = function mask(gameObj){
  //return the world as the player should see it.
  var neighbours = this._board.getNeighbours(gameObj.row, gameObj.col, gameObj.vision);
  //hide the stats of other players.
  neighbours.forEach(function(value, index){
    if (value.name !== undefined){
      neighbours[index] = value.name;
    }
  });

  return neighbours;
}

module.exports = World;