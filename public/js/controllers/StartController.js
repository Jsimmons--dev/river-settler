import * as ui from "../ui/ui";
import * as canvas from '../view/canvas';
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

    OnLanding(){
        this.canvas = canvas.init(this.canvasNode);
    }

    OnVisit(){
        this.canvas.animate();
    }
}
