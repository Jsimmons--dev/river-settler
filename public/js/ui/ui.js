import {StartController} from "../controllers/StartController";
import {OptionsController} from "../controllers/OptionsController";
import {StartUI} from "./StartUI";
import {OptionsUI} from "./OptionsUI";

let uiModel = {
    name: 'Josh'
};

let uiRoot = document.createElement('div');
uiRoot.style.height = '100vh';
uiRoot.style.width = '100vw';
uiRoot.style.position = 'absolute';

document.body.appendChild(uiRoot);

let currentView;
let currentRoute;

let viewStack = [];

let routeElements = {};

let routeMap = {
    'start': new StartUI(new StartController(uiModel)),
    'options': new OptionsUI(new OptionsController(uiModel))
}

for(let [route, uiClass] of Object.entries(routeMap)){
    let newNode = document.createElement('div');
    newNode.style.height = '100%';
    newNode.style.width = '100%';
    newNode.style.display = 'none';
    newNode.id = route + '-ui';
    uiRoot.appendChild(newNode);

    routeElements[route] = newNode;
    uiClass.init(routeElements[route]);
}

export function changeUI(route){
    if(currentView !== undefined){
        currentView.style.display = 'none';
    }
    routeElements[route].style.display = 'block';
    currentView = routeElements[route];
    currentRoute = route;
}

export function navigate(route){
    if(currentRoute !== undefined){
        viewStack.push(currentRoute);
    }
    changeUI(route);
}

export function navigateBack(){
    let route = viewStack.pop();
    console.log(route);
    changeUI(route);
}

export function addControllers(controllerMap){
    for(let [route, uiClass] of Object.entries(routeMap)){
        uiClass.setController(controllerMap[route]);
    }
}
