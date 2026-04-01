import { AnimatedEntity } from '../../classes/entities/animated-entity.class.js';
import { createNayelisHouseLevel } from './nayelis-house-level.js';
import { nayelisHouseEvents } from '../../events/nayelis-house-level-events.js';
import { HollowHint } from '../../classes/ui/hollow-hint.class.js';

/**
 * Sets up the Nayeli's house level including characters, sounds, video, and state.
 */
export class NayelisHouseLevelSetup {
    /**
     * Creates a new house level setup instance.
     * @param {Object} world World reference.
     */
    constructor(world) {
        this.world = world;
        this.entityImages = this.world.entityImages;
        this.levelImages = this.world.levelImages;
        this.allAudios = this.world.allAudios;
        this.allVideos = this.world.allVideos;
        this.initHouseData();
        this.characters = this.createCharacters();
        this.speechBubbles = {};
        this.sounds = this.createSounds();
        this.video = this.allVideos.nayelis_house_bg_video || null;
        this.comeFromNewWeapon = false;
        this.hints = this.createHints();
    }

    /**
     * Initializes house level data and state.
     * @returns {void}
     */
    initHouseData() {
        this.nayelisHouseLevel = createNayelisHouseLevel({ levelImages: this.levelImages });
        this.nayelisHouseEvents = nayelisHouseEvents;
        this.popupTexts = [];
    }

    /**
     * Creates the house level character instances.
     * @returns {Object} Character map.
     */
    createCharacters() {
        return {
            nayeli: new AnimatedEntity(this.entityImages, 'nayeli', 180, 180, 800, 485)
        };
    }

    /**
     * Creates the house level sound references.
     * @returns {Object} Sound map.
     */
    createSounds() {
        return {
            nayeliThemeMusic: this.allAudios.nayeliThemeMusic,
            voNayeliSpeak01: this.allAudios.voNayeliSpeak01
        };
    }

    /**
     * Creates hint instances.
     * @returns {Array<Object>} Hint instances.
     */
    createHints() {
        return [
            new HollowHint("Verlassen", this.world.character, 100, 'desert')
        ];
    }
}