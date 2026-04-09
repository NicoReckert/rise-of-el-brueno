import { cutsceneIndicatorMethods } from "./cutscene-indicator.methods.js";

/**
 * Cutscene indicator.
 */
export class CutsceneIndicator {
    /**
     * Cutscene indicator.
     * @param {Object} world World reference.
     */
    constructor(world) {
        this.world = world;
        this.active = false;
        this.showing = false;
        this.showSkip = false;
        this.opacity = 0;
        this.fadeSpeed = 0.05;
        this.iconInterval = 1400;
        this.initPanelIcons();
        this.initPanelTargets();
        this.initPanelTouchState();
    }

    /**
     * Initializes panel icons.
     * @returns {void}
     */
    initPanelIcons() {
        this.playIcon = new Image();
        this.playIcon.src = "./assets/icons/cutscene_play.png";
        this.skipIcon = new Image();
        this.skipIcon.src = "./assets/icons/skip.png";
    }

    /**
     * Initializes the panel target elements.
     */
    initPanelTargets() {
        this.touchControlsElement = document.getElementById("touch-controls");
        this.canvas = this.world?.canvas || document.getElementById("canvas");
    }

    /**
     * Initializes the panel touch state.
     */
    initPanelTouchState() {
        this.boundHandlePanelTouch = this.handlePanelTouch.bind(this);
        this.panelTouchBound = false;
    }

    /**
     * Shows the panel.
     * @param {Object} [options={}] Show options.
     * @param {boolean} [options.skippable=false] Whether the panel can be skipped.
     */
    show({ skippable = false } = {}) {
        const wasInactive = !this.active && !this.showing;
        this.showing = true;
        this.active = true;
        this.showSkip = skippable;
        this.updatePanelTouchState(skippable);
        if (wasInactive) this.playPanelShowSfx();
    }

    /**
     * Updates the panel touch state.
     * @param {boolean} skippable Whether the panel can be skipped.
     */
    updatePanelTouchState(skippable) {
        this.hideTouchControls();
        if (skippable) return this.bindPanelTouch();
        this.unbindPanelTouch();
    }

    /**
     * Plays the panel show sound effect.
     */
    playPanelShowSfx() {
        this.world.audioManager?.playOneShot("cutsceneIndicatorOnSfx", { volume: 0.35 });
    }

    /**
     * Hides the panel.
     */
    hide() {
        const wasShowing = this.active || this.showing;
        this.showing = false;
        this.showSkip = false;
        this.unbindPanelTouch();
        if (wasShowing) {
            this.world.audioManager?.playOneShot("cutsceneIndicatorOffSfx", { volume: 0.45 });
        }
    }

    /**
     * Updates the panel state.
     */
    update() {
        this.opacity += this.showing ? this.fadeSpeed : -this.fadeSpeed;
        this.opacity = Math.max(0, Math.min(1, this.opacity));
        if (this.opacity <= 0 && !this.showing) {
            this.active = false;
            this.showTouchControls();
        }
    }

    /**
     * Draws the panel.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     */
    draw(ctx) {
        if (!this.active) return;
        this.update();
        const now = performance.now();
        const pulse = 0.5 + Math.sin(now / 420) * 0.5;
        const metrics = this.getPanelMetrics(ctx);
        ctx.save();
        ctx.globalAlpha = this.opacity;
        this.drawTriangle(ctx, metrics);
        this.drawAccentLine(ctx, metrics);
        this.drawIcon(ctx, pulse, metrics);
        ctx.restore();
    }
}

/**
 * Assigns the cutscene indicator methods to the prototype.
 */
Object.assign(CutsceneIndicator.prototype, cutsceneIndicatorMethods);