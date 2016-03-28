(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
  var slice = [].slice;

  function queue(parallelism) {
    var q,
        tasks = [],
        started = 0, // number of tasks that have been started (and perhaps finished)
        active = 0, // number of tasks currently being executed (started but not finished)
        remaining = 0, // number of tasks not yet finished
        popping, // inside a synchronous task callback?
        error = null,
        await = noop,
        all;

    if (!parallelism) parallelism = Infinity;

    function pop() {
      while (popping = started < tasks.length && active < parallelism) {
        var i = started++,
            t = tasks[i],
            a = slice.call(t, 1);
        a.push(callback(i));
        ++active;
        t[0].apply(null, a);
      }
    }

    function callback(i) {
      return function(e, r) {
        --active;
        if (error != null) return;
        if (e != null) {
          error = e; // ignore new tasks and squelch active callbacks
          started = remaining = NaN; // stop queued tasks from starting
          notify();
        } else {
          tasks[i] = r;
          if (--remaining) popping || pop();
          else notify();
        }
      };
    }

    function notify() {
      if (error != null) await(error);
      else if (all) await(error, tasks);
      else await.apply(null, [error].concat(tasks));
    }

    return q = {
      defer: function() {
        if (!error) {
          tasks.push(arguments);
          ++remaining;
          pop();
        }
        return q;
      },
      await: function(f) {
        await = f;
        all = false;
        if (!remaining) notify();
        return q;
      },
      awaitAll: function(f) {
        await = f;
        all = true;
        if (!remaining) notify();
        return q;
      }
    };
  }

  function noop() {}

  queue.version = "1.0.7";
  if (typeof define === "function" && define.amd) define(function() { return queue; });
  else if (typeof module === "object" && module.exports) module.exports = queue;
  else this.queue = queue;
})();

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.startGame = startGame;

var _model = require("../model/model");

var model = _interopRequireWildcard(_model);

var _view = require("../view/view");

var view = _interopRequireWildcard(_view);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function startGame(game) {
    view.renderBoard(game);
    view.render(game);
    turn(game);
}

function turn(game) {
    if (!gameOver(game)) {
        console.log('determining whose turn');
        var player = determinePlayer(game);
        console.log('rolling the die');
        var roll = rollDice(player, game);
        endTurn(player, game);
    } else {
        runGameOver();
    }
}

function rolled(player, dice, game) {
    console.log("distributing resources");
    resourceDistribution(player, dice, game);
}

function rolledSeven(player, dice, game) {
    console.log('moving robber');
    robberMove(player, game);
}

function runGameOver() {}

function gameOver(game) {
    var over = model.gameOver(game);
    if (over) {
        view.gameOver(game);
        model.endGame(game);
    }
    return over;
}

function determinePlayer(game) {
    var player = model.determinePlayer(game);
    console.log('player ', player);
    view.nextPlayer(player, game);
    return player;
}

function rollDice(player, game) {
    var dice = view.askForDiceRoll(player, game, rolled, rolledSeven);
    return dice;
}

function robberMove(player, game) {
    var robberMoved = model.robberMove(player, game, Math.floor(Math.random() * 36));
    view.moveRobber(robberMoved, game);
    buyPhase(player, game);
}

function steal(player, game) {
    var stealee = model.steal(player, game);
    view.stoleFrom(player, stealee, game);
    buyPhase(player, game);
}

function resourceDistribution(player, roll, game) {
    var resources = model.distributeRes(roll, game); //array of objects showing
    //how many of each were given to that player e.g. [{},{'grain':2}] mean
    //player 1 got nothing and player 2 got two grains
    view.renderResourceDistribution(resources, game);
    console.log('resources returned');
    buyPhase(player, game);
}

function buyPhase(player, game) {
    console.log('in buying phase');
    view.startBuyPhase(player, turn, game);
}

