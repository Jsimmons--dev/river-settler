"use strict";
import { UI } from "./ui/ui";

let game = new Game({
    playerCount: 3
});
let gameController = new GameHandler();
let ui = new UI();

ui.navigate('start');

gameController.startGame();

