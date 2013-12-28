var THREEx	= THREEx	|| {}

THREEx.Stellar7Map	= function(){
	this.radius	= 16
	
	
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
	this.collideWithShoot	= function(shoot){
		var position	= shoot.model.object3d.position
		var sphere	= shoot.collisionSphere
		var maxRadius	= this.radius - sphere.radius
		var collided	= false
		if( position.length() > maxRadius ){
			collided	= true			
			position.setLength(maxRadius)
		}
		return collided
	}
}