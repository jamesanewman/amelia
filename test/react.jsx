function findDragTargetElement(target){
	while( !target.attributes.getNamedItem('draggable') ){
		target = target.parentElement;
	}	
	return target;
}

class GridView  extends React.Component {

	constructor(){
		super();
		this.state = {
			dragging: undefined
		}
	}

	shouldComponentUpdate(nextProps,nextState){
		console.log("Grid Updating " , arguments);
		return true;
	}
	handleDragStart(e){

		//console.log("cell -> " , R.join( '\n', R.keysIn( e.target )));
		var current = findDragTargetElement(e.target);
		var attrs = current.attributes;

		console.log("Handling drag ", arguments);
		console.log("Target = ", e.target , " -> " , attrs);
		console.log("cell -> " , current);

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
		GridStore.swap( dropRow,dropCell,dragRow,dragCell );
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
		console.log("Handle drag leave ", this);
		this.highlight( false );
	}

	handleDrop(e){
		if( this.validDropPoint() ){
			console.log("Handle the drop...");
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
	var images = [ 'images/orange.jpeg',"images/cherry.jpeg","images/strawberry.jpeg","images/banana.jpeg","images/apple.jpeg" ];
	var getImage = function(){
		var pos = Math.floor( Math.random() * (images.length - 0) + 0 );
		return images[ pos ];	
	} 
	var grid = [];
	for( var r=0; r<rows; r++ ){
		grid[r] = [];
		for( var c=0; c<cols; c++ ){
			grid[r][c] = {
				type: "empty",
				image: getImage()
			}
		}
	}

	function updateView(){
		render();
	}

	Interface.init = () => {
		updateView();
	}

	Interface.getColumns = () => { return cols };
	Interface.getRows = () => { return rows };
	Interface.getRowData = () => { return grid };
	Interface.getCellData = (row) => { return grid[row] };
	Interface.getData = (row,cell) => { return grid[row][ cell ]; }
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
	return Interface;

} )(5,10,()=>{
	var cols = GridStore.getColumns(), rows = GridStore.getRows();

	var gridView = ( <GridView cols={cols} rows={rows}/> ),
	display = document.getElementById('example');
	ReactDOM.render(gridView,display);

});

GridStore.init();
setTimeout( ()=>{
	console.log("Update Grid")
	GridStore.setData(2,2, { type: "brillant" }); 
}, 1000);



