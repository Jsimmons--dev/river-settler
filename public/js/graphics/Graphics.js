export class Graphics{
    constructor() {
        if (new.target === Graphics) {
            throw new TypeError("Cannot instantiate Abstract class directly");
        }
        this.sceneObjects = new Map();
    }   
}
