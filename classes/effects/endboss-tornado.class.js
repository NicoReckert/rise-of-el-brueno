import { MovableObject } from '../systems/movable-object.class.js';
import { EndbossTornadoConfig } from '../systems/endboss-tornado-config.class.js';

/**
 * Represents an endboss tornado entity.
 */
export class EndbossTornado extends MovableObject {
    /**
    * Creates a new instance.
    * @param {*} entityImages Image resources.
    * @param {number} x Initial x position.
    * @param {number} y Initial y position.
    * @param {*} allAudios Audio resources.
    */
    constructor(entityImages, x, y, allAudios) {
        super();
        this.config = new EndbossTornadoConfig(this, entityImages);
        this.config.initAll(x, y);
        this.entityImages = entityImages;
        this.allAudios = allAudios;
    }

    /**
    * Sets the target character.
    * @param {*} character Character reference.
    */
    setTarget(character) {
        this.target = character;
    }

    /**
    * Sets the build target x position.
    * @param {number} x Target x position.
    */
    setBuildTargetX(x) {
        this.buildX = x;
    }

    /**
    * Checks whether the tornado has captured the character.
    * @param {*} character Character reference.
    * @returns {boolean} True if captured, otherwise false.
    */
    hasCaptured(character) {
        return this.captured && this.target === character;
    }

    /**
    * Updates the tornado state.
    * @param {number} timestamp Current frame timestamp.
    */
    updateState(timestamp) {
        if (this.isFinished) return;
        this.updateDeltaTime(timestamp);
        this.y = this.groundY;
        switch (this.state) {
            case "SEEK": this.seekTarget(); break;
            case "LIFT": this.liftTarget(); break;
            case "MOVE_TO_BUILD": this.moveToBuildSpot(timestamp); break;
            case "BUILD": this.buildPedestal(timestamp); break;
            case "RELEASE": this.releaseTarget(timestamp); break;
        }
        this.updateAnimation(timestamp);
    }

    /**
    * Moves towards the target and attempts capture.
    */
    seekTarget() {
        if (!this.target) return;
        const dt60 = this.getScaledDeltaTime();
        const dx = this.getHorizontalDistanceToTarget();
        const step = this.getHorizontalStep(dx, dt60);
        this.x += Math.sign(dx) * step;
        if (this.isCollidingBefore(this.target, 0, 0)) {
            this.captureTarget();
        }
    }

    /**
    * Returns the scaled delta time factor.
    * @returns {number} Scaled delta time multiplier.
    */
    getScaledDeltaTime() {
        const base = 1 / 60;
        const dt = this.deltaTime ?? base;
        return dt * 60;
    }

    /**
    * Calculates the horizontal distance to the target.
    * @returns {number} Horizontal distance value.
    */
    getHorizontalDistanceToTarget() {
        const targetCenter = this.target.x + this.target.width * 0.5;
        const selfCenter = this.x + this.width * 0.5;
        return targetCenter - selfCenter;
    }

    /**
    * Calculates the horizontal movement step.
    * @param {number} dx Horizontal distance to target.
    * @param {number} dt60 Scaled delta time multiplier.
    * @returns {number} Horizontal step value.
    */
    getHorizontalStep(dx, dt60) {
        const absDx = Math.abs(dx);
        const maxStep = this.speed * dt60;
        return Math.min(absDx, maxStep);
    }

    /**
    * Captures the target and switches to lift state.
    */
    captureTarget() {
        this.captured = true;
        this.state = "LIFT";
        if (!this.target) return;
        this.target.isCapturedByTornado = true;
        this.target.speedY = 0;
    }

    /**
    * Lifts the captured target upwards.
    */
    liftTarget() {
        if (!this.target) return;
        const targetHeroY = this.buildYHero;
        const dt60 = (this.deltaTime ?? 1 / 60) * 60;
        const dy = this.liftSpeed * dt60;
        this.target.y = Math.max(targetHeroY, this.target.y - dy);
        this.target.x = this.x + this.width * 0.35;
        if (this.target.y <= targetHeroY + 1) {
            this.state = "MOVE_TO_BUILD";
        }
    }

    /**
    * Moves to the build position.
    * @param {number} timestamp Current frame timestamp.
    */
    moveToBuildSpot(timestamp) {
        if (!this.target) return;
        const reached = this.moveToCenterX(this.buildX);
        this.target.x = this.x + this.width * 0.35;
        this.target.y = this.buildYHero;
        if (reached) {
            this.x = this.buildX - this.width * 0.5;
            this.state = "BUILD";
            this.wiggleStart = timestamp;
        }
    }

    /**
    * Builds the pedestal beneath the target.
    * @param {number} timestamp Current frame timestamp.
    */
    buildPedestal(timestamp) {
        if (!this.target) return;
        const progress = this.getPedestalProgress(timestamp);
        this.updatePedestalPosition(progress);
        this.updateTargetOnPedestal();
        const pedestal = this.getPedestalObject();
        this.handlePedestalSpawn(progress, pedestal);
        this.fadeInPedestal(pedestal);
        if (this.isPedestalDone(progress)) {
            this.finishPedestal(timestamp);
        }
    }

    /**
    * Calculates the pedestal build progress.
    * @param {number} timestamp Current frame timestamp.
    * @returns {number} Progress value between 0 and 1.
    */
    getPedestalProgress(timestamp) {
        const elapsed = timestamp - this.wiggleStart;
        const rawProgress = elapsed / this.wiggleDuration;
        return Math.min(1, rawProgress);
    }

