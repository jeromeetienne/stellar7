var THREEx	= THREEx	|| {}

THREEx.Stellar7TankBody	= function(){
	this.id		= THREEx.Stellar7TankBody.id++
	this.maxEnergy	= 1000;
	this.lives	= 1;
	this.energy	= this.maxEnergy;

	// add EventDispatcher in this object
	THREE.EventDispatcher.prototype.apply(this)

	// internal render function
	var onRenderFcts= []
	this.update	= function(delta, now){
		onRenderFcts.forEach(function(onRenderFct){
			onRenderFct(delta, now)
		})
	}

	this.score	= 0
	
	//////////////////////////////////////////////////////////////////////////////////
	//		model								//
	//////////////////////////////////////////////////////////////////////////////////

	var model	= new THREEx.Stellar7TankModel()
	this.model	= model
	this.turretAngleY	= function(){
		return model.baseMesh.rotation.y + model.cannonMesh.rotation.y
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
		console.log('mapCollision')
		this.dispatchEvent({ type: 'mapCollision' })
	}
	this.onTankCollision	= function(event){
		this.dispatchEvent({ type: 'tankCollision' })				
	}
	this.onScannedTank	= function(event){
		// console.log('onScannedTank')
		this.dispatchEvent({ type: 'scannedTank' })
	}
	this.onHitByBullet	= function(){
		this.energy	-= 250
		if( this.energy < 0 ){
			this.lives	+= -1
			if( this.lives < 0 ){
				this.dispatchEvent({ type: 'reallyDead' })
				this.energy	= 0;
			}else{
				this.dispatchEvent({ type: 'dead' })
				this.energy	= this.maxEnergy;			
			}
		}
		this.dispatchEvent({ type: 'hitByBullet' })
	}
}

THREEx.Stellar7TankBody.id	= 0
