var THREEx	= THREEx	|| {}

/**
 * controls the tank with the keyboard
 */
THREEx.Stellar7TankControlsVirtualJoystick	= function(tankControls){
	//////////////////////////////////////////////////////////////////////////////////
	//		joystickFire							//
	//////////////////////////////////////////////////////////////////////////////////
	

	// one on the right of the screen
	var joystickFire	= new VirtualJoystick({
		container	: document.body,
		strokeStyle	: 'orange',
		limitStickTravel: true,
		stickRadius	: 0		
	});
	joystickFire.addEventListener('touchStartValidation', function(event){
		var touch	= event.changedTouches[0];
		if( touch.pageX >= window.innerWidth/2 )	return false;
		return true
	});


	joystickFire.addEventListener('touchStart', function(){
		var inputs	= tankControls.inputs
		inputs.fire	= true
	})


	//////////////////////////////////////////////////////////////////////////////////
	//		joystickMove							//
	//////////////////////////////////////////////////////////////////////////////////
	
	var joystickMove	= new VirtualJoystick({
		container	: document.body,
		strokeStyle	: 'cyan',
	});
	joystickMove.addEventListener('touchStartValidation', function(event){
		var touch	= event.changedTouches[0];
		if( touch.pageX < window.innerWidth/2 )	return false;
		return true
	});
	
	this.update	= function(delta, now){
		var inputs	= tankControls.inputs
		inputs.turnLeft	= joystickMove.left()
		inputs.turnRight= joystickMove.right()
		inputs.moveAhead= joystickMove.up()
		inputs.moveBack	= joystickMove.down()

		// inputs.gunLeft	= keyboard.pressed('q')
		// inputs.gunRight	= keyboard.pressed('e')
	}
}