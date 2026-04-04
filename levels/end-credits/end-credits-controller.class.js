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
     * Updates the scene.
     * @returns {void}
     */
    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.eventManager.update();
    }
}