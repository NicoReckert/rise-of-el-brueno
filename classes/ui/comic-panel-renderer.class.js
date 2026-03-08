/**
 * Renders comic panel effects onto a canvas.
 */
export class ComicPanelRenderer {
    /**
     * Creates a new renderer instance.
     * @param {HTMLCanvasElement} canvas Target canvas.
     */
    constructor(canvas) {
        this.canvas = canvas;
    }

    /**
     * Draws the panel effect on the canvas.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {Object} panel Panel instance.
     * @returns {void}
     */
    draw(ctx, panel) {
        if (!this.canDrawEffect(panel)) return;
        const { W, H } = this.getCanvasSize();
        ctx.save();
        ctx.globalAlpha = panel.opacity;
        this.drawEffectPanel(ctx, W, H);
        this.drawEffectContent(ctx, panel, W, H);
        ctx.restore();
    }

    /**
     * Checks whether the panel effect can be drawn.
     * @param {Object} panel Panel instance.
     * @returns {boolean} True if the effect can be drawn.
     */
    canDrawEffect(panel) {
        return panel.active && panel.totalFrames !== 0;
    }

    /**
     * Returns the canvas size.
     * @returns {{W: number, H: number}} Canvas width and height.
     */
    getCanvasSize() {
        return { W: this.canvas.width, H: this.canvas.height };
    }

    /**
     * Draws the background panel shape and prepares the clipped drawing area.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} W Canvas width.
     * @param {number} H Canvas height.
     * @returns {void}
     */
    drawEffectPanel(ctx, W, H) {
        const panel = this.getEffectPanelPoints(W, H);
        const gradient = this.createPanelGradient(ctx, W, H);
        this.traceEffectPanel(ctx, panel);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.lineWidth = 10;
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.save();
        ctx.clip();
    }

    /**
     * Returns the panel corner points.
     * @param {number} W Canvas width.
     * @param {number} H Canvas height.
     * @returns {{topRight:{x:number,y:number},bottomRight:{x:number,y:number},bottomLeft:{x:number,y:number}}} Panel points.
     */
    getEffectPanelPoints(W, H) {
        return {
            topRight: { x: W, y: 0 },
            bottomRight: { x: W, y: H },
            bottomLeft: { x: W * 0.50, y: H }
        };
    }

    /**
     * Creates the gradient used for the panel background.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} W Canvas width.
     * @param {number} H Canvas height.
     * @returns {CanvasGradient} Panel gradient.
     */
    createPanelGradient(ctx, W, H) {
        const gradient = ctx.createLinearGradient(W, 0, W * 0.50, H);
        gradient.addColorStop(0, "rgba(250,245,230,0.95)");
        gradient.addColorStop(1, "rgba(230,220,200,0.94)");
        return gradient;
    }

    /**
     * Traces the panel path on the canvas.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {{topRight:{x:number,y:number},bottomRight:{x:number,y:number},bottomLeft:{x:number,y:number}}} panel Panel points.
     * @returns {void}
     */
    traceEffectPanel(ctx, panel) {
        ctx.beginPath();
        ctx.moveTo(panel.topRight.x, panel.topRight.y);
        ctx.lineTo(panel.bottomRight.x, panel.bottomRight.y);
        ctx.lineTo(panel.bottomLeft.x, panel.bottomLeft.y);
        ctx.closePath();
    }

    /**
     * Draws the panel content including vignette and sprite.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {Object} panel Panel instance.
     * @param {number} W Canvas width.
     * @param {number} H Canvas height.
     * @returns {void}
     */
    drawEffectContent(ctx, panel, W, H) {
        this.drawVignette(ctx, W, H);
        const info = panel.getCurrentFrameInfo();
        if (info) this.drawEffectSprite(ctx, info, W, H);
        ctx.restore();
    }

