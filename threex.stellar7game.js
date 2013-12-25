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


	onRenderFcts.push(function(delta, now){
		players.forEach(function(player){
			var collided	= map.collideWithTank(player)
			if( collided )	sounds.play('contactFence')
			if( collided )	player.onMapCollision()
		})
	})

	onRenderFcts.push(function(delta, now){
		shoots.forEach(function(shoot){
			var collided	= map.collideWithShoot(shoot)
			if( collided ){
				sounds.play('contactFence')
				scene.remove( shoot.object3d )
				shoots.splice(shoots.indexOf(shoot),1)
			}
		})
	})

	
	this.addPlayer	= function(player){
		players.push(player)
		scene.add(player.model.object3d)

		player.addEventListener('fire', function(){
			var shoot	= new THREEx.Stellar7Shoot.fromTank(player.model)
			sounds.play('shootTank')
			scene.add( shoot.object3d )
			shoots.push(shoot)
		})
	}


}
