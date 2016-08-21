import Vector from '../util/vector';

class Missile {
  constructor(options) {
    this.startX = options.startX;
    this.startY = options.startY;
    this.endX = options.endX;
    this.endY = options.endY;
    this.currentX = options.startX;
    this.currentY = options.startY;
    this.explodingRadius = 0;
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
        renderLiveMissile(ctx);
        break;
      case 'EXPLODING':
      case 'RETRACTING':
        renderExplodingMissile(enemyMissiles, ctx);
        break;
    }
  }

  renderLiveMissile(ctx) {
    ctx.strokStyle = this.trailColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.startX, this.startY);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();

    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - 1, this.y - 1, this.width, this.height);
  }

  renderExplodingMissile(enemyMissiles, ctx) {
    ctx.fillStyle = calculateExplosionColor();
    ctx.beginPath();
    ctx.arc(
      this.x,
      this.y,
      this.explodingRadius,
      0,
      2 * Math.PI
    );
    this.detonateOtherMissiles(enemyMissiles, ctx);
    ctx.closePath();
  }

  // Update Detonation Data

  detonate() {
    switch (this.status) {
      case 'EXPLODING':
        this.explodingRadius++;
        if (this.explodingRadius > 30) this.status = STATUS.RETRACTING;
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
        if (isMissileInPath(missile, ctx) && missile.status === 'LIVE') {
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

// Constants

const STATUS = {
  LIVE: 'LIVE',
  EXPLODING: 'EXPLODING',
  RETRACTING: 'RETRACTING',
  DETONATED: 'DETONATED'
};
