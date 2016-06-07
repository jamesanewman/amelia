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
		//console.log("Update bullet");

		if( this.tickState % 30 == 0  ){
			console.log("Tick state = mod 10");
			//this.level.updateZombies();
		}

		this.checkZombieQueue();

		this.draw.update();
	}

	updateBullets(){

	}

	checkZombieQueue(){

		if( this.level.zombieQueue.length > 0 ){
			console.log("Don't keep the zombies waiting...");
			var zombies = this.level.zombieQueue,
				_self = this;
			R.forEach( 
				_self.draw.addZombie.bind( _self.draw ) , 
				R.map( function(z){
					var r =  Math.random() * (5 - 0) + 0;
					z.point = _self.draw.getPoint( r, 5);
					console.log("Zom ",r);
					return z;
				},zombies 
				)
			);
			_self.level.zombieQueue = [];
		}
	}
}



/* App State */
class State {
	constructor(){
		console.log('Create State ...');
	}
}



/* Base rendering */
class RenderBase {
	constructor(canvasId){
		console.log('Create renderer....');
		this.canvasId = canvasId;
		this.stage = new createjs.Stage( canvasId );
	}

	update(){
		this.stage.update()
	}

	setLevel( level ){
		this.level = level;
	}

	drawBackground(){
		var bg = new createjs.Bitmap( this.level.getImage('background') );
		console.log("Background = " , bg );
		bg.scaleX = this.stage.canvas.width / bg.image.width;
		this.stage.addChild( bg );
	}


}

export class PVZRenderer extends RenderBase {
	constructor( canvasId ){
		super(canvasId);
		console.log('Creating PVZ Renderer...');

		// Core size of "ideal" canvas is 1200 x 800 
		// rows = 5
		var w = 1200, h = 800;
		// scale drawing code to idea -> actual canvas
		this.stage.scaleX = w / this.stage.canvas.width;
		this.stage.scaleY = h / this.stage.canvas.height;
		this.rows = 5;
		this.columns = 10;
		this.width = w /  this.columns;
		this.height = h / this.rows;

		this.grid = this.rows * this.columns;
		
	}

	getPoint( row,col ){
		return new createjs.Point( col*this.width,row*this.height );
	}

	addZombie( zombie ){
		console.log("Draw zombie " , zombie );
		var img = new createjs.Bitmap( zombie.getImage() );
		img.x = zombie.point.x;
		img.y = zombie.point.y;
		zombie.image = img;
		this.stage.addChild( img );
		console.log("Zombie done... " , img.x, " :: " , img.y);
	}
	// start( level ){
	// 	R.forEach( this.initZombie , level.getZombies() );
	// }

	// initZombie( zombie ){
	// 	console.log("Adding zombie ", zombie);

	// 	if( !zombie || !zombie.delay ) return;

	// 	zombie.timer = setTimeout( function(){
	// 		var z = ZombieFactory( "zombie" , zombie );
	// 		console.log("Zombie ready to add ... " , zombie, ' -> ', z);
	// 	} , zombie.delay );


	// }
}