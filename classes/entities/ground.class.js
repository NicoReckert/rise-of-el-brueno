import { MovableObject } from '../systems/movable-object.class.js';
/**
 * Ground object that represents a static floor element.
 */
export class Ground extends MovableObject {
    /**
     * Creates a new instance.
     * @param {string} img Image source path.
     * @param {number} x Horizontal position.
     * @param {number} [y=240] Vertical position.
     * @param {number} [width=722] Width of the element.
     * @param {number} [height=480] Height of the element.
     */
    constructor(img, x, y = 240, width = 722, height = 480,) {
        super();
        super.loadImage(img);
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
    }
}