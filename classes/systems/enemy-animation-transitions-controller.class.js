/**
 * Controls animation transition behavior for an enemy.
 */
export class EnemyAnimationTransitionsController {
    /**
     * Creates a new instance.
     * @param {object} enemy Enemy instance.
     */
    constructor(enemy) {
        this.enemy = enemy;
    }

    /**
     * Plays the death animation.
     * @returns {void}
     */
    playDeathAnimation() {
        if (this.enemy.currentEnemy === 'dragonSmall') return;
        const anim = this.enemy.dead;
        if (!anim) return;
        this.enemy.currentAnimation = null;
        this.enemy.y = this.enemy.currentEnemy === 'chickenMutatesSmall' ? 565 : 555;
        this.applyDeathFirstFrame(anim);
    }

    /**
     * Applies the first frame of the death animation.
     * @param {Array|object} anim Animation source.
     * @returns {void}
     */
    applyDeathFirstFrame(anim) {
        if (Array.isArray(anim) && anim.length > 0) {
            this.enemy.img = anim[0];
            this.enemy.frameSource = null;
            return;
        }
        if (anim.type === 'sheet') {
            this.applyFirstFrameFromSheet(anim, 'dead');
            return;
        }
        if (anim.type === 'sheetSequence' && anim.sheets?.length) {
            this.applyFirstFrameFromSheet(anim.sheets[0], 'dead');
        }
    }

    /**
     * Applies the first frame from a sheet animation source.
     * @param {object} sheet Sheet animation source.
     * @param {string} [fallbackAnimName='dead'] Fallback animation name.
     * @returns {void}
     */
    applyFirstFrameFromSheet(sheet, fallbackAnimName = 'dead') {
        const { image, meta, anim } = sheet;
        const animKey = anim ?? fallbackAnimName;
        const def =
            meta.animations?.[animKey] ??
            meta.animations?.default ??
            { from: 0 };
        const frame = def.from ?? 0;
        const { frameWidth, frameHeight, columns } = meta;
        const col = frame % columns;
        const row = Math.floor(frame / columns);
        this.enemy.img = image;
        this.enemy.frameSource = this.buildFrameSourceFromGrid(col, row, frameWidth, frameHeight);
    }

    /**
     * Builds a frame source object from grid coordinates.
     * @param {number} col Grid column.
     * @param {number} row Grid row.
     * @param {number} frameWidth Frame width.
     * @param {number} frameHeight Frame height.
     * @returns {object} Frame source object.
     */
    buildFrameSourceFromGrid(col, row, frameWidth, frameHeight) {
        return {
            sx: col * frameWidth,
            sy: row * frameHeight,
            sw: frameWidth,
            sh: frameHeight
        };
    }

    /**
     * Handles logic when an animation ends.
     * @param {string} anim Animation name.
     * @param {number} frameCount Number of animation frames.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    handleAnimationEnd(anim, frameCount, timestamp) {
        this.handleHurtAnimationEnd(anim, frameCount);
        this.handleDragonImpactAnimationEnd(anim, frameCount, timestamp);
        this.handleDragonAttackAnimationEnd(anim, frameCount);
        this.handleChickenAttackAnimationEnd();
    }

    /**
     * Handles the end of the hurt animation.
     * @param {*} anim Animation source.
     * @param {number} frameCount Number of animation frames.
     * @returns {void}
     */
    handleHurtAnimationEnd(anim, frameCount) {
        if (this.enemy.currentAnimation !== "hurt") return;
        if (anim.type === "sheetSequence") {
            this.handleHurtSheetEnd(anim);
            return;
        }
        this.handleHurtFramesEnd(frameCount);
    }

    /**
     * Handles the end of a sheet-based hurt animation.
     * @param {*} anim Animation source.
     * @returns {void}
     */
    handleHurtSheetEnd(anim) {
        if (!this.enemy.animationFinished || anim.loop) return;
        this.enemy.isHurt = false;
        this.enemy.frameIndex = 0;
        this.enemy.sheetIndex = 0;
        this.enemy.animationFinished = false;
    }

    /**
     * Handles the end of a frame-based hurt animation.
     * @param {number} frameCount Number of animation frames.
     * @returns {void}
     */
    handleHurtFramesEnd(frameCount) {
        if (!frameCount) return;
        if (this.enemy.frameIndex < frameCount - 1) return;
        this.enemy.isHurt = false;
        this.enemy.frameIndex = 0;
    }

