export const hollowHintRenderMethods = {
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
    },

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
    },

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
    },

    /**
     * Calculates the horizontal offset for ornaments based on text width.
     * @param {number} textWidth Width of the text.
     * @returns {number} Ornament offset.
     */
    getOrnamentOffset(textWidth) {
        const base = textWidth * 0.25;
        return Math.min(Math.max(base, 30), 100);
    },

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
    },

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
    },

    /**
     * Renders the banner.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} x X position.
     * @param {number} y Y position.
     * @param {number} breathing Breathing scale value.
     * @param {number} shimmer Shimmer value.
     * @param {Object} theme Banner theme data.
     * @returns {void}
     */
    renderBanner(ctx, x, y, breathing, shimmer, theme) {
        this.prepareBannerCanvas(ctx, x, y, breathing);
        const banner = this.getBannerRenderData(ctx, theme);
        this.drawBannerContent(ctx, banner, shimmer);
        ctx.restore();
    },

    /**
     * Gets the banner render data.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {Object} theme Banner theme data.
     * @returns {Object} Banner render data.
     */
    getBannerRenderData(ctx, theme) {
        const { hue, highlight, mid, shadow, ornament, glow } = theme;
        const icon = this.getCurrentControlIcon();
        const iconReady = icon && icon.complete;
        const iconSize = iconReady ? this.getControlIconSize() : 0;
        const gap = iconReady ? 10 : 0;
        const textWidth = ctx.measureText(this.text).width;
        return { hue, highlight, mid, shadow, ornament, glow, icon, iconReady, iconSize, gap, textWidth };
    },

    /**
     * Prepares the canvas for banner rendering.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} x X position.
     * @param {number} y Y position.
     * @param {number} breathing Breathing scale value.
     * @returns {void}
     */
    prepareBannerCanvas(ctx, x, y, breathing) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(breathing, breathing);
        ctx.globalAlpha = this.opacity;
        this.setupTextStyle(ctx);
    },

    /**
     * Draws the banner content.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {Object} banner Banner render data.
     * @param {number} shimmer Shimmer value.
     * @returns {void}
     */
    drawBannerContent(ctx, banner, shimmer) {
        this.drawAura(ctx, banner.hue, banner.textWidth);
        this.drawHintContent(ctx, banner.iconReady ? banner.icon : null, banner.textWidth, banner.iconSize, banner.gap, banner.highlight, banner.mid, banner.shadow, banner.glow, shimmer);
        this.drawOrnament(ctx, 0, 26, banner.textWidth, this.opacity, banner.ornament);
    },

    /**
     * Sets the text style for the banner.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     */
    setupTextStyle(ctx) {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `900 34px 'AlegreyaSC', 'Trajan Pro', serif`;
    },

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
    },

    /**
     * Draws the banner text.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {string} text Banner text.
     * @param {number} x X position.
     * @param {number} y Y position.
     * @param {string} highlight Highlight color.
     * @param {string} mid Mid color.
     * @param {string} shadow Shadow color.
     * @param {string} glow Glow color.
     * @param {number} shimmer Shimmer value.
     * @returns {void}
     */
    drawBannerText(ctx, text, x, y, highlight, mid, shadow, glow, shimmer) {
        const textGrad = ctx.createLinearGradient(0, -20, 0, 20);
        textGrad.addColorStop(0, highlight);
        textGrad.addColorStop(0.5, mid);
        textGrad.addColorStop(1, mid);
        ctx.strokeStyle = shadow;
        ctx.lineWidth = 4;
        ctx.strokeText(text, x, y);
        ctx.shadowColor = glow;
        ctx.shadowBlur = 20 + shimmer * 10;
        ctx.fillStyle = textGrad;
        ctx.fillText(text, x, y);
    },

    /**
     * Draws the hint content.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {*} icon Control icon.
     * @param {number} textWidth Text width.
     * @param {number} iconSize Icon size.
     * @param {number} gap Gap between text and icon.
     * @param {string} highlight Highlight color.
     * @param {string} mid Mid color.
     * @param {string} shadow Shadow color.
     * @param {string} glow Glow color.
     * @param {number} shimmer Shimmer value.
     * @returns {void}
     */
    drawHintContent(ctx, icon, textWidth, iconSize, gap, highlight, mid, shadow, glow, shimmer) {
        this.drawBannerText(ctx, this.text, 0, 0, highlight, mid, shadow, glow, shimmer);
        if (icon) {
            const iconX = textWidth / 2 + gap + iconSize / 2;
            const iconY = this.getControlIconYOffset();
            this.drawControlIcon(ctx, icon, iconX, iconY, iconSize);
        }
    },

    /**
     * Draws the control icon.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {*} icon Control icon.
     * @param {number} x X position.
     * @param {number} y Y position.
     * @param {number} size Icon size.
     * @returns {void}
     */
    drawControlIcon(ctx, icon, x, y, size) {
        ctx.save();
        ctx.shadowColor = "rgba(255,255,255,0.25)";
        ctx.shadowBlur = 8;
        ctx.drawImage(icon, x - size / 2, y - size / 2, size, size);
        ctx.restore();
    },

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
};