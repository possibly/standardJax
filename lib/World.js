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
  gameObj.stats.x = x;
  gameObj.stats.y = y;
  gameObj.stats.myWorld = this.mask(gameObj);
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
      else if (gameObj.stats.name == name){
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
    this.put(2,2, newPlayer);
  }else{
    this.put(3,3, newPlayer);
  }
}

World.prototype.mask = function mask(gameObj){
  //return the world as the player should see it.
  gameObj.stats.vision == gameObj.stats.vision || 1;
  return this._board.getNeighbours(gameObj.stats.x, gameObj.stats.y, gameObj.stats.vision);
}

World.prototype.move = function move(modifier, gameObj){
  //needs collision resolution.
  var newx = undefined;
  var newy = undefined;
  var oldx = gameObj.stats.x;
  var oldy = gameObj.stats.y;

  if (modifier == 'left'){  newx = oldx-1;  newy = oldy; }
  if (modifier == 'up'){    newx = oldx;    newy = old-1; }
  if (modifier == 'right'){ newx = oldx+1;  newy = oldy; }
  if (modifier == 'down'){  newx = oldx;    newy = oldy+1; }

  this.remove(oldx, oldy);
  this.put(newx,newy,gameObj);
}

module.exports = World;