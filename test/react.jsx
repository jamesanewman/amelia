function findDragTargetElement(target){
	while( !target.attributes.getNamedItem('draggable') ){
		target = target.parentElement;
	}	
	return target;
}

var MATCHSIZE = 3;
class GridView  extends React.Component {

	constructor(){
		super();
		this.state = {
			dragging: undefined
		}
	}

	shouldComponentUpdate(nextProps,nextState){
		//console.log("Grid Updating " , arguments);
		return true;
	}
	handleDragStart(e){

		//console.log("cell -> " , R.join( '\n', R.keysIn( e.target )));
		var current = findDragTargetElement(e.target);
		var attrs = current.attributes;

		// console.log("Handling drag ", arguments);
		// console.log("Target = ", e.target , " -> " , attrs);
		// console.log("cell -> " , current);

		this.setState( {
			dragging: {
				cell: attrs.getNamedItem('data-cell').value,
				row: attrs.getNamedItem('data-row').value
			}
		});

	}

	// row dropped on, cell dropped on, row dragged, cell dragged
	handleDropFinish( dropRow,dropCell,dragRow,dragCell ){
		//var cellData = GridStore.getData( dragRow, dragCell );
		//cellData.image = "images/orange.jpeg";
		var revert = true;

		GridStore.swap( dropRow,dropCell,dragRow,dragCell );
		//console.log("Check " , dropRow, " : " , dropCell)
		var hMatches = GridStore.matchHorizontally( dropRow,dropCell );
		var vMatches = GridStore.matchVertically( dropRow,dropCell );
		//console.log("Horizontal Matches -> " , hMatches );
		//console.log("Vertical Matches -> " , vMatches );

		if( hMatches.length >= MATCHSIZE || vMatches.length >= MATCHSIZE ) revert=false;
		// If no matches revert change back...
		if( revert ) GridStore.swap( dropRow,dropCell,dragRow,dragCell );
		else {

			var destroy = [];
			if( hMatches.length >= MATCHSIZE ) destroy = R.concat( destroy, hMatches );
			if( vMatches.length >= MATCHSIZE ) destroy = R.concat( destroy, vMatches );
			destroy = R.uniq( destroy );
			GridStore.destroy( destroy );
			GridStore.reflowGrid();

			//console.log("Unique matches to destroy: " , destroy);
		}

		this.setState( { dragging: undefined } );
	}

	render(){
		var grid = GridStore;

		var _self = this;
		var grid = GridStore;
		var dragHandlers = {
			start: this.handleDragStart.bind(this),
			finish: this.handleDropFinish.bind(this)
		}
		var rows = grid.getRowData().map( function(row,idx){
			return ( 
				<RowView
					dragElement={_self.state.dragging}
					dragHandlers={dragHandlers}
					key={idx} idx={idx} cols={_self.props.cols} rows={_self.props.rows} row={idx}/>
			)
		});
		return (
			<div className="grid">{rows}</div>
		);
	}
}

class RowView  extends React.Component {
	shouldComponentUpdate(nextProps,nextState){
		//console.log("Row Updating " , arguments);
		return true;
	}

	render(){
		var _self = this;


		var cells = GridStore.getCellData( this.props.row ).map( (cell,idx) => {
			return (
				<CellView className="CCX" 
					dragElement={_self.props.dragElement}
					row={_self.props.row} cell={idx} key={idx} dragHandlers={_self.props.dragHandlers}/>
			)
		});

		return (
			<div className="row">{cells}</div>
		)
	}
}

class CellView extends React.Component {
	constructor(){
		super();
		this.state = {
			highlight: false
		}
	}

	shouldComponentUpdate(nextProps,nextState){
		//console.log("Cell Updating " , arguments);
		this.highlight( false );
		return true;
	}

	highlight( value ){
		this.setState({
			highlight: value
		});
	}

	validDropPoint(){
		var cdiff = Math.abs( this.props.cell - this.props.dragElement.cell ),
			rdiff = Math.abs( this.props.row  - this.props.dragElement.row );

		if( (cdiff == 1 && rdiff == 0) || (cdiff==0 && rdiff==1) ){
			return true;
		} 		
		return false;
	}
	handleDragEnter(e){

		if( this.validDropPoint() ){
			this.highlight( true );
			e.preventDefault();
		} 

	}
	handleDragOver(e){

		if( this.validDropPoint() ){
			e.preventDefault();
		} 

	}
	handleDragLeave(e){
		//console.log("Handle drag leave ", this);
		this.highlight( false );
	}