function endTurn(player, game) {
    model.endTurn(player, game);
    view.showEndOfTurn(player, game);
}

},{"../model/model":4,"../view/view":8}],3:[function(require,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _model = require("./model/model");

var model = _interopRequireWildcard(_model);

var _view = require("./view/view");

var view = _interopRequireWildcard(_view);

var _controller = require("./controller/controller");

var controller = _interopRequireWildcard(_controller);

var _assetLoader = require("./utils/assetLoader");

var loader = _interopRequireWildcard(_assetLoader);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

loader.loader(view.meshes, main);

function main() {
				var myGame = new model.Game();
				myGame.genBoard(4, 7);
				var gameState = new model.GameState(myGame);
				myGame.pushGameState(gameState);
				var player0 = new model.PlayerState(gameState);
				player0.color = 'orange';
				gameState.pushPlayerState(player0);
				var player1 = new model.PlayerState(gameState);
				player1.color = 'blue';
				gameState.pushPlayerState(player1);
				presetStart(myGame);
				controller.startGame(myGame);
}

function initialTurns(game) {
				var _this = this;

				if (game.turnCount == undefined) game.turnCount = 0;
				if (game.globalpHouses == undefined) game.globalpHouses = game.Vertices;
				var state = game.peekGameState();
				var player = state.PlayerStates[game.turnCount % state.PlayerStates.length];
				var updatepHouses = function updatepHouses(houseTuple) {
								Model.sort(houseTuple);

								var _houseTuple = _slicedToArray(houseTuple, 3);

								var q = _houseTuple[0];
								var r = _houseTuple[1];
								var s = _houseTuple[2];

								var intersects = [];
								intersects.push({
												x: q,
												y: r,
												z: Model.intersect_safe(_this.Hexes[q].adj, _this.Hexes[r].adj)
								});
								intersects.push({
												x: q,
												y: s,
												z: Model.intersect_safe(_this.Hexes[q].adj, _this.Hexes[s].adj)
								});
								intersects.push({
												x: r,
												y: s,
												z: Model.intersect_safe(_this.Hexes[r].adj, _this.Hexes[s].adj)
								});
								intersects.forEach(function (i) {
												var _sort = sort([i.x, i.y, i.z.pop()]);

												var _sort2 = _slicedToArray(_sort, 3);

												var x = _sort2[0];
												var y = _sort2[1];
												var z = _sort2[2];

												Model.removeTriple(game.globalpHouses, x, y, z);

												var _sort3 = sort([i.x, i.y, i.z.pop()]);

												var _sort4 = _slicedToArray(_sort3, 3);

												x = _sort4[0];
												y = _sort4[1];
												z = _sort4[2];

												Model.removeTriple(game.globalpHouses, x, y, z);
								});
				};
}

function presetStart(game) {
				var player0 = game.peekGameState().PlayerStates[0];
				var player1 = game.peekGameState().PlayerStates[1];
				forceBuySettlement(game, player0, 5, 10, 11);
				forceBuySettlement(game, player0, 25, 26, 31);
				forceBuyRoad(game, player0, 25, 26);
				forceBuyRoad(game, player0, 10, 11);
				forceBuySettlement(game, player1, 7, 12, 13);
				forceBuySettlement(game, player1, 23, 24, 29);
				forceBuyRoad(game, player1, 12, 13);
				forceBuyRoad(game, player1, 23, 24);
}

function forceBuySettlement(game, player, x, y, z) {
				var pSettlements = player.pSettlements;
				if (pSettlements[x] == undefined) pSettlements[x] = [];
				if (pSettlements[x][y] == undefined) pSettlements[x][y] = [];
				if (pSettlements[x][y][z] == undefined) pSettlements[x][y][z] = {};
				player.buySettlement([x, y, z]);
}

function forceBuyRoad(game, player, x, y) {
				var pRoads = player.pRoads;
				if (pRoads[x] == undefined) pRoads[x] = [];
				if (pRoads[x][y] == undefined) pRoads[x][y] = {};
				player.buyRoad([x, y]);
}

},{"./controller/controller":2,"./model/model":4,"./utils/assetLoader":5,"./view/view":8}],4:[function(require,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.shuffle = shuffle;
exports.intersect_safe = intersect_safe;
exports.gameOver = gameOver;
exports.determinePlayer = determinePlayer;
exports.distributeRes = distributeRes;
exports.endTurn = endTurn;
exports.endGame = endGame;
exports.robberMove = robberMove;
exports.rollDice = rollDice;
var curGame; //hacky, fix anywhere that uses this
var settlementPrice = {
    "brick": 1,
    "lumber": 1,
    "wool": 1,
    "grain": 1
};
var cityPrice = {
    "ore": 3,
    "grain": 2
};
var roadPrice = {
    "brick": 1,
    "lumber": 1
};
var devCardPrice = {
    "ore": 1,
    "wool": 1,
    "grain": 1
};
var sort = exports.sort = function sort(array) {
    return array.sort(function (a, b) {
        return a - b;
    });
};
var Game = exports.Game = function Game() {
    var _this = this;

    curGame = this;
    this.gameStates = [];
    this.peekGameState = function () {
        return _this.gameStates[_this.gameStates.length - 1];
    };
    this.pushGameState = function (state) {
        _this.gameStates.push(state);
        return _this.gameStates.length - 1;
    };
    this.Hexes = [];
    this.Edges = [];
    this.Vertices = [];
    this.landTypes = ["lumber", "grain", "wool", "brick", "ore"];
    this.tokenNumbers = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];
    this.TokenMap = [];
    this.rowStarts = [];
    this.edgeWidth = 0;
    this.middleWidth = 0;
    this.genTileStacks = function (edgeWidth, middleWidth) {
        var landStack = [],
            waterStack = [],
            tokenStack = [];
        var numLandTiles = 0;
        for (var i = edgeWidth - 1; i < middleWidth - 2; i++) {
            numLandTiles += i * 2;
        }
        numLandTiles += middleWidth - 2;
        shuffle(_this.tokenNumbers);
        for (var i = 0; i < numLandTiles; i++) {
            landStack.push(_this.landTypes[i % _this.landTypes.length]);
            tokenStack.push(_this.tokenNumbers[i % _this.tokenNumbers.length]);
        }
        shuffle(landStack);
        shuffle(tokenStack);
        var numPorts = 0;
        var pushWaterRow = function pushWaterRow() {
            for (var i = 0; i < edgeWidth; i++) {
                if (i % 2 == 0) {
                    waterStack.push({
                        type: "port"
                    });
                    numPorts++;
                } else {
                    waterStack.push({
                        type: "water"
                    });
                }
            }
        };
        var pushWaterFlank = function pushWaterFlank(rowWidth) {
            if ((rowWidth - edgeWidth) % 2 == 1) {
                waterStack.push({
                    type: "water"
                });
                waterStack.push({
                    type: "port"
                });
                numPorts++;
            } else {
                waterStack.push({
                    type: "port"
                });
                numPorts++;
                waterStack.push({
                    type: "water"
                });
            }
        };

        //push top edge water, alternating port, water
        pushWaterRow();
        //push water at start and end of middle rows. water, port, port, water
        //upper half + middle
        for (var rowWidth = edgeWidth + 1; rowWidth <= middleWidth; rowWidth++) {
            pushWaterFlank(rowWidth);
        }
        //lower half
        for (var rowWidth = middleWidth - 1; rowWidth > edgeWidth; rowWidth--) {
            pushWaterFlank(rowWidth);
        }
        //push bottom edge water, alternating port, water
        pushWaterRow();

        //assign ports their exchange rates
        //generate portExchangeStack
        var portExchangeStack = [];
        var numWildcardPorts = 0;
        if (numPorts % 2 == 0) {
            numWildcardPorts = numPorts / 2;
        } else {
            numWildcardPorts = (numPorts - 1) / 2;
        }
        for (var i = 0; i < numWildcardPorts; i++) {
            portExchangeStack.push("wildcard");
        }
        while (portExchangeStack.length < numPorts) {
            portExchangeStack.push(_this.landTypes[(portExchangeStack.length - numWildcardPorts) % _this.landTypes.length]);
        }
        shuffle(portExchangeStack);
        //distribute exchanges to ports
        waterStack.forEach(function (port) {
            if (port.type == "port") {
                port.resource = portExchangeStack.pop();
            }
        });
        return {
            landStack: landStack,
            waterStack: waterStack,
            tokenStack: tokenStack
        };
    };
    this.genBoard = function (edgeWidth, middleWidth) {
        _this.edgeWidth = edgeWidth;
        _this.middleWidth = middleWidth;

        var _genTileStacks = _this.genTileStacks(edgeWidth, middleWidth);

        var landStack = _genTileStacks.landStack;
        var waterStack = _genTileStacks.waterStack;
        var tokenStack = _genTileStacks.tokenStack;

        var assignResourceToken = function assignResourceToken(hex) {
            hex.resource = landStack.pop();
            hex.type = "land";
            var token = tokenStack.pop();
            hex.token = token;
            if (_this.TokenMap[token] == undefined) {
                _this.TokenMap[token] = {};
            }
            if (_this.TokenMap[token].hexes == undefined) {
                _this.TokenMap[token].hexes = [];
            }
            _this.TokenMap[token].hexes.push(_this.Hexes[tileNum]);
            _this.TokenMap[hex.token];
        };

        var assignWater = function assignWater(hex) {
            var tile = waterStack.pop();
            hex.type = tile.type;
            if (hex.type == "port") {
                hex.exchange = tile.resource;
            }
        };

        var tileNum = 0;
        var rowLength = edgeWidth;
        var rowEnd = -1;
        var rowNum = 0;
        //upper half and middle
        for (rowLength; rowLength <= middleWidth; rowLength++) {
            _this.rowStarts[rowNum] = rowEnd + 1;
            rowEnd += rowLength;
            for (var i = 0; i < rowLength; i++) {
                _this.Hexes[tileNum] = {
                    id: tileNum,
                    adj: [],
                    edges: [],
                    vertices: [],
                    row: rowNum,
                    col: i,
                    y: rowNum,
                    x: i + (middleWidth - rowLength) * .5
                };
                if (rowLength == edgeWidth || i == 0 || i == rowLength - 1) {
                    //WATER or PORT
                    assignWater(_this.Hexes[tileNum]);
                    //add corner at end of rows
                    if (i == rowLength - 1 && rowEnd > edgeWidth) {
                        _this.addVertex([tileNum, tileNum - 1, tileNum - rowLength], "coastal");
                    }
                    //add edge at end of row
                    if (i == rowLength - 1 && rowLength != edgeWidth) {
                        _this.addEdge(tileNum, tileNum - 1, "left");
                    }
                } else {
                    //LAND
                    if (rowLength == middleWidth && (i == middleWidth / 2 || i == (middleWidth - 1) / 2)) {
                        //desert
                        _this.Hexes[tileNum].type = "land";
                        _this.Hexes[tileNum].resource = "desert";
                    } else {
                        assignResourceToken(_this.Hexes[tileNum]);
                    }
                    //add edges
                    _this.addEdge(tileNum, tileNum - 1, "left");
                    _this.addEdge(tileNum, tileNum - rowLength, "topLeft");
                    _this.addEdge(tileNum, tileNum - rowLength + 1, "topRight");
                    //add vertices
                    _this.addVertex([tileNum, tileNum - 1, tileNum - rowLength], "inland");
                    _this.addVertex([tileNum, tileNum - rowLength, tileNum - rowLength + 1], "inland");
                }
                tileNum++;
            }
            rowNum++;
        }
        //lower half
        for (rowLength = middleWidth - 1; rowLength >= edgeWidth; rowLength--) {
            rowEnd += rowLength;
            for (var i = 0; i < rowLength; i++) {
                _this.Hexes[tileNum] = {
                    id: tileNum,
                    adj: [],
                    edges: [],
                    vertices: [],
                    row: rowNum,
                    col: i,
                    y: rowNum,
                    x: i + (middleWidth - rowLength) * .5
                };
                if (i == 0 || rowLength == edgeWidth || i == rowLength - 1) {
                    //WATER or PORT
                    assignWater(_this.Hexes[tileNum]);
                    //start of row, add top corner
                    //end of row or non-start hex in bottom row, add top and top left corners
                    _this.addVertex([tileNum, tileNum - rowLength, tileNum - rowLength - 1], "coastal");
                    if (i == rowLength - 1 || rowLength == edgeWidth && i > 0) {
                        _this.addVertex([tileNum, tileNum - 1, tileNum - rowLength - 1], "coastal");
                    }
                    //start of row, add top-right edge
                    if (i == 0) {
                        _this.addEdge(tileNum, tileNum - rowLength, "topRight");
                    }
                    //end of row, add left and top-left edges
                    else if (i == rowLength - 1 && rowLength != edgeWidth) {
                            _this.addEdge(tileNum, tileNum - 1, "left");
                            _this.addEdge(tileNum, tileNum - rowLength - 1, "topLeft");
                        }
                        //last row, add top-left and top-right edges
                        else if (i != 0 && i != rowLength - 1 && rowLength == edgeWidth) {
                                _this.addEdge(tileNum, tileNum - rowLength - 1, "topLeft");
                                _this.addEdge(tileNum, tileNum - rowLength, "topRight");
                            }
                            //very last hex, add top-left edge
                            else if (tileNum == rowEnd && rowLength == edgeWidth) {
                                    _this.addEdge(tileNum, tileNum - rowLength - 1, "topLeft");
                                }
                } else {
                    //LAND
                    assignResourceToken(_this.Hexes[tileNum]);
                    _this.addEdge(tileNum, tileNum - 1, "left");
                    _this.addEdge(tileNum, tileNum - rowLength - 1, "topLeft");
                    _this.addEdge(tileNum, tileNum - rowLength, "topRight");
                    //add vertices
                    _this.addVertex([tileNum, tileNum - 1, tileNum - rowLength - 1], "inland");
                    _this.addVertex([tileNum, tileNum - rowLength, tileNum - rowLength - 1], "inland");
                }
                tileNum++;
            }
            rowNum++;
        }
    };
    this.numVertices = 0;
    this.addVertex = function (position, type) {
        _this.numVertices++;
        position.sort(function (a, b) {
            return a - b;
        });
        var vertID = position.join("_");
        var vert = {
            id: vertID,
            type: type
        };
        //console.log("adding vertex", vertID, type);
        var x, y, z;
        z = position.pop();
        y = position.pop();
        x = position.pop();
        if (_this.Vertices[x] == undefined) {
            _this.Vertices[x] = [];
        }
        if (_this.Vertices[x][y] == undefined) {
            _this.Vertices[x][y] = [];
        }
        _this.Vertices[x][y][z] = vert;
        _this.Hexes[x].vertices.push(vert);
        _this.Hexes[y].vertices.push(vert);
        _this.Hexes[z].vertices.push(vert);
    };
    this.numEdges = 0;
    this.addEdge = function (newHex, oldHex, relation) {
        if (oldHex >= newHex) console.warn("addEdge improper coord order");
        _this.numEdges++;
        var edgeID = "" + newHex + "_" + oldHex;
        //    console.log("new", newHex, "old", oldHex, "edgeID", edgeID);
        _this.Hexes[newHex].adj.push(_this.Hexes[oldHex]);
        _this.Hexes[oldHex].adj.push(_this.Hexes[newHex]);
        if (_this.Edges[oldHex] == undefined) {
            _this.Edges[oldHex] = [];
        }
        _this.Edges[oldHex][newHex] = {
            id: edgeID,
            pre: _this.Hexes[oldHex],
            suc: _this.Hexes[newHex]
        };
        _this.Hexes[newHex].edges.push(_this.Edges[oldHex][newHex]);
        _this.Hexes[oldHex].edges.push(_this.Edges[oldHex][newHex]);
        switch (relation) {
            case "left":
                _this.Hexes[newHex].left = _this.Hexes[oldHex];
                _this.Hexes[oldHex].right = _this.Hexes[newHex];
                break;
            case "topLeft":
                _this.Hexes[newHex].topLeft = _this.Hexes[oldHex];
                _this.Hexes[oldHex].bottomRight = _this.Hexes[newHex];
                break;
            case "topRight":
                _this.Hexes[newHex].topRight = _this.Hexes[oldHex];
                _this.Hexes[oldHex].bottomLeft = _this.Hexes[newHex];
        }
    };
};
var houseEach = exports.houseEach = function houseEach(arr, game, callback) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] !== undefined) {
            for (var j = 0; j < arr[i].length; j++) {
                if (arr[i][j] !== undefined) {
                    for (var k = 0; k < arr[i][j].length; k++) {
                        if (arr[i][j][k] !== undefined) {
                            callback(arr[i][j][k], game);
                        }
                    }
                }
            }
        }
    }
};
var roadEach = exports.roadEach = function roadEach(arr, game, callback) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] !== undefined) {
            for (var j = 0; j < arr[i].length; j++) {
                if (arr[i][j] !== undefined) {
                    callback(arr[i][j], game);
                }
            }
        }
    }
};
var GameState = exports.GameState = function GameState(game) {
    var _this2 = this;

    this.robberLoc = 18;
    this.PlayerStates = [];
    this.Houses = [];
    this.Roads = [];
    this.turnCount = 0;
    this.houseEach = function (callback) {
        for (var i = 0; i < _this2.Houses.length; i++) {
            if (_this2.Houses[i] !== undefined) {
                for (var j = 0; j < _this2.Houses[i].length; j++) {
                    if (_this2.Houses[i][j] !== undefined) {
                        for (var k = 0; k < _this2.Houses[i][j].length; k++) {
                            if (_this2.Houses[i][j][k] !== undefined) {
                                callback(_this2.Houses[i][j][k], game);
                            }
                        }
                    }
                }
            }
        }
    };

    this.roadEach = function (callback) {
        for (var i = 0; i < _this2.Roads.length; i++) {
            if (_this2.Roads[i] !== undefined) {
                for (var j = 0; j < _this2.Roads[i].length; j++) {
                    if (_this2.Roads[i][j] !== undefined) {
                        callback(_this2.Roads[i][j], game);
                    }
                }
            }
        }
    };
    this.pushPlayerState = function (state) {
        this.PlayerStates.push(state);
        return this.PlayerStates.length - 1;
    };
    this.updatePlayerpSettlements = function (houseTuple, excludedPlayer) {
        sort(houseTuple);
        console.log("updating all player p settlements");
        //TODO done?
        //remove possible houses adjacent to one just purchased
        //find pHouse elimination coords

        var _houseTuple = _slicedToArray(houseTuple, 3);

        var q = _houseTuple[0];
        var r = _houseTuple[1];
        var s = _houseTuple[2];

        var intersects = [];
        intersects.push({
            x: q,
            y: r,
            z: adjIntersection(q, r)
        });
        intersects.push({
            x: q,
            y: s,
            z: adjIntersection(q, s)
        });
        intersects.push({
            x: r,
            y: s,
            z: adjIntersection(r, s)
        });
        _this2.PlayerStates.forEach(function (player) {
            if (player.id != excludedPlayer.id) {
                intersects.forEach(function (i) {
                    var _sort = sort([i.x, i.y, i.z.pop()]);

                    var _sort2 = _slicedToArray(_sort, 3);

                    var x = _sort2[0];
                    var y = _sort2[1];
                    var z = _sort2[2]; //I know this is terrible, shut up

                    removeTriple(player.pSettlements, x, y, z);

                    var _sort3 = sort([i.x, i.y, i.z.pop()]);

                    var _sort4 = _slicedToArray(_sort3, 3);

                    x = _sort4[0];
                    y = _sort4[1];
                    z = _sort4[2];

                    removeTriple(player.pSettlements, x, y, z);
                });
            }
        });
    };
};

