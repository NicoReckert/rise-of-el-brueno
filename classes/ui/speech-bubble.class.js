import { SpeechBubbleRenderer } from "./speech-bubble-renderer.class.js";

/**
 * Displays and manages a speech bubble dialog.
 */
export class SpeechBubble {
    /**
     * Creates a new dialog instance.
     * @param {string} text Dialog text.
     * @param {string} [target="canvas"] Dialog target.
     * @param {string} [type="speech"] Dialog type.
     * @param {{ yOffset?: number, audioManager?: Object | null }} [options={}] Dialog options.
     */
    constructor(text, target = "canvas", type = "speech", { yOffset = 60, audioManager = null } = {}) {
        this.renderer = new SpeechBubbleRenderer();
        this.initDialogCore(text, target, type, yOffset, audioManager);
        this.initDialogTiming();
        this.initDialogVisualState();
    }

    /**
     * Initializes the core dialog properties.
     * @param {string} text Dialog text.
     * @param {string} target Dialog target.
     * @param {string} type Dialog type.
     * @param {number} yOffset Vertical offset.
     * @param {Object | null} audioManager Audio manager instance.
     * @returns {void}
     */
    initDialogCore(text, target, type, yOffset, audioManager) {
        this.audioManager = audioManager;
        this.fullText = text;
        this.displayedText = "";
        this.target = target;
        this.type = type;
        this.yOffset = yOffset;
    }

    /**
     * Initializes the dialog timing properties.
     * @returns {void}
     */
    initDialogTiming() {
        this.startTime = null;
        this.fadeOutStart = null;
        this.fadeDuration = 600;
        this.charDelay = 45;
        this.active = false;
    }

    /**
     * Initializes the dialog visual state.
     * @returns {void}
     */
    initDialogVisualState() {
        this.scale = 0.9;
        this.opacity = 1;
        this.floatOffset = 0;
        this.loopSoundInstance = null;
    }

    /**
     * Starts the dialog display.
     * @param {number | null} [duration=null] Display duration in milliseconds.
     * @param {number} [now=performance.now()] Current time value.
     * @returns {void}
     */
    start(duration = null, now = performance.now()) {
        this.startTime = now;
        this.displayedText = this.type === "info" ? this.fullText : '';
        this.active = true;
        this.scale = 0.9;
        this.opacity = 0;
        this.floatOffset = 0;
        this.stopTypingLoopSound();
        if (duration == null) duration = this.getRecommendedHoldMs();
        this.fadeOutStart = this.startTime + duration;
    }

    /**
     * Schedules the dialog fade-out.
     * @param {number} [after=3000] Delay before fade-out in milliseconds.
     * @param {number} [now=performance.now()] Current time value.
     * @returns {void}
     */
    fadeOut(after = 3000, now = performance.now()) {
        if (this.startTime == null) return;
        this.fadeOutStart = now + after;
    }

    /**
     * Starts the typing loop sound.
     * @returns {void}
     */
    startTypingLoopSound() {
        if (!this.audioManager) return;
        if (this.loopSoundInstance && !this.loopSoundInstance.paused) return;
        this.loopSoundInstance = this.audioManager.playOneShot("genericSpeechBlip", {
            volume: 0.35,
            loop: true
        });
    }

    /**
     * Stops the typing loop sound.
     * @returns {void}
     */
    stopTypingLoopSound() {
        if (!this.loopSoundInstance) return;
        this.loopSoundInstance.pause();
        this.loopSoundInstance.currentTime = 0;
        this.loopSoundInstance = null;
    }

    /**
     * Updates the dialog state.
     * @param {number} currentTime Current time value.
     * @returns {void}
     */
    update(currentTime) {
        if (this.handleInactiveDialog()) return;
        const elapsed = Math.max(0, currentTime - this.startTime);
        this.updateDialogOpacity(currentTime, elapsed);
        if (!this.active) return;
        this.updateDialogTransform(elapsed);
        if (this.type === "info") {
            this.displayedText = this.fullText;
            this.stopTypingLoopSound();
            return;
        }
        this.updateTypingProgress(elapsed);
    }

