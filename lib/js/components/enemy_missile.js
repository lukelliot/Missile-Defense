import Missile from './missile';
import STATUS from '../constants/missile_status';
import Calc from '../util/calc';

class EnemyMissile extends Missile {
  constructor(targets, lvl, id) {
    let target = targets[Calc.rand(0, targets.length - 1)],
        startX = Calc.rand(0, 2) ===
                  0 ? Calc.rand(0, 200) :
                  1 ? Calc.rand(300, 500) :
                      Calc.rand(600, 800);
    super({
      startX: Calc.rand(0, 800),
      startY: -2,
      endX: target.x,
      endY: target.y,
    });

    let frames = Calc.framesToTarget(lvl);
    this.target = target;
    this.velX = (this.endX - this.startX) / frames;
    this.velY = (this.endY - this.startY) / frames;
    this.delay = Calc.rand(0, lvl * 100);
    this.id = id;
    this.groundExplosion = false;
  }

  update() {
    if (this.delay) {
      this.delay--;
      return;
    }
    else if (this.status === 'LIVE') {
      if (this.currentY >= this.endY) {
        this.status = STATUS.EXPLODING;
        this.currentX = this.endX;
        this.currentY = this.endY;
        this.groundExplosion = true;
        this.target.active = false;
        if (this.target.missilesRemaining) {
          this.target.missilesRemaining = 0;
        }
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

module.exports = EnemyMissile;
