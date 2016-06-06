export function ZombieFactory( zombieType,opts ){

	console.log( 'Create a Zombie (", zombieType, ") from options: ' , opts);

	return new BaseZombie( opts );
}