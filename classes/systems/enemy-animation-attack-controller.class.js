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
    * Handles attack-related animation logic.
    * @param {number} prevFrame Previous frame index.
    * @param {number} frameCount Number of animation frames.
    * @returns {void}
    */
    handleAttackLogic(prevFrame, frameCount) {
        if (!frameCount || frameCount <= 0) return;
        this.handleBigChickenAttack(prevFrame, frameCount);
        this.handleSmallChickenAttack(prevFrame, frameCount);
        this.handleDragonAttack(prevFrame, frameCount);
    }

    /**
    * Handles big chicken attack logic during the animation.
    * @param {number} prevFrame Previous frame index.
    * @param {number} frameCount Number of animation frames.
    * @returns {void}
    */
    handleBigChickenAttack(prevFrame, frameCount) {
        if (!this.shouldProcessBigChickenAttack()) return;
        const shootFrame = 8;
        if (this.shouldShootNow(prevFrame, shootFrame)) {
            this.fireBigChickenProjectile();
        }
        if (this.enemy.frameIndex < frameCount) return;
        this.resetBigChickenAttackState();
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
        const audio = e.allAudios.fireballShotSound.cloneNode();
        audio.play();
        e.combatCtrl.shootProjectile("fireball");
        e.hasFiredThisAttack = true;
    }

    /**
    * Resets the big chicken attack state.
    * @returns {void}
    */
    resetBigChickenAttackState() {
        this.enemy.hasFiredThisAttack = false;
        this.enemy.isAttack = false;
        this.enemy.frameIndex = 0;
    }

    /**
    * Handles small chicken attack logic during the animation.
    * @param {number} prevFrame Previous frame index.
    * @param {number} frameCount Number of animation frames.
    * @returns {void}
    */
    handleSmallChickenAttack(prevFrame, frameCount) {
        if (!this.enemy.isAttack || this.enemy.currentEnemy !== 'chickenMutatesSmall') return;
        if (this.enemy.isHurt || this.enemy.isDead) return;
        const hitFrame = 6;
        this.enemy.attackHitbox.active = prevFrame === hitFrame;
        if (this.enemy.frameIndex < frameCount) return;
        this.enemy.attackHitbox.active = false;
        this.enemy.isAttack = false;
        this.enemy.frameIndex = 0;
        this.enemy.hasHitPlayerThisAttack = false;
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