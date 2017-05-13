export class Controller{

    constructor() {
        if (new.target === Controller) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
    }   

    OnLanding(){}
    OnVisit(){}
    OnLeave(){}
}
