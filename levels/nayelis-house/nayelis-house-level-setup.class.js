import { AnimatedEntity } from '../../classes/entities/animated-entity.class.js';
import { createNayelisHouseLevel } from './nayelis-house-level.js';
import { nayelisHouseEvents } from '../../events/nayelis-house-level-events.js';

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
        this.entityImages = world.entityImages;
        this.allAudios = world.allAudios;
        this.allVideos = world.allVideos;
        this.initHouseData();
        this.characters = this.createCharacters();
        this.speechBubbles = {};
        this.sounds = this.createSounds();
        this.video = this.allVideos.nayelis_house_video || null;
    }

    /**
     * Initializes house level data and state.
     * @returns {void}
     */
    initHouseData() {
        this.nayelisHouseLevel = createNayelisHouseLevel();
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
            nayelisMusic: this.allAudios.nayelisMusic,
            nayelisSpeakSound: this.allAudios.nayelisSpeakSound
        };
    }
}