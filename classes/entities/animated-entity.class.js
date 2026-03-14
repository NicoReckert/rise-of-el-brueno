import { MovableObject } from '../systems/movable-object.class.js';
import { EntityAnimationController } from '../systems/entity-animation-controller.class.js';
import { EntityAnimationSequenceController } from '../systems/entity-animation-sequence-controller.class.js';
import { getCachedEntityAnimation } from '../../utils/entity-animation-cache.util.js';

/**
 * Represents an animated entity.
 */
export class AnimatedEntity extends MovableObject {
    /**
     * Creates a new instance.
     * @param {*} entityImages Image resources.
     * @param {*} currentEntity Current entity identifier.
     * @param {number} [height=150] Entity height.
     * @param {number} [width=150] Entity width.
     * @param {number} [x=355] Initial x position.
     * @param {number} [y=220] Initial y position.
     * @param {number} [offsetTop=0] Top offset.
     * @param {number} [offsetLeft=0] Left offset.
     * @param {number} [offsetRight=0] Right offset.
     * @param {number} [offsetBottom=0] Bottom offset.
     */
    constructor(entityImages, currentEntity, height = 150, width = 150, x = 355, y = 220, offsetTop = 0, offsetLeft = 0, offsetRight = 0, offsetBottom = 0) {
        super();
        this.animCtrl = new EntityAnimationController(this);
        this.animSeqCtrl = new EntityAnimationSequenceController(this);
        this.entityImages = entityImages;
        this.currentEntity = currentEntity;
        this.initDimensions(height, width, x, y);
        this.initAnimationState();
        this.initOffset(offsetTop, offsetLeft, offsetRight, offsetBottom);
        this.initMovementState();
        this.initFadeState();
    }

    /**
     * Initializes dimensions and position.
     * @param {number} height Entity height.
     * @param {number} width Entity width.
     * @param {number} x Initial x position.
     * @param {number} y Initial y position.
     */
    initDimensions(height, width, x, y) {
        this.height = height;
        this.width = width;
        this.x = x;
        this.y = y;
    }

    /**
     * Initializes animation state.
     */
    initAnimationState() {
        this.lastFrameTime = 0;
        this.currentAnimation = 'idle';
        this.frameInterval = 1000 / 5.5;
        this.frameIndex = 0;
        this.isFlipped = true;
        this.sheetIndex = 0;
        this.animSequence = null;
        this.animationFinished = false;
    }

    /**
     * Initializes offset values.
     * @param {number} offsetTop Top offset.
     * @param {number} offsetLeft Left offset.
     * @param {number} offsetRight Right offset.
     * @param {number} offsetBottom Bottom offset.
     */
    initOffset(offsetTop, offsetLeft, offsetRight, offsetBottom) {
        this.offset.top = offsetTop;
        this.offset.left = offsetLeft;
        this.offset.right = offsetRight;
        this.offset.bottom = offsetBottom;
    }

    /**
     * Initializes movement state.
     */
    initMovementState() {
        this.speedX = 5;
        this.movementSpeed = 0;
        this.lastUpdateTime = 0;
        this.isMovingLeft = false;
        this.isMovingRight = false;
    }

    /**
     * Initializes fade state.
     */
    initFadeState() {
        this.opacity = 1;
        this.fading = null;
        this.fadeStart = null;
        this.fadeDuration = 1000;
    }

    /**
     * Starts a fade transition.
     * @param {string} [direction="in"] Fade direction.
     * @param {number} timestamp Current frame timestamp.
     * @param {number} [duration=1000] Fade duration in milliseconds.
     */
    fade(direction = "in", timestamp, duration = 1000) {
        this.fading = direction;
        this.fadeStart = timestamp;
        this.fadeDuration = duration;
        this.opacity = direction === "in" ? 0 : 1;
    }

    /**
     * Fades the entity in.
     * @param {number} timestamp Current frame timestamp.
     * @param {number} [duration=1000] Fade duration in milliseconds.
     */
    fadeIn(timestamp, duration = 1000) {
        this.fade("in", timestamp, duration);
    }

    /**
     * Fades the entity out.
     * @param {number} timestamp Current frame timestamp.
     * @param {number} [duration=1000] Fade duration in milliseconds.
     */
    fadeOut(timestamp, duration = 1000) {
        this.fade("out", timestamp, duration);
    }

    /**
     * Updates the fade transition.
     * @param {number} timestamp Current frame timestamp.
     */
    updateFade(timestamp) {
        if (!this.fading) return;
        const elapsed = timestamp - this.fadeStart;
        const t = Math.min(elapsed / this.fadeDuration, 1);
        this.opacity = this.fading === "in" ? t : 1 - t;
        if (t >= 1) {
            this.fading = null;
        }
    }

    /**
     * Updates the state of the object.
     * @param {number} timestamp Frame timestamp.
     */
    updateState(timestamp) {
        this.updateDeltaTime(timestamp);
        this.handleMovement();
        this.animCtrl.updateAnimation(timestamp);
        this.animSeqCtrl.update();
    }

    /**
     * Updates the animation state.
     * @param {string} state Animation state.
     * @param {number} [frameInterval=1000/5.5] Interval between frames in milliseconds.
     */
    updateAnimationState(state, frameInterval = 1000 / 5.5) {
        const fps = 1000 / frameInterval;
        this.animCtrl.setAnim(state, fps);
    }

    /**
     * Handles horizontal movement based on the current input state.
     */
    handleMovement() {
        if (this.isMovingLeft) return this.moveLeft();
        if (this.isMovingRight) return this.moveRight();
    }

    /**
     * Moves the object to the left if within bounds.
     */
    moveLeft() {
        if (this.x > 0) {
            this.x -= this.movementSpeed;
        }
    }

