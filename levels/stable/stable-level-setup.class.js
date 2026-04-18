import { AnimatedEntity } from '../../classes/entities/animated-entity.class.js';
import { HollowHint } from '../../classes/ui/hollow-hint.class.js';
import { createStableLevel } from './stable-level.js'
import { stableEvents } from '../../events/stable/stable-level-events.js';
import { CutsceneIndicator } from '../../classes/ui/cutscene-indicator.class.js';
import { getControlById } from '../../config/controls-config.js';

/**
 * Sets up the stable level including characters, environment, sounds, and UI elements.
 */
export class StableLevelSetup {
    /**
     * Creates a new stable level setup instance.
     * @param {Object} world World reference.
     */
    constructor(world) {
        this.world = world;
        this.entityImages = this.world.entityImages;
        this.levelImages = this.world.levelImages;
        this.allAudios = this.world.allAudios;
        this.allVideos = this.world.allVideos;
        this.initStableData();
        this.characters = this.createCharacters();
        this.environment = this.createEnvironment();
        this.sounds = this.createSounds();
        this.video = this.allVideos.memory || null;
        this.hints = this.createHints();
        this.cutsceneIndicator = new CutsceneIndicator(this.world);
    }

    /**
     * Initializes stable level data and state.
     * @returns {void}
     */
    initStableData() {
        this.stableLevel = createStableLevel({ levelImages: this.levelImages });
        this.popupTexts = [];
        this.stableEvents = stableEvents;
        this.memoryVideoStarted = false;
    }

    /**
     * Creates the stable level character instances.
     * @returns {Object} Character map.
     */
    createCharacters() {
        const characters = {
            juanito: new AnimatedEntity(this.entityImages, 'juanito', 150, 150, 635, 460),
            pollito: new AnimatedEntity(this.entityImages, 'pollito', 120, 120, 805, 515)
        };
        characters.pollito.isFlipped = false;
        return characters;
    }

    /**
     * Creates the stable level environment entities.
     * @returns {Object} Environment map.
     */
    createEnvironment() {
        return {
            memoryLight: new AnimatedEntity(this.entityImages, 'memoryLight', 200, 200, 590, 473, 0, 50, 50, 0)
        };
    }

    /**
     * Creates the stable level sound references.
     * @returns {Object} Sound map.
     */
    createSounds() {
        return {
            chickSfx: this.allAudios.chickSfx,
            chickenSfx: this.allAudios.chickenSfx
        };
    }

    /**
     * Creates the stable level hint instances.
     * @returns {Array<Object>} Hint list.
     */
    createHints() {
        return [
            new HollowHint("Streicheln", this.characters.juanito, 100, 'rose', { control: getControlById('interact') }),
            new HollowHint("Streicheln", this.characters.pollito, 100, 'rose', { control: getControlById('interact') }),
            new HollowHint("Verlassen", this.world.character, 100, 'desert', { control: getControlById('interact') }),
            new HollowHint("Erinnerung", this.environment.memoryLight, 100, 'default', { control: getControlById('interact') })
        ];
    }

    /**
     * Refreshes the stable video reference.
     * @returns {void}
     */
    refreshVideo() {
        this.allVideos = this.world.allVideos;
        this.video = this.allVideos.memory ?? null;
    }
}