export function renderLandingPage( elementId,player ){
	ReactDOM.render( 
		( <LandingScreen source="/data/players.json"/>)
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
class LandingScreen extends React.Component {

	constructor(){
		super();
		this.state = {
			players: [],
			currentPlayer: undefined
		};
	}

	setPlayers( playersData ){
		this.setState( { players: playersData });
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

	selectPlayer(e,player){
		console.log("LS PlayerList player -> " , player.name );
		this.setState( { currentPlayer: player.name } );
	}

	getPlayer( playerName ){
		playerName = playerName || this.state.currentPlayer;
		console.log( playerName , " => " , R.values(this.state.players) );
		return R.find( R.propEq('name',playerName ), this.state.players );
	}

	render(){

		console.log("Players state " , this.state.players )

		var _self = this,
			currentPlayer;

		if( this.state.currentPlayer ){
			console.log("This player -> " , this.getPlayer() );
			currentPlayer = <PlayerCard display="full" player={this.getPlayer()}></PlayerCard>
		}

		console.log("Player LS = " , this.state.players );
		console.log("CPlayer LS = " , this.state.currentPlayer );
		
		return (
			<div className="screen display landing-screen">
				<div className="large-display">
					{currentPlayer}
				</div>
				<PlayersList players={this.state.players} onPlayerSelect={this.selectPlayer.bind(this)}></PlayersList>
			</div>
		)
	}

}

class PlayersList extends React.Component {

	constructor(){
		super();

	}

	handlePlayerClick(e,playerName){
		console.log("PlayerList player -> " , playerName );
		if( this.props.onPlayerSelect ){
			this.props.onPlayerSelect( e,playerName );
		}
	}

	render(){

		console.log("Players props " , this.props )

		var _self = this,
			playerCards = this.props.players.map( function( playerData,idx ){
				console.log( idx + " Player = " , playerData );
				return ( <PlayerCard player={playerData} key={idx} clickHandler={_self.handlePlayerClick.bind(_self)}></PlayerCard> );
			});

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
		//this.state = { name: "unknown" };
	}

	handleClick(e){
		console.log("Clicked player " , this.props.player );
		if( this.props.clickHandler ){
			console.log("Handler detected");
			this.props.clickHandler( e, this.props.player );
		}
	}

	componentDidMount() {
		//this.setState( this.props.player );	      
	}

	componentDidUpdate(prevProps, prevState) {
	      
	}
	render(){
		var details,
			classes = "card",
			player = this.props.player;

		switch( this.props.display ){

			case 'full':
				details = (	<p>{player.desc}</p> );
				classes += " full-size detailed-display";
				console.log("Setting up a detailed player ", player )
				break;
			default: 
				classes += " std-size card-button";
				break;
		}


		return (
			<div className={classes} onClick={this.handleClick.bind(this)}>
				<p className="field name">{player.name}</p>
				{details}
			</div>
		)
	}

}