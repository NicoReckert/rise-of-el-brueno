/**
 * Dark ribbon effect controller.
 */
class DarkRibbon {
    /**
     * Creates a new instance.
     * @param {number} worldWidth World width.
     * @param {number} worldHeight World height.
     * @param {object} [opts={}] Configuration options.
     */
    constructor(
        worldWidth,
        worldHeight,
        opts = {}
    ) {
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.initOptions(worldHeight, opts);
        this.reset(true);
    }

    /**
     * Initializes configuration options.
     * @param {number} worldHeight World height.
     * @param {object} [opts={}] Configuration options.
     * @returns {void}
     */
    initOptions(worldHeight, opts = {}) {
        const base = this.getDefaultOptions(worldHeight);
        this.opts = { ...base, ...opts };
    }

    /**
     * Returns the default configuration options.
     * @param {number} worldHeight World height.
     * @returns {object} Default configuration options.
     */
    getDefaultOptions(worldHeight) {
        return {
            ...this.getDefaultYOptions(worldHeight),
            ...this.getDefaultGeomOptions(),
            ...this.getDefaultWobbleOptions(),
            ...this.getDefaultAlphaOptions()
        };
    }

    /**
     * Returns default Y position options.
     * @param {number} worldHeight World height.
     * @returns {object} Y position options.
     */
    getDefaultYOptions(worldHeight) {
        return {
            yMin: 0,
            yMax: worldHeight * 0.55
        };
    }

    /**
     * Returns default geometry options.
     * @returns {object} Geometry options.
     */
    getDefaultGeomOptions() {
        return {
            minLen: 220,
            maxLen: 520,
            minWidth: 2,
            maxWidth: 7,
            speedMin: 0.25,
            speedMax: 0.8
        };
    }

    /**
     * Returns default wobble options.
     * @returns {object} Wobble options.
     */
    getDefaultWobbleOptions() {
        return {
            wobbleAmpMin: 8,
            wobbleAmpMax: 26,
            wobbleFreqMin: 0.01,
            wobbleFreqMax: 0.028
        };
    }

    /**
     * Returns default alpha options.
     * @returns {object} Alpha options.
     */
    getDefaultAlphaOptions() {
        return {
            alphaMin: 0.05,
            alphaMax: 0.16
        };
    }

    /**
     * Resets the ribbon state.
     * @param {boolean} [initial=false] Whether the reset is the initial setup.
     * @returns {void}
     */
    reset(initial = false) {
        const o = this.opts;
        this.initLengthAndWidth(o);
        this.initPosition(initial, o);
        this.initMotion(o);
        this.initAppearance(o);
    }

    /**
     * Initializes ribbon length and width.
     * @param {object} o Configuration options.
     * @returns {void}
     */
    initLengthAndWidth(o) {
        this.len = o.minLen + Math.random() * (o.maxLen - o.minLen);
        this.baseWidth = o.minWidth + Math.random() * (o.maxWidth - o.minWidth);
    }

    /**
     * Initializes ribbon position.
     * @param {boolean} initial Whether the reset is the initial setup.
     * @param {object} o Configuration options.
     * @returns {void}
     */
    initPosition(initial, o) {
        this.x = initial
            ? Math.random() * this.worldWidth
            : this.worldWidth + 50 + Math.random() * this.worldWidth * 0.4;
        this.y = o.yMin + Math.random() * (o.yMax - o.yMin);
    }

    /**
     * Initializes ribbon motion properties.
     * @param {object} o Configuration options.
     * @returns {void}
     */
    initMotion(o) {
        this.speedX = -(o.speedMin + Math.random() * (o.speedMax - o.speedMin));
        this.amp = o.wobbleAmpMin + Math.random() * (o.wobbleAmpMax - o.wobbleAmpMin);
        this.freq = o.wobbleFreqMin + Math.random() * (o.wobbleFreqMax - o.wobbleFreqMin);
    }

    /**
     * Initializes ribbon appearance properties.
     * @param {object} o Configuration options.
     * @returns {void}
     */
    initAppearance(o) {
        this.alpha = o.alphaMin + Math.random() * (o.alphaMax - o.alphaMin);
        this.phase = Math.random() * Math.PI * 2;
        this.slope = (Math.random() - 0.5) * 0.25;
    }

