/**
 * Displays and manages a hollow hint banner.
 */
export class HollowHint {
    /**
     * Creates a new banner instance.
     * @param {string} text Banner text.
     * @param {*} target Banner target.
     * @param {number} [yOffset=60] Vertical offset.
     * @param {string} [theme="desert"] Banner theme.
     * @param {*} [sound=null] Banner sound.
     */
    constructor(text, target, yOffset = 60, theme = "desert", sound = null) {
        this.initBannerCore(text, target, yOffset, theme, sound);
        this.initBannerVisual();
        this.initBannerSound();
    }

    /**
     * Initializes the core banner properties.
     * @param {string} text Banner text.
     * @param {*} target Banner target.
     * @param {number} yOffset Vertical offset.
     * @param {string} theme Banner theme.
     * @param {*} sound Banner sound.
     * @returns {void}
     */
    initBannerCore(text, target, yOffset, theme, sound) {
        this.text = (text ?? "").toUpperCase();
        this.target = target;
        this.yOffset = yOffset;
        this.theme = theme;
        this.sound = sound;
    }

    /**
     * Initializes the banner visual state.
     */
    initBannerVisual() {
        this.opacity = 0;
        this.showing = false;
        this.active = false;
        this.fadeSpeed = 0.05;
    }

    /**
     * Initializes banner sound timing state.
     */
    initBannerSound() {
        this.lastPlayed = 0;
        this.soundCooldown = 2000;
    }

    /**
     * Shows the banner and plays the show sound if applicable.
     */
    show() {
        const wasHidden = !this.showing && !this.active;
        this.showing = true;
        this.active = true;
        if (!wasHidden || !this.sound) return;
        this.playShowSound();
    }

    /**
     * Plays the banner show sound if the cooldown has elapsed.
     */
    playShowSound() {
        if (!this.sound) return;
        const now = performance.now();
        if (now - this.lastPlayed <= this.soundCooldown) return;
        this.sound.currentTime = 0;
        this.audioManager?.safePlay?.(this.sound) ?? this.sound.play();
        this.lastPlayed = now;
    }

    /**
     * Hides the banner.
     */
    hide() {
        this.showing = false;
    }

    /**
     * Updates the banner opacity and active state.
     */
    update() {
        this.opacity += this.showing ? this.fadeSpeed : -this.fadeSpeed;
        this.opacity = Math.max(0, Math.min(1, this.opacity));
        if (this.opacity <= 0 && !this.showing) this.active = false;
    }

    /**
     * Returns the color palette for the current theme.
     * @returns {*}
     */
    getThemeColors() {
        const theme = this.theme ?? "blue";
        return this.getThemePalette(theme);
    }

    /**
     * Returns the color palette for the given theme.
     * @param {string} theme Theme name.
     * @returns {{hue:number, highlight:string, mid:string, shadow:string, ornament:string, glow:string}}
     */
    getThemePalette(theme) {
        const palettes = {
            gold: { hue: 45, highlight: "#fff6d0", mid: "#ffd27f", shadow: "#7a4a00", ornament: "rgba(255,220,160,1)", glow: "rgba(255,200,100,1)" },
            spirit: { hue: 280, highlight: "#f8e8ff", mid: "#d6b6ff", shadow: "#3a0a80", ornament: "rgba(230,200,255,1)", glow: "rgba(200,160,255,1)" },
            rose: { hue: 320, highlight: "#ffd8f5", mid: "#ff91c6", shadow: "#5a0030", ornament: "rgba(255,180,220,1)", glow: "rgba(255,140,200,1)" },
            desert: { hue: 30, highlight: "#ffe9b8", mid: "#ffad42", shadow: "#6a3200", ornament: "rgba(255,180,70,0.95)", glow: "rgba(255,180,80,1)" },
            blue: { hue: 210, highlight: "#eaf2ff", mid: "#bcd4ff", shadow: "#001a33", ornament: "rgba(200,220,255,1)", glow: "rgba(150,190,255,1)" }
        };
        return palettes[theme] ?? palettes.blue;
    }

    /**
     * Draws decorative ornaments around the banner text.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} x Center x position.
     * @param {number} y Center y position.
     * @param {number} textWidth Width of the text.
     * @param {number} [opacity=1] Ornament opacity.
     * @param {string} [color="rgba(255,180,80,0.9)"] Ornament color.
     */
    drawOrnament(ctx, x, y, textWidth, opacity = 1, color = "rgba(255,180,80,0.9)") {
        ctx.save();
        this.setupOrnamentStyle(ctx, opacity, color);
        const offset = this.getOrnamentOffset(textWidth);
        this.drawOrnamentSide(ctx, x, y, offset, -1);
        this.drawOrnamentSide(ctx, x, y, offset, 1);
        this.drawOrnamentCenter(ctx, x, y, color);
        ctx.restore();
    }

    /**
     * Sets the drawing style for banner ornaments.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} opacity Ornament opacity.
     * @param {string} color Ornament color.
     */
    setupOrnamentStyle(ctx, opacity, color) {
        ctx.globalAlpha = opacity;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.2;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
    }

