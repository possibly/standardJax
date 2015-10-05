var FixedArray = require('fixed-2d-array');

var World = function World(){
  var board = new FixedArray(10,10,0)
  this._board = board;
  this._players = [];
}

World.prototype.get = function get(row,col){
  return this._board.get(row,col);
}

World.prototype.put = function put(row, col, gameObj){
  gameObj.row = row;
  gameObj.col = col;
  this._board.set(row, col, gameObj);
  this._players.forEach(function(player){
    player.myWorld = this.mask(player)
  }, this);
}

World.prototype.remove = function remove(row, col){
  this.put(row,col, 0);
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

World.prototype.collision = function collision(newCoords){
  try {
    this._board.validateCoords(newCoords[0], newCoords[1]);
  }catch(err){
    return true;
  }

  if (this.get(newCoords[0], newCoords[1]) === 0){
    return false;
  }else{
    return true;
  }
}

// Player representation

World.prototype._createPlayer = function(name){
  var player = {}
  player.status = 'alive';
  player.name = name;
  player.vision = '2';
  player.speed = '1';
  player.apples = 0;

  player.move = function(action){
    if (action[1] == 'left')  { return [this.row, this.col-this.speed]; }
    if (action[1] == 'up')    { return [this.row-this.speed, this.col]; }
    if (action[1] == 'right') { return [this.row, this.col+this.speed]; }
    if (action[1] == 'down')  { return [this.row+this.speed, this.col]; }
  }

  player.getPosition = function(){
    return [this.row, this.col];
  }

  return player;
}

World.prototype.getPlayer = function(playerName){
  var playerList = this._players.filter(function(player){
    if (player.name === playerName){ return true; }
    else { return false; }
  });
  return playerList[0];
}

World.prototype.addPlayer = function addPlayer(file){
  var newPlayer = this._createPlayer(file);
  
  var row = Math.floor((Math.random() * this._board.getWidth()) + 1);
  var col = Math.floor((Math.random() * this._board.getHeight()) + 1);
  if (this.collision([row, col])){
    this.addPlayer(file);
  }else{
    this.put(row, col, newPlayer);
    this._players.push(newPlayer);
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