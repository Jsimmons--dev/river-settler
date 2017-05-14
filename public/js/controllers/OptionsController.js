import * as ui from "../ui/ui";
import {Controller} from './Controller';
import {context} from '../models/gameContext';

export class OptionsController extends Controller{

    constructor(model){
        super();
        this.model = model;

        this.swapBack = () => {
            ui.navigateBack();
        };
    }
}
