// this will be the game class that holds all of the objects on the board
// it will add or remove entities when they're destroyed
// getter for all objects
// check collissions by iterating over all objects and checking isCollidedWith()
// draw() method that clears the rect, fills the background, and re-renders each object
//  with their updated coordinates
// moveObjects() will call move on all objects by a 'delta' specified in an argument.

class Game {
  constructor() {
    this.WIDTH = 1280;
    this.HEIGHT = 720;
    this.playerMissiles = [];
    this.enemyMissiles = [];
    this.cities = [];
  }

  add(obj) {
    switch (obj.constructor) {
      case PlayerMissile:
        this.playerMissiles.push(obj);
        break;
      case EnemyMissile:
        this.enemyMissiles.push(obj);
        break;
      case City:
        this.cities.push(obj);
        break;
    }
  }

  citiesRemaining() {
    return this.cities.length;
  }

  allEntities() {
    return [].concat(
      this.playerMissiles,
      this.enemyMissiles,
      this.cities
    );
  }

  checkCollision() {
    
  }

  draw() {
    // draws all game entities by iterating over this.allEntities()
  }
}

Game.NUM_CITIES = 6;

module.exports = Game;
