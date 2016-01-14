(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.hexTypes = undefined;
exports.createPiece = createPiece;
exports.createRow = createRow;
exports.createBoard = createBoard;
exports.createSimpleBoard = createSimpleBoard;

var _types = require('./model/types');

function createPiece(type, pos) {
	var piece = { type: type, pos: pos };
	return piece;
}

function createRow(types, offset, height) {
	var newRow = [];
	types.forEach(function (type, i) {
		newRow.push(createPiece(type, [i + offset, height]));
	});
	return newRow;
}

function createBoard(rowArray, offset, height) {
	var board = [];
	var y = height;
	rowArray.rowEach(function (d, i) {
		createRow(d, offset + i, y);
		y++;
	});
	return board;
}

function createSimpleBoard(pos) {
	var board = {};
	board.tiles = [];
	board.tiles.push(createRow(['grain', 'lumber', 'wool'], 0, 0));
	board.tiles.push(createRow(['brick', 'lumber', 'grain', 'lumber'], 0, 1));
	board.tiles.push(createRow(['ore', 'grain', 'desert', 'grain', 'wool'], 0, 2));
	board.tiles.push(createRow(['brick', 'wool', 'brick', 'ore'], 1, 3));
	board.tiles.push(createRow(['lumber', 'grain', 'ore'], 2, 4));
	return board;
}

var hexTypes = exports.hexTypes = _types.types;
console.log(hexTypes);

},{"./model/types":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var types = exports.types = {
    'brick': {
        color: 0xD77F37
    },
    'lumber': {
        color: 0x1A703F

    },
    'wool': {
        color: 0x9CC53B

    },
    'grain': {
        color: 0xEFB730

    },
    'ore': {
        color: 0x96A392

    },
    'desert': {
        color: 0xFFEA7A
    }
};

},{}],4:[function(require,module,exports){
"use strict";

var _model = require("./model");

var model = _interopRequireWildcard(_model);

var _view = require("./view");

var view = _interopRequireWildcard(_view);

var _controller = require("./controller");

var controller = _interopRequireWildcard(_controller);

var _worldManip = require("./utils/worldManip.js");

var terraHammer = _interopRequireWildcard(_worldManip);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var board = model.createSimpleBoard([0, 0]);

console.log(view);
view.loader.load('assets/hex.json', function (geometry, materials) {
    view.texLoader.load('assets/hexTextureGrey.jpg', function (texture) {
        view.renderBoard(board, geometry, texture);
    });
});

view.render();

},{"./controller":1,"./model":2,"./utils/worldManip.js":5,"./view":6}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getWorldPos = getWorldPos;
function getWorldPos(pos) {
	return [pos[0] * 2 - 1 * pos[1], pos[1] * 1.5];
}

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.controls = exports.renderer = exports.camera = exports.texLoader = exports.loader = undefined;
exports.renderPiece = renderPiece;
exports.renderRow = renderRow;
exports.renderBoard = renderBoard;
exports.render = render;

var _model = require("./model");

var model = _interopRequireWildcard(_model);

var _worldManip = require("./utils/worldManip.js");

var terraHammer = _interopRequireWildcard(_worldManip);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var scene = new THREE.Scene();

var loader = exports.loader = new THREE.JSONLoader();
var texLoader = exports.texLoader = new THREE.TextureLoader();

function renderPiece(piece, geom, tex) {
    var material = new THREE.MeshPhongMaterial({
        color: model.hexTypes[piece["type"]].color,
        map: tex
    });

    var hex = new THREE.Mesh(geom, material);
    var worldPos = terraHammer.getWorldPos(piece.pos);
    scene.add(hex);
    hex.position.set(worldPos[1], -.85, worldPos[0]);
    hex.scale.set(.9, 1, .9);
    return hex;
}

function renderRow(row, geom, tex) {
    row.forEach(function (d, i) {
        renderPiece(d, geom, tex);
    });
}

function renderBoard(board, geom, tex) {
    board.tiles.forEach(function (d, i) {
        renderRow(d, geom, tex);
    });
}

var camera = exports.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, .1, 1000);
var renderer = exports.renderer = new THREE.WebGLRenderer();

var controls = exports.controls = new THREE.OrbitControls(camera, renderer.domElement);
renderer.setClearColor(0x88ddff);
renderer.setSize(window.innerWidth * .985, window.innerHeight * .98);
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
    sunDirection: dirLight.position.clone().normalize(),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    distortionScale: 50.0
});

var mirrorMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(10000, 10000), water.material);

mirrorMesh.add(water);
mirrorMesh.rotation.x = -Math.PI * 0.5;
mirrorMesh.position.y = -1;
scene.add(mirrorMesh);

function render() {
    water.material.uniforms.time.value += 0.05 / 60.0;
    water.render();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

},{"./model":2,"./utils/worldManip.js":5}]},{},[4]);
