export class Rules {
	constructor(grid){
		this.grid = grid;
	}

	/**
	Test grid, find out if any matches exist
	**/
	hasMatch( column,row ){

		var totalColumns = this.grid.columns,
			totalRows = this.grid.rows,
			match = false,
			src = this.grid.getItem( column,row );

		var info = R.omit( ['item'], this.grid.getAdjacentItems( column,row ) );

		for( var direction in info ){
			var target = info[ direction ];


		}


	}


}

/*

Rules: API
- getItem( DIRECTION, COL, ROW ) :: item => getNorth, getSouth, getEast, getWest
- slot2Item( col, row ) :: item 
- item2Slot( item ) :: [col,row]

var totalColumns = 5, totalRow = 5;
directions = { 'north': [0,1], 'south': [0,-1], 'east': [1,0], 'west': [-1,0], 'center': [0,0] };
getDirection = (direction) => { return R.prop(direction,directions); }
getItemFrom = function(direction,col,row){
	var newPos = updatePosTo( direction,col,row );
	return grid[ newPos[0] ][ newPos[1] ];
}
getItem = R.partial( getItemFrom, [ 'center' ] );
getEastItem = R.partial( getItemFrom, [ 'east' ] );
getWestItem = R.partial( getItemFrom, [ 'west' ] );
getSouthItem = R.partial( getItemFrom, [ 'south' ] );
getNorthItem = R.partial( getItemFrom, [ 'north' ] );

checkNextIsSame( direction, item, col, row ){
	return item.isSameType( getItemFrom(direction,col,row) );
}
isSame( item,col,row ){
	return item.isSameType( getItem(col,row) );
}
updatePosTo( direction, col, row ){
	var v = getDirection( direction );
	return [ col+v[0], row+v[1] ];
}
isValidSlot=function( col,row ){
	if( col < 0 || col >= totalColumns ) return false;
	if( row < 0 || row >= totalRows ) return false;
	return true;
}
moveTo = function( direction,col,row ){
	var pos = updatePosTo( direction, col, row ),
		currentItem = getItem( col, row ),
		items = [];
	while( && isSame(currentItem,pos[0],pos[1]) ){
		items.push( getItem( pos[0],pos[1] ) );
		pos = updatePosTo( direction, col, row );
	}
	return items;
}
*/

