import {Watcher} from './Watcher';

export class ElementWatcher extends Watcher{

    constructor(element, initialValue){
        super(initialValue);
        this.element = element;
    }

    changed(newValue){
        if(this.element){
            this.element.textContent = newValue;
        }
        this.value = newValue;
    }

    then(){
        return this;
    }
}
