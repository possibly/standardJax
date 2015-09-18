function _player(name){
  return {
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
    'status': 'alive', // or dead
    'name': name
  };
}

var world = {
  board: [
          [0,0,0],
          [0,0,0],
          [0,0,0]
        ],
  players: [],
  get: function(x,y){
    return this.board[x][y];
  },
  put: function(x,y, obj){
    obj.x = x;
    obj.y = y;
    this.board[x][y] = obj;
    return obj;
  },
  remove: function(x,y){
    return null;
  },
  find: function(file){ //returns an array!
    var found = []
    for(var row in this.board){
      for(var col in this.board[row]){
        var object = this.board[row][col];
        if (object.name == file){
          found.push(object);
        }
      }
    }
    return found;
  },
  addPlayer: function(file){
    //deal with a player already present on the board at
    //the starting location.
    var newplayer = undefined;
    if (this.get(0,0) == 0){
      newplayer = this.put(0,0, _player(file));
    }else{
      newplayer = this.put(0,1, _player(file));
    }
    this.players.push(newplayer);
  }
}

var state = {
  get: function(file){
    return {
      //if there is a file, reduce world state to what the player should be able to see
      //and give them just the players stats.
      //otherwise, give them a birds eye view of the world and everyone's stats.
      'world': world,
      'player': world.find(file)[0]
    };
  }
}

var api = function(){
  return {
    'world': world,
    'state': state
  }
}

module.exports = api;