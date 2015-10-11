function createTree(name){
  var tree = {};
  tree.name = 'tree';
  tree.apples = Math.round( Math.random() * 100 );

  tree.giveApples = function(player){
    if (this.apples >= 1){
      player.apples += 1;
      this.apples--;
    }else{
      throw new Error('This tree has no more apples.');
    }
  }

  return tree;
}

module.exports = createTree;