    /**
     * Checks whether the dialog is inactive.
     * @returns {boolean} True if the dialog is inactive, otherwise false.
     */
    handleInactiveDialog() {
        if (!this.active || this.startTime == null) {
            this.stopTypingLoopSound();
            return true;
        }
        return false;
    }

    /**
     * Updates the dialog opacity.
     * @param {number} currentTime Current time value.
     * @param {number} elapsed Elapsed time since start.
     * @returns {void}
     */
    updateDialogOpacity(currentTime, elapsed) {
        const fadeInTime = 250;
        let opacity = elapsed < fadeInTime ? elapsed / fadeInTime : 1;
        if (this.fadeOutStart != null && currentTime > this.fadeOutStart) {
            const fadeProgress = this.getFadeOutProgress(currentTime);
            if (this.finishIfFullyFaded(fadeProgress)) return;
            opacity = 1 - fadeProgress;
        }
        this.opacity = opacity;
    }

    /**
     * Gets the fade-out progress.
     * @param {number} currentTime Current time value.
     * @returns {number} Fade-out progress.
     */
    getFadeOutProgress(currentTime) {
        const t = (currentTime - this.fadeOutStart) / this.fadeDuration;
        return Math.min(t, 1);
    }

    /**
     * Finishes the dialog if fully faded out.
     * @param {number} fadeProgress Fade-out progress.
     * @returns {boolean} True if the dialog finished fading, otherwise false.
     */
    finishIfFullyFaded(fadeProgress) {
        if (fadeProgress < 1) return false;
        this.opacity = 0;
        this.active = false;
        this.stopTypingLoopSound();
        return true;
    }

    /**
     * Updates the dialog transform state.
     * @param {number} elapsed Elapsed time since start.
     * @returns {void}
     */
    updateDialogTransform(elapsed) {
        const t = Math.min(elapsed / 200, 1);
        this.scale = 0.9 + 0.1 * t;
        this.floatOffset = Math.sin(elapsed / 600) * 2;
    }

    /**
     * Updates the typing progress.
     * @param {number} elapsed Elapsed time since start.
     * @returns {void}
     */
    updateTypingProgress(elapsed) {
        const charsToShow = Math.max(0, Math.floor(elapsed / this.charDelay));
        const maxChars = this.fullText.length;
        const safeCount = Math.max(0, Math.min(charsToShow, maxChars));
        const typing = safeCount > 0 && safeCount < maxChars;
        if (typing) this.startTypingLoopSound();
        else this.stopTypingLoopSound();
        this.displayedText = this.fullText.slice(0, safeCount);
    }

    /**
     * Renders the dialog bubble.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} [renderCameraX=0] Camera x offset for rendering.
     * @param {number | null} [customYOffset=null] Custom vertical offset.
     * @returns {void}
     */
    render(ctx, renderCameraX = 0, customYOffset = null) {
        if (!this.active) return;
        ctx.save();
        if (this.target !== 'canvas') ctx.translate(-renderCameraX, 0);
        this.renderer.draw(this, ctx, customYOffset);
        ctx.restore();
    }

    /**
     * Gets the recommended hold duration.
     * @returns {number} Recommended hold duration in milliseconds.
     */
    getRecommendedHoldMs() {
        if (this.type === "info") return 1200;
        const typeMs = this.fullText.length * this.charDelay;
        const holdMs = 450;
        return typeMs + holdMs;
    }

    /**
     * Gets the target anchor position.
     * @returns {{ headX: number, headY: number } | null} Target anchor position or null if unavailable.
     */
    getTargetAnchor() {
        if (!this.target || this.target === 'canvas') return null;
        const hb = this.target.getHitboxRect?.();
        return {
            headX: hb ? hb.cx : (this.target.x + this.target.width * 0.5),
            headY: hb ? hb.top : this.target.y
        };
    }
}