    /**
     * Updates the ribbon state for the current frame.
     * @param {number} time Current time value.
     * @param {number} cameraX Camera x position.
     * @param {number} viewportW Viewport width.
     * @returns {void}
     */
    update(time, cameraX, viewportW) {
        this.advanceDustMotion(time);
        this.resetDustIfOffscreen(cameraX, viewportW);
    }

    /**
     * Updates the dust motion state.
     * @param {number} time Current time value.
     * @returns {void}
     */
    advanceDustMotion(time) {
        this.x += this.speedX;
        this.phase += 0.015;
        this.pulse = 0.75 + Math.sin(time * 0.0018 + this.phase) * 0.25;
    }

    /**
     * Resets the dust position if it is offscreen.
     * @param {number} cameraX Current camera x position.
     * @param {number} viewportW Viewport width.
     * @returns {void}
     */
    resetDustIfOffscreen(cameraX, viewportW) {
        const leftKill = cameraX - this.len - 250;
        if (this.x >= leftKill) return;
        this.repositionDust(cameraX, viewportW);
    }

    /**
     * Repositions the dust with randomized properties.
     * @param {number} cameraX Current camera x position.
     * @param {number} viewportW Viewport width.
     * @returns {void}
     */
    repositionDust(cameraX, viewportW) {
        const o = this.opts;
        this.x = cameraX + viewportW + 200 + Math.random() * 400;
        this.y = o.yMin + Math.random() * (o.yMax - o.yMin);
        this.len = o.minLen + Math.random() * (o.maxLen - o.minLen);
        this.baseWidth = o.minWidth + Math.random() * (o.maxWidth - o.minWidth);
        this.amp = o.wobbleAmpMin + Math.random() * (o.wobbleAmpMax - o.wobbleAmpMin);
        this.freq = o.wobbleFreqMin + Math.random() * (o.wobbleFreqMax - o.wobbleFreqMin);
        this.alpha = o.alphaMin + Math.random() * (o.alphaMax - o.alphaMin);
        this.slope = (Math.random() - 0.5) * 0.6;
    }

    /**
     * Draws the dust trail if it is visible on screen.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} cameraX Current camera x position.
     * @param {number} canvasWidth Canvas width.
     * @returns {void}
     */
    draw(ctx, cameraX, canvasWidth) {
        const screenX = this.x - cameraX;
        if (!this.isTrailOnScreen(screenX, canvasWidth)) return;
        const { a, points } = this.buildTrailPoints(screenX);
        ctx.save();
        this.drawBaseTrail(ctx, a, points);
        this.drawGlowTrail(ctx, a, points);
        this.drawHighlightTrail(ctx, a, points);
        ctx.restore();
    }

    /**
     * Checks whether the trail is visible on screen.
     * @param {number} screenX Trail x position on screen.
     * @param {number} canvasWidth Canvas width.
     * @returns {boolean} True if the trail is visible on screen, otherwise false.
     */
    isTrailOnScreen(screenX, canvasWidth) {
        if (screenX > canvasWidth + 200) return false;
        if (screenX < -this.len - 220) return false;
        return true;
    }

    /**
     * Builds the trail point data.
     * @param {number} screenX Trail x position on screen.
     * @returns {{ a: number, points: Array }} Trail alpha and point data.
     */
    buildTrailPoints(screenX) {
        const segments = 10;
        const step = this.len / segments;
        const a = this.alpha * this.pulse;
        const points = [];
        for (let i = 0; i <= segments; i++) {
            points.push(this.buildTrailPoint(screenX, step, i));
        }
        return { a, points };
    }

    /**
     * Builds a single trail point.
     * @param {number} screenX Trail x position on screen.
     * @param {number} step Distance between trail segments.
     * @param {number} i Current segment index.
     * @returns {{ x: number, y: number }} Trail point coordinates.
     */
    buildTrailPoint(screenX, step, i) {
        const px = screenX + i * step;
        const t = (this.x + i * step) * this.freq + this.phase;
        const wobble =
            Math.sin(t) * this.amp +
            Math.sin(t * 0.7) * (this.amp * 0.35);
        const jitter =
            (Math.sin(t * 2.3) + Math.cos(t * 1.7)) * 1.2;
        const py = this.y + wobble + i * this.slope + jitter;
        return { x: px, y: py };
    }

