import {StartUI} from "./StartUI";
import {OptionsUI} from "./OptionsUI";

let uiRoot = document.createElement('div');
uiRoot.style.height = '100vh';
uiRoot.style.width = '100vw';
uiRoot.style.position = 'absolute';
//uiRoot.style.top = '-8px';
//uiRoot.style.left = '-8px';

document.body.appendChild(uiRoot);

let currentView;

let routeElements = {};

let routeMap = {
    'start': new StartUI(),
    'options': new OptionsUI()
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
export function navigate(route){
    if(currentView !== undefined){
        currentView.style.display = 'none';
    }
    routeElements[route].style.display = 'block';
    currentView = routeElements[route];
}
