function Player(name){
  return {
    status: 'alive', // or dead
    name: name,
    vision: '2',
    speed: '1',
    apples: 0
  }
}

module.exports = Player;