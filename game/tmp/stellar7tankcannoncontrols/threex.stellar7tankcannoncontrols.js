var THREEx	= THREEx	|| {}

THREEx.Stellar7TankCannonControls	= function(tankControls, domElement, camera, groundMesh){
	var tank	= tankControls.tank

	// add debug
	;(function(){
		var geometry	= new THREE.CubeGeometry( 1,1,1);
		var material	= new THREE.MeshNormalMaterial();
		var impact	= new THREE.Mesh( geometry, material );
		impact.scale.multiplyScalar(0.5)
		Stellar7.scene.add( impact );
		impact.visible	= false
	})()

	var projector	= new THREE.Projector();
	var raycaster	= new THREE.Raycaster();
	var mouse	= new THREE.Vector2()
	domElement.addEventListener('mousemove', function(event){
		var clientRect	= domElement.getBoundingClientRect();
		mouse.x		= (event.clientX - clientRect.left) / clientRect.width;
		mouse.y		= (event.clientY - clientRect.top) / clientRect.height;
	})

	this.update	= function(){
		var mouseVector = new THREE.Vector3();
		mouseVector.set( mouse.x*2 - 1, -mouse.y* 2 + 1, 0.5 );
		projector.unprojectVector( mouseVector, camera );

		raycaster.set( camera.position, mouseVector.sub( camera.position ).normalize() );

		var intersects  = raycaster.intersectObjects( [groundMesh] );
		if( intersects.length === 0 ){
			// impact.visible	= false
		}else{
			var intersect	= intersects[0]
			var basePosition	= tank.baseMesh.position
			var targetPosition	= intersect.point
			var deltaPosition	= targetPosition.clone().sub(basePosition)
			var targetAngle		= Math.atan2(-deltaPosition.z, deltaPosition.x) + Math.PI/2

			// Set cannon angle
			var baseAngle	= tank.baseMesh.rotation.y
			var cannonAngle	= tank.cannonMesh.rotation.y
			tank.cannonMesh.rotation.y	= targetAngle - baseAngle

		}
	}
}