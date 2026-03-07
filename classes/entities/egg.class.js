import { MovableObject } from '../systems/movable-object.class.js';

/**
 * Represents an egg object with physics and animation behavior.
 */
export class Egg extends MovableObject {
    /**
     * Creates a new instance.
     * @param {Object} entityImages Image definitions.
     * @param {number} x Initial x-coordinate.
     * @param {number} y Initial y-coordinate.
     * @param {Object} allAudios Audio resources.
     * @param {Object} [options={}] Configuration options.
     */
    constructor(entityImages, x, y, allAudios, options = {}) {
        super();
        this.x = x;
        this.y = y;
        this.initSizeAndGround(options);
        this.initPhysics(options);
        this.initStateFlags();
        this.initAnimationState();
        this.onBreak = options.onBreak ?? null;
        this.initImages(entityImages);
        this.initFallTiming(options.delayMin ?? 2000, options.delayMax ?? 3000);
        this.initVisualTiming();
        this.initAudio(allAudios);
    }

    /**
     * Initializes size and ground position.
     * @param {Object} options Configuration options.
     */
    initSizeAndGround(options) {
        this.width = options.width ?? 200;
        this.height = options.height ?? 200;
        this.groundY = options.groundY ?? 520;
    }

    /**
     * Initializes physics properties.
     * @param {Object} options Configuration options.
     */
    initPhysics(options) {
        this.lastPhysicsTime = null;
        this.speedY = 0;
        this.acceleration = options.acceleration ?? 1800;
    }

    /**
     * Initializes state flags.
     */
    initStateFlags() {
        this.isFalling = false;
        this.isBroken = false;
        this.isDestroyed = false;
    }

    /**
     * Initializes animation state properties.
     */
    initAnimationState() {
        this.lastFrameTime = 0;
        this.frameIndex = 0;
        this.sheetIndex = 0;
        this.animationFinished = false;
        this.frameInterval = 1000 / 8;
        this.currentAnimation = "idle";
        this.frameSource = null;
    }

    /**
     * Initializes visual timing properties.
     */
    initVisualTiming() {
        this.opacity = 1;
        this.blinkStart = 800;
        this.fadeStart = 1500;
        this.removeTime = 2000;
    }

    /**
     * Initializes audio resources and playback state.
     * @param {Object} allAudios Audio resources.
     */
    initAudio(allAudios) {
        this.audios = allAudios || {};
        this.fallingSoundPlayed = false;
        this.impactSoundPlayed = false;
        this.crackSoundPlayed = false;
        const eggFall = this.audios.eggFallingSound;
        const eggImpact = this.audios.eggImpactSound;
        const eggCrack = this.audios.eggCrackSound;
        this.eggFallingSound = eggFall?.cloneNode?.() || eggFall;
        this.eggImpactSound = eggImpact?.cloneNode?.() || eggImpact;
        this.eggCrackSound = eggCrack?.cloneNode?.() || eggCrack;
    }

    /**
     * Initializes image resources for the egg.
     * @param {Object} entityImages Image definitions.
     */
    initImages(entityImages) {
        this.idleBrokenSheet = entityImages?.egg?.idleBrokenSheet || null;
    }

    /**
     * Initializes fall timing.
     * @param {number} delayMin Minimum delay in milliseconds.
     * @param {number} delayMax Maximum delay in milliseconds.
     */
    initFallTiming(delayMin, delayMax) {
        const now = performance.now();
        const delay = delayMin + Math.random() * (delayMax - delayMin);
        this.fallStartTime = now + delay;
    }

    /**
     * Updates the egg state and animation.
     * @param {number} timestamp Frame timestamp.
     */
    update(timestamp) {
        this.updateState(timestamp);
        this.updateAnimation(timestamp);
    }

    /**
     * Updates the physical and lifecycle state.
     * @param {number} timestamp Frame timestamp.
     */
    updateState(timestamp) {
        const dt = this.updatePhysicsDeltaTime(timestamp);
        this.maybeStartFalling(timestamp);
        this.applyFallingPhysics(dt);
        this.handleLanding(timestamp);
        if (this.isBroken) {
            this.updateBrokenLifecycle(timestamp);
        }
    }

    /**
     * Computes physics delta time.
     * @param {number} timestamp Frame timestamp.
     * @returns {number} Delta time in seconds.
     */
    updatePhysicsDeltaTime(timestamp) {
        if (!this.lastPhysicsTime) {
            this.lastPhysicsTime = timestamp;
            return 0;
        }
        const dt = (timestamp - this.lastPhysicsTime) / 1000;
        this.lastPhysicsTime = timestamp;
        return dt;
    }

    /**
     * Starts falling when the delay has elapsed.
     * @param {number} timestamp Frame timestamp.
     */
    maybeStartFalling(timestamp) {
        if (this.isFalling || this.isBroken) return;
        if (timestamp < this.fallStartTime) return;
        this.isFalling = true;
        this.speedY = 0;
        this.playFallingSound();
    }

