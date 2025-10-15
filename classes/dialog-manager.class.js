/**
 * Manages dialog sequences and interactions within the game world.
 */
class DialogManager {
    /**
     * Creates a new DialogManager instance.
     * @param {object} world - The game world object.
     * @param {object} keyboard - The keyboard input handler.
     */
    constructor(world, keyboard) {
        this.world = world;
        this.keyboard = keyboard;
        this.dialogs = [];
        this.currentDialog = null;
        this.currentIndex = 0;
        this.active = false;
        this.onComplete = null;
    }

    /**
     * Adds a dialog sequence to the manager.
     * @param {object[]} sequence - The list of dialog bubbles or steps.
     * @param {object} [options={}] - Optional configuration.
     * @param {boolean} [options.autoStart=false] - Whether the dialog starts automatically.
     * @param {Function|null} [options.onComplete=null] - Callback after the dialog finishes.
     */
    addDialog(sequence, options = {}) {
        this.dialogs.push({
            sequence,
            autoStart: options.autoStart ?? false,
            onComplete: options.onComplete ?? null
        });
    }

    /**
     * Starts a dialog sequence.
     * @param {number} [index=0] - The index of the dialog to start.
     */
    startDialog(index = 0) {
        const dialog = this.dialogs[index];
        if (!dialog) return;
        this.currentDialog = dialog;
        this.currentIndex = 0;
        this.active = true;
        this.onComplete = dialog.onComplete;
        dialog.sequence[0].start();
    }

    /**
     * Proceeds to the next dialog bubble or ends the dialog.
     */
    next() {
        if (!this.active) return;
        this.currentIndex++;
        if (this.currentIndex >= this.currentDialog.sequence.length) {
            this.active = false;
            if (this.onComplete) this.onComplete(this.world);
        } else {
            this.currentDialog.sequence[this.currentIndex].start();
        }
    }

    /**
     * Updates the current dialog state.
     * @param {number} now - The current timestamp.
     */
    update(now) {
        if (!this.active) return;
        const bubble = this.currentDialog.sequence[this.currentIndex];
        bubble.update(now);
        if (this.keyboard.F) {
            this.next();
            this.keyboard.F = false;
        }
    }

    /**
     * Draws the current dialog bubble.
     * @param {CanvasRenderingContext2D} ctx - The rendering context.
     */
    draw(ctx) {
        if (!this.active) return;
        const bubble = this.currentDialog.sequence[this.currentIndex];
        bubble.draw(ctx);
    }
}