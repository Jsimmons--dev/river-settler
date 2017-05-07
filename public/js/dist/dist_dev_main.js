(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
//import * as model from "./model/model";
//import * as view from "./view/view";
//import * as controller from "./controller/controller";
//import * as loader from "./utils/assetLoader";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _ui = require("./ui/ui");

var ui = _interopRequireWildcard(_ui);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

//loader.loader(view.meshes,loadStart);

function loadStart() {
    ui.navigate("start");
}
loadStart();

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

        var _houseTuple = _slicedToArray(houseTuple, 3),
            q = _houseTuple[0],
            r = _houseTuple[1],
            s = _houseTuple[2];

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
            var _sort = sort([i.x, i.y, i.z.pop()]),
                _sort2 = _slicedToArray(_sort, 3),
                x = _sort2[0],
                y = _sort2[1],
                z = _sort2[2];

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

},{"./ui/ui":5}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseUI = exports.BaseUI = function () {
    function BaseUI() {
        _classCallCheck(this, BaseUI);

        if (new.target === BaseUI) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
    }

    _createClass(BaseUI, [{
        key: "init",
        value: function init() {
            var that = this;
            throw new function () {
                this.message = "children must override init";
                this.class = that.constructor.name;
            }();
        }
    }]);

    return BaseUI;
}();

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OptionsUI = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseUI2 = require("./BaseUI");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OptionsUI = exports.OptionsUI = function (_BaseUI) {
    _inherits(OptionsUI, _BaseUI);

    function OptionsUI() {
        _classCallCheck(this, OptionsUI);

        return _possibleConstructorReturn(this, (OptionsUI.__proto__ || Object.getPrototypeOf(OptionsUI)).apply(this, arguments));
    }

    _createClass(OptionsUI, [{
        key: "init",
        value: function init(uiRoot, context) {}
    }]);

    return OptionsUI;
}(_BaseUI2.BaseUI);

},{"./BaseUI":2}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.StartUI = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseUI2 = require("./BaseUI");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StartUI = exports.StartUI = function (_BaseUI) {
    _inherits(StartUI, _BaseUI);

    function StartUI() {
        _classCallCheck(this, StartUI);

        return _possibleConstructorReturn(this, (StartUI.__proto__ || Object.getPrototypeOf(StartUI)).apply(this, arguments));
    }

    _createClass(StartUI, [{
        key: "init",
        value: function init(uiRoot) {

            uiRoot.innerHTML = "\n            <div class=\"col\" style=\"height:50%\"></div>\n            <div class=\"row\">\n                <p class=\"col offset-s3 s6 btn waves-effect waves-light\">Start New Game</p>\n                <p class=\"col offset-s3 s6 btn waves-effect waves-light\">Load Scenario</p>\n                <p class=\"col offset-s3 s6 btn waves-effect waves-light\">Scenario Editor</p>\n                <p class=\"col offset-s3 s6 btn waves-effect waves-light\">Options</p>\n            </div>\n            ";
        }
    }]);

    return StartUI;
}(_BaseUI2.BaseUI);

},{"./BaseUI":2}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.navigate = navigate;

var _StartUI = require("./StartUI");

var _OptionsUI = require("./OptionsUI");

var uiRoot = document.createElement('div');
uiRoot.style.height = '100vh';
uiRoot.style.width = '100vw';
uiRoot.style.position = 'absolute';
//uiRoot.style.top = '-8px';
//uiRoot.style.left = '-8px';

document.body.appendChild(uiRoot);

var currentView = void 0;

var routeElements = {};

var routeMap = {
    'start': new _StartUI.StartUI(),
    'options': new _OptionsUI.OptionsUI()
};

var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
    for (var _iterator = Object.entries(routeMap)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _step$value = _slicedToArray(_step.value, 2),
            route = _step$value[0],
            uiClass = _step$value[1];

        var newNode = document.createElement('div');
        newNode.style.height = '100%';
        newNode.style.width = '100%';
        newNode.style.display = 'none';
        newNode.id = route + '-ui';
        uiRoot.appendChild(newNode);

        routeElements[route] = newNode;
        uiClass.init(routeElements[route]);
    }
} catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
} finally {
    try {
        if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
        }
    } finally {
        if (_didIteratorError) {
            throw _iteratorError;
        }
    }
}

