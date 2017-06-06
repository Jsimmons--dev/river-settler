import {ControllerFactory} from '../controllers/ControllerFactory';
import {routes} from '../view/routes';

export class LifecycleManager{
    constructor(controllerFactory){
        this.controllerFactory = controllerFactory;
        
        this.routeStates = {};

        routes.forEach((route)=>{
            this.routeStates[route] = {
                landed: false,
                visitCount: 0
            }; 
        });
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