    /**
     * Plays the falling sound once.
     */
    playFallingSound() {
        if (this.fallingSoundPlayed) return;
        const sound = this.eggFallingSound;
        if (!sound) return;
        this.fallingSoundPlayed = true;
        sound.currentTime = 0;
        sound.play();
    }

    /**
     * Applies falling physics.
     * @param {number} dt Delta time in seconds.
     */
    applyFallingPhysics(dt) {
        if (!this.isFalling) return;
        if (this.isBroken) return;
        this.speedY += this.acceleration * dt;
        this.y += this.speedY * dt;
    }

    /**
     * Handles landing and transition to broken state.
     * @param {number} timestamp Frame timestamp.
     */
    handleLanding(timestamp) {
        if (this.isBroken) return;
        if (this.y < this.groundY) return;
        this.snapToGround();
        this.setBrokenState(timestamp);
        this.playImpactAndCrackSounds();
        if (this.onBreak) this.onBreak(this);
    }

    /**
     * Snaps the egg to the ground position.
     */
    snapToGround() {
        this.y = this.groundY;
    }

    /**
     * Sets the broken state and resets related properties.
     * @param {number} timestamp Frame timestamp.
     */
    setBrokenState(timestamp) {
        this.isBroken = true;
        this.isFalling = false;
        this.currentAnimation = "broken";
        this.frameIndex = 0;
        this.sheetIndex = 0;
        this.animationFinished = false;
        this.breakTime = timestamp;
        this.opacity = 1;
    }

    /**
     * Plays impact and crack sounds.
     */
    playImpactAndCrackSounds() {
        this.playImpactSound();
        this.playCrackSound();
    }

    /**
     * Plays the impact sound once.
     */
    playImpactSound() {
        if (this.impactSoundPlayed) return;
        const sound = this.eggImpactSound;
        if (!sound) return;
        this.impactSoundPlayed = true;
        sound.currentTime = 0;
        sound.play();
    }

    /**
     * Plays the crack sound once.
     */
    playCrackSound() {
        if (this.crackSoundPlayed) return;
        const sound = this.eggCrackSound;
        if (!sound) return;
        this.crackSoundPlayed = true;
        sound.currentTime = 0;
        sound.play();
    }

    /**
     * Updates the lifecycle after breaking.
     * @param {number} timestamp Frame timestamp.
     */
    updateBrokenLifecycle(timestamp) {
        const elapsed = timestamp - this.breakTime;
        this.updateBlinking(elapsed);
        this.updateFading(elapsed);
        if (elapsed >= this.removeTime) {
            this.isDestroyed = true;
        }
    }

    /**
     * Updates blinking effect.
     * @param {number} elapsed Elapsed time since breaking.
     */
    updateBlinking(elapsed) {
        if (elapsed < this.blinkStart) return;
        if (elapsed >= this.fadeStart) return;
        const blinkPhase = Math.floor(elapsed / 80);
        const isBright = blinkPhase % 2 === 0;
        this.opacity = isBright ? 1 : 0.2;
    }

    /**
     * Updates fading effect.
     * @param {number} elapsed Elapsed time since breaking.
     */
    updateFading(elapsed) {
        if (elapsed < this.fadeStart) return;
        const fadeDuration = this.removeTime - this.fadeStart;
        const fadeProgress = (elapsed - this.fadeStart) / fadeDuration;
        this.opacity = Math.max(0, 1 - fadeProgress);
    }

    /**
     * Updates the animation frame.
     * @param {number} timestamp Frame timestamp.
     */
    updateAnimation(timestamp) {
        if (this.shouldSkipAnimationFrame(timestamp)) return;
        if (this.shouldResetFrameTimeOnly()) {
            this.lastFrameTime = timestamp;
            return;
        }
        this.playBrokenAnimationFrame();
        this.lastFrameTime = timestamp;
    }

    /**
     * Determines whether the animation frame should be skipped.
     * @param {number} timestamp Frame timestamp.
     * @returns {boolean} True if the frame should be skipped, otherwise false.
     */
    shouldSkipAnimationFrame(timestamp) {
        if (!this.lastFrameTime) {
            this.lastFrameTime = timestamp;
        }
        const dt = timestamp - this.lastFrameTime;
        return dt <= this.frameInterval;
    }

    /**
     * Determines whether only the frame time should be reset.
     * @returns {boolean} True if only frame time should be reset, otherwise false.
     */
    shouldResetFrameTimeOnly() {
        if (!this.idleBrokenSheet) return true;
        if (this.currentAnimation === "broken" && this.animationFinished) {
            return true;
        }
        return false;
    }

    /**
     * Plays the broken animation frame.
     */
    playBrokenAnimationFrame() {
        this.updateAnimationFromSourceGeneric(this.idleBrokenSheet, {
            allowLoop: true
        });
    }
}