"use strict";
import * as model from "./model";
import * as view from "./view";
import * as controller from "./controller";



var board = model.createSimpleBoard([0, 0]);

view.loader.load('assets/hex.json', function (geometry, materials) {
    view.texLoader.load('assets/hexTextureGrey.jpg', function (texture) {
        view.renderBoard(board, geometry, texture);
    })
});


view.render();
