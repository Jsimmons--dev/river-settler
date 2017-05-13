import * as ui from "../ui/ui";
import {Controller} from './Controller';

export class OptionsController extends Controller{

    constructor(model){
        super();
        this.model = model;
        this.scope = {}; 

        this.scope.swapBack = () => {
            ui.navigateBack();
        };
    }
}
