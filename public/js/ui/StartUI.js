import {BaseUI} from "./BaseUI";

export class StartUI extends BaseUI{

    init(uiRoot){
       
        uiRoot.innerHTML = `
            <div class="col" style="height:50%"></div>
            <div class="row">
                <p class="col offset-s3 s6 btn waves-effect waves-light">Start New Game</p>
                <p class="col offset-s3 s6 btn waves-effect waves-light">Load Scenario</p>
                <p class="col offset-s3 s6 btn waves-effect waves-light">Scenario Editor</p>
                <p class="col offset-s3 s6 btn waves-effect waves-light">Options</p>
            </div>
            `;
        
   } 
}
