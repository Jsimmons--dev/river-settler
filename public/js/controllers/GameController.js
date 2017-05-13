import * as canvas from '../view/canvas';
import * as ui from "../ui/ui";

export class GameController{

    constructor(model){
        this.model = model;
        this.scope = {}; 

        this.scope.toggleToolbar = (toolbarId) => {
           document.querySelector('#' + toolbarId).classList.toggle('hide');
        };
    }

    onLanding(){
        canvas.init();    
        canvas.animate();    
    }
}