    /**
     * Moves the object to the right.
     */
    moveRight() {
        this.x += this.movementSpeed;
    }

    /**
     * Retrieves animation frames for the given state.
     * @param {string} state Animation state name.
     * @returns {Array|null} Array of animation frames or null if unavailable.
     */
    getAnimationImages(state) {
        const entityDef = this.entityImages?.[this.currentEntity];
        if (!entityDef) return null;
        return this.resolveAnimationImages(entityDef, state);
    }

    /**
     * Resolves animation frames for a specific state from the entity definition.
     * @param {Object|Array} entityDef Entity definition or frame array.
     * @param {string} state Animation state name.
     * @returns {Array|null} Array of animation frames or null if unavailable.
     */
    resolveAnimationImages(entityDef, state) {
        if (Array.isArray(entityDef)) return !state || state === 'idle' ? entityDef : null;
        const cached = getCachedEntityAnimation(this.entityImages, this.currentEntity, state);
        if (cached) return cached;
        const anim = entityDef[state];
        if (anim || state === 'idle') return anim ?? null;
        const cachedIdle = getCachedEntityAnimation(this.entityImages, this.currentEntity, 'idle');
        if (cachedIdle) return cachedIdle;
        return entityDef.idle ?? null;
    }

    /**
     * Sets a new animation and resets related state if it differs from the current one.
     * @param {string} newAnimation Animation name.
     * @param {boolean} [force=false] Whether to force the animation change.
     * @returns {void}
     */
    setAnimation(newAnimation, force = false) {
        if (force || this.currentAnimation !== newAnimation) {
            this.currentAnimation = newAnimation;
            this.frameIndex = 0;
            this.sheetIndex = 0;
            this.animationFinished = false;
            this.lastFrameTime = null;
        }
    }

    /**
     * Moves the object towards a target x-coordinate.
     * @param {number} targetX Target x-coordinate.
     * @param {Object} [options={}] Movement options.
     * @returns {boolean} True if the target position has been reached, otherwise false.
     */
    moveToX(targetX, options = {}) {
        const settings = this.normalizeMoveOptions(options);
        this.applyMoveSpeedOverride(settings.speed);
        const distance = targetX - this.x;
        this.updateMoveDirectionFlags(distance, settings.tolerance);
        this.applyMoveAnimation(settings.moveAnimation);
        if (this.hasReachedTarget(distance, settings.tolerance)) {
            this.finishMoveToX(targetX, settings);
            return true;
        }
        return false;
    }

    /**
     * Normalizes movement options with default values.
     * @param {Object} [options={}] Movement options.
     * @param {number} [options.tolerance=3] Distance tolerance to consider arrival.
     * @param {boolean} [options.snap=true] Whether to snap to the target on arrival.
     * @param {?number} [options.speed=null] Temporary movement speed override.
     * @param {?Function} [options.onArrive=null] Callback executed on arrival.
     * @param {?string} [options.moveAnimation=null] Animation used while moving.
     * @param {?string} [options.idleAnimation=null] Animation used when idle after arrival.
     * @returns {{tolerance:number, snap:boolean, speed:?number, onArrive:?Function, moveAnimation:?string, idleAnimation:?string}} Normalized movement options.
     */
    normalizeMoveOptions({
        tolerance = 3,
        snap = true,
        speed = null,
        onArrive = null,
        moveAnimation = null,
        idleAnimation = null
    } = {}) {
        return { tolerance, snap, speed, onArrive, moveAnimation, idleAnimation };
    }

    /**
     * Applies a temporary movement speed override.
     * @param {?number} speed Movement speed override.
     */
    applyMoveSpeedOverride(speed) {
        if (speed === null) return;
        if (this._moveSpeedBackup !== undefined) return;
        this._moveSpeedBackup = this.speedX;
        this.speedX = speed;
    }

    /**
     * Updates horizontal movement direction flags.
     * @param {number} distance Distance to the target.
     * @param {number} tolerance Distance tolerance.
     */
    updateMoveDirectionFlags(distance, tolerance) {
        this.isMovingRight = distance > tolerance;
        this.isMovingLeft = distance < -tolerance;
    }

    /**
     * Applies the movement animation if applicable.
     * @param {?string} moveAnimation Animation state used while moving.
     */
    applyMoveAnimation(moveAnimation) {
        if (!moveAnimation) return;
        if (!this.isMovingLeft && !this.isMovingRight) return;
        this.updateAnimationState(moveAnimation);
    }

    /**
     * Checks whether the target position has been reached.
     * @param {number} distance Distance to the target.
     * @param {number} tolerance Distance tolerance.
     * @returns {boolean} True if the target is within tolerance, otherwise false.
     */
    hasReachedTarget(distance, tolerance) {
        return Math.abs(distance) <= tolerance;
    }

    /**
     * Finalizes movement after reaching the target position.
     * @param {number} targetX Target x-coordinate.
     * @param {{snap:boolean, idleAnimation:?string, onArrive:?Function}} settings Movement settings.
     */
    finishMoveToX(targetX, settings) {
        this.isMovingRight = false;
        this.isMovingLeft = false;
        if (settings.snap) {
            this.x = targetX;
        }
        this.restoreMoveSpeed();
        this.applyIdleAnimation(settings.idleAnimation);
        settings.onArrive?.();
    }

    /**
     * Restores the original movement speed if overridden.
     */
    restoreMoveSpeed() {
        if (this._moveSpeedBackup === undefined) return;
        this.speedX = this._moveSpeedBackup;
        delete this._moveSpeedBackup;
    }

    /**
     * Applies the idle animation if provided.
     * @param {?string} idleAnimation Animation state used when idle.
     */
    applyIdleAnimation(idleAnimation) {
        if (!idleAnimation) return;
        this.updateAnimationState(idleAnimation);
    }
}