import { MovableObject } from '../systems/movable-object.class.js';

/**
 * Fullscreen white flash transition.
 */
export class WhiteFlashTransition extends MovableObject {
    /**
     * Creates a new instance.
     */
    constructor() {
        super();
        this.initState();
    }

    /**
     * Initializes the transition state.
     * @returns {void}
     */
    initState() {
        this.active = false;
        this.alpha = 0;
        this.phase = 'idle';
        this.startTime = 0;
        this.fadeInMs = 600;
        this.holdMs = 900;
        this.fadeOutMs = 2500;
        this.onComplete = null;
    }

    /**
     * Starts the transition.
     * @param {number} timestamp Frame timestamp.
     * @param {Function|null} [onComplete=null] Callback after transition ends.
     * @returns {void}
     */
    start(timestamp, onComplete = null) {
        this.active = true;
        this.alpha = 0;
        this.phase = 'fadeIn';
        this.startTime = timestamp;
        this.onComplete = onComplete;
    }

    /**
     * Updates the transition state.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    updateState(timestamp) {
        if (!this.active) return;
        const elapsed = timestamp - this.startTime;
        if (this.phase === 'fadeIn') return this.updateFadeInPhase(timestamp, elapsed);
        if (this.phase === 'hold') return this.updateHoldPhase(timestamp, elapsed);
        if (this.phase === 'fadeOut') this.updateFadeOutPhase(elapsed);
    }

    /**
     * Updates the fade-in phase.
     * @param {number} timestamp Frame timestamp.
     * @param {number} elapsed Elapsed time in milliseconds.
     * @returns {void}
     */
    updateFadeInPhase(timestamp, elapsed) {
        this.alpha = Math.min(1, elapsed / this.fadeInMs);
        if (elapsed >= this.fadeInMs) {
            this.alpha = 1;
            this.phase = 'hold';
            this.startTime = timestamp;
        }
    }

    /**
     * Updates the hold phase.
     * @param {number} timestamp Frame timestamp.
     * @param {number} elapsed Elapsed time in milliseconds.
     * @returns {void}
     */
    updateHoldPhase(timestamp, elapsed) {
        this.alpha = 1;
        if (elapsed >= this.holdMs) {
            this.phase = 'fadeOut';
            this.startTime = timestamp;
        }
    }

    /**
     * Updates the fade-out phase.
     * @param {number} elapsed Elapsed time in milliseconds.
     * @returns {void}
     */
    updateFadeOutPhase(elapsed) {
        this.alpha = Math.max(0, 1 - elapsed / this.fadeOutMs);
        if (elapsed >= this.fadeOutMs) {
            this.finish();
        }
    }

    /**
     * Draws the fullscreen white overlay.
     * @param {CanvasRenderingContext2D} ctx
     * @returns {void}
     */
    draw(ctx) {
        if (!this.active || this.alpha <= 0) return;
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.restore();
    }

    /**
     * Finishes the transition.
     * @returns {void}
     */
    finish() {
        this.active = false;
        this.alpha = 0;
        this.phase = 'idle';
        this.startTime = 0;
        const callback = this.onComplete;
        this.onComplete = null;
        callback?.();
    }
}