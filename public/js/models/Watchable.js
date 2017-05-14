import {Watcher} from './Watcher';
import {ElementWatcher} from './ElementWatcher';
export class Watchable{
    constructor(value){
        this.watchers = [];
        this.value = value; 
    }

   update(newValue){
       this.value = newValue;
       this.watchers.forEach((watcher)=>{
            watcher.changed(this.value); 
       });
   } 

   watch(watchingThing){
       let watcher;

       if(watchingThing instanceof HTMLElement){
        watcher = new ElementWatcher(watchingThing, this.value); 
       }
       else {
        watcher = new Watcher(this.value);
       }

        this.watchers.push(watcher);
        return watcher;
   }
}
