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

// Player representation

World.prototype._createPlayer = function(name){
  var player = {}
  player.status = 'alive';
  player.name = name;
  player.vision = '2';
  player.speed = '1';
  player.apples = 0;

  player.move = function(action, fn){
    var newRow = undefined;
    var newCol = undefined;
    if (action[1] == 'left')  { newRow = this.row; newCol = this.col-this.speed; }
    if (action[1] == 'up')    { newRow = this.row-this.speed; newCol = this.col; }
    if (action[1] == 'right') { newRow = this.row; newCol = this.col+this.speed; }
    if (action[1] == 'down')  { newRow = this.row+this.speed; newCol = this.col; }
    fn(newRow, newCol);
  }

  this._players.push(player);
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
  var neighbours = this._board.getNeighbours(gameObj.row, gameObj.col, gameObj.vision);
  //hide the stats of other players.
  neighbours.forEach(function(value, index){
    if (value.name !== undefined){
      neighbours[index] = value.name;
    }
  });

  return neighbours;
}

// Actions & Interpreting player input.

World.prototype.act = function act(action, gameObj){
  try{
    this[action[0]](action, gameObj);
  }catch(err){
    console.log(err);
    // console.log('Action: '+action+' is not a valid action for '+gameObj.name);
  }
}

World.prototype.move = function move(action, gameObj){
  //needs collision resolution.
  gameObj.move(action, function(newRow, newCol){
    this.remove(gameObj.row, gameObj.col);
    this.put(newRow, newCol, gameObj);
  }.bind(this));
}

module.exports = World;