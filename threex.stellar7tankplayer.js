var THREEx	= THREEx	|| {}

THREEx.Stellar7TankPlayer	= function(){
	this.id		= THREEx.Stellar7TankPlayer.id++

	// add EventDispatcher in this object
	THREE.EventDispatcher.prototype.apply(this)

	// internal render function
	var onRenderFcts= []
	this.update	= function(delta, now){
		onRenderFcts.forEach(function(onRenderFct){
			onRenderFct(delta, now)
		})
	}
	
	
	//////////////////////////////////////////////////////////////////////////////////
	//		model								//
	//////////////////////////////////////////////////////////////////////////////////

	var model	= new THREEx.Stellar7TankModel()
	this.model	= model

	//////////////////////////////////////////////////////////////////////////////////
	//		controls							//
	//////////////////////////////////////////////////////////////////////////////////

	var tankControls= new THREEx.Stellar7TankControls(model)
	onRenderFcts.push(function(delta, now){
		tankControls.update(delta, now)
	})
		
	// TODO this should not be duplicated
	// - maybe THREEx.Stellar7TankPlayer.createKeyboardControls with a better name
	// var keyboard	= new THREEx.KeyboardState()

	// var controls	= new THREEx.Stellar7TankControlsKeyboard(keyboard, tankControls)
	// this.controls	= controls
	// onRenderFcts.push(function(delta, now){
	// 	controls.update(delta, now)
	// })
	// controls.addEventListener('fire', function(){
	// 	this.dispatchEvent({ type: 'fire' })
	// }.bind(this))

	// var controlsQueue	= new THREEx.Stellar7TankControlsQueue(tankControls)
	// for(var i = 0; i < 30; i++){
	// 	controlsQueue.push('turnRight', 1).push('moveAhead', 1)		
	// }
	// onRenderFcts.push(function(delta, now){
	// 	controlsQueue.update(delta, now)
	// })

	var controls	= null;
	this.setControlsKeyboard	= function(){
		// TODO this should not be duplicated
		// - maybe THREEx.Stellar7TankPlayer.createKeyboardControls with a better name
		var keyboard	= new THREEx.KeyboardState()

		controls	= new THREEx.Stellar7TankControlsKeyboard(keyboard, tankControls)
		this.controls	= controls
		onRenderFcts.push(function(delta, now){
			controls.update(delta, now)
		})

		controls.addEventListener('fire', function(){
			this.dispatchEvent({ type: 'fire' })
		}.bind(this))
		return this
	}
	this.setControlsQueue	= function(){
		controls	= new THREEx.Stellar7TankControlsQueue(tankControls)
		this.controls	= controls
		onRenderFcts.push(function(delta, now){
			controls.update(delta, now)
		})
		controls.addEventListener('idle', function(){
			controls.push('turnRight', 1)
				.push('moveAhead', 1)		
		})
		return this
	}

	//////////////////////////////////////////////////////////////////////////////////
	//		comment								//
	//////////////////////////////////////////////////////////////////////////////////

	this.onMapCollision	= function(){
		console.log('mapCollision')
	}
	this.onTankCollision	= function(){}
	this.onShootCollision	= function(){}
	this.onHitByShoot	= function(){}
}

THREEx.Stellar7TankPlayer.id	= 0

THREEx.Stellar7TankPlayer.createKeyboard	= function(){
	var player	= new THREEx.Stellar7TankPlayer()
	// TODO this should not be duplicated
	// - maybe THREEx.Stellar7TankPlayer.createKeyboardControls with a better name
	var keyboard	= new THREEx.KeyboardState()

	var controls	= new THREEx.Stellar7TankControlsKeyboard(keyboard, player.tankControls)
	player.controls	= controls
	onRenderFcts.push(function(delta, now){
		controls.update(delta, now)
	})
	controls.addEventListener('fire', function(){
		player.dispatchEvent({ type: 'fire' })
	})
	return player
}