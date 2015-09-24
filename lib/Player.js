var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Player = function Player(emitter, name){
  this.status = 'alive', // or dead
  this.name = name,
  this.vision = '2',
  this.speed = '1',
  this.apples = 0;
  this.emitter = emitter;
}

Player.prototype.act = function act(action){
  if (action[0] == 'move'){ this.emitter.emit('move', action, this); }
  else if (action[0] == 'steal' || action[0] == 'share'){ this.emitter.emit('playerCommunicate', action, this) }
  else{
    console.log(JSON.stringify(action)+' cannot be done by '+this.name);
    this.emitter.emit('turnEnd', this, 'failed');
  }
}

module.exports = Player;