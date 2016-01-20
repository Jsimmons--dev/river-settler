"use strict";
//import * as obj from "./utils/objForeach.js";
import * as model from "./Model";
import * as view from "./view";
import * as controller from "./controller";
import queue from "../../node_modules/queue-async/queue";

var meshQueue = queue(3);

view.geometries.forEach((d) => {
    console.log('loading ' + d[1]);
    meshQueue.defer(function(done) {
        view.meshLoader.load(d[1], (geom, mat) => {
            var texture = view.textures.filter((e) => {
                return e[0] === d[0]
            })[0];
            if (texture !== undefined) {
                view.texLoader.load(texture[1], (tex) => {
                    console.log('loading texture for ' + d[0]);
                    view.meshes[d[0]] = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({
                        map: tex
                    }));
                    done(null, 'ok');
                });
            } else {
                view.meshes[d[0]] = new THREE.Mesh(geom, new THREE.MeshPhongMaterial({
                    color: 0x00ff00
                }));
                done(null, 'ok');
            }
        });
    });
});

meshQueue.awaitAll((error, res) => {
    console.log('assets loaded');
    main();
});

function main() {
<<<<<<< Updated upstream
   // var board = model.createSimpleBoard([0, 0]);
	var myGame = new model.Game();
	myGame.genBoard(4, 7);
	var gameState = new model.GameState(myGame);
	myGame.pushGameState(gameState);
	var player0 = new model.PlayerState(gameState);
	gameState.pushPlayerState(player0);
	controller.startGame(myGame);
//	player0.buyRoad([1,6]);
//	console.log(myGame);
//	view.renderBoard(myGame);
//    view.render();
=======
    // var board = model.createSimpleBoard([0, 0]);
    var myGame = new model.Game();
    myGame.genBoard(4, 7);
    var gameState = new model.GameState(myGame);
    myGame.pushGameState(gameState);
    var player0 = new model.PlayerState(gameState);
    gameState.pushPlayerState(player0);
    var player1 = new model.PlayerState(gameState);
    gameState.pushPlayerState(player1);
    //do game setup ie first settlements
    initialTurns(myGame);
    //start normal turns
    turn(myGame);
    view.renderBoard(myGame);
    view.render();
>>>>>>> Stashed changes
}

function initialTurns(game) {
    if (game.turnCount == undefined) game.turnCount = 0;
    if (game.globalpHouses == undefined) game.globalpHouses = game.Vertices;
    var state = game.peekGameState();
    var player = state.PlayerStates[game.turnCount % state.PlayerStates.length];
    var updatepHouses = (houseTuple) => {
        Model.sort(houseTuple);
        //remove possible houses adjacent to one just purchased
        //find pHouse elimination coords
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
            var [x, y, z] = sort([i.x, i.y, i.z.pop()]); //I know this is terrible, shut up
            Model.removeTriple(game.globalpHouses, x, y, z);
            [x, y, z] = sort([i.x, i.y, i.z.pop()]);
            Model.removeTriple(game.globalpHouses, x, y, z);
        });
    }

	//render possible houses
	
	//click to place house
	
	//
}
