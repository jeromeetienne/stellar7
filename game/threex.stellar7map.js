var THREEx	= THREEx	|| {}

THREEx.Stellar7Map	= function(){
	
	//////////////////////////////////////////////////////////////////////////////////
	//		comment								//
	//////////////////////////////////////////////////////////////////////////////////
	
	this.radius	= 16
	
	
	//////////////////////////////////////////////////////////////////////////////////
	//		comment								//
	//////////////////////////////////////////////////////////////////////////////////
	
	var object3d	= new THREE.Object3D()
	this.object3d	= object3d

	// skymap
	var mesh	= THREEx.createSkymap('mars')
	// object3d.add( mesh )
	
	
	// add montains
	var url		= 'bower_components/threex.planets/examples/images/galaxy_starfield.png'
	var material	= new THREE.MeshBasicMaterial({
		map	: THREE.ImageUtils.loadTexture(url),
		side	: THREE.BackSide
	})
	var geometry	= new THREE.SphereGeometry(90, 32, 32)
	var mesh	= new THREE.Mesh(geometry, material)
	object3d.add(mesh)

	// montain arena
	var mesh	= new THREEx.MontainsArena()
	mesh.scale.x	*= 40
	mesh.scale.z	*= 40
	mesh.scale.y	*= 20
	mesh.children.forEach(function(montain){
		var geometry	= montain.geometry
		var material	= new THREEx.SolidWireframeMaterial(geometry)
		material.uniforms.lineWidth.value	= 6.0
		material.uniforms.lineColor.value.set('white')
		material.uniforms.faceColor.value.set('black')

		montain.material= material
	})
	object3d.add(mesh)

	// grassground
	// var mesh	= new THREEx.GrassGround({
	// 	width		: 10,
	// 	height		: 10,
	// 	repeatX		: 30,
	// 	repeatY		: 30,
	// })
	// mesh.material	= new THREE.MeshPhongMaterial({
	// 	map	: mesh.material.map,
	// 	color	: 0x44FF44,
	// })
	// mesh.scale.multiplyScalar(10)
	// mesh.position.y	-= 0.01
	// object3d.add(mesh)

	// var geometry	= new THREE.PlaneGeometry(40, 40, 20, 20)
	// var material	= new THREE.MeshBasicMaterial({
	// 	wireframe		: true,
	// 	wireframeLinewidth	: 3,
	// 	color			: 'blue',
	// })
	// var mesh	= new THREE.Mesh(geometry, material)
	// mesh.lookAt(new THREE.Vector3(0,1,0))
	// object3d.add(mesh)


	var texture	= THREE.ImageUtils.loadTexture('images/border-neon.jpg');
	texture.wrapS	= THREE.RepeatWrapping;
	texture.wrapT	= THREE.RepeatWrapping;
	texture.repeat.set(20,20)
	texture.anisotropy = 16; 


	var geometry	= new THREE.PlaneGeometry(40, 40)
	var material	= new THREE.MeshPhongMaterial({
		map	: texture,
		// color	: 0x44FF44,
		color	: 0x228822,
		// specular: 'white',
		// emissive: 0x002200,
		// ambient	: 'red',
		shininess: 30,
	})
	var mesh	= new THREE.Mesh(geometry, material)
	mesh.lookAt(new THREE.Vector3(0,1,0))
	mesh.position.y	-= 0.01
	object3d.add(mesh)

		
	//////////////////////////////////////////////////////////////////////////////////
	//		comment								//
	//////////////////////////////////////////////////////////////////////////////////
	
	this.collideWithTank	= function(player){
		var position	= player.model.object3d.position
		var sphere	= player.collisionSphere
		var maxRadius	= this.radius - sphere.radius
		var collided	= false
		if( position.length() > maxRadius ){
			collided	= true			
			position.setLength(maxRadius)
		}
		return collided
	}
	this.collideWithBullet	= function(bullet){
		var position	= bullet.model.object3d.position
		var sphere	= bullet.collisionSphere
		var maxRadius	= this.radius - sphere.radius
		var collided	= false
		if( position.length() > maxRadius ){
			collided	= true			
			position.setLength(maxRadius)
		}
		return collided
	}
}