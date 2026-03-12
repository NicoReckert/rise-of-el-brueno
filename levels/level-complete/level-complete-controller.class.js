import { EventManager } from '../../classes/systems/event-manager.class.js';
import { QuestManager } from '../../classes/systems/quest-manager.class.js';

/**
 * Controller responsible for handling the level completion scene.
 */
export class LevelCompleteController {
    /**
     * Creates a new LevelCompleteController instance.
     * @param {Object} setup Level setup reference.
     */
    constructor(setup) {
        this.setup = setup;
        this.world = setup.world;
        this.ctx = this.world.ctx;
        this.canvas = this.world.canvas;
        this.bindRendererMethods();
        this.character = this.setup.characters.levelCompleteCharacter;
        this.keyboard = this.world.keyboard;
        this.initManagers();
        this.initCharState();
        this.initCharacterCanvas();
    }

    /**
     * Binds renderer methods for object rendering.
     * @returns {void}
     */
    bindRendererMethods() {
        this.addObject = this.world.renderer.addObject.bind(this.world.renderer);
        this.addToWorld = this.world.renderer.addToWorld.bind(this.world.renderer);
    }

    /**
     * Initializes event and quest managers for the level.
     * @returns {void}
     */
    initManagers() {
        this.eventManager = new EventManager(this.setup);
        this.questManager = new QuestManager(this.setup, this.eventManager, this.setup.levelCompleteEvents);
        this.eventManager.questManager = this.questManager;
    }

    /**
     * Initializes hero state and camera position for the level completion scene.
     * @returns {void}
     */
    initCharState() {
        this.heroTextAlpha = 0;
        this.heroTextScale = 0.5;
    }

    /**
     * Initializes an offscreen canvas for rendering the completion character.
     * @returns {void}
     */
    initCharacterCanvas() {
        const char = this.character;
        this.charCanvas = document.createElement("canvas");
        this.charCanvas.width = char.width;
        this.charCanvas.height = char.height;
        this.charCtx = this.charCanvas.getContext("2d");
    }

    /**
     * Updates the level completion scene for the current frame.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    update(timestamp) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateCamera();
        this.renderBackgrounds();
        this.renderEntities();
        this.updateEntities(timestamp);
        this.eventManager.update();
        this.animateHeroText();
    }

    /**
     * Updates camera position references for rendering.
     * @returns {void}
     */
    updateCamera() {
        this.camera_x = this.setup.world.camera_x;
        this.renderCameraX = Math.round(this.camera_x);
        this.renderCameraX = 0;
    }

    /**
     * Renders the background layers for the level completion scene.
     * @returns {void}
     */
    renderBackgrounds() {
        const data = this.getLevelCompleteBackgroundData();
        if (!data) return;
        const { ctx, w, h, video } = data;
        ctx.save();
        this.drawLevelCompleteVideo(ctx, video, w, h);
        this.drawLevelCompleteBottomShadow(data);
        this.drawLevelCompleteVignette(data);
        this.drawLevelCompleteSpotlight(data);
        ctx.restore();
    }

    /**
     * Collects rendering data for the level completion background.
     * @returns {Object|null} Background render data or null if not ready.
     */
    getLevelCompleteBackgroundData() {
        const { ctx, canvas, setup } = this;
        const { width: w, height: h } = canvas;
        const { video, characters } = setup;
        const character = characters.levelCompleteCharacter;
        if (video.readyState < 2) return null;
        const minSide = Math.min(w, h);
        const cx = character.x + character.width * 0.5;
        const cy = character.y + character.height * 0.6;
        return { ctx, w, h, video, character, minSide, cx, cy };
    }

    /**
     * Draws the background video for the level completion scene.
     * @param {CanvasRenderingContext2D} ctx Canvas rendering context.
     * @param {HTMLVideoElement} video Background video element.
     * @param {number} w Canvas width.
     * @param {number} h Canvas height.
     * @returns {void}
     */
    drawLevelCompleteVideo(ctx, video, w, h) {
        ctx.filter = 'brightness(0.9) contrast(1.2) saturate(1.2)';
        ctx.drawImage(video, 0, 0, w, h);
        ctx.filter = 'none';
    }

    /**
     * Draws a bottom shadow overlay for the level completion background.
     * @param {{ctx:CanvasRenderingContext2D, w:number, h:number}} data Background render data.
     * @returns {void}
     */
    drawLevelCompleteBottomShadow({ ctx, w, h }) {
        ctx.save();
        ctx.globalCompositeOperation = 'multiply';
        const g = ctx.createLinearGradient(0, h * 0.7, 0, h);
        g.addColorStop(0, 'rgba(0,0,0,0)');
        g.addColorStop(1, 'rgba(0,0,0,0.65)');
        ctx.fillStyle = g;
        ctx.fillRect(0, h * 0.7, w, h * 0.3);
        ctx.restore();
    }

    /**
     * Draws a vignette overlay for the level completion background.
     * @param {{ctx:CanvasRenderingContext2D, w:number, h:number, minSide:number}} data Background render data.
     * @returns {void}
     */
    drawLevelCompleteVignette({ ctx, w, h, minSide }) {
        ctx.save();
        ctx.globalCompositeOperation = 'multiply';
        const g = ctx.createRadialGradient(w * 0.5, h * 0.5, minSide * 0.35, w * 0.5, h * 0.5, minSide * 0.75);
        g.addColorStop(0, 'rgba(0,0,0,0)');
        g.addColorStop(1, 'rgba(0,0,0,0.5)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
    }

    /**
     * Draws a spotlight effect centered on the completion character.
     * @param {{ctx:CanvasRenderingContext2D, w:number, h:number, cx:number, cy:number, character:Object}} data Background render data.
     * @returns {void}
     */
    drawLevelCompleteSpotlight({ ctx, w, h, cx, cy, character }) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(character.width, character.height) * 1.2);
        g.addColorStop(0, 'rgba(0,150,255,0.35)');
        g.addColorStop(1, 'rgba(0,150,255,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
    }

