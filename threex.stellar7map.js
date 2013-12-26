var THREEx	= THREEx	|| {}

THREEx.Stellar7Map	= function(){
	this.radius	= 20
	
	this.collideWithTank	= function(tank){
		var position	= tank.model.object3d.position
		var collided	= false
		if( position.length() > this.radius ){
			collided	= true			
			position.setLength(this.radius)
		}
		return collided
	}
	this.collideWithShoot	= function(shoot){
		var position	= shoot.model.object3d.position
		var collided	= false
		if( position.length() > this.radius ){
			collided	= true			
			position.setLength(this.radius)
		}
		return collided
	}
}