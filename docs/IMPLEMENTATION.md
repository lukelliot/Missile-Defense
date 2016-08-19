# Missile Defense
This JavaScript game is intended to emulate the Atari 2600 game Missile Command, with some some new modern features
## Architecture
1) I imagine this will be mostly vanilla JS using CanvasJS as an animator.
2) Components
    * Turret/projectiles
    * Bases
    * Incoming missile graphics
    * Explosion graphics
    * Score Keeper
      * Number of missiles destroyed
      * Number of missiles launched
      * Number of bases protected
      * Number of projectiles fire

## Wireframes
![missile-defense](./images/gameplay.jpg)

## Backend

I suspect that I can write the entire game without any backend and keep all of the data on the frontend

## Implementation
### Day 1
1) Create Utility functions for vector math
2) Create inherited MovingObjects class
3) Create classes for:
    * missiles
    * bases
    * projectiles

### Day 2
Integrate classes with Canvas, get game working with basic functions, no gameplay yet
### Day 3
Implement game rules and style appropriately
