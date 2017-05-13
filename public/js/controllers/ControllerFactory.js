import {StartController} from './StartController';
import {OptionsController} from './OptionsController';
import {NewGameController} from './NewGameController';
import {GameController} from './GameController';

let instance = null;
export class ControllerFactory{

    constructor(){
        if(!instance){
            instance = this; 

            instance.controllerMap = {
                'start': new StartController(),
                'options': new OptionsController(),
                'new': new NewGameController(),
                'game': new GameController()
            };
        }


        return instance;
    }

    get(route){
        return this.controllerMap[route];
    }
}
