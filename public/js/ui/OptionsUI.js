import {BaseUI} from "./BaseUI";

export class OptionsUI extends BaseUI{
    
    constructor(controller, uiRoot){
        super();
        this.controller = controller;

        let backEle = document.createElement('a');
        backEle.className = "col offset-s3 s6 btn waves-effect waves-light";
        backEle.appendChild(document.createTextNode("back"));
        backEle.addEventListener('click',this.controller.swapBack);
        
        uiRoot.innerHTML = `
            <div class="col" style="height:50%"></div>
            <div id='optionButtons' class="row">
            </div>
            `;

        

        uiRoot.querySelector('#optionButtons').appendChild(backEle);
    }
}
