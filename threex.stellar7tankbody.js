var THREEx	= THREEx	|| {}

THREEx.Stellar7TankBody	= function(){
	this.id		= THREEx.Stellar7TankBody.id++

	//////////////////////////////////////////////////////////////////////////////////
	//		comment								//
	//////////////////////////////////////////////////////////////////////////////////
	
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
	//		comment								//
	//////////////////////////////////////////////////////////////////////////////////
	
	this.maxLives	= 3
	this.lives	= this.maxLives
	this.isAlive	= function(){
		return this.lives >= 0
	}

	this.maxEnergy	= 1000
	this.energy	= this.maxEnergy

	this.score	= 0
	
	//////////////////////////////////////////////////////////////////////////////////
	//		model								//
	//////////////////////////////////////////////////////////////////////////////////

	var model	= new THREEx.Stellar7TankModel()
	this.model	= model
	this.turretAngleY	= function(){
		return model.baseMesh.rotation.y + model.cannonMesh.rotation.y
	}
	
	this.resetPosition	= function(map){
		var object3d	= model.object3d
		var angle	= Math.random()*Math.PI*2
		var radius	= Math.random()*(map.radius - collisionSphere.radius)
		object3d.position.x	= Math.cos(angle)*radius
		object3d.position.z	= Math.sin(angle)*radius
		
		model.cannonMesh.rotation.y	= 0
		model.baseMesh.rotation.y	= Math.random()*Math.PI*2
	}

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
	tankControls.addEventListener('fire', function(){
		this.dispatchEvent({ type: 'fire' })
	}.bind(this))

	var controls	= null;
	this.isLocalPlayer	= function(){
		var isKeyboard	= controls instanceof THREEx.Stellar7TankControlsKeyboard
		return isKeyboard ? true : false
	}
	this.setControlsKeyboard	= function(){
		// TODO this should not be duplicated
		// - maybe THREEx.Stellar7TankBody.createKeyboardControls with a better name
		var keyboard	= new THREEx.KeyboardState()

		controls	= new THREEx.Stellar7TankControlsKeyboard(keyboard, tankControls)
		this.controls	= controls
		onRenderFcts.push(function(delta, now){
			controls.update(delta, now)
		})

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
		this.dispatchEvent({ type: 'mapCollision', data: event })
	}
	this.onTankCollision	= function(event){
		this.dispatchEvent({ type: 'tankCollision', data: event })	
	}
	this.onScannedTank	= function(event){
		// console.log('onScannedTank')
		this.dispatchEvent({ type: 'scannedTank', data: event  })
	}
	this.onHitByBullet	= function(event){
		this.energy	-= 250
		if( this.energy <= 0 ){
			this.lives	+= -1
			if( this.lives < 0 ){
				this.dispatchEvent({ type: 'reallyDead' })
				this.energy	= 0;
			}else{
				this.dispatchEvent({ type: 'dead' })
				this.energy	= this.maxEnergy;			
			}
		}
		this.dispatchEvent({ type: 'hitByBullet', data: event })
	}
}

THREEx.Stellar7TankBody.id	= 0
