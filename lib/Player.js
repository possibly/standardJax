var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Player = function Player(emitter, name){
  this.status = 'alive', // or dead
  this.name = name,
  this.vision = '2',
  this.speed = '1',
  this.emitter = emitter;
}

Player.prototype.act = function act(action){
  var success = 'succeeded';
  if (action[0] == 'move'){ this.emitter.emit('move', action, this); }
  else{
    console.log(JSON.stringify(action)+' cannot be done by '+this.name);
    success = 'failed';
  }
  this.emitter.emit('turnEnd', this, success);
}

module.exports = Player;