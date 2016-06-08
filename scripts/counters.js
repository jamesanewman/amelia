
export class BaseCounter {

	// 
}

export class BaseZombie extends BaseCounter {
	constructor( opts ){
		super();
		console.log("Base zombie created ",opts);
		this.delay = opts.item.delay;
		this.opts = opts;
		this.point = { x:0, y:0 };
	}

	getImage(){
		return this.opts.result;
	}

	setPoint( point ){
		this.point.x = point.x;
		this.point.y = point.y;
	}

	move(){
		this.point.x--;
	}

}