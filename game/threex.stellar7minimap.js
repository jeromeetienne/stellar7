var THREEx	= THREEx	|| {}

THREEx.Stellar7MiniMap	= function(game){
	// internal render function
	var onRenderFcts= []
	this.update	= function(delta, now){
		onRenderFcts.forEach(function(onRenderFct){
			onRenderFct(delta, now)
		})
	}
	// create element
	var canvas	= document.createElement('canvas')
	canvas.width	= 200
	canvas.height	= 200
	this.domElement	= canvas
	var context	= canvas.getContext('2d')	


	//////////////////////////////////////////////////////////////////////////////////
	//		comment								//
	//////////////////////////////////////////////////////////////////////////////////
	
	onRenderFcts.push(function(delta, now){
		// later do a circle
		context.clearRect(0,0, canvas.width, canvas.height)
		context.fillStyle	= "rgba(0,127,0,0.5)";
		// context.fillRect(0,0, canvas.width, canvas.height)
	
		context.beginPath();
		context.arc(canvas.width/2, canvas.height/2, canvas.width/2, 0, Math.PI*2, true); 
		context.closePath();
		context.fill();
	})

	//////////////////////////////////////////////////////////////////////////////////
	//		comment								//
	//////////////////////////////////////////////////////////////////////////////////
	
	onRenderFcts.push(function(delta, now){
		var localPlayer		= game.localPlayer
		var localPosition	= localPlayer.model.object3d.position
		var localRotationY	= localPlayer.model.object3d.rotation.y
		var mapRadius		= game.map.radius
		game.tankBodies.forEach(function(tankBody){
			var position	= tankBody.model.object3d.position.clone()
			position.sub(localPosition)
			var rotation	= tankBody.model.object3d.rotation
			var canvasX	= (-position.x / mapRadius) * (0.9*canvas.width/2)
			var canvasY	= (-position.z / mapRadius) * (0.9*canvas.height/2)
			
			context.save()
			if( tankBody.isLocalPlayer() ){
				context.fillStyle	= "rgba(0,255,255,0.5)"			
			}else{
				context.fillStyle	= "rgba(255,0,0,0.5)"			
			}
			context.translate(canvas.width/2, canvas.height/2)
			context.rotate(localRotationY);
			context.translate(canvasX, canvasY)			
			context.rotate(-rotation.y);
			context.fillRect(-2,-4, 4, 8)
			context.restore()
		})
	})
	
	
	//////////////////////////////////////////////////////////////////////////////////
	//		comment								//
	//////////////////////////////////////////////////////////////////////////////////
	
	onRenderFcts.push(function(delta, now){
		var localPlayer		= game.localPlayer
		var localPosition	= localPlayer.model.object3d.position
		var localRotationY	= localPlayer.model.object3d.rotation.y
		var mapRadius		= game.map.radius
		game.bulletBodies.forEach(function(bulletBody){
			var position	= bulletBody.model.object3d.position.clone()
			position.sub(localPosition)

			var rotation	= bulletBody.model.object3d.rotation
			
			var canvasX	= (-position.x / mapRadius) * (0.9*canvas.width/2)
			var canvasY	= (-position.z / mapRadius) * (0.9*canvas.height/2)
			
			context.save()
			context.fillStyle	= "rgba(255,255,0,0.5)"
			context.translate(canvas.width/2, canvas.height/2)			
			context.rotate(localRotationY);
			context.translate(canvasX, canvasY)			
			context.rotate(-rotation.y);
			context.fillRect(-1,-2, 2, 4)
			context.restore()
		})
	})
}

