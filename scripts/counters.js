export class Damage {
	constructor( value ){
		this.value = value || 10;
	}
	hit( counter ){
		//console.log("Perform damage to counter " , counter);
		counter.health -= this.value;
	}
}

export class BaseCounter {

	constructor(opts){
		this.opts = opts;
		this.health = 100;
	}

	setHealth( value ){
		this.health = value;
	}

	isAlive(){ return this.health > 0; }
	setDamage( damage ){ this.damage = damage; }
	getDamage( ){ return this.damage; }

}

export class BaseZombie extends BaseCounter {
	constructor( opts ){
		super(opts);
		console.log("Base zombie created ",opts);

		this.isAttacking = false;
		this.delay = opts.item.delay;
		this.point = { x:0, y:0 };

		this.setDamage( DamageFactory(opts.damage) );
	}

	getImage(){
		return this.opts.result;
	}

	setPoint( point ){
		this.point.x = point.x;
		this.point.y = point.y;
	}

	move(){
		this.point.x--;
	}

	attack( counter ){
		//console.log("Zombie should attack counter");
		this.isAttacking = true;
		if( this.damage ) this.damage.hit( counter );
	}
}