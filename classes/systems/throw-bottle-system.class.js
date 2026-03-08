import { ThrowableObject } from '../entities/throwable-object.class.js';
import { BottleAttachmentSystem } from './bottle-attachment-system.class.js';

/**
 * System that manages bottle throwing and delegates bottle attachment handling.
 */
export class ThrowBottleSystem {
    /**
     * Creates a new throw bottle system instance.
     * @param {Object} opts Constructor options.
     */
    constructor(opts) {
        const c = this.getCtorConfig(opts);
        this.assignCtorConfig(c);
        this.bottleAttachment = new BottleAttachmentSystem(c);
        this.heldBottle = this.bottleAttachment.heldBottle;
    }

    /**
     * Returns normalized constructor configuration.
     * @param {{world:*, setup:*, animName?:string, releaseFrame?:number, bottleW?:number, bottleH?:number, gripAx?:number, gripAy?:number, handKF?:*, speedY?:number}} opts
     * @returns {{world:*, setup:*, animName:string, releaseFrame:number, bottleW:number, bottleH:number, gripAx:number, gripAy:number, handKF:*, speedY:number}}
     */
    getCtorConfig({
        world, setup, animName = 'throw', releaseFrame = 4,
        bottleW = 80, bottleH = 100, gripAx = 18, gripAy = 70,
        handKF = null, speedY = 30
    }) {
        return { world, setup, animName, releaseFrame, bottleW, bottleH, gripAx, gripAy, handKF, speedY };
    }

    /**
     * Assigns constructor configuration values to the instance.
     * @param {Object} c Configuration object.
     */
    assignCtorConfig(c) {
        Object.assign(this, {
            world: c.world,
            setup: c.setup,
            animName: c.animName,
            releaseFrame: c.releaseFrame,
            speedY: c.speedY,
            gripAx: c.gripAx,
            gripAy: c.gripAy
        });
    }

    /**
     * Updates the throw controller state.
     * @returns {void}
     */
    update() {
        this.bottleAttachment.update();
        this.spawnOnRelease();
        this.resetOnAnimEnd();
    }

    /**
     * Spawns the thrown bottle when the release frame is reached.
     * @returns {void}
     */
    spawnOnRelease() {
        const char = this.world.character;
        if (!char?.isThrowing) return;
        if (char.currentAnimation !== this.animName) return;
        if (char._thrownThisAnim) return;
        const cf = this.bottleAttachment.getVisibleCharFrame(char);
        if (cf < this.releaseFrame) return;
        const { sx, sy } = this.bottleAttachment.getSpawnData(char);
        const bottle = this.createThrownBottle(char, sx, sy);
        const charge = this.consumeThrowCharge();
        this.applyBottleMotion(bottle, char, charge);
        this.finishBottleSpawn(bottle, char);
    }

    /**
     * Creates a thrown bottle instance.
     * @param {Object} char Character instance.
     * @param {number} sx Spawn X position.
     * @param {number} sy Spawn Y position.
     * @returns {Object} Thrown bottle instance.
     */
    createThrownBottle(char, sx, sy) {
        const bottle = new ThrowableObject(this.world.entityImages, sx, sy);
        bottle.isFlipped = char.isFlipped;
        const gripAx = this.gripAx;
        const gripAy = this.gripAy;
        bottle.x = char.isFlipped ? sx - (bottle.width - gripAx) : sx - gripAx;
        bottle.y = sy - gripAy;
        bottle.isThrow = true;
        bottle.isBroken = false;
        bottle.isGravity = true;
        return bottle;
    }

    /**
     * Consumes and returns the pending throw charge.
     * @returns {number} Normalized throw charge value.
     */
    consumeThrowCharge() {
        const chargeRaw = this.setup.pendingThrowCharge ?? 0;
        this.setup.pendingThrowCharge = null;
        return Math.max(0, Math.min(1, chargeRaw));
    }

    /**
     * Applies motion parameters to the thrown bottle.
     * @param {Object} bottle Thrown bottle instance.
     * @param {Object} char Character instance.
     * @param {number} charge Normalized throw charge value.
     * @returns {void}
     */
    applyBottleMotion(bottle, char, charge) {
        const { calcX, calcY } = this.getThrowSpeeds(char, charge);
        bottle.isMovingRight = !char.isFlipped;
        bottle.isMovingLeft = char.isFlipped;
        bottle.speedX = calcX;
        bottle.speedY = calcY;
    }

    /**
     * Calculates the throw speeds based on charge and enemy distance.
     * @param {Object} char Character instance.
     * @param {number} charge Normalized throw charge value.
     * @returns {{calcX: number, calcY: number}} Calculated X and Y speeds.
     */
    getThrowSpeeds(char, charge) {
        const minX = 5, maxX = 10, minY = 18, maxY = 30;
        const minD = this.getNearestEnemyDistance(char);
        const calcX = minX + (maxX - minX) * charge;
        const calcY = minY + (maxY - minY) * charge;
        if (minD < 220) {
            return { calcX: Math.min(calcX, 6), calcY: Math.min(calcY, 22) };
        }
        return { calcX, calcY };
    }

    /**
     * Returns the horizontal distance to the nearest active enemy.
     * @param {Object} char Character instance.
     * @returns {number} Distance to the nearest enemy.
     */
    getNearestEnemyDistance(char) {
        const enemies = this.setup.townLevel?.enemies ?? [];
        const charCx = char.x + char.width * 0.5;
        let minD = Infinity;
        for (const e of enemies) {
            if (!e || e.isDead || e.isRemoved) continue;
            const d = Math.abs((e.x + e.width * 0.5) - charCx);
            if (d < minD) minD = d;
        }
        return minD;
    }

    /**
     * Finalizes the bottle spawn and registers it in the world.
     * @param {Object} bottle Thrown bottle instance.
     * @param {Object} char Character instance.
     * @returns {void}
     */
    finishBottleSpawn(bottle, char) {
        this.setup.throwableObjects.push(bottle);
        this.world.audioManager.playOneShot('bottleThrowSound', { volume: 0.6 });
        char._thrownThisAnim = true;
    }

    /**
     * Resets throw state when the animation ends.
     * @returns {void}
     */
    resetOnAnimEnd() {
        const char = this.world.character;
        if (!char) return;
        if (char.animationFinished && char.currentAnimation === this.animName) {
            char._thrownThisAnim = false;
            char.isThrowing = false;
        }
    }

    /**
     * Sets the hand keyframes for the bottle attachment.
     * @param {Array<Object>} kfArray Keyframe array.
     * @returns {void}
     */
    setKeyframes(kfArray) {
        this.bottleAttachment.setKeyframes(kfArray);
    }
}