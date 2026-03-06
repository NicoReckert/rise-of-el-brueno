import { Projectile } from "../entities/projectile.class.js";

/**
* Controls combat behavior for an enemy.
*/
export class EnemyCombatController {
    /**
    * Creates a new instance.
    * @param {object} enemy Enemy instance.
    */
    constructor(enemy) {
        this.enemy = enemy;
    }

    /**
    * Shoots a projectile of the given type.
    * @param {string} type Projectile type.
    * @returns {void}
    */
    shootProjectile(type) {
        const direction = this.enemy.isFlipped;
        const setup = this.enemy.world.townLevelSetup;
        const projectile = this.createProjectileForType(type, direction);
        this.ensureProjectileArray(setup);
        setup.townLevel.projectiles.push(projectile);
    }

    /**
    * Creates a projectile instance for the given type and direction.
    * @param {string} type Projectile type.
    * @param {boolean} direction Projectile direction.
    * @returns {Projectile} Projectile instance.
    */
    createProjectileForType(type, direction) {
        const offsetX = direction ? this.enemy.width - 25 : -45;
        const offsetY = this.enemy.y + this.enemy.height * 0.22;
        return new Projectile(
            this.enemy.entityImages,
            type,
            this.enemy.x + offsetX,
            offsetY,
            direction
        );
    }

    /**
    * Ensures the projectile array exists in the setup.
    * @param {object} setup Level setup object.
    * @returns {void}
    */
    ensureProjectileArray(setup) {
        if (!setup.townLevel.projectiles) {
            setup.townLevel.projectiles = [];
        }
    }

    /**
    * Tries to start an attack if the enemy can attack.
    * @param {number} timestamp Frame timestamp.
    * @returns {boolean} True if the attack was started, otherwise false.
    */
    tryStartAttack(timestamp) {
        if (this.enemy.isDead || this.enemy.isHurt) return false;
        if (this.enemy.isAttack) return false;
        if (timestamp - this.enemy.lastAttackTime < this.enemy.attackCooldownMs) return false;
        this.enemy.isAttack = true;
        this.enemy.lastAttackTime = timestamp;
        this.enemy.frameIndex = 0;
        this.enemy.lastFrameTime = 0;
        this.enemy.hasFiredThisAttack = false;
        return true;
    }

    /**
    * Applies a hit to the enemy.
    * @param {number} timestamp Frame timestamp.
    * @param {object} [opts={}] Hit options.
    * @returns {boolean} True if the hit was applied, otherwise false.
    */
    receiveHit(timestamp, opts = {}) {
        const { dmg = 1, attackerFlipped = false, knockX = 12, knockY = 12, deathRemoveMs = 2000, onHurtSound = null, onDeathSound = null } = opts;
        if (this.enemy.isDead || this.enemy.isHurt) return false;
        if (!this.checkDragonVulnerable()) return false;
        this.applyHitDamage(dmg);
        this.cancelAttackIfAny();
        this.applyKnockback(attackerFlipped, knockX, knockY);
        this.stopHorizontalMovement();
        const isDead = this.enemy.health <= 0;
        if (isDead) this.handleDeathHit(timestamp, deathRemoveMs, onDeathSound);
        else this.handleHurtHit(onHurtSound);
        return true;
    }

    /**
    * Checks whether the dragon can currently receive damage.
    * @returns {boolean} True if the dragon is vulnerable, otherwise false.
    */
    checkDragonVulnerable() {
        if (this.enemy.currentEnemy !== 'dragonSmall') return true;
        const vulnerableStates = ['dive_fast', 'attack', 'approach_low'];
        if (!vulnerableStates.includes(this.enemy.airState)) return false;
        if (this.enemy.hasBeenHitThisDive) return false;
        this.enemy.hasBeenHitThisDive = true;
        return true;
    }

    /**
    * Applies damage to the enemy.
    * @param {number} dmg Damage amount.
    * @returns {void}
    */
    applyHitDamage(dmg) {
        this.enemy.attackHitbox.active = false;
        this.enemy.hasHitPlayerThisAttack = false;
        this.enemy.health -= dmg;
    }

    /**
    * Cancels the current attack if active.
    * @returns {void}
    */
    cancelAttackIfAny() {
        if (!this.enemy.isAttack) return;
        this.enemy.isAttack = false;
        this.enemy.hasFiredThisAttack = false;
    }

    /**
    * Applies knockback to the enemy.
    * @param {boolean} attackerFlipped Whether the attacker is flipped.
    * @param {number} knockX Horizontal knockback strength.
    * @param {number} knockY Vertical knockback strength.
    * @returns {void}
    */
    applyKnockback(attackerFlipped, knockX, knockY) {
        const dir = attackerFlipped ? -1 : 1;
        this.enemy.speedXKnock = dir * knockX;
        this.enemy.speedY = knockY;
        this.enemy.isGravity = true;
        this.enemy.knockbackActive = true;
    }

    /**
    * Stops horizontal enemy movement.
    * @returns {void}
    */
    stopHorizontalMovement() {
        this.enemy.isMovingLeft = false;
        this.enemy.isMovingRight = false;
    }

    /**
    * Handles enemy death after a hit.
    * @param {number} timestamp Frame timestamp.
    * @param {number} deathRemoveMs Delay before removal in milliseconds.
    * @param {?Function} onDeathSound Callback for the death sound.
    * @returns {void}
    */
    handleDeathHit(timestamp, deathRemoveMs, onDeathSound) {
        this.enemy.isDead = true;
        this.enemy.isHurt = false;
        this.enemy.removeAt = timestamp + deathRemoveMs;
        onDeathSound?.();
        if (this.enemy.currentEnemy !== 'dragonSmall') return;
        this.enemy.deathPhase = 'fall';
        this.enemy.isGravity = false;
        this.enemy.knockbackActive = false;
    }

    /**
    * Handles enemy hurt state after a hit.
    * @param {?Function} onHurtSound Callback for the hurt sound.
    * @returns {void}
    */
    handleHurtHit(onHurtSound) {
        this.enemy.isHurt = true;
        this.enemy.animCtrl.setAnimation('hurt');
        this.enemy.frameIndex = 0;
        this.enemy.lastFrameTime = 0;
        onHurtSound?.();
    }
}