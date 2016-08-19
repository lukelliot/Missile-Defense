import Game from './game';
import Display from './display';

window.addEventListener('load', () => {
  const game = new Game();

  const canvas = document.getElementById('canvas');
  canvas.width = game.WIDTH;
  canvas.height = game.HEIGHT;
  const ctx = canvas.getContext('2d');

  new Display(game, ctx).start();
});
