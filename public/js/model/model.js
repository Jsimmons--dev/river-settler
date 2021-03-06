var curGame; //hacky, fix anywhere that uses this
var settlementPrice = {
    "brick": 1,
    "lumber": 1,
    "wool": 1,
    "grain": 1
}
var cityPrice = {
    "ore": 3,
    "grain": 2
}
var roadPrice = {
    "brick": 1,
    "lumber": 1
}
var devCardPrice = {
    "ore": 1,
    "wool": 1,
    "grain": 1
}
export var sort = (array) => {
    return array.sort((a, b) => {
        return a - b;
    });
}
export var Game = function() {
    curGame = this;
    this.gameStates = [];
    this.peekGameState = () => {
        return this.gameStates[this.gameStates.length - 1];
    };
    this.pushGameState = (state) => {
        this.gameStates.push(state);
        return this.gameStates.length - 1;
    }
    this.Hexes = [];
    this.Edges = [];
    this.Vertices = [];
    this.landTypes = ["lumber", "grain", "wool", "brick", "ore"];
    this.tokenNumbers = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];
    this.TokenMap = [];
    this.rowStarts = [];
    this.edgeWidth = 0;
    this.middleWidth = 0;
    this.genTileStacks = (edgeWidth, middleWidth) => {
        var landStack = [],
            waterStack = [],
            tokenStack = [];
        var numLandTiles = 0;
        for (var i = edgeWidth - 1; i < middleWidth - 2; i++) {
            numLandTiles += i * 2;
        }
        numLandTiles += middleWidth - 2;
        shuffle(this.tokenNumbers);
        for (var i = 0; i < numLandTiles; i++) {
            landStack.push(this.landTypes[i % (this.landTypes.length)]);
            tokenStack.push(this.tokenNumbers[i % (this.tokenNumbers.length)]);
        }
        shuffle(landStack);
        shuffle(tokenStack);
        var numPorts = 0;
        var pushWaterRow = () => {
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
        }
        var pushWaterFlank = (rowWidth) => {
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
                })
            }
        }

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
            portExchangeStack.push(this.landTypes[(portExchangeStack.length - numWildcardPorts) % this.landTypes.length]);
        }
        shuffle(portExchangeStack);
        //distribute exchanges to ports
        waterStack.forEach((port) => {
            if (port.type == "port") {
                port.resource = portExchangeStack.pop();
            }
        });
        return {
            landStack,
            waterStack,
            tokenStack
        }
    }
    this.genBoard = (edgeWidth, middleWidth) => {
        this.edgeWidth = edgeWidth;
        this.middleWidth = middleWidth;
        var {
            landStack,
            waterStack,
            tokenStack
        } = this.genTileStacks(edgeWidth, middleWidth);

        var assignResourceToken = (hex) => {
            hex.resource = landStack.pop();
            hex.type = "land";
            var token = tokenStack.pop();
            hex.token = token;
            if (this.TokenMap[token] == undefined) {
                this.TokenMap[token] = {};
            }
            if (this.TokenMap[token].hexes == undefined) {
                this.TokenMap[token].hexes = []
            }
            this.TokenMap[token].hexes.push(this.Hexes[tileNum]);
            this.TokenMap[hex.token]
        }

        var assignWater = (hex) => {
            var tile = waterStack.pop();
            hex.type = tile.type;
            if (hex.type == "port") {
                hex.exchange = tile.resource;
            }
        }

        var tileNum = 0;
        var rowLength = edgeWidth;
        var rowEnd = -1;
        var rowNum = 0;
        //upper half and middle
        for (rowLength; rowLength <= middleWidth; rowLength++) {
            this.rowStarts[rowNum] = rowEnd + 1;
            rowEnd += rowLength;
            for (var i = 0; i < rowLength; i++) {
                this.Hexes[tileNum] = {
                    id: tileNum,
                    adj: [],
                    edges: [],
                    vertices: [],
                    row: rowNum,
                    col: i,
                    y: rowNum,
                    x: i + ((middleWidth - rowLength) * .5)
                };
                if (rowLength == edgeWidth || i == 0 || i == rowLength - 1) {
                    //WATER or PORT
                    assignWater(this.Hexes[tileNum]);
                    //add corner at end of rows
                    if (i == rowLength - 1 && rowEnd > edgeWidth) {
                        this.addVertex([tileNum, tileNum - 1, tileNum - rowLength], "coastal");
                    }
                    //add edge at end of row
                    if (i == rowLength - 1 && rowLength != edgeWidth) {
                        this.addEdge(tileNum, tileNum - 1, "left");
                    }
                } else {
                    //LAND
                    if (rowLength == middleWidth && (i == middleWidth / 2 || i == (middleWidth - 1) / 2)) {
                        //desert
                        this.Hexes[tileNum].type = "land";
                        this.Hexes[tileNum].resource = "desert";
                    } else {
                        assignResourceToken(this.Hexes[tileNum]);
                    }
                    //add edges
                    this.addEdge(tileNum, tileNum - 1, "left");
                    this.addEdge(tileNum, tileNum - rowLength, "topLeft");
                    this.addEdge(tileNum, tileNum - rowLength + 1, "topRight");
                    //add vertices
                    this.addVertex([tileNum, tileNum - 1, tileNum - rowLength], "inland");
                    this.addVertex([tileNum, tileNum - rowLength, tileNum - rowLength + 1], "inland");
                }
                tileNum++;
            }
            rowNum++;
        }
        //lower half
        for (rowLength = middleWidth - 1; rowLength >= edgeWidth; rowLength--) {
            rowEnd += rowLength;
            for (var i = 0; i < rowLength; i++) {
                this.Hexes[tileNum] = {
                    id: tileNum,
                    adj: [],
                    edges: [],
                    vertices: [],
                    row: rowNum,
                    col: i,
                    y: rowNum,
                    x: i + ((middleWidth - rowLength) * .5)
                };
                if (i == 0 || rowLength == edgeWidth || i == rowLength - 1) {
                    //WATER or PORT
                    assignWater(this.Hexes[tileNum]);
                    //start of row, add top corner
                    //end of row or non-start hex in bottom row, add top and top left corners
                    this.addVertex([tileNum, tileNum - rowLength, tileNum - rowLength - 1], "coastal");
                    if (i == rowLength - 1 || rowLength == edgeWidth && i > 0) {
                        this.addVertex([tileNum, tileNum - 1, tileNum - rowLength - 1], "coastal");
                    }
                    //start of row, add top-right edge
                    if (i == 0) {
                        this.addEdge(tileNum, tileNum - rowLength, "topRight");
                    }
                    //end of row, add left and top-left edges
                    else if (i == rowLength - 1 && rowLength != edgeWidth) {
                        this.addEdge(tileNum, tileNum - 1, "left");
                        this.addEdge(tileNum, tileNum - rowLength - 1, "topLeft");
                    }
                    //last row, add top-left and top-right edges
                    else if (i != 0 && i != rowLength - 1 && rowLength == edgeWidth) {
                        this.addEdge(tileNum, tileNum - rowLength - 1, "topLeft");
                        this.addEdge(tileNum, tileNum - rowLength, "topRight");
                    }
                    //very last hex, add top-left edge
                    else if (tileNum == rowEnd && rowLength == edgeWidth) {
                        this.addEdge(tileNum, tileNum - rowLength - 1, "topLeft");
                    }
                } else {
                    //LAND
                    assignResourceToken(this.Hexes[tileNum]);
                    this.addEdge(tileNum, tileNum - 1, "left");
                    this.addEdge(tileNum, tileNum - rowLength - 1, "topLeft");
                    this.addEdge(tileNum, tileNum - rowLength, "topRight");
                    //add vertices
                    this.addVertex([tileNum, tileNum - 1, tileNum - rowLength - 1], "inland");
                    this.addVertex([tileNum, tileNum - rowLength, tileNum - rowLength - 1], "inland");
                }
                tileNum++;
            }
            rowNum++;
        }
    }
    this.numVertices = 0;
    this.addVertex = (position, type) => {
        this.numVertices++;
        position.sort((a, b) => {
            return a - b
        });
        var vertID = position.join("_");
        var vert = {
                id: vertID,
                type: type
            }
            //console.log("adding vertex", vertID, type);
        var x, y, z;
        z = position.pop();
        y = position.pop();
        x = position.pop();
        if (this.Vertices[x] == undefined) {
            this.Vertices[x] = [];
        }
        if (this.Vertices[x][y] == undefined) {
            this.Vertices[x][y] = [];
        }
        this.Vertices[x][y][z] = vert;
        this.Hexes[x].vertices.push(vert);
        this.Hexes[y].vertices.push(vert);
        this.Hexes[z].vertices.push(vert);
    }
    this.numEdges = 0;
    this.addEdge = (newHex, oldHex, relation) => {
        if (oldHex >= newHex) console.warn("addEdge improper coord order");
        this.numEdges++;
        var edgeID = "" + newHex + "_" + oldHex;
        //    console.log("new", newHex, "old", oldHex, "edgeID", edgeID);
        this.Hexes[newHex].adj.push(this.Hexes[oldHex]);
        this.Hexes[oldHex].adj.push(this.Hexes[newHex]);
        if (this.Edges[oldHex] == undefined) {
            this.Edges[oldHex] = [];
        }
        this.Edges[oldHex][newHex] = {
            id: edgeID,
            pre: this.Hexes[oldHex],
            suc: this.Hexes[newHex]
        }
        this.Hexes[newHex].edges.push(this.Edges[oldHex][newHex]);
        this.Hexes[oldHex].edges.push(this.Edges[oldHex][newHex]);
        switch (relation) {
            case "left":
                this.Hexes[newHex].left = this.Hexes[oldHex];
                this.Hexes[oldHex].right = this.Hexes[newHex];
                break;
            case "topLeft":
                this.Hexes[newHex].topLeft = this.Hexes[oldHex];
                this.Hexes[oldHex].bottomRight = this.Hexes[newHex];
                break;
            case "topRight":
                this.Hexes[newHex].topRight = this.Hexes[oldHex];
                this.Hexes[oldHex].bottomLeft = this.Hexes[newHex];
        }
    }
}
export var houseEach = (arr, game, callback) => {
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
}
export var roadEach = (arr, game, callback) => {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] !== undefined) {
            for (var j = 0; j < arr[i].length; j++) {
                if (arr[i][j] !== undefined) {
                    callback(arr[i][j], game);
                }
            }
        }
    }
}
export var GameState = function(game) {
    this.robberLoc = 18;
    this.PlayerStates = [];
    this.Houses = [];
    this.Roads = [];
    this.turnCount = 0;
    this.houseEach = (callback) => {
        for (var i = 0; i < this.Houses.length; i++) {
            if (this.Houses[i] !== undefined) {
                for (var j = 0; j < this.Houses[i].length; j++) {
                    if (this.Houses[i][j] !== undefined) {
                        for (var k = 0; k < this.Houses[i][j].length; k++) {
                            if (this.Houses[i][j][k] !== undefined) {
                                callback(this.Houses[i][j][k], game);
                            }
                        }
                    }
                }
            }
        }
    }

    this.roadEach = (callback) => {
        for (var i = 0; i < this.Roads.length; i++) {
            if (this.Roads[i] !== undefined) {
                for (var j = 0; j < this.Roads[i].length; j++) {
                    if (this.Roads[i][j] !== undefined) {
                        callback(this.Roads[i][j], game);
                    }
                }
            }
        }
    }
    this.pushPlayerState = function(state) {
        this.PlayerStates.push(state);
        return this.PlayerStates.length - 1;
    }
    this.updatePlayerpSettlements = (houseTuple, excludedPlayer) => {
        sort(houseTuple);
        console.log("updating all player p settlements");
        //TODO done?
        //remove possible houses adjacent to one just purchased
        //find pHouse elimination coords
        var [q, r, s] = houseTuple;
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
        this.PlayerStates.forEach((player) => {
			if (player.id != excludedPlayer.id) {
            intersects.forEach((i) => {
                var [x, y, z] = sort([i.x, i.y, i.z.pop()]); //I know this is terrible, shut up
                removeTriple(player.pSettlements, x, y, z);
                [x, y, z] = sort([i.x, i.y, i.z.pop()]);
                removeTriple(player.pSettlements, x, y, z);
            });
			}
        });
    }
};

