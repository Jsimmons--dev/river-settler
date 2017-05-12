import {BaseUI} from "./BaseUI";

export class StartUI extends BaseUI{
    
    constructor(controller){
        super();
        this.controller = controller;
        this.model = controller.model;
    }

    init(uiRoot){
       
        let optionsEle = document.createElement('a');
        optionsEle.className = "col offset-s3 s6 btn waves-effect waves-light";
        optionsEle.appendChild(document.createTextNode("Options"));
        optionsEle.addEventListener('click',this.controller.scope.swapToOptionsView);
        
        uiRoot.innerHTML = `
            <div class="col" style="height:50%"></div>
            <div id='startButtons' class="row">
                <p class="col offset-s3 s6 btn waves-effect waves-light">Start New Game</p>
                <p class="col offset-s3 s6 btn waves-effect waves-light">Load Scenario</p>
                <p class="col offset-s3 s6 btn waves-effect waves-light">Scenario Editor</p>
            </div>
            `;

        

        uiRoot.querySelector('#startButtons').appendChild(optionsEle);
        
   } 
}
