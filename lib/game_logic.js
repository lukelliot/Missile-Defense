// this will be the game class that holds all of the objects on the board
// it will add or remove entities when they're destroyed
// getter for all objects
// check collissions by iterating over all objects and checking isCollidedWith()
// draw() method that clears the rect, fills the background, and re-renders each object
//  with their updated coordinates
// moveObjects() will call move on all objects by a 'delta' specified in an argument.

class GameLogic {
  constructor() {
    this.missiles = [];
    
  }
}

GameLogic.DIM_X = 1280;
GameLogic.DIM_Y = 720;
GameLogic.NUM_MISSILES = 10;
GameLogic.BACKGROUND_COLOR = '#FFFFFF';
