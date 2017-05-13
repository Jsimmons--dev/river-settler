import * as canvas from '../view/canvas';
import * as ui from "../ui/ui";
import {Controller} from './Controller';

export class GameController extends Controller{

    constructor(model){
        super();
        console.log('constructing game controller');
        this.toggleToolbar = (toolbarId) => {
           document.querySelector('#' + toolbarId).classList.toggle('hide');
        };
    }

    swapBack(){
        ui.navigateBack();
    }

    OnLanding(){
        console.log('landed');
        console.log(this);
        canvas.init(this.canvasNode);    
        canvas.animate();    
    }
}
