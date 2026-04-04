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
     * Initializes the base state.
     * @returns {void}
     */
    initBaseState() {
        this.owner = null;
        this.active = false;
        this.width = 500;
        this.baseWidth = 500;
        this.height = 500;
        this.baseHeight = 500;
        this.offset = { top: 40, left: 0, right: 0, bottom: 40 };
        this.animations = this.entityImages.fire || {};
        this.currentAnimation = 'idle';
        this.frameIndex = 0;
        this.sheetIndex = 0;
        this.animationFinished = false;
        this.applyFirstFrameOfSource(this.animations.idle);
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
     * Updates position based on the owner.
     * @returns {void}
     */
    updateFromOwner() {
        if (!this.owner) return;
        const mouthY = this.owner.y + this.owner.height * -0.18;
        const baseX = this.owner.x + this.owner.width * -1.15;
        const rightEdgeX = baseX + this.baseWidth;
        this.x = rightEdgeX - this.width;
        const anchorY = mouthY + this.baseHeight * 0.55;
        this.y = anchorY - this.height * 0.55;
    }

    /**
     * Updates the state and animation.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    updateState(timestamp) {
        if (!this.active) return;
        this.updateDeltaTime(timestamp);
        if (!this.lastFrameTime) this.lastFrameTime = timestamp;
        const dt = timestamp - this.lastFrameTime;
        if (dt <= this.frameInterval) return;
        this.updateAnimationFromSourceGeneric(this.animations[this.currentAnimation], { allowLoop: true });
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

    /**
     * Sets the current animation.
     * @param {string} name Animation name.
     * @returns {void}
     */
    setAnimation(name) {
        if (this.currentAnimation === name) return;
        this.currentAnimation = name;
        this.frameIndex = 0;
        this.sheetIndex = 0;
        this.animationFinished = false;
        this.applyFirstFrameOfSource(this.animations[name]);
    }
}