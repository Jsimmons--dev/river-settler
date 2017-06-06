import {BaseUI} from './BaseUI';

export class StartUI extends BaseUI{
    
    constructor(controller, uiRoot){
        super();
        this.controller = controller;
       
        let optionsEle = document.createElement('a');
        optionsEle.className = "col offset-s2 s8 btn waves-effect waves-light";
        optionsEle.style.margin = '2% 1% 1% 1%';
        optionsEle.style.width = '98%';
        optionsEle.appendChild(document.createTextNode("Options"));
        optionsEle.addEventListener('click',this.controller.fadeToOptions);
        uiRoot.style.background = '#88ddff'; 
        uiRoot.innerHTML = `
            <div id='startCanvas' style='height:0%;'></div>
            <div class="col" style="height:50%"></div>
            <div id='startButtons' class="row card light-blue lighten-4" style='width:50%; margin:auto'>
                <a id='startGameButton' class="col btn waves-effect waves-light" style='width:98%;margin: 1% 1% 0 1%'>Start New Game</a>
                <a class="col offset-s2 s8 btn waves-effect waves-light" style='width:98%;margin: 2% 1% 0 1%'>Load Scenario</a>
                <a class="col offset-s2 s8 btn waves-effect waves-light" style='width:98%;margin: 2% 1% 0 1%'>Scenario Editor</a>
            </div>
            `;

        this.controller.canvasNode = uiRoot.querySelector('#startCanvas');
        document.querySelector('#startGameButton').addEventListener('click', this.controller.navigateNewGame);
        

        uiRoot.querySelector('#startButtons').appendChild(optionsEle);
    }
}
