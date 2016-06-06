export class Level {
	constructor( ){
		console.log('Create Level... ' );
		this.loaded = false;
		this.resourceQueue = new createjs.LoadQueue( false );
		this.resourceQueue.setMaxConnections( 5 );

		this.zombies = [];
	}

	load( levelURI ){

		return new Promise( function( resolve,reject ){
			// load resources
			this.resourceQueue.loadManifest( levelURI );
			this.resourceQueue.load();
			this.resourceQueue.on("complete",function( event,type ){
				// console.log("xManifest completely loaded " , arguments);
				// console.log("XManifest Target: " , event.target)
				// console.log("XManifest Result: " , this.resourceQueue.getResult("dancer2"))
				// console.log("XManifest items: " , this.resourceQueue.getItems())
				this.zombies = this.getZombies();
				resolve( this.resourceQueue );
			},this);
			this.resourceQueue.on("fileload",function(event){
				console.log("Manifest file loaded " , event.result);			
			},this);
		}.bind(this));

	}

	getImage( id ){
		console.log("Resources " , this.resourceQueue.getItems())
		return this.resourceQueue.getResult( id );
	}

	getDataItems(){
		return R.filter( R.complement(R.not), R.map(R.path(['item','data']),this.resourceQueue.getItems()) );
	}
	
	getZombies(){
		console.log("Items: " , this.resourceQueue.getItems());
		console.log("Data: ", this.getDataItems() );
		return R.filter( R.propEq("type","zombie"), this.getDataItems() );
	}
}