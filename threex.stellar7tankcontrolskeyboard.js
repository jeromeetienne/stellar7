var THREEx	= THREEx	|| {}

/**
 * controls the tank with the keyboard
 */
THREEx.Stellar7TankControlsKeyboard	= function(keyboard, tankControls){

	// add EventDispatcher in this object
	THREE.EventDispatcher.prototype.apply(this)

	
	this.update	= function(delta, now){
		var inputs	= tankControls.inputs
		inputs.turnLeft	= keyboard.pressed('a')	|| keyboard.pressed('left')
		inputs.turnRight= keyboard.pressed('d')	|| keyboard.pressed('right')
		inputs.moveAhead= keyboard.pressed('w')	|| keyboard.pressed('up')
		inputs.moveBack	= keyboard.pressed('s') || keyboard.pressed('down')

		inputs.gunLeft	= keyboard.pressed('q')
		inputs.gunRight	= keyboard.pressed('e')
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