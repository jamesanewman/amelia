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
		this.draw.drawBackground();
		this.draw.start( this.level );
		this.draw.update();

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

		// scale drawing code to idea -> actual canvas
		this.stage.scaleX = 1200 / this.stage.canvas.width;
		this.stage.scaleY = 800 / this.stage.canvas.height;

	}

	start( level ){
		R.forEach( this.initZombie , level.getZombies() );
	}

	initZombie( zombie ){
		console.log("Adding zombie ", zombie);

		if( !zombie || !zombie.delay ) return;

		zombie.timer = setTimeout( function(){
			var z = ZombieFactory( "zombie" , zombie );
			console.log("Zombie ready to add ... " , zombie, ' -> ', z);
		} , zombie.delay );


	}
}