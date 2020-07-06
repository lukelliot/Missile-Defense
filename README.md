# Missile Defense!
### [Play Missile Defense][3]
![Start][2]

Missile Defense is a clone of the Atari 2600 classic: [Missile Command][1].

### How to Play
  Take control of of the turret and protect your cities! Shoot your missiles at the incoming enemy missiles to destroy them.

  You get 75pts for each enemy missile your destroy. Chain detonations to increase your combo multiplier. It resets when you fire the turret again.

  * First Missile Destroyed = 75pts
  * Second Missile Destroyed = 150pts
  * Third Missile Destroyed = 225pts
  * etc...

  Any surviving cities are worth 300pts at the end of the level.
  Each of your missiles remaining is worth 100pts at the end of the round.

  If your turret is hit it is deactivated for the remainder of the level and you will lose your missile bonus. 
  
  If the enemy missiles manage to destroy all of your cities, you lose!

  ![Gameplay][4]


## Features

### Architecture

##### Classes
  * `City`
  * `EnemyMissile`
  * `Missile`
  * `PlayerMissile`
  * `Turret`

The `Game` class handles the logic and holds the state of the game between levels. Classes are responsible for holding onto their own state, e.g. `turret.missilesRemaining`.

`Missile` is a parent class from which both `EnemyMissile` and `PlayerMissile` inherit, shared code is DRYed: handling detonations and blast radius, handling render based upon constructor inputs for color coordinates, etc.

All code adheres to the single purpose principle leading to 'dumb' classes, allowing the Game class to handle interaction between entities. Collisions are checked by using `CanvasRendering2dContext.isPointInPath()`.

  Missile Defense's animation is handled by `window.requestAnimationFrame()` which optimizes the frame rate, giving the user smooth gameplay. It is recursively called, saving the current timer Id as an instance variable in the class `Interface`.

Turret rotation is handled by function found in `Calc` module utilizing the `Math.atan2` method to find the angle of the mouse relative to the x axis. A `mouseover` listener is used to render `ctx.rotate`. The turret will disappear when destroyed.


### TODO!

#### Timed Powerups using `requestAnimationFrame`'s timer
  * Invincibility for your turret
  * Larger detonation radius
  * Unlimited missiles

#### User Accounts for Saving Scores
  * Postgresql database
  * User SignIn/Logout

#### React Frontend Components for Handling Leaderboard
  * SPA leaderboard
  * Various sorting for scores; top ten, all times, etc.








  [1]: https://en.wikipedia.org/wiki/Missile_Command
  [2]: ./docs/images/main.png
  [3]: https://www.missile-defense.com
  [4]: ./docs/images/gameplay.png
