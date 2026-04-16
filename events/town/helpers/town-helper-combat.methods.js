import { DamageText } from "../../../classes/ui/damage-text.class.js";

export const townCombatHelperMethods = {
    /**
     * Handles projectile hits on the character.
     * @param {Object} setup Setup object.
     * @returns {void}
     */
    handleProjectileHitsOnCharacter(setup) {
        const char = setup.world.character;
        if (char.isHurt) return;
        setup.state.projectiles.forEach(element => {
            this.handleProjectileHitOnCharacter(setup, char, element);
        });
    },

    /**
     * Handles a projectile hit check on the character.
     * @param {Object} setup Setup object.
     * @param {Object} char Character object.
     * @param {Object} element Projectile object.
     * @returns {void}
     */
    handleProjectileHitOnCharacter(setup, char, element) {
        if (!element.isActive) return;
        if (element.currentAnimation === "explode") return;
        const colliding = element.isColliding(
            char, { x: 0, width: 0 }, { x: 50, width: 50 }
        );
        if (colliding) this.applyProjectileHitToCharacter(setup, char, element);
    },

    /**
     * Applies a projectile hit to the character.
     * @param {Object} setup Setup object.
     * @param {Object} char Character object.
     * @param {Object} element Projectile object.
     * @returns {void}
     */
    applyProjectileHitToCharacter(setup, char, element) {
        const dmg = char.isProtect ? 2 : 10;
        element.isActive = false;
        element.explode();
        char.combatCtrl.hit(setup.world.timestamp, dmg);
        setup.statusBarCharacter.setPercentage(char.energy);
        setup.state.damageTexts.push(new DamageText(char, dmg));
    },

    /**
     * Handles enemy touch interaction with the character.
     * @param {Object} setup Setup object.
     * @param {Object} char Character object.
     * @param {Object} enemy Enemy object.
     * @param {number} now Current timestamp.
     * @returns {void}
     */
    handleEnemyTouchDamage(setup) {
        const char = setup.world.character;
        const now = setup.world.timestamp;
        if (char.isHurt) return;
        setup.townLevel.enemies.forEach(enemy => {
            this.handleEnemyTouch(setup, char, enemy, now);
        });
        this.handleEndbossTouchDamage(setup, char, now);
    },

    /**
     * Handles enemy touch interaction with the character.
     * @param {Object} setup Setup object.
     * @param {Object} char Character object.
     * @param {Object} enemy Enemy object.
     * @param {number} now Current timestamp.
     * @returns {void}
     */
    handleEnemyTouch(setup, char, enemy, now) {
        if (enemy.isDead) return;
        const effectiveColliding = this.getEffectiveEnemyTouchCollision(
            setup, char, enemy, now
        );
        const did = this.applyEnemyTouchDamage(char, enemy, now, effectiveColliding);
        if (did) this.updateEnemyTouchDamageUI(setup, char);
    },

    /**
     * Handles endboss touch damage on the character.
     * @param {Object} setup Setup object.
     * @param {Object} char Character object.
     * @param {number} now Current timestamp.
     * @returns {void}
     */
    handleEndbossTouchDamage(setup, char, now) {
        const boss = setup.characters.endboss;
        if (!boss || boss.isDead || !boss.isVulnerable) return;
        const effectiveColliding = this.getEffectiveEnemyTouchCollision(setup, char, boss, now);
        const did = this.applyEnemyTouchDamage(char, boss, now, effectiveColliding);
        if (did) this.updateEnemyTouchDamageUI(setup, char);
    },

    /**
     * Gets whether enemy touch damage should be applied.
     * @param {Object} setup Setup object.
     * @param {Object} char Character object.
     * @param {Object} enemy Enemy object.
     * @param {number} now Current timestamp.
     * @returns {boolean} True if enemy touch damage should be applied, otherwise false.
     */
    getEffectiveEnemyTouchCollision(setup, char, enemy, now) {
        const IMMUNITY_DURATION = 500;
        const attackImmunity = (now - setup.world.attackCommitUntil) < IMMUNITY_DURATION;
        const colliding = enemy.isColliding(char);
        return colliding
            && enemy.currentEnemy !== 'dragonSmall'
            && !char.isJumping && !attackImmunity && !char.isAttack
            && !char.isProtect && !enemy.isHurt && !enemy.isDead;
    },

    /**
     * Applies enemy touch damage.
     * @param {Object} char Character object.
     * @param {Object} enemy Enemy object.
     * @param {number} now Current timestamp.
     * @param {boolean} effectiveColliding Whether enemy touch damage should be applied.
     * @returns {boolean} True if damage was applied, otherwise false.
     */
    applyEnemyTouchDamage(char, enemy, now, effectiveColliding) {
        return char.combatCtrl.handleEnemyTouch(enemy, effectiveColliding, now, {
            dmg: char.isProtect ? 2 : 10,
            knockX: 26,
            knockY: 16
        });
    },

    /**
     * Updates the enemy touch damage UI.
     * @param {Object} setup Setup object.
     * @param {Object} char Character object.
     * @returns {void}
     */
    updateEnemyTouchDamageUI(setup, char) {
        setup.statusBarCharacter.setPercentage(char.energy);
        setup.state.damageTexts.push(
            new DamageText(char, char.isProtect ? 2 : 10)
        );
    },

    /**
     * Applies a melee hit to the endboss.
     * @param {Object} setup Setup object.
     * @param {Object} boss Endboss object.
     * @returns {boolean} True if the melee hit was applied, otherwise false.
     */
    applyMeleeHitToEndboss(setup, boss) {
        if (!boss || boss.isDead || !boss.isVulnerable) return false;
        this.playBossHurtSound(setup, boss);
        this.prepareMeleeHitToEndboss(setup, boss);
        if (boss.energy <= 0) return this.finishMeleeHitToEndboss(boss);
        boss.combatCtrl.handleGroundHit();
        return true;
    },

    /**
     * Prepares a melee hit on the endboss.
     * @param {Object} setup Setup object.
     * @param {Object} boss Endboss object.
     * @returns {void}
     */
    prepareMeleeHitToEndboss(setup, boss) {
        boss.isHurt = true;
        boss.frameIndex = 0;
        boss.sheetIndex = 0;
        boss.animationFinished = false;
        boss.lastFrameTime = null;
        boss.energy = Math.max(0, boss.energy - 5);
        setup.statusBarEndboss.setPercentage(boss.energy);
    },

    /**
     * Finishes a melee hit on the endboss.
     * @param {Object} boss Endboss object.
     * @returns {boolean} True.
     */
    finishMeleeHitToEndboss(boss) {
        boss.isDead = true;
        boss.frameIndex = 0;
        return true;
    },

    /**
     * Plays the boss hurt sound.
     * @param {Object} setup Setup object.
     * @param {Object} boss Endboss object.
     * @returns {void}
     */
    playBossHurtSound(setup, boss) {
        const now = setup.world.timestamp ?? performance.now();
        const last = boss.lastHurtSoundTime ?? 0;
        const cooldown = boss.hurtSoundCooldown ?? 250;
        if (now - last < cooldown) return;
        boss.lastHurtSoundTime = now;
        setup.world.audioManager.playOneShot('bossHurtSfx', { volume: 0.6 });
    }
};