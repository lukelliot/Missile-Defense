import GameLogic from './game_logic';
import Display from './display';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('canvas');
  canvas.width = GameLogic.DIM_X;
  canvas.height = GameLogic.DIM_Y;

  const ctx = canvas.getContext('2d');
  // const game = new Game();
  // new Display(game, ctx).start();
});
