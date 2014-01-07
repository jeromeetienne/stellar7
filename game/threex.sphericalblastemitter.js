var THREEx	= THREEx	|| {}

THREEx.SphericalBlastEmitter	= function(container){
	// load the texture
	var geometry	= new THREE.SphereGeometry(0.5, 16, 32)

	var material	= THREEx.createAtmosphereMaterial()
	material.uniforms.glowColor.value	= new THREE.Color('blue')
	material.uniforms.coeficient.value	= 0.1
	material.uniforms.power.value		= 1.2
	material.side	= THREE.BackSide
	var outsideMaterial	= material
	
	var material	= THREEx.createAtmosphereMaterial()
	material.uniforms.glowColor.value	= new THREE.Color('blue')
	material.uniforms.coeficient.value	= 1.1
	material.uniforms.power.value		= 1.4
	var insideMaterial	= material


	var updateFcts	= []
	this.emit	= function(position, color, maxRadius, maxAge){
		position	= position	|| new THREE.Vector3(0,0,0)
		color		= color		|| 'red'
		maxRadius	= maxRadius	|| 0.5
		maxAge		= maxAge	|| 1
		// build mesh
		var material	= new THREE.MeshBasicMaterial({
			opacity		: 0.4,
			transparent	: true,
			// blending	: THREE.AdditiveBlending,
			color		: color
		})
		var mesh	= new THREE.Mesh(geometry, material)
		// var mesh	= new THREE.Object3D()
		mesh.position.copy(position)
		container.add(mesh)
	
		// get insideMesh for geometric glow
		var material	= THREEx.createAtmosphereMaterial()
		material.uniforms.glowColor.value	= new THREE.Color('blue')
		material.uniforms.coeficient.value	= 1.1
		material.uniforms.power.value		= 1.4
		var insideMesh	= new THREE.Mesh(geometry.clone(), material );
		insideMesh.scale.multiplyScalar(1.01)
		mesh.add( insideMesh );

		// get outsideMesh for geometric glow
		var material	= THREEx.createAtmosphereMaterial()
		material.uniforms.glowColor.value	= new THREE.Color('blue')
		material.uniforms.coeficient.value	= 0.1
		material.uniforms.power.value		= 1.2
		material.side	= THREE.BackSide
		var outsideMesh	= new THREE.Mesh(geometry.clone(), outsideMaterial );
		outsideMesh.scale.multiplyScalar(1.1)
		mesh.add( outsideMesh );
			
		// init scale
		var age2Scale	= (function(){
			var tweenFn	= createTweenMidi(maxAge, 0.1*maxAge, 0.4*maxAge)
			return function(age){ return (0.3 + tweenFn(age) * 0.7) * maxRadius;	}
		})()
		mesh.scale.set(1,1,1).multiplyScalar( age2Scale(0) )
		// start updating		
		var birthDate	= Date.now()/1000
		updateFcts.push(function callback(delta, now){
			var age	= Date.now()/1000 - birthDate
			if( age >= maxAge ){
				mesh.parent.remove(mesh)
				updateFcts.splice(updateFcts.indexOf(callback),1)
				return;	
			}
			// make it grow
			mesh.scale.set(1,1,1).multiplyScalar( age2Scale(age) )
		})
	}
	this.update	= function(delta, now){
		updateFcts.forEach(function(updateFct){
			updateFct(delta, now)
		})
	}
	function createTweenMidi(maxAge, attackTime, releaseTime){
		return function(age){
			if( age < attackTime ){
				return age / attackTime
			}else if( age < maxAge - releaseTime ){
				return 1;
			}else{
				return (maxAge - age) / releaseTime
			}
		}	
	}
}
