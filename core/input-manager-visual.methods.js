export const inputManagerVisualMethods = {

    /**
     * Initializes visual interaction handlers for move buttons.
     * @param {HTMLElement} container Container holding move buttons.
     */
    initMoveButtonVisuals(container) {
        if (!container) return;
        const buttons = container.querySelectorAll('.touch-button');
        buttons.forEach(btn => this.bindMoveButtonVisuals(btn));
    },

    /**
     * Binds visual press and release interactions for a move button.
     * @param {HTMLElement} btn Move button element.
     */
    bindMoveButtonVisuals(btn) {
        if (!btn) return;
        const press = () => {
            btn.classList.add('hold');
            this.triggerPulse(btn);
        };
        const release = () => btn.classList.remove('hold');
        btn.addEventListener('touchstart', press);
        btn.addEventListener('mousedown', press);
        btn.addEventListener('touchend', release);
        btn.addEventListener('mouseup', release);
        btn.addEventListener('mouseleave', release);
    },

    /**
     * Triggers a pulse animation on a button element.
     * @param {HTMLElement} button Target button element.
     */
    triggerPulse(button) {
        button.classList.remove('pulse');
        void button.offsetWidth;
        button.classList.add('pulse');
    }
}