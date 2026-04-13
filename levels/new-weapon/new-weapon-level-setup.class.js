import { AnimatedEntity } from '../../classes/entities/animated-entity.class.js';
import { newWeaponEvents } from '../../events/new-weapon/new-weapon-events.js';
import { CutsceneIndicator } from '../../classes/ui/cutscene-indicator.class.js';

/**
 * Sets up the new weapon level environment, sounds, and state.
 */
export class NewWeaponLevelSetup {
    /**
     * Creates a new level scene controller instance.
     * @param {Object} world World reference.
     */
    constructor(world) {
        this.world = world;
        this.initWorldRefs();
        this.environment = this.createEnvironment();
        this.sounds = this.createSounds();
        this.setupSceneState();
        this.newWeaponEvents = newWeaponEvents;
        this.cutsceneIndicator = new CutsceneIndicator(this.world);
    }

    /**
     * Initializes world-related references.
     * @returns {void}
     */
    initWorldRefs() {
        this.entityImages = this.world.entityImages;
        this.allAudios = this.world.allAudios;
        this.allVideos = this.world.allVideos;
    }

    /**
     * Creates the environment entities for the level.
     * @returns {Object} Environment map.
     */
    createEnvironment() {
        return {
            macuahuitl: this.createMacuahuitl()
        };
    }

    /**
     * Creates the macuahuitl entity.
     * @returns {Object} Animated entity instance.
     */
    createMacuahuitl() {
        return new AnimatedEntity(this.entityImages, 'macuahuitl', 300, 300, 700, 300);
    }

    /**
     * Creates the sound references for the level.
     * @returns {Object} Sound map.
     */
    createSounds() {
        return {
            newWeaponMusic: this.allAudios.newWeaponMusic,
            voNewWeapon01: this.allAudios.voNewWeapon01
        };
    }

    /**
     * Initializes the scene state for the level.
     * @returns {void}
     */
    setupSceneState() {
        this.sounds.newWeaponMusic.volume = 0.8;
        this.environment.macuahuitl.isFlipped = false;
        this.video = this.allVideos.new_weapon_bg_video || null;
    }
}