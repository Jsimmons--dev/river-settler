import {BaseUI} from "./BaseUI";

export class NewGameUI extends BaseUI{
    
    constructor(controller, uiRoot){
        super();
        this.controller = controller;

        uiRoot.classList.toggle('row');

        uiRoot.innerHTML = `
            <a id='generateGameButton' class='col offset-s3 s6 btn waves-effect waves-light'>Generate Game</a>
            `;

        document.querySelector('#generateGameButton')
            .addEventListener('click', this.controller.scope.generateGame);
       
        let backEle = document.createElement('a');
        backEle.className = "col offset-s3 s6 btn waves-effect waves-light";
        backEle.appendChild(document.createTextNode("Back"));
        backEle.addEventListener('click',this.controller.scope.navigateBack);


        uiRoot.appendChild(backEle);

        let optionsEle = document.createElement('a');
        optionsEle.className = "col offset-s3 s6 btn waves-effect waves-light";
        optionsEle.appendChild(document.createTextNode("Options"));
        optionsEle.addEventListener('click',this.controller.scope.navigateOptions);


        uiRoot.appendChild(optionsEle);
    }
}
