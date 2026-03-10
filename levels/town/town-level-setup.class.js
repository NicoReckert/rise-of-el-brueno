import { createTownLevel } from './town-level.js';
import { createTownSounds } from './town-sounds.js';
import { createTownState } from './town-state.js';
import { createTownSystems } from './town-systems.js';
import { createTownCharacters } from './town-characters.js';
import { createTownEnvironment } from './town-environment.js';
import { createTownUI } from './town-ui.js';
import { registerTownDialogs } from './town-dialogs.js';
import { applyTownRuntime } from './town-runtime.js';

/**
 * Setup class responsible for initializing and managing the town level.
 */
export class TownLevelSetup {
    /**
     * Creates a new TownLevelSetup instance.
     * @param {Object} world World reference containing shared resources.
     */
    constructor(world) {
        this.world = world;
        this.entityImages = this.world.entityImages;
        this.allAudios = this.world.allAudios;
        this.townLevel = createTownLevel({ entityImages: this.world.entityImages, allAudios: this.world.allAudios });
        this.state = createTownState();
        this.init();
        applyTownRuntime(this);
    }

    /**
     * Initializes entities, UI/audio, and systems for the town level.
     * @returns {void}
     */
    init() {
        this.initEntities();
        this.initUIAudio();
        this.initSystems();
    }

    /**
     * Initializes town characters and environment entities.
     * @returns {void}
     */
    initEntities() {
        this.characters = createTownCharacters(this.entityImages, this.allAudios, this.world);
        this.environment = createTownEnvironment(this.entityImages);
    }

    /**
     * Initializes sounds, UI elements, and registers dialogs for the town level.
     * @returns {void}
     */
    initUIAudio() {
        this.sounds = createTownSounds(this.allAudios);
        Object.assign(this, createTownUI(this));
        registerTownDialogs(this);
    }

    /**
     * Initializes and assigns town systems.
     * @returns {void}
     */
    initSystems() {
        Object.assign(this, createTownSystems(this));
    }
}