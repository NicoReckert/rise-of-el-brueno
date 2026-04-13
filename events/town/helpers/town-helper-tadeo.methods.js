export const townTadeoHelperMethods = {
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
     * Plays the Tadeo dialog 06 sequence.
     * @param {Object} setup Setup object.
     * @returns {void}
     */
    playTadeoDialog06Sequence(setup) {
        townHelper.prepareTadeoDialog06(setup);
        townHelper.startTadeoDialog06(setup);
    },

    /**
     * Prepares dialog 06 for Tadeo.
     * @param {Object} setup Setup object.
     * @returns {void}
     */
    prepareTadeoDialog06(setup) {
        setup.world.character.isFlipped = false;
        setup.world.character.speedX = 5;
        setup.world.character.isMovingLeft = false;
        setup.world.character.isMovingRight = false;
        setup.world.isKeysStopp = true;
        setup.cutsceneIndicator.show({ skippable: false });
    },

    /**
     * Starts dialog 06 for Tadeo.
     * @param {Object} setup Setup object.
     * @returns {void}
     */
    startTadeoDialog06(setup) {
        setup.sounds.voTadeoSpeak06.play();
        setup.dialogManager.startDialog('tadeo:06', setup.world.timestamp, () => {
            townHelper.finishTadeoDialog06(setup);
        });
    },

    /**
     * Finishes dialog 06 for Tadeo.
     * @param {Object} setup Setup object.
     * @returns {void}
     */
    finishTadeoDialog06(setup) {
        setup.characters.tadeo.isFlipped = false;
        setup.world.isKeysStopp = false;
        setup.cutsceneIndicator.hide();
        setup.characters.tadeo.updateAnimationState('walk');
        setup.world.townLevelController.questManager.advance(14);
    },

    /**
     * Plays the Tadeo dialog 07 sequence.
     * @param {Object} setup Setup object.
     * @returns {void}
     */
    playTadeoDialog07Sequence(setup) {
        townHelper.prepareTadeoDialog07(setup);
        townHelper.startTadeoDialog07(setup);
    },

    /**
     * Prepares dialog 07 for Tadeo.
     * @param {Object} setup Setup object.
     * @returns {void}
     */
    prepareTadeoDialog07(setup) {
        setup.world.level_start_x = 22300;
        setup.world.camera_start_x = 22100;
        setup.world.character.isMovingLeft = false;
        setup.world.character.isMovingRight = false;
        setup.world.isKeysStopp = true;
        setup.cutsceneIndicator.show({ skippable: false });
    },

    /**
     * Starts dialog 07 for Tadeo.
     * @param {Object} setup Setup object.
     * @returns {void}
     */
    startTadeoDialog07(setup) {
        setup.characters.tadeo.updateAnimationState('idle');
        setup.characters.tadeo.isFlipped = true;
        setup.sounds.voTadeoSpeak07.play();
        setup.dialogManager.startDialog('tadeo:07', setup.world.timestamp, () => {
            townHelper.finishTadeoDialog07(setup);
        });
    },

    /**
     * Finishes dialog 07 for Tadeo.
     * @param {Object} setup Setup object.
     * @returns {void}
     */
    finishTadeoDialog07(setup) {
        setup.world.isKeysStopp = false;
        setup.cutsceneIndicator.hide();
        setup.world.townLevelController.questManager.advance(16);
    }
};