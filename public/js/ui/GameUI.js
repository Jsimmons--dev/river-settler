import {BaseUI} from "./BaseUI";
import {context} from '../models/gameContext';

export class GameUI extends BaseUI{
    
    constructor(controller, uiRoot){
        super();
        this.controller = controller;

        uiRoot.classList.toggle('row');

        uiRoot.innerHTML = `
            <div style='height:0%;' id='canvasNode'></div>
           <a id='currentPlayerNumber' class='col offset-s3 s6 deep-purple darken-2 btn waves-effect waves-light'></a>`;

        let currentPlayerWatcher = context.currentPlayer.watch(document.querySelector('#currentPlayerNumber')).run();

        this.controller.canvasNode = uiRoot.querySelector('#canvasNode');

        let backEle = document.createElement('a');
        backEle.className = "col offset-s3 s6 btn waves-effect waves-light";
        backEle.appendChild(document.createTextNode("Back"));
        backEle.addEventListener('click',this.controller.swapBack);
        uiRoot.appendChild(backEle);
    }
}
