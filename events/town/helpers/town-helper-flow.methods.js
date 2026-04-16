import { TaskWindow } from "../../../classes/ui/task-window.class.js";

export const townFlowHelperMethods = {
    /**
     * Starts the Nayeli spirit cutscene and advances the quest.
     * @param {Object} setup Setup context object.
     */
    startNayeliSpiritCutscene(setup) {
        this.prepareNayeliSpiritCutscene(setup);
        this.startNayeliSpiritAudio(setup);
        this.startNayeliSpiritVisuals(setup);
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
     * Initializes the town quest state.
     * @param {Object} setup Setup object.
     * @returns {void}
     */
    initializeTownQuest(setup) {
        this.setupTownAudio(setup);
        this.setupTownWorldState(setup);
        this.setupTownCharacterState(setup);
        this.setupTownUIState(setup);
        if (setup.world.resumeFromTownCheckpoint && setup.world.townCheckpoint) {
            this.restoreTownCheckpoint(setup);
            setup.world.resumeFromTownCheckpoint = false;
            return;
        }
    },

    /**
     * Sets up the town audio state.
     * @param {Object} setup Setup object.
     * @returns {void}
     */
    setupTownAudio(setup) {
        setup.sounds.townDayMusic.loop = true;
        setup.world.audioManager.fadeInAudio(setup.sounds.townDayMusic, 2000, 0.5);
    },

    /**
     * Sets up the town world state.
     * @param {Object} setup Setup object.
     * @returns {void}
     */
    setupTownWorldState(setup) {
        const fromHouse = setup.state.comeFromNayelisHouse;
        setup.world.character.x = fromHouse ? 20265 : 100;
        setup.world.level_start_x = fromHouse ? 20265 : 0;
        setup.world.level_end_x = 29000;
        setup.world.camera_start_x = 0;
        setup.world.camera_x = fromHouse ? 20015 : 0;
    },

    /**
     * Sets up the town character state.
     * @param {Object} setup Setup object.
     * @returns {void}
     */
    setupTownCharacterState(setup) {
        setup.world.character.isWalkDetermined = false;
        setup.characters.tadeo.updateAnimationState('idle', 1000 / 5);
        setup.world.character.speedX = 3;
        if (!setup.state.comeFromNayelisHouse && !setup.world.resumeFromTownCheckpoint) {
            setup.world.initTasks();
        }
    },

    /**
     * Sets up the town UI state.
     * @param {Object} setup Setup object.
     * @returns {void}
     */
    setupTownUIState(setup) {
        setup.world.taskWindow.y = 180;
        if (setup.state.comeFromNayelisHouse) {
            setup.hints[0].hide();
        }
        setup.state.comeFromNayelisHouse = false;
        setup.cutsceneIndicator.hide({ silent: true, immediate: true });
    },

    /**
     * Plays the town heal sequence.
     * @param {Object} setup Setup object.
     * @returns {void}
     */
    playTownHealSequence(setup) {
        this.prepareTownHealSequence(setup);
        this.applyTownHealEffects(setup);
        this.storeTownHealCheckpoint(setup);
        setup.world.townLevelController.questManager.advance(20);
    },

    /**
     * Prepares the town heal sequence.
     * @param {Object} setup Setup object.
     * @returns {void}
     */
    prepareTownHealSequence(setup) {
        setup.world.levelStartX = 26300;
        setup.world.cameraStartX = 26100;
        setup.world.character.isFlipped = false;
        setup.world.character.isMovingLeft = false;
        setup.world.character.isMovingRight = false;
        setup.world.isKeysStopp = true;
        setup.cutsceneIndicator.show({ skippable: false });
    },

    /**
     * Applies the town heal effects.
     * @param {Object} setup Setup object.
     * @returns {void}
     */
    applyTownHealEffects(setup) {
        setup.world.character.isHealing = true;
        setup.world.audioManager.playOneShot('healSfx');
        setup.world.character.energy = 100;
        setup.statusBarCharacter.setPercentage(setup.world.character.energy);
        setup.bottleBar.setPercentage(100);
        setup.world.character.throwableBottles = 5;
        setup.world.audioManager.playOneShot('bottleClinkSfx');
    },

    /**
     * Stores the town heal checkpoint.
     * @param {Object} setup Setup object.
     * @returns {void}
     */
    storeTownHealCheckpoint(setup) {
        if (!setup.world.townCheckpoint) {
            const char = setup.world.character;
            setup.world.townCheckpoint = this.createTownHealCheckpoint(setup, char);
        }
    },

    /**
     * Creates the town heal checkpoint data.
     * @param {Object} setup Setup object.
     * @param {Object} char Character object.
     * @returns {Object} Town heal checkpoint data.
     */
    createTownHealCheckpoint(setup, char) {
        return {
            ...this.createTownHealCheckpointBase(setup, char),
            ...this.createTownHealCheckpointBars(setup, char),
            tasks: this.createTownHealCheckpointTasks(setup)
        };
    },

    /**
     * Creates the base town heal checkpoint data.
     * @param {Object} setup Setup object.
     * @param {Object} char Character object.
     * @returns {Object} Base town heal checkpoint data.
     */
    createTownHealCheckpointBase(setup, char) {
        return {
            id: 'town_heal_step_19',
            step: 20,
            x: char.x,
            y: char.y,
            cameraX: setup.world.camera_x,
            levelStartX: 26300,
            cameraStartX: 26100
        };
    },

    /**
     * Creates the town heal checkpoint bar data.
     * @param {Object} setup Setup object.
     * @param {Object} char Character object.
     * @returns {Object} Town heal checkpoint bar data.
     */
    createTownHealCheckpointBars(setup, char) {
        return {
            energy: char.energy,
            throwableBottles: char.throwableBottles ?? 0,
            coinBar: setup.coinBar?.percentage ?? 0,
            bottleBar: setup.bottleBar?.percentage ?? 0
        };
    },

    /**
     * Creates the town heal checkpoint task data.
     * @param {Object} setup Setup object.
     * @returns {Object[]} Town heal checkpoint task data.
     */
    createTownHealCheckpointTasks(setup) {
        return setup.world.taskWindow?.tasks.map(task => ({ ...task })) ?? [];
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
        this.restoreTownCheckpointPosition(cp, world, char);
        this.restoreTownCheckpointBars(setup, cp);
        this.restoreTownCheckpointTasks(setup, cp);
        this.restoreTownCheckpointProgressState(setup);
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
     * Restores the town checkpoint tasks.
     * @param {Object} setup Setup object.
     * @param {Object} cp Checkpoint data.
     * @returns {void}
     */
    restoreTownCheckpointTasks(setup, cp) {
        const tasks = cp.tasks ?? [];
        const texts = tasks.map(task => task.text);
        setup.world.taskWindow = new TaskWindow(
            setup.world.canvas,
            setup.world.entityImages,
            texts
        );
        setup.world.taskWindow.tasks = tasks.map(task => ({ ...task }));
        setup.world.taskWindow.y = 180;
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

    /**
     * Clears the town combat state.
     * @param {Object} setup Setup object.
     * @returns {void}
     */
    clearTownCombatState(setup) {
        const now = setup.world.timestamp;
        this.clearTownEnemies(setup, now);
        this.clearTownProjectiles(setup);
    },

    /**
     * Clears all town enemies.
     * @param {Object} setup Setup object.
     * @param {number} now Current timestamp.
     * @returns {void}
     */
    clearTownEnemies(setup, now) {
        setup.townLevel.enemies.forEach(enemy => {
            this.clearTownEnemy(enemy, now);
        });
    },

    /**
     * Clears a town enemy.
     * @param {Object} enemy Enemy object.
     * @param {number} now Current timestamp.
     * @returns {void}
     */
    clearTownEnemy(enemy, now) {
        if (!enemy || enemy.isDead || enemy.isRemoved) return;
        enemy.isDead = true;
        enemy.isHurt = false;
        enemy.isMovingLeft = false;
        enemy.isMovingRight = false;
        enemy.hasHitPlayerThisAttack = true;
        enemy.removeAt = now + 2000;
    },

    /**
     * Clears all town projectiles.
     * @param {Object} setup Setup object.
     * @returns {void}
     */
    clearTownProjectiles(setup) {
        setup.state.projectiles.forEach(projectile => {
            if (!projectile) return;
            projectile.isActive = false;
            projectile.markedForRemoval = true;
        });
    },
};