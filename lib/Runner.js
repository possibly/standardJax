var spawn = require('child_process').spawnSync;
var exec = require('child_process').execSync;
var util = require('util');

var Runner = function Runner(emitter){
  this.emitter = emitter;
};

Runner.prototype._getFileFromPath = function _getFileFromPath(path){
  var pathArray = path.split('/');
  return path.split('/')[pathArray.length - 1];
}

Runner.prototype.run = function run(path, input){
  var player = spawn(path, {input: input});
  var stdout = ""+player.stdout
  this.emitter.emit('playerTurnStart', this._getFileFromPath(path), stdout);
};

Runner.prototype.setup = function setup(path){
  exec('chmod +x '+path);
  this.emitter.emit('playerSetup', this._getFileFromPath(path));
};

module.exports = Runner;