    /**
     * Draws a vignette overlay on the panel.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} W Canvas width.
     * @param {number} H Canvas height.
     * @returns {void}
     */
    drawVignette(ctx, W, H) {
        const vignette = ctx.createRadialGradient(W * 0.8, H * 0.5, 10, W * 0.8, H * 0.5, W * 0.6);
        vignette.addColorStop(0, "rgba(0,0,0,0)");
        vignette.addColorStop(1, "rgba(0,0,0,0.20)");
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, W, H);
    }

    /**
     * Draws the effect sprite.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {Object} info Frame rendering information.
     * @param {number} W Canvas width.
     * @param {number} H Canvas height.
     * @returns {void}
     */
    drawEffectSprite(ctx, info, W, H) {
        const { image: img, frameWidth, frameHeight, frameSource } = info;
        this.drawEffectGlow(ctx, W, H);
        const rect = this.getEffectDrawRect(frameWidth, frameHeight, W, H);
        this.drawMirroredEffectFrame(ctx, img, frameSource, rect);
    }

    /**
     * Draws a glow effect behind the sprite.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} W Canvas width.
     * @param {number} H Canvas height.
     * @returns {void}
     */
    drawEffectGlow(ctx, W, H) {
        const glowX = W * 0.83;
        const glowY = H * 0.53;
        const glow = ctx.createRadialGradient(glowX, glowY, 5, glowX, glowY, 250);
        glow.addColorStop(0, "rgba(80,180,255,0.45)");
        glow.addColorStop(1, "rgba(80,180,255,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, W, H);
    }

    /**
     * Calculates the draw rectangle for the effect sprite.
     * @param {number} frameWidth Frame width.
     * @param {number} frameHeight Frame height.
     * @param {number} W Canvas width.
     * @param {number} H Canvas height.
     * @returns {{w:number,h:number,drawX:number,drawY:number}} Draw rectangle.
     */
    getEffectDrawRect(frameWidth, frameHeight, W, H) {
        const scale = 1.25;
        const w = frameWidth * scale;
        const h = frameHeight * scale;
        const drawX = W * 0 - w * 0.25;
        const drawY = H * 0.25;
        return { w, h, drawX, drawY };
    }

    /**
     * Draws a mirrored frame with shadow effects.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {HTMLImageElement|Object} img Image source.
     * @param {Object|null} frameSource Source rectangle for the frame.
     * @param {{w:number,h:number,drawX:number,drawY:number}} rect Draw rectangle.
     * @returns {void}
     */
    drawMirroredEffectFrame(ctx, img, frameSource, rect) {
        ctx.save();
        ctx.translate(this.canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.shadowColor = "rgba(0,0,0,0.45)";
        ctx.shadowBlur = 35;
        ctx.shadowOffsetX = -25;
        ctx.shadowOffsetY = 20;
        this.drawFrame(ctx, img, frameSource, rect.drawX, rect.drawY, rect.w, rect.h);
        ctx.restore();
    }

    /**
     * Draws a frame on the canvas.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {HTMLImageElement|Object} img Image source.
     * @param {Object|null} frameSource Source rectangle for the frame.
     * @param {number} dx Destination X position.
     * @param {number} dy Destination Y position.
     * @param {number} dw Destination width.
     * @param {number} dh Destination height.
     * @returns {void}
     */
    drawFrame(ctx, img, frameSource, dx, dy, dw, dh) {
        if (frameSource) return this.drawCroppedFrame(ctx, img, frameSource, dx, dy, dw, dh);
        this.drawFullFrame(ctx, img, dx, dy, dw, dh);
    }

    /**
     * Draws a cropped frame from a sprite sheet.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {HTMLImageElement|Object} img Image source.
     * @param {{sx:number,sy:number,sw:number,sh:number}} frameSource Source rectangle.
     * @param {number} dx Destination X position.
     * @param {number} dy Destination Y position.
     * @param {number} dw Destination width.
     * @param {number} dh Destination height.
     * @returns {void}
     */
    drawCroppedFrame(ctx, img, frameSource, dx, dy, dw, dh) {
        ctx.drawImage(
            img,
            frameSource.sx,
            frameSource.sy,
            frameSource.sw,
            frameSource.sh,
            dx,
            dy,
            dw,
            dh
        );
    }

    /**
     * Draws a full image frame.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {HTMLImageElement|Object} img Image source.
     * @param {number} dx Destination X position.
     * @param {number} dy Destination Y position.
     * @param {number} dw Destination width.
     * @param {number} dh Destination height.
     * @returns {void}
     */
    drawFullFrame(ctx, img, dx, dy, dw, dh) {
        ctx.drawImage(img, dx, dy, dw, dh);
    }
}