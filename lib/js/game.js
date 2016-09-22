// Constants
import GAME_STATE from './constants/game_state_constants';
import STATUS from './constants/missile_status';
import CITY_COORDINATES from './constants/city_coordinates';

// Util
import Calc from './util/calc';

// Components
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
    this.strobe = true;
    this.score = {
      total: 0,
      comboMultiplier: 1,
      gameover: false
    };

    this.initializeCities();
    this.setupLevelListeners();
  }

  // Listeners

  setupLevelListeners() {
    const canvas = document.getElementById('canvas');
    canvas.onclick = () => {
      this.startLevel();

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
    canvas.onclick = () => this.resetGame();
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
    ctx.fillStyle = '#455867';
    ctx.beginPath();
    ctx.moveTo(350, 580);
    ctx.lineTo(360, 565);
    ctx.lineTo(440, 565);
    ctx.lineTo(450, 580);
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

  renderLivePlayerMissiles(ctx) {
    this.playerMissiles.forEach( playerMissile => {
      if (playerMissile.status === STATUS.LIVE) {
        playerMissile.render(
          this.score,
          this.enemyMissiles,
          ctx
        );
      }
    });
  }

  renderDetonatedPlayerMissiles(ctx) {
    this.playerMissiles.forEach( playerMissile => {
      switch (playerMissile.status) {
        case STATUS.EXPLODING:
        case STATUS.RETRACTING:
          playerMissile.render(
            this.score,
            this.enemyMissiles,
            ctx
          );
      }
    });
  }

  renderAllPlayerMissiles(ctx) {
    this.playerMissiles.forEach( playerMissile => {
      playerMissile.render(
        this.score,
        this.enemyMissiles,
        ctx
      );
    });
  }

  renderGameState(ctx) {
    ctx.clearRect(0, 0, this.width, this.height);
    this.renderBackground(ctx);
    this.renderForeground(ctx);
    this.renderAllCities(ctx);
  }

  renderNewLevel(ctx) {
    this.renderGameState(ctx);
    this.turret.render(ctx);
    this.renderBattery(ctx);
    if (this.state === GAME_STATE.START) {
      this.renderStartMessage(ctx);
    } else {
      this.renderLevelUpMessage(ctx);
    }
  }

  renderNextFrame(ctx) {
    this.updateAllMissiles();
    this.renderGameState(ctx);
    this.renderLivePlayerMissiles(ctx);
    this.turret.render(ctx);
    this.renderBattery(ctx);
    this.renderDetonatedPlayerMissiles(ctx);
    this.renderAllEnemyMissiles(ctx);
    this.renderHUD(ctx);
    this.checkEndLevel();
  }

  renderEndGame(ctx) {
    this.updateAllMissiles();
    this.renderGameState(ctx);
    this.renderAllPlayerMissiles(ctx);
    this.renderAllEnemyMissiles(ctx);
    this.renderEndGameMessage(ctx);
  }

  renderHUD(ctx) {
    ctx.fillStyle = 'gray';
    ctx.font = '11px PressStart';
    ctx.textAlign = 'left';

    ctx.fillText(`LEVEL: ${this.level}`, 30, 200);
    ctx.fillText(`SCORE: ${this.score.total}`, 30, 220);

    if (this.turret.missilesRemaining > 0) {
      ctx.fillText(
        `MISSILES x ${this.turret.missilesRemaining}`,
        30,
        240
      );
    }
    else {
      ctx.textAlign = 'center';
      ctx.fillStyle = this.strobe === true ? 'white' : 'red';
      this.toggle();
      ctx.globalCompositeOperation = 'difference';
      ctx.font = '20px PressStart';
      ctx.fillText(
        'Out of Missiles!',
        Calc.rand(399, 401),
        Calc.rand(399, 401)
      );
      ctx.globalCompositeOperation = 'source-over';
    }
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

    ctx.font = '12px PressStart';
    ctx.fillText('click to', 400, 75);
    ctx.font = '36px PressStart';
    ctx.fillText(`START LEVEL ${this.level}`, 400, 150);
    ctx.font = '36px PressStart';
    ctx.fillText(`> SCORE ${this.score.total} <`, 400, 250);
    ctx.font = '12px PressStart';
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
      this.score.total += 50;
    }
  }

  render(ctx) {
    switch (this.state) {
      case GAME_STATE.START:
        this.renderNewLevel(ctx);
        break;
      case GAME_STATE.PLAY:
        this.renderNextFrame(ctx);
        break;
      case GAME_STATE.LEVEL_UP:
        this.renderScoreTicker();
        this.renderNewLevel(ctx);
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
    this.turret.missilesRemaining += 10;
    this.turret.active = true;
    this.playerMissiles = [];
    this.enemyMissiles = [];
    if (this.level > 1) this.score.total = this.tickerScore;
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

  initializeCities() {
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
            x, y
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

      this.setupLevelListeners();
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
    this.initializeCities();
    this.score = {
      total: 0,
      comboMultiplier: 1
    };
    this.turret.missilesRemaining = 10;
    this.level = 1;
    this.setupLevelListeners();
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

  toggle() {
    this.strobe = this.strobe === true ? false : true;
    return null;
  }
}

module.exports = Game;
