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

		// loaded.then( function(manifest){
		// 	console.log( levelURI , " Loaded : " , manifest );
		// })
		console.log("Loaded level " , loaded);
		return loaded;
	}

	init(){
		console.log('App Init...');
		return new Promise( function(resolve,reject){
			resolve("nothing to do yet...");
		})
	}

	start( manifestQueue ){
		console.log("Starting app... ", manifestQueue, this.draw );
		this.draw.setLevel( this.level );
		console.log("Draw Background...");
		this.draw.drawBackground();
		//this.draw.start( this.level );
		console.log("Initialise drawing system with actual data");

		console.log("Set up timer system");

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
			zombie.point.x--;
	}
	checkZombieQueue(){

		if( this.level.zombieQueue.length > 0 ){
			console.log("Don't keep the zombies waiting...");
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
		zombie.point = this.draw.getPoint( r, this.draw.columns );
		return zombie;		
	}
}



/* App State */
class State {
	constructor(){
		console.log('Create State ...');
	}
}


