import {BaseUI} from "./BaseUI";

export class StartUI extends BaseUI{
    
    constructor(controller, uiRoot){
        super();
        console.log(controller)
        this.controller = controller;
       
        let optionsEle = document.createElement('a');
        optionsEle.className = "col offset-s3 s6 btn waves-effect waves-light";
        optionsEle.appendChild(document.createTextNode("Options"));
        optionsEle.addEventListener('click',this.controller.swapToOptionsView);
        
        uiRoot.innerHTML = `
            <div class="col" style="height:50%"></div>
            <div id='startButtons' class="row">
                <p id='startGameButton' class="col offset-s3 s6 btn waves-effect waves-light">Start New Game</p>
                <p class="col offset-s3 s6 btn waves-effect waves-light">Load Scenario</p>
                <p class="col offset-s3 s6 btn waves-effect waves-light">Scenario Editor</p>
            </div>
            `;

        document.querySelector('#startGameButton').addEventListener('click', this.controller.navigateNewGame);
        

        uiRoot.querySelector('#startButtons').appendChild(optionsEle);
    }
}
