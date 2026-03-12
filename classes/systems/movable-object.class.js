import { DrawableObject } from './drawable-object.class.js';
import { movableAnimationFrameMethods } from './movable-animation-frame.methods.js';
import { movableAnimationUpdateMethods } from './movable-animation-update.methods.js';
import { movableCollisionMethods } from './movable-collision.methods.js';

/**
 * Base class for movable objects with movement, combat, and physics behavior.
 */
export class MovableObject extends DrawableObject {
    /**
     * Creates a new MovableObject instance.
     */
    constructor() {
        super();
        this.initMovementDefaults();
        this.initCombatDefaults();
        this.initCollisionDefaults();
        this.initAirState();
        this.initPhysicsState();
        this.initTimeState();
    }

    /**
     * Initializes default movement properties.
     * @returns {void}
     */
    initMovementDefaults() {
        this.speedX = this.speedX ?? 0;
        this.speedY = 0;
        this.acceleration = 2.5;
        this.intervalGravity = null;
    }

    /**
     * Initializes default combat properties.
     * @returns {void}
     */
    initCombatDefaults() {
        this.energy = 100;
        this.lastHit = 0;
    }

    /**
     * Initializes default collision offset values.
     * @returns {void}
     */
    initCollisionDefaults() {
        this.offset = {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        };
    }

    /**
     * Initializes air state properties.
     * @returns {void}
     */
    initAirState() {
        this.isFlying = false;
        this.isLanding = false;
    }

    /**
     * Initializes physics state properties.
     * @returns {void}
     */
    initPhysicsState() {
        this.lastGravityUpdate = 0;
        this.gravityInterval = 1000 / 25;
        this.groundBottom = 370 + 300;
    }

    /**
     * Initializes time-related state properties.
     * @returns {void}
     */
    initTimeState() {
        this.lastUpdateTime = 0;
        this.deltaTime = 0;
        this.deltaSeconds = 0;
        this.movementSpeed = 0;
    }

    /**
     * Preloads image objects from given paths.
     * @param {string[]} paths Image source paths.
     * @returns {HTMLImageElement[]} Preloaded image elements.
     */
    preloadImages(paths) {
        return paths.map(path => {
            const img = new Image();
            img.src = path;
            return img;
        });
    }

    /**
     * Updates delta time values based on the current timestamp.
     * @param {number} timestamp Current frame timestamp.
     * @param {number} [maxDt=0.1] Maximum allowed delta time.
     * @returns {void}
     */
    updateDeltaTime(timestamp, maxDt = 0.1) {
        if (this.initDeltaTimeState(timestamp)) return;
        let dt = this.getRawDeltaTime(timestamp);
        dt = this.normalizeDeltaTime(dt, maxDt);
        this.applyDeltaTime(dt);
    }

    /**
     * Initializes delta time state on the first update.
     * @param {number} timestamp Current frame timestamp.
     * @returns {boolean} True if initialization occurred.
     */
    initDeltaTimeState(timestamp) {
        if (this.lastUpdateTime) return false;
        this.lastUpdateTime = timestamp;
        this.deltaTime = 0;
        this.deltaSeconds = 0;
        this.movementSpeed = 0;
        return true;
    }

    /**
     * Calculates raw delta time since the last update.
     * @param {number} timestamp Current frame timestamp.
     * @returns {number} Delta time in seconds.
     */
    getRawDeltaTime(timestamp) {
        const dt = (timestamp - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = timestamp;
        return dt;
    }

    /**
     * Normalizes delta time within valid bounds.
     * @param {number} dt Raw delta time in seconds.
     * @param {number} maxDt Maximum allowed delta time.
     * @returns {number} Normalized delta time.
     */
    normalizeDeltaTime(dt, maxDt) {
        if (!Number.isFinite(dt) || dt < 0) return 0;
        if (dt > maxDt) return 0;
        return dt;
    }

    /**
     * Applies delta time values to movement-related properties.
     * @param {number} dt Normalized delta time in seconds.
     * @returns {void}
     */
    applyDeltaTime(dt) {
        this.deltaTime = dt;
        this.deltaSeconds = dt;
        this.movementSpeed = (this.speedX ?? 0) * dt * 60;
    }

    /**
     * Applies gravity based on the elapsed time since the last update.
     * @param {number} timestamp Current frame timestamp.
     * @returns {void}
     */
    applyGravity(timestamp) {
        if (!this.lastGravityUpdate) this.lastGravityUpdate = timestamp;
        const deltaTime = timestamp - this.lastGravityUpdate;
        if (deltaTime <= this.gravityInterval) return;
        this.applyGravityStep();
        this.lastGravityUpdate = timestamp;
    }

    /**
     * Executes a single gravity update step.
     * @returns {void}
     */
    applyGravityStep() {
        const groundTopY = this.getGroundTopY();
        if (this.shouldApplyGravity()) return this.updateFallingState(groundTopY);
        this.resetGravityState();
    }

    /**
     * Checks whether gravity should be applied.
     * @returns {boolean} True if gravity should be applied.
     */
    shouldApplyGravity() {
        return (!this.isFlying && this.isAboveGround()) || this.speedY > 0;
    }

    /**
     * Updates the falling state while gravity is applied.
     * @param {number} groundTopY Ground top Y position.
     * @returns {void}
     */
    updateFallingState(groundTopY) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
        if (this.y < groundTopY) return;
        this.y = groundTopY;
        this.speedY = 0;
        this.isJumping = false;
        this.isLanding = true;
    }

    /**
     * Resets gravity-related movement state.
     * @returns {void}
     */
    resetGravityState() {
        this.speedY = 0;
        this.isJumping = false;
    }

    /**
     * Checks whether the object is above the ground.
     * @returns {boolean} True if the object is above ground.
     */
    isAboveGround() {
        if (this.ignoreGroundCollision) return true;
        if (this.customGroundCheck) return this.customGroundCheck();
        return this.y < this.getGroundTopY();
    }

    /**
     * Calculates the ground top Y position for the object.
     * @returns {number} Ground top Y coordinate.
     */
    getGroundTopY() {
        if (!this.groundBottom) return 370;
        return this.groundBottom - this.height;
    }

    /**
     * Returns the render X position including draw offsets.
     * @returns {number} Render X coordinate.
     */
    getRenderX() {
        const d = this.drawOffset || { x: 0, flipX: 0 };
        const flipShift = this.isFlipped ? (d.flipX || 0) : 0;
        return this.x + (d.x || 0) + flipShift;
    }
}

/**
 * Extends MovableObject with collision and animation methods.
 */
Object.assign(
    MovableObject.prototype,
    movableCollisionMethods,
    movableAnimationFrameMethods,
    movableAnimationUpdateMethods
);