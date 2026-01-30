import { MovableObject } from './movable-object.class.js';

/**
 * Represents a movable object that uses a random image and has collision offsets.
 * @extends MovableObject
 */
export class Bottle extends MovableObject {
    isGameCharacter = true;
    randomImage;

    /**
     * Creates a new instance with randomized image and position.
     * @param {Object} entityImages - Image data containing object graphics.
     */
    constructor(entityImages, x) {
        super();
        this.entityImages = entityImages;
        this.bottleImages = entityImages.bottleOnGround || [];
        this.randomImage = this.bottleImages[Math.floor(Math.random() * this.bottleImages.length)];
        this.img = this.randomImage;
        // this.x = 200 + Math.random() * 1000;
        this.x = x;
        this.y = 583;
        this.height = 80;
        this.width = 80;
        this.setOffset();
    }

    /**
     * Sets collision or display offset values based on the selected image.
     */
    setOffset() {
        this.offset.top = 12;
        if (this.randomImage != "./assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.webp") {
            this.offset.left = 24;
            this.offset.right = 25;
        } else {
            this.offset.left = 33;
            this.offset.right = 15;
        }
        this.offset.bottom = 8;
    }
}