    /**
     * Calculates the horizontal offset for ornaments based on text width.
     * @param {number} textWidth Width of the text.
     * @returns {number} Ornament offset.
     */
    getOrnamentOffset(textWidth) {
        const base = textWidth * 0.25;
        return Math.min(Math.max(base, 30), 100);
    }

    /**
     * Draws a side ornament.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} x Center x position.
     * @param {number} y Center y position.
     * @param {number} offset Horizontal offset from center.
     * @param {number} dir Direction multiplier.
     */
    drawOrnamentSide(ctx, x, y, offset, dir) {
        const base = x + dir * offset;
        ctx.beginPath();
        ctx.moveTo(base, y);
        ctx.quadraticCurveTo(base + dir * 15, y + 5, base + dir * 20, y + 20);
        ctx.quadraticCurveTo(base + dir * 15, y + 10, base, y + 8);
        ctx.stroke();
    }

    /**
     * Draws the center ornament.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} x Center x position.
     * @param {number} y Center y position.
     * @param {string} color Ornament color.
     */
    drawOrnamentCenter(ctx, x, y, color) {
        ctx.beginPath();
        ctx.moveTo(x, y + 4);
        ctx.lineTo(x + 4, y + 8);
        ctx.lineTo(x, y + 12);
        ctx.lineTo(x - 4, y + 8);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }

    /**
     * Draws the banner if active.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} [cameraX=0] Camera x offset.
     */
    draw(ctx, cameraX = 0) {
        if (!this.active) return;
        this.update();
        const now = performance.now();
        const breathing = 0.97 + Math.sin(now / 1000) * 0.03;
        const shimmer = 0.5 + 0.5 * Math.sin(now / 600);
        const anchor = this.getTargetAnchor();
        if (!anchor) return;
        const x = anchor.headX - cameraX;
        const y = anchor.headY - this.yOffset;
        const theme = this.getThemeColors();
        this.renderBanner(ctx, x, y, breathing, shimmer, theme);
    }

    /**
     * Renders the banner with text, aura, and ornaments.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} x X position.
     * @param {number} y Y position.
     * @param {number} breathing Scale factor for breathing effect.
     * @param {number} shimmer Shimmer intensity.
     * @param {{hue:number, highlight:string, mid:string, shadow:string, ornament:string, glow:string}} theme Theme palette.
     */
    renderBanner(ctx, x, y, breathing, shimmer, theme) {
        const { hue, highlight, mid, shadow, ornament, glow } = theme;
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(breathing, breathing);
        ctx.globalAlpha = this.opacity;
        this.setupTextStyle(ctx);
        const textWidth = ctx.measureText(this.text).width;
        this.drawAura(ctx, hue, textWidth);
        this.drawBannerText(ctx, highlight, mid, shadow, glow, shimmer);
        this.drawOrnament(ctx, 0, 26, textWidth, this.opacity, ornament);
        ctx.restore();
    }

    /**
     * Sets the text style for the banner.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     */
    setupTextStyle(ctx) {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `900 34px 'AlegreyaSC', 'Trajan Pro', serif`;
    }

    /**
     * Draws the aura behind the banner text.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} hue Base hue for the aura.
     * @param {number} textWidth Width of the text.
     */
    drawAura(ctx, hue, textWidth) {
        const baseRadius = 80;
        const auraRadius = Math.min(baseRadius + textWidth * 0.35, 250);
        const aura = ctx.createRadialGradient(0, 0, 5, 0, 0, auraRadius);
        aura.addColorStop(0, `hsla(${hue}, 100%, 85%, 0.25)`);
        aura.addColorStop(0.6, `hsla(${hue}, 100%, 65%, 0.1)`);
        aura.addColorStop(1, `hsla(${hue}, 100%, 45%, 0)`);
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(0, 0, auraRadius, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * Draws the banner text with gradient, shadow, and shimmer effect.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {string} highlight Highlight color.
     * @param {string} mid Mid gradient color.
     * @param {string} shadow Stroke shadow color.
     * @param {string} glow Glow color.
     * @param {number} shimmer Shimmer intensity.
     */
    drawBannerText(ctx, highlight, mid, shadow, glow, shimmer) {
        const textGrad = ctx.createLinearGradient(0, -20, 0, 20);
        textGrad.addColorStop(0, highlight);
        textGrad.addColorStop(0.5, mid);
        textGrad.addColorStop(1, mid);
        ctx.strokeStyle = shadow;
        ctx.lineWidth = 4;
        ctx.strokeText(this.text, 0, 0);
        ctx.shadowColor = glow;
        ctx.shadowBlur = 20 + shimmer * 10;
        ctx.fillStyle = textGrad;
        ctx.fillText(this.text, 0, 0);
    }

    /**
     * Returns the anchor position of the target.
     * @returns {{headX:number, headY:number}|null}
     */
    getTargetAnchor() {
        if (!this.target) return null;
        const hb = this.target.getHitboxRect?.();
        return {
            headX: hb ? hb.cx : (this.target.x + this.target.width * 0.5),
            headY: hb ? hb.top : this.target.y
        };
    }
}