export var PlayerState = function(state) {
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

    this.buySettlement = (houseTuple) => {
        console.log('making house');
        sort(houseTuple);
        console.log('sorted houseTuple = ' + houseTuple);
        var houseID = houseTuple.join("_");
        console.log('houseID is ' + houseID);
        var [q, r, s] = houseTuple;
        if (this.isPossibleHouse(houseTuple, this.pSettlements) && this.hasResources(settlementPrice)) {
            console.log('player has resources and is legal spot');
            console.log('removing resources');
            this.removeResources(settlementPrice);
            var newHouse = {
                id: houseID,
                type: "settlement",
                owner: this.id
            }
            addTriple(this.houses, q, r, s, newHouse);
            //add to gameStates houses
            addTriple(this.gameState.Houses, q, r, s, newHouse);
            removeTriple(this.pSettlements, q, r, s);
            this.addpRoads(houseTuple);
            this.addpCity(houseTuple);
            this.subscribeToHexes(houseTuple);
            this.gameState.updatePlayerpSettlements(houseTuple, this);
        }
    }

    this.buyCity = (houseTuple) => {
        sort(houseTuple);
        var houseID = houseTuple.join("_");
        var [q, r, s] = houseTuple;
        if (this.isPossibleHouse(houseTuple, this.pCities) && this.hasResources(cityPrice)) {
            this.removeResources(cityPrice);
            var newHouse = {
                id: houseID,
                type: "city",
                owner: this.id
            }
            addTriple(this.houses, q, r, s, newHouse);
            //add to gameStates houses
            addTriple(this.gameState.Houses, q, r, s, newHouse);
            removeTriple(this.pCities, q, r, s);
            this.subscribeToHexes(houseTuple);
        }
    }

    this.addpCity = (houseTuple) => {
        sort(houseTuple);
        var houseID = houseTuple.join("_");
        var [q, r, s] = houseTuple;
        addTriple(this.pCities, q, r, s, {
            id: houseID
        });
    }
    this.buyRoad = (roadTuple) => {
        sort(roadTuple);
        var roadID = roadTuple.join("_");
        var [u, v] = roadTuple;
        if (this.isPossibleRoad(roadTuple) && this.hasResources(roadPrice)) {
            this.removeResources(roadPrice);
            var newRoad = {
                id: roadID,
                type: "road",
                owner: this.id
            }
            addDouble(this.roads, u, v, newRoad);
            addDouble(this.gameState.Roads, u, v, newRoad);
            removeDouble(this.pRoads, u, v);
            //add pSettlement
            console.log("calculating intersection", u, curGame.Hexes[u], v, curGame.Hexes[v]);

            var intersection = adjIntersection(u, v);
            var t = intersection.pop();
            var pHouseTuple = [t, u, v];
            sort(pHouseTuple);
            var houseID = pHouseTuple.join("_");
            var [q, r, s] = pHouseTuple;
            addTriple(this.pSettlements, q, r, s, {
                type: "settlement",
                id: houseID
            });
            t = intersection.pop();
            pHouseTuple = [t, u, v];
            sort(pHouseTuple);
            houseID = pHouseTuple.join("_");
            [q, r, s] = pHouseTuple;
            addTriple(this.pSettlements, q, r, s, {
                type: "settlement",
                id: houseID
            });
        }
    }
    this.addpRoads = (houseTuple) => {
        sort(houseTuple);
        var [q, r, s] = houseTuple;
        var qr, rs, qs;
        qr = {
            id: q + "_" + r
        }
        rs = {
            id: r + "_" + s
        }
        qs = {
            id: q + "_" + s
        }
        addDouble(this.pRoads, q, r, qr);
        addDouble(this.pRoads, r, s, rs);
        addDouble(this.pRoads, q, s, qs);
    }
    this.removeResources = (price) => {
        console.log(price);
        for (var res in price) {
            this.res -= price.res;
        }
    }
    this.hasResources = (price) => {
        console.log('check if player has resources for purchase');
        var hasRes;
        for (var res in price) {
            if (this.res < price.res) hasRes = false;
        }
        hasRes = true;
        var status = (hasRes) ? 'has' : 'does not have';
        console.log('player ' + status + ' the required resources in ' + price);
        return hasRes;
    }
    this.isPossibleHouse = (houseTuple, pHouses) => {
        sort(houseTuple);
        var isPossible;
        var [q, r, s] = houseTuple;
        if (pHouses[q] == undefined ||
            pHouses[q][r] == undefined ||
            pHouses[q][r][s] == undefined ||
            pHouses[q][r][s] == "placed") {
            isPossible = false;
        } else {
            isPossible = true;
            console.log(houseTuple + ' is legal settlement spot');
        }
        return isPossible;
    }

    this.isPossibleRoad = (roadTuple) => {
        sort(roadTuple);
        var isPossible;
        var pRoads = this.pRoads;
        var [u, v] = roadTuple;
        if (pRoads[u] == undefined || pRoads[u][v] == undefined || pRoads[u][v] == "placed") {
            isPossible = false;
        } else {
            isPossible = true;
            console.log(roadTuple + ' is a legal road spot');
        }
        return isPossible;
    }

    this.subscribeToHexes = (houseTuple) => {
        houseTuple.forEach((hexID) => {
            var hex = curGame.Hexes[hexID];
            if (hex.subscribers == undefined) hex.subscribers = [];
            hex.subscribers.push(this.id);
        });
    }

    this.countVP = () => {
        var VP = 0;
        this.houses.forEach((house) => {
            if (house.type == "city") {
                VP += 2;
            } else if (house.type == "settlement") {
                VP++;
            }
        });
        VP += this.VPCards;
        if (this.hasLongestRoad) {
            VP += 2;
        }
        if (this.hasLargestArmy) {
            VP += 2;
        }
        this.VP = VP;
        return VP;
    }
};
export var addTriple = (arr, x, y, z, obj) => {
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
}
export var addDouble = (arr, x, y, obj) => {
    if (x > y) console.error("Tried to addDouble with improper coord order");
    if (arr[x] == undefined) arr[x] = [];
    if (arr[x][y] == "placed") return;
    arr[x][y] = obj;
}
export var removeTriple = (arr, x, y, z) => {
    if (x > y || y > z) console.error("Tried to addTriple with improper coord order");
    if (arr[x] == undefined) arr[x] = [];
    if (arr[x][y] == undefined) arr[x][y] = [];
    console.log('triple to remove ', arr);
    arr[x][y][z] = "placed";
}
export var removeDouble = (arr, x, y) => {
    if (x > y) console.error("Tried to addDouble with improper coord order");
    if (arr[x] == undefined) arr[x] = [];
    arr[x][y] = "placed";
}

