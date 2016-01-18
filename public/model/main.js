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
var sort = (array) => {
    return array.sort((a, b) => {
        return a - b;
    });
}
var Game = function() {
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
            landStack.push(this.landTypes[i % (this.landTypes.length - 1)]);
            tokenStack.push(this.tokenNumbers[i % (this.tokenNumbers.length - 1)]);
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
                    assignResourceToken(this.Hexes[tileNum]);
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
var GameState = function() {
    this.PlayerStates = [];
    this.Houses = [];
    this.Roads = [];
};

var PlayerState = function() {
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

    this.buySettlement = (houseTuple) => {
        sort(houseTuple);
        var houseID = houseTuple.join("_");
        var [q, r, s] = houseTuple;
        if (this.isPossibleHouse(houseTuple) && this.hasResources(settlementPrice)) {
            this.removeResources(settlementPrice);
            var newHouse = {
                id: houseID,
                type: "settlement"
            }
            addTriple(this.houses, q, r, s, obj);
            addTriple(this.gameState.Houses, q, r, s, obj);
            removeTriple(this.pSettlements, q, r, s);
			this.addpRoads(houseTuple);
            this.subscribeToHexes(houseTuple);
        }
    }
	this.buyCity = (houseTuple) => {

	}
	this.addpRoads = (houseTuple) => {
		sort(houseTuple);
		var [q, r, s] = houseTuple;
		var qr, rs, qs;
		qr = {
			id : q + "_" + r
		}
		rs = {
			id : r + "_" + s
		}
		qs = {
			id : q + "_" + s
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
        for (var res in price) {
            if (this.res < price.res) return false;
        }
        return true;
    }
    this.isPossibleHouse = (houseTuple, pHouses) => {
		sort(houseTuple);
        var [q, r, s] = houseTuple;
        if (pHouses[q] == undefined || pHouses[q][r] == undefined || pHouses[q][r][s] == undefined || pHouses[q][r][s] == "placed") return false;
        return true;
    }
    this.subscribeToHexes = (houseTuple) => {
        houseTuple.forEach((hex) => {
            if (hex.subscribers == undefined) hex.subscribers = [];
            hex.subscribers.push(this.id);
        });
    }
};
var addTriple = (arr, x, y, z, obj) => {
	if (x > y || y > z) console.error("Tried to addTriple with improper coord order");
    if (arr[x] == undefined) arr[x] = [];
    if (arr[x][y] == undefined) arr[x][y] = [];
	if (arr[x][y][z] == "placed") return;
    arr[x][y][z] = obj;
}
var addDouble = (arr, x, y, obj) => {
	if (x > y) console.error("Tried to addDouble with improper coord order");
	if (arr[x] == undefined) arr[x] = [];
	if (arr[x][y] == "placed") return;
	arr[x][y] = obj;
}
var removeTriple = (arr, x, y, z) => {
	arr[x][y][z] = "placed";
}
var removeDouble = (arr, x, y) => {
	arr[x][y] = "placed";
}
    //Fisher-Yates, via mbostock

function shuffle(array) {
    var m = array.length,
        t, i;
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

myGame.Hexes.forEach((hex) => {
    console.log(hex.id, hex.x, hex.y);
});

var b = 10;
for (var i = 0; i < b; i++){
	console.log(i);
	b++;
}
