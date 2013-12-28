var THREEx	= THREEx	|| {}

THREEx.LightPool	= function(scene, nPointLights){
	// arguments default value
	nPointLights	= nPointLights !== undefined ? nPointLights : 10

	//////////////////////////////////////////////////////////////////////////////////
	//		THREE.PointLight						//
	//////////////////////////////////////////////////////////////////////////////////
	
	var pointLights	= []
	for(var i = 0; i < nPointLights; i++){
		var pointLight	= new THREE.PointLight('black', 0)
		pointLights.push(pointLight)
		scene.add(pointLight)
	}
	this.hasPointLight	= function(){
		return pointLights.length > 0
	}
	this.getPointLight	= function(color, intensity, distance){
		// handle parameters
		color		= color !== undefined ? color : new THREE.Color('white')
		intensity	= intensity !== undefined ? intensity : 1
		distance	= distance !== undefined ? distance : 0
		// get available light
		console.assert(pointLights.length > 0)
		var pointLight	= pointLights.pop()
		// reset parameters
		pointLight.color.set(color)
		pointLight.intensity	= intensity
		pointLight.distance	= distance
		pointLight.position.set(0,0,0)
		// return the point light
		return pointLight
	}
	this.putPointLight	= function(pointLight){
		pointLight.intensity	= 0
		pointLights.push(pointLight)
	}
}