class Interface {
  constructor(game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.animationId = null;
  }

  animate(time) {
    this.game.render(this.ctx, this.animationId);
    this.animationId =
      window.requestAnimationFrame(this.animate.bind(this));
  }

  execute() {
    this.animationId =
      window.requestAnimationFrame(this.animate.bind(this));
  }
}

module.exports = Interface;
