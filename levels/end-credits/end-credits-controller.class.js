import { EventManager } from '../../classes/systems/event-manager.class.js';
import { QuestManager } from '../../classes/systems/quest-manager.class.js';

/**
 * Represents the end credits controller.
 */
export class EndCreditsController {
    /**
     * Creates an end credits controller instance.
     * @param {Object} setup End credits setup object.
     */
    constructor(setup) {
        this.setup = setup;
        this.world = setup.world;
        this.ctx = this.world.ctx;
        this.canvas = this.world.canvas;
        this.initManagers();
    }

    /**
     * Initializes the event and quest managers.
     */
    initManagers() {
        this.eventManager = new EventManager(this.setup);
        this.questManager = new QuestManager(this.setup, this.eventManager, this.setup.endCreditsEvents);
        this.eventManager.questManager = this.questManager;
    }

    /**
     * Updates the end credits state and renders the frame.
     */
    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.renderVideoBackground();
        this.eventManager.update();
    }

    /**
     * Renders the video background if available.
     */
    renderVideoBackground() {
        const video = this.setup.video;
        if (!video || video.readyState < 2) return;
        this.ctx.save();
        this.ctx.drawImage(video, 0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
    }
}