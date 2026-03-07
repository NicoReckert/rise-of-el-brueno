import { MovableObject } from '../systems/movable-object.class.js';

/**
 * Throwable object that extends a movable entity.
 */
export class ThrowableObject extends MovableObject {
    /**
     * Creates a new instance.
     * @param {Object} entityImages Image collection.
     * @param {number} x Horizontal position.
     * @param {number} y Vertical position.
     */
    constructor(entityImages, x, y) {
        super();
        this.initPositionAndSize(x, y);
        this.initOffsets();
        this.initAnimationState();
        this.initPhysicsState();
        this.initSheetsAndFlags(entityImages);
    }

    /**
     * Initializes position and size.
     * @param {number} x Horizontal position.
     * @param {number} y Vertical position.
     * @returns {void}
     */
    initPositionAndSize(x, y) {
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 100;
    }

    /**
     * Initializes collision offsets.
     * @returns {void}
     */
    initOffsets() {
        this.offset.top = 14;
        this.offset.left = 10;
        this.offset.right = 10;
        this.offset.bottom = 11;
    }

    /**
     * Initializes animation state.
     * @returns {void}
     */
    initAnimationState() {
        this.currentAnimation = "throw";
        this.frameInterval = 1000 / 15;
        this.frameIndex = 0;
        this.sheetIndex = 0;
        this.lastFrameTime = 0;
        this.animationFinished = false;
    }

    /**
     * Initializes physics state.
     * @returns {void}
     */
    initPhysicsState() {
        this.isGravity = false;
        this.ignoreGroundCollision = true;
        this.isMovingLeft = false;
        this.isMovingRight = false;
        this.speedY = 0;
        this.acceleration = 2.5;
        this.speedX = 10;
        this.markedForRemoval = false;
    }

    /**
     * Initializes animation sheets and related flags.
     * @param {Object} entityImages Image collection.
     * @returns {void}
     */
    initSheetsAndFlags(entityImages) {
        this.throwSheet =
            entityImages?.throwableBottle?.throw ?? null;
        this.brokenSheet =
            entityImages?.throwableBottle?.broken ?? null;
        this.isBrokenAnimation = false;
        this.isBrokenSound = false;
    }

    /**
     * Returns the animation images for the given state.
     * @param {string} [state=this.currentAnimation] Animation state.
     * @returns {Array|null} Animation images or null.
     */
    getAnimationImages(state = this.currentAnimation) {
        if (state === 'broken') {
            return this.brokenSheet ?? null;
        }
        return this.throwSheet ?? null;
    }

    /**
     * Sets the current animation state.
     * @param {string} newState Animation state.
     * @returns {void}
     */
    setAnimation(newState) {
        if (this.currentAnimation !== newState) {
            this.currentAnimation = newState;
            this.frameIndex = 0;
            this.sheetIndex = 0;
            this.animationFinished = false;
            this.lastFrameTime = null;
        }
    }

    /**
     * Updates the state based on the given timestamp.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    updateState(timestamp) {
        this.updateDeltaTime(timestamp);
        const step = this.getMovementStep();
        this.updateHorizontalPosition(step);
        this.updateAnimationFromState();
        this.applyGravity();
    }

    /**
     * Calculates the movement step based on delta time.
     * @returns {number} Movement step.
     */
    getMovementStep() {
        const dt = this.deltaTime ?? 1 / 60;
        return dt * 60;
    }

    /**
     * Updates the horizontal position.
     * @param {number} step Movement step.
     * @returns {void}
     */
    updateHorizontalPosition(step) {
        if (this.isBroken) return;
        if (this.isMovingLeft) {
            this.x -= this.speedX * step;
        } else if (this.isMovingRight) {
            this.x += this.speedX * step;
        }
    }

    /**
     * Updates the animation based on the current state.
     * @returns {void}
     */
    updateAnimationFromState() {
        if (this.isBroken) {
            this.setAnimation("broken");
            this.frameInterval = 1000 / 10;
            this.isBrokenAnimation = true;
        } else if (this.isThrow) {
            this.setAnimation("throw");
            this.frameInterval = 1000 / 15;
            this.isBrokenAnimation = false;
        }
    }

    /**
     * Updates the animation based on the given timestamp.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    updateAnimation(timestamp) {
        this.initLastFrameTime(timestamp);
        if (this.shouldSkipFrame(timestamp)) return;
        const animSource = this.getAnimationImages(this.currentAnimation);
        if (!animSource) {
            this.lastFrameTime = timestamp;
            return;
        }
        const loop = this.currentAnimation === "throw";
        this.updateAnimationFromSourceGeneric(animSource, { allowLoop: loop });
        this.handleBrokenAnimationCompletion();
        this.lastFrameTime = timestamp;
    }

    /**
     * Initializes the last frame timestamp if not set.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    initLastFrameTime(timestamp) {
        if (!this.lastFrameTime) {
            this.lastFrameTime = timestamp;
        }
    }

    /**
     * Checks whether the current animation frame should be skipped.
     * @param {number} timestamp Frame timestamp.
     * @returns {boolean} True if the frame should be skipped, otherwise false.
     */
    shouldSkipFrame(timestamp) {
        const dtMs = timestamp - this.lastFrameTime;
        return dtMs <= this.frameInterval;
    }

    /**
     * Handles completion of the broken animation.
     * @returns {void}
     */
    handleBrokenAnimationCompletion() {
        if (this.currentAnimation !== "broken") return;
        if (!this.animationFinished) return;
        this.isBrokenAnimation = false;
        this.isBrokenAnimationDone = true;
        this.markedForRemoval = true;
    }

    /**
     * Applies gravity to the object.
     * @returns {void}
     */
    applyGravity() {
        if (!this.isGravity) return;
        const dt = this.deltaTime ?? 1 / 60;
        if (this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY * dt * 30;
            this.speedY -= this.acceleration * dt * 30;
        } else {
            this.speedY = 0;
        }
    }
}