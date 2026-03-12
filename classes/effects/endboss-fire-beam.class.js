import { MovableObject } from '../systems/movable-object.class.js'

/**
 * Represents an endboss fire beam entity.
 */
export class EndbossFireBeam extends MovableObject {
    /**
     * Creates a new instance.
     * @param {*} entityImages Image resources.
     * @param {*} allAudios Audio resources.
     */
    constructor(entityImages, allAudios) {
        super();
        this.entityImages = entityImages;
        this.allAudios = allAudios;
        this.initBaseState();
        this.initAnimationState();
    }

    /**
     * Initializes base state.
     */
    initBaseState() {
        this.owner = null;
        this.active = false;
        this.width = 500;
        this.height = 500;
        this.offset = { top: 40, left: 0, right: 0, bottom: 40 };
        this.images = this.entityImages.fire?.idle || [];
        this.img = this.images[0] || null;
    }

    /**
     * Initializes animation state.
     */
    initAnimationState() {
        this.frameIndex = 0;
        this.lastFrameTime = 0;
        this.frameInterval = 1000 / 8;
    }

    /**
     * Sets the owner of the fire beam.
     * @param {*} endboss Endboss reference.
     */
    setOwner(endboss) {
        this.owner = endboss;
    }

    /**
     * Updates position and orientation based on the owner.
     */
    updateFromOwner() {
        if (!this.owner) return;
        const mouthX = this.owner.isFlipped
            ? this.owner.x + this.owner.width * 0.90
            : this.owner.x + this.owner.width * -1.15;
        const mouthY = this.owner.y + this.owner.height * -0.18;
        this.isFlipped = this.owner.isFlipped;
        this.x = mouthX;
        this.y = mouthY;
    }

    /**
     * Updates the fire beam state.
     * @param {number} timestamp Current frame timestamp.
     */
    updateState(timestamp) {
        if (!this.active) return;
        this.updateAnimation(timestamp);
    }

    /**
     * Updates the animation frame.
     * @param {number} timestamp Current frame timestamp.
     */
    updateAnimation(timestamp) {
        if (!this.images || this.images.length === 0) return;
        if (!this.lastFrameTime) this.lastFrameTime = timestamp;
        const dt = timestamp - this.lastFrameTime;
        if (dt <= this.frameInterval) return;
        this.img = this.images[this.frameIndex % this.images.length];
        this.frameIndex++;
        this.lastFrameTime = timestamp;
    }

    /**
     * Checks whether the fire beam hits a target.
     * @param {*} target Target object.
     * @returns {boolean} True if hitting, otherwise false.
     */
    isHitting(target) {
        return this.isColliding(target);
    }
}