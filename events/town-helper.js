export const townHelper = {
    /**
     * Starts the Nayeli spirit cutscene and advances the quest.
     * @param {Object} setup Setup context object.
     */
    startNayeliSpiritCutscene(setup) {
        townHelper.prepareNayeliSpiritCutscene(setup);
        townHelper.startNayeliSpiritAudio(setup);
        townHelper.startNayeliSpiritVisuals(setup);
        setup.world.townLevelController.questManager.advance(7);
    },

    /**
     * Prepares the world and character state for the Nayeli spirit cutscene.
     * @param {Object} setup Setup context object.
     */
    prepareNayeliSpiritCutscene(setup) {
        setup.characters.tadeo.updateAnimationState('walk');
        setup.world.character.isCollapse = true;
        setup.world.character.isMovingLeft = false;
        setup.world.character.isMovingRight = false;
        setup.world.isKeysStopp = true;
        setup.cutsceneIndicator.show({ skippable: false });
    },

    /**
     * Starts the audio sequence for the Nayeli spirit cutscene.
     * @param {Object} setup Setup context object.
     */
    startNayeliSpiritAudio(setup) {
        setup.world.audioManager.fadeOutAudio(setup.sounds.airHitStunMusic, 1000);
        setup.sounds.nayeliThemeMusic.loop = true;
        setup.world.audioManager.fadeInAudio(setup.sounds.nayeliThemeMusic, 2000, 0.3);
        setup.sounds.spiritAppearsSfx.play();
    },

    /**
     * Starts the visual sequence for the Nayeli spirit cutscene.
     * @param {Object} setup Setup context object.
     */
    startNayeliSpiritVisuals(setup) {
        setup.environment.nayeliSpirit.fadeIn(setup.world.timestamp, 2000);
        setup.environment.nayeliSpirit.updateAnimationState('walk', 1000 / 10);
    },

    /**
     * Checks whether Tadeo should trigger a warning based on enemy proximity.
     * @param {Object} setup Setup context object.
     * @returns {boolean} True if the warning should trigger, otherwise false.
     */
    shouldTriggerTadeoWarning(setup) {
        const char = setup.world.character;
        const tadeo = setup.characters.tadeo;
        if (!townHelper.canCheckTadeoWarning(setup, char, tadeo)) return false;
        const enemies = setup.townLevel?.enemies ?? [];
        if (townHelper.hasEnemyNearTadeo(tadeo, enemies, 300)) return false;
        return townHelper.hasEnemyNearTadeo(tadeo, enemies, 600);
    },

    /**
     * Checks whether the conditions allow evaluating Tadeo's warning.
     * @param {Object} setup Setup context object.
     * @param {Object} char Character instance.
     * @param {Object} tadeo Tadeo character instance.
     * @returns {boolean} True if the warning check is allowed, otherwise false.
     */
    canCheckTadeoWarning(setup, char, tadeo) {
        if (!char || !tadeo) return false;
        if (setup.state.tadeoHelpGivenEmpty) return false;
        if ((char.throwableBottles ?? 0) > 0) return false;
        if (setup.state.isTadeoPanic) return false;
        return performance.now() >= (setup.state.tadeoSpeechLockUntil ?? 0);
    },

    /**
     * Checks whether any enemy is within a specified range of Tadeo.
     * @param {Object} tadeo Tadeo character instance.
     * @param {Array} enemies List of enemy instances.
     * @param {number} range Distance range to check.
     * @returns {boolean} True if an enemy is within range, otherwise false.
     */
    hasEnemyNearTadeo(tadeo, enemies, range) {
        const tolA = { x: -range, width: -range };
        const tolB = { x: 0, y: 0, width: 0, height: 0 };
        return enemies.some(e => townHelper.isValidTadeoEnemyInRange(tadeo, e, tolA, tolB));
    },

    /**
     * Checks whether an enemy is a valid target within range of Tadeo.
     * @param {Object} tadeo Tadeo character instance.
     * @param {Object} enemy Enemy instance.
     * @param {Object} tolA Collision tolerance for Tadeo.
     * @param {Object} tolB Collision tolerance for the enemy.
     * @returns {boolean} True if the enemy is valid and within range, otherwise false.
     */
    isValidTadeoEnemyInRange(tadeo, enemy, tolA, tolB) {
        return !!enemy &&
            !enemy.isDead &&
            !enemy.isRemoved &&
            tadeo.isColliding(enemy, tolA, tolB);
    },

    /**
     * Triggers Tadeo help.
     * @param {Object} setup Setup data.
     * @returns {void}
     */
    triggerTadeoHelp(setup) {
        const duration = 2800;
        const now = performance.now();
        const ctx = townHelper.getTadeoHelpContext(setup, now, duration);
        townHelper.applyTadeoHelpState(ctx);
        townHelper.giveTadeoHelpBottles(ctx);
        townHelper.playTadeoHelpBottleAudio(ctx.audio);
        townHelper.startTadeoHelpBubble(ctx);
    },

    /**
     * Returns the context for Tadeo help.
     * @param {Object} setup Setup data.
     * @param {number} now Current timestamp.
     * @param {number} duration Duration.
     * @returns {Object} Context data.
     */
    getTadeoHelpContext(setup, now, duration) {
        return {
            setup,
            now,
            duration,
            char: setup.world.character,
            audio: setup.world.audioManager,
            give: 2
        };
    },

    /**
     * Applies Tadeo help state.
     * @param {Object} context Help context.
     * @param {Object} context.setup Setup data.
     * @param {number} context.now Current timestamp.
     * @param {number} context.duration Duration.
     * @returns {void}
     */
    applyTadeoHelpState({ setup, now, duration }) {
        setup.state.tadeoHelpUntil = Math.max(setup.state.tadeoHelpUntil ?? 0, now + duration);
        setup.state.tadeoHelpGivenEmpty = true;
        const lockUntil = now + duration + 600;
        setup.state.tadeoSpeechLockUntil = Math.max(setup.state.tadeoSpeechLockUntil ?? 0, lockUntil);
        setup.state.tadeoPanicUntil = Math.max(setup.state.tadeoPanicUntil ?? 0, lockUntil);
    },

    /**
     * Grants throwable bottles to the character and updates the bottle bar UI.
     * @param {Object} context Help context object.
     * @param {Object} context.char Character instance.
     * @param {Object} context.setup Setup context object.
     * @param {number} context.give Number of bottles to grant.
     */
    giveTadeoHelpBottles({ char, setup, give }) {
        char.throwableBottles = (char.throwableBottles ?? 0) + give;
        const bar = setup.bottleBar;
        if (!bar) return;
        for (let i = 0; i < give; i++) {
            bar.percentage = Math.min((bar.percentage ?? 0) + 20, 100);
            bar.setPercentage(bar.percentage);
        }
    },

    /**
     * Plays the audio sequence for Tadeo giving bottles.
     * @param {Object} audio Audio manager instance.
     */
    playTadeoHelpBottleAudio(audio) {
        audio.playOneShot("bottleClinkSfx", { volume: 0.9 });
        setTimeout(() => audio.playOneShot("bottleClinkSfx", { volume: 0.9 }), 150);
    },

    /**
     * Starts a Tadeo help bubble.
     * @param {Object} context Help context.
     * @param {Object} context.setup Setup data.
     * @param {*} context.audio Audio manager instance.
     * @param {number} context.now Current timestamp.
     * @param {number} context.duration Bubble duration.
     * @returns {void}
     */
    startTadeoHelpBubble({ setup, audio, now, duration }) {
        const bubbles = setup.speechBubblesTadeoHelp;
        const idx = (Math.random() * bubbles.length) | 0;
        setup.state.tadeoHelpIdx = idx;
        setup.dialogManager.playBubble(bubbles[idx], { now, duration });
        audio.playOneShot(`voTadeoHelp0${idx + 1}`, { volume: 0.95 });
    },

    /**
     * Restores the town checkpoint.
     * @param {*} setup Setup object.
     * @returns {void}
     */
    restoreTownCheckpoint(setup) {
        const cp = setup.world.townCheckpoint;
        if (!cp) return;
        const world = setup.world;
        const char = world.character;
        townHelper.restoreTownCheckpointPosition(cp, world, char);
        townHelper.restoreTownCheckpointBars(setup, cp);
        townHelper.restoreTownCheckpointProgressState(setup);
        setup.world.townLevelController.questManager.step = cp.step;
    },

    /**
     * Restores the town checkpoint position.
     * @param {*} cp Checkpoint data.
     * @param {*} world World instance.
     * @param {*} char Character instance.
     * @returns {void}
     */
    restoreTownCheckpointPosition(cp, world, char) {
        char.x = cp.x;
        char.y = cp.y;
        world.camera_x = cp.cameraX;
        world.level_start_x = cp.levelStartX;
        world.camera_start_x = cp.cameraStartX;
        char.energy = cp.energy;
        char.throwableBottles = cp.throwableBottles;
    },

    /**
     * Restores the town checkpoint bars.
     * @param {*} setup Setup object.
     * @param {*} cp Checkpoint data.
     * @returns {void}
     */
    restoreTownCheckpointBars(setup, cp) {
        setup.statusBarCharacter?.setPercentage(cp.energy);
        setup.coinBar?.setPercentage(cp.coinBar);
        setup.bottleBar?.setPercentage(cp.bottleBar);
    },

    /**
     * Restores the town checkpoint progress state.
     * @param {*} setup Setup object.
     * @returns {void}
     */
    restoreTownCheckpointProgressState(setup) {
        const char = setup.world.character;
        setup.sandstormFar.setEnabled(false);
        setup.sandstorm.setEnabled(false);
        setup.sandstormNear.setEnabled(false);
        setup.state.enemyHealth = 2;
        char.isHaveSword = true;
        char.config.initCombatConfig();
        char.speedX = 5;
    },
}