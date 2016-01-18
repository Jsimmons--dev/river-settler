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
	console.log(myGame);
	myGame.Hexes.forEach((d)=>{
		view.renderHex(d);
	});

    //view.renderBoard(board);
   // view.renderHouse([{
   //     pos: [1, 0, 0]
   // }, {
   //     pos: [1, 0, 1]
   // }, {
   //     pos: [2, 0, 1]
   // }]);
   // view.renderRoad([{
   //     pos: [0, 0, 0]
   // }, {
   //     pos: [0, 0, 1]
   // }]);
    view.render();
}

