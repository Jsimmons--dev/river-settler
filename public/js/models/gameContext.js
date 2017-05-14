import * as canvas from '../view/canvas';
import {Watchable} from './Watchable';

export let context = {};

context.currentPlayer = new Watchable(1);

export function showGame(){
   canvas.show();
}
