import { MovableObject } from '../systems/movable-object.class.js';

/**
 * Represents a bottle object in the world.
 */
export class Bottle extends MovableObject {
    /**
    * Creates a new instance.
    * @param {Object} entityImages Image definitions.
    * @param {number} x Initial x-coordinate.
    */
    constructor(entityImages, x) {
        super();
        this.entityImages = entityImages;
        this.initBottleImage();
        this.initBottlePosition(x);
        this.setOffset();
    }

    /**
    * Initializes bottle image selection.
    */
    initBottleImage() {
        this.bottleImages = this.entityImages.bottleOnGround || [];
        this.randomImageIndex = Math.floor(Math.random() * this.bottleImages.length);
        this.randomImage = this.bottleImages[this.randomImageIndex];
        this.img = this.randomImage;
    }

    /**
    * Initializes bottle position and size.
    * @param {number} x Initial x-coordinate.
    */
    initBottlePosition(x) {
        this.x = x;
        this.y = 583;
        this.height = 80;
        this.width = 80;
    }
    
    /**
    * Sets collision offset values for the bottle.
    */
    setOffset() {
        this.offset.top = 12;
        if (this.randomImage === 0) {
            this.offset.left = 33;
            this.offset.right = 15;
        } else {
            this.offset.left = 24;
            this.offset.right = 25;
        }
        this.offset.bottom = 8;
    }
}