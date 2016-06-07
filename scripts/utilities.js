function sendNotification( newValue, oldValue, listener ){
	if( !listener || !listener.callback ) return;

	var customData = R.pick( ['data','identifier'], listener );
	listener.callback( newValue,oldValue,customData  );
}

export class Observable {

	constructor( value ){
		this._value = value;
		this._listeners = [];
		this._identifier = 1;
	}

	register( callback, data ){

		this._identifier++;
		var customData = {
			identifier: this._identifier,
			data: data,
			callback: callback
		}
		this._listeners.push( customData );
		return this._identifier;

	}

	notify( newValue,oldValue ){
		var send = R.partial( sendNotification,[newValue,oldValue] );
		R.forEach( send, this._listeners );
	}

	remove( identifier ){
		this._listeners = R.filter( R.compose( R.not, R.propEq( 'identifier', identifier )), this._listeners );
	}

	get value(){
		return this._value;
	}

	set value( val ){
		var temp = this._value;
		this._value = val;
		this.notify( val , temp );
	}
}

function test(){

	function onChange( newValue,oldValue,customData ){
		console.log( "Changed Values: (",newValue,",",oldValue,",",customData,")");
	}

	console.log('=========================');
	console.log("Tests for Observable Running...")
	var obs = new Observable( 5 );
	console.log("OV: " , obs.value );
	var id = obs.register( onChange, { test: "customData"} );
	var id2 = obs.register( onChange, { test: "second Test"} );
	obs.value = 9;

	console.log("Remove id ", id );
	obs.remove( id );
	obs.value = 2;
	console.log('=========================');
}

// test()