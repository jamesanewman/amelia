
export class BaseCounter {

	// 
}

export class BaseZombie extends BaseCounter {
	constructor( opts ){
		super();
		console.log("Base zombie created ",opts);
		this.delay = opts.item.delay;
		this.opts = opts;
	}

	getImage(){
		return this.opts.result;
	}

}