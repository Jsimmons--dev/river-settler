export class BaseUI{

    constructor() {
        if (new.target === BaseUI) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
    }   

    init(){
        let that = this;
        throw new (function(){
            this.message= "children must override init";
            this.class=that.constructor.name;
        })();
    }
    
    setController(controller){
        this.controller = controller;
    }
}
