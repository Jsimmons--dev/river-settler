import * as model from "./Model";
import * as view from "./view";

export function startGame(game) {
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

function rolled(player, dice,game) {
    console.log("distributing resources");
    resourceDistribution(player,dice, game);
}

function rolledSeven(player, dice,game) {
    console.log('moving robber');
    robberMove(player, game);
}

function runGameOver() {

}

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
	console.log('player ',player);
    view.nextPlayer(player, game);
    return player;
}

function rollDice(player, game) {
    var dice = view.askForDiceRoll(player, game, rolled, rolledSeven);
    return dice;
}

function robberMove(player, game) {
    var robberMoved = model.robberMove(player, game,Math.floor(Math.random()*36)); //pair of where he was and is	e.g. [0,3]
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
