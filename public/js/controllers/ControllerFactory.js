import {StartController} from './StartController';
import {OptionsController} from './OptionsController';
import {NewGameController} from './NewGameController';
import {GameController} from './GameController';

export class ControllerFactory{

    constructor(){
            this.controllerMap = {
                'start': new StartController(),
                'options': new OptionsController(),
                'new': new NewGameController(),
                'game': new GameController()
            };
    }

    get(route){
        return this.controllerMap[route];
    }
}
