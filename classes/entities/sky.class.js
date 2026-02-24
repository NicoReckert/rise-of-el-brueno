import { MovableObject } from '../systems/movable-object.class.js';

/**
 * Sky object that represents the background element.
 */
export class Sky extends MovableObject {
    /**
    * Creates a new instance.
    * @param {number} x Horizontal position.
    * @param {Object} entityImages Image collection.
    */
    constructor(x, entityImages) {
        super();
        this.img = entityImages.sky[0];
        this.x = x;
        this.y = 0;
        this.height = 720;
        this.width = 722;
    }
}