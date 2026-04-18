export const dialogManagerControlMethods = {
    /**
     * Stops all dialogs and resets the dialog state.
     * @returns {void}
     */
    stopAllDialogs() {
        this.stopCurrentDialogBubble();
        this.stopStandaloneBubble();
        this.stopCachedDialogBubbles();
        this.resetDialogState();
        this.keyboard.F = false;
    },

    /**
     * Stops the current dialog bubble.
     * @returns {void}
     */
    stopCurrentDialogBubble() {
        const step = this.getCurrentStep();
        const bubble = this.resolveStepBubble(step);
        this.stopBubble(bubble);
    },

    /**
     * Stops the standalone dialog bubble.
     * @returns {void}
     */
    stopStandaloneBubble() {
        this.stopBubble(this.currentBubble);
        this.currentBubble = null;
        this.currentBubbleOnComplete = null;
    },

    /**
     * Stops cached dialog bubbles.
     * @returns {void}
     */
    stopCachedDialogBubbles() {
        Object.values(this.dialogs).forEach(dialog => {
            dialog.sequence.forEach(step => {
                if (step?._bubbleInstance) this.stopBubble(step._bubbleInstance);
                if (this.isCustomStep(step)) this.stopBubble(step);
            });
        });
    },

    /**
     * Stops a dialog bubble.
     * @param {Object} bubble Dialog bubble instance.
     * @returns {void}
     */
    stopBubble(bubble) {
        if (!bubble) return;
        if (typeof bubble.hide === 'function') bubble.hide();
        if (typeof bubble.stop === 'function') bubble.stop();
        bubble.active = false;
    },

    /**
     * Resets the dialog state.
     * @returns {void}
     */
    resetDialogState() {
        this.currentDialog = null;
        this.currentDialogKey = null;
        this.currentIndex = 0;
        this.active = false;
        this.onComplete = null;
        this.pauseUntil = null;
    }
};