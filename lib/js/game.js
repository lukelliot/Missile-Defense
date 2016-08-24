// Constants
import GAME_STATE from './constants/game_state_constants';
import STATUS from './constants/missile_status';
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
    this.destroyedEnemyMissileIds = [];
    this.score = {
      total: 0,
      comboMultiplier: 1,
      gameover: false
    };
    this.createCities();
  }

  // Listeners

  setupLevelListeners() {
    const canvas = document.getElementById('canvas');
    canvas.onclick = () => {
      this.startLevel();
      console.log(this.state);

      canvas.onclick = (e) => {
        this.fireTurret(
          e.pageX - canvas.offsetLeft,
          e.pageY - canvas.offsetTop
        );
      };
    };
  }

  setupPlayAgainListener() {
    const canvas = document.getElementById('canvas');
    canvas.onclick = () => {
      this.resetGame();
    };
  }

  // Render Handlers

  renderBackground(ctx) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 800, 600);
  }

  renderForeground(ctx) {
    ctx.fillStyle = '#011238';
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
      enemyMissile.render(
        this.score,
        this.enemyMissiles,
        ctx
      );
    });
  }

  renderAllPlayerMissiles(ctx){
    this.playerMissiles.forEach( playerMissile => {
      playerMissile.render(
        this.score,
        this.enemyMissiles,
        ctx
      );
    });
  }

  renderAllEntities(ctx) {
    this.renderAllCities(ctx);
    this.renderAllEnemyMissiles(ctx);
    this.renderAllPlayerMissiles(ctx);
  }

  renderGameState(ctx) {
    ctx.clearRect(0, 0, this.width, this.height);
    this.renderBackground(ctx);
    this.renderForeground(ctx);
    this.renderBattery(ctx);
    this.renderAllCities(ctx);
  }

  renderNewLevel(ctx) {
    this.renderGameState(ctx);
    if (this.state === GAME_STATE.START) {
      this.renderStartMessage(ctx);
    } else {
      this.renderLevelUpMessage(ctx);
    }
  }

  renderNextFrame(ctx) {
    this.renderGameState(ctx);
    this.updateAllMissiles();
    this.renderAllEntities(ctx);
    this.renderHUD(ctx);
    this.checkEndLevel();
  }

  renderEndGame(ctx) {
    this.renderGameState(ctx);
    this.updateAllMissiles();
    this.renderAllEntities(ctx);
    this.renderEndGameMessage(ctx);
  }

  renderHUD(ctx) {
    ctx.fillStyle = 'white';
    ctx.font = '14px PressStart';
    // ctx.font = '14px Arial';
    ctx.textAlign = 'left';

    // if (this.state === GAME_STATE.PLAY) {
      ctx.fillText(
        `LEVEL: ${this.level}`,
        30,
        380
      );
    // }
    ctx.fillText(
      `SCORE: ${this.score.total}`,
      30,
      400
    );
    ctx.fillText(
      `MISSILES x ${this.turret.missilesRemaining}`,
      30,
      420
    );
  }

  renderStartMessage(ctx) {
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.font = '40px PressStart';
    ctx.fillText('MISSILE DEFENSE', 400, 100);
    ctx.font = '20px PressStart';
    ctx.fillText('click to', 400, 250);
    ctx.font = '36px PressStart';
    ctx.fillText('START GAME', 400, 300);
  }

  renderLevelUpMessage(ctx) {
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    let cityText = `CITY BONUS ${this.numCitiesRemaining() * 300}`,
        missileText = `MISSILE BONUS ${this.turret.missilesRemaining * 100}`;

    ctx.font = '20px PressStart';
    ctx.fillText('click to', 400, 75);
    ctx.font = '36px PressStart';
    ctx.fillText(`START LEVEL ${this.level}`, 400, 150);
    ctx.font = '28px PressStart';
    ctx.fillText(`> SCORE ${this.score.total} <`, 400, 250);
    ctx.font = '16px PressStart';
    ctx.fillText(cityText, 400, 350);
    ctx.fillText(' + ', 400, 375);
    ctx.fillText(missileText, 400, 400);
  }

  renderEndGameMessage(ctx) {
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.font = '40px PressStart';
    ctx.fillText('GAME OVER', 400, 200);
    ctx.font = '20px PressStart';
    ctx.fillText(`Final Score: ${this.score.total}`, 400, 250);
    ctx.fillText(`Level: ${this.level}`, 400, 300);
    ctx.font = '12px PressStart';
    ctx.fillText('click to play again', 400, 350);
  }

  renderScoreTicker() {
    if (this.score.total < this.tickerScore) {
      this.score.total += 100;
    }
  }

  render(ctx) {
    switch (this.state) {
      case GAME_STATE.START:
        this.renderNewLevel(ctx);
        this.setupLevelListeners();
        break;
      case GAME_STATE.PLAY:
        this.renderNextFrame(ctx);
        break;
      case GAME_STATE.LEVEL_UP:
        this.renderScoreTicker();
        this.renderNewLevel(ctx);
        // this.renderHUD(ctx);
        this.setupLevelListeners();
        break;
      case GAME_STATE.GAME_OVER:
        this.renderEndGame(ctx);
        break;
    }
  }

  // Update Entities

  updateAllMissiles() {
    this.allMissiles().forEach( missile => {
      missile.update();
    });
  }

  // Initializers

  startLevel(){
    this.state = GAME_STATE.PLAY;
    this.turret.missilesRemaining = 20;
    this.turret.active = true;
    this.playerMissiles = [];
    this.enemyMissiles = [];
    if (this.level > 1) {
      this.score.total = this.tickerScore;
    }
    this.createEnemyMissiles();
  }

  // Entity Creation

  createEnemyMissiles() {
    let targets = this.getRandomTargets(),
        numOfMissiles = this.level * 2 + 6;

    for (let id = 1; id <= numOfMissiles; id++ ) {
      this.add(
        new EnemyMissile(targets, this.level, id)
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

  // Player Actions

  fireTurret(x, y) {
    this.score.comboMultiplier = 1;
    if (y <= 510) {
      if (this.turret.missilesRemaining > 0 && this.turret.active) {
        this.add(
          new PlayerMissile(
            this.turret,
            x,
            y
          )
        );
      }
    }
  }

  // Helpers

  add(gamePiece) {
    switch (gamePiece.constructor) {
      case PlayerMissile:
        this.playerMissiles.push(gamePiece);
        break;
      case EnemyMissile:
        this.enemyMissiles.push(gamePiece);
        break;
      case City:
        this.cities.push(gamePiece);
        break;
    }
  }

  allMissiles() {
    return this.enemyMissiles.concat(this.playerMissiles);
  }

  checkEndLevel() {
    if (this.isGameOver()) {
      this.state = GAME_STATE.GAME_OVER;
      this.score.gameover = true;
      this.setupPlayAgainListener();
    }
    else if (this.allMissilesDetonated()) {
      let missileBonus = this.turret.missilesRemaining * 100,
          cityBonus = this.numCitiesRemaining() * 300;

      this.state = GAME_STATE.LEVEL_UP;
      this.tickerScore = this.score.total + missileBonus + cityBonus;
      this.level += 1;
      console.log(this.level);
      console.log(this.state);
    }
  }

  numCitiesRemaining() {
    return this.citiesRemaining().length;
  }

  citiesRemaining() {
    let citiesRemaining = [];
    this.cities.forEach( city => {
      if (city.active) citiesRemaining.push(city);
    });
    return citiesRemaining;
  }

  isGameOver() {
    return this.turret.hitPoints === 0 || this.numCitiesRemaining() === 0;
  }

  getRandomTargets() {
    let cities = this.citiesRemaining();
    if (cities.length + 1 <= 3) {
      return [this.turret].concat(cities);
    }
    else {
      let randomCities = [],
          random,
          i = 0;

      while (i < 3) {
        random = Calc.rand(0, cities.length - 1);

        if (!randomCities.includes(cities[random])) {
          randomCities.push(cities[random]);
          i++;
        }
      }

      return [this.turret].concat(randomCities);
    }
  }

  resetGame() {
    this.state = GAME_STATE.START;
    this.destroyedEnemyMissileIds = [];
    this.createCities();
    this.score = {
      total: 0,
      comboMultiplier: 1
    };
    this.level = 1;
  }

  allMissilesDetonated() {
    const missiles = this.allMissiles();
    for (let i = 0; i < missiles.length; i++) {
      if (missiles[i].status !== STATUS.DETONATED) {
        return false;
      }
    }
    return true;
  }
}

module.exports = Game;
