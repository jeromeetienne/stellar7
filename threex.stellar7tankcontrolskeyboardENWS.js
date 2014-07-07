var THREEx	= THREEx	|| {}


/**
 * controls the tank with the keyboard
 */
THREEx.Stellar7TankControlsKeyboard	= function(keyboard, tankControls){
	var tank	= tankControls.tank
	var object3d	= tankControls.tank.object3d

	// add EventDispatcher in this object
	THREE.EventDispatcher.prototype.apply(this)

	this.update	= function(delta, now){
		var inputs	= tankControls.inputs
		var rotationY	= (tankControls.tank.object3d.rotation.y + Math.PI*2) % (Math.PI*2)

		inputs.turnRight= false
		inputs.turnLeft	= false
		inputs.moveAhead= false

		var pressedWest	= keyboard.pressed('a')	|| keyboard.pressed('left')
		if( pressedWest )	gotoAngle(Math.PI/2)

		var pressedEast	= keyboard.pressed('d')	|| keyboard.pressed('right')
		if( pressedEast )	gotoAngle(3*Math.PI/2)

		var pressedNorth= keyboard.pressed('w')	|| keyboard.pressed('up')
		if( pressedNorth )	gotoAngle(0)

		var pressedSouth= keyboard.pressed('s') || keyboard.pressed('down')
		if( pressedSouth )	gotoAngle(Math.PI)


		function gotoAngle(targetAngle){

			console.assert(targetAngle >= 0 && targetAngle < Math.PI*2)
			var angleY	= (object3d.rotation.y%(Math.PI*2) + Math.PI*2) % (Math.PI*2)
			console.assert(angleY >= 0 && angleY < Math.PI*2)


			if( targetAngle - angleY > +Math.PI )	targetAngle -= Math.PI*2;
			if( targetAngle - angleY < -Math.PI )	targetAngle += Math.PI*2;

			var margin	= Math.PI/32
			if( angleY - targetAngle > +margin ){
				inputs.turnRight	= true
				inputs.moveAhead	= true
			}else if( angleY - targetAngle < -margin ){
				inputs.turnLeft		= true
				inputs.moveAhead	= true
			}else {
				// NOTE: directly setting the rotation value
				object3d.rotation.y	= targetAngle
				inputs.moveAhead	= true
			}
		}

		// trick to controls - Done THREEx.Stellar7TankCannonControls
		// ;(function(){
		// 	var baseAngle	= tank.baseMesh.rotation.y
		// 	var cannonAngle	= tank.cannonMesh.rotation.y
		// 	var targetAngle	= Math.PI/2	// TODO to be determined 
		// 	tank.cannonMesh.rotation.y	= targetAngle - baseAngle
		// })()
	}



	// only on keydown + no repeat
	var wasPressed	= {};
	keyboard.domElement.addEventListener('keydown', function(event){
		if( keyboard.eventMatches(event, 'space') && !wasPressed['space'] ){
			wasPressed['space']	= true;
			var inputs	= tankControls.inputs
			inputs.fire	= true
		}
	}.bind(this))	
	// listen on keyup to maintain ```wasPressed``` array
	keyboard.domElement.addEventListener('keyup', function(event){
		if( keyboard.eventMatches(event, 'space') ){
			wasPressed['space']	= false;
		}
	})

}