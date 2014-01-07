var THREEx	= THREEx	|| {}

/**
 * controls the tank with the keyboard
 */
THREEx.Stellar7TankControlsQueue	= function(tankControls){

	// add EventDispatcher in this object
	THREE.EventDispatcher.prototype.apply(this)

	var commands	= []; 

	//////////////////////////////////////////////////////////////////////////////////
	//		comment								//
	//////////////////////////////////////////////////////////////////////////////////
	
	this.fire	= function(){
		tankControls['fire']()
	}

	this.push	= function(action, duration){
		console.assert(legitActions.indexOf(action) !== -1)
		commands.push({
			action	: action,
			duration: duration
		})
		return this
	}
	
	//////////////////////////////////////////////////////////////////////////////////
	//		comment								//
	//////////////////////////////////////////////////////////////////////////////////
	
	var stopActions	= {
		'turnRight'	: 'turnStop',
		'turnLeft'	: 'turnStop',
		'turnStop'	: 'turnStop',
		'moveAhead'	: 'moveStop',
		'moveBack'	: 'moveStop',
		'moveStop'	: 'moveStop',
		'gunRight'	: 'gunStop',
		'gunLeft'	: 'gunStop',
		'gunStop'	: 'gunStop',
	}
	var legitActions= Object.keys(stopActions)
	
	var timerId	= null
	var runNextCommand	= function(){
		// get the next command
		var command	= commands.pop()
		// if there is no next command
		if( command === undefined ){
			// notify onIdle event
			this.dispatchEvent({ type: 'idle' })
			// after that if commands.length > 0 then runNextCommand again
			if( commands.length > 0 )	runNextCommand()
			return
		}
		// clear timer if needed
		if( timerId ){	
			clearTimeout(timerId)
			timerId	= null
		}
		// run the command
		tankControls[command.action]()
		// launch the timer to stop execution
		timerId		= setTimeout(function(){
			var stopAction	= stopActions[command.action]
			tankControls[stopAction]()			
			runNextCommand()
		}, command.duration*1000)
	}.bind(this)
	
	this.update	= function(delta, now){
		if( timerId === null )	runNextCommand()			
	}
}