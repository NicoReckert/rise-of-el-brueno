import { EntityAnimationTransitions } from "./entity-animation-transitions.class.js";

/**
 * Controls animations for an entity.
 */
export class EntityAnimationController {
    /**
    * Creates a new instance.
    * @param {*} entity Associated entity.
    */
    constructor(entity) {
        this.entity = entity;
        this.transitions = new EntityAnimationTransitions(entity);
    }

    /**
    * Updates the animation based on the given timestamp.
    * @param {number} timestamp Frame timestamp.
    * @returns {void}
    */
    updateAnimation(timestamp) {
        if (this.handleSkipOrPause(timestamp)) return;
        const finishedAnim = this.entity.currentAnimation;
        const anim = this.entity.getAnimationImages(finishedAnim);
        if (!anim) {
            this.handleMissingAnimation(timestamp);
            return;
        }
        this.playAnimationFromSource(anim, finishedAnim);
        this.finishFrameUpdate(timestamp);
    }

    /**
    * Handles frame skipping or paused animation state.
    * @param {number} timestamp Frame timestamp.
    * @returns {boolean} True if processing should stop, otherwise false.
    */
    handleSkipOrPause(timestamp) {
        if (this.shouldSkipFrame(timestamp)) {
            this.entity.updateFade?.(timestamp);
            return true;
        }
        if (this.isAnimationSequencePaused()) {
            this.finishFrameUpdate(timestamp);
            return true;
        }
        return false;
    }

    /**
    * Checks whether the animation sequence is paused.
    * @returns {boolean} True if paused, otherwise false.
    */
    isAnimationSequencePaused() {
        const seq = this.entity.animSeqCtrl;
        if (!seq?.isActive?.()) return false;
        if (!seq.isWaitingForPause?.()) return false;
        return this.entity.animationFinished;
    }

    /**
    * Determines whether the current animation frame should be skipped.
    * @param {number} timestamp Frame timestamp.
    * @returns {boolean} True if the frame should be skipped, otherwise false.
    */
    shouldSkipFrame(timestamp) {
        if (!this.entity.lastFrameTime) {
            this.entity.lastFrameTime = timestamp;
        }
        const dt = timestamp - this.entity.lastFrameTime;
        return dt <= this.entity.frameInterval;
    }

    /**
    * Handles the case when no animation is available.
    * @param {number} timestamp Frame timestamp.
    */
    handleMissingAnimation(timestamp) {
        this.entity.lastFrameTime = timestamp;
        this.entity.updateFade?.(timestamp);
    }

    /**
    * Plays an animation from the provided source.
    * @param {Array<string>} anim Animation frames.
    * @param {string} finishedAnim Animation state to handle after completion.
    * @returns {void}
    */
    playAnimationFromSource(anim, finishedAnim) {
        const seqActive = !!this.entity.animSeqCtrl?.isActive?.();
        this.entity.updateAnimationFromSourceGeneric(anim, {
            onFinished: () => {
                if (seqActive) return;
                this.transitions.handlePostAnimation(finishedAnim);
            },
            allowLoop: true
        });
    }

    /**
    * Finalizes the frame update.
    * @param {number} timestamp Frame timestamp.
    */
    finishFrameUpdate(timestamp) {
        this.entity.lastFrameTime = timestamp;
        this.entity.updateFade?.(timestamp);
    }

    /**
    * Sets the active animation.
    * @param {string} state Animation state.
    * @param {number} fps Frames per second.
    * @param {?string} [skipIf=null] Animation state that prevents switching if active.
    * @returns {boolean} True when the call completes.
    */
    setAnim(state, fps, skipIf = null) {
        const interval = 1000 / fps;
        this.entity.frameInterval = interval;
        if (skipIf && this.entity.currentAnimation === skipIf) return true;
        if (this.transitions.shouldSkip(state)) return true;
        this.entity.setAnimation(state);
        return true;
    }
}