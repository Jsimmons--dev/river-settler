import * as save from '../save';

export function generateGame(){
    let game = {};
    save.game(game);
    return game;
}
