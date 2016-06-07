export class Level {
	constructor( ){
		console.log('Create Level... ' );
		this.loaded = false;
		this.resourceQueue = new createjs.LoadQueue( false );
		this.resourceQueue.setMaxConnections( 5 );
		this.zombies = [];
		this.zombieQueue = [];
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
				console.log("XManifest items: " , this.resourceQueue.getItems())

				resolve( this.resourceQueue );
			},this);
			this.resourceQueue.on("fileload",function(event){
				// console.log("Manifest file loaded " , event.result);			
			},this);
		}.bind(this));
	}

	getImage( id ){
		console.log("Resources " , this.resourceQueue.getItems())
		return this.resourceQueue.getResult( id );
	}

	getDataItems(){
		console.log("Items: " , this.resourceQueue.getItems());
		return R.map(R.prop('item'),this.resourceQueue.getItems()) ;
	}

	getZombies(){
		console.log("Get items = " , this.getDataItems());
		return R.filter( R.pathEq(['item','itemtype'],'zombie'), this.resourceQueue.getItems());
	}

	startLevel(){
		console.log("Preparing level...");
		this.zombies = R.map( this.createZombie.bind(this), this.getZombies() );
	}

	createZombie( zombie ){
		var z = ZombieFactory( zombie );
		console.log("Created zombie" ,zombie.result);
		this.queueZombie( z );
	}

	queueZombie(zombie){
		console.log("Zombie should be ready in " , zombie.delay, " secs")
		var _self = this;
		setTimeout( function(){
			console.log("Zombie online...");
			_self.zombieQueue.push( zombie );
		}, zombie.delay );
	}
}