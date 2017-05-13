import * as ui from "../ui/ui";

export class StartController{

    constructor(){
        this.swapToOptionsView = () => {
            ui.navigate('options');
        };

        this.navigateNewGame = () => {
            ui.navigate('new');
        };
    }
}
