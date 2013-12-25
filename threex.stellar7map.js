var THREEx	= THREEx	|| {}

THREEx.Stellar7Map	= function(){
	this.width	= 5
	this.depth	= 5
	
	this.collideWithTank	= function(tank){
		var position	= tank.model.object3d.position
		var collided	= false
		if( position.x > +this.width/2 ){
			position.x	= +this.width/2
			collided	= true			
		}
		if( position.x < -this.width/2 ){
			position.x	= -this.width/2
			collided	= true			
		}
		if( position.z > +this.depth/2 ){
			position.z	= +this.depth/2
			collided	= true			
		}
		if( position.z < -this.depth/2 ){
			position.z = -this.depth/2
			collided	= true			
		}
		return collided
	}
	this.collideWithShoot	= function(shoot){
		var position	= shoot.object3d.position
		var collided	= false
		if( position.x > +this.width/2 ){
			position.x	= +this.width/2
			collided	= true			
		}
		if( position.x < -this.width/2 ){
			position.x	= -this.width/2
			collided	= true			
		}
		if( position.z > +this.depth/2 ){
			position.z	= +this.depth/2
			collided	= true			
		}
		if( position.z < -this.depth/2 ){
			position.z	= -this.depth/2
			collided	= true			
		}
		return collided		
	}
}