    /**
     * Renders entities for the level completion scene.
     * @returns {void}
     */
    renderEntities() {
        const data = this.getLevelCompleteEntityData();
        this.drawCharacterToBuffer(data);
        this.applyCharacterBufferMask(data);
        this.drawBufferedCharacterToScene(data);
    }

    /**
     * Collects rendering data for level completion entities.
     * @returns {{ctx:CanvasRenderingContext2D, charCtx:CanvasRenderingContext2D, charCanvas:HTMLCanvasElement, character:Object}} Entity render data.
     */
    getLevelCompleteEntityData() {
        const { ctx, charCtx, charCanvas } = this;
        const character = this.setup.characters.levelCompleteCharacter;
        return { ctx, charCtx, charCanvas, character };
    }

    /**
     * Draws the completion character to the offscreen buffer.
     * @param {{charCtx:CanvasRenderingContext2D, charCanvas:HTMLCanvasElement, character:Object}} data Entity render data.
     * @returns {void}
     */
    drawCharacterToBuffer({ charCtx, charCanvas, character }) {
        charCtx.clearRect(0, 0, charCanvas.width, charCanvas.height);
        this.addToWorld({ ...character, x: 0, y: 0 }, charCtx);
    }

    /**
     * Applies fade masks to the buffered character.
     * @param {{charCtx:CanvasRenderingContext2D, charCanvas:HTMLCanvasElement}} data Entity render data.
     * @returns {void}
     */
    applyCharacterBufferMask({ charCtx, charCanvas }) {
        charCtx.save();
        charCtx.globalCompositeOperation = "destination-in";
        this.applySideFadeMask(charCtx, charCanvas);
        this.applyTopFadeMask(charCtx, charCanvas);
        charCtx.restore();
    }

    /**
     * Applies a horizontal fade mask to the character buffer.
     * @param {CanvasRenderingContext2D} charCtx Character buffer context.
     * @param {HTMLCanvasElement} charCanvas Character buffer canvas.
     * @returns {void}
     */
    applySideFadeMask(charCtx, charCanvas) {
        const fadeSide = 0.1;
        const mask = charCtx.createLinearGradient(0, 0, charCanvas.width, 0);
        mask.addColorStop(0, "rgba(0,0,0,0)");
        mask.addColorStop(fadeSide, "rgba(0,0,0,1)");
        mask.addColorStop(1 - fadeSide, "rgba(0,0,0,1)");
        mask.addColorStop(1, "rgba(0,0,0,0)");
        charCtx.fillStyle = mask;
        charCtx.fillRect(0, 0, charCanvas.width, charCanvas.height);
    }

    /**
     * Applies a vertical fade mask to the character buffer.
     * @param {CanvasRenderingContext2D} charCtx Character buffer context.
     * @param {HTMLCanvasElement} charCanvas Character buffer canvas.
     * @returns {void}
     */
    applyTopFadeMask(charCtx, charCanvas) {
        const mask = charCtx.createLinearGradient(0, 0, 0, charCanvas.height);
        mask.addColorStop(0, "rgba(0,0,0,0)");
        mask.addColorStop(0.15, "rgba(0,0,0,1)");
        mask.addColorStop(1, "rgba(0,0,0,1)");
        charCtx.fillStyle = mask;
        charCtx.fillRect(0, 0, charCanvas.width, charCanvas.height);
    }

    /**
     * Draws the buffered character to the main scene.
     * @param {{ctx:CanvasRenderingContext2D, charCanvas:HTMLCanvasElement, character:Object}} data Entity render data.
     * @returns {void}
     */
    drawBufferedCharacterToScene({ ctx, charCanvas, character }) {
        ctx.save();
        ctx.translate(-this.renderCameraX, 0);
        ctx.shadowColor = "rgba(0, 200, 255, 0.9)";
        ctx.shadowBlur = 40;
        ctx.drawImage(charCanvas, character.x, character.y);
        ctx.restore();
    }

    /**
     * Updates all character entities.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    updateEntities(timestamp) {
        Object.values(this.setup.characters).forEach(element => {
            element.updateState(timestamp);
        });
    }

    /**
     * Draws the hero text with glow and scaling.
     * @param {string} text Text to render.
     * @param {number} alpha Text opacity.
     * @param {number} scale Text scale factor.
     * @returns {void}
     */
    drawHeroText(text, alpha, scale) {
        this.ctx.save();
        this.ctx.font = `${100 * scale}px 'Adventure', serif`;
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = `rgba(255, 230, 180, ${alpha})`;
        this.ctx.shadowColor = 'rgba(0, 180, 255, 1)';
        this.ctx.shadowBlur = 35;
        this.ctx.fillText(text, this.canvas.width / 2, 150);
        this.ctx.restore();
    }

    /**
     * Animates and renders the hero completion text.
     * @returns {void}
     */
    animateHeroText() {
        if (this.heroTextAlpha < 1) this.heroTextAlpha += 0.02;
        if (this.heroTextScale < 1) this.heroTextScale += 0.01;
        this.drawHeroText("Level Geschafft", this.heroTextAlpha, this.heroTextScale);
    }
}