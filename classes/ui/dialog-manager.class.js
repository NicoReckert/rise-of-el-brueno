/**
 * Manages dialog state and dialog interactions.
 */
export class DialogManager {
    /**
     * Creates a new dialog controller instance.
     * @param {Object} world World instance.
     * @param {Object} keyboard Keyboard input state.
     */
    constructor(world, keyboard) {
        this.initDialogCore(world, keyboard);
        this.initDialogState();
    }

    /**
     * Initializes the core dialog manager properties.
     * @param {Object} world World instance.
     * @param {Object} keyboard Keyboard input state.
     * @returns {void}
     */
    initDialogCore(world, keyboard) {
        this.world = world;
        this.keyboard = keyboard;
    }

    /**
     * Initializes the dialog manager state.
     * @returns {void}
     */
    initDialogState() {
        this.dialogs = {};
        this.currentDialog = null;
        this.currentDialogKey = null;
        this.currentIndex = 0;
        this.active = false;
        this.onComplete = null;
        this.currentBubble = null;
        this.currentBubbleOnComplete = null;
        this.pauseUntil = null;
    }

    /**
     * Adds a dialog entry.
     * @param {string} key Dialog key.
     * @param {Array} sequence Dialog sequence.
     * @param {Object} [options={}] Dialog options.
     * @returns {string | null} Dialog key or null.
     */
    addDialog(key, sequence, options = {}) {
        if (!key || typeof key !== "string") return null;
        if (!Array.isArray(sequence)) return null;
        this.dialogs[key] = {
            key,
            sequence,
            autoStart: options.autoStart ?? false,
            onComplete: options.onComplete ?? null
        };
        return key;
    }

    /**
     * Starts a dialog.
     * @param {string} key Dialog key.
     * @param {number} [now=performance.now()] Current timestamp.
     * @param {?Function} [onCompleteOverride=null] Completion callback override.
     * @returns {void}
     */
    startDialog(key, now = performance.now(), onCompleteOverride = null) {
        const dialog = this.dialogs[key];
        if (!dialog) return;
        this.currentDialog = dialog;
        this.currentDialogKey = key;
        this.currentIndex = 0;
        this.active = true;
        this.onComplete = onCompleteOverride ?? dialog.onComplete;
        this.pauseUntil = null;
        this.startCurrentStep(now);
    }

    /**
     * Plays a dialog bubble.
     * @param {Object} bubble Dialog bubble instance.
     * @param {{ duration?: number | null, now?: number, onComplete?: Function | null }} [options={}] Playback options.
     * @returns {void}
     */
    playBubble(bubble, { duration = null, now = performance.now(), onComplete = null } = {}) {
        if (!bubble) return;
        if (this.currentBubble === bubble && bubble.active) return;
        this.currentBubble = bubble;
        this.currentBubbleOnComplete = onComplete;
        bubble.start(duration, now);
    }

    /**
     * Gets the current dialog step.
     * @returns {Object | null} Current dialog step or null if unavailable.
     */
    getCurrentStep() {
        if (!this.active || !this.currentDialog) return null;
        return this.currentDialog.sequence[this.currentIndex] ?? null;
    }

    /**
     * Resolves the dialog bubble for a step.
     * @param {Object} step Dialog step.
     * @returns {Object | null} Dialog bubble or null if unavailable.
     */
    resolveStepBubble(step) {
        if (!step) return null;
        if (this.isCustomStep(step)) return step;
        if (step.type !== "bubble") return null;
        if (step.bubble) return step.bubble;
        if (!step._bubbleInstance) {
            step._bubbleInstance = this.createBubbleFromStep(step);
        }
        return step._bubbleInstance;
    }

    /**
     * Checks whether a step is a custom step.
     * @param {Object} step Dialog step.
     * @returns {boolean} True if the step is custom, otherwise false.
     */
    isCustomStep(step) {
        return typeof step.start === "function" &&
            typeof step.draw === "function";
    }

    /**
     * Creates a speech bubble from a step definition.
     * @param {Object} step Step data.
     * @returns {*} Speech bubble instance.
     */
    createBubbleFromStep(step) {
        return new SpeechBubble(
            step.text ?? "",
            step.target ?? "canvas",
            step.bubbleType ?? "speech",
            {
                audioManager: step.allAudios ?? this.world.allAudios ?? null,
                yOffset: step.yOffset ?? 50
            }
        );
    }

    /**
     * Starts the current dialog step.
     * @param {number} [now=performance.now()] Current time value.
     * @returns {void}
     */
    startCurrentStep(now = performance.now()) {
        const step = this.getCurrentStep();
        if (!step) return;
        if (this.handlePauseStep(step, now)) return;
        if (this.handleCallbackStep(step, now)) return;
        this.pauseUntil = null;
        const bubble = this.resolveStepBubble(step);
        if (!bubble) return;
        const duration = this.getStepDuration(step);
        bubble.start(duration, now);
    }

