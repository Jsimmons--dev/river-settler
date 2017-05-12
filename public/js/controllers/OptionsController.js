import * as ui from "../ui/ui";

export class OptionsController{

    constructor(model){
        this.model = model;
        this.scope = {}; 

        this.scope.swapBack = () => {
            ui.navigateBack();
        };
    }
}
