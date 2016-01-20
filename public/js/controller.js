import * as model from "./Model";
import * as view from "./view";

export function startGame(game) {
	view.renderBoard(game);
	view.render(game);
    while (!gameOver(game)) {
        var player = determinePlayer(game);
        var roll = rollDice(player, game);
        if (roll === 7) {
            robberMove(player, game);
            steal(player, game);
        } else {
            resourceDistribution(roll, game);
        }
        buyPhase(player, game);
        endTurn(player, game);
    }
    runGameOver();
}

function runGameOver(){

}

function gameOver(game) {
    var over = model.gameOver();
    if (over) {
        view.gameOver(game);
        model.endGame(game);
    }
    return over;
}

function determinePlayer(game) {
    var player = model.determinePlayer(game);
    view.nextPlayer(player, game);
    return player;
}

function rollDice(player, game) {
    var dice = view.askForDiceRoll(player, game);
    return dice;
}

function robberMove(player, game) {
    var robberMoved = model.robberMove(player, game); //pair of where he was and is	e.g. [0,3]
    view.moveRobber(robberMoved, game);
}

function steal(player, game) {
    var stealee = model.steal(player, game);
    view.stoleFrom(player, stealee, game);
}

function resourceDistribution(roll, game) {
    var resources = model.distributeRes(roll, game);//array of objects showing
	//how many of each were given to that player e.g. [{},{'grain':2}] mean
	//player 1 got nothing and player 2 got two grains 
    view.renderResourceDistribution(resources, game);
}

function buyPhase(player, game) {
    view.startBuyPhase(player, game);
}

function endTurn(player, game) {
    model.endTurn(player, game);
    view.showEndOfTurn(player, game);
}
