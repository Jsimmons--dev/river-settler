import {StartUI} from './StartUI';
import {OptionsUI} from './OptionsUI';
import {NewGameUI} from './NewGameUI';
import {GameUI} from './GameUI';
import {ControllerFactory} from '../controllers/ControllerFactory';

export class UiFactory{

    constructor(){
        this.uiMap = {
            'start': StartUI,
            'options': OptionsUI,
            'new': NewGameUI,
            'game': GameUI
        }

        this.controllerFactory = new ControllerFactory();
    }

    //replace the UI className with an instance of the UI
    create(uiName, root){
        return this.uiMap[uiName] = new this.uiMap[uiName](this.controllerFactory.get(uiName), root);
    }

}
