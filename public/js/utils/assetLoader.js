import queue from "../../..//node_modules/queue-async/queue";
import * as assets from "../view/assetList";

export function loader(meshMap, callback) {
    var meshQueue = queue();

    assets.geometries.forEach((d) => {
        meshQueue.defer(function (done) {
            assets.meshLoader.load(d[1], (geom, mat) => {
                var texture = assets.textures.filter((e) => {
                    return e[0] === d[0]
                })[0];
                if (texture !== undefined) {
                    assets.texLoader.load(texture[1], (tex) => {
                        meshMap[d[0]] = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({
                            map: tex
                        }));
                        done(null, 'ok');
                    });
                } else {
                    meshMap[d[0]] = new THREE.Mesh(geom, new THREE.MeshPhongMaterial({
                        color: 0x00ff00
                    }));
                    done(null, 'ok');
                }
            });
        });
    });

    meshQueue.awaitAll((error, res) => {
        callback();
    });
}
