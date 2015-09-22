var util = require('util');
var EventEmitter = require('events').EventEmitter;
var copy = require('shallow-copy');

var Interpreter = function Interpreter(emitter){
  this.emitter = emitter;
};

Interpreter.prototype._toAction = function _toAction(string){
  var action = string.trim().split(' ');
  var verb = action[0];
  var modifier = action[1];
  return {verb: verb, modifier: modifier};
};

Interpreter.prototype.interpretAction = function interpretAction(file, string){
  var action = this._toAction(string);
  this.emitter.emit('playerAction', file, action);
};

Interpreter.prototype.interpretPlayer = function interpretPlayer(player){
  var model = {};
  model = copy(player.stats);
  model.myWorld = copy(player.stats.myWorld);
  // console.log(model.myWorld);
  model.myWorld.forEach(function(val,index,array){
    if ( array[index] == 0 ){ return 'this is a 0!'; }
    else { array[index] = array[index].stats.name; }
  });
  return JSON.stringify(model);
};

module.exports = Interpreter;