var PlayerState = exports.PlayerState = function PlayerState(state) {
    var _this3 = this;

    this.gameState = state; //TODO update this every turn
    this.id = state.PlayerStates.length;
    this.houses = [];
    this.roads = [];
    this.pSettlements = [];
    this.pCities = [];
    this.pRoads = [];
    this.lumber = 4;
    this.brick = 4;
    this.wool = 2;
    this.grain = 2;
    this.ore = 0;
    this.VPCards = 0;

    this.buySettlement = function (houseTuple) {
        console.log('making house');
        sort(houseTuple);
        console.log('sorted houseTuple = ' + houseTuple);
        var houseID = houseTuple.join("_");
        console.log('houseID is ' + houseID);

        var _houseTuple2 = _slicedToArray(houseTuple, 3);

        var q = _houseTuple2[0];
        var r = _houseTuple2[1];
        var s = _houseTuple2[2];

        if (_this3.isPossibleHouse(houseTuple, _this3.pSettlements) && _this3.hasResources(settlementPrice)) {
            console.log('player has resources and is legal spot');
            console.log('removing resources');
            _this3.removeResources(settlementPrice);
            var newHouse = {
                id: houseID,
                type: "settlement",
                owner: _this3.id
            };
            addTriple(_this3.houses, q, r, s, newHouse);
            //add to gameStates houses
            addTriple(_this3.gameState.Houses, q, r, s, newHouse);
            removeTriple(_this3.pSettlements, q, r, s);
            _this3.addpRoads(houseTuple);
            _this3.addpCity(houseTuple);
            _this3.subscribeToHexes(houseTuple);
            _this3.gameState.updatePlayerpSettlements(houseTuple, _this3);
        }
    };

    this.buyCity = function (houseTuple) {
        sort(houseTuple);
        var houseID = houseTuple.join("_");

        var _houseTuple3 = _slicedToArray(houseTuple, 3);

        var q = _houseTuple3[0];
        var r = _houseTuple3[1];
        var s = _houseTuple3[2];

        if (_this3.isPossibleHouse(houseTuple, _this3.pCities) && _this3.hasResources(cityPrice)) {
            _this3.removeResources(cityPrice);
            var newHouse = {
                id: houseID,
                type: "city",
                owner: _this3.id
            };
            addTriple(_this3.houses, q, r, s, newHouse);
            //add to gameStates houses
            addTriple(_this3.gameState.Houses, q, r, s, newHouse);
            removeTriple(_this3.pCities, q, r, s);
            _this3.subscribeToHexes(houseTuple);
        }
    };

    this.addpCity = function (houseTuple) {
        sort(houseTuple);
        var houseID = houseTuple.join("_");

        var _houseTuple4 = _slicedToArray(houseTuple, 3);

        var q = _houseTuple4[0];
        var r = _houseTuple4[1];
        var s = _houseTuple4[2];

        addTriple(_this3.pCities, q, r, s, {
            id: houseID
        });
    };
    this.buyRoad = function (roadTuple) {
        sort(roadTuple);
        var roadID = roadTuple.join("_");

        var _roadTuple = _slicedToArray(roadTuple, 2);

        var u = _roadTuple[0];
        var v = _roadTuple[1];

        if (_this3.isPossibleRoad(roadTuple) && _this3.hasResources(roadPrice)) {
            _this3.removeResources(roadPrice);
            var newRoad = {
                id: roadID,
                type: "road",
                owner: _this3.id
            };
            addDouble(_this3.roads, u, v, newRoad);
            addDouble(_this3.gameState.Roads, u, v, newRoad);
            removeDouble(_this3.pRoads, u, v);
            //add pSettlement
            console.log("calculating intersection", u, curGame.Hexes[u], v, curGame.Hexes[v]);

            var intersection = adjIntersection(u, v);
            var t = intersection.pop();
            var pHouseTuple = [t, u, v];
            sort(pHouseTuple);
            var houseID = pHouseTuple.join("_");
            var _pHouseTuple = pHouseTuple;

            var _pHouseTuple2 = _slicedToArray(_pHouseTuple, 3);

            var q = _pHouseTuple2[0];
            var r = _pHouseTuple2[1];
            var s = _pHouseTuple2[2];

            addTriple(_this3.pSettlements, q, r, s, {
                type: "settlement",
                id: houseID
            });
            t = intersection.pop();
            pHouseTuple = [t, u, v];
            sort(pHouseTuple);
            houseID = pHouseTuple.join("_");
            var _pHouseTuple3 = pHouseTuple;

            var _pHouseTuple4 = _slicedToArray(_pHouseTuple3, 3);

            q = _pHouseTuple4[0];
            r = _pHouseTuple4[1];
            s = _pHouseTuple4[2];

            addTriple(_this3.pSettlements, q, r, s, {
                type: "settlement",
                id: houseID
            });
        }
    };
    this.addpRoads = function (houseTuple) {
        sort(houseTuple);

        var _houseTuple5 = _slicedToArray(houseTuple, 3);

        var q = _houseTuple5[0];
        var r = _houseTuple5[1];
        var s = _houseTuple5[2];

        var qr, rs, qs;
        qr = {
            id: q + "_" + r
        };
        rs = {
            id: r + "_" + s
        };
        qs = {
            id: q + "_" + s
        };
        addDouble(_this3.pRoads, q, r, qr);
        addDouble(_this3.pRoads, r, s, rs);
        addDouble(_this3.pRoads, q, s, qs);
    };
    this.removeResources = function (price) {
        console.log(price);
        for (var res in price) {
            _this3.res -= price.res;
        }
    };
    this.hasResources = function (price) {
        console.log('check if player has resources for purchase');
        var hasRes;
        for (var res in price) {
            if (_this3.res < price.res) hasRes = false;
        }
        hasRes = true;
        var status = hasRes ? 'has' : 'does not have';
        console.log('player ' + status + ' the required resources in ' + price);
        return hasRes;
    };
    this.isPossibleHouse = function (houseTuple, pHouses) {
        sort(houseTuple);
        var isPossible;

        var _houseTuple6 = _slicedToArray(houseTuple, 3);

        var q = _houseTuple6[0];
        var r = _houseTuple6[1];
        var s = _houseTuple6[2];

        if (pHouses[q] == undefined || pHouses[q][r] == undefined || pHouses[q][r][s] == undefined || pHouses[q][r][s] == "placed") {
            isPossible = false;
        } else {
            isPossible = true;
            console.log(houseTuple + ' is legal settlement spot');
        }
        return isPossible;
    };

    this.isPossibleRoad = function (roadTuple) {
        sort(roadTuple);
        var isPossible;
        var pRoads = _this3.pRoads;

        var _roadTuple2 = _slicedToArray(roadTuple, 2);

        var u = _roadTuple2[0];
        var v = _roadTuple2[1];

        if (pRoads[u] == undefined || pRoads[u][v] == undefined || pRoads[u][v] == "placed") {
            isPossible = false;
        } else {
            isPossible = true;
            console.log(roadTuple + ' is a legal road spot');
        }
        return isPossible;
    };

    this.subscribeToHexes = function (houseTuple) {
        houseTuple.forEach(function (hexID) {
            var hex = curGame.Hexes[hexID];
            if (hex.subscribers == undefined) hex.subscribers = [];
            hex.subscribers.push(_this3.id);
        });
    };

    this.countVP = function () {
        var VP = 0;
        _this3.houses.forEach(function (house) {
            if (house.type == "city") {
                VP += 2;
            } else if (house.type == "settlement") {
                VP++;
            }
        });
        VP += _this3.VPCards;
        if (_this3.hasLongestRoad) {
            VP += 2;
        }
        if (_this3.hasLargestArmy) {
            VP += 2;
        }
        _this3.VP = VP;
        return VP;
    };
};
var addTriple = exports.addTriple = function addTriple(arr, x, y, z, obj) {
    if (x > y || y > z) console.error("Tried to addTriple with improper coord order");
    if (arr[x] == undefined) {
        arr[x] = [];
    }
    if (arr[x][y] == undefined) {
        arr[x][y] = [];
    }
    if (arr[x][y][z] == "placed") {
        return;
    }
    arr[x][y][z] = obj;
    console.log("addedTriple");
};
var addDouble = exports.addDouble = function addDouble(arr, x, y, obj) {
    if (x > y) console.error("Tried to addDouble with improper coord order");
    if (arr[x] == undefined) arr[x] = [];
    if (arr[x][y] == "placed") return;
    arr[x][y] = obj;
};
var removeTriple = exports.removeTriple = function removeTriple(arr, x, y, z) {
    if (x > y || y > z) console.error("Tried to addTriple with improper coord order");
    if (arr[x] == undefined) arr[x] = [];
    if (arr[x][y] == undefined) arr[x][y] = [];
    console.log('triple to remove ', arr);
    arr[x][y][z] = "placed";
};
var removeDouble = exports.removeDouble = function removeDouble(arr, x, y) {
    if (x > y) console.error("Tried to addDouble with improper coord order");
    if (arr[x] == undefined) arr[x] = [];
    arr[x][y] = "placed";
};

