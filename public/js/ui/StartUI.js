import {BaseUI} from './BaseUI';

export class StartUI extends BaseUI{
    
    constructor(controller, uiRoot){
        super();
        console.log(controller)
        this.controller = controller;
       
        let optionsEle = document.createElement('a');
        optionsEle.className = "col offset-s3 s6 btn waves-effect waves-light";
        optionsEle.appendChild(document.createTextNode("Options"));
        optionsEle.addEventListener('click',this.controller.fadeToOptions);
        uiRoot.style.background = '#88ddff'; 
        uiRoot.innerHTML = `
            <div id='startCanvas' style='height:0%;'></div>
            <div class="col" style="height:50%"></div>
            <div id='startButtons' class="row">
                <a id='startGameButton' class="col offset-s3 s6 btn waves-effect waves-light">Start New Game</a>
                <a class="col offset-s3 s6 btn waves-effect waves-light">Load Scenario</a>
                <a class="col offset-s3 s6 btn waves-effect waves-light">Scenario Editor</a>
            </div>
            `;

        this.controller.canvasNode = uiRoot.querySelector('#startCanvas');
        document.querySelector('#startGameButton').addEventListener('click', this.controller.navigateNewGame);
        

        uiRoot.querySelector('#startButtons').appendChild(optionsEle);
    }
}
