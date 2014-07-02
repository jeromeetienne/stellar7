var THREEx	= THREEx	|| {}

THREEx.Stellar7Game	= function(scene){
	// internal render function
	var onRenderFcts= []
	this.update	= function(delta, now){
		if( this.frozen === true )	return
		onRenderFcts.forEach(function(onRenderFct){
			onRenderFct(delta, now)
		})
	}
	var game	= this
	this.frozen	= false
	
	//////////////////////////////////////////////////////////////////////////////////
	//		store bodies and update them					//
	//////////////////////////////////////////////////////////////////////////////////
	
	var tankBodies	= []
	this.tankBodies	= tankBodies
	onRenderFcts.push(function(delta, now){
		tankBodies.forEach(function(tankBody){
			tankBody.update(delta, now)
		})
	})

	var bulletBodies= []
	this.bulletBodies	= bulletBodies
	onRenderFcts.push(function(delta, now){
		bulletBodies.forEach(function(bulletBody){
			bulletBody.update(delta, now)
		})
	})
	
	//////////////////////////////////////////////////////////////////////////////////
	//		map								//
	//////////////////////////////////////////////////////////////////////////////////
	
	var map		= new THREEx.Stellar7Map()
	this.map	= map
	onRenderFcts.push(function(delta,now){
		map.update(delta, now)
	})
	scene.add(map.object3d)
	

	//////////////////////////////////////////////////////////////////////////////////
	//		handle other tanks scanning					//
	//////////////////////////////////////////////////////////////////////////////////

	onRenderFcts.push(function(delta, now){
		var lineOfSight	= new THREE.Line3()

		for(var tankIdx1 = 0; tankIdx1 < tankBodies.length; tankIdx1++){
			var tank1	= tankBodies[tankIdx1]
			var position1	= tank1.model.object3d.position
			lineOfSight.start.copy(position1)
			var angle	= tank1.model.cannonMesh.rotation.y 
						+ tank1.model.baseMesh.rotation.y
			angle		= Math.PI/2 - angle
			var delta	= new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle))
			delta.multiplyScalar(100)	// max length
			lineOfSight.end.copy(position1).add(delta)
			
			
			for(var tankIdx2 = 0; tankIdx2 < tankBodies.length; tankIdx2++){
				var tank2	= tankBodies[tankIdx2]
				var sphere2	= tank2.collisionSphere
				var position2	= tank2.model.object3d.position
				// dont test other tankBodies
				if( tankIdx1 === tankIdx2 )	continue

				// project position on the lineOfSight
				var projectedDot= lineOfSight.closestPointToPoint(position2, true)
				// do nothing if it is before or after the lineOfSight
				if( projectedDot.equals(lineOfSight.start) )	continue
				if( projectedDot.equals(lineOfSight.end) )	contunue
				// compute the distance between body position and the line of sight
				var distance	= position2.distanceTo(projectedDot)
				// if the distance is larger than tankPlayer.collisionSphere, the tank isnt seen
				if( distance > sphere2.radius )	continue

				// notify the event
				tank1.onScannedTank({
					otherTank	: tank2,
				})
				// no need to scan more 
				break;
			}
			
		}		
	})

	//////////////////////////////////////////////////////////////////////////////////
	//		handle inter-tank collision					//
	//////////////////////////////////////////////////////////////////////////////////

	onRenderFcts.push(function(delta, now){
		for(var playerIdx1 = 0; playerIdx1 < tankBodies.length-1; playerIdx1++){
			var player1	= tankBodies[playerIdx1]
			var sphere1	= player1.collisionSphere
			var position1	= player1.model.object3d.position
			for(var playerIdx2 = playerIdx1+1; playerIdx2 < tankBodies.length; playerIdx2++){
				var player2	= tankBodies[playerIdx2]
				var sphere2	= player2.collisionSphere
				var position2	= player2.model.object3d.position
				// test if sphere collide
				var colliding	= sphere1.intersectsSphere(sphere2)
				// sphere bounce on each other
				if( colliding ){
					// fix tanks position
					var delta	= position1.clone().sub(position2)
					delta.setLength(delta.length() - sphere1.radius - sphere2.radius)
					delta.multiplyScalar(1/2)
					position1.sub(delta)
					position2.add(delta)
					// compute contactPoint
					var contactPoint= position1.clone()
								.add(position2)
								.multiplyScalar(1/2)
					// notify tankBodies if colliding
					player1.onTankCollision({
						otherTank	: player2,
						contactPoint	: contactPoint,
					})
					player2.onTankCollision({
						otherTank	: player1,
						contactPoint	: contactPoint,
					})
				}
			}
		}
	})

	//////////////////////////////////////////////////////////////////////////////////
	//		handle bullet-tank collision					//
	//////////////////////////////////////////////////////////////////////////////////
	
	onRenderFcts.push(function(delta, now){
		for(var playerIdx = 0; playerIdx < tankBodies.length; playerIdx++){
			var player	= tankBodies[playerIdx]
			var spherePlayer= player.collisionSphere
			for(var bulletIdx = 0; bulletIdx < bulletBodies.length; bulletIdx++){
				var bullet	= bulletBodies[bulletIdx]
				var sphereBullet	= bullet.collisionSphere
				// if this bullet is from this player, ignore it
				if( bullet.fromPlayer === player )	continue 
				// test if sphere collide
				var colliding	= sphereBullet.intersectsSphere(spherePlayer)
				// notify tankBodies if colliding
				if( colliding ){
					player.onHitByBullet({
						fromTank	: bullet.fromPlayer,
						contactPoint	: bullet.model.object3d.position,
					})
					bullet.die()
				}
			}
			
		}
	})
	
	//////////////////////////////////////////////////////////////////////////////////
	//		colliding with map						//
	//////////////////////////////////////////////////////////////////////////////////
	

	// player colliding with map
	onRenderFcts.push(function(delta, now){
		tankBodies.forEach(function(tankBody){
			var collided	= map.collideWithTank(tankBody)
			if( collided )	tankBody.onMapCollision()
		})
	})
	// bulletBodies colliding with map
	onRenderFcts.push(function(delta, now){
		bulletBodies.forEach(function(bullet){
			var collided	= map.collideWithBullet(bullet)
			if( collided === false )	return
			document.dispatchEvent(new CustomEvent('emitSphericalBlast', {detail:{
				position	: bullet.model.object3d.position,
				color		: 'yellow',
				maxRadius	: 1,
			}}))
			document.dispatchEvent(new CustomEvent('playSound', { detail: {
				label	: 'contactFence',
				position: bullet.model.object3d.position
			}}));
			bullet.die()
		})
	})
	
	
	//////////////////////////////////////////////////////////////////////////////////
	//		comment								//
	//////////////////////////////////////////////////////////////////////////////////
	

	this._addPlayer	= function(tankBody){
		tankBodies.push(tankBody)
		scene.add(tankBody.model.object3d)

		if( tankBody.isLocalPlayer() ){
			this.localPlayer	= tankBody
		}

		tankBody.addEventListener('hitByBullet', function(event){

			document.dispatchEvent(new CustomEvent('playSound', { detail: {
				label	: 'hitByBullet',
				position: event.data.contactPoint,
			}}))

			event.data.fromTank.score	+= 100
			document.dispatchEvent(new CustomEvent('emitSphericalBlast', {detail:{
				position	: event.data.contactPoint,
				color		: 'red',
				maxRadius	: 1.2,
				maxAge		: 1.5,
			}}))
		})

		var lastFire	= 0
		tankBody.addEventListener('fire', function(){
			// handle cool down period
			var present	= Date.now()/1000
			if( present - lastFire < 1.0 )	return
			lastFire	= present

			var bullet	= new THREEx.Stellar7BulletBody.fromPlayer(tankBody)
			scene.add( bullet.model.object3d )
			bullet.model.object3d.rotation.y	= tankBody.turretAngleY()

			bulletBodies.push(bullet)

			bullet.addEventListener('die', function(){
				scene.remove( bullet.model.object3d )
				bulletBodies.splice(bulletBodies.indexOf(bullet),1)
			})

			document.dispatchEvent(new CustomEvent('playSound', { detail: {
				label	: 'bulletTank',
				position: bullet.model.object3d,
			}}));
		})
	}

	//////////////////////////////////////////////////////////////////////////////////
	//		addTankKeyboard							//
	//////////////////////////////////////////////////////////////////////////////////

	this.addTankKeyboard	= function(tankBody){
		var onMobile	= 'ontouchstart' in window ? true : false
		if( onMobile === false)	tankBody.setControlsKeyboard()
		else			tankBody.setControlsVirtualJoystick()			
		
		this._addPlayer(tankBody)
		// hitByBullet		
		tankBody.addEventListener('hitByBullet', function(event){
			// trigger BadTVJamming
			document.dispatchEvent(new CustomEvent('BadTVJamming', { detail: {
				presetLabel	: 'lightNoScroll'
			}}))
			// trigger colorAdjust thermal
			document.dispatchEvent(new CustomEvent('colorAdjust', { detail: {
				colorCube	: 'thermal'
			}}))

			// make osd appears
			var osdElement	= document.querySelector('#hitByBulletOsd')
			osdElement.classList.add("osdVisible");
			osdElement.classList.remove("osdHidden");	
			Flow().seq(function(next){
				setTimeout(function(){
					next()
				}, 1000*1)
			}).seq(function(next){
				// make osd appears
				osdElement.classList.remove("osdVisible");
				osdElement.classList.add("osdHidden");
				next()
			}).seq(function(next){
				// restore the default colorAdjust
				document.dispatchEvent(new CustomEvent('colorAdjust', { detail: {
					colorCube	: 'default'
				}}));
				next()
			})
		})
		// tankCollision
		tankBody.addEventListener('tankCollision', function(event){
			document.dispatchEvent(new CustomEvent('playSound', { detail: {
				label	: 'intertank.collision',
				position: event.contactPoint
			}}));
	
			document.dispatchEvent(new CustomEvent('BadTVJamming', { detail: {
				presetLabel	: 'lightNoScroll'
			}}));		
		})
		// mapCollision
		tankBody.addEventListener('mapCollision', function(){
			document.dispatchEvent(new CustomEvent('playSound', { detail: {
				label	: 'localtankmap.collision',
				position: tankBody.model.object3d
			}}));
			document.dispatchEvent(new CustomEvent('BadTVJamming', { detail: {
				presetLabel	: 'lightNoScroll'
			}}));		
		})
		// dead
		tankBody.addEventListener('dead', function(){
			document.dispatchEvent(new CustomEvent('killPlayer'))
		})
		// reallyDead
		tankBody.addEventListener('reallyDead', function(){
			document.dispatchEvent(new CustomEvent('gameLost'))
		})
	}

	//////////////////////////////////////////////////////////////////////////////////
	//		addTankQueue							//
	//////////////////////////////////////////////////////////////////////////////////
			
	this.addTankQueue	= function(tankBody){
		tankBody.setControlsQueue()
		this._addPlayer(tankBody)
		
		// dead
		tankBody.addEventListener('dead', function(){
			
// tankBody.model.baseMesh.material.
			var position	= tankBody.model.object3d.position
			var srcPosition	= position.clone()
			Flow().par(function(next){
				var tween	= new TWEEN.Tween(position)
					.to({
						x	: srcPosition.x,
						y	: srcPosition.y+2,
						z	: srcPosition.z,
					}, 0.6*1000)
					.easing(TWEEN.Easing.Circular.Out)
				var tweenBack	= new TWEEN.Tween(position)
					.delay(0.3*1000)
					.to({
						x	: srcPosition.x,
						y	: srcPosition.y+1.9,
						z	: srcPosition.z,
					}, 0.4*1000)
					.easing(TWEEN.Easing.Circular.In)
					.onComplete(function(){
						next()
					})
				tween.chain(tweenBack).start()
			}).par(function(next){
				var rotation	= tankBody.model.object3d.rotation
				var srcRotation	= rotation.clone()
				rotation.z	= 0
				var tween	= new TWEEN.Tween(rotation)
					.delay(0.4*1000)
					.to({
						z	: Math.PI*2,
					}, 0.6*1000)
					.easing(TWEEN.Easing.Exponential.InOut)
					.onComplete(function(){ next() })
					.start()
			}).seq(function(next){
				document.dispatchEvent(new CustomEvent('emitSphericalBlast', {detail:{
					position	: position,
					color		: 'yellow',
					maxRadius	: 2,
					maxAge		: 2
				}})) 
				document.dispatchEvent(new CustomEvent('playSound', { detail: {
					label	: 'enemyExplode',
					position: tankBody.model.object3d,
				}}));


				position.y	= srcPosition.y
				tankBody.resetPosition(map)
				next()
			})
		})
		// reallyDead
		tankBody.addEventListener('reallyDead', function(){
			document.dispatchEvent(new CustomEvent('playSound', { detail: {
				label	: 'enemyDead',
				position: tankBody.model.object3d,
			}}));
			tankBodies.splice(tankBodies.indexOf(tankBody),1)
			scene.remove(tankBody.model.object3d)
		})		
	}
}
