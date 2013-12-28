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
	//		collision							//
	//////////////////////////////////////////////////////////////////////////////////
	
	var collisionSphere	= new THREE.Sphere(model.object3d.position, 0.5)
	this.collisionSphere	= collisionSphere
	
	// visible debug for collisionSphere
	if( false ){
		var geometry	= new THREE.SphereGeometry( collisionSphere.radius, 32, 16 );
		var material	= new THREE.MeshBasicMaterial({wireframe: true});
		var mesh	= new THREE.Mesh( geometry, material );
		model.object3d.add( mesh );		
	}

	if( false ){
		var geometry	= new THREE.Geometry()
		geometry.vertices.push( new THREE.Vector3( 0, 0, 0) )
		geometry.vertices.push( new THREE.Vector3( 0, 0, +100) )
		var material	= new THREE.LineBasicMaterial({
			color		: 'red',
			linewidth	: 1,
		})
		var line	= new THREE.Line( geometry, material)
		model.cannonMesh.add(line)		
	}


	//////////////////////////////////////////////////////////////////////////////////
	//		controls							//
	//////////////////////////////////////////////////////////////////////////////////

	var tankControls	= new THREEx.Stellar7TankControls(model)
	this.tankControls	= tankControls
	onRenderFcts.push(function(delta, now){
		tankControls.update(delta, now)
	})

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
		return this
	}

	//////////////////////////////////////////////////////////////////////////////////
	//		comment								//
	//////////////////////////////////////////////////////////////////////////////////

	this.onMapCollision	= function(){
		console.log('mapCollision')
	}
	this.onTankCollision	= function(event){}
	this.onScannedTank	= function(event){
		this.dispatchEvent({ type: 'fire' })		
	}
	this.onHitByBullet	= function(){
		console.log('onHitByShoot')
	}
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