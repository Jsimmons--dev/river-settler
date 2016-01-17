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
]];
export var textures = [[
        'hex', '../assets/hexTexture.jpg'
]];

export function renderPiece(piece) {
    var hex = meshes['hex'].clone();
    var worldPos = terraHammer.getWorldPos(piece.pos);
    scene.add(hex);
    hex.position.set(worldPos[1], -.85, worldPos[0]);
    hex.scale.set(.9, 1, .9);
	console.log(hex,worldPos,piece.pos);
    return hex;
}

export function renderRow(row, geom, tex) {
    row.forEach(function (d, i) {
        renderPiece(d, geom, tex)
    });
}


export function renderBoard(board, geom, tex) {
    board.tiles.forEach(function (d, i) {
        renderRow(d, geom, tex);
    });
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
