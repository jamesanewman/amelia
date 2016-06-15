
// - ui
// 	- main panel
// 		- grid
// 			- columns
//				- slot

class SlotView extends React.Component {
	constructor(){ 
		super();
		this.state = {
			clickCount: 0
		}
	}

	handleClick(e){ 

		this.setState( { clickCount: this.state.clickCount+1 });
		console.log("CLICK.,.,..",e,this.state);
	}

	render(){
		var props = this.props;
		return (<div className="slot" draggable="true" onClick={this.handleClick.bind(this)}>
			<p>{props.data.text}</p>
			<p>Click Count: { this.state.clickCount }</p>
		</div>);
	}
}

class RowView extends React.Component {
	constructor(){ 
		super();
	}


	render(){

		var props = this.props;
		var cols = props.row.map( function(col,idx){
			return ( 
				<SlotView key={idx} col={idx} row={props.idx} data={props.row[idx]}/>
			)
		});
		return (<div className="row">{cols}</div>);
	}
}
var Grid = React.createClass({
	render: function(){
		var cols=this.props.cols;
		var grid = this.props.grid;
		var rows = grid.map( function(row,idx){
			return ( 
				<RowView key={idx} idx={idx} cols={cols} row={grid[idx]}/>
			)
		});
		return (
			<div className="grid">
			{rows}
			</div>
			);
	}
});

var grid = [];
for( var r=0; r<5;r++){
	grid[ r ] = [];
	for( var c=0; c<5;c++){
		grid[r][c] = { type: "X", text: "Empty" };
	}
}

function draw( gridData ){
	var gridView = ( <Grid cols="5" rows="5" grid={grid}/> ),
	display = document.getElementById('example');
	ReactDOM.render(gridView,display);
}

draw( grid ) ;
setTimeout( () => { 
	console.log("Updating..."); 
	grid[1][1] = { type: "X", text: "NEW" }; 
	console.log("Grid: ", grid)
	//ReactDOM.render(( <Grid cols="5" rows="5" grid={grid}/> ),display);
	draw( grid );
} , 1000)