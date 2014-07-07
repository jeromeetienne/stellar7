Refactoring
===========
* Trying to copy http://tanks.moka.co/ controls
  * nice camera controls
  * nice player controls
  * nice way to display the energy of the tanks
    - currently not even visible for enemy
    - visible for player if you read it below the score
* maybe doing a multiplayer, linked with twitter

### Description of the player controls
* if up arrow is pressed and not going up, turn toward up of the screen
  - and so on for up/down/left/right arrows
* the cannon is pointed toward the mouse
  - the mouse position is projected on the ground
  - the cannon of the player's tank is pointing toward this position

#### About coding the cannon controls with the mouse
* threex.stellar7tankcannoncontrols.js
* needs the camera and the ground plane to get the mouse position
* q. do i really need to have those 2 levels controls ?
  - dont forget you got the bots tanks and the controls for mobile too

### Description of the camera controls
* the camera is a fixed offset relative to the player position
* additionaly there is a slight delta based on the current mouse position
  - so the camera is between the player itself and the mouse position
* ```cameraBasePosition = playerPosition + (mousePosition-playerPosition)/4```
* ```cameraPosition = cameraBasePosition - new THREE.Vector3(0,4,4)```

=================================================================

TODO
====
* put 1 enemy only
* work on UI cinematic for all stage
* then work on fightcode 
  * with event notification
* later put a fightcode system in webworker
* publish that in chrome store


Finite State Automata
=====================
* keep it as simple as possible

### Attempts

* gameInitialisation
  * When the game actually begin.
  * not between lives in a given game
  * goto spawnPlayer
* playerSpawned
  * put the player in the game
  * enable controls
* playerKilled
  * triggered when a given player live is out
  * cinematic of explosion
* gameCompleted(result)
  * display 'You Win!' or 'You Lose!' depending on result
  * goto homepage

### Analysis

* Not consistent in which part of the code send the event
* reducing numbers of events by using parameters seems definitly good

Misc
====
* fightcode - how to do the security ?
  * how a bot can't know more than he should
  * likely a barrier webworker

* in battlefield4, the mission "south china - get back to the valkyrie" is a LOT like a tank.
  * im thinking about copying this for stellar7 clone :)
  * video http://www.youtube.com/watch?v=ZmLtTWx6srk#t=437

* sounds
  * http://www.freesound.org/people/qubodup/sounds/200303/ for tank engine
  * for shoot detonation http://www.freesound.org/people/qubodup/sounds/187676/
  * for shoot/wall collision http://www.freesound.org/people/BigKahuna360/sounds/160421/


* DONE handle energy + life in tankbody
  * same die system as bullet
* DONE what happen when tankbody die ?
  * respawn ? gameover ?
* DONE add a skymap of star 
* DONE make the map circle 
* DONE all collision are done with boundaryRadius
  * it is present everywhere
* DONE to rename Shoot into Bullet
* DONE to rename shoot.js into ShootBody.js
  * rename tankPlayer into tankBody

What about code orga
====================
* THREEx.Stellar7.TankModel
* THREEx.Stellar7.TankControls
  * may be bots controlled - fightcode like
  * THREEx.Stellar7.TankControlsKeyboard
* THREEx.Stellar7.TankControlsQueue
  * actions are queued, executed for a amount of time and idle event is thrown
  * based on fightCodeControls
* THREEx.Stellar7.TankCameraControls
* THREEx.Stellar7.TankPlayer
  * include Model, Controls, life
  * onTankCollision
  * onWallCollision
  * onScannedRobot
  * onHitByBullet
* THREEx.Stellar7.Shoot
  * contains the model and the controls
  * THREEx.Stellar7.Shoot.fromTank
* THREEx.Stellar7.Map
* THREEx.Stellar7.Game 
  * all the players
  * all the shoots
  * loop: update all players, all shoots, handle events
