import { MovableObject } from '../systems/movable-object.class.js';

export class Ground extends MovableObject {

    constructor(img, x, y = 240, width = 722, height = 480,) {
        super();
        super.loadImage(img);
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
    }
}