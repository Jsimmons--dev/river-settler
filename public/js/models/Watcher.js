export class Watcher{

    constructor(initialValue){
        this.value = initialValue;
    }

    changed(newValue){
        if(this.action){
            this.action(newValue);
        }
    }

    run(){
        this.changed(this.value); 
        return this;
    }

    then(action){
        this.action = action;
        return this;
    }
}
