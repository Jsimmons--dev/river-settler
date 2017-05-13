import {UiFactory} from './UiFactory';
import {LifecycleManager} from '../lifecycle/LifecycleManager';
import {routes} from '../view/routes';

export let uiModel = {
    name: 'Josh'
};

export let uiRoot = document.createElement('div');
uiRoot.style.height = '100vh';
uiRoot.style.width = '100vw';
uiRoot.style.position = 'absolute';
document.body.appendChild(uiRoot);

export let currentView;

export let currentRoute;

let viewHistory = [];

let routeRoots = {};


let uiFactory = new UiFactory();

for(let route of routes){
    let newNode = document.createElement('div');
    newNode.style.height = '100%';
    newNode.style.width = '100%';
    newNode.style.display = 'none';
    newNode.id = route + '-ui';
    uiRoot.appendChild(newNode);

    uiFactory.create(route, newNode)

    routeRoots[route] = newNode;
}

let lifecycleManager = new LifecycleManager();
export function changeUI(route){
    if(currentView !== undefined){
        currentView.style.display = 'none';
        lifecycleManager.leave(currentRoute);
    }
    routeRoots[route].style.display = 'block';
    currentView = routeRoots[route];
    currentRoute = route;

    lifecycleManager.visit(route);
}

export function navigate(route){
    if(currentRoute !== undefined){
        viewHistory.push(currentRoute);
    }
    changeUI(route);
}

export function navigateBack(){
    let route = viewHistory.pop();
    changeUI(route);
}
