export class Singletonizer{
    constructor(){
        this.classes = new Map(); 
    }

    get(classObject, args){
        if(this.classes.get(classObject) === undefined){
            this.classes.set(classObject, new classObject(args));
        }
        return this.classes.get(classObj);
    }
}
