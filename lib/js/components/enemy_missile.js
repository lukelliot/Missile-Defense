import Missile from './missile';
import STATUS from '../constants/missile_status';
import Calc from '../util/calc';

class EnemyMissile extends Missile {
  constructor(targets, lvl) {
    let target = targets[Calc.rand(0, targets.length - 1)];
    options = {
      startX: Calc.rand(0, 800),
      startY: 0,
      endX: target.x,
      endY: target.y,
      trailColor: 'red',
      color: 'yellow'
    };
    super(options);

    let frames = Calc.framesToTarget(lvl);
    this.target = target;
    this.velX = (this.endX - this.startX) / frames;
    this.velY = (this.endY - this.startY) / frames;
    this.delay = Calc.rand(0, 50 + lvl * 20);
    this.groundExplosion = false;
  }

  update() {
    if (this.delay) {
      this.delay--;
      return;
    }
    else if (this.status === 'LIVE') {
      if (this.y >= this.endY) {
        this.x = this.endX;
        this.y = this.endY;
        this.status = STATUS.EXPLODING;
        this.groundExplosion = true;
      }
      else {
        this.x += this.velX;
        this.y += this.velY;
      }
    }
    else {
      this.explode();
    }
  }
}

module.exports = EnemyMissile;
