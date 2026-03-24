import { EventManager } from '../../classes/systems/event-manager.class.js';
import { QuestManager } from '../../classes/systems/quest-manager.class.js';

/**
 * Controls stable level logic including events, quests, and rendering integration.
 */
export class StableLevelController {
    /**
     * Creates a new stable level controller instance.
     * @param {Object} setup Level setup reference.
     */
    constructor(setup) {
        this.setup = setup;
        this.world = setup.world;
        this.ctx = this.world.ctx;
        this.canvas = this.world.canvas;
        this.bindRendererMethods();
        this.character = this.world.character;
        this.gameplayInputController = this.world.gameplayInputController;
        this.eventManager = new EventManager(this.setup);
        this.questManager = new QuestManager(this.setup, this.eventManager, this.setup.stableEvents);
        this.eventManager.questManager = this.questManager;
    }

    /**
     * Binds renderer helper methods from the world renderer.
     * @returns {void}
     */
    bindRendererMethods() {
        this.addObject = this.world.renderer.addObject.bind(this.world.renderer);
        this.addToWorld = this.world.renderer.addToWorld.bind(this.world.renderer);
    }

    /**
     * Updates the stable level controller state and rendering.
     * @param {number} timestamp Current timestamp.
     * @returns {void}
     */
    update(timestamp) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateCamera();
        this.renderBackgrounds();
        this.renderStatusBar();
        this.renderCharacterAndEntities();
        this.updateCharacter(timestamp);
        this.updateEntities(timestamp);
        this.handleHint();
        this.handlePopup();
        this.eventManager.update();
        this.eventManager.debug = true;
    }

    /**
     * Updates the camera position for rendering.
     * @returns {void}
     */
    updateCamera() {
        this.camera_x = this.setup.world.camera_x;
        this.renderCameraX = Math.round(this.camera_x);
    }

    /**
     * Renders background elements for the stable level.
     * @returns {void}
     */
    renderBackgrounds() {
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX, 0);
        this.addObject(this.setup.stableLevel.grounds);
        this.addToWorld(this.setup.stableLevel.sceneryObjects[0]);
        this.ctx.restore();
    }

    /**
     * Renders the status bar UI element.
     * @returns {void}
     */
    renderStatusBar() {
        this.addToWorld(this.setup.statusBarCharacter);
    }

    /**
     * Renders characters and entities for the stable level.
     * @returns {void}
     */
    renderCharacterAndEntities() {
        const step = this.setup.world.farmLevelController.questManager.step;
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX, 0);
        if (this.character.isCaress) this.renderCaressScene(step);
        else this.renderNormalScene(step);
        this.ctx.restore();
    }

    /**
     * Renders characters during the caress scene.
     * @param {number} step Current quest step.
     * @returns {void}
     */
    renderCaressScene(step) {
        this.addToWorld(this.character);
        if (step < 8) this.addToWorld(this.setup.characters.juanito);
        if (step < 8) this.addToWorld(this.setup.characters.pollito);
    }

    /**
     * Renders the normal stable scene characters and entities.
     * @param {number} step Current quest step.
     * @returns {void}
     */
    renderNormalScene(step) {
        if (step < 8) this.addToWorld(this.setup.characters.juanito);
        if (step < 8) this.addToWorld(this.setup.characters.pollito);
        if (step >= 20) this.addToWorld(this.setup.environment.memoryLight);
        this.addToWorld(this.character);
    }

    /**
     * Updates the main character state.
     * @param {number} timestamp Current timestamp.
     * @returns {void}
     */
    updateCharacter(timestamp) {
        this.gameplayInputController.processGameInput(this.world, timestamp);
        this.character.updateAll(timestamp);
    }

    /**
     * Updates character and environment entities.
     * @param {number} timestamp Current timestamp.
     * @returns {void}
     */
    updateEntities(timestamp) {
        Object.values(this.setup.characters).forEach(element => {
            element.updateState(timestamp);
        });
        Object.values(this.setup.environment).forEach(element => {
            element.updateState(timestamp);
        });
    }

    /**
     * Renders and updates popup texts.
     * @returns {void}
     */
    handlePopup() {
        const now = performance.now();
        this.setup.popupTexts.forEach(p => p.draw(this.ctx, now));
        this.setup.popupTexts = this.setup.popupTexts.filter(p => p.active);
    }

    /**
     * Renders hint elements.
     * @returns {void}
     */
    handleHint() {
        this.setup.hints.forEach(hint => hint.draw(this.ctx, this.renderCameraX));
    }
}