import {UiFactory} from './UiFactory';
import {LifecycleManager} from '../lifecycle/LifecycleManager';
import {routes} from '../view/routes';

export class UI {

    constructor(){
        //root DOM node of all of the UIs
        this.uiRoot = document.createElement('div');
        this.uiRoot.style.height = '100vh';
        this.uiRoot.style.width = '100vw';
        this.uiRoot.style.position = 'absolute';
        document.body.appendChild(this.uiRoot);

        this.currentView;

        this.currentRoute;

        this.viewHistory = [];

        this.routeRoots = {};

        //grab the ui factory 
        this.uiFactory = new UiFactory();

        this.controllerFactory = this.uiFactory.controllerFactory;

        //grab the lifecycle manager
        this.lifecycleManager = new LifecycleManager(this.controllerFactory); 

        //setup all of the DOM elements that form the base of each UI
        for(let route of routes){
            let newNode = document.createElement('div');
            newNode.style.height = '100%';
            newNode.style.width = '100%';
            newNode.style.display = 'none';
            newNode.id = route + '-ui';
            this.uiRoot.appendChild(newNode);

            //instantiate the UI now that we have the arguments needed
            this.uiFactory.create(route, newNode)

            //save the root DOM node of this UI to the routeRoots map
            this.routeRoots[route] = newNode;
        }
    }

    changeUI(route){
        if(this.currentView !== undefined){
            //hide the current view
            this.currentView.style.display = 'none';
            //tell the lifecycleManager to handle the leaving
            //of the current view
            this.lifecycleManager.leave(this.currentRoute);
        }
        //show the new ui
        this.routeRoots[route].style.display = 'block';
        this.currentView = this.routeRoots[route];
        this.currentRoute = route;

        //have the lifecycle manager handle visiting the new ui
        this.lifecycleManager.visit(route);
    }

    navigate(route){
        if(this.currentRoute !== undefined){
            //save what ui we are at to the history
            this.viewHistory.push(this.currentRoute);
        }
        this.changeUI(route);
    }

    navigateBack(){
        let route = this.viewHistory.pop();
        //go to the ui right before we navigated to the current ui
        this.changeUI(route);
    }
}
