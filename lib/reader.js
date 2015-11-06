const execFileSync = require('child_process').execFileSync;
const execSync = require('child_process').execSync;
const fs = require('fs');

function Reader(){}

Reader.prototype.read = function( dir, input ){
  return execFileSync(dir, [], { input: JSON.stringify(input) });
}

Reader.prototype.getPaths = function( directory, cb ){
  fs.readdir(directory, function(err, files){
    var paths = files.map( file => directory+file );
    paths.forEach( path => execSync('chmod +x '+path) );
    cb( paths );
  });
}

Reader.prototype.getName = function(path){
  return path.split('/')[path.split('/').length-1];
}

module.exports = new Reader();