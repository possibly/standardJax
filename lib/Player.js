var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Player = function Player(emitter, name){
  this.stats = {
    status: 'alive', // or dead
    name: name,
    vision: '2',
    speed: '1',
  };

  this.emitter = emitter;
}

Player.prototype.act = function act(action){
  if (action.verb == 'move'){ this.emitter.emit('move', action.modifier, this); }
  else{
    console.log('Action: '+JSON.stringify(action)+' cannot be done by '+this.stats.name);
  }
  this.emitter.emit('turnEnd', this);
}

module.exports = Player;