import Game from './game';
import Interface from './interface';

window.addEventListener('load', () => {
  const game = new Game();
  const canvas = document.getElementById('canvas');

  canvas.width = game.width;
  canvas.height = game.height;

  const ctx = canvas.getContext('2d');
  new Interface(game, ctx).execute();
});
