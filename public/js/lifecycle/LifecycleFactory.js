import { LifecycleManager } from './LifecycleManager';

let instance = null;

export class LifecycleFactory {
    constructor(controllerFactory){
        if(!instance){

            this.lifecycleManager = new LifecycleManager(controllerFactory);

            instance = this; 
        } 


        return instance
    }

    getManager(){
        return this.lifecycleManager;
    }
}
