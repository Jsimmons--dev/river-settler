"use strict";
import * as model from "../model/model";
import * as terraHammer from "../utils/worldManip.js";
import * as gui from "./gui";

var scene;
export var meshes = {};

var moveMeshes = {};

export function setupRoot(){
	var root = document.createElement("div");
	root.id = model.view.rootEl;
	document.querySelector('body').appendChild(root);
}

export function renderPiece(owner, model, game, color) {
    console.log('model ', model);
    console.log(owner);
    var piece = meshes[model.type].clone();
    piece.model = model;
    scene.add(piece);
    if (color === undefined) {
        color = game.peekGameState()
            .PlayerStates[owner].color
    }
    piece.material = new THREE.MeshPhongMaterial({
        color: color
    });
    piece.position.set(model.pos[0], model.pos[1], model.pos[2]);
    if (model.rot)
        piece.rotation.set(0, model.rot[1], 0);
    piece.scale.set(model.scale[0], model.scale[1], model.scale[2]);
    return piece;
}

export function renderCity(model, hex) {
    model.scale = [.3, .5, .3];
    renderPiece(model, model);
}

export function renderSettlement(house, game, color) {
    //optional color for pSettlements
    var model = {};
    model.house = house;
    model.type = house.type;
    model.possible = house.possible;
    var [x, z] = terraHammer.geomCenter(house.id, game);
    model.pos = [x, 0, z];
    model.scale = [.1, .2, .1];
    renderPiece(house.owner, model, game, color);
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
    renderPiece(road.owner, model, game);
}
export function renderToken(piece) {
    if (piece.token) {
        var token = meshes['token-' + piece.token].clone();
        scene.add(token);
        token.position.set(piece.x, 0, piece.y * .77);
        token.scale.set(.1, .1, .1);
    }
}



export function renderHex(piece) {
    if (piece.type !== 'water') {
        var id;
        if (piece.type === 'port') {
            id = 'port';

        } else {
            //console.log(piece.resource);
            id = 'hex-' + piece.resource;
        }
        console.log(id);
        var hex = meshes[id].clone();
        hex.hexID = piece.id;
        hex.hex = piece;
        //var worldPos = terraHammer.getWorldPos(piece.pos);
        scene.add(hex);
        hex.position.set(piece.x, 0, piece.y * .77);
        hex.rotation.set(0, Math.PI / 2, 0);
        hex.scale.set(.48, .5, .48);
        return hex;
    }
}

function renderRobber(game) {
    var robber = meshes['robber'].clone();
    robber.material = new THREE.MeshPhongMaterial({
        color: 0xffd700
    });
    scene.add(robber);
    var robberLoc = game.Hexes[game.peekGameState()
        .robberLoc];
    console.log(robberLoc);
    robber.position.set(robberLoc.x, 0, robberLoc.y * .77);
    robber.scale.set(.1, .2, .1);
    return robber;
}

export function renderBoard(game) {
    game.Hexes.forEach((d) => {
        renderHex(d);
        renderToken(d);
    });
    game.peekGameState()
        .houseEach(renderSettlement);
    game.peekGameState()
        .roadEach(renderRoad);
    moveMeshes['robber'] = renderRobber(game);
}

var water;
var renderer;
var camera;

export function startGame(){
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(75,
    window.innerWidth / window.innerHeight,
    .1,
    1000);
 renderer = new THREE.WebGLRenderer();

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.mouseButtons = {
    ORBIT: THREE.MOUSE.RIGHT,
    ZOOM: 4,
    PAN: THREE.MOUSE.MIDDLE
}
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

 water = new THREE.Water(renderer, camera, scene, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: waterNormals,
    alpha: 1.0,
    sunDirection: dirLight.position.clone()
        .normalize(),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
});


var mirrorMesh = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(10000, 10000),
    water.material
);

mirrorMesh.add(water);
mirrorMesh.rotation.x = -Math.PI * 0.5;
mirrorMesh.position.y = -.05;
scene.add(mirrorMesh);

}

