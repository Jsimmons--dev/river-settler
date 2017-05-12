import * as ui from "../ui/ui";

export class StartController{

    constructor(model){
        this.model = model;
        this.scope = {}; 

        this.scope.swapToOptionsView = () => {
            ui.navigate('options');
        };
    }
}
