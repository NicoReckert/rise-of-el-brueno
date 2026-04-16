import { MovableObject } from '../systems/movable-object.class.js';

/**
 * Represents a collectible or animated movable object.
 * Handles random positioning, simple animation, and collision offsets.
 * @extends MovableObject
 */
export class Coin extends MovableObject {
    /**
     * Creates a coin instance.
     * @param {Object} entityImages Entity image collection.
     * @param {number} x X position.
     * @param {number} y Y position.
     */
    constructor(entityImages, x, y) {
        super();
        this.entityImages = entityImages;
        this.coinImages = entityImages.coin || [];
        this.img = this.coinImages[0];
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
        this.setOffsets();
        this.frameIndex = 0;
        this.lastFrameTime = 0;
        this.frameInterval = 1000 / 5;
    }

    /**
     * Sets uniform collision or display offsets.
     */
    setOffsets() {
        this.offset.top = 35;
        this.offset.left = 35;
        this.offset.right = 35;
        this.offset.bottom = 35;
    }

    /**
     * Updates the animation frame based on elapsed time.
     * @param {number} timestamp - Current time in milliseconds.
     */
    updateAnimation(timestamp) {
        if (!this.lastFrameTime) this.lastFrameTime = timestamp;
        const deltaTime = timestamp - this.lastFrameTime;
        if (deltaTime > this.frameInterval) {
            if (this.coinImages && this.coinImages.length > 0) {
                this.img = this.coinImages[this.frameIndex % this.coinImages.length];
                this.frameIndex++;
                this.lastFrameTime = timestamp;
            }
        }
    }
}