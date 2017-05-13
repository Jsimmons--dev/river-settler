import {BaseUI} from "./BaseUI";

export class GameUI extends BaseUI{
    
    constructor(controller, uiRoot){
        super();
        this.controller = controller;

        uiRoot.innerHTML = `<div style='height:50%;' id='canvasNode'></div>`;

        this.controller.canvasNode = uiRoot.querySelector('#canvasNode');
        console.log(controller);

        let backEle = document.createElement('a');
        backEle.className = "col offset-s3 s6 btn waves-effect waves-light";
        backEle.appendChild(document.createTextNode("Back"));
        backEle.addEventListener('click',this.controller.swapBack);
        uiRoot.appendChild(backEle);
    }
}
