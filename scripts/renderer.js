
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
		this._rows = 5;
		this._columns = 10;
		this.width = w /  this._columns;
		this.height = h / this._rows;

		this.grid = this._rows * this._columns;
		this.fps = 30;
		this.temp = 0;
	}

	update(){
		super.update();

	}

	getPoint( row,col ){
		return new createjs.Point( col*this.width,row*this.height );
	}

	addZombie( zombie ){
		console.log("Add zombie to the stage " , zombie );
		var _self = this,
			img = new createjs.Bitmap( zombie.getImage() );

		img.x = zombie.point.x;
		img.y = zombie.point.y;
		zombie.image = img;
		this.stage.addChild( img );

		img.creator = zombie;
		img.addEventListener( 'tick', function( event ){
			//if( _self.temp++ == 0 ) console.log("Zombie ticked ", event);
			var z = event.target;
			z.x = z.creator.point.x;
		});
	}

	get columns(){ return this._columns - 1;	}
	set columns(val){ this._columns = val; }
	get rows(){	return this._rows - 1;	}
	set rows(val){ this._columns = val; }

}