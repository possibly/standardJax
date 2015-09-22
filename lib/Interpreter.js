var util = require('util');
var EventEmitter = require('events').EventEmitter;
var copy = require('shallow-copy');

var Interpreter = function Interpreter(emitter){
  this.emitter = emitter;
};

Interpreter.prototype._toAction = function _toAction(string){
  var action = string.trim().split(' ');
  return action;
};

Interpreter.prototype.interpretAction = function interpretAction(file, string){
  var action = this._toAction(string);
  this.emitter.emit('playerAction', file, action);
};

Interpreter.prototype.interpretPlayer = function interpretPlayer(player){
  var model = {};
  model = copy(player);
  delete model.emitter;
  
  model.myWorld = copy(player.myWorld);
  model.myWorld.forEach(function(val,index,array){
    if ( array[index] == 0 ){ return 'this is a 0!'; }
    else { array[index] = array[index].name; }
  });
  return JSON.stringify(model);
};

Interpreter.prototype.getPlayerName = function(player){
  return player.name;
}

module.exports = Interpreter;