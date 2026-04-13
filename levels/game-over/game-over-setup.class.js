import { gameOverEvents } from "../../events/game-over/game-over-events.js";
import { AnimatedEntity } from "../../classes/entities/animated-entity.class.js";

/**
 * Game over setup.
 */
export class GameOverSetup {
    /**
     * Creates a new game over setup.
     * @param {Object} world World instance.
     */
    constructor(world) {
        this.world = world;
        this.entityImages = this.world.entityImages;
        this.allAudios = world.allAudios;
        this.allVideos = world.allVideos;
        this.gameOverEvents = gameOverEvents;
        this.video = document.getElementById('game-over-video');
        this.sourceVideo = this.allVideos.game_over_bg_video || null;
        if (this.video && this.sourceVideo?.dataset?.src) {
            this.video.src = this.sourceVideo.dataset.src;
            this.video.load();
        }
        this.initAll();
    }

    /**
     * Initializes all setup parts.
     * @returns {void}
     */
    initAll() {
        this.sounds = this.createSounds();
        this.initCharacters();
        this.initEnvironment();
        this.initSetup();
    }

    /**
     * Initializes characters.
     * @returns {void}
     */
    initCharacters() {
        const x = this.world.canvas.width / 2 - 280;
        const y = this.world.canvas.height * 0.64 - 130;
        this.characters = {
            gameOverCharacterSpirit: new AnimatedEntity(
                this.entityImages, 'gameOverCharacterSpirit', 260, 260, x, y
            )
        };
    }

    /**
     * Initializes environment.
     * @returns {void}
     */
    initEnvironment() {
        const x = this.world.canvas.width / 2 - 70;
        const y = this.world.canvas.height * 0.64 - 210;
        this.environment = {
            treeSpirit: new AnimatedEntity(
                this.entityImages, 'treeSpirit', 380, 380, x, y
            )
        };
    }

    /**
     * Initializes setup state.
     * @returns {void}
     */
    initSetup() {
        this.characters.gameOverCharacterSpirit.opacity = 0.8;
        this.characters.gameOverCharacterSpirit.isFlipped = false;
        this.characters.gameOverCharacterSpirit.updateAnimationState('idle', 1000 / 8);
        this.environment.treeSpirit.opacity = 0.8;
        this.environment.treeSpirit.isFlipped = false;
        this.environment.treeSpirit.updateAnimationState('idle', 1000 / 8);
    }

    /**
     * Creates sound mappings.
     * @returns {Object} Sound objects.
     */
    createSounds() {
        return {
            gameOverMusic: this.allAudios.gameOverMusic
        };
    }
}