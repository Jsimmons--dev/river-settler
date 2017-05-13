import {ControllerFactory} from '../controllers/ControllerFactory';
import {routes} from '../view/routes';
let instance = null;
export class LifecycleManager{
    constructor(){
        if(!instance){
        instance = this;

        instance.controllerFactory = new ControllerFactory();
        
        instance.routeStates = {};

        routes.forEach((route)=>{
            instance.routeStates[route] = {
                landed: false,
                visitCount: 0
            }; 
        });
        }
        return instance;
    }

    visit(route){
        let controller = this.controllerFactory.get(route);
        let routeState = this.routeStates[route];
        if(!routeState.landed){
            controller.OnLanding();
            routeState.landed = true;
        }
        controller.OnVisit();
        routeState.visited++;
    }

    leave(route){
        let controller = this.controllerFactory.get(route);
        controller.OnLeave(); 
    }
}