function navigate(route) {
    if (currentView !== undefined) {
        currentView.style.display = 'none';
    }
    routeElements[route].style.display = 'block';
    currentView = routeElements[route];
}

},{"./OptionsUI":3,"./StartUI":4}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIm1haW4uanMiLCJ1aS9CYXNlVUkuanMiLCJ1aS9PcHRpb25zVUkuanMiLCJ1aS9TdGFydFVJLmpzIiwidWkvdWkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBQ0E7O0lBQVksRTs7OztBQUVaOztBQUVBLFNBQVMsU0FBVCxHQUFvQjtBQUNoQixPQUFHLFFBQUgsQ0FBWSxPQUFaO0FBQ0g7QUFDRDs7QUFFQSxTQUFTLElBQVQsR0FBZ0I7QUFDZixRQUFJLFNBQVMsSUFBSSxNQUFNLElBQVYsRUFBYjtBQUNBLFdBQU8sUUFBUCxDQUFnQixDQUFoQixFQUFtQixDQUFuQjtBQUNBLFFBQUksWUFBWSxJQUFJLE1BQU0sU0FBVixDQUFvQixNQUFwQixDQUFoQjtBQUNBLFdBQU8sYUFBUCxDQUFxQixTQUFyQjtBQUNBLFFBQUksVUFBVSxJQUFJLE1BQU0sV0FBVixDQUFzQixTQUF0QixDQUFkO0FBQ0EsWUFBUSxLQUFSLEdBQWdCLFFBQWhCO0FBQ0EsY0FBVSxlQUFWLENBQTBCLE9BQTFCO0FBQ0EsUUFBSSxVQUFVLElBQUksTUFBTSxXQUFWLENBQXNCLFNBQXRCLENBQWQ7QUFDQSxZQUFRLEtBQVIsR0FBZ0IsTUFBaEI7QUFDQSxjQUFVLGVBQVYsQ0FBMEIsT0FBMUI7QUFDQSxnQkFBWSxNQUFaO0FBQ0EsZUFBVyxTQUFYLENBQXFCLE1BQXJCO0FBQ0E7O0FBRUQsU0FBUyxZQUFULENBQXNCLElBQXRCLEVBQTRCO0FBQUE7O0FBQ3hCLFFBQUksS0FBSyxTQUFMLElBQWtCLFNBQXRCLEVBQWlDLEtBQUssU0FBTCxHQUFpQixDQUFqQjtBQUNqQyxRQUFJLEtBQUssYUFBTCxJQUFzQixTQUExQixFQUFxQyxLQUFLLGFBQUwsR0FBcUIs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UUFBUSxLQUFyQjtBQUNBLGVBQU8sV0FBUCxDQUFtQixPQUFuQjs7QUFFQSxzQkFBYyxLQUFkLElBQXVCLE9BQXZCO0FBQ0EsZ0JBQVEsSUFBUixDQUFhLGNBQWMsS0FBZCxDQUFiO0FBQ0g7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDTSxTQUFTLFFBQVQsQ0FBa0IsS0FBbEIsRUFBd0I7QUFDM0IsUUFBRyxnQkFBZ0IsU0FBbkIsRUFBNkI7QUFDekIsb0JBQVksS0FBWixDQUFrQixPQUFsQixHQUE0QixNQUE1QjtBQUNIO0FBQ0Qsa0JBQWMsS0FBZCxFQUFxQixLQUFyQixDQUEyQixPQUEzQixHQUFxQyxPQUFyQztBQUNBLGtCQUFjLGNBQWMsS0FBZCxDQUFkO0FBQ0giLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vL2ltcG9ydCAqIGFzIG1vZGVsIGZyb20gXCIuL21vZGVsL21vZGVsXCI7XG4vL2ltcG9ydCAqIGFzIHZpZXcgZnJvbSBcIi4vdmlldy92aWV3XCI7XG4vL2ltcG9ydCAqIGFzIGNvbnRyb2xsZXIgZnJvbSBcIi4vY29udHJvbGxlci9jb250cm9sbGVyXCI7XG4vL2ltcG9ydCAqIGFzIGxvYWRlciBmcm9tIFwiLi91dGlscy9hc3NldExvYWRlclwiO1xuaW1wb3J0ICogYXMgdWkgZnJvbSBcIi4vdWkvdWlcIjtcblxuLy9sb2FkZXIubG9hZGVyKHZpZXcubWVzaGVzLGxvYWRTdGFydCk7XG5cbmZ1bmN0aW9uIGxvYWRTdGFydCgpe1xuICAgIHVpLm5hdmlnYXRlKFwic3RhcnRcIik7XG59XG5sb2FkU3RhcnQoKTtcblxuZnVuY3Rpb24gbWFpbigpIHtcblx0dmFyIG15R2FtZSA9IG5ldyBtb2RlbC5HYW1lKCk7XG5cdG15R2FtZS5nZW5Cb2FyZCg0LCA3KTtcblx0dmFyIGdhbWVTdGF0ZSA9IG5ldyBtb2RlbC5HYW1lU3RhdGUobXlHYW1lKTtcblx0bXlHYW1lLnB1c2hHYW1lU3RhdGUoZ2FtZVN0YXRlKTtcblx0dmFyIHBsYXllcjAgPSBuZXcgbW9kZWwuUGxheWVyU3RhdGUoZ2FtZVN0YXRlKTtcblx0cGxheWVyMC5jb2xvciA9ICdvcmFuZ2UnO1xuXHRnYW1lU3RhdGUucHVzaFBsYXllclN0YXRlKHBsYXllcjApO1xuXHR2YXIgcGxheWVyMSA9IG5ldyBtb2RlbC5QbGF5ZXJTdGF0ZShnYW1lU3RhdGUpO1xuXHRwbGF5ZXIxLmNvbG9yID0gJ2JsdWUnO1xuXHRnYW1lU3RhdGUucHVzaFBsYXllclN0YXRlKHBsYXllcjEpO1xuXHRwcmVzZXRTdGFydChteUdhbWUpO1xuXHRjb250cm9sbGVyLnN0YXJ0R2FtZShteUdhbWUpO1xufVxuXG5mdW5jdGlvbiBpbml0aWFsVHVybnMoZ2FtZSkge1xuICAgIGlmIChnYW1lLnR1cm5Db3VudCA9PSB1bmRlZmluZWQpIGdhbWUudHVybkNvdW50ID0gMDtcbiAgICBpZiAoZ2FtZS5nbG9iYWxwSG91c2VzID09IHVuZGVmaW5lZCkgZ2FtZS5nbG9iYWxwSG91c2VzID0gZ2FtZS5WZXJ0aWNlcztcbiAgICB2YXIgc3RhdGUgPSBnYW1lLnBlZWtHYW1lU3RhdGUoKTtcbiAgICB2YXIgcGxheWVyID0gc3RhdGUuUGxheWVyU3RhdGVzW2dhbWUudHVybkNvdW50ICUgc3RhdGUuUGxheWVyU3RhdGVzLmxlbmd0aF07XG4gICAgdmFyIHVwZGF0ZXBIb3VzZXMgPSAoaG91c2VUdXBsZSkgPT4ge1xuICAgICAgICBNb2RlbC5zb3J0KGhvdXNlVHVwbGUpO1xuICAgICAgICB2YXIgW3EsIHIsIHNdID0gaG91c2VUdXBsZTtcbiAgICAgICAgdmFyIGludGVyc2VjdHMgPSBbXTtcbiAgICAgICAgaW50ZXJzZWN0cy5wdXNoKHtcbiAgICAgICAgICAgIHg6IHEsXG4gICAgICAgICAgICB5OiByLFxuICAgICAgICAgICAgejogTW9kZWwuaW50ZXJzZWN0X3NhZmUodGhpcy5IZXhlc1txXS5hZGosIHRoaXMuSGV4ZXNbcl0uYWRqKVxuICAgICAgICB9KTtcbiAgICAgICAgaW50ZXJzZWN0cy5wdXNoKHtcbiAgICAgICAgICAgIHg6IHEsXG4gICAgICAgICAgICB5OiBzLFxuICAgICAgICAgICAgejogTW9kZWwuaW50ZXJzZWN0X3NhZmUodGhpcy5IZXhlc1txXS5hZGosIHRoaXMuSGV4ZXNbc10uYWRqKVxuICAgICAgICB9KTtcbiAgICAgICAgaW50ZXJzZWN0cy5wdXNoKHtcbiAgICAgICAgICAgIHg6IHIsXG4gICAgICAgICAgICB5OiBzLFxuICAgICAgICAgICAgejogTW9kZWwuaW50ZXJzZWN0X3NhZmUodGhpcy5IZXhlc1tyXS5hZGosIHRoaXMuSGV4ZXNbc10uYWRqKVxuICAgICAgICB9KTtcbiAgICAgICAgaW50ZXJzZWN0cy5mb3JFYWNoKChpKSA9PiB7XG4gICAgICAgICAgICB2YXIgW3gsIHksIHpdID0gc29ydChbaS54LCBpLnksIGkuei5wb3AoKV0pO1xuICAgICAgICAgICAgTW9kZWwucmVtb3ZlVHJpcGxlKGdhbWUuZ2xvYmFscEhvdXNlcywgeCwgeSwgeik7XG4gICAgICAgICAgICBbeCwgeSwgel0gPSBzb3J0KFtpLngsIGkueSwgaS56LnBvcCgpXSk7XG4gICAgICAgICAgICBNb2RlbC5yZW1vdmVUcmlwbGUoZ2FtZS5nbG9iYWxwSG91c2VzLCB4LCB5LCB6KTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBwcmVzZXRTdGFydChnYW1lKSB7XG5cdHZhciBwbGF5ZXIwID0gZ2FtZS5wZWVrR2FtZVN0YXRlKCkuUGxheWVyU3RhdGVzWzBdO1xuXHR2YXIgcGxheWVyMSA9IGdhbWUucGVla0dhbWVTdGF0ZSgpLlBsYXllclN0YXRlc1sxXTtcblx0Zm9yY2VCdXlTZXR0bGVtZW50KGdhbWUsIHBsYXllcjAsIDUsIDEwLCAxMSk7XG5cdGZvcmNlQnV5U2V0dGxlbWVudChnYW1lLCBwbGF5ZXIwLCAyNSwgMjYsIDMxKTtcblx0Zm9yY2VCdXlSb2FkKGdhbWUsIHBsYXllcjAsIDI1LCAyNik7XG5cdGZvcmNlQnV5Um9hZChnYW1lLCBwbGF5ZXIwLCAxMCwxMSk7XG5cdGZvcmNlQnV5U2V0dGxlbWVudChnYW1lLCBwbGF5ZXIxLCA3LCAxMiwgMTMpO1xuXHRmb3JjZUJ1eVNldHRsZW1lbnQoZ2FtZSwgcGxheWVyMSwgMjMsIDI0LCAyOSk7XG5cdGZvcmNlQnV5Um9hZChnYW1lLCBwbGF5ZXIxLCAxMiwgMTMpO1xuXHRmb3JjZUJ1eVJvYWQoZ2FtZSwgcGxheWVyMSwgMjMsIDI0KTtcbn1cblxuZnVuY3Rpb24gZm9yY2VCdXlTZXR0bGVtZW50IChnYW1lLHBsYXllciwgeCwgeSwgeikge1xuXHR2YXIgcFNldHRsZW1lbnRzID0gcGxheWVyLnBTZXR0bGVtZW50cztcblx0aWYgKHBTZXR0bGVtZW50c1t4XSA9PSB1bmRlZmluZWQpIHBTZXR0bGVtZW50c1t4XSA9IFtdO1xuXHRpZiAocFNldHRsZW1lbnRzW3hdW3ldID09IHVuZGVmaW5lZCkgcFNldHRsZW1lbnRzW3hdW3ldID0gW107XG5cdGlmIChwU2V0dGxlbWVudHNbeF1beV1bel0gPT0gdW5kZWZpbmVkKSBwU2V0dGxlbWVudHNbeF1beV1bel0gPSB7fTtcblx0cGxheWVyLmJ1eVNldHRsZW1lbnQoW3gseSx6XSk7XG59XG5cbmZ1bmN0aW9uIGZvcmNlQnV5Um9hZCAoZ2FtZSxwbGF5ZXIsIHgsIHkpIHtcblx0dmFyIHBSb2FkcyA9IHBsYXllci5wUm9hZHM7XG5cdGlmIChwUm9hZHNbeF0gPT0gdW5kZWZpbmVkKSBwUm9hZHNbeF0gPSBbXTtcblx0aWYgKHBSb2Fkc1t4XVt5XSA9PSB1bmRlZmluZWQpIHBSb2Fkc1t4XVt5XSA9IHt9O1xuXHRwbGF5ZXIuYnV5Um9hZChbeCx5XSk7XG59XG4iLCJleHBvcnQgY2xhc3MgQmFzZVVJe1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIGlmIChuZXcudGFyZ2V0ID09PSBCYXNlVUkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY29uc3RydWN0IEFic3RyYWN0IGluc3RhbmNlcyBkaXJlY3RseVwiKTtcbiAgICAgICAgfVxuICAgIH0gICBcblxuICAgIGluaXQoKXtcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xuICAgICAgICB0aHJvdyBuZXcgKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2U9IFwiY2hpbGRyZW4gbXVzdCBvdmVycmlkZSBpbml0XCI7XG4gICAgICAgICAgICB0aGlzLmNsYXNzPXRoYXQuY29uc3RydWN0b3IubmFtZTtcbiAgICAgICAgfSkoKTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7QmFzZVVJfSBmcm9tIFwiLi9CYXNlVUlcIjtcblxuZXhwb3J0IGNsYXNzIE9wdGlvbnNVSSBleHRlbmRzIEJhc2VVSXtcbiAgICBpbml0KHVpUm9vdCwgY29udGV4dCl7XG4gICAgXG4gICAgfVxufVxuIiwiaW1wb3J0IHtCYXNlVUl9IGZyb20gXCIuL0Jhc2VVSVwiO1xuXG5leHBvcnQgY2xhc3MgU3RhcnRVSSBleHRlbmRzIEJhc2VVSXtcblxuICAgIGluaXQodWlSb290KXtcbiAgICAgICBcbiAgICAgICAgdWlSb290LmlubmVySFRNTCA9IGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2xcIiBzdHlsZT1cImhlaWdodDo1MCVcIj48L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzcz1cImNvbCBvZmZzZXQtczMgczYgYnRuIHdhdmVzLWVmZmVjdCB3YXZlcy1saWdodFwiPlN0YXJ0IE5ldyBHYW1lPC9wPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwiY29sIG9mZnNldC1zMyBzNiBidG4gd2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0XCI+TG9hZCBTY2VuYXJpbzwvcD5cbiAgICAgICAgICAgICAgICA8cCBjbGFzcz1cImNvbCBvZmZzZXQtczMgczYgYnRuIHdhdmVzLWVmZmVjdCB3YXZlcy1saWdodFwiPlNjZW5hcmlvIEVkaXRvcjwvcD5cbiAgICAgICAgICAgICAgICA8cCBjbGFzcz1cImNvbCBvZmZzZXQtczMgczYgYnRuIHdhdmVzLWVmZmVjdCB3YXZlcy1saWdodFwiPk9wdGlvbnM8L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIGA7XG4gICAgICAgIFxuICAgfSBcbn1cbiIsImltcG9ydCB7U3RhcnRVSX0gZnJvbSBcIi4vU3RhcnRVSVwiO1xuaW1wb3J0IHtPcHRpb25zVUl9IGZyb20gXCIuL09wdGlvbnNVSVwiO1xuXG5sZXQgdWlSb290ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG51aVJvb3Quc3R5bGUuaGVpZ2h0ID0gJzEwMHZoJztcbnVpUm9vdC5zdHlsZS53aWR0aCA9ICcxMDB2dyc7XG51aVJvb3Quc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuLy91aVJvb3Quc3R5bGUudG9wID0gJy04cHgnO1xuLy91aVJvb3Quc3R5bGUubGVmdCA9ICctOHB4JztcblxuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh1aVJvb3QpO1xuXG5sZXQgY3VycmVudFZpZXc7XG5cbmxldCByb3V0ZUVsZW1lbnRzID0ge307XG5cbmxldCByb3V0ZU1hcCA9IHtcbiAgICAnc3RhcnQnOiBuZXcgU3RhcnRVSSgpLFxuICAgICdvcHRpb25zJzogbmV3IE9wdGlvbnNVSSgpXG59XG5cbmZvcihsZXQgW3JvdXRlLCB1aUNsYXNzXSBvZiBPYmplY3QuZW50cmllcyhyb3V0ZU1hcCkpe1xuICAgIGxldCBuZXdOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbmV3Tm9kZS5zdHlsZS5oZWlnaHQgPSAnMTAwJSc7XG4gICAgbmV3Tm9kZS5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgICBuZXdOb2RlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgbmV3Tm9kZS5pZCA9IHJvdXRlICsgJy11aSc7XG4gICAgdWlSb290LmFwcGVuZENoaWxkKG5ld05vZGUpO1xuXG4gICAgcm91dGVFbGVtZW50c1tyb3V0ZV0gPSBuZXdOb2RlO1xuICAgIHVpQ2xhc3MuaW5pdChyb3V0ZUVsZW1lbnRzW3JvdXRlXSk7XG59XG5leHBvcnQgZnVuY3Rpb24gbmF2aWdhdGUocm91dGUpe1xuICAgIGlmKGN1cnJlbnRWaWV3ICE9PSB1bmRlZmluZWQpe1xuICAgICAgICBjdXJyZW50Vmlldy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH1cbiAgICByb3V0ZUVsZW1lbnRzW3JvdXRlXS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICBjdXJyZW50VmlldyA9IHJvdXRlRWxlbWVudHNbcm91dGVdO1xufVxuIl19
