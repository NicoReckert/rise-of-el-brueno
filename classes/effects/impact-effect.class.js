import { MovableObject } from '../systems/movable-object.class.js';

/**
 * Visual impact effect that plays an animation at a position.
 */
export class ImpactEffect extends MovableObject {
    /**
     * Creates a new explosion instance.
     * @param {*} anim Animation resource.
     * @param {number} x X position.
     * @param {number} y Y position.
     * @param {Object} [opts={}] Optional configuration.
     */
    constructor(anim, x, y, opts = {}) {
        super();
        this.initExplosionConfig(anim, x, y, opts);
        this.initExplosionAnimation();
    }

    /**
     * Initializes explosion animation configuration.
     * @param {*} anim Animation resource.
     * @param {number} x X position.
     * @param {number} y Y position.
     * @param {{animName?: string, fps?: number}} [opts={}] Optional configuration.
     */
    initExplosionConfig(anim, x, y, opts = {}) {
        const { animName = "explode", fps = 18 } = opts;
        this.anim = anim;
        this.currentAnimation = animName;
        this.frameInterval = 1000 / fps;
        this.frameIndex = 0;
        this.sheetIndex = 0;
        this.lastFrameTime = 0;
        this.animationFinished = false;
        this.initExplosionTransform(x, y, opts);
    }

    /**
     * Initializes explosion transform properties.
     * @param {number} x X position.
     * @param {number} y Y position.
     * @param {{width?: number, height?: number}} [opts={}] Optional configuration.
     */
    initExplosionTransform(x, y, opts = {}) {
        const { width = 220, height = 220 } = opts;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.markedForRemoval = false;
        this.opacity = 1;
    }

    /**
     * Initializes the explosion animation from the animation source.
     */
    initExplosionAnimation() {
        if (!this.anim) return;
        this.updateAnimationFromSourceGeneric(this.anim, {
            isOneShot: false,
            allowLoop: false
        });
    }

    /**
     * Updates the explosion animation state.
     * @param {number} [timestamp] Frame timestamp.
     */
    updateState(timestamp) {
        if (this.markedForRemoval) return;
        const ts = (typeof timestamp === 'number') ? timestamp : performance.now();
        this.updateAnimation(ts);
    }

    /**
     * Updates the explosion animation frame.
     * @param {number} timestamp Frame timestamp.
     */
    updateAnimation(timestamp) {
        if (this.handleMissingAnim()) return;
        if (this.shouldSkipFrame(timestamp)) return;
        this.playExplosionFrame();
        this.lastFrameTime = timestamp;
    }

    /**
     * Handles the case where no animation source is available.
     * @returns {boolean} True if the animation is missing.
     */
    handleMissingAnim() {
        if (this.anim) return false;
        this.markedForRemoval = true;
        return true;
    }

    /**
     * Checks whether the next animation frame should be skipped.
     * @param {number} timestamp Frame timestamp.
     * @returns {boolean} True if the frame should be skipped.
     */
    shouldSkipFrame(timestamp) {
        if (!this.lastFrameTime) this.lastFrameTime = timestamp;
        const dt = timestamp - this.lastFrameTime;
        return dt <= this.frameInterval;
    }

    /**
     * Plays the next explosion animation frame.
     */
    playExplosionFrame() {
        this.updateAnimationFromSourceGeneric(this.anim, {
            isOneShot: true,
            allowLoop: false,
            onFinished: () => { this.markedForRemoval = true; }
        });
    }
}