	handleDrop(e){
		if( this.validDropPoint() ){
			//console.log("Handle the drop...");
			this.props.dragHandlers.finish(this.props.row, this.props.cell , this.props.dragElement.row, this.props.dragElement.cell);
		}
	}

	render(){

		var data = GridStore.getData( this.props.row,this.props.cell );
		var dh = this.props.dragHandlers;
		var classes = "cell";
		if( this.state.highlight ) classes += " highlight";
		return (
			<div className={classes} 
				 data-row={this.props.row} data-cell={this.props.cell} 
				 draggable="true" 
				 onDragStart={dh.start} 
				 onDragEnter={this.handleDragEnter.bind(this)} 
				 onDragLeave={this.handleDragLeave.bind(this)}
				 onDragOver={this.handleDragOver.bind(this)} 
				 onDrop={this.handleDrop.bind(this)} 
				 onDragEnd={dh.end}>
				 <img src={data.image}></img>
				
			</div>
		)

	}
}

var GridStore = ( function(cols,rows, render){

	var Interface = {};

	/*
		To help UI do rows x cols 
	*/
	var types = [ 'orange',"cherry","strawberry","banana","apple" ];
	var getInfo = function(){
		var pos = Math.floor( Math.random() * (types.length - 0) + 0 );
		return {
			image: 'images/' + types[pos] + '.jpeg',
			type: types[pos]
		};	
	} 
	var grid = [];


	function emptyItem(){
		return {
			image: '',
			type: 'empty'
		}
	}
	function updateView(){
		render();
	}

	Interface.init = () => {
		updateView();
	}
	Interface.createGrid = () => {
		for( var r=0; r<rows; r++ ){
			grid[r] = [];
			for( var c=0; c<cols; c++ ){
				Interface.addItem( r,c );
			}
		}		
	}
	Interface.addItem = ( r,c ) => {
		do {
			grid[r][c] = getInfo();
			var matches = Interface.matches( r,c );
		} while( matches.length > 0 )		
	}
	Interface.getColumns = () => { return cols };
	Interface.getRows = () => { return rows };
	Interface.getRowData = () => { return grid };
	Interface.getCellData = (row) => { return grid[row] };
	Interface.getData = (row,cell) => { return ( grid && grid[row] ) ? grid[row][ cell ] : undefined; }
	Interface.setData = (row,cell,data) => {
		var cellData = Interface.getData( row,cell );
		grid[row][cell] = R.merge( cellData,data );		
		updateView();
	};
	Interface.swap = ( r1,c1,r2,c2 ) => {
		var tmp = Interface.getData( r1,c1 );
		grid[r1][c1] = grid[r2][c2];
		grid[r2][c2] = tmp;
		updateView();
	}
	Interface.validPos = ( row,col ) => {
		if( row < 0 || row >= rows ) return false;
		if( col < 0 || cols >= cols ) return false;
		return true;
	}
	Interface.destroy = ( itemList ) => {
		console.log("Destroy Items " , itemList );
		itemList.forEach( ( v,i ) => {
			console.log(i , " - " , v , " <= ");
			grid[ v.row ][ v.col ] = emptyItem();
		});
	}
	Interface.findEmpty = () => {
		var items = [];
		for( var r=0; r<rows; r++ ){
			for( var c=0; c<cols; c++ ){
				var item = grid[r][c];
				if( item.type === 'empty' ){
					// console.log("Empty item ", item);
					items.push( {
						col: c,
						row: r,
						item: item,
						idx: Interface.toIdx( r,c )
					});
				}
			}
		}
		return items;
	}
	Interface.toIdx = (row,col) => {
		return ( row * rows ) + col;
	}
	Interface.reflowItem = (item) => {
		console.log("Reflow: ", item);

		var row = item.row, col = item.col;
		// at top and empty create new and finish
		if( row == 0 ){
			if( item.item.type == 'empty' ){
				Interface.addItem( row,col );
				//grid[ row ][ col ] = getInfo();
				return;				
			}
			console.log("Current item " , item );
			return;
		}

		console.log("Reflow 2: ", row, " : " , col );
		// Swap with one above
		Interface.swap( row, col, row -1, col);

		// Now the one above is empty we better reflow that too :)
		var nextItem = Interface.getData( row-1,col );
		Interface.reflowItem( {
			row: row-1,
			col: col,
			item: nextItem
		});
	}
	Interface.reflowGrid = () => {
		console.log("Check grid for empty items and reflow or add new ");
		var items = Interface.findEmpty();
		items = R.sort( (a,b) => { return a.idx - b.idx } , items );
		console.log("Items to reflow -> " , items );

		// Starting from the top (idx) look above and pull down
		R.forEach( Interface.reflowItem, items );
	}

	Interface.matches = ( row,col ) => {
		var hMatches = GridStore.matchHorizontally( row,col );
		var vMatches = GridStore.matchVertically( row,col );

		if( hMatches.length >= MATCHSIZE || vMatches.length >= MATCHSIZE ) {
			var matches = [];
			if( hMatches.length >= MATCHSIZE ) matches = R.concat( matches, hMatches );
			if( vMatches.length >= MATCHSIZE ) matches = R.concat( matches, vMatches );
			matches = R.uniq( matches );
			return matches;
		}

		return [];
	}

	Interface.matchHorizontally = ( row,col ) => {
		var startItem = Interface.getData( row,col );

		console.log(item," :: ", startItem)
		if( startItem === undefined ) return [];
		var matches = [{col: col,row: row,item: startItem }];
		// Check to left
		//console.log("hMatch against: ", startItem)
		for( var c=col-1; c>=0;c--){
			var item = Interface.getData( row,c );
			console.log(item," :: ", startItem)
			if( item === undefined || startItem === undefined) break;
			if( item.type !== startItem.type ) {
				//console.log("hMatch ", item, " -> (",row,",",c,") : " , matches.length);
				break;
			}
			matches = R.prepend({
				col: c,
				row: row,
				item: item
			}, matches );
		}

		// Check left 
		for( var c=col+1; c<cols;c++){
			var item = Interface.getData( row,c );
			//console.log("hMatch ", item, " -> (",row,",",c,") : " , ( item.type !== startItem.type ));
			if( item === undefined || startItem === undefined) break;
			if( item.type !== startItem.type ) {
				console.log("hMatch ", item, " -> (",row,",",c,") : " , matches.length);
				break;
			}
			matches = R.prepend({
				col: c,
				row: row,
				item: item
			}, matches );
		}
		// console.log("hMatches = " , matches.length);
		// console.log("hMatches = ", matches );
		return matches;
	}
	Interface.matchVertically = ( row,col ) => {
		var startItem = Interface.getData( row,col );
		if( startItem === undefined ) return [];

		var matches = [{col: col,row: row,item: startItem }];
		// Check to left
		for( var r=row-1; r>=0;r--){
			var item = Interface.getData( r,col );
			if( item === undefined || startItem === undefined) break;
			if( item.type !== startItem.type ) {
				//console.log("VMatch ", item, " -> (",r,",",col,") : " , matches.length);
				break;
			}
			matches = R.prepend({
				col: col,
				row: r,
				item: item
			}, matches );
		}

		// Check left 
		for( var r=row+1; r<rows;r++){
			var item = Interface.getData( r,col );
			if( item === undefined || startItem === undefined) break;
			if( item.type !== startItem.type ) {
				//console.log("VMatch ", item, " -> (",r,",",col,") : " , matches.length);
				break;
			}

			matches = R.prepend({
				col: col,
				row: r,
				item: item
			}, matches );
		}

		// console.log("vMatches = " , matches.length);
		// console.log("vMatches = ", matches );
		return matches;
	}	
	// row x column 
	Interface.LEFT = [0,-1];
	Interface.RIGHT = [0,1];
	Interface.UP = [-1,0];
	Interface.DOWN = [1,0];

	return Interface;

} )(5,10,()=>{
	var cols = GridStore.getColumns(), rows = GridStore.getRows();

	var gridView = ( <GridView cols={cols} rows={rows}/> ),
	display = document.getElementById('example');
	ReactDOM.render(gridView,display);

});

GridStore.createGrid();
GridStore.init();