//Fisher-Yates, via mbostock
function shuffle(array) {
    var m = array.length,
        t,
        i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
}
//array intersection, from stackoverflow question 1885557

function intersect_safe(a, b) {
    var ai = 0,
        bi = 0;
    var result = new Array();

    while (ai < a.length && bi < b.length) {
        if (a[ai] < b[bi]) {
            ai++;
        } else if (a[ai] > b[bi]) {
            bi++;
        } else /* they're equal */{
                result.push(a[ai]);
                ai++;
                bi++;
            }
    }

    return result;
}

//TODO --- from here down
function gameOver(game) {
    //check if someone > 10 VP
    game.peekGameState().PlayerStates.forEach(function (player) {
        if (player.countVP() >= 10) {
            game.Winner = player;
            return true;
        }
    });
    return false;
}

function determinePlayer(game) {
    var players = game.peekGameState().PlayerStates;
    console.log(game.peekGameState().turnCount, game.peekGameState().turnCount % players.length);
    return players[game.peekGameState().turnCount % players.length];
}

function distributeRes(roll, game) {
    var playerGains = [];
    console.log("in distribRes", "TokenMap", game.TokenMap);
    game.TokenMap[roll].hexes.forEach(function (hex) {
        if (hex.subscribers) {
            hex.subscribers.forEach(function (sub) {
                if (!hex.robber) {
                    game.peekGameState().PlayerStates[sub][hex.resource]++;
                    if (playerGains[sub] == undefined) playerGains[sub] = {};
                    playerGains[sub][hex.resource]++;
                }
            });
        }
    });
    return playerGains;
}

