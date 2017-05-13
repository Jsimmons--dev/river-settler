import {StartUI} from './StartUI';
import {OptionsUI} from './OptionsUI';
import {NewGameUI} from './NewGameUI';
import {GameUI} from './GameUI';
import {ControllerFactory} from '../controllers/ControllerFactory';

let instance = null;

export class UiFactory{

    constructor(){
        if(!instance){
            instance = this;
        } 

        instance.uiMap = {
            'start': StartUI,
            'options': OptionsUI,
            'new': NewGameUI,
            'game': GameUI
        }

        instance.controllerFactory = new ControllerFactory();

        return instance;
    }

    create(uiName, root){
        return this.uiMap[uiName] = new this.uiMap[uiName](this.controllerFactory.get(uiName), root);
    }

}
