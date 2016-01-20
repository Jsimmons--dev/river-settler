import {types} from "./model/types";

export function createPiece(type,pos){
	var piece = {type:type, pos:pos};
	return piece;
}
export function createHex(type,pos){
	var hex = {type:type, pos:pos};
	return hex;
}

export function createRow(types,offset,height){
	var newRow = [];
	types.forEach(function(type,i){
		newRow.push(createHex(type,[i+offset,0,height]));
	});
	return newRow;
}

export function createBoard(rowArray,offset,height){
		var board = [];
		var y = height;
		rowArray.rowEach(function(d,i){
			createRow(d,offset+i,y);
			y++;
		});
		return board;
}

export function createSimpleBoard(pos){
		var board = {};
		board.tiles = [];
		board.tiles.push(createRow(['grain','lumber','wool'],0,0));
		board.tiles.push(createRow(['brick','lumber','grain','lumber'],0,1));
		board.tiles.push(createRow(['ore','grain','desert','grain','wool'],-1,2));
		board.tiles.push(createRow(['brick','wool','brick','ore'],0,3));
		board.tiles.push(createRow(['lumber','grain','ore'],0,4));
		return board;

}

export var hexTypes = types;

