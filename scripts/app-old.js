
export class App {

}

export class State {
	constructor(){
		this.game = {
			rows : 10,
			columns: 10,
			unitX: 100,
			unitY: 100
		}
		this.fps = fps;
		this.test = 1;
		this.level = new Level();
		this.counters = [];
	}
}
// // Main app code, a director.
// var App = ( function( window,fps ){
// 	// state
// 	var App = {},
// 		state = new State(),
// 		Grid,
// 		stage, 
// 		elements = [],
// 		stage;



// 	App.init = function(canvasId){
// 		console.log('Application init: ' , state.fps );
// 		stage = new createjs.Stage(canvasId);

// 		Grid = buildGridAPI( state,stage.canvas );

// 		var board = createBoard( stage,state ),
// 			scaleX = Grid.scaleX,
// 			scaleY = Grid.scaleY;

// 		console.log('Scale: ', scaleX, ':', scaleY)
// 		stage.setTransform( 0,0, scaleX, scaleY );
// 		console.log('Board: ', board);

// 		stage.addChild( board );

// 		addCounters( stage, [] );
// 		createjs.Ticker.setFPS( state.fps );
// 		createjs.Ticker.addEventListener( 'tick', this.update.bind( this ) );
// 	}

// 	App.update = function(event){
// 		//console.log("Paused:", event.paused, event.delta);
// 		//console.log( 'Update stage' );
// 		stage.update( ['m,mmm'])

// 	}

// 	return App;

// 	function toGU(v){ return v *= state.game.unit; }
// 	function createBoard( stage,state ){
// 		// we show assume something simple like 1000 x 1000 pixel space then just scale at drawing time

// 		var board = new createjs.Shape();
// 		var size = 10;


// 		for( var row=0; row<state.game.rows; row++){
// 			for( var column=0; column<state.game.columns; column++){
				
// 				var x = Grid.columnPos( column ),
// 					y = Grid.rowPos( row );


// 				board.graphics.beginStroke("red");
// 				board.graphics.drawRect( x,y,Grid.unitX,Grid.unitY );						

// 			}			
// 		}
// 		// .beginFill("blue").drawRect(20, 20, 100, 50);

// 		return board;
// 	}

// 	function addCounters( stage, counters ){


// 		function drawCounter( stage, counter ){
// 			var Counter = buildCounterAPI( counter );
// 			var g = new createjs.Graphics(),
// 				x = Grid.columnMid( Counter.c ),
// 				y = Grid.rowMid( Counter.r );

// 			g.beginStroke(createjs.Graphics.getRGB(0,255,0)).beginFill("#ff0000").drawCircle(x, y, 10);

// 			var c = new createjs.Shape( g );

// 			var msg = new createjs.Text( Counter.title,'20px Arial', '#ff7700');
// 			msg.x = Grid.columnPos( Counter.c );
// 			msg.y = Grid.rowPos( Counter.r );

// 			// c.addEventListener( 'tick', function(){
// 			// 	console.log('Counter tick ' , arguments );
// 			// });
// 			// c.addEventListener( 'click', function(){
// 			// 	console.log( 'Counter Click ', arguments);
// 			// })
// 			c.addEventListener( 'pressup', function(e){
// 				console.log('Pressup ', arguments);
// 				c.x = e.stageX;
// 				c.y = e.stageY;

// 				console.log( 'Column: [' , Grid.pos2col(c.x),',',Grid.pos2row(c.y) , '] <- [', e.stageX, ',',e.stageY,']');
// 			})
// 			stage.addChild( c );
// 			stage.addChild( msg );
// 		} 

// 		drawCounter(stage, {
// 			title: 'Counter type A',
// 			pos: [1,1]
// 		});
// 	}

// 	function buildCounterAPI( counter ){
// 		// {
// 		// 	pos: [column_x,column_y]
// 		// }

// 		var Counter = {};



// 		Counter.c = R.nth( 0, R.prop( 'pos' , counter ) );
// 		Counter.r = R.nth( 1, R.prop( 'pos', counter ) );
// 		Counter.title = R.prop( 'title', counter );


// 		return Counter;
// 	}

// 	function buildGridAPI( state,canvas ){
// 		var Grid = {};

// 		function scale( v ){ return Grid.unit() * v };
// 		Grid.unitX = R.path( ['game','unitX' ] , state);
// 		Grid.unitY = R.path( ['game','unitY' ] , state );

// 		Grid.halfX = R.divide( Grid.unitX , 2);
// 		Grid.halfY = R.divide( Grid.unitY , 2);

// 		Grid.columns = R.path( ['game','columns' ],state );
// 		Grid.rows = R.path( ['game','rows' ] , state);

// 		Grid.width = R.multiply( Grid.unitX, Grid.columns );
// 		Grid.height = R.multiply( Grid.unitY, Grid.rows );

// 		Grid.columnPos = R.multiply( Grid.unitX );
// 		Grid.rowPos = R.multiply( Grid.unitY );

// 		Grid.columnMid = R.compose( R.add( Grid.halfX ) , Grid.columnPos );
// 		Grid.rowMid = R.compose( R.add( Grid.halfY ) , Grid.rowPos );

// 		console.log('Grid Scale: ' , canvas.width , ':', Grid.width, '(', Grid.unitX, ',', Grid.columns , ') -> ', Grid.halfX );
// 		Grid.scaleX = R.divide( canvas.width , Grid.width );
// 		Grid.scaleY = R.divide( canvas.height , Grid.height );

// 		// stage x/y to column
// 		// scale back down to units then just get floor( / unit 
// 		Grid.pos2col = function( value ) {
// 			return Math.floor( (value/Grid.scaleX)/Grid.unitX )	;
// 		}		
// 		Grid.pos2row = function( value ) {
// 			return Math.floor( (value/Grid.scaleY)/Grid.unitY )	;
// 		}

// console.log('building...', Grid)

// 		return Grid;

// 	}

// 	function State(){
		
// 		this.game = {
// 			rows : 10,
// 			columns: 10,
// 			unitX: 100,
// 			unitY: 100
// 		}
// 		this.fps = fps;
// 		this.test = 1;
// 		this.level = new Level();
// 		this.counters = [];

// 	}

// 	State.prototype.getCounters = function(){

// 	}

// 	function Level(){
// 	}
// })( window,1);