    /**
     * Draws the base trail.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} a Trail alpha value.
     * @param {Array} points Trail point data.
     * @returns {void}
     */
    drawBaseTrail(ctx, a, points) {
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = a * 0.9;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "rgba(10, 6, 18, 0.9)";
        ctx.lineWidth = this.baseWidth * 0.85;
        this.strokeSmooth(ctx, points);
    }

    /**
     * Draws the glow trail.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} a Trail alpha value.
     * @param {Array} points Trail point data.
     * @returns {void}
     */
    drawGlowTrail(ctx, a, points) {
        ctx.globalCompositeOperation = "screen";
        ctx.globalAlpha = a;
        const g = this.createGlowGradient(ctx, points);
        ctx.strokeStyle = g;
        ctx.lineWidth = this.baseWidth * 2.2;
        this.strokeSmooth(ctx, points);
    }

    /**
     * Creates the glow gradient for the trail.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {Array} points Trail point data.
     * @returns {CanvasGradient} Glow gradient.
     */
    createGlowGradient(ctx, points) {
        const start = points[0];
        const end = points[points.length - 1];
        const g = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
        g.addColorStop(0.0, "rgba(200, 90, 255, 0.00)");
        g.addColorStop(0.18, "rgba(200, 90, 255, 0.65)");
        g.addColorStop(0.42, "rgba(120, 60, 220, 0.18)");
        g.addColorStop(0.62, "rgba(220, 120, 255, 0.55)");
        g.addColorStop(1.0, "rgba(200, 90, 255, 0.00)");
        return g;
    }

    /**
     * Draws the highlight trail.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} a Trail alpha value.
     * @param {Array} points Trail point data.
     * @returns {void}
     */
    drawHighlightTrail(ctx, a, points) {
        ctx.globalCompositeOperation = "screen";
        ctx.globalAlpha = a * 0.9;
        ctx.strokeStyle = "rgba(180, 170, 150, 0.35)";
        ctx.lineWidth = this.baseWidth * 2.6;
        this.strokeSmooth(ctx, points);
    }

    /**
     * Draws a smoothed trail path.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {Array} pts Trail point data.
     * @returns {void}
     */
    strokeSmooth(ctx, pts) {
        if (pts.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length - 1; i++) {
            const xc = (pts[i].x + pts[i + 1].x) / 2;
            const yc = (pts[i].y + pts[i + 1].y) / 2;
            ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
        }
        const last = pts[pts.length - 1];
        ctx.lineTo(last.x, last.y);
        ctx.stroke();
    }
}

/**
 * Manages and renders multiple dark ribbon effects.
 */
export class DarkEnergyEffect {
    /**
     * Creates a new dark ribbon manager instance.
     * @param {number} worldWidth World width.
     * @param {number} worldHeight World height.
     * @param {number} [ribbonCount=10] Number of ribbons.
     * @param {Object} [options={}] Ribbon options.
     */
    constructor(worldWidth, worldHeight, ribbonCount = 10, options = {}) {
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.ribbons = Array.from({ length: ribbonCount }, () => new DarkRibbon(worldWidth, worldHeight, options));
    }

    /**
     * Updates all dark ribbon effects.
     * @param {number} [time=performance.now()] Current time value.
     * @param {number} [cameraX=0] Current camera x position.
     * @param {number} [viewportW=800] Viewport width.
     * @returns {void}
     */
    update(time = performance.now(), cameraX = 0, viewportW = 800) {
        for (const r of this.ribbons) r.update(time, cameraX, viewportW);
    }

    /**
     * Draws all dark ribbon effects.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} cameraX Current camera x position.
     * @returns {void}
     */
    draw(ctx, cameraX) {
        const canvasWidth = ctx.canvas.width;
        for (const r of this.ribbons) r.draw(ctx, cameraX, canvasWidth);
    }
}