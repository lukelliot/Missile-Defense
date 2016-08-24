import Calc from '../util/calc';
import Missile from './missile';
import STATUS from '../constants/missile_status';

class PlayerMissile extends Missile {
  constructor(turret, endX, endY) {
    super({
      startX: turret.x,
      startY: turret.y,
      endX: endX,
      endY: endY,
      trailColor: 'green',
      color: 'blue'
    });
    let xDistance = this.endX - this.startX,
        yDistance = this.endY - this.startY,
        distance = Calc.distance(
          [this.endX, this.endY],
          [this.startX, this.startY]
        );

    this.velX = xDistance / (distance / 20);
    this.velY = yDistance / (distance / 20);
    turret.missilesRemaining--;
  }

  update() {
    if (this.status === 'LIVE') {
      if (this.currentY <= this.endY) {
        this.currentY = this.endY;
        this.currentX = this.endX;
        this.status = STATUS.EXPLODING;
      }
      else {
        this.currentX += this.velX;
        this.currentY += this.velY;
      }
    }
    else {
      this.detonate();
    }
  }
}

module.exports = PlayerMissile;
