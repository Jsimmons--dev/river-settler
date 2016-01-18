"use strict";
//import * as obj from "./utils/objForeach.js";
import * as model from "./Model";
import * as view from "./view";
import * as controller from "./controller";
import queue from "../../node_modules/queue-async/queue";

var meshQueue = queue(3);

view.geometries.forEach((d) => {
    console.log('loading ' + d[1]);
    meshQueue.defer(function (done) {
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
   // var board = model.createSimpleBoard([0, 0]);
	var myGame = new model.Game();
	myGame.genBoard(4, 7);
	var gameState = new model.GameState();
	myGame.pushGameState(gameState);
	var player0 = new model.PlayerState(gameState);
	gameState.pushPlayerState(player0);
	player0.buySettlement([1,2,6]);
	console.log(myGame);
	view.renderBoard(myGame);
    view.render();
}

