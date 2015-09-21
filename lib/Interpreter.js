var util = require('util');
var EventEmitter = require('events').EventEmitter;

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

Interpreter.prototype.interpretPlayer = function interpretPlayer(playerModel){
  return JSON.stringify(playerModel);
};

Interpreter.prototype.display = function display(gameObj){
  console.log(gameObj);
};

module.exports = Interpreter;