import { EventStream } from '../events/EventStream';
export class GameController(){

    constructor(game, ruleset){
        this.ruleset = ruleset;
        this.game = game;
    }

    startGame(){
        this.game.currentState = 'round-one';
        this.game.rollForFirstPlayer().then((winningPlayer)=>{
            this.game.currentPlayer = winningPlayer;
        });
    }

    handleAction(player, action){
        if(this.ruleset.validateAction(player, action)){
            let actionResult = this.game.performAction(player, action);
            if(actionResult.newState){
                this.game.currentState = actionResult.newState;
            }
            if(actionResult.nextPlayer){
                this.game.currentPlayer = actionResult.nextPlayer;
            }
            if(actionResult.playerWon){
                endGame(this.game.currentPlayer);
            }
        }
    }
    endGame(winningPlayer){
        this.game.winningPlayer = winningPlayer;     
    }
}
