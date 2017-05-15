import * as canvas from '../view/canvas';
import {Watchable} from './Watchable';

export let context = {};

context.currentPlayerNumber = new Watchable(1);

context.loadGame = (game) => {
    context._game = game;
    context.currentPlayerNumber = new Watchable(game.currentPlayerNumber);
}

context.update = (modelProperty, newValue) => {
    if(context[modelProperty] instanceof Watchable){
        context[modelProperty].update(newValue);
    }
    context._game[modelProperty] = newValue;
}

context.get = (modelProperty) => {
    return context._game[modelProperty];
}

export function showGame(){
    canvas.show();
}
