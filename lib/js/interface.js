class Interface {
  constructor(game, ctx) {
    this.ctx = ctx;
    this.game = game;
  }

  setupListeners() {

  }

  animate(time) {
    const timeDelta = time - this.interim;
    this.game.render(this.ctx);
    this.interim = time;
    // requestAnimationFrame(this.animate.bind(this));
  }

  execute() {
    this.interim = 0;
    // bind mouse movement

    requestAnimationFrame(this.animate.bind(this));
  }
}

module.exports = Interface;
