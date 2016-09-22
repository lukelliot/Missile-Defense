import Calc from '../util/calc';
import STATUS from '../constants/missile_status';
import City from './city';

class Missile {
  constructor(options) {
    this.startX = options.startX;
    this.startY = options.startY;
    this.endX = options.endX;
    this.endY = options.endY;
    this.currentX = options.startX;
    this.currentY = options.startY;
    this.explodingRadius = 2;
    this.width = 2;
    this.height = 2;
    this.status = STATUS.LIVE;
  }

  // Render Handlers

  render(score, enemyMissiles, ctx) {
    switch (this.status) {
      case STATUS.DETONATED:
        return;
      case STATUS.LIVE:
        this.renderLiveMissile(ctx);
        break;
      case STATUS.EXPLODING:
      case STATUS.RETRACTING:
        this.renderExplodingMissile(score, enemyMissiles, ctx);
        break;
    }
  }

  renderLiveMissile(ctx) {
    ctx.strokeStyle = `rgb(${Calc.rand(0, 255)}, ${Calc.rand(0, 255)}, ${Calc.rand(0, 255)})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.startX, this.startY);
    ctx.lineTo(this.currentX, this.currentY);
    ctx.stroke();

    ctx.fillStyle = `rgb(${Calc.rand(0, 255)}, ${Calc.rand(0, 255)}, ${Calc.rand(0, 255)})`;
    ctx.fillRect(this.currentX - 1, this.currentY - 1, this.width, this.height);
  }

  renderExplodingMissile(score, enemyMissiles, ctx) {
    ctx.fillStyle = this.calculateExplosionColor();
    ctx.beginPath();
    ctx.arc(
      this.currentX,
      this.currentY,
      this.explodingRadius,
      0,
      2 * Math.PI
    );
    ctx.closePath();
    if (!this.groundExplosion) {
      this.detonateOtherMissiles(score, enemyMissiles, ctx);
    }
    ctx.fill();
  }

  // Update Detonation Data

  detonate() {
    switch (this.status) {
      case STATUS.EXPLODING:
        this.explodingRadius++;
        if (this.explodingRadius > 50) this.status = STATUS.RETRACTING;
        break;
      case STATUS.RETRACTING:
        this.explodingRadius--;
        if (this.explodingRadius < 0) this.status = STATUS.DETONATED;
    }
  }

  // Helpers

  detonateOtherMissiles(score, enemyMissiles, ctx) {
    enemyMissiles.forEach( missile => {
      if (this.isMissileInPath(missile, ctx) && missile.status === STATUS.LIVE && missile.currentY > 10) {
        missile.status = STATUS.EXPLODING;
        if (!score.gameover) {
          score.total += 75 * score.comboMultiplier;
          score.comboMultiplier++;
        }
      }
    });
  }

  isMissileInPath(missile, ctx) {
    return ctx.isPointInPath(missile.currentX, missile.currentY);
  }
  
  calculateExplosionColor() {
    if (this.explodingRadius % 2 === 0) {
      return '#FFFF00';
    }
    else if (this.explodingRadius % 3 === 0) {
      return '#FF8000';
    }
    else if (this.explodingRadius % 4 === 0) {
      return '#D82C00';
    }
    else {
      return '#f2f2f2';
    }
  }
}


module.exports = Missile;
