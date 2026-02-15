import { Ground } from './ground.class.js';

export class Town extends Ground {

    isFlipped = false;
    isGameCharacter = true;

    constructor(img, x, y, width, height, isFlipped = false) {
        super(img, x);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isFlipped = isFlipped;
    }
}