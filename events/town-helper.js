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
        setup.world.townLevelController.stormHazards.enabled = false;
        setup.characters.tadeo.updateAnimationState('walk');
        setup.world.character.isCollapse = true;
        setup.world.character.isMovingLeft = false;
        setup.world.character.isMovingRight = false;
        setup.world.isKeysStopp = true;
    },

    /**
     * Starts the audio sequence for the Nayeli spirit cutscene.
     * @param {Object} setup Setup context object.
     */
    startNayeliSpiritAudio(setup) {
        setup.world.audioManager.fadeOutAudio(setup.sounds.finalStormHazardMusic, 1000);
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
     * Triggers Tadeo's help sequence, including state changes,
     * bottle rewards, audio, and speech bubble display.
     * @param {Object} setup Setup context object.
     */
    triggerTadeoHelp(setup) {
        const now = performance.now();
        const ctx = townHelper.getTadeoHelpContext(setup, now);
        townHelper.applyTadeoHelpState(ctx);
        townHelper.giveTadeoHelpBottles(ctx);
        townHelper.playTadeoHelpBottleAudio(ctx.audio);
        townHelper.startTadeoHelpBubble(ctx);
        setup.world.townLevelController.eventManager.emitNow("tadeoHelpBubbleRender");
    },

    /**
     * Creates the context object for Tadeo's help sequence.
     * @param {Object} setup Setup context object.
     * @param {number} now Current timestamp.
     * @returns {Object} Context data for the help sequence.
     */
    getTadeoHelpContext(setup, now) {
        return {
            setup,
            now,
            char: setup.world.character,
            audio: setup.world.audioManager,
            give: 2
        };
    },

    /**
     * Applies state updates for Tadeo's help sequence.
     * @param {Object} context Help context object.
     * @param {Object} context.setup Setup context object.
     * @param {number} context.now Current timestamp.
     */
    applyTadeoHelpState({ setup, now }) {
        setup.state.tadeoHelpUntil = Math.max(setup.state.tadeoHelpUntil ?? 0, now + 2000);
        setup.state.tadeoHelpGivenEmpty = true;
        const lockUntil = now + 2200;
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
     * Starts a random Tadeo help speech bubble and plays the corresponding audio.
     * @param {Object} context Help context object.
     * @param {Object} context.setup Setup context object.
     * @param {Object} context.audio Audio manager instance.
     */
    startTadeoHelpBubble({ setup, audio }) {
        const bubbles = setup.speechBubblesTadeoHelp;
        const idx = (Math.random() * bubbles.length) | 0;
        setup._tadeoHelpIdx = idx;
        bubbles[idx].start();
        audio.playOneShot(`voTadeoHelp0${idx + 1}`, { volume: 0.95 });
    }
}