export function render(game) {
    water.material.uniforms.time.value += 0.05 / 60.0;
    water.render();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
//TODO --- from here down

export function gameOver(game) {

}

function GUI() {
    $('body')
        .append('<gui></gui>');
    var gui = $('gui')[0];
    gui.style.position = 'absolute';
    gui.style.top = 0;

    this.drawPlayerCounter = () => {
        this.playerCounter = $('<div id="playerCounter"></div>')[0];
        $('body > gui')
            .append(this.playerCounter);

    }
    this.updatePlayerCounter = (player) => {
        this.playerCounter.innerHTML = "It's player " + player.id + "'s turn";
        this.playerCounter.background = player.color;
    }
}

export function nextPlayer(player, game) {
    $('body > gui')
        .remove();
    $('body')
        .append('<gui></gui>');
    var gui = $('gui')[0];
    gui.style.position = 'absolute';
    gui.style.top = '0';
    var counter = $('<div id="playerCounter"></div>')[0];
    counter.innerHTML = "it's player " + player.id + "'s turn";
    counter.style.background = player.color;
    $('body > gui')
        .append(counter);

    var cardWidth = 64;
    var cardHeight = 64;
    var cardSpace = 64;
    var curSpace = 32;

    function renderTile(name) {
        $('body > gui')
            .append($("<div id='" + name + "' class='" + name + "Tile'></div>"));
        var tile = $('#' + name)[0];
        tile.style.bottom = 32 + 'px';
        tile.style.left = curSpace + 'px';
        tile.style.width = cardWidth + 'px';
        tile.style.height = cardHeight + 'px';
        curSpace += cardSpace;
        $(tile)
            .append("<div class='frosted'><p>" + player[name] + "</p></div>");
    }
    renderTile('grain');
    renderTile('wool');
    renderTile('brick');
    renderTile('lumber');
    renderTile('ore');
}

export function askForDiceRoll(player, game, rolled, seven) {
    var dice;
    console.log($('body'));
    var gui = $('body > gui')
        .append('<button id="roll">roll</button>');

    $('#roll')
        .button()
        .click((e) => {
            dice = model.rollDice();
            console.log('dice rolled a ', dice);
            if (dice === 7) seven(player, dice, game);
            else rolled(player, dice, game);
            $('#roll')
                .remove();

        });

    $('#roll')[0].style.position = 'absolute';
    $('#roll')[0].style.top = -98 + 'vh';
    $('#roll')[0].style.left = 50 + 'vw';
}

export function renderResourceDistribution(resources, game) {

}

export function startBuyPhase(player, turn, game) {
    var gui = $('body > gui')
        .append('<button id="endTurn">end</button>')
        .append('<button id="buySettlement">Buy Settlement</button>')
        .append('<button id="buyRoad">Buy Road</button>')

    $('#endTurn')
        .button()
        .click((e) => {
            turn(game);
        });
    $('#buySettlement')
        .button()
        .click((e) => {
            var exitBuySettlement = () => {
                $('#cancel')
                    .remove();
                removepMeshes();
            }
            $('body > gui')
                .append('<button id="cancel">Cancel</button>')
            $('#cancel')
                .button()
                .click((e) => {
                    exitBuySettlement();
                });

            addpSettlements(player, game);
            attachClick((mesh) => {
                console.log(mesh);
                if (mesh.model && mesh.model.possible) {
                    console.log(mesh.model.house);
                    var houseTuple = mesh.model.house.id.split('_');
                    player.buySettlement(houseTuple);
                    $('#cancel')
                        .remove();
                    removepMeshes();

                    game.peekGameState()
                        .houseEach(renderSettlement);
                }
            });
        });
    $('#buyRoad')
        .button()
        .click((e) => {
            attachClick((mesh) => {});
        });

    $('#endTurn')[0].style.position = 'absolute';
    $('#endTurn')[0].style.top = -98 + 'vh';
    $('#endTurn')[0].style.left = 70 + 'vw';

    $('#buySettlement')[0].style.position = 'absolute';
    $('#buySettlement')[0].style.top = -98 + 'vh';
    $('#buySettlement')[0].style.left = 60 + 'vw';

    $('#buyRoad')[0].style.position = 'absolute';
    $('#buyRoad')[0].style.top = -98 + 'vh';
    $('#buyRoad')[0].style.left = 50 + 'vw';
}

function removepMeshes(game) {
    scene.children.forEach((child) => {
        if (child.model && child.model.house && child.model.house.possible) {
            console.log("found p house", child);
            scene.remove(child);
        }
    });
}

function addpSettlements(player, game) {
    var renderpSettlement = (house, game) => {
        console.log(house);
        if (house != "placed") {
            house.possible = true;
            console.log("calling renderSettlement on house", house);
            renderSettlement(house, game, 0xffffff);
        }
    }
    console.log("player.pSettlements", player.pSettlements);
    model.houseEach(player.pSettlements, game, renderpSettlement);
}

export function showEndOfTurn(player, endTurn, game) {}
export function moveRobber(movePair, game) {
    var robberLoc = game.Hexes[game.peekGameState()
        .robberLoc];
    moveMeshes['robber'].position.set(robberLoc.x, 0, robberLoc.y * .77);
}
export function attachClick(callback) {
    document.querySelector('canvas')
        .addEventListener("click", function (evt) {
            var raycaster = new THREE.Raycaster();
            var SCREEN_WIDTH = window.innerWidth * .985;
            var SCREEN_HEIGHT = window.innerHeight * .98;
            var x = (evt.clientX / SCREEN_WIDTH) * 2 - 1;
            var y = -(evt.clientY / SCREEN_HEIGHT) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            var intersects = raycaster.intersectObjects(scene.children, true);
            if (intersects.length) {
                var target = intersects[0].object;
                callback(target);
            }
        }, false);

}


var mouse = new THREE.Vector2();

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
window.addEventListener('mousemove', onMouseMove, false);

export var showMainMenu = gui.showMainMenu;
