/**
 * Controls the new weapon level including character state, text, and rendering.
 */
export class NewWeaponLevelController {
    /**
     * Creates a new level complete controller instance.
     * @param {Object} setup Level setup reference.
     */
    constructor(setup) {
        this.setup = setup;
        this.world = setup.world;
        this.ctx = this.world.ctx;
        this.canvas = this.world.canvas;
        this.addToWorld = this.world.renderer.addToWorld.bind(this.world.renderer);
        this.character = this.world.character;
        this.initCharacterState();
        this.initHeroTextState();
        this.initCharacterCanvas();
    }

    /**
     * Initializes the character position and camera state.
     * @returns {void}
     */
    initCharacterState() {
        this.world.character.x = 550;
        this.world.character.y = 250;
        this.world.camera_x = 0;
    }

    /**
     * Initializes the hero text animation state.
     * @returns {void}
     */
    initHeroTextState() {
        this.heroTextAlpha = 0;
        this.heroTextScale = 0.5;
    }

    /**
     * Initializes an offscreen canvas for character rendering.
     * @returns {void}
     */
    initCharacterCanvas() {
        this.charCanvas = document.createElement('canvas');
        this.charCtx = this.charCanvas.getContext('2d');
    }

    /**
     * Updates the new weapon level controller state and rendering.
     * @param {number} timestamp Current timestamp.
     * @returns {void}
     */
    update(timestamp) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateCamera();
        this.renderBackgrounds();
        this.renderCharacterAndEntities();
        this.updateCharacter(timestamp);
        this.updateEntities(timestamp);
        this.animateHeroText();
    }

    /**
     * Updates the camera position for rendering.
     * @returns {void}
     */
    updateCamera() {
        this.camera_x = this.setup.world.camera_x;
        this.renderCameraX = Math.round(this.camera_x);
        this.renderCameraX = 0;
    }

    /**
     * Renders the background layers for the new weapon scene.
     * @returns {void}
     */
    renderBackgrounds() {
        const data = this.getBackgroundRenderData();
        if (!data) return;
        const { ctx, w, h, video } = data;
        ctx.save();
        this.drawBackgroundVideo(data, video, w, h);
        this.drawFloorDarken(data, w, h);
        this.drawVignette(data, w, h);
        this.drawCharacterGlow(data, w, h);
        ctx.restore();
    }

    /**
     * Returns background rendering data for the scene.
     * @returns {Object|null} Background render data or null if unavailable.
     */
    getBackgroundRenderData() {
        const { ctx, canvas, setup, character } = this;
        const { width: w, height: h } = canvas;
        const video = setup.video;
        if (video.readyState < 2) return null;
        const cx = character.x + character.width * 0.5;
        const cy = character.y + character.height * 0.6;
        const minSide = Math.min(w, h);
        return { ctx, w, h, video, character, cx, cy, minSide };
    }

    /**
     * Draws the background video layer.
     * @param {{ctx: CanvasRenderingContext2D}} data Rendering context container.
     * @param {HTMLVideoElement} video Video source.
     * @param {number} w Canvas width.
     * @param {number} h Canvas height.
     * @returns {void}
     */
    drawBackgroundVideo({ ctx }, video, w, h) {
        ctx.filter = 'brightness(0.9) contrast(1.2) saturate(1.2)';
        ctx.drawImage(video, 0, 0, w, h);
        ctx.filter = 'none';
    }

    /**
     * Draws a floor darkening gradient overlay.
     * @param {{ctx: CanvasRenderingContext2D}} data Rendering context container.
     * @param {number} w Canvas width.
     * @param {number} h Canvas height.
     * @returns {void}
     */
    drawFloorDarken({ ctx }, w, h) {
        ctx.globalCompositeOperation = 'multiply';
        const gradient = ctx.createLinearGradient(0, h * 0.7, 0, h);
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(1, 'rgba(0,0,0,0.65)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, h * 0.7, w, h * 0.3);
    }

    /**
     * Draws a vignette overlay.
     * @param {{ctx: CanvasRenderingContext2D, minSide: number}} data Rendering context container.
     * @param {number} w Canvas width.
     * @param {number} h Canvas height.
     * @returns {void}
     */
    drawVignette({ ctx, minSide }, w, h) {
        const gradient = ctx.createRadialGradient(w * 0.5, h * 0.5, minSide * 0.35, w * 0.5, h * 0.5, minSide * 0.75);
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(1, 'rgba(0,0,0,0.5)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
    }

    /**
     * Draws a glow effect around the character.
     * @param {{ctx: CanvasRenderingContext2D, cx: number, cy: number, character: Object}} data Rendering context container.
     * @param {number} w Canvas width.
     * @param {number} h Canvas height.
     * @returns {void}
     */
    drawCharacterGlow({ ctx, cx, cy, character }, w, h) {
        ctx.globalCompositeOperation = 'screen';
        const radius = Math.max(character.width, character.height) * 1.2;
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        gradient.addColorStop(0, 'rgba(0,150,255,0.35)');
        gradient.addColorStop(1, 'rgba(0,150,255,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
    }

    /**
     * Renders the character and related entities.
     * @returns {void}
     */
    renderCharacterAndEntities() {
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX, 0);
        const rect = this.getCharacterRenderRect();
        this.syncCharCanvasSize(rect);
        this.drawCharacterToBuffer(rect);
        this.applyCharacterFadeMask(rect);
        this.drawBufferedCharacter(rect);
        this.addToWorld(this.setup.environment.macuahuitl);
        this.ctx.restore();
    }

    /**
     * Returns the character render rectangle.
     * @returns {{width:number,height:number,x:number,y:number}} Render rectangle.
     */
    getCharacterRenderRect() {
        const { width, height, x, y } = this.character;
        return { width, height, x, y };
    }

    /**
     * Synchronizes the offscreen character canvas size.
     * @param {{width:number,height:number}} rect Character render rectangle.
     * @returns {void}
     */
    syncCharCanvasSize({ width, height }) {
        if (this.charCanvas.width === width && this.charCanvas.height === height) return;
        this.charCanvas.width = width;
        this.charCanvas.height = height;
    }

    /**
     * Draws the character onto the offscreen buffer.
     * @param {{width:number,height:number}} rect Character render rectangle.
     * @returns {void}
     */
    drawCharacterToBuffer({ width, height }) {
        const charCtx = this.charCtx;
        charCtx.clearRect(0, 0, width, height);
        this.addToWorld({ ...this.character, x: 0, y: 0 }, charCtx);
    }

    /**
     * Applies a fade mask to the buffered character.
     * @param {{width:number,height:number}} rect Character render rectangle.
     * @returns {void}
     */
    applyCharacterFadeMask({ width, height }) {
        const charCtx = this.charCtx;
        charCtx.globalCompositeOperation = 'destination-in';
        this.applyHorizontalFade(charCtx, width, height);
        this.applyVerticalFade(charCtx, width, height);
        charCtx.globalCompositeOperation = 'source-over';
    }

    /**
     * Applies a horizontal fade mask to the buffer.
     * @param {CanvasRenderingContext2D} charCtx Offscreen character context.
     * @param {number} width Buffer width.
     * @param {number} height Buffer height.
     * @returns {void}
     */
    applyHorizontalFade(charCtx, width, height) {
        const fadeSide = 0.1;
        const mask = charCtx.createLinearGradient(0, 0, width, 0);
        mask.addColorStop(0, 'rgba(0,0,0,0)');
        mask.addColorStop(fadeSide, 'rgba(0,0,0,1)');
        mask.addColorStop(1 - fadeSide, 'rgba(0,0,0,1)');
        mask.addColorStop(1, 'rgba(0,0,0,0)');
        charCtx.fillStyle = mask;
        charCtx.fillRect(0, 0, width, height);
    }

    /**
     * Applies a vertical fade mask to the buffer.
     * @param {CanvasRenderingContext2D} charCtx Offscreen character context.
     * @param {number} width Buffer width.
     * @param {number} height Buffer height.
     * @returns {void}
     */
    applyVerticalFade(charCtx, width, height) {
        const mask = charCtx.createLinearGradient(0, 0, 0, height);
        mask.addColorStop(0, 'rgba(0,0,0,0)');
        mask.addColorStop(0.15, 'rgba(0,0,0,1)');
        mask.addColorStop(1, 'rgba(0,0,0,1)');
        charCtx.fillStyle = mask;
        charCtx.fillRect(0, 0, width, height);
    }

    /**
     * Draws the buffered character onto the main canvas.
     * @param {{x:number,y:number}} rect Character render rectangle.
     * @returns {void}
     */
    drawBufferedCharacter({ x, y }) {
        this.ctx.shadowColor = 'rgba(0, 200, 255, 0.9)';
        this.ctx.shadowBlur = 40;
        this.ctx.drawImage(this.charCanvas, x, y);
        this.ctx.shadowBlur = 0;
    }

    /**
     * Updates the character state.
     * @param {number} timestamp Current timestamp.
     * @returns {void}
     */
    updateCharacter(timestamp) {
        this.character.updateAll(timestamp);
    }

    /**
     * Updates environment entities.
     * @param {number} timestamp Current timestamp.
     * @returns {void}
     */
    updateEntities(timestamp) {
        Object.values(this.setup.environment).forEach(element => {
            element.updateState(timestamp);
        });
    }

    /**
     * Draws the hero text on the canvas.
     * @param {string} text Hero text content.
     * @param {number} alpha Text opacity.
     * @param {number} scale Text scale factor.
     * @returns {void}
     */
    drawHeroText(text, alpha, scale) {
        this.ctx.save();
        this.ctx.font = `${65 * scale}px 'UncialAntiqua', serif`;
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = `rgba(255, 230, 180, ${alpha})`;
        this.ctx.shadowColor = 'rgba(0, 180, 255, 1)';
        this.ctx.shadowBlur = 35;
        this.ctx.fillText(text, this.canvas.width / 2, 150);
        this.ctx.restore();
    }

    /**
     * Animates and renders the hero text.
     * @returns {void}
     */
    animateHeroText() {
        if (this.heroTextAlpha < 1) this.heroTextAlpha += 0.02;
        if (this.heroTextScale < 1) this.heroTextScale += 0.01;
        this.drawHeroText("DAS MACUAHUITL DER AHNEN", this.heroTextAlpha, this.heroTextScale);
    }
}