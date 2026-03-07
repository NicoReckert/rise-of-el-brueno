/**
 * Displays and updates the intro screen.
 */
export class IntroScreen {
    /**
     * Creates a new prolog screen instance.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {HTMLCanvasElement} canvas Canvas element.
     * @param {string} [text="Prolog"] Display text.
     */
    constructor(ctx, canvas, text = "Prolog") {
        this.ctx = ctx;
        this.canvas = canvas;
        this.text = text;
        this.initFadeConfig();
        this.initBackgroundImage();
    }

    /**
     * Initializes the fade configuration.
     * @returns {void}
     */
    initFadeConfig() {
        this.alpha = 0;
        this.fadeInSpeed = 0.02;
        this.fadeOutSpeed = 0.0035;
        this.duration = 2000;
        this.visibleTime = 0;
        this.phase = "fadeIn";
        this.done = false;
        this.bgOverlayAlpha = 0.2;
        this.time = 0;
    }

    /**
     * Initializes the background image.
     * @returns {void}
     */
    initBackgroundImage() {
        this.bgImage = new Image();
        this.bgLoaded = false;
        this.bgImage.onload = () => (this.bgLoaded = true);
        this.bgImage.onerror = () => (this.bgLoaded = false);
        this.bgImage.src = "./assets/img/intro_background.webp";
    }

    /**
     * Updates the intro screen state.
     * @param {number} deltaTime Time since the last update.
     * @returns {void}
     */
    update(deltaTime) {
        this.time += deltaTime * 0.005;
        if (this.phase === "fadeIn") { this.updateFadeIn(); return; }
        if (this.phase === "visible") { this.updateVisible(deltaTime); return; }
        if (this.phase === "fadeOut") { this.updateFadeOut(); }
    }

    /**
     * Updates the fade-in phase.
     * @returns {void}
     */
    updateFadeIn() {
        this.alpha += this.fadeInSpeed;
        if (this.alpha < 1) return;
        this.alpha = 1;
        this.phase = "visible";
    }

    /**
     * Updates the visible phase.
     * @param {number} deltaTime Time since the last update.
     * @returns {void}
     */
    updateVisible(deltaTime) {
        this.visibleTime += deltaTime;
        if (this.visibleTime < this.duration) return;
        this.phase = "fadeOut";
    }

    /**
     * Updates the fade-out phase.
     * @returns {void}
     */
    updateFadeOut() {
        this.alpha -= this.fadeOutSpeed;
        if (this.alpha > 0) return;
        this.alpha = 0;
        this.done = true;
    }

    /**
     * Draws the intro screen.
     * @returns {void}
     */
    draw() {
        const ctx = this.ctx;
        ctx.save();
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBackground(ctx);
        this.drawTitle(ctx);
        ctx.globalAlpha = 1.0;
        ctx.restore();
    }

    /**
     * Draws the background layer.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @returns {void}
     */
    drawBackground(ctx) {
        if (this.bgLoaded) {
            ctx.globalAlpha = this.alpha;
            ctx.drawImage(this.bgImage, 0, 0, this.canvas.width, this.canvas.height);
            if (this.bgOverlayAlpha > 0) {
                ctx.fillStyle = `rgba(0,0,0,${this.bgOverlayAlpha})`;
                ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            }
            ctx.globalAlpha = 1.0;
            return;
        }
        ctx.fillStyle = `rgba(0,0,0,${0.5 * this.alpha})`;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draws the title.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @returns {void}
     */
    drawTitle(ctx) {
        ctx.globalAlpha = this.alpha;
        this.setupTitleFont(ctx);
        const gradient = this.createTitleGradient(ctx);
        ctx.fillStyle = gradient;
        ctx.lineWidth = 6;
        ctx.strokeStyle = "rgba(30,15,0,0.9)";
        this.strokeTitle(ctx);
        this.fillTitleWithGlow(ctx);
        this.fillTitleHighlight(ctx);
    }

    /**
     * Configures the title font settings.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @returns {void}
     */
    setupTitleFont(ctx) {
        ctx.font = "bold 90px 'UncialAntiqua', serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
    }

    /**
     * Creates the title gradient.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @returns {CanvasGradient} Title gradient.
     */
    createTitleGradient(ctx) {
        const cy = this.canvas.height / 2;
        const g = ctx.createLinearGradient(0, cy - 60, 0, cy + 60);
        g.addColorStop(0, "#fff8dc");
        g.addColorStop(1, "#e6b800");
        return g;
    }

    /**
     * Strokes the title text.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @returns {void}
     */
    strokeTitle(ctx) {
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;
        ctx.strokeText(this.text, cx, cy);
    }

    /**
     * Fills the title text with a glow effect.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @returns {void}
     */
    fillTitleWithGlow(ctx) {
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;
        const glowStrength = 40 + Math.sin(this.time * 3) * 10;
        ctx.shadowColor = "rgba(255,200,50,0.9)";
        ctx.shadowBlur = glowStrength;
        ctx.fillText(this.text, cx, cy);
    }

    /**
     * Fills the title text with a highlight effect.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @returns {void}
     */
    fillTitleHighlight(ctx) {
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;
        const hi = ctx.createLinearGradient(0, cy - 60, 0, cy);
        hi.addColorStop(0, "rgba(255,255,255,0.8)");
        hi.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = hi;
        ctx.shadowBlur = 0;
        ctx.fillText(this.text, cx, cy);
    }
}