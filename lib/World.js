var FixedArray = require('fixed-2d-array');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Player = require('./Player.js');

//communication with player

var World = function World(emitter, name, boardWidth, boardHeight){
  _boardWidth = boardWidth || 10;
  _boardHeight = boardHeight || 10;
  this._board = _initBoard(_boardWidth,_boardHeight);
  this.name = name || 'World';
  this.emitter = emitter;
}

function _initBoard(width,height){
  var fa = new FixedArray(width,height,0);
  return fa;
}

World.prototype.act = function act(file, action){
  var player = this.find(file)[0];
  player.act(action);
}

World.prototype.get = function get(x,y){
  return this._board.get(x,y);
}

World.prototype.put = function put(x, y, gameObj){
  if (gameObj == 0){ return 0; }
  gameObj.x = x;
  gameObj.y = y;
  gameObj.myWorld = this.mask(gameObj);
  this._board.set(x,y, gameObj);
}

World.prototype.remove = function remove(x, y){ //returns removed object.
  // var clone = JSON.parse(JSON.stringify(this._board.get(x,y)));
  this._board.set(x,y, 0);
  // return clone;
}

//Returns an array.
World.prototype.find = function find(name){
  //compare only by stats.name
  var found = [];
  for(var row in this._board._grid){
    for(var col in this._board._grid[row]){
      var gameObj = this._board.get(row,col);
      if (gameObj == 0){ continue; }
      else if (gameObj.name == name){
        found.push(gameObj);
      }
    }
  }
  return found;
}

World.prototype.addPlayer = function addPlayer(file){
  var newPlayer = new Player(this.emitter, file);
  
  //needs collision resolution.
  if (this.get(2,2) == 0){
    this.put(2,2, newPlayer); //another.js
  }else if (this.get(2,2) != 0 && this.get(3,3) == 0){
    this.put(3,3, newPlayer); //poop.js
  }else if (this.get(3,3) != 0){
    this.put(2,0, newPlayer); //thief.js
  }
}

World.prototype.mask = function mask(gameObj){
  //return the world as the player should see it.
  gameObj.vision == gameObj.vision || 1;
  return this._board.getNeighbours(gameObj.x, gameObj.y, gameObj.vision);
}

World.prototype.move = function move(action, gameObj){
  //needs collision resolution.
  var newx = undefined;
  var newy = undefined;
  var oldx = gameObj.x;
  var oldy = gameObj.y;

  if (action[1] == 'left'){  newx = oldx-1;  newy = oldy; }
  if (action[1] == 'up'){    newx = oldx;    newy = old-1; }
  if (action[1] == 'right'){ newx = oldx+1;  newy = oldy; }
  if (action[1] == 'down'){  newx = oldx;    newy = oldy+1; }

  this.remove(oldx, oldy);
  this.put(newx,newy,gameObj);
  this.emitter.emit('turnEnd', gameObj, 'succeeded');
}

World.prototype.areNeighbors = function areNeighbors(){
  return true;
}

World.prototype.playerCommunicateAction = function playerCommunicateAction(currentPlayerAction, currentPlayer, targetPlayerAction, targetPlayer){
  //Check if currentPlayer and targetPlayer are actually neighbors
  if (!this.areNeighbors(currentPlayer, targetPlayer)){ 
    this.emitter.emit('turnEnd', currentPlayer, 'failed.');
    return 0;
  }
  else if (currentPlayerAction[0] == 'steal' || currentPlayerAction[0] == 'share'){ 
    this.stealOrShare(currentPlayerAction, currentPlayer, targetPlayerAction, targetPlayer); 
  }
}

World.prototype.stealOrShare = function stealOrShare(currentPlayerAction, currentPlayer, targetPlayerAction, targetPlayer){
  if (targetPlayerAction[0] != 'steal' && targetPlayerAction[0] != 'share'){ 
    //target player has no logic for this action. :(
    //best defensive strategy is to steal?
    targetPlayerAction[0] = 'steal';
  }

  if (currentPlayerAction[0] == 'steal' && targetPlayerAction[0] == 'steal'){
    currentPlayer.apples -= 1;
    targetPlayer.apples -= 1;
  }
  else if (currentPlayerAction[0] == 'steal' && targetPlayerAction[0] == 'share'){ 
    currentPlayer.apples += 6;
    targetPlayer.apples -= 2;
  }
  else if (currentPlayerAction[0] == 'share' && targetPlayerAction[0] == 'steal'){ 
    currentPlayer.apples -= 2;
    targetPlayer.apples += 6;
  }
  else if (currentPlayerAction[0] == 'share' && targetPlayerAction[0] == 'share'){ 
    currentPlayer.apples += 1;
    targetPlayer.apples += 1;
  }

  this.emitter.emit('turnEnd', currentPlayer, 'succeeded');
}

module.exports = World;