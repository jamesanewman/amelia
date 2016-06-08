function createAppState( options ){
	var state = new State();
	console.log('State maker...')
	return state;
}

function onFileLoadComplete(event) {
    console.log('Loader: ', event.result);
}
export class App {
	constructor( renderer,options ){
		console.log("Create App...");
		this.draw = renderer;
		this.state = createAppState( options );
		this.level = new Level();
		this.tickState = 0;
		this.activeZombies = [];
	}

	loadLevel( levelURI ){
		console.log("App load Level ... " ,levelURI);
		var loaded = this.level.load( levelURI );
		return loaded;
	}

	init(){
		return new Promise( function(resolve,reject){
			resolve("Application initialised");
		})
	}

	start( manifestQueue ){
		console.log("Starting app... ", manifestQueue, this.draw );
		this.draw.setLevel( this.level );
		this.draw.drawBackground();

		createjs.Ticker.setFPS( 30 );
		createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
		createjs.Ticker.addEventListener( 'tick', this.onTick.bind(this) );

		this.level.startLevel();
	}

	onTick(tickInfo){
		//console.log("Update drawing system " ,this.tickState);
		// states move in FPS intervals, so state = multiple of FPS
		// states
		//  1 - update bullets
		//  2 - update Zombies

		this.tickState++;

		this.updateBullets();
		R.forEach( this.updateZombie.bind(this), this.activeZombies );
		this.checkZombieQueue();

		this.draw.update();
	}

	updateBullets(){

	}

	updateZombie(zombie){
			// console.log("Update Zombie: " , zombie );
			zombie.move();
	}
	checkZombieQueue(){

		if( this.level.zombieQueue.length > 0 ){
			console.log("Adding " , this.level.zombieQueue.length , " zombies to the queue");
			var zombies = this.level.zombieQueue,
				_self = this;

			var newZombies = R.forEach( 
				_self.draw.addZombie.bind( _self.draw ) , 
				R.map( _self.initZombie.bind(_self) ,zombies )
			);

			this.activeZombies = R.concat( newZombies,this.activeZombies );

			_self.level.zombieQueue = [];
		}
	}

	initZombie( zombie ){
		var r =  Math.random() * (5 - 0) + 0;
		//zombie.point = this.draw.getPoint( r, this.draw.columns );
		zombie.setPoint( this.draw.getPoint( r, this.draw.columns ) );
		return zombie;		
	}
}



/* App State */
class State {
	constructor(){
		console.log('Create State ...');
	}
}


