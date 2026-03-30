/**
 * Controls attack-related animation behavior for an enemy.
 */
export class EnemyAnimationAttackController {
    /**
     * Creates a new instance.
     * @param {object} enemy Enemy instance.
     */
    constructor(enemy) {
        this.enemy = enemy
    }

    /**
     * Handles attack logic for the current animation.
     * @param {number} prevFrame Previous frame index.
     * @param {number} frameCount Number of animation frames.
     * @returns {void}
     */
    handleAttackLogic(prevFrame, frameCount) {
        if (!frameCount || frameCount <= 0) return;
        this.handleBigChickenAttack(prevFrame);
        this.handleSmallChickenAttack(prevFrame);
        this.handleDragonAttack(prevFrame, frameCount);
    }

    /**
     * Handles big chicken attack logic.
     * @param {number} prevFrame Previous frame index.
     * @returns {void}
     */
    handleBigChickenAttack(prevFrame) {
        if (!this.shouldProcessBigChickenAttack()) return;
        const shootFrame = 8;
        if (this.shouldPlayChargeSoundAtAttackStart(prevFrame)) {
            this.playBigChickenChargeSound();
        }
        if (this.shouldShootNow(prevFrame, shootFrame)) {
            this.fireBigChickenProjectile();
        }
    }

    /**
     * Checks whether the charge-up sound should be played at the start of the attack.
     * @param {number} prevFrame Previous frame index.
     * @returns {boolean} True if the charge-up sound should be played, otherwise false.
     */
    shouldPlayChargeSoundAtAttackStart(prevFrame) {
        if (prevFrame !== 0) return false;
        if (this.enemy.hasPlayedChargeSoundThisAttack) return false;
        return true;
    }

    /**
     * Plays the charge sound for the big chicken attack.
     * @returns {void}
     */
    playBigChickenChargeSound() {
        const e = this.enemy;
        if (e.activeChargeSound) {
            e.activeChargeSound.pause();
            e.activeChargeSound.currentTime = 0;
            e.activeChargeSound = null;
        }
        const audio = e.allAudios.fireballChargeStartSfx.cloneNode();
        audio.play();
        e.activeChargeSound = audio;
        e.hasPlayedChargeSoundThisAttack = true;
    }

    /**
     * Checks whether big chicken attack logic should be processed.
     * @returns {boolean} True if big chicken attack logic should be processed, otherwise false.
     */
    shouldProcessBigChickenAttack() {
        const e = this.enemy;
        if (!e.isAttack) return false;
        if (e.currentEnemy !== "chickenMutatesBig") return false;
        if (e.isHurt || e.isDead) return false;
        return true;
    }

    /**
     * Checks whether the enemy should fire the projectile in this frame.
     * @param {number} prevFrame Previous frame index.
     * @param {number} shootFrame Frame index at which to shoot.
     * @returns {boolean} True if the projectile should be fired, otherwise false.
     */
    shouldShootNow(prevFrame, shootFrame) {
        if (prevFrame !== shootFrame) return false;
        if (this.enemy.hasFiredThisAttack) return false;
        return true;
    }

    /**
     * Fires the projectile for the big chicken attack.
     * @returns {void}
     */
    fireBigChickenProjectile() {
        const e = this.enemy;
        const audio = e.allAudios.fireballShotSfx.cloneNode();
        audio.play();
        e.combatCtrl.shootProjectile("fireball");
        e.hasFiredThisAttack = true;
    }

    /**
     * Handles small chicken attack logic.
     * @param {number} prevFrame Previous frame index.
     * @returns {void}
     */
    handleSmallChickenAttack(prevFrame) {
        if (!this.enemy.isAttack || this.enemy.currentEnemy !== 'chickenMutatesSmall') return;
        if (this.enemy.isHurt || this.enemy.isDead) return;
        const hitFrame = 6;
        this.enemy.attackHitbox.active = prevFrame === hitFrame;
    }

    /**
     * Handles dragon attack logic during the animation.
     * @param {number} prevFrame Previous frame index.
     * @returns {void}
     */
    handleDragonAttack(prevFrame) {
        if (this.enemy.currentAnimation !== 'attack') return;
        if (this.enemy.currentEnemy !== 'dragonSmall') return;
        const biteFrame = 1;
        this.enemy.attackHitbox.active = prevFrame === biteFrame;
    }
}