    /**
    * Updates the pedestal position during build.
    * @param {number} progress Build progress value.
    */
    updatePedestalPosition(progress) {
        const wigglePhase = progress * Math.PI * 6;
        const wiggleOffset = Math.sin(wigglePhase) * this.wiggleAmp;
        const baseX = this.buildX - this.width * 0.5;
        this.x = baseX + wiggleOffset;
    }

    /**
    * Updates the target position while on the pedestal.
    */
    updateTargetOnPedestal() {
        if (!this.target) return;
        this.target.x = this.x + this.width * 0.35;
        this.target.y = this.buildYHero;
    }

    /**
    * Returns the pedestal object from the world.
    * @returns {*} Pedestal object or null.
    */
    getPedestalObject() {
        return (
            this.world?.townLevelSetup?.environment?.rockyDesertPedestal ?? null
        );
    }

    /**
    * Handles pedestal spawn during build.
    * @param {number} progress Build progress value.
    * @param {*} pedestal Pedestal object.
    */
    handlePedestalSpawn(progress, pedestal) {
        if (!pedestal) return;
        if (this.pedestalSpawned) return;
        if (progress <= 0.35) return;
        this.pedestalSpawned = true;
        pedestal.x = this.buildX - pedestal.width * 0.5;
        pedestal.y = 300;
        pedestal.opacity = 0;
    }

    /**
    * Fades in the pedestal.
    * @param {*} pedestal Pedestal object.
    */
    fadeInPedestal(pedestal) {
        if (!pedestal) return;
        if (!this.pedestalSpawned) return;
        const nextOpacity = pedestal.opacity + 0.03;
        pedestal.opacity = Math.min(1, nextOpacity);
    }

    /**
    * Checks whether the pedestal build is complete.
    * @param {number} progress Build progress value.
    * @returns {boolean} True if complete, otherwise false.
    */
    isPedestalDone(progress) {
        return progress >= 1;
    }

    /**
    * Finishes the pedestal build and releases the target.
    * @param {number} timestamp Current frame timestamp.
    */
    finishPedestal(timestamp) {
        if (!this.target) return;
        this.state = "RELEASE";
        this.releaseStart = timestamp;
        this.target.y = 165;
        this.target.yNormal = 165;
        this.target.yVoidless = 282;
        this.target.isCapturedByTornado = false;
    }

    /**
    * Handles the release phase.
    * @param {number} timestamp Current frame timestamp.
    */
    releaseTarget(timestamp) {
        if (this.handleMissingTarget()) return;
        this.ensureReleaseInitialized(timestamp);
        const t = this.getReleaseProgress(timestamp);
        this.updateReleaseOpacity(t);
        if (this.isReleaseComplete(t)) {
            this.finishRelease();
        }
    }

    /**
    * Handles missing target during release.
    * @returns {boolean} True if finished due to missing target, otherwise false.
    */
    handleMissingTarget() {
        if (this.target) return false;
        this.isFinished = true;
        return true;
    }

    /**
    * Initializes release state if not already set.
    * @param {number} timestamp Current frame timestamp.
    */
    ensureReleaseInitialized(timestamp) {
        if (this.releaseStart) return;
        this.releaseStart = timestamp;
        if (this.target) {
            this.target.isCapturedByTornado = false;
        }
        this.captured = false;
        this.opacity = this.opacity ?? 1;
    }

    /**
    * Calculates the release progress.
    * @param {number} timestamp Current frame timestamp.
    * @returns {number} Progress value between 0 and 1.
    */
    getReleaseProgress(timestamp) {
        const duration = this.releaseDuration ?? 600;
        const elapsed = timestamp - this.releaseStart;
        return Math.min(1, elapsed / duration);
    }

    /**
    * Updates opacity during release.
    * @param {number} t Release progress value.
    */
    updateReleaseOpacity(t) {
        this.opacity = 1 - t;
    }

    /**
    * Checks whether the release is complete.
    * @param {number} t Release progress value.
    * @returns {boolean} True if complete, otherwise false.
    */
    isReleaseComplete(t) {
        return t >= 1;
    }

    /**
    * Finalizes the release state.
    */
    finishRelease() {
        this.opacity = 0;
        this.isFinished = true;
    }

    /**
    * Updates the animation frame.
    * @param {number} timestamp Current frame timestamp.
    */
    updateAnimation(timestamp) {
        if (!this.anim) return;
        if (!this.lastFrameTime) this.lastFrameTime = timestamp;
        const dt = timestamp - this.lastFrameTime;
        if (dt <= this.frameInterval) return;
        this.updateAnimationFromSourceGeneric(this.anim, {
            isOneShot: false,
            allowLoop: true,
        });
        this.lastFrameTime = timestamp;
    }

    /**
    * Moves towards a target center x position.
    * @param {number} targetCenterX Target center x position.
    * @returns {boolean} True if target position reached, otherwise false.
    */
    moveToCenterX(targetCenterX) {
        const centerX = this.x + this.width * 0.5;
        const dx = targetCenterX - centerX;
        const absDx = Math.abs(dx);
        const dt60 = (this.deltaTime ?? 1 / 60) * 60;
        const maxStep = this.speed * dt60;
        const step = Math.min(absDx, maxStep);
        this.x += Math.sign(dx) * step;
        return absDx <= maxStep;
    }
}