//Fisher-Yates, via mbostock
export function shuffle(array) {
        var m = array.length,
            t, i;
        while (m) {
            i = Math.floor(Math.random() * m--);
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }
    }
    //array intersection, from stackoverflow question 1885557

export function intersect_safe(a, b) {
    var ai = 0,
        bi = 0;
    var result = new Array();

    while (ai < a.length && bi < b.length) {
        if (a[ai] < b[bi]) {
            ai++;
        } else if (a[ai] > b[bi]) {
            bi++;
        } else /* they're equal */ {
            result.push(a[ai]);
            ai++;
            bi++;
        }
    }

    return result;
}


//TODO --- from here down
export function gameOver(game) {
    //check if someone > 10 VP
    game.peekGameState().PlayerStates.forEach((player) => {
        if (player.countVP() >= 10) {
            game.Winner = player;
            return true;
        }
    });
    return false;
}


export function determinePlayer(game) {
    var players = game.peekGameState().PlayerStates;
    console.log(game.peekGameState().turnCount, game.peekGameState().turnCount % players.length);
    return players[game.peekGameState().turnCount % players.length];
}

export function distributeRes(roll, game) {
    var playerGains = [];
    console.log("in distribRes", "TokenMap", game.TokenMap);
    game.TokenMap[roll].hexes.forEach((hex) => {
        if (hex.subscribers) {
            hex.subscribers.forEach((sub) => {
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

export function endTurn(player, game) {
    if (game.peekGameState().turnCount == undefined) game.peekGameState().turnCount = 0;
    game.peekGameState().turnCount++;
}

export function endGame(game) {
    console.log('game over');
}

export function robberMove(player, game, hexID) {
    //remove resources if > 7
    var lostResources = [];
    game.peekGameState().PlayerStates.forEach((player) => {
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

        var steal = () => {
            console.log("stealing");
            var stealRes = game.landTypes[Math.floor(Math.random() * game.landTypes.length)];
            if (owner.stealRes > 0) {
                owner.stealRes--;
                player.stealRes++;
            } else {
                steal();
            }
        }
    }
    console.log("done robber");
}

export function rollDice() {
    var die1, die2;
    die1 = Math.floor(Math.random() * 6) + 1;
    die2 = Math.floor(Math.random() * 6) + 1;
    return die1 + die2;
}

export var adjIntersection = (u, v) => {
    var uAdjList = [],
        vAdjList = [];
    curGame.Hexes[u].adj.forEach((adjHex) => {
        uAdjList.push(adjHex.id);
    });
    curGame.Hexes[v].adj.forEach((adjHex) => {
        vAdjList.push(adjHex.id);
    });
    sort(uAdjList);
    sort(vAdjList);
    var intersection = intersect_safe(uAdjList, vAdjList); //this.gameState.Hexes?
    return intersection;
}