    /**
     * Handles the end of the dragon impact animation.
     * @param {*} anim Animation source.
     * @param {number} frameCount Number of animation frames.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    handleDragonImpactAnimationEnd(anim, frameCount, timestamp) {
        if (!this.isDragonImpactState()) return;
        if (anim.type === "sheetSequence") {
            this.finishDragonImpactSheet();
            return;
        }
        this.finishDragonImpactFrames(frameCount, timestamp);
    }

    /**
     * Checks whether the enemy is in the dragon impact state.
     * @returns {boolean} True if the enemy is in the dragon impact state, otherwise false.
     */
    isDragonImpactState() {
        if (this.enemy.currentEnemy !== "dragonSmall") return false;
        if (!this.enemy.isDead) return false;
        if (this.enemy.currentAnimation !== "impact") return false;
        return true;
    }

    /**
     * Finishes the dragon impact sheet animation if completed.
     * @returns {void}
     */
    finishDragonImpactSheet() {
        if (!this.enemy.animationFinished) return;
        this.setDragonImpactDone();
    }

    /**
     * Finishes the dragon impact frame animation if completed.
     * @param {number} frameCount Number of animation frames.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    finishDragonImpactFrames(frameCount, timestamp) {
        if (!frameCount) return;
        if (this.enemy.frameIndex < frameCount - 1) return;
        this.setDragonImpactDone();
        this.enemy.lastFrameTime = timestamp;
    }

    /**
     * Marks the dragon impact animation as completed.
     * @returns {void}
     */
    setDragonImpactDone() {
        this.enemy.deathPhase = "done";
        this.enemy.frameIndex = 0;
        this.enemy.sheetIndex = 0;
        this.enemy.animationFinished = false;
    }

    /**
     * Handles the end of the dragon attack animation.
     * @param {*} anim Animation source.
     * @param {number} frameCount Number of animation frames.
     * @returns {void}
     */
    handleDragonAttackAnimationEnd(anim, frameCount) {
        if (this.enemy.currentEnemy !== 'dragonSmall') return;
        if (this.enemy.currentAnimation !== 'attack') return;
        if (!this.enemy.isAttack) return;
        if (anim?.type === 'sheetSequence') {
            if (!this.enemy.animationFinished) return;
            this.finishDragonAttackAnimation();
            return;
        }
        if (!frameCount) return;
        if (this.enemy.frameIndex < frameCount) return;
        this.finishDragonAttackAnimation();
    }

    /**
     * Finishes the dragon attack animation.
     * @returns {void}
     */
    finishDragonAttackAnimation() {
        this.enemy.attackHitbox.active = false;
        this.enemy.isAttack = false;
        this.enemy.frameIndex = 0;
        this.enemy.sheetIndex = 0;
        this.enemy.animationFinished = false;
        this.enemy.hasHitPlayerThisAttack = false;
    }

    /**
     * Handles logic after a chicken attack animation ends.
     * @returns {void}
     */
    handleChickenAttackAnimationEnd() {
        if (this.enemy.currentAnimation !== 'attack') return;
        if (!this.enemy.isAttack) return;
        if (!this.enemy.animationFinished) return;
        if (this.enemy.currentEnemy === 'chickenMutatesBig') {
            this.finishBigChickenAttackAnimation();
            return;
        }
        if (this.enemy.currentEnemy === 'chickenMutatesSmall') {
            this.finishSmallChickenAttackAnimation();
        }
    }

    /**
     * Resets state after a big chicken attack animation.
     * @returns {void}
     */
    finishBigChickenAttackAnimation() {
        this.enemy.hasFiredThisAttack = false;
        this.enemy.isAttack = false;
        this.enemy.frameIndex = 0;
        this.enemy.sheetIndex = 0;
        this.enemy.animationFinished = false;
    }

    /**
     * Resets state after a small chicken attack animation.
     * @returns {void}
     */
    finishSmallChickenAttackAnimation() {
        this.enemy.attackHitbox.active = false;
        this.enemy.isAttack = false;
        this.enemy.frameIndex = 0;
        this.enemy.sheetIndex = 0;
        this.enemy.animationFinished = false;
        this.enemy.hasHitPlayerThisAttack = false;
    }
}