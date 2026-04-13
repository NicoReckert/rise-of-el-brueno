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
            townHelper.handleProjectileHitOnCharacter(setup, char, element);
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
        if (colliding) townHelper.applyProjectileHitToCharacter(setup, char, element);
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
     * Handles enemy touch damage on the character.
     * @param {Object} setup Setup object.
     * @returns {void}
     */
    handleEnemyTouchDamage(setup) {
        const char = setup.world.character;
        const now = setup.world.timestamp;
        if (char.isHurt) return;
        setup.townLevel.enemies.forEach(enemy => {
            townHelper.handleEnemyTouch(setup, char, enemy, now);
        });
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
        const effectiveColliding = townHelper.getEffectiveEnemyTouchCollision(
            setup, char, enemy, now
        );
        const did = townHelper.applyEnemyTouchDamage(char, enemy, now, effectiveColliding);
        if (did) townHelper.updateEnemyTouchDamageUI(setup, char);
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
    }
};