function endTurn(player, game) {
    if (game.peekGameState().turnCount == undefined) game.peekGameState().turnCount = 0;
    game.peekGameState().turnCount++;
}

function endGame(game) {
    console.log('game over');
}

function robberMove(player, game, hexID) {
    //remove resources if > 7
    var lostResources = [];
    game.peekGameState().PlayerStates.forEach(function (player) {
        var numRes = 0;
        numRes += player.grain;
        numRes += player.ore;
        numRes += player.lumber;
        numRes += player.wool;
        numRes += player.brick;
        if (numRes > 7) {
            var lostRes = Math.ceil(numRes / 2);
            while (lostRes > 0) {
                var rand = Math.floor(Math.random() * game.landTypes.length);
                var res = game.landTypes[rand];
                if (player[res] > 0) {
                    player[res]--;
                }
                lostRes--;
            }
            console.log('exiting while');
        }
    });
    //move robber to hexID
    console.log(hexID, game.Hexes[hexID]);
    game.Hexes[hexID].robber = true;
    var prevLoc = game.peekGameState().robberLoc;
    game.peekGameState().robberLoc = hexID;
    console.log(prevLoc, game.Hexes[prevLoc]);
    game.Hexes[prevLoc].robber = false;

    //steal random resource from player
    if (game.Hexes[hexID].subscribers) {
        var owner = game.Hexes[hexID].subscribers[0];

        var steal = function steal() {
            console.log("stealing");
            var stealRes = game.landTypes[Math.floor(Math.random() * game.landTypes.length)];
            if (owner.stealRes > 0) {
                owner.stealRes--;
                player.stealRes++;
            } else {
                steal();
            }
        };
    }
    console.log("done robber");
}

