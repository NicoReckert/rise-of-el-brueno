import { EventManager } from '../../classes/systems/event-manager.class.js';
import { QuestManager } from '../../classes/systems/quest-manager.class.js';
import { EarthquakeEffect } from '../../classes/effects/earthquake-effect.class.js';
import { WindParticleEffect } from '../../classes/effects/wind-particle.class.js';
import { FarmRenderer } from './controllers/farm-renderer.class.js';
import { DustParticle } from '../../classes/effects/dust-particle.class.js';

/**
 * Controller responsible for managing the farm level logic and updates.
 */
export class FarmLevelController {
    /**
     * Creates a new FarmLevelController instance.
     * @param {Object} setup Farm level setup reference.
     */
    constructor(setup) {
        this.setup = setup;
        this.world = setup.world;
        this.ctx = this.world.ctx;
        this.canvas = this.world.canvas;
        this.addToWorld = this.world.renderer.addToWorld.bind(this.world.renderer);
        this.character = this.world.character;
        this.gameplayInputController = this.world.gameplayInputController;
        this.renderer = new FarmRenderer(this.setup, this.world);
        this.init();
        this.eventManager.debug = true;
    }

    /**
     * Initializes collections, managers, and effects for the farm level.
     * @returns {void}
     */
    init() {
        this.collections = [
            this.setup.characters,
            this.setup.cutsceneActors,
            this.setup.environment
        ]
        this.initManagers();
        this.initWind();
        this.initEffects();
    }

    /**
     * Initializes managers for events, quests, and timers.
     * @returns {void}
     */
    initManagers() {
        this.eventManager = new EventManager(this.setup);
        this.questManager = new QuestManager(this.setup, this.eventManager, this.setup.farmEvents);
        this.eventManager.questManager = this.questManager;
        this.questManager.step = 1;
        this.timerManager = this.setup.timerManager;
    }

    /**
     * Initializes the wind particle effect for the farm level.
     * @returns {void}
     */
    initWind() {
        this.windParticleEffect = new WindParticleEffect(this.canvas.width * 9, this.canvas.height, 1000);
        this.renderer.windParticleEffect = this.windParticleEffect;
    }

    /**
     * Initializes environmental effects for the farm level.
     * @returns {void}
     */
    initEffects() {
        this.earthquake = new EarthquakeEffect(this.setup, this.ctx);
        this.dustParticle = new DustParticle(this.canvas);
    }

    /**
     * Updates the farm level state for the current frame.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    update(timestamp) {
        this.prepareFrame(timestamp);
        this.updateWorld(timestamp);
        this.renderLateFrame();
        this.updateUi();
    }

    /**
     * Prepares the frame by clearing the canvas, updating the camera, and rendering the scene.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    prepareFrame(timestamp) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateCamera();
        this.renderFrame(timestamp);
    }

    /**
     * Renders the farm scene and environmental effects.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    renderFrame(timestamp) {
        this.earthquake.render(timestamp, () => {
            this.renderer.render(this.renderCameraX, this.questManager.step);
            this.renderStatusBar();
        });
        this.dustParticle.update(this.ctx, this.renderCameraX);
    }

    /**
     * Renders late-frame elements after the main scene.
     * @returns {void}
     */
    renderLateFrame() {
        this.renderer.renderAfterDark(this.questManager.step, this.renderCameraX);
    }

    /**
     * Updates world state including character, entities, events, and effects.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    updateWorld(timestamp) {
        this.updateCharacter(timestamp);
        this.updateEntities(timestamp);
        this.updateSunAndMoonCycle(timestamp);
        this.eventManager.update();
        this.questManager.update();
        this.updateWind();
        this.updateClouds(timestamp);
        this.timerManager.update();
    }

    /**
     * Updates UI elements such as hints and popups.
     * @returns {void}
     */
    updateUi() {
        this.handleHint();
        this.handlePopup();
    }

    /**
     * Updates all entities in registered collections.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    updateEntities(timestamp) {
        for (const collection of this.collections) {
            for (const entity of Object.values(collection)) {
                this.updateEntityNode(entity, timestamp);
            }
        }
    }

    /**
     * Updates a single entity node depending on its type.
     * @param {*} node Entity node to update.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    updateEntityNode(node, timestamp) {
        if (!node) return;
        if (this.updateEntityNodeState(node, timestamp)) return;
        if (this.updateEntityNodeArray(node, timestamp)) return;
        this.updateEntityNodeObject(node, timestamp);
    }

    /**
     * Updates the state of an entity node if supported.
     * @param {*} node Entity node.
     * @param {number} timestamp Frame timestamp.
     * @returns {boolean} True if the node handled the update.
     */
    updateEntityNodeState(node, timestamp) {
        if (typeof node.updateState !== 'function') return false;
        node.updateState(timestamp);
        return true;
    }

    /**
     * Updates all elements if the node is an array.
     * @param {*} node Entity node.
     * @param {number} timestamp Frame timestamp.
     * @returns {boolean} True if the node was an array.
     */
    updateEntityNodeArray(node, timestamp) {
        if (!Array.isArray(node)) return false;
        for (const item of node) this.updateEntityNode(item, timestamp);
        return true;
    }

    /**
     * Recursively updates entity nodes contained in an object.
     * @param {*} node Entity node.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    updateEntityNodeObject(node, timestamp) {
        if (typeof node !== 'object') return;
        for (const value of Object.values(node)) {
            this.updateEntityNode(value, timestamp);
        }
    }

    /**
     * Updates the wind particle effect when the quest step condition is met.
     * @returns {void}
     */
    updateWind() {
        if (this.questManager.step >= 20) this.windParticleEffect.update();
    }

    /**
     * Updates cloud entities in the farm level.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    updateClouds(timestamp) {
        for (const cloud of this.setup.farmLevel.clouds) {
            cloud.update(timestamp);
        }
    }

    /**
     * Updates camera position references for rendering.
     * @returns {void}
     */
    updateCamera() {
        this.camera_x = this.setup.world.camera_x;
        this.renderCameraX = Math.round(this.camera_x);
    }

    /**
     * Renders the status bar if the character is not inside the house.
     * @returns {void}
     */
    renderStatusBar() {
        if (this.setup.state.isGameCharacterInHouse) {
            return;
        }
        this.addToWorld(this.setup.statusBar);
    }

    /**
     * Processes input and updates the character state.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    updateCharacter(timestamp) {
        this.gameplayInputController.processGameInput(this.world, timestamp);
        this.character.updateAll(timestamp);
    }

    /**
     * Draws active popup texts and removes inactive ones.
     * @returns {void}
     */
    handlePopup() {
        const now = performance.now();
        this.setup.state.popupTexts.forEach(p => p.draw(this.ctx, now));
        this.setup.state.popupTexts = this.setup.state.popupTexts.filter(p => p.active);
    }

    /**
     * Updates the sun and moon cycle.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    updateSunAndMoonCycle(timestamp) {
        this.setup.sunCycle.update(timestamp);
        this.setup.moonCycle.update(timestamp);
    }

    /**
     * Draws all active hints.
     * @returns {void}
     */
    handleHint() {
        this.setup.hints.forEach(hint => hint.draw(this.ctx, this.renderCameraX));
    }
}