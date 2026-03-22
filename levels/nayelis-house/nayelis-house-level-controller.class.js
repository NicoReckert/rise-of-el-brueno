import { EventManager } from '../../classes/systems/event-manager.class.js';
import { QuestManager } from '../../classes/systems/quest-manager.class.js';

/**
 * Controls Nayeli's house level including rendering, input, events, and quests.
 */
export class NayelisHouseLevelController {
    /**
     * Creates a new Nayeli's house level controller instance.
     * @param {Object} setup Level setup reference.
     */
    constructor(setup) {
        this.setup = setup;
        this.world = setup.world;
        this.ctx = this.world.ctx;
        this.canvas = this.world.canvas;
        this.addToWorld = this.world.renderer.addToWorld.bind(this.world.renderer);
        this.character = this.world.character;
        this.gameplayInputController = this.world.gameplayInputController;
        this.initManagers();
        this.houseRenderCache = null;
    }

    /**
     * Initializes event and quest managers.
     * @returns {void}
     */
    initManagers() {
        this.eventManager = new EventManager(this.setup);
        this.questManager = new QuestManager(
            this.setup,
            this.eventManager,
            this.setup.nayelisHouseEvents
        );
        this.eventManager.questManager = this.questManager;
    }

    /**
     * Updates the house level controller state and rendering.
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
        this.handlePopup();
        this.handleHint();
        this.eventManager.update();
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
     * Renders background elements for Nayeli's house scene.
     * @returns {void}
     */
    renderBackgrounds() {
        const { ctx, canvas, setup } = this;
        const { width, height } = canvas;
        const house = setup.nayelisHouseLevel.sceneryObjects[0];
        this.drawHouseVideo(width, height);
        const houseCanvas = this.getHouseRenderCache();
        ctx.save();
        ctx.translate(house.x - this.renderCameraX, house.y);
        ctx.filter = 'brightness(1.1)';
        ctx.drawImage(houseCanvas, 0, 0);
        ctx.restore();
    }

    /**
     * Draws the background house video.
     * @param {number} width Canvas width.
     * @param {number} height Canvas height.
     * @returns {void}
     */
    drawHouseVideo(width, height) {
        if (this.setup.video.readyState < 2) return;
        this.ctx.save();
        this.ctx.globalAlpha = 0.8;
        this.ctx.filter = 'brightness(0.8)';
        this.ctx.drawImage(this.setup.video, 0, 0, width, height);
        this.ctx.restore();
    }

    /**
     * Returns the cached house render canvas.
     * @returns {HTMLCanvasElement} Cached house canvas.
     */
    getHouseRenderCache() {
        if (this.houseRenderCache) return this.houseRenderCache;
        const house = this.setup.nayelisHouseLevel.sceneryObjects[0];
        const canvas = this.createHouseCacheCanvas(house);
        const ctx = canvas.getContext('2d');
        this.drawHouseToCache(house, ctx);
        this.applyHouseFade(house, ctx, 0.05);
        this.houseRenderCache = canvas;
        return canvas;
    }

    /**
     * Creates an offscreen canvas for house rendering.
     * @param {Object} house House entity.
     * @returns {HTMLCanvasElement} Offscreen canvas.
     */
    createHouseCacheCanvas(house) {
        const canvas = document.createElement('canvas');
        canvas.width = house.width;
        canvas.height = house.height;
        return canvas;
    }

    /**
     * Draws the house entity to the offscreen cache.
     * @param {Object} house House entity.
     * @param {CanvasRenderingContext2D} ctx Offscreen rendering context.
     * @returns {void}
     */
    drawHouseToCache(house, ctx) {
        this.addToWorld({ ...house, x: 0, y: 0 }, ctx);
    }

    /**
     * Applies a fade mask to the cached house image.
     * @param {Object} house House entity.
     * @param {CanvasRenderingContext2D} ctx Offscreen rendering context.
     * @param {number} fadeStrength Fade strength factor.
     * @returns {void}
     */
    applyHouseFade(house, ctx, fadeStrength) {
        const fade = this.createHouseFadeGradient(ctx, house, fadeStrength);
        ctx.globalCompositeOperation = 'destination-in';
        ctx.fillStyle = fade;
        ctx.fillRect(0, 0, house.width, house.height);
        ctx.globalCompositeOperation = 'source-over';
    }

    /**
     * Creates a horizontal fade gradient for the house mask.
     * @param {CanvasRenderingContext2D} ctx Offscreen rendering context.
     * @param {Object} house House entity.
     * @param {number} fadeStrength Fade strength factor.
     * @returns {CanvasGradient} Fade gradient.
     */
    createHouseFadeGradient(ctx, house, fadeStrength) {
        const fs = fadeStrength;
        const fsMid = fs * 0.45;
        const fade = ctx.createLinearGradient(0, 0, house.width, 0);
        fade.addColorStop(0.0, 'rgba(0,0,0,0)');
        fade.addColorStop(fsMid, 'rgba(0,0,0,0.0)');
        fade.addColorStop(fs, 'rgba(0,0,0,1)');
        fade.addColorStop(1 - fs, 'rgba(0,0,0,1)');
        fade.addColorStop(1 - fsMid, 'rgba(0,0,0,0.0)');
        fade.addColorStop(1.0, 'rgba(0,0,0,0)');
        return fade;
    }

    /**
     * Renders the status bar UI element.
     * @returns {void}
     */
    renderStatusBar() {
        this.addToWorld(this.setup.statusBar);
    }

    /**
     * Renders characters and entities in Nayeli's house scene.
     * @returns {void}
     */
    renderCharacterAndEntities() {
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX, 0);
        this.ctx.shadowColor = 'rgba(255, 255, 200, 0.8)';
        this.ctx.shadowBlur = 20;
        this.addToWorld(this.character);
        this.ctx.shadowBlur = 0;
        this.ctx.shadowColor = 'rgba(255, 255, 200, 0.8)';
        this.ctx.shadowBlur = 20;
        this.addToWorld(this.setup.characters.nayeli);
        this.ctx.shadowBlur = 0;
        this.ctx.restore();
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
     * Updates character entities in the scene.
     * @param {number} timestamp Current timestamp.
     * @returns {void}
     */
    updateEntities(timestamp) {
        Object.values(this.setup.characters).forEach(element => {
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