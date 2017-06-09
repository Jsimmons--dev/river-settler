import actionsList from './actionsList';
export class Ruleset {

    constructor(playerCount){
        this.playerCount = playerCount;

        this.currentPhase = ['start'];

        this.actions = ['give-resource', 'move-robber','convert', 'trade-initiate', 'trade-counter', 'trade-accept', 'buy-road', 'buy-city', 'buy-settlement', 'buy-card-development', 'play-card-development', 'place-road', 'place-settlement', 'place-city', 'discard-cards'];

        this.phases = ['start', 'round-one', 'round-two', 'roll', 'seven', 'harvest', 'act', 'end'];
    }

    setCurrentPlayer(player){
        this.currentPlayer = player;
    }

    validatePlayerNumber(player){
        return player <= playerCount; 
    }

    changePhase(newPhase){
        this.currentPhase = newPhase;
    }

    canBuyRoad(player){
        if(validatePlayerNumber(player.id)){return false} 
        if(!isCurrentPlayerTurn(player)){return false}
        if(!player.checkForRoadResources()){return false}
        if(!world.isValidRoadSpace(player)){return false}
        return true;
    }
}
