THREEx.Stellar7BulletModel	= function(){
	// your code goes here
	var canvas	= generateBulletCanvas();
	var texture	= new THREE.Texture( canvas );
	texture.needsUpdate = true;

	// do the material	
	var material	= new THREE.MeshBasicMaterial({
		color		: 0x555511,
		// opacity		: 0.8,
		map		: texture,
		side		: THREE.DoubleSide,
		blending	: THREE.AdditiveBlending,
		depthWrite	: false,
		transparent	: true
	})

	var object3d	= new THREE.Object3D
	this.object3d	= object3d
	object3d.scale.multiplyScalar(1/2)
	var nPlanes	= 8;
	for(var i = 0; i < nPlanes; i++){
		var geometry	= new THREE.PlaneGeometry(1, 0.25)
		var mesh	= new THREE.Mesh(geometry, material)
		mesh.material	= material
		mesh.rotateY(i*Math.PI/nPlanes)
		object3d.add(mesh)
	}
	
	return
		
	function generateBulletCanvas(){
		// init canvas
		var canvas	= document.createElement( 'canvas' );
		var context	= canvas.getContext( '2d' );
		canvas.width	= 64;
		canvas.height	= 64;
		// set gradient
		var gradient	= context.createRadialGradient(
			canvas.width/2, canvas.height /2, 0,
			canvas.width/2, canvas.height /2, canvas.width /2
		);		
		gradient.addColorStop( 0  , 'rgba(255,255,255,1)' );
		gradient.addColorStop( 0.5, 'rgba(192,192,192,1)' );
		gradient.addColorStop( 0.8, 'rgba(128,128,128,0.7)' );
		gradient.addColorStop( 1  , 'rgba(0,0,0,0)' );

		// fill the rectangle
		context.fillStyle	= gradient;
		context.fillRect(0,0, canvas.width, canvas.height);
		// return the just built canvas 
		return canvas;	
	};
}