    /**
     * Handles a pause step.
     * @param {Object} step Dialog step.
     * @param {number} now Current time value.
     * @returns {boolean} True if the step was handled, otherwise false.
     */
    handlePauseStep(step, now) {
        if (step.type !== "pause") return false;
        this.pauseUntil = now + (step.duration ?? 0);
        return true;
    }

    /**
     * Handles a callback step.
     * @param {Object} step Dialog step.
     * @param {number} now Current time value.
     * @returns {boolean} True if the step was handled, otherwise false.
     */
    handleCallbackStep(step, now) {
        if (step.type !== "callback") return false;
        this.pauseUntil = null;
        if (typeof step.run === "function") step.run(this.world);
        this.next(now);
        return true;
    }

    /**
     * Gets the duration of a dialog step.
     * @param {Object} step Dialog step.
     * @returns {number | null} Step duration in milliseconds or null if not defined.
     */
    getStepDuration(step) {
        if (!step || typeof step !== "object") return null;
        return "duration" in step ? step.duration : null;
    }

    /**
     * Advances to the next dialog step.
     * @param {number} [now=performance.now()] Current timestamp.
     * @returns {void}
     */
    next(now = performance.now()) {
        if (!this.active || !this.currentDialog) return;
        this.currentIndex++;
        if (this.currentIndex >= this.currentDialog.sequence.length) {
            this.active = false;
            this.currentDialog = null;
            this.currentDialogKey = null;
            this.pauseUntil = null;
            if (this.onComplete) this.onComplete(this.world);
            this.onComplete = null;
            return;
        }
        this.startCurrentStep(now);
    }

    /**
     * Updates the dialog manager state.
     * @param {number} now Current time value.
     * @returns {void}
     */
    update(now) {
        if (this.active && this.currentDialog) {
            this.updateDialogSequence(now);
        }
        this.updateStandaloneBubble(now);
    }

    /**
     * Updates the current dialog sequence.
     * @param {number} now Current time value.
     * @returns {void}
     */
    updateDialogSequence(now) {
        const step = this.getCurrentStep();
        if (!step) return;
        if (step.type === "pause") {
            this.updatePauseStep(now);
            return;
        }
        if (step.type === "callback") return;
        this.updateBubbleStep(step, now);
    }

    /**
     * Updates the pause step state.
     * @param {number} now Current time value.
     * @returns {void}
     */
    updatePauseStep(now) {
        if (this.pauseUntil == null) return;
        if (now < this.pauseUntil) return;
        this.next(now);
    }

    /**
     * Updates the current dialog bubble step.
     * @param {Object} step Dialog step.
     * @param {number} now Current time value.
     * @returns {void}
     */
    updateBubbleStep(step, now) {
        const bubble = this.resolveStepBubble(step);
        if (!bubble) return;
        bubble.update(now);
        this.handleBubbleInput(bubble, now);
        if (!bubble.active) this.next(now);
    }

    /**
     * Handles dialog bubble input.
     * @param {Object} bubble Dialog bubble instance.
     * @param {number} now Current time value.
     * @returns {void}
     */
    handleBubbleInput(bubble, now) {
        if (!this.keyboard.F) return;
        const full = bubble.fullText ?? "";
        const shown = bubble.displayedText ?? "";
        if (shown.length < full.length) {
            bubble.displayedText = full;
            bubble.lastCharCount = full.length;
        } else {
            this.next(now);
        }
        this.keyboard.F = false;
    }

    /**
     * Updates the standalone dialog bubble.
     * @param {number} now Current time value.
     * @returns {void}
     */
    updateStandaloneBubble(now) {
        if (!this.currentBubble) return;
        this.currentBubble.update(now);
        if (this.currentBubble.active) return;
        const cb = this.currentBubbleOnComplete;
        this.currentBubble = null;
        this.currentBubbleOnComplete = null;
        if (cb) cb(this.world);
    }

    /**
     * Draws the active dialog content.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @returns {void}
     */
    draw(ctx) {
        const camX = this.world.townLevelController?.renderCameraX ?? 0;
        if (this.active && this.currentDialog) {
            const step = this.getCurrentStep();
            if (step?.type !== "pause" && step?.type !== "callback") {
                const bubble = this.resolveStepBubble(step);
                if (bubble) bubble.render(ctx, camX, step?.yOffset ?? null);
            }
        }
        if (this.currentBubble) {
            this.currentBubble.render(ctx, camX);
        }
    }
}