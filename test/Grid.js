var globalId = 0;
export class Slot {
	/**
		content of the grid.  Identified by 2 vars, currently column and row
	**/
	constructor( id1,id2,data ){
		globalId++;

		this.identifier1 = id1;
		this.identifier2 = id2;
		this.data = data || {};
		this.history = [];
		this.type = data.type;
		this.uid = globalId;

	}


	// Override is non-empty override objects
	isEmpty(){ return true; }
	addToHistory( item ){ this.history.push( item ); }
	clearHistory(){ this.history = []; }
	isSameType( item ){
		return this.type === item.type;
	}
	toHTML(){
		return this.type + " - " + this.uid; 
	}
}

export class NullSlot extends Slot {
	constructor( id1,id2,data ){
		var defData = { type: "undefined" },
			mergedData = R.merge( defData, data );

		super( id1,id2,mergedData );
	}
}

export class EmptySlot extends Slot {
	constructor( id1,id2,data ){
		var defData = { type: "empty" },
			mergedData = R.merge( defData, data );

		super( id1,id2,mergedData );
	}
}


export class ItemSlot extends Slot {
	constructor( id1,id2,data ){
		var defData = { type: "item" },
			mergedData = R.merge( defData, data );

		super( id1,id2,mergedData );
	}

	isEmpty(){ return false; }
}

export class CherrySlot extends Slot {
	constructor( id1,id2,data ){
		var defData = { type: "cherry" },
			mergedData = R.merge( defData, data );

		super( id1,id2,mergedData );
	}

	isEmpty(){ return false; }
	toHTML(){
		return '<img src="images/cherry.jpeg">';
	}
}

export class OrangeSlot extends Slot {
	constructor( id1,id2,data ){
		var defData = { type: "orange" },
			mergedData = R.merge( defData, data );

		super( id1,id2,mergedData );
	}

	isEmpty(){ return false; }
	toHTML(){
		return '<img src="images/orange.jpeg">';
	}
}

export class BananaSlot extends Slot {
	constructor( id1,id2,data ){
		var defData = { type: "banana" },
			mergedData = R.merge( defData, data );

		super( id1,id2,mergedData );
	}

	isEmpty(){ return false; }
	toHTML(){
		return '<img src="images/banana.jpeg">';
	}
}

export class StrawberrySlot extends Slot {
	constructor( id1,id2,data ){
		var defData = { type: "strawberry" },
			mergedData = R.merge( defData, data );

		super( id1,id2,mergedData );
	}

	isEmpty(){ return false; }
	toHTML(){
		return '<img src="images/strawberry.jpeg">';
	}
}


export class AppleSlot extends Slot {
	constructor( id1,id2,data ){
		var defData = { type: "apple" },
			mergedData = R.merge( defData, data );

		super( id1,id2,mergedData );
	}

	isEmpty(){ return false; }
	toHTML(){
		return '<img src="images/apple.jpeg">';
	}
}



function random(min,max){
	max--;
	return Math.round( Math.random() * (max - min) + min );
}

function SlotFactory( id1,id2,data ){
	var slotTypes = [ 'Orange',"Cherry","Strawberry","Banana","Apple" ],
		randSlot = random( 0,slotTypes.length ),
		slotName = slotTypes[ randSlot ] + "Slot";
	return new window[slotName]( id1, id2, data );
}

export class Grid {

	/**
	A column based grid system.  Columns because it is initially 
	a candy crush like system.
	Intention is to extend this with the rule system.

	0,0 is bottom left
	**/

	constructor( columns,rows ){
		this.grid = [];
		this.columns = columns;
		this.rows = rows;
		this.minMatch = 3;
		this.init();


	}

	init(){
		for( var c=0; c<this.columns; c++ ){
			// this.grid[ c ] = [];
			// for( var r=0; r<this.rows; r++ ){
			// 	this.grid[ c ][ r ] = SlotFactory( c,r,{} );
			// 	this.grid[ c ][ r ].addToHistory( { message: "Initialised: " +Date() } );
			// }			
			this.fillColumn( c );
		}
	}

	fillColumn( column ){
		if( !this.grid[ column ] ) this.grid[ column ] = [];
		for( var r=0; r<this.rows; r++ ){
			var i = this.getItem( column,r );
			if( !i || i.isEmpty() ) this.grid[ column ][ r ] = SlotFactory(column,r,{});
		}
	}

	getColumn( column ){
		return this.grid[ column ];
	}

	getRow( row ){
		var items = [];
		for(var c=0; c<this.columns; c++){
			items.push( this.grid[ c ][ row ] );
		}
		return items;
	}

	getItem( column, row ){
		if( column >= this.columns || column < 0 ) return new NullSlot(-1,-1,{});
		if( row >= this.rows || row < 0 ) return new NullSlot(-1,-1,{});
		return this.grid[ column ][ row ];
	}
	findItemByUID(uid){
		var	item = this.findByUID( uid );
		if( !item ) return undefined;
		return item.item;
	}
	
	findPosByUID(uid){
		var	item = this.findByUID( uid );
		if( !item ) return undefined;
		return [ item.col , item.row ];
	}

