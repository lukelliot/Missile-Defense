// this will be the game class that holds all of the objects on the board
// it will add or remove entities when they're destroyed
// getter for all objects
// check collissions by iterating over all objects and checking isCollidedWith()
// draw() method that clears the rect, fills the background, and re-renders each object
//  with their updated coordinates
// moveObjects() will call move on all objects by a 'delta' specified in an argument.
import City from './components/city';

class Game {
  constructor() {
    this.width = 800;
    this.height = 600;
    this.playerMissiles = [];
    this.enemyMissiles = [];
    this.cities = [];
    // this.turrent = new Turret();
    this.score = {
      total: 0,
      multiplier: 0,
    };

    this.initializeCities();
  }

  // Render Handlers

  renderBackground(ctx) {
    let bg = new Image();
    bg.src = '../../docs/images/night_sky.jpg';
    bg.width = 800;
    bg.height = 600;
    ctx.drawImage(bg, 0, 0);
  }

  renderForeground(ctx) {
    ctx.fillStyle = '#57412F';
    ctx.beginPath();
    ctx.moveTo(0, this.height);
    ctx.lineTo(0, 540);
    ctx.lineTo(this.width, 540);
    ctx.lineTo(this.width, this.height);
    ctx.closePath();
    ctx.fill();
  }

  renderBattery(ctx) {
    ctx.fillStyle = '#B9B8B4';
    ctx.beginPath();
    ctx.moveTo(370, 560);
    ctx.lineTo(380, 520);
    ctx.lineTo(420, 520);
    ctx.lineTo(430, 560);
    ctx.closePath();
    ctx.fill();
  }

  renderAllEntities(ctx) {
    this.allEntities().forEach( entity => {
      entity.render(ctx);
    });
  }

  render(ctx) {
    ctx.clearRect(0, 0, this.width, this.height);
    this.renderBackground(ctx);
    this.renderForeground(ctx);
    this.renderBattery(ctx);
    this.renderAllEntities(ctx);
  }

  // Helpers

  add(obj) {
    switch (obj.constructor) {
      // case PlayerMissile:
      //   this.playerMissiles.push(obj);
      //   break;
      // case EnemyMissile:
      //   this.enemyMissiles.push(obj);
      //   break;
      case City:
        this.cities.push(obj);
        break;
    }
  }

  initializeCities() {
    Game.CITY_COORDINATES.forEach( coords => {
      this.add(
        new City(coords.x, coords.y)
      );
    });
  }

  playerMissilesRemaining() {
    return this.playerMissiles.length;
  }

  citiesRemaining() {
    return this.cities.length;
  }

  allEntities() {
    // return [this.turret].concat(
    return [].concat(
      this.playerMissiles,
      this.enemyMissiles,
      this.cities
    );
  }

  checkCollision() {

  }
}

Game.CITY_COORDINATES = [
  { x: 80, y: 570},
  { x: 180, y: 585},
  { x: 280, y: 565},
  { x: 520, y: 565},
  { x: 620, y: 585},
  { x: 720, y: 570}
];
module.exports = Game;
