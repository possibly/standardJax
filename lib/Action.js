function createAction(){
  var a = new Action();
  return a;
}

function Action(){
}

Action.prototype.perform = function(thisArg){
  if (this.otherAction !== undefined){
    this.fn.bind(thisArg)(this, this.otherAction);
  }
  else{
    this.fn.bind(thisArg)(this);
  }
  this.otherAction = undefined;
};

module.exports = createAction;