	findByUID(uid){
		for( var c=0; c<this.columns; c++ ){
			for( var r=0; r<this.rows; r++ ){
				var slotItem = this.getItem( c,r );
				//console.log("Match UID = ",slotItem.uid,":",uid);
				if( slotItem.uid == uid ) return {
					col: c,
					row: r,
					item: slotItem
				};				
			}			
		}
		return undefined;	
	}

	findItem( item ){
		// find item within grid return [c,r]
		for( var c=0; c<this.columns; c++ ){
			for( var r=0; r<this.rows; r++ ){
				var slotItem = this.getItem( c,r );
				if( slotItem === item ) return [ c,r ];				
			}			
		}
		return undefined;
	}

	canSwapItems( uid1,uid2 ){
		var i1 = this.findByUID( uid1 ), 
			i2 = this.findByUID( uid2 ),
			cDiff = Math.abs( i1.col-i2.col ),
			rDiff = Math.abs( i1.row-i2.row );

		if( !i1 || !i2 ) return false;

		if( cDiff == 0 && rDiff == 1 ) return true;
		if( cDiff == 1 && rDiff == 0 ) return true;

		return false;
	}

	swapItems( col1,row1, col2,row2 ){

	}

	swapUID( uid1, uid2 ){
		var slot1 = this.findByUID( uid1 ),
			slot2 = this.findByUID( uid2 );

		var tmp = slot1.item;
		this.grid[ slot1.col ][ slot1.row ] = slot2.item;
		this.grid[ slot2.col ][ slot2.row ] = tmp;

	}
	// ==== Extended items ======
	getAdjacentItems( column, row ) {
		var items = {
			item: this.getItem( column,row ),
			north: this.getItem( column, row-1 ),
			south: this.getItem( column,row+1),
			east: this.getItem( column+1,row),
			west: this.getItem( column-1,row)
		};
		return items;
	}



	// Search full grid for all matches
	getMatches(){
		var allMatches = [];
		for( var c=0; c<this.columns; c++ ){
			for( var r=0; r<this.rows; r++ ){
				var matches = this.isHorizontalMatch(c,r);
				if( matches.length >= this.minMatch ) {
					//console.log(`[${c},${r}] horizontal matches ${matches.length} -> `, matches );
					allMatches.push(matches);
				}
				var matches = this.isVerticalMatch(c,r);
				if( matches.length >= this.minMatch ) {
					//console.log(`[${c},${r}] vertical matches ${matches.length} -> `, matches );
					allMatches.push( matches );
				}
			}			
		}
		console.log("Full match list (${allMatches.length}): " , allMatches);
	}


	getMatch( column,row ){

		var westMatches = this.recursiveMatch( function(col,row){
			return [ --col,row ];
		}, column,row );

		console.log(`west matches (${column},${row}: `, westMatches);

		var eastMatches = this.recursiveMatch( function(col,row){
			return [ ++col,row ];
		}, column,row );

		console.log(`east matches (${column},${row}: `, eastMatches);

		// both contain center item so drop from one
		var full = R.concat( R.tail(westMatches), eastMatches);
		console.log("All matches " , full);

	}

	recursiveMatch( moveFunc, startColumn, startRow ){

		var startItem = this.getItem( startColumn, startRow ),
			items = [startItem],
			finished = false,
			nextCol = startColumn,
			nextRow = startRow;


		console.log( `${startColumn},${startRow} -> `, startItem.type );

		//var tmp = 0;
		//while( startItem.isSameType( nextItem ) ){
		do {

			[ nextCol, nextRow ] = moveFunc( nextCol, nextRow );
			var nextItem = this.getItem( nextCol, nextRow );

			if( !startItem.isSameType( nextItem ) || nextCol < 0 || nextCol >= this.columns || nextRow < 0 || nextRow >= this.rows ){
				finished = true;				
			} else {
				items.push( nextItem );
			}

			//if( ++tmp > 10 ) finished = true;
			//console.log( `${nextCol},${nextRow} -> `, nextItem.type , " : " , startItem.isSameType( nextItem ));
			// [ nextCol, nextRow ] = moveFunc( nextCol,nextRow );
			// nextItem = this.getItem( nextCol, nextRow );

		} while( !finished );
		return items;
	}


	// treat as first (west most item)
	isHorizontalMatch( column,row ){
		var startItem = this.getItem( column,row );
		var matches = [ startItem ], offset=1;
		var item; // Do as iterator

		// if on right side no point checking
		if( this.columns - column - this.minMatch + 1 < 0 ) return [];

		while( (item=this.getItem(column+offset,row)) ){
			//console.log( "[",column+offset,",",row,"] -> " , item.type );
			if( item.type !== startItem.type ) break;
			if( item.type === 'empty' ) break;
			matches.push( item );
			offset++;

		}
		if( matches.length < this.minMatch ) return [];
		return matches;
	}

		// treat as first (west most item)
	isVerticalMatch( column,row ){
		var startItem = this.getItem( column,row );
		var matches = [ startItem ], offset=1;
		var item; // Do as iterator

		// if on right side no point checking
		if( this.rows - row - this.minMatch + 1 < 0 ) return [];

		while( (item=this.getItem(column,row+offset)) ){
			//console.log( "[",column+offset,",",row,"] -> " , item.type );
			if( item.type !== startItem.type ) break;
			if( item.type === 'empty' ) break;
			matches.push( item );
			offset++;

		}
		if( matches.length < this.minMatch ) return [];
		return matches;
	}
}