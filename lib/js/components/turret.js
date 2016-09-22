// Util
import Calc from '../util/calc';

class Turret {
  constructor() {
    this.x = 400;
    this.y = 560;
    this.baseX = 400;
    this.baseY = 560;
    this.missilesRemaining = 10;
    this.hitPoints = 3;
    this.active = true;
    this.angle = 0;
    this.barrel = {
      sX: -3,
      sY: -50,
      width: 6,
      height: 30
    };
    this.base = {
      sX: -7,
      sY: -20,
      width: 14,
      height: 20
    };

    this.setupMouseListener();
  }

  setupMouseListener() {
    const canvas = document.getElementById('canvas');

    canvas.onmousemove = (e) => {
      let mouseX = (e.pageX - canvas.offsetLeft) - this.x,
          mouseY = (e.pageY - canvas.offsetTop) - this.y;
      mouseY = mouseY > -20 ? -20 : mouseY;

      this.angle = Calc.atanXY(mouseX, mouseY) + Math.PI * 0.5;
    };
  }

  render(ctx) {
    if (this.active) {
      this.renderPatch(ctx);
      this.renderCannon(ctx);
    }
  }

  renderPatch(ctx) {
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 50, 0, Math.PI, true);
    ctx.fill();
    ctx.closePath();
    ctx.fillStyle = '#011238';
    ctx.fillRect(this.x - 50, this.y - 20, 100, 20);
  }

  renderCannon(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    this.renderBarrel(ctx);
    this.renderBase(ctx);

    ctx.restore();

    ctx.beginPath();
    ctx.fillStyle = 'yellow';
    ctx.arc(this.x, this.y + 10, 17, 0, Math.PI, true);
    ctx.fill();
  }

  renderBarrel(ctx) {
    const barrel = this.barrel;
    ctx.fillStyle = '#96EE89';
    ctx.fillRect(
      barrel.sX, barrel.sY,
      barrel.width, barrel.height
    );
  }

  renderBase(ctx) {
    const base = this.base;
    ctx.fillStyle = 'green';
    ctx.fillRect(
      base.sX, base.sY,
      base.width, base.height
    );
  }
}

module.exports = Turret;
