"use strict";
import * as model from "./Model";
import * as terraHammer from "./utils/worldManip.js";

var scene = new THREE.Scene();

export var meshLoader = new THREE.JSONLoader();
export var texLoader = new THREE.TextureLoader();
export var meshes = {};
export var loadedTextures = {};
export var geometries = [
		['hex-grain', '../assets/hex.json'],
	   	['hex-wool', '../assets/hex.json'],
	   	['hex-lumber', '../assets/hex.json'],
	   	['hex-brick', '../assets/hex.json'],
	   	['hex-ore', '../assets/hex.json'],
	   	['hex-desert', '../assets/hex.json'],
		['port', '../assets/boat.json'],
['settlement', '../assets/house.json'],
['city', '../assets/city.json'],
['road', '../assets/road.json']
];
export var textures = [
		['hex-ore', '../assets/Ore.png'],
		['hex-grain', '../assets/Grain.png'],
	   	['hex-lumber', '../assets/Lumber.png'],
	   	['hex-wool', '../assets/Wool.png'],
	   	['hex-desert', '../assets/Desert.png'],
	   	['hex-brick', '../assets/Brick.png']
];

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
    model.type = house.type;
    var [x, z] = terraHammer.geomCenter(house.id, game);
    model.pos = [x, 0, z];
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
export function renderRoad(road, game) {
    var model = {};
    model.type = 'road';
    var [x, z] = terraHammer.geomCenter(road.id, game);
    //var rot = (tilesSameLevel(tiles)) ? [0, 0, 0] : (sameX(tiles)) ? [0, 65 * Math.PI / 180, 0] : [0, -65 * Math.PI / 180, 0];
    //  if (!higherTileOdd(tiles)) {
    //      rot[1] = -rot[1];
    //  }
    //  model.rot = rot;
    model.pos = [x, 0, z];
    model.scale = [.15, .15, .15];
    renderPiece(model);
}

export function renderHex(piece) {
    if (piece.type !== 'water') {
        var id;
        if (piece.type === 'port') {
            id = 'port';

        } else {
            console.log(piece.resource);
            id = 'hex-' + piece.resource;
        }
        console.log(id);
        var hex = meshes[id].clone();
        //var worldPos = terraHammer.getWorldPos(piece.pos);
        scene.add(hex);
        hex.position.set(piece.x, 0, piece.y * .77);
        hex.rotation.set(0, Math.PI / 2, 0);
        hex.scale.set(.48, .5, .48);
        return hex;
    }
}

export function renderBoard(game) {
    game.Hexes.forEach((d) => {
        renderHex(d);
    });
    game.peekGameState()
        .houseEach(renderSettlement);
    game.peekGameState()
        .roadEach(renderRoad);
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
mirrorMesh.position.y = -.05;
scene.add(mirrorMesh);

export function render(game) {
    water.material.uniforms.time.value += 0.05 / 60.0;
    water.render();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

//TODO --- from here down

export function gameOver(game) {

}

export function nextPlayer(player, game) {
$('body > gui').remove();
$('body').append('<gui></gui>');
var gui = $('gui')[0];
gui.style.position = 'absolute';
var text2 = document.createElement('div');
text2.style.position = 'absolute';
//text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
//text2.style.width = 100;
//text2.style.height = 100;
text2.style.backgroundColor = "blue";
text2.innerHTML = "it's player "+player.id+"'s turn";
text2.style.top = -96 + 'vh';
//text2.style.left = -98 + 'vw';
$('body > gui').append(text2);

var cardWidth = 128;
var cardHeight = 128;
var cardSpace = 30;

$('body > gui').append($("<div id='grain' class='grainTile'></div>"));
var grain = $('#grain')[0]
		grain.style.position = 'absolute';
		grain.style.top = -10+'vw';
		grain.style.left = cardSpace;
		grain.style.width = cardWidth+'px';
		grain.style.height = cardHeight+'px';

	cardSpace *= 2;
}

export function askForDiceRoll(player, game,rolled,seven) {
    var dice;
	console.log($('body'));
    var gui = $('body > gui')
        .append('<button id="roll">roll</button>');

		$('#roll')
        .button()
        .click((e) => {
            dice = model.rollDice(); //return pair array e.g. [1,5]
			console.log('dice rolled a ',dice);
			if(dice === 7)seven(player,dice,game);
			else rolled(player,dice,game);
        });

	$('#roll')[0].style.position ='absolute';
	$('#roll')[0].style.top = -98 + 'vh';
	$('#roll')[0].style.left = 50 + 'vw';
}

export function renderResourceDistribution(resources, game) {

}

export function startBuyPhase(player, turn, game) {
    var gui = $('body > gui')
        .append('<button id="endTurn">end</button>')

		$('#endTurn')
        .button()
        .click((e) => {
            turn(game); //return pair array e.g. [1,5]
        });

	$('#endTurn')[0].style.position ='absolute';
	$('#endTurn')[0].style.top = -98 + 'vh';
	$('#endTurn')[0].style.left = 70 + 'vw';
}

export function showEndOfTurn(player, endTurn, game) {
}
export function moveRobber(movePair,game){

}
