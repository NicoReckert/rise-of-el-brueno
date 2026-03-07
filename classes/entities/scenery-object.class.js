import { Ground } from './ground.class.js';

/**
 * Scenery object that extends the ground object.
 */
export class SceneryObject extends Ground {
    /**
     * Creates a new instance.
     * @param {string} img Image source path.
     * @param {number} x Horizontal position.
     * @param {number} y Vertical position.
     * @param {number} width Width of the element.
     * @param {number} height Height of the element.
     * @param {boolean} [isFlipped=false] Whether the element is flipped.
     */
    constructor(img, x, y, width, height, isFlipped = false) {
        super(img, x);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isFlipped = isFlipped;
    }
}