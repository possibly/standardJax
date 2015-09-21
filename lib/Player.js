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
  try{
    this[action.verb](action.modifier);
  } catch (err){
    console.log('Action: '+JSON.stringify(action)+' cannot be done to Player');
  }
}

Player.prototype.move = function move(modifier){
  this.emitter.emit('move', modifier, this);
}

module.exports = Player;