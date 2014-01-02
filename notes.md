TODO
====
* DONE make the map circle 
* DONE all collision are done with boundaryRadius
  * it is present everywhere
* to rename Shoot into Bullet
* to rename shoot.js into ShootBody.js
  * rename tankPlayer into tankBody

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
