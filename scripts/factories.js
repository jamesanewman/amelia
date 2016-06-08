function random(min,max){
	return Math.round( Math.random() * (max - min) + min );
}
export function ZombieFactory( opts ){

	//console.log( 'Create a Zombie (', opts, ') from options: ' , opts.getResult);

	return new BaseZombie( opts );
}

export function DamageFactory( type ){
	var damage;

	switch( type ){

		default:
			damage = new Damage(random(10,100));
			break;
	}

	return damage;
}