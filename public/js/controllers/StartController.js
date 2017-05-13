import * as ui from "../ui/ui";
import {Controller} from './Controller';

export class StartController extends Controller{

    constructor(){
        super();
        this.swapToOptionsView = () => {
            ui.navigate('options');
        };

        this.navigateNewGame = () => {
            ui.navigate('new');
        };
    }
}
