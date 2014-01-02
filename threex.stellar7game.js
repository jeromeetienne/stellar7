var THREEx	= THREEx	|| {}

THREEx.Stellar7Game	= function(scene){
	// internal render function
	var onRenderFcts= []
	this.update	= function(delta, now){
		onRenderFcts.forEach(function(onRenderFct){
			onRenderFct(delta, now)
		})
	}
	
	//////////////////////////////////////////////////////////////////////////////////
	//		comment								//
	//////////////////////////////////////////////////////////////////////////////////
	
	var players	= []
	onRenderFcts.push(function(delta, now){
		players.forEach(function(player){
			player.update(delta, now)
		})
	})

	var bullets	= []
	onRenderFcts.push(function(delta, now){
		bullets.forEach(function(bullet){
			bullet.update(delta, now)
		})
	})
	
	var map		= new THREEx.Stellar7Map()

	//////////////////////////////////////////////////////////////////////////////////
	//		handle inter-tank collision					//
	//////////////////////////////////////////////////////////////////////////////////

	onRenderFcts.push(function(delta, now){
		var lineOfSight	= new THREE.Line3()

		for(var playerIdx1 = 0; playerIdx1 < players.length; playerIdx1++){
			var player1	= players[playerIdx1]
			var position1	= player1.model.object3d.position
			lineOfSight.start.copy(position1)
			var angle	= player1.model.cannonMesh.rotation.y 
						+ player1.model.baseMesh.rotation.y
			angle		= Math.PI/2 - angle
			var delta	= new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle))
			delta.multiplyScalar(100)
			lineOfSight.end.copy(position1).add(delta)
			
			
			for(var playerIdx2 = 0; playerIdx2 < players.length; playerIdx2++){
				var player2	= players[playerIdx2]
				var sphere2	= player2.collisionSphere
				var position2	= player2.model.object3d.position
				// dont test other tanks
				if( playerIdx1 === playerIdx2 )	continue

				// project position on the lineOfSight
				var projectedDot= lineOfSight.closestPointToPoint(position2, true)
				// do nothing if it is before or after the lineOfSight
				if( projectedDot.equals(lineOfSight.start) )	continue
				if( projectedDot.equals(lineOfSight.end) )	contunue
				// compute the distance between body position and the line of sight
				var distance	= position2.distanceTo(projectedDot)
				// if the distance is larger than tankPlayer.collisionSphere, the tank isnt seen
				if( distance > sphere2.radius )	continue

				// here there is a collision
				// console.log('collision between', playerIdx1, playerIdx2)
				// notify the event
				player1.onScannedTank()
				// no need to scan more 
				break;
			}
			
		}		
	})

	//////////////////////////////////////////////////////////////////////////////////
	//		handle inter-tank collision					//
	//////////////////////////////////////////////////////////////////////////////////

	onRenderFcts.push(function(delta, now){
		for(var playerIdx1 = 0; playerIdx1 < players.length-1; playerIdx1++){
			var player1	= players[playerIdx1]
			var sphere1	= player1.collisionSphere
			var position1	= player1.model.object3d.position
			for(var playerIdx2 = playerIdx1+1; playerIdx2 < players.length; playerIdx2++){
				var player2	= players[playerIdx2]
				var sphere2	= player2.collisionSphere
				var position2	= player2.model.object3d.position
				// test if sphere collide
				var colliding	= sphere1.intersectsSphere(sphere2)
				// sphere bounce on each other
				if( colliding ){
					var delta	= position1.clone().sub(position2)
					delta.setLength(delta.length() - sphere1.radius - sphere2.radius)
					delta.multiplyScalar(1/2)
					position1.sub(delta)
					position2.add(delta)
				}
				// notify players if colliding
				if( colliding ){
					player1.onTankCollision()
					player2.onTankCollision()
				}
			}
			
		}
	})

	//////////////////////////////////////////////////////////////////////////////////
	//		handle bullet-tank collision					//
	//////////////////////////////////////////////////////////////////////////////////
	
	onRenderFcts.push(function(delta, now){
		for(var playerIdx = 0; playerIdx < players.length; playerIdx++){
			var player	= players[playerIdx]
			var spherePlayer= player.collisionSphere
			for(var bulletIdx = 0; bulletIdx < bullets.length; bulletIdx++){
				var bullet	= bullets[bulletIdx]
				var sphereBullet	= bullet.collisionSphere
				// if this bullet is from this player, ignore it
				if( bullet.fromPlayer === player )	continue
				// test if sphere collide
				var colliding	= sphereBullet.intersectsSphere(spherePlayer)
				// notify players if colliding
				if( colliding ){
					if( player.isLocalPlayer() ){
						document.dispatchEvent(new CustomEvent('BadTVJamming'));
					}
					Stellar7.sounds.play('explosion')
					player.onHitByBullet()
					bullet.fromPlayer.score	+= 100
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
		players.forEach(function(player){
			var collided	= map.collideWithTank(player)
			if( collided )	Stellar7.sounds.play('contactFence')
			if( collided )	player.onMapCollision()
		})
	})
	// bullets colliding with map
	onRenderFcts.push(function(delta, now){
		bullets.forEach(function(bullet){
			var collided	= map.collideWithBullet(bullet)
			if( collided ){
				Stellar7.sounds.play('contactFence')
				bullet.die()
			}
		})
	})
	
	//////////////////////////////////////////////////////////////////////////////////
	//		comment								//
	//////////////////////////////////////////////////////////////////////////////////
	

	
	this.addPlayer	= function(player){
		players.push(player)
		scene.add(player.model.object3d)

		var lastFire	= 0
		player.addEventListener('fire', function(){
			// handle cool down period
			if( Date.now() - lastFire < 500 )	return;
			lastFire	= Date.now()
			
			var bullet	= new THREEx.Stellar7BulletBody.fromPlayer(player)
			scene.add( bullet.model.object3d )
			bullet.model.object3d.rotation.y	= player.turretAngleY()

			bullets.push(bullet)
			
			bullet.addEventListener('die', function(){
				scene.remove( bullet.model.object3d )
				bullets.splice(bullets.indexOf(bullet),1)
			})



			Stellar7.sounds.play('bulletTank')
		})
	}


}
