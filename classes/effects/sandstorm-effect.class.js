/**
 * Represents a sandstorm visual effect.
 */
export class SandstormEffect {
    /**
     * Creates a new instance.
     * @param {HTMLCanvasElement} canvas Canvas element.
     * @param {Object} entityImages Image definitions.
     * @param {number} [worldWidth=7200] Width of the world.
     */
    constructor(canvas, entityImages, worldWidth = 7200) {
        this.canvas = canvas;
        this.entityImages = entityImages;
        this.worldWidth = worldWidth;
        this.initContext();
        this.initTexture();
        this.initStormState();
    }

    /**
     * Initializes the rendering context reference.
     */
    initContext() {
        this.ctx = null;
    }

    /**
     * Initializes the sandstorm texture and related render properties.
     */
    initTexture() {
        this.texture = this.entityImages?.sandstorm?.texture ?? [];
        this.image = this.texture[0];
        this.scaledImage = null;
        this.scaledHeight = 0;
    }

    /**
     * Initializes internal storm state.
     */
    initStormState() {
        this.scrollX = 0;
        this.scrollSpeed = 0.5;
        this.enabled = true;
        this.alpha = 0.3;
        this.pressure = 0;
        this.currentAlpha = this.alpha;
    }

    /**
     * Updates the sandstorm state.
     */
    update() {
        if (!this.enabled) return;
        this.scrollX = (this.scrollX + this.scrollSpeed) % this.image.width;
        this.pressure *= 0.9;
        if (this.pressure < 0.01) this.pressure = 0;
        const p = Math.min(1, Math.max(0, this.pressure));
        const targetAlpha = this.alpha * (1 - p);
        const smoothing = 0.2;
        this.currentAlpha += (targetAlpha - this.currentAlpha) * smoothing;
    }

    /**
     * Draws the sandstorm effect with optional shield clipping.
     * @param {CanvasRenderingContext2D} ctx Canvas rendering context.
     * @param {number} [cameraX=0] Camera x-position.
     * @param {Object|null} [shield=null] Shield object used for clipping.
     */
    draw(ctx, cameraX = 0, shield = null) {
        if (!this.enabled || !this.image?.complete) return;
        this.prepareScaledTexture();
        ctx.save();
        if (shield) {
            this.applyShieldClip(ctx, shield);
        }
        this.drawSand(ctx, cameraX);
        ctx.restore();
        if (shield) {
            this.drawShieldGlow(ctx, shield);
        }
    }

    /**
     * Applies a clipping region around the shield.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {{x:number, y:number, radius:number}} shield Shield data.
     */
    applyShieldClip(ctx, shield) {
        const { x, y, radius } = shield;
        ctx.beginPath();
        ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        ctx.moveTo(x, y);
        ctx.arc(x, y, radius * 0.9, 0, Math.PI * 2, true);
        ctx.clip("evenodd");
    }

    /**
     * Draws the glow around the shield.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {{x:number, y:number, radius:number}} shield Shield data.
     */
    drawShieldGlow(ctx, shield) {
        const { x, y, radius } = shield;
        const gradient = this.createShieldGradient(ctx, x, y, radius);
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = gradient;
        this.fillShieldCircle(ctx, x, y, radius);
        ctx.restore();
    }

    /**
     * Creates a radial gradient for the shield glow.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} x X-coordinate of the gradient center.
     * @param {number} y Y-coordinate of the gradient center.
     * @param {number} radius Shield radius.
     * @returns {CanvasGradient} Radial gradient instance.
     */
    createShieldGradient(ctx, x, y, radius) {
        const gradient = ctx.createRadialGradient(
            x, y, radius * 0.6,
            x, y, radius
        );
        gradient.addColorStop(0, "rgba(0,160,255,0)");
        gradient.addColorStop(1, "rgba(0,160,255,0.55)");
        return gradient;
    }

    /**
     * Fills the shield circle.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} x X-coordinate of the circle center.
     * @param {number} y Y-coordinate of the circle center.
     * @param {number} radius Shield radius.
     */
    fillShieldCircle(ctx, x, y, radius) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * Draws the sand texture.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} cameraX Camera x-offset.
     */
    drawSand(ctx, cameraX) {
        ctx.save();
        ctx.globalAlpha = this.currentAlpha;
        const tiling = this.getSandTiling(cameraX);
        this.drawSandTiles(ctx, tiling);
        ctx.restore();
    }

    /**
     * Calculates tiling parameters for rendering the sand texture.
     * @param {number} cameraX Camera x-position.
     * @returns {{imgWidth:number, startX:number, repeats:number}} Sand tiling parameters.
     */
    getSandTiling(cameraX) {
        const img = this.scaledImage ?? this.image;
        const imgWidth = img.width;
        const offset = (cameraX + this.scrollX) % imgWidth;
        const startX = -offset;
        const repeats = Math.ceil(this.canvas.width / imgWidth) + 1;
        return { imgWidth, startX, repeats };
    }

    /**
     * Draws tiled sand textures across the canvas.
     * @param {CanvasRenderingContext2D} ctx Canvas rendering context.
     * @param {{imgWidth:number, startX:number, repeats:number}} tiling Sand tiling parameters.
     */
    drawSandTiles(ctx, tiling) {
        const { imgWidth, startX, repeats } = tiling;
        const img = this.scaledImage ?? this.image;
        for (let i = 0; i < repeats; i++) {
            const drawX = startX + i * imgWidth;
            ctx.drawImage(img, drawX, 0);
        }
    }

    /**
     * Enables or disables the sandstorm effect.
     * @param {boolean} val Enabled state.
     */
    setEnabled(val) {
        this.enabled = val;
    }

    /**
     * Sets the base alpha value.
     * @param {number} alpha Alpha value.
     */
    setAlpha(alpha) {
        this.alpha = alpha;
        if (this.currentAlpha == null) this.currentAlpha = alpha;
    }

    /**
     * Sets the scroll speed.
     * @param {number} speed Scroll speed value.
     */
    setSpeed(speed) {
        this.scrollSpeed = speed;
    }

    /**
     * Prepares a scaled version of the texture for the current canvas height.
     */
    prepareScaledTexture() {
        if (!this.image?.complete) return;
        const targetHeight = this.canvas.height;
        if (this.scaledImage && this.scaledHeight === targetHeight) return;
        this.buildScaledTexture(targetHeight);
    }

    /**
     * Builds a scaled texture canvas based on the target height.
     * @param {number} targetHeight Target height for the scaled texture.
     */
    buildScaledTexture(targetHeight) {
        const { width: sourceWidth, height: sourceHeight } = this.image;
        if (!sourceWidth || !sourceHeight) return;
        const targetWidth = Math.max(1, Math.round(sourceWidth * (targetHeight / sourceHeight)));
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(this.image, 0, 0, targetWidth, targetHeight);
        this.scaledImage = canvas;
        this.scaledHeight = targetHeight;
    }
}