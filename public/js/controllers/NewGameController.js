import * as ui from '../ui/ui';
import {context} from '../models/gameContext';
import * as gameGenerator from '../game/gameGenerator';
import {Controller} from './Controller';

export class NewGameController extends Controller{

    constructor(model){
        super();
        this.model = model;

        this.navigateBack = () => {
            ui.navigateBack();
        };

        this.navigateOptions = () => {
            ui.navigate('options');
        };

        this.generateGame = () => {
            ui.navigate('game');
            context.loadGame(gameGenerator.generateGame());
        }
    }
}
