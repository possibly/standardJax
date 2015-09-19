//variables that deal with displaying information
var dBlank = createGameObject(function(){this.stats.name = '0'});

//imports
var FixedArray = require('fixed-2d-array');

function createGameObject(fn){
  var gameObj = {}
  //Required properties of an object if you want the 'world' to work.
  gameObj.stats = {};
  gameObj.stats.name = 'gameObj';
  if (typeof fn != 'undefined'){
    fn.call(gameObj, gameObj);
  }
  return gameObj;
}

function createPlayer(name){
  return createGameObject(function modify(gameObj){
    gameObj.actions = {
      move: function(modifier){
          console.log("move: "+modifier);
          return "moved!";
      },
      eat: function(modifier){
        return null;
      },
      steal: function(modifier){
        return null;
      },
      share: function(modifier){
        return null;
      },
    };

    gameObj.stats = {
      status: 'alive', // or dead
      name: name,
      vision: '2'
    };

    myWorld: undefined; // world.mask requires a location!
  });
}

function _initBoard(){
  var fa = new FixedArray(10,10,dBlank);
  return fa;
}

var world = {
  board: _initBoard(),
  players: [],
  get: function(x, y){
    return this.board.get(x,y);
  },
  put: function(x, y, gameObj){
    gameObj.stats.x = x;
    gameObj.stats.y = y;
    gameObj.stats.myWorld = world.mask(gameObj);
    this.board.set(x,y, gameObj);
    return gameObj;
  },
  remove: function(x, y){ //returns removed object.
    var clone = JSON.parse(JSON.stringify(this.board.get(x,y)));
    this.put(x,y,dBlank);
    return clone;
  },
  //this should be integrated into FixedArray at some point.
  findGameObjectByName: function(name){
    //compare only by stats.name
    var found = [];
    for(var row in this.board._grid){
      for(var col in this.board._grid[row]){
        var gameObj = this.board.get(row,col);
        if (gameObj.stats.name == name){
          found.push(gameObj);
        }
      }
    }
    return found;
  },
  addPlayer: function(file){
    //deal with a player already present on the board at
    //the starting location.
    var newPlayer = createPlayer(file);
    if (this.get(0,0).stats.name == dBlank.stats.name){
      this.put(0,0, newPlayer);
    }else{
      this.put(0,1, newPlayer);
    }
    this.players.push(newPlayer);
  },
  mask: function(gameObj){
    //return the world as the player should see it.
    gameObj.stats.vision == gameObj.stats.vision || 1;
    return this.board.getNeighbours(gameObj.stats.x, gameObj.stats.y, gameObj.stats.vision);
  }
}

var state = {
  get: function(file){
    return {
      //if there is a file, reduce world state to what the player should be able to see
      //and give them just the players stats.
      //otherwise, give them a birds eye view of the world and everyone's stats.
      world: world,
      player: world.findGameObjectByName(file)[0]
    };
  }
}

var api = function(){
  return {
    world: world,
    state: state
  }
}

module.exports = api;