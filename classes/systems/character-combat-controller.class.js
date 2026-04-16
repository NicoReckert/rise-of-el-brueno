/**
 * Controls character combat behavior.
 */
export class CharacterCombatController {
    /**
     * Creates a new instance.
     * @param {Object} character Character instance.
     * @param {Object} animationController Animation controller instance.
     */
    constructor(character, animationController) {
        this.char = character;
        this.animCtrl = animationController;
    }

    /**
     * Starts the air hit stun state.
     * @param {number} timestamp Frame timestamp.
     * @param {number} [duration=70000] Duration in milliseconds.
     */
    startAirHitStun(timestamp, duration = 70000) {
        this.char.isAirHitStun = true;
        this.char.airHitStunStart = timestamp;
        this.char.airHitStunDuration = duration;
        this.char.isCapturedByTornado = true;
        this.char.speedY = 0;
        this.char.isJumping = false;
    }

    /**
     * Applies a hit to the character.
     * @param {number} timestamp Frame timestamp.
     * @param {number} [dmg=10] Damage amount.
     */
    hit(timestamp, dmg = 10) {
        if (this.shouldIgnoreHit(timestamp)) return;
        this.applyHitDamage(timestamp, dmg);
    }

    /**
     * Checks whether a hit should be ignored.
     * @param {number} timestamp Frame timestamp.
     * @returns {boolean} True if the hit should be ignored, otherwise false.
     */
    shouldIgnoreHit(timestamp) {
        if (this.char.isDead || this.char.isHurt) return true;
        if (timestamp < this.char.invulnerableUntil) return true;
        return false;
    }

    /**
     * Applies damage and updates hit state.
     * @param {number} timestamp Frame timestamp.
     * @param {number} dmg Damage amount.
     */
    applyHitDamage(timestamp, dmg) {
        this.char.energy = Math.max(0, this.char.energy - dmg);
        this.char.invulnerableUntil = timestamp + 650;
        if (this.char.isProtect) {
            this.animCtrl.setAnimation('protect-loop');
            return;
        }
        if (this.char.isHurt) return;
        this.char.isHurt = true;
        this.char.hurtUntil = timestamp + 450;
        this.animCtrl.setAnimation('hurt');
    }

    /**
     * Handles enemy touch interaction.
     * @param {Object} enemy Enemy instance.
     * @param {boolean} colliding Whether a collision is occurring.
     * @param {number} timestamp Frame timestamp.
     * @param {Object} [options={}] Additional configuration options.
     * @returns {boolean} True if touch damage was applied, otherwise false.
     */
    handleEnemyTouch(enemy, colliding, timestamp, options = {}) {
        const cfg = this.normalizeEnemyTouchOptions(options);
        if (!this.handleEnemyTouchContactState(enemy, colliding)) return false;
        if (!this.canApplyTouchDamage(timestamp)) return false;
        if (this.blockedByDefense(timestamp)) return false;
        this.applyTouchHit(enemy, timestamp, cfg);
        return true;
    }

    /**
     * Normalizes options for enemy touch interaction.
     * @param {Object} [options={}] Touch configuration options.
     * @param {number} [options.dmg=10] Damage amount.
     * @param {number} [options.knockX=70] Horizontal knockback.
     * @param {number} [options.knockY=18] Vertical knockback.
     * @param {number} [options.lockMs=260] Movement lock duration in milliseconds.
     * @returns {{dmg: number, knockX: number, knockY: number, lockMs: number}} Normalized options.
     */
    normalizeEnemyTouchOptions(options = {}) {
        const {
            dmg = 10,
            knockX = 70,
            knockY = 18,
            lockMs = 260
        } = options;
        return { dmg, knockX, knockY, lockMs };
    }

    /**
     * Handles enemy touch contact state tracking.
     * @param {Object} enemy Enemy instance.
     * @param {boolean} colliding Whether a collision is occurring.
     * @returns {boolean} True if this is a new contact, otherwise false.
     */
    handleEnemyTouchContactState(enemy, colliding) {
        if (!colliding) {
            this.char.touchingEnemies.delete(enemy);
            return false;
        }
        if (this.char.touchingEnemies.has(enemy)) return false;
        this.char.touchingEnemies.add(enemy);
        return true;
    }

    /**
     * Checks whether touch damage can be applied.
     * @param {number} timestamp Frame timestamp.
     * @returns {boolean} True if damage can be applied, otherwise false.
     */
    canApplyTouchDamage(timestamp) {
        if (this.char.isDead) return false;
        if (timestamp < this.char.invulnerableUntil) return false;
        return true;
    }

    /**
     * Checks whether touch damage is blocked by defense state.
     * @param {number} timestamp Frame timestamp.
     * @returns {boolean} True if blocked by defense, otherwise false.
     */
    blockedByDefense(timestamp) {
        if (!this.char.isProtect && !this.char.isAttack) return false;
        this.char.invulnerableUntil = timestamp + 250;
        return true;
    }

    /**
     * Applies touch hit effects including damage and knockback.
     * @param {Object} enemy Enemy instance.
     * @param {number} timestamp Frame timestamp.
     * @param {Object} cfg Touch configuration.
     */
    applyTouchHit(enemy, timestamp, cfg) {
        this.hit(timestamp, cfg.dmg);
        const dir = enemy.x < this.char.x ? 1 : -1;
        this.applyKnockback(dir, cfg.knockX);
        this.applyHitJump(cfg.knockY);
        this.lockMovementAfterHit(timestamp, cfg.lockMs);
        this.char.lastGravityUpdate = timestamp;
    }

    /**
     * Applies horizontal knockback to the character.
     * @param {number} dir Direction multiplier.
     * @param {number} knockX Horizontal knockback distance.
     */
    applyKnockback(dir, knockX) {
        this.char.x += dir * knockX;
    }

    /**
     * Applies vertical knockback jump effect.
     * @param {number} knockY Vertical knockback strength.
     */
    applyHitJump(knockY) {
        this.char.isJumping = true;
        this.char.isLanding = false;
        this.char.speedY = Math.max(this.char.speedY, knockY);
    }

    /**
     * Locks character movement after being hit.
     * @param {number} timestamp Frame timestamp.
     * @param {number} lockMs Lock duration in milliseconds.
     */
    lockMovementAfterHit(timestamp, lockMs) {
        this.char.movementLockUntil = timestamp + lockMs;
        this.char.isMovingLeft = false;
        this.char.isMovingRight = false;
        this.char.isAttack = false;
        this.char.isProtect = false;
    }

    /**
     * Updates the attack hitbox based on the selected weapon.
     * @param {string} weapon Weapon identifier.
     */
    updateAttackHitbox(weapon) {
        const cfg = this.getAttackHitboxConfig(weapon);
        if (!cfg) return;
        this.char.attackHitbox = {
            top: cfg.top,
            left: cfg.left,
            right: cfg.right,
            bottom: cfg.bottom,
            active: false
        };
    }

    /**
     * Returns attack hitbox configuration for the given weapon.
     * @param {string} weapon Weapon identifier.
     * @returns {{top: number, left: number, right: number, bottom: number}|undefined} Hitbox configuration.
     */
    getAttackHitboxConfig(weapon) {
        switch (weapon) {
            case 'staff':
                return { top: 220, left: 200, right: 8, bottom: 52 };
            case 'sword':
                return { top: 200, left: 200, right: 8, bottom: 65 };
        }
    }
}