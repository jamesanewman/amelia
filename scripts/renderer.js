
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
		//bg.scaleX = bg.image.width/1200;
		//bg.scaleY = bg.image.height/800;
		this.stage.addChild( bg );
	}

	remove( item ){
		var success = this.stage.removeChild( item.renderItem );
		console.log("Removed " , success , " -> ", item );
	}

	onClick( callback ){
		this.stage.addEventListener( 'click' , callback );
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
		this.stage.scaleX = this.stage.canvas.width / w;
		this.stage.scaleY = this.stage.canvas.height / h;
		this._rows = 5;
		this._columns = 10;
		this.width = w /  this._columns;
		this.height = h / this._rows;

		this.grid = this._rows * this._columns;
		this.fps = 30;
		this.temp = 0;

		this.sizeX = w;
		this.sizeY = h;
	}

	update(){
		super.update();

	}

	drawBackground(){
		super.drawBackground();

		var pos = this.width, grid = new createjs.Shape();
		grid.graphics.setStrokeStyle( 3/10 );
		grid.graphics.beginStroke("#FF00FF");
		while( pos < this.sizeX ){
			console.log(">> " , pos, " :: " , this.sizeY);
			grid.graphics.moveTo( pos,0 ).lineTo( pos,this.sizeY );

			pos += this.width;	

		}
		grid.graphics.endStroke();

		this.stage.addChild( grid );
		// this.update();
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

		img.scaleX = this.width / img.width;
		img.scaleY = this.height / img.height;

		zombie.renderItem = img;
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