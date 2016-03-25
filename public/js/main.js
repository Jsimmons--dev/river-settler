"use strict";
import * as model from "./model/model";
import * as view from "./view/view";
import * as controller from "./controller/controller";
import * as loader from "./utils/assetLoader";

loader.loader(view.meshes,main);

function main() {
	var myGame = new model.Game();
	myGame.genBoard(4, 7);
	var gameState = new model.GameState(myGame);
	myGame.pushGameState(gameState);
	var player0 = new model.PlayerState(gameState);
	player0.color = 'orange';
	gameState.pushPlayerState(player0);
	var player1 = new model.PlayerState(gameState);
	player1.color = 'blue';
	gameState.pushPlayerState(player1);
	presetStart(myGame);
	controller.startGame(myGame);
}

function initialTurns(game) {
    if (game.turnCount == undefined) game.turnCount = 0;
    if (game.globalpHouses == undefined) game.globalpHouses = game.Vertices;
    var state = game.peekGameState();
    var player = state.PlayerStates[game.turnCount % state.PlayerStates.length];
    var updatepHouses = (houseTuple) => {
        Model.sort(houseTuple);
        var [q, r, s] = houseTuple;
        var intersects = [];
        intersects.push({
            x: q,
            y: r,
            z: Model.intersect_safe(this.Hexes[q].adj, this.Hexes[r].adj)
        });
        intersects.push({
            x: q,
            y: s,
            z: Model.intersect_safe(this.Hexes[q].adj, this.Hexes[s].adj)
        });
        intersects.push({
            x: r,
            y: s,
            z: Model.intersect_safe(this.Hexes[r].adj, this.Hexes[s].adj)
        });
        intersects.forEach((i) => {
            var [x, y, z] = sort([i.x, i.y, i.z.pop()]);
            Model.removeTriple(game.globalpHouses, x, y, z);
            [x, y, z] = sort([i.x, i.y, i.z.pop()]);
            Model.removeTriple(game.globalpHouses, x, y, z);
        });
    }
}

function presetStart(game) {
	var player0 = game.peekGameState().PlayerStates[0];
	var player1 = game.peekGameState().PlayerStates[1];
	forceBuySettlement(game, player0, 5, 10, 11);
	forceBuySettlement(game, player0, 25, 26, 31);
	forceBuyRoad(game, player0, 25, 26);
	forceBuyRoad(game, player0, 10,11);
	forceBuySettlement(game, player1, 7, 12, 13);
	forceBuySettlement(game, player1, 23, 24, 29);
	forceBuyRoad(game, player1, 12, 13);
	forceBuyRoad(game, player1, 23, 24);
}

function forceBuySettlement (game,player, x, y, z) {
	var pSettlements = player.pSettlements;
	if (pSettlements[x] == undefined) pSettlements[x] = [];
	if (pSettlements[x][y] == undefined) pSettlements[x][y] = [];
	if (pSettlements[x][y][z] == undefined) pSettlements[x][y][z] = {};
	player.buySettlement([x,y,z]);
}

function forceBuyRoad (game,player, x, y) {
	var pRoads = player.pRoads;
	if (pRoads[x] == undefined) pRoads[x] = [];
	if (pRoads[x][y] == undefined) pRoads[x][y] = {};
	player.buyRoad([x,y]);
}
