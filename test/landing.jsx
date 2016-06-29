export function renderLandingPage( elementId ){
	ReactDOM.render( 
		(
			<div className="display">
				<PlayersList source="/data/players.json"></PlayersList>
			</div>
		)
		, document.getElementById(elementId) 
	);
}

function dataExtractData( result ){
	console.log("Extract Data " , result );
	return result;
}

function dataExtractPlayer( playerName , players ){
	console.log("Extract pLAYER " , players );
	if( !players || !players[playerName] ) return {};
	return players[ playerName ];
}

class PlayersList extends React.Component {

	constructor(){
		super();
		this.state = {
			players: []
		}
	}

	setPlayers( playersData ){
		this.setState( {
			players: R.values( playersData )
		} );
		return playersData;
	}

	componentDidMount() {
		var _self = this;

	    this.serverRequest = $.get( this.props.source )
	    						.then( dataExtractData )
	    						.then( _self.setPlayers.bind( _self ) );
	}

	componentWillUnmount() {
	    this.serverRequest.abort();  
	}

	handlePlayerClick(e,playerName){
		console.log("PlayerList player -> " , playerName );
	}

	render(){

		console.log("Players state " , this.state.players )

		var _self = this,
			playerCards = this.state.players.map( function( playerData,idx ){
				console.log( idx + " Player = " , playerData );
				return ( <PlayerCard player={playerData} key={idx} clickHandler={_self.handlePlayerClick.bind(_self)}></PlayerCard> );
			});

		console.log("Player cards = ", playerCards);
		return (
			<div className="list players">
				{playerCards}
			</div>
		)
	}

}

class PlayerCard extends React.Component {
	constructor(){
		super();
		this.state = { name: "unknown" };
	}

	handleClick(e){
		console.log("Clicked player " , this.state );
		if( this.props.clickHandler ){
			console.log("Handler detected");
			this.props.clickHandler( e, this.state );
		}
	}

	componentDidMount() {
		this.setState( this.props.player );	      
	}

	render(){
		return (
			<div className="std-size card" onClick={this.handleClick.bind(this)}>
				<p className="field name">{this.state.name}</p>
			</div>
		)
	}

}