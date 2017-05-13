import * as ui from '../ui/ui';
import {context} from '../models/gameContext';
import * as gameGenerator from '../game/gameGenerator';

export class NewGameController{

    constructor(model){
        this.model = model;
        this.scope = {}; 

        this.scope.navigateBack = () => {
            ui.navigateBack();
        };

        this.scope.navigateOptions = () => {
            ui.navigate('options');
        };

        this.scope.generateGame = () => {
            ui.navigate('game');
            context.game = gameGenerator.generateGame();
        }
    }
}
