var THREEx	= THREEx	|| {}

THREEx.Stellar7TankModel	= function(){
	// get the base
	var geometry	= new THREE.CubeGeometry( 0.5, 0.2, 1);
	var matrix	= new THREE.Matrix4()
	matrix.makeTranslation(0, 0.1, 0)
	geometry.applyMatrix(matrix)
	var material	= new THREE.MeshNormalMaterial();
var material	= new THREEx.SolidWireframeMaterial(geometry)
material.uniforms.lineWidth.value	= 1
material.uniforms.lineColor.value.set('cyan')
material.uniforms.faceColor.value.set('black')

	var baseMesh	= new THREE.Mesh( geometry, material );
	this.object3d	= baseMesh
	this.baseMesh	= baseMesh
	
	// get the turret
	var geometry	= new THREE.CubeGeometry( 0.3, 0.15, 0.3);
	var material	= new THREE.MeshNormalMaterial();
var material	= new THREEx.SolidWireframeMaterial(geometry)
material.uniforms.lineWidth.value	= 1
material.uniforms.lineColor.value.set('cyan')
material.uniforms.faceColor.value.set('black')

	var cannonMesh	= new THREE.Mesh( geometry, material );
	baseMesh.add(cannonMesh)
	cannonMesh.position.set(0,0.3, -0.2)
	this.cannonMesh	= cannonMesh

	// get the cannon
	var geometry	= new THREE.CylinderGeometry( 0.05, 0.05, 0.3 );
	var material	= new THREE.MeshNormalMaterial();
var material	= new THREEx.SolidWireframeMaterial(geometry)
material.uniforms.lineWidth.value	= 1
material.uniforms.lineColor.value.set('cyan')
material.uniforms.faceColor.value.set('black')

	var meshCylinder= new THREE.Mesh( geometry, material );
	cannonMesh.add(meshCylinder)
	meshCylinder.lookAt(new THREE.Vector3(0,5,-1))
	meshCylinder.position.set(0,0.05, 0.3)
	
	this.setLineColor	= function(color){
		baseMesh.material.uniforms.lineColor.value.set(color)
		cannonMesh.material.uniforms.lineColor.value.set(color)
		meshCylinder.material.uniforms.lineColor.value.set(color)
	}
	this.setFaceColor	= function(color){
		baseMesh.material.uniforms.faceColor.value.set(color)
		cannonMesh.material.uniforms.faceColor.value.set(color)
		meshCylinder.material.uniforms.faceColor.value.set(color)
	}
	this.setLineWidth	= function(width){
		baseMesh.material.uniforms.lineWidth.value	= width
		cannonMesh.material.uniforms.lineWidth.value	= width
		meshCylinder.material.uniforms.lineWidth.value	= width
	}
}
