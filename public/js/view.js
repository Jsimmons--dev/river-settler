"use strict";
import * as model from "./model";
import * as terraHammer from "./utils/worldManip.js";

var scene = new THREE.Scene();

export var meshLoader = new THREE.JSONLoader();
export var texLoader = new THREE.TextureLoader();
export var meshes = {};
export var loadedTextures = {};
export var geometries = [[
        'hex', '../assets/hex.json'
],
['house', '../assets/house.json'],
['city', '../assets/city.json'],
['road', '../assets/road.json']
];
export var textures = [[
        'hex', '../assets/sheep.jpg'
]];

export function renderPiece(model) {
    var piece = meshes[model.type].clone();
    scene.add(piece);
    piece.position.set(model.pos[0], model.pos[1], model.pos[2]);
    if (model.rot)
        piece.rotation.set(0, model.rot[1], 0);
    piece.scale.set(model.scale[0], model.scale[1], model.scale[2]);
    return piece;
}
export function renderCity(model) {
    model.scale = [.3, .5, .3];
    renderPiece(model);
}

export function renderSettlement(house, game) {
    var model = {};
    model.type = 'house';
    var [x,z] = terraHammer.geomCenter(house.id, game);
	model.pos = [x,0,z];
	console.log(model.pos);
    model.scale = [.1, .2, .1];
    renderPiece(model);
}

function higherTileOdd(tiles) {
    var higher = (tiles[0].pos[2] > tiles[1].pos[2]) ? tiles[0].pos[2] : tiles[1].pos[2];
    return higher % 2 == 1;
}

function sameX(tiles) {
    return tiles[0].pos[0] === tiles[1].pos[0];
}

function tilesSameLevel(tiles) {
    return tiles[0].pos[2] === tiles[1].pos[2];
}
export function renderRoad(tiles) {
    var model = {};
    model.type = 'road';
    model.pos = terraHammer.getRoadPos(tiles[0].pos, tiles[1].pos);
    var rot = (tilesSameLevel(tiles)) ? [0, 0, 0] : (sameX(tiles)) ? [0, 65 * Math.PI / 180, 0] : [0, -65 * Math.PI / 180, 0];
    if (!higherTileOdd(tiles)) {
        rot[1] = -rot[1];
    }
    model.rot = rot;
    model.scale = [.15, .15, .15];
    renderPiece(model);
}

export function renderHex(piece) {
    var hex = meshes['hex'].clone();
    //var worldPos = terraHammer.getWorldPos(piece.pos);
    scene.add(hex);
    hex.position.set(piece.x, 0, piece.y * .77);
    hex.rotation.set(0, Math.PI / 2, 0);
    hex.scale.set(.48, .5, .48);
    return hex;
}


export function renderBoard(game) {
    game.Hexes.forEach((d) => {
        renderHex(d);
    });
    var gs = game.peekGameState().Houses;
	console.log('gameState ',gs);
    for (var i = 0; i < gs.length; i++) {
            console.log(gs[i]);
        if (gs[i] !== undefined) {
            for (var j = 0; j < gs[i].length; j++) {
                    console.log(gs[i][j]);
                if (gs[i][j] !== undefined) {
                    for (var k = 0; k < gs[i][j].length; k++) {
                            console.log(gs[i][j][k]);
                        if (gs[i][j][k] !== undefined) {
                            renderSettlement(gs[i][j][k], game);
                        }
                    }
                }
            }
        }
    }
}

export var camera = new THREE.PerspectiveCamera(75,
    window.innerWidth / window.innerHeight,
    .1,
    1000);
export var renderer = new THREE.WebGLRenderer();

export var controls = new THREE.OrbitControls(camera, renderer.domElement);
renderer.setClearColor(0x88ddff);
renderer.setSize(window.innerWidth * .985,
    window.innerHeight * .98);
document.body.appendChild(renderer.domElement);
camera.position.set(5, 9, 2);
camera.rotation.set(-Math.PI / 2, 0, -Math.PI / 2);

var dirLight = new THREE.DirectionalLight(0xffffff);
dirLight.position.set(0, 100, 0);
scene.add(dirLight);


var waterNormals = new THREE.ImageUtils.loadTexture('assets/waternormals.jpg');
waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

var water = new THREE.Water(renderer, camera, scene, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: waterNormals,
    alpha: 1.0,
    sunDirection: dirLight.position.clone()
        .normalize(),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    distortionScale: 50.0,
});


var mirrorMesh = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(10000, 10000),
    water.material
);

mirrorMesh.add(water);
mirrorMesh.rotation.x = -Math.PI * 0.5;
mirrorMesh.position.y = -1;
scene.add(mirrorMesh);

export function render() {
    water.material.uniforms.time.value += 0.05 / 60.0;
    water.render();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
