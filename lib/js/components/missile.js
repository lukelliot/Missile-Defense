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
    this.color = options.color;
    this.trailColor = options.trailColor;
    this.status = STATUS.LIVE;
  }

  // Render Handlers

  render(enemyMissiles, ctx) {
    switch (this.status) {
      case 'DETONATED':
        return;
      case 'LIVE':
        this.renderLiveMissile(ctx);
        break;
      case 'EXPLODING':
      case 'RETRACTING':
        this.renderExplodingMissile(enemyMissiles, ctx);
        break;
    }
  }

  renderLiveMissile(ctx) {
    ctx.strokeStyle = this.trailColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(this.startX, this.startY);
    ctx.lineTo(this.currentX, this.currentY);
    ctx.stroke();

    ctx.fillStyle = this.color;
    ctx.fillRect(this.currentX - 1, this.currentY - 1, this.width, this.height);
  }

  renderExplodingMissile(enemyMissiles, ctx) {
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
    this.detonateOtherMissiles(enemyMissiles, ctx);
    ctx.fill();
  }

  // Update Detonation Data

  detonate() {
    switch (this.status) {
      case 'EXPLODING':
        this.explodingRadius++;
        if (this.explodingRadius > 40) this.status = STATUS.RETRACTING;
        break;
      case 'RETRACTING':
        this.explodingRadius--;
        if (this.groundExplosion) {
          if (this.target instanceof City) {
            this.target.active = false;
          } else {
            this.target.hitPoints--;
          }
        }
        if (this.explodingRadius < 0) this.status = STATUS.DETONATED;
    }
  }

  // Helpers

  detonateOtherMissiles(enemyMissiles, ctx) {
    if (!this.groundExplosion) {
      enemyMissiles.forEach( missile => {
        if (this.isMissileInPath(missile, ctx) && missile.status === 'LIVE') {
          missile.status = STATUS.EXPLODING;
        }
      });
    }
  }

  isMissileInPath(missile, ctx) {
    return ctx.isPointInPath(missile.currentX, missile.currentY);
  }

  calculateExplosionColor() {
    if (this.explodingRadius % 2 === 0) {
      // return '#FFFF00';
      return `rgb(${Calc.rand(0, 255)}, ${Calc.rand(0, 255)}, ${Calc.rand(0, 255)})`;
    }
    else if (this.explodingRadius % 3 === 0) {
      // return '#FF8000';
      return `rgb(${Calc.rand(0, 255)}, ${Calc.rand(0, 255)}, ${Calc.rand(0, 255)})`;

    }
    else if (this.explodingRadius % 4 === 0) {
      // return '#D82C00';
      return `rgb(${Calc.rand(0, 255)}, ${Calc.rand(0, 255)}, ${Calc.rand(0, 255)})`;

    }
    else {
      // return '#f2f2f2';
      return `rgb(${Calc.rand(0, 255)}, ${Calc.rand(0, 255)}, ${Calc.rand(0, 255)})`;

    }
  }
}


module.exports = Missile;
