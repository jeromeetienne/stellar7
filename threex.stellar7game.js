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

	var shoots	= []
	onRenderFcts.push(function(delta, now){
		shoots.forEach(function(shoot){
			shoot.update(delta, now)
		})
	})
	
	var map		= new THREEx.Stellar7Map()

	//////////////////////////////////////////////////////////////////////////////////
	//		handle inter-tank collision								//
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
				// console.log('texting', playerIdx1, 'colliding', playerIdx2, 'result', colliding)
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
	//		handle shoot-tank collision					//
	//////////////////////////////////////////////////////////////////////////////////
	
	onRenderFcts.push(function(delta, now){
		for(var playerIdx = 0; playerIdx < players.length; playerIdx++){
			var player	= players[playerIdx]
			var spherePlayer= player.collisionSphere
			for(var shootIdx = 0; shootIdx < shoots.length; shootIdx++){
				var shoot	= shoots[shootIdx]
				var sphereShoot	= shoot.collisionSphere
				// if this shoot is from this player, ignore it
				if( shoot.fromPlayer === player )	continue
				// test if sphere collide
				var colliding	= sphereShoot.intersectsSphere(spherePlayer)
				console.log('texting', playerIdx, 'colliding', shootIdx, 'result', colliding)
				// notify players if colliding
				if( colliding ){
					// player.onHitByBullet()
					shoot.die()
					scene.remove( shoot.model.object3d )
					shoots.splice(shoots.indexOf(shoot),1)
				}
			}
			
		}
	})

	// player colliding with map
	onRenderFcts.push(function(delta, now){
		players.forEach(function(player){
			var collided	= map.collideWithTank(player)
			if( collided )	Stellar7.sounds.play('contactFence')
			if( collided )	player.onMapCollision()
		})
	})
	// shoots colliding with map
	onRenderFcts.push(function(delta, now){
		shoots.forEach(function(shoot){
			var collided	= map.collideWithShoot(shoot)
			if( collided ){
				Stellar7.sounds.play('contactFence')
				shoot.die()
				scene.remove( shoot.model.object3d )
				shoots.splice(shoots.indexOf(shoot),1)
			}
		})
	})

	
	this.addPlayer	= function(player){
		players.push(player)
		scene.add(player.model.object3d)

		player.addEventListener('fire', function(){
			var shoot	= new THREEx.Stellar7Shoot.fromPlayer(player)
			scene.add( shoot.model.object3d )
			shoot.model.object3d.rotation.y	= player.model.cannonMesh.rotation.y 
				+ player.model.baseMesh.rotation.y


			shoots.push(shoot)


			Stellar7.sounds.play('shootTank')
		})
	}


}
