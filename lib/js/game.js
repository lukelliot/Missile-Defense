// Constants
import GAME_STATE from './constants/game_state_constants';
import CITY_COORDINATES from './constants/city_coordinates';

// Util
import Calc from './util/calc';

// Entities
import PlayerMissile from './components/player_missile';
import Turret from './components/turret';
import City from './components/city';
import EnemyMissile from './components/enemy_missile';

class Game {
  constructor() {
    this.state = GAME_STATE.START;
    this.width = 800;
    this.height = 600;
    this.playerMissiles = [];
    this.enemyMissiles = [];
    this.cities = [];
    this.turret = new Turret();
    this.level = 1;
    this.score = {
      total: 0,
      multiplier: 0,
    };
    this.initializeStartGame();
  }

  // Listeners

  setupListeners(ui) {
    // window.cancelAnimationFrame(ui.animationId);

    let canvas = document.getElementById('canvas');
    canvas.onclick = () => {
      // NOTE check 'this', make sure it's Game
      this.startLevel(ui);
      canvas.onclick = (e) => {
        this.fireTurret(
          e.pageX - canvas.offsetLeft,
          e.pageY - canvas.offsetTop
        );
      };
    };
  }

  // Render Handlers

  renderBackground(ctx) {
    // let bg = new Image();
    // bg.src = '../../docs/images/night_sky.jpg';
    // bg.width = 800;
    // bg.height = 600;
    // ctx.drawImage(bg, 0, 0);
    ctx.fillStyle = '#011238';
    ctx.fillRect(0, 0, 800, 600);
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

  renderAllCities(ctx) {
    this.cities.forEach( city => {
      if (city.active) {
        city.render(ctx);
      }
    });
  }

  renderAllEnemyMissiles(ctx) {
    this.enemyMissiles.forEach( enemyMissile => {
      enemyMissile.render(this.enemyMissiles, ctx);
    });
  }

  renderAllPlayerMissiles(ctx){
    this.playerMissiles.forEach( playerMissile => {
      playerMissile.render(this.enemyMissiles, ctx);
    });
  }

  renderGameState(ctx) {
    ctx.clearRect(0, 0, this.width, this.height);
    this.renderBackground(ctx);
    this.renderForeground(ctx);
    this.renderBattery(ctx);
    this.renderAllCities(ctx);
    //this.renderScore
  }

  renderAllEntities(ctx) {
    this.renderAllCities(ctx);
    this.renderAllEnemyMissiles(ctx);
    this.renderAllPlayerMissiles(ctx);
  }

  renderNewLevel(ctx) {
    this.renderGameState(ctx);
    // render level message
  }

  renderNextFrame(ctx) {
    this.renderGameState(ctx);
    this.updateAllEntities();
    this.renderAllEntities(ctx);
    // Check End Level
  }

  render(ui, ctx) {
    switch (this.state) {
      case GAME_STATE.START:
        this.initializeNewLevel(ctx);
        this.setupListeners(ui);
        break;
      case GAME_STATE.PLAY:
        this.renderNextFrame(ctx);
        break;
    }
  }

  // Update Entities

  updateAllEntities() {
    this.enemyMissiles.forEach( m => m.update());
    this.cities.filter( city => {
      return city.active ? true : false;
    });
    this.playerMissiles.forEach( playerMissile => {
      playerMissile.update();
    });
  }

  // Initializers

  initializeStartGame() {
    this.createCities();
  }

  initializeNewLevel(ctx) {
    this.turret.missilesRemaining = 15;
    this.playerMissiles = [];
    this.enemyMissiles = [];

    this.createEnemyMissiles();
    this.renderNewLevel(ctx);
  }

  startLevel(ui){
    this.state = GAME_STATE.PLAY;
  }

  // Entity Creation

  createEnemyMissiles() {
    let targets = this.getRandomTargets(),
        numOfMissiles = this.level * 2 + 6;

    for (let n = 0; n < numOfMissiles; n++ ) {
      this.add(
        new EnemyMissile(targets, this.level)
      );
    }
  }

  createCities() {
    CITY_COORDINATES.forEach( coords => {
      this.add(
        new City(coords.x, coords.y)
      );
    });
  }


  fireTurret(x, y) {
    if (y <= 510) {
      if (this.turret.missilesRemaining > 0) {
        this.add(
          new PlayerMissile(this.turret, x, y)
        );
      }
    }
  }

  // Helpers

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

  setupNextLevel() {

  }

  citiesRemaining() {
    return this.cities.length;
  }

  getRandomTargets() {
    if (this.cities.length + 1 <= 3) {
      return [this.turret].concat(this.cities);
    }
    else {
      let randomCities = [],
          random,
          i = 0;

      while (i < 3) {
        random = Calc.rand(0, this.cities.length - 1);

        if (!randomCities.includes(this.cities[random])) {
          randomCities.push(this.cities[random]);
          i++;
        }
      }

      return [this.turret].concat(randomCities);
    }
  }

  allEntities() {
    // return [this.turret].concat(
    return [].concat(
      this.playerMissiles,
      this.enemyMissiles,
      this.cities
    );
  }
}

module.exports = Game;
