class Display {
  constructor(game, ctx) {
    this.ctx = ctx;
    this.game = game;
  }

  setupListeners() {
  }

  drawForeground() {
    let foregroundHeight = this.game.HEIGHT - 60;
    this.ctx.fillStyle = '#57412F';

    this.ctx.beginPath();
    this.ctx.moveTo(0, this.game.HEIGHT);
    this.ctx.lineTo(0, foregroundHeight);
    this.ctx.lineTo(this.game.WIDTH, foregroundHeight);
    this.ctx.lineTo(this.game.WIDTH, this.game.HEIGHT);
    this.ctx.closePath();
    this.ctx.fill();
    // this.game.incrementAction(timeDelta);
    // this.game.draw();
  }

  drawBackground() {
    this.ctx.clearRect(0, 0, this.game.WIDTH, this.game.HEIGHT);
    let bg = new Image();
    bg.src = '../../docs/images/night_sky.jpg';
    this.ctx.drawImage(bg, 0, 0);
  }

  animate(time) {
    const timeDelta = time - this.interimTime;

    this.drawBackground();
    this.drawForeground();
    this.interimTime = time;
    // requestAnimationFrame(this.animate.bind(this));
  }

  start() {
    this.interimTime = 0;
    // bind mouse movement

    requestAnimationFrame(this.animate.bind(this));
  }
}

module.exports = Display;
