export const townBottleHitHelperMethods = {
    /**
     * Handles bottle hits on enemies.
     * @param {Object} setup Setup object.
     * @returns {void}
     */
    handleBottleHitsOnEnemies(setup) {
        const world = setup.world;
        const bottles = setup.state.throwableObjects;
        const enemies = setup.townLevel.enemies;
        for (let i = bottles.length - 1; i >= 0; i--) {
            townHelper.handleBottleHitsForBottle(setup, world, bottles[i], enemies);
        }
    },

    /**
     * Handles bottle hit checks for a bottle against enemies.
     * @param {Object} setup Setup object.
     * @param {Object} world World object.
     * @param {Object} bottle Bottle object.
     * @param {Object[]} enemies Enemy list.
     * @returns {void}
     */
    handleBottleHitsForBottle(setup, world, bottle, enemies) {
        if (townHelper.shouldSkipBottleHitCheck(bottle)) return;
        for (let j = 0; j < enemies.length; j++) {
            const shouldBreak = townHelper.handleBottleHitOnEnemy(setup, world, bottle, enemies[j]);
            if (shouldBreak) break;
        }
    },

    /**
     * Checks whether bottle hit detection should be skipped.
     * @param {Object} bottle Bottle object.
     * @returns {boolean} True if bottle hit detection should be skipped, otherwise false.
     */
    shouldSkipBottleHitCheck(bottle) {
        return bottle.isBroken || bottle.markedForRemoval || bottle.isBrokenAnimation;
    },

    /**
     * Handles a bottle hit check against an enemy.
     * @param {Object} setup Setup object.
     * @param {Object} world World object.
     * @param {Object} bottle Bottle object.
     * @param {Object} enemy Enemy object.
     * @returns {boolean} True if processing for this bottle should stop, otherwise false.
     */
    handleBottleHitOnEnemy(setup, world, bottle, enemy) {
        if (enemy.currentEnemy === "dragonSmall") return false;
        if (enemy.isDead) return false;
        const hit = bottle.isColliding(enemy, {}, { y: 50 });
        if (!hit) return false;
        if (bottle.isBrokenSound) return true;
        townHelper.breakBottleAndKillEnemy(setup, world, bottle, enemy);
        return true;
    },

    /**
     * Breaks a bottle and kills an enemy.
     * @param {Object} setup Setup object.
     * @param {Object} world World object.
     * @param {Object} bottle Bottle object.
     * @param {Object} enemy Enemy object.
     * @returns {void}
     */
    breakBottleAndKillEnemy(setup, world, bottle, enemy) {
        world.audioManager.playOneShot("bottleBreakSfx", { volume: 0.6 });
        bottle.isBrokenSound = true;
        bottle.isBroken = true;
        bottle.isThrow = false;
        bottle.isGravity = false;
        bottle.isBrokenAnimation = true;
        enemy.isDead = true;
        enemy.isMovingLeft = false;
        enemy.isMovingRight = false;
        enemy.removeAt = setup.world.timestamp + 2000;
        world.audioManager.playOneShot("chickenDeathSfx", { volume: 0.6 });
    },

    /**
     * Handles bottle hits on the endboss.
     * @param {Object} setup Setup object.
     * @returns {void}
     */
    handleBottleHitsOnEndboss(setup) {
        const world = setup.world;
        const boss = setup.characters.endboss;
        const bottles = setup.state.throwableObjects;
        if (!boss) return;
        for (let i = bottles.length - 1; i >= 0; i--) {
            townHelper.handleBottleHitOnEndboss(setup, world, boss, bottles[i]);
        }
    },

    /**
     * Handles a bottle hit check on the endboss.
     * @param {Object} setup Setup object.
     * @param {Object} world World object.
     * @param {Object} boss Endboss object.
     * @param {Object} bottle Bottle object.
     * @returns {void}
     */
    handleBottleHitOnEndboss(setup, world, boss, bottle) {
        if (townHelper.shouldSkipEndbossBottleHit(bottle, boss)) return;
        const hit = bottle.isColliding(boss, {}, { x: 50 });
        if (!hit) return;
        if (bottle.isBrokenSound) return;
        townHelper.applyBottleHitToEndboss(setup, world, boss, bottle);
    },

    /**
     * Checks whether a bottle hit on the endboss should be skipped.
     * @param {Object} bottle Bottle object.
     * @param {Object} boss Endboss object.
     * @returns {boolean} True if the bottle hit should be skipped, otherwise false.
     */
    shouldSkipEndbossBottleHit(bottle, boss) {
        return bottle.isBroken
            || bottle.markedForRemoval
            || bottle.isBrokenAnimation
            || boss.isDead;
    },

    /**
     * Applies a bottle hit to the endboss.
     * @param {Object} setup Setup object.
     * @param {Object} world World object.
     * @param {Object} boss Endboss object.
     * @param {Object} bottle Bottle object.
     * @returns {void}
     */
    applyBottleHitToEndboss(setup, world, boss, bottle) {
        world.audioManager.playOneShot("bottleBreakSfx", { volume: 0.6 });
        boss.isHurt = true;
        boss.frameIndex = 0;
        bottle.isBrokenSound = true;
        bottle.isBroken = true;
        bottle.isThrow = false;
        bottle.isGravity = false;
        bottle.isBrokenAnimation = true;
        townHelper.updateEndbossAfterBottleHit(setup, boss);
    },

    /**
     * Updates the endboss state after a bottle hit.
     * @param {Object} setup Setup object.
     * @param {Object} boss Endboss object.
     * @returns {void}
     */
    updateEndbossAfterBottleHit(setup, boss) {
        boss.energy -= 20;
        setup.statusBarEndboss.setPercentage(boss.energy);
        if (boss.energy <= 0) {
            boss.isDead = true;
            boss.frameIndex = 0;
        }
    },

    /**
     * Handles bottle ground impacts.
     * @param {Object} setup Setup object.
     * @returns {void}
     */
    handleBottleGroundImpact(setup) {
        const world = setup.world;
        const bottles = setup.state.throwableObjects;
        const groundBottomY = 680;
        for (let i = bottles.length - 1; i >= 0; i--) {
            townHelper.handleSingleBottleGroundImpact(world, bottles[i], groundBottomY);
        }
    },

    /**
     * Handles a single bottle ground impact.
     * @param {Object} world World object.
     * @param {Object} bottle Bottle object.
     * @param {number} groundBottomY Ground bottom Y position.
     * @returns {void}
     */
    handleSingleBottleGroundImpact(world, bottle, groundBottomY) {
        if (bottle.markedForRemoval) return;
        const footY = bottle.y + bottle.height - (bottle.offset?.bottom ?? 0);
        if (footY < groundBottomY) return;
        bottle.y = groundBottomY - bottle.height + (bottle.offset?.bottom ?? 0);
        if (!bottle.isBrokenSound) townHelper.breakBottleOnGround(world, bottle);
    },

    /**
     * Breaks a bottle on the ground.
     * @param {Object} world World object.
     * @param {Object} bottle Bottle object.
     * @returns {void}
     */
    breakBottleOnGround(world, bottle) {
        world.audioManager.playOneShot("bottleBreakSfx", { volume: 0.6 });
        bottle.isBrokenSound = true;
        bottle.isBroken = true;
        bottle.isThrow = false;
        bottle.isGravity = false;
        bottle.isBrokenAnimation = true;
        bottle.isMovingLeft = false;
        bottle.isMovingRight = false;
    }
};