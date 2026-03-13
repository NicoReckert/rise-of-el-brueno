import { LifeEnergyCharacterBar } from '../../classes/ui/life-energy-character-bar.class.js';
import { AnimatedEntity } from '../../classes/entities/animated-entity.class.js';
import { HollowHint } from '../../classes/ui/hollow-hint.class.js';
import { createStableLevel } from './stable-level.js'
import { stableEvents } from '../../events/stable-level-events.js';

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
        this.statusBar = new LifeEnergyCharacterBar(this.entityImages);
        this.characters = this.createCharacters();
        this.environment = this.createEnvironment();
        this.sounds = this.createSounds();
        this.video = this.allVideos.memory || null;
        this.hints = this.createHints();
    }

    /**
     * Initializes stable level data and state.
     * @returns {void}
     */
    initStableData() {
        this.stableLevel = createStableLevel({ levelImages: this.levelImages });
        this.popupTexts = [];
        this.stableEvents = stableEvents;
    }

    /**
     * Creates the stable level character instances.
     * @returns {Object} Character map.
     */
    createCharacters() {
        const characters = {
            juanito: new AnimatedEntity(this.entityImages, 'juanito', 150, 150, 635, 460, 0, 100, -20, 0),
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
            chickSound: this.allAudios.chickSound,
            chickenSound: this.allAudios.chickenSound
        };
    }

    /**
     * Creates the stable level hint instances.
     * @returns {Array<Object>} Hint list.
     */
    createHints() {
        return [
            new HollowHint("Streicheln", this.characters.juanito, 100, 'rose'),
            new HollowHint("Streicheln", this.characters.pollito, 100, 'rose'),
            new HollowHint("Verlassen", this.world.character, 100, 'desert'),
            new HollowHint("Erinnerung", this.environment.memoryLight, 100, 'default')
        ];
    }
}