function rollDice() {
    var die1, die2;
    die1 = Math.floor(Math.random() * 6) + 1;
    die2 = Math.floor(Math.random() * 6) + 1;
    return die1 + die2;
}

var adjIntersection = exports.adjIntersection = function adjIntersection(u, v) {
    var uAdjList = [],
        vAdjList = [];
    curGame.Hexes[u].adj.forEach(function (adjHex) {
        uAdjList.push(adjHex.id);
    });
    curGame.Hexes[v].adj.forEach(function (adjHex) {
        vAdjList.push(adjHex.id);
    });
    sort(uAdjList);
    sort(vAdjList);
    var intersection = intersect_safe(uAdjList, vAdjList); //this.gameState.Hexes?
    return intersection;
};

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loader = loader;

var _queue = require("../../..//node_modules/queue-async/queue");

var _queue2 = _interopRequireDefault(_queue);

var _assetList = require("../view/assetList");

var assets = _interopRequireWildcard(_assetList);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loader(meshMap, callback) {
    var meshQueue = (0, _queue2.default)();

    assets.geometries.forEach(function (d) {
        meshQueue.defer(function (done) {
            assets.meshLoader.load(d[1], function (geom, mat) {
                var texture = assets.textures.filter(function (e) {
                    return e[0] === d[0];
                })[0];
                if (texture !== undefined) {
                    assets.texLoader.load(texture[1], function (tex) {
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

    meshQueue.awaitAll(function (error, res) {
        callback();
    });
}

},{"../../..//node_modules/queue-async/queue":1,"../view/assetList":7}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getWorldPos = getWorldPos;
exports.getHousePos = getHousePos;
exports.getRoadPos = getRoadPos;
exports.geomCenter = geomCenter;
function getWorldPos(pos) {
    return pos[2] % 2 == 0 ? [pos[0], pos[1], pos[2] * .77] : [pos[0] - .5, pos[1], pos[2] * .77];
}

function getHousePos(posA, posB, posC) {
    var wA = getWorldPos(posA);
    var wB = getWorldPos(posB);
    var wC = getWorldPos(posC);
    var avgX = (wA[0] + wB[0] + wC[0]) / 3;
    var avgZ = (wA[2] + wB[2] + wC[2]) / 3;
    return moreOdd(posA, posB, posC) ? [avgX, posA[1], avgZ] : [avgX, posA[1], avgZ];
}

function getRoadPos(posA, posB) {
    console.log(posA, posB);
    var wA = getWorldPos(posA);
    var wB = getWorldPos(posB);
    console.log(wA, wB);
    var avgX = (wA[0] + wB[0]) / 2;
    var avgZ = (wA[2] + wB[2]) / 2;
    return [avgX, posA[1], avgZ];
}

function geomCenter(id, game) {
    var ids = id.split("_");
    console.log('ids ' + ids);
    var points = [];
    ids.forEach(function (d, i) {
        points[i] = [game.Hexes[d].x, game.Hexes[d].y * .77];
    });
    console.log('points init ' + points);
    var avgs = [];
    points.forEach(function (d) {
        d.forEach(function (p, i) {
            if (avgs[i] === undefined) avgs[i] = 0;
            avgs[i] += p;
        });
    });
    console.log('added columns ' + avgs);
    avgs.forEach(function (d, i) {
        avgs[i] /= points.length;
    });
    console.log('avgs ' + avgs);
    return avgs;
}

function moreOdd(posA, posB, posC) {
    var sameY;

    var vert = 2;
    if (posA[vert] === posB[vert]) {
        sameY = posA[vert];
    } else if (posB[vert] === posC[vert]) {
        sameY = posB[vert];
    } else if (posA[vert] === posC[vert]) {
        sameY = posA[vert];
    }
    return sameY % 2 == 1;
}

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var meshLoader = exports.meshLoader = new THREE.JSONLoader();
var texLoader = exports.texLoader = new THREE.TextureLoader();

var loadedTextures = exports.loadedTextures = {};

var geometries = exports.geometries = [['hex-grain', '../assets/hex.json'], ['hex-wool', '../assets/hex.json'], ['hex-lumber', '../assets/hex.json'], ['hex-brick', '../assets/hex.json'], ['hex-ore', '../assets/hex.json'], ['hex-desert', '../assets/hex.json'], ['port', '../assets/boat.json'], ['robber', '../assets/robber.json'], ['token-2', '../assets/token.json'], ['token-3', '../assets/token.json'], ['token-4', '../assets/token.json'], ['token-5', '../assets/token.json'], ['token-6', '../assets/token.json'], ['token-7', '../assets/token.json'], ['token-8', '../assets/token.json'], ['token-9', '../assets/token.json'], ['token-10', '../assets/token.json'], ['token-11', '../assets/token.json'], ['token-12', '../assets/token.json'], ['settlement', '../assets/house.json'], ['city', '../assets/city.json'], ['road', '../assets/road.json']];

var textures = exports.textures = [['hex-ore', '../assets/Ore.png'], ['hex-grain', '../assets/Grain.png'], ['hex-lumber', '../assets/Lumber.png'], ['hex-wool', '../assets/Wool.png'], ['hex-desert', '../assets/Desert.png'], ['hex-brick', '../assets/Brick.png'], ['token-2', '../assets/two.png'], ['token-3', '../assets/three.png'], ['token-4', '../assets/four.png'], ['token-5', '../assets/five.png'], ['token-6', '../assets/six.png'], ['token-7', '../assets/seven.png'], ['token-8', '../assets/eight.png'], ['token-9', '../assets/nine.png'], ['token-10', '../assets/ten.png'], ['token-11', '../assets/eleven.png'], ['token-12', '../assets/twelve.png']];

},{}],8:[function(require,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.controls = exports.renderer = exports.camera = exports.meshes = undefined;
exports.renderPiece = renderPiece;
exports.renderCity = renderCity;
exports.renderSettlement = renderSettlement;
exports.renderRoad = renderRoad;
exports.renderToken = renderToken;
exports.renderHex = renderHex;
exports.renderBoard = renderBoard;
exports.render = render;
exports.gameOver = gameOver;
exports.nextPlayer = nextPlayer;
exports.askForDiceRoll = askForDiceRoll;
exports.renderResourceDistribution = renderResourceDistribution;
exports.startBuyPhase = startBuyPhase;
exports.showEndOfTurn = showEndOfTurn;
exports.moveRobber = moveRobber;
exports.attachClick = attachClick;

var _model = require("../model/model");

var model = _interopRequireWildcard(_model);

var _worldManip = require("../utils/worldManip.js");

var terraHammer = _interopRequireWildcard(_worldManip);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var scene = new THREE.Scene();

var meshes = exports.meshes = {};

var moveMeshes = {};

function renderPiece(owner, model, game, color) {
    console.log('model ', model);
    console.log(owner);
    var piece = meshes[model.type].clone();
    piece.model = model;
    scene.add(piece);
    if (color === undefined) {
        color = game.peekGameState().PlayerStates[owner].color;
    }
    piece.material = new THREE.MeshPhongMaterial({
        color: color
    });
    piece.position.set(model.pos[0], model.pos[1], model.pos[2]);
    if (model.rot) piece.rotation.set(0, model.rot[1], 0);
    piece.scale.set(model.scale[0], model.scale[1], model.scale[2]);
    return piece;
}

function renderCity(model, hex) {
    model.scale = [.3, .5, .3];
    renderPiece(model, model);
}

function renderSettlement(house, game, color) {
    //optional color for pSettlements
    var model = {};
    model.house = house;
    model.type = house.type;
    model.possible = house.possible;

    var _terraHammer$geomCent = terraHammer.geomCenter(house.id, game);

    var _terraHammer$geomCent2 = _slicedToArray(_terraHammer$geomCent, 2);

    var x = _terraHammer$geomCent2[0];
    var z = _terraHammer$geomCent2[1];

    model.pos = [x, 0, z];
    model.scale = [.1, .2, .1];
    renderPiece(house.owner, model, game, color);
}

function higherTileOdd(tiles) {
    var higher = tiles[0].pos[2] > tiles[1].pos[2] ? tiles[0].pos[2] : tiles[1].pos[2];
    return higher % 2 == 1;
}

function sameX(tiles) {
    return tiles[0].pos[0] === tiles[1].pos[0];
}

function tilesSameLevel(tiles) {
    return tiles[0].pos[2] === tiles[1].pos[2];
}
function renderRoad(road, game) {
    var model = {};
    model.type = 'road';

    var _terraHammer$geomCent3 = terraHammer.geomCenter(road.id, game);

    var _terraHammer$geomCent4 = _slicedToArray(_terraHammer$geomCent3, 2);

    var x = _terraHammer$geomCent4[0];
    var z = _terraHammer$geomCent4[1];
    //var rot = (tilesSameLevel(tiles)) ? [0, 0, 0] : (sameX(tiles)) ? [0, 65 * Math.PI / 180, 0] : [0, -65 * Math.PI / 180, 0];
    //  if (!higherTileOdd(tiles)) {
    //      rot[1] = -rot[1];
    //  }
    //  model.rot = rot;

    model.pos = [x, 0, z];
    model.scale = [.15, .15, .15];
    renderPiece(road.owner, model, game);
}
function renderToken(piece) {
    if (piece.token) {
        var token = meshes['token-' + piece.token].clone();
        scene.add(token);
        token.position.set(piece.x, 0, piece.y * .77);
        token.scale.set(.1, .1, .1);
    }
}

function renderHex(piece) {
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
    var robberLoc = game.Hexes[game.peekGameState().robberLoc];
    console.log(robberLoc);
    robber.position.set(robberLoc.x, 0, robberLoc.y * .77);
    robber.scale.set(.1, .2, .1);
    return robber;
}

function renderBoard(game) {
    game.Hexes.forEach(function (d) {
        renderHex(d);
        renderToken(d);
    });
    game.peekGameState().houseEach(renderSettlement);
    game.peekGameState().roadEach(renderRoad);
    moveMeshes['robber'] = renderRobber(game);
}

var camera = exports.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, .1, 1000);
var renderer = exports.renderer = new THREE.WebGLRenderer();

var controls = exports.controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.mouseButtons = {
    ORBIT: THREE.MOUSE.RIGHT,
    ZOOM: 4,
    PAN: THREE.MOUSE.MIDDLE
};
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
    waterColor: 0x001e0f
});

var mirrorMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(10000, 10000), water.material);

mirrorMesh.add(water);
mirrorMesh.rotation.x = -Math.PI * 0.5;
mirrorMesh.position.y = -.05;
scene.add(mirrorMesh);

function render(game) {
    water.material.uniforms.time.value += 0.05 / 60.0;
    water.render();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

//TODO --- from here down

function gameOver(game) {}

function GUI() {
    var _this = this;

    $('body').append('<gui></gui>');
    var gui = $('gui')[0];
    gui.style.position = 'absolute';
    gui.style.top = 0;

    this.drawPlayerCounter = function () {
        _this.playerCounter = $('<div id="playerCounter"></div>')[0];
        $('body > gui').append(_this.playerCounter);
    };
    this.updatePlayerCounter = function (player) {
        _this.playerCounter.innerHTML = "It's player " + player.id + "'s turn";
        _this.playerCounter.background = player.color;
    };
}

function nextPlayer(player, game) {
    $('body > gui').remove();
    $('body').append('<gui></gui>');
    var gui = $('gui')[0];
    gui.style.position = 'absolute';
    gui.style.top = '0';
    var counter = $('<div id="playerCounter"></div>')[0];
    counter.innerHTML = "it's player " + player.id + "'s turn";
    counter.style.background = player.color;
    $('body > gui').append(counter);

    var cardWidth = 64;
    var cardHeight = 64;
    var cardSpace = 64;
    var curSpace = 32;

    function renderTile(name) {
        $('body > gui').append($("<div id='" + name + "' class='" + name + "Tile'></div>"));
        var tile = $('#' + name)[0];
        tile.style.bottom = 32 + 'px';
        tile.style.left = curSpace + 'px';
        tile.style.width = cardWidth + 'px';
        tile.style.height = cardHeight + 'px';
        curSpace += cardSpace;
        $(tile).append("<div class='frosted'><p>" + player[name] + "</p></div>");
    }
    renderTile('grain');
    renderTile('wool');
    renderTile('brick');
    renderTile('lumber');
    renderTile('ore');
}

function askForDiceRoll(player, game, rolled, seven) {
    var dice;
    console.log($('body'));
    var gui = $('body > gui').append('<button id="roll">roll</button>');

    $('#roll').button().click(function (e) {
        dice = model.rollDice();
        console.log('dice rolled a ', dice);
        if (dice === 7) seven(player, dice, game);else rolled(player, dice, game);
        $('#roll').remove();
    });

    $('#roll')[0].style.position = 'absolute';
    $('#roll')[0].style.top = -98 + 'vh';
    $('#roll')[0].style.left = 50 + 'vw';
}

function renderResourceDistribution(resources, game) {}

function startBuyPhase(player, turn, game) {
    var gui = $('body > gui').append('<button id="endTurn">end</button>').append('<button id="buySettlement">Buy Settlement</button>').append('<button id="buyRoad">Buy Road</button>');

    $('#endTurn').button().click(function (e) {
        turn(game);
    });
    $('#buySettlement').button().click(function (e) {
        var exitBuySettlement = function exitBuySettlement() {
            $('#cancel').remove();
            removepMeshes();
        };
        $('body > gui').append('<button id="cancel">Cancel</button>');
        $('#cancel').button().click(function (e) {
            exitBuySettlement();
        });

        addpSettlements(player, game);
        attachClick(function (mesh) {
            console.log(mesh);
            if (mesh.model && mesh.model.possible) {
                console.log(mesh.model.house);
                var houseTuple = mesh.model.house.id.split('_');
                player.buySettlement(houseTuple);
                $('#cancel').remove();
                removepMeshes();

                game.peekGameState().houseEach(renderSettlement);
            }
        });
    });
    $('#buyRoad').button().click(function (e) {
        attachClick(function (mesh) {});
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
    scene.children.forEach(function (child) {
        if (child.model && child.model.house && child.model.house.possible) {
            console.log("found p house", child);
            scene.remove(child);
        }
    });
}
function addpSettlements(player, game) {
    var renderpSettlement = function renderpSettlement(house, game) {
        console.log(house);
        if (house != "placed") {
            house.possible = true;
            console.log("calling renderSettlement on house", house);
            renderSettlement(house, game, 0xffffff);
        }
    };
    console.log("player.pSettlements", player.pSettlements);
    model.houseEach(player.pSettlements, game, renderpSettlement);
}

function showEndOfTurn(player, endTurn, game) {}
function moveRobber(movePair, game) {
    var robberLoc = game.Hexes[game.peekGameState().robberLoc];
    moveMeshes['robber'].position.set(robberLoc.x, 0, robberLoc.y * .77);
}
function attachClick(callback) {
    document.querySelector('canvas').addEventListener("click", function (evt) {
        var raycaster = new THREE.Raycaster();
        var SCREEN_WIDTH = window.innerWidth * .985;
        var SCREEN_HEIGHT = window.innerHeight * .98;
        var x = evt.clientX / SCREEN_WIDTH * 2 - 1;
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
    mouse.x = event.clientX / window.innerWidth * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
window.addEventListener('mousemove', onMouseMove, false);

},{"../model/model":4,"../utils/worldManip.js":6}]},{},[3]);
