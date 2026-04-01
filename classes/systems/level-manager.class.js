import { Character } from '../entities/character.class.js';
import { FarmLevelSetup } from '../../levels/farm/farm-level-setup.class.js';
import { FarmLevelController } from '../../levels/farm/farm-level-controller.class.js';
import { StableLevelSetup } from '../../levels/stable/stable-level-setup.class.js';
import { StableLevelController } from '../../levels/stable/stable-level-controller.class.js';
import { TownLevelSetup } from '../../levels/town/town-level-setup.class.js';
import { TownLevelController } from '../../levels/town/town-level-controller.class.js';
import { NayelisHouseLevelSetup } from '../../levels/nayelis-house/nayelis-house-level-setup.class.js';
import { NayelisHouseLevelController } from '../../levels/nayelis-house/nayelis-house-level-controller.class.js';
import { NewWeaponLevelSetup } from '../../levels/new-weapon/new-weapon-level-setup.class.js';
import { NewWeaponLevelController } from '../../levels/new-weapon/new-weapon-level-controller.class.js';
import { LevelCompleteSetup } from '../../levels/level-complete/level-complete-setup.class.js';
import { LevelCompleteController } from '../../levels/level-complete/level-complete-controller.class.js';
import { EndCreditsSetup } from '../../levels/end-credits/end-credits-setup.class.js';
import { EndCreditsController } from '../../levels/end-credits/end-credits-controller.class.js';

/**
 * Manages level state and transitions.
 */
export class LevelManager {
    /**
     * Creates a new instance.
     * @param {Object} world World instance.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Initializes available levels.
     */
    initLevels() {
        const world = this.world;
        world.farmLevelSetup = new FarmLevelSetup(world);
        world.farmLevelController = new FarmLevelController(world.farmLevelSetup);
        world.stableLevelSetup = new StableLevelSetup(world);
        world.stableLevelController = new StableLevelController(world.stableLevelSetup);
    }

    /**
     * Initializes remaining level setups.
     */
    initRemainingSetups() {
        const world = this.world;
        world.townLevelSetup = new TownLevelSetup(world);
        world.townLevelController = new TownLevelController(world.townLevelSetup);
        world.nayelisHouseLevelSetup = new NayelisHouseLevelSetup(world);
        world.nayelisHouseLevelController = new NayelisHouseLevelController(world.nayelisHouseLevelSetup);
        world.newWeaponLevelSetup = new NewWeaponLevelSetup(world);
        world.newWeaponLevelController = new NewWeaponLevelController(world.newWeaponLevelSetup);
        world.levelCompleteSetup = new LevelCompleteSetup(world);
        world.levelCompleteController = new LevelCompleteController(world.levelCompleteSetup);
        world.endCreditsSetup = new EndCreditsSetup(world);
        world.endCreditsController = new EndCreditsController(world.endCreditsSetup);
    }

    /**
     * Restarts the specified level.
     * @param {string} levelName Level identifier.
     */
    restartLevel(levelName) {
        const world = this.world;
        this.stop();
        this.fadeOutLevelCompleteMusic();
        this.cleanupCharacter();
        this.resetGlobalState();
        this.createNewCharacter();
        this.initLevelForRestart(levelName);
        world.currentScene = levelName;
        this.hideLevelCompleteUI();
        this.startLoop();
    }

    /**
     * Fades out the level complete music if available.
     */
    fadeOutLevelCompleteMusic() {
        const world = this.world;
        const music = world.levelCompleteSetup?.sounds?.levelCompleteMusic;
        const audioManager = world.audioManager;
        if (!music || !audioManager) return;
        if (typeof audioManager.fadeOutAudio === 'function') {
            audioManager.fadeOutAudio(music);
        }
    }

    /**
     * Cleans up the current character instance.
     */
    cleanupCharacter() {
        const world = this.world;
        if (!world.character) return;
        world.character = null;
    }

    /**
     * Resets global world state.
     */
    resetGlobalState() {
        const world = this.world;
        world.paused = false;
        world.isRunning = true;
        world.isKeysStopp = false;
        world.camera_x = 0;
        world.lastTime = performance.now();
    }

    /**
     * Creates and initializes a new character instance.
     */
    createNewCharacter() {
        const world = this.world;
        world.character = new Character(world.characterImages, this.world, this.world.audioManager);
    }

    /**
     * Initializes a level for restart based on its identifier.
     * @param {string} levelName Level identifier.
     */
    initLevelForRestart(levelName) {
        const map = {
            farmLevel: () => this.initFarmLevelRestart(),
            stableLevel: () => this.initStableLevelRestart(),
            townLevel: () => this.initTownLevelRestart(),
            nayelisHouseLevel: () => this.initNayelisHouseLevelRestart(),
            newWeaponLevel: () => this.initNewWeaponLevelRestart(),
            levelComplete: () => this.initLevelCompleteRestart(),
            endCredits: () => this.initEndCreditsRestart()
        };
        const initFn = map[levelName];
        if (initFn) initFn();
    }

    /**
     * Initializes the farm level for restart.
     */
    initFarmLevelRestart() {
        const world = this.world;
        world.farmLevelSetup = new FarmLevelSetup(world);
        world.farmLevelController = new FarmLevelController(world.farmLevelSetup);
    }

    /**
     * Initializes the stable level for restart.
     */
    initStableLevelRestart() {
        const world = this.world;
        world.stableLevelSetup = new StableLevelSetup(world);
        world.stableLevelController = new StableLevelController(world.stableLevelSetup);
    }

    /**
     * Initializes the town level for restart.
     */
    initTownLevelRestart() {
        const world = this.world;
        world.townLevelSetup = new TownLevelSetup(world);
        world.townLevelController = new TownLevelController(world.townLevelSetup);
    }

    /**
     * Initializes Nayeli's house level for restart.
     */
    initNayelisHouseLevelRestart() {
        const world = this.world;
        world.nayelisHouseLevelSetup = new NayelisHouseLevelSetup(world);
        world.nayelisHouseLevelController =
            new NayelisHouseLevelController(world.nayelisHouseLevelSetup);
    }

    /**
     * Initializes the new weapon level for restart.
     */
    initNewWeaponLevelRestart() {
        const world = this.world;
        world.newWeaponLevelSetup = new NewWeaponLevelSetup(world);
        world.newWeaponLevelController =
            new NewWeaponLevelController(world.newWeaponLevelSetup);
    }

    /**
     * Initializes the level complete state for restart.
     */
    initLevelCompleteRestart() {
        const world = this.world;
        world.levelCompleteSetup = new LevelCompleteSetup(world);
        world.levelCompleteController =
            new LevelCompleteController(world.levelCompleteSetup);
    }

    /**
     * Initializes the end credits restart setup and controller.
     */
    initEndCreditsRestart() {
        const world = this.world;
        world.endCreditsSetup = new EndCreditsSetup(world);
        world.endCreditsController =
            new EndCreditsController(world.endCreditsSetup);
    }

    /**
     * Hides the level complete UI.
     */
    hideLevelCompleteUI() {
        const box = document.getElementById('level-complete-actions');
        if (box) box.classList.add('d-none');
    }

    /**
     * Starts the main loop.
     */
    startLoop() {
        const world = this.world;
        world.frameId = requestAnimationFrame(ts => world.draw(ts));
    }

    /**
     * Stops the main loop.
     */
    stop() {
        const world = this.world;
        world.isRunning = false;
        if (world.frameId) {
            cancelAnimationFrame(world.frameId);
            world.frameId = null;
        }
    }
}