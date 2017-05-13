export class BaseUI{

    constructor() {
        if (new.target === BaseUI) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
    }   
}
