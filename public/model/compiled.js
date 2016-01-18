(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
var sort = function sort(array) {
    return array.sort(function (a, b) {
        return a - b;
    });
};
var Game = function Game() {
    var _this = this;

    this.gameStates = [];
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
            landStack.push(_this.landTypes[i % (_this.landTypes.length - 1)]);
            tokenStack.push(_this.tokenNumbers[i % (_this.tokenNumbers.length - 1)]);
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
                    assignResourceToken(_this.Hexes[tileNum]);
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
var GameState = function GameState() {
    this.PlayerStates = [];
    this.Houses = [];
    this.Roads = [];
};

var PlayerState = function PlayerState() {
    var _this2 = this;

    this.gameState; //TODO update this every turn
    this.id;
    this.houses;
    this.roads;
    this.pSettlements;
    this.pRoads;
    this.lumber = 4;
    this.brick = 4;
    this.wool = 2;
    this.grain = 2;
    this.ore = 0;

    this.buySettlement = function (houseTuple) {
        sort(houseTuple);
        var houseID = houseTuple.join("_");

        var _houseTuple = _slicedToArray(houseTuple, 3);

        var q = _houseTuple[0];
        var r = _houseTuple[1];
        var s = _houseTuple[2];

        if (_this2.isPossibleHouse(houseTuple) && _this2.hasResources(settlementPrice)) {
            _this2.removeResources(settlementPrice);
            var newHouse = {
                id: houseID,
                type: "settlement"
            };
            addTriple(_this2.houses, q, r, s, obj);
            addTriple(_this2.gameState.Houses, q, r, s, obj);
            removeTriple(_this2.pSettlements, q, r, s);
            _this2.addpRoads(houseTuple);
            _this2.subscribeToHexes(houseTuple);
        }
    };
    this.buyCity = function (houseTuple) {};
    this.addpRoads = function (houseTuple) {
        sort(houseTuple);

        var _houseTuple2 = _slicedToArray(houseTuple, 3);

        var q = _houseTuple2[0];
        var r = _houseTuple2[1];
        var s = _houseTuple2[2];

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
        addDouble(_this2.pRoads, q, r, qr);
        addDouble(_this2.pRoads, r, s, rs);
        addDouble(_this2.pRoads, q, s, qs);
    };
    this.removeResources = function (price) {
        console.log(price);
        for (var res in price) {
            _this2.res -= price.res;
        }
    };
    this.hasResources = function (price) {
        for (var res in price) {
            if (_this2.res < price.res) return false;
        }
        return true;
    };
    this.isPossibleHouse = function (houseTuple, pHouses) {
        sort(houseTuple);

        var _houseTuple3 = _slicedToArray(houseTuple, 3);

        var q = _houseTuple3[0];
        var r = _houseTuple3[1];
        var s = _houseTuple3[2];

        if (pHouses[q] == undefined || pHouses[q][r] == undefined || pHouses[q][r][s] == undefined || pHouses[q][r][s] == "placed") return false;
        return true;
    };
    this.subscribeToHexes = function (houseTuple) {
        houseTuple.forEach(function (hex) {
            if (hex.subscribers == undefined) hex.subscribers = [];
            hex.subscribers.push(_this2.id);
        });
    };
};
var addTriple = function addTriple(arr, x, y, z, obj) {
    if (x > y || y > z) console.error("Tried to addTriple with improper coord order");
    if (arr[x] == undefined) arr[x] = [];
    if (arr[x][y] == undefined) arr[x][y] = [];
    if (arr[x][y][z] == "placed") return;
    arr[x][y][z] = obj;
};
var addDouble = function addDouble(arr, x, y, obj) {
    if (x > y) console.error("Tried to addDouble with improper coord order");
    if (arr[x] == undefined) arr[x] = [];
    if (arr[x][y] == "placed") return;
    arr[x][y] = obj;
};
var removeTriple = function removeTriple(arr, x, y, z) {
    arr[x][y][z] = "placed";
};
var removeDouble = function removeDouble(arr, x, y) {
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
var myGame = new Game();
myGame.genBoard(4, 7);
console.log(myGame.Hexes);
console.log(myGame.Edges);
console.log(myGame.Vertices);
console.log(myGame.Hexes.length); //37
console.log(myGame.numVertices); //54
console.log(myGame.numEdges); //72

myGame.Hexes.forEach(function (hex) {
    console.log(hex.id, hex.x, hex.y);
});

var b = 10;
for (var i = 0; i < b; i++) {
    console.log(i);
    b++;
}

},{}]},{},[1]);
