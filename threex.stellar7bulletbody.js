var THREEx	= THREEx	|| {}

THREEx.Stellar7BulletBody	= function(){
	// add EventDispatcher in this object
	THREE.EventDispatcher.prototype.apply(this)
	// internal render function
	var onRenderFcts= []
	this.update	= function(delta, now){
		onRenderFcts.forEach(function(onRenderFct){
			onRenderFct(delta, now)
		})
	}
	// the tankBody who originated this shoot
	this.fromPlayer	= null;
	
	this.die	= function(){
		// notify onIdle event
		this.dispatchEvent({ type: 'die' })		
	}

	// get the model
	var model	= new THREEx.Stellar7BulletModel()
	this.model	= model

	// Attach a light to the model	
	var lightPool	= Stellar7.lightPool
	if( lightPool.hasPointLight() ){
		var light	= lightPool.getPointLight('white', 4)
		// var light	= new THREE.PointLight('red', 15, 20)

		model.object3d.add(light)
		this.addEventListener('die', function(){
			lightPool.putPointLight(light)
		})
	}
	
	//////////////////////////////////////////////////////////////////////////////////
	//		collision							//
	//////////////////////////////////////////////////////////////////////////////////
	
	var collisionSphere	= new THREE.Sphere(model.object3d.position, 0.20)
	this.collisionSphere	= collisionSphere
	
	// visible debug for collisionSphere
	if( false ){
		var geometry	= new THREE.SphereGeometry( collisionSphere.radius, 32, 16 );
		var material	= new THREE.MeshBasicMaterial({wireframe: true});
		var mesh	= new THREE.Mesh( geometry, material );
		model.object3d.add( mesh );		
	}

	//////////////////////////////////////////////////////////////////////////////////
	//		physics								//
	//////////////////////////////////////////////////////////////////////////////////
	var velocity	= new THREE.Vector3()
	this.velocity	= velocity
	var tmpVector	= new THREE.Vector3()
	onRenderFcts.push(function(delta, now){
		tmpVector.copy(velocity).multiplyScalar(delta)
		model.object3d.position.add(tmpVector)
	})
}

/**
 * create a shoot as if it were originated by this tank
 */
THREEx.Stellar7BulletBody.fromPlayer	= function(tankBody){
	var tankModel	= tankBody.model;
	// create object
	var shoot	= new THREEx.Stellar7BulletBody()
	shoot.fromPlayer= tankBody
	// get position of cannon
	var object3d	= tankModel.cannonMesh
	object3d.updateMatrixWorld()
	var worldMatrix	= object3d.matrixWorld
	var position	= new THREE.Vector3().getPositionFromMatrix(worldMatrix)
	// setup position
	shoot.model.object3d.position.copy(position)
	// setup velocity
	var velocity	= new THREE.Vector3(0, 0, 10);
	var rotationY	= tankModel.baseMesh.rotation.y + tankModel.cannonMesh.rotation.y
	var matrix	= new THREE.Matrix4().makeRotationY(rotationY)
	velocity.applyMatrix4( matrix );
	shoot.velocity.copy(velocity)
	// return just built shoot
	return shoot
}



