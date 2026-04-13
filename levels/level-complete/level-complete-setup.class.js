import { AnimatedEntity } from '../../classes/entities/animated-entity.class.js';
import { levelCompleteEvents } from '../../events/level-complete/level-complete-events.js';

/**
 * Sets up the level complete scene including characters, sounds, and video.
 */
export class LevelCompleteSetup {
    /**
     * Creates a new level complete setup instance.
     * @param {Object} world World reference.
     */
    constructor(world) {
        this.world = world;
        this.entityImages = world.entityImages;
        this.allAudios = world.allAudios;
        this.allVideos = world.allVideos;
        this.levelCompleteEvents = levelCompleteEvents;
        this.characters = this.createCharacters();
        this.sounds = this.createSounds();
        this.video = this.allVideos.complete_bg_video || null;
    }

    /**
     * Creates the level complete character instances.
     * @returns {Object} Character map.
     */
    createCharacters() {
        return {
            levelCompleteCharacter: new AnimatedEntity(this.entityImages, 'levelCompleteCharacter', 512, 512, 410, 180)
        };
    }

    /**
     * Creates the level complete sound references.
     * @returns {Object} Sound map.
     */
    createSounds() {
        return {
            levelCompleteMusic: this.allAudios.levelCompleteMusic,
            voLevelComplete01: this.allAudios.voLevelComplete01
        };
    }
}