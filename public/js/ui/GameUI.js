import {BaseUI} from "./BaseUI";

export class GameUI extends BaseUI{
    
    constructor(controller, uiRoot){
        super();
        this.controller = controller;

        uiRoot.innerHTML = `
            <div id='gameCanvas' class="col" style="height:80%; margin-top:20%"></div>
            `;
    }
}
