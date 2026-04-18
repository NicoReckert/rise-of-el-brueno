import { hollowHintRenderMethods } from "./hollow-hint-render.methods.js";
import { hollowHintControlMethods } from "./hollow-hint-control.methods.js";

/**
 * Displays and manages a hollow hint banner.
 */
export class HollowHint {
    /**
     * Creates a banner instance.
     * @param {string} text Banner text.
     * @param {Object} target Banner target object.
     * @param {number} [yOffset=60] Vertical offset.
     * @param {string} [theme="desert"] Banner theme.
     * @param {Object} [options={}] Banner options.
     */
    constructor(text, target, yOffset = 60, theme = "desert", { sound = null, audioManager = null, control = null } = {}) {
        this.initBannerCore(text, target, yOffset, theme, sound, audioManager, control);
        this.initBannerVisual();
        this.initBannerSound();
    }

    /**
     * Initializes the banner core state.
     * @param {string} text Banner text.
     * @param {Object} target Banner target object.
     * @param {number} yOffset Vertical offset.
     * @param {string} theme Banner theme.
     * @param {*} sound Sound instance.
     * @param {*} audioManager Audio manager instance.
     * @param {*} control Control configuration.
     * @returns {void}
     */
    initBannerCore(text, target, yOffset, theme, sound, audioManager, control) {
        this.text = (text ?? "").toUpperCase();
        this.target = target;
        this.yOffset = yOffset;
        this.theme = theme;
        this.sound = sound;
        this.audioManager = audioManager;
        this.control = control;
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
     * Plays the show sound.
     * @returns {void}
     */
    playShowSound() {
        if (!this.sound) return;
        const now = performance.now();
        if (now - this.lastPlayed <= this.soundCooldown) return;
        this.sound.currentTime = 0;
        if (this.audioManager?.safePlay) {
            this.audioManager.safePlay(this.sound);
        } else {
            this.sound.play();
        }
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
}

/**
 * Assigns render and control-related methods to the hollow hint prototype.
 */
Object.assign(HollowHint.prototype, hollowHintRenderMethods, hollowHintControlMethods);