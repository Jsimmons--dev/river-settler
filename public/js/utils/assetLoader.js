import queue from "../../..//node_modules/queue-async/queue";
import * as view from "../view/view";
import * as assets from "../view/assetList";

export function loader(callback){
var meshQueue = queue();

assets.geometries.forEach((d) => {
    console.log('loading ' + d[1]);
    meshQueue.defer(function(done) {
        assets.meshLoader.load(d[1], (geom, mat) => {
            var texture = assets.textures.filter((e) => {
                return e[0] === d[0]
            })[0];
            if (texture !== undefined) {
                assets.texLoader.load(texture[1], (tex) => {
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
    callback();
});
}
