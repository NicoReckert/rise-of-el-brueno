export const uiManagerOverlayMethods = {

    /**
     * Shows a DOM element by removing the `d-none` class.
     * @param {HTMLElement} element DOM element to show.
     */
    showElement(element) {
        if (!element) return;
        element.classList.remove('d-none');
    },

    /**
     * Hides a DOM element by adding the `d-none` class.
     * @param {HTMLElement} element DOM element to hide.
     */
    hideElement(element) {
        if (!element) return;
        element.classList.add('d-none');
    },

    /**
     * Toggles body scroll locking by adding or removing the `overflow-hidden` class.
     * @param {boolean} active Whether scrolling should be locked.
     */
    setBodyScrollLocked(active) {
        if (!this.dom.body) return;
        this.dom.body.classList.toggle('overflow-hidden', active);
    },

    /**
     * Toggles the blur effect on the characters overlay.
     * @param {boolean} active Whether the blur effect should be active.
     */
    setCharactersOverlayBlur(active) {
        const overlay = this.dom.charactersOverlay;
        if (!overlay) return;
        overlay.classList.toggle('blur-effect', active);
    },

    /**
     * Attaches a video element to the beginning of an overlay.
     * @param {HTMLElement} overlay Overlay element.
     * @param {HTMLVideoElement} video Video element to attach.
     */
    attachVideoToOverlay(overlay, video) {
        if (!overlay || !video) return;
        overlay.prepend(video);
    },

    /**
     * Shows the characters overlay.
     */
    showCharactersOverlay() {
        this.showElement(this.dom.charactersOverlay);
    },

    /**
     * Hides the characters overlay.
     */
    hideCharactersOverlay() {
        this.hideElement(this.dom.charactersOverlay);
    },

    /**
     * Shows the detail overlay.
     * @returns {void}
     */
    showCharacterDetailOverlay() {
        this.showElement(this.dom.characterDetailOverlay);
        this.setBodyScrollLocked(true);
        this.setCharactersOverlayBlur(true);
    },

    /**
     * Hides the detail overlay.
     * @returns {void}
     */
    hideCharacterDetailOverlay() {
        this.hideElement(this.dom.characterDetailOverlay);
        this.setBodyScrollLocked(false);
        this.setCharactersOverlayBlur(false);
    },

    /**
     * Shows the story overlay.
     */
    showStoryOverlay() {
        this.showElement(this.dom.storyOverlay);
    },

    /**
     * Hides the story overlay.
     */
    hideStoryOverlay() {
        this.hideElement(this.dom.storyOverlay);
    },

    /**
     * Shows the controls overlay.
     */
    showControlsOverlay() {
        this.showElement(this.dom.controlsOverlay);
    },

    /**
     * Hides the controls overlay.
     */
    hideControlsOverlay() {
        this.hideElement(this.dom.controlsOverlay);
    },

    /**
     * Shows the credits overlay.
     */
    showCreditsOverlay() {
        this.showElement(this.dom.creditsOverlay);
    },

    /**
     * Hides the credits overlay.
     */
    hideCreditsOverlay() {
        this.hideElement(this.dom.creditsOverlay);
    },

    /**
     * Sets the pause overlay return state.
     * @param {boolean} active Whether the pause overlay return state is active.
     * @returns {void}
     */
    setPauseOverlayReturn(active) {
        this.returnToPauseOverlay = active;
    },

    /**
     * Resets the pause overlay return state.
     * @returns {void}
     */
    resetPauseOverlayReturn() {
        this.returnToPauseOverlay = false;
    },

    /**
     * Restores the pause overlay after a sub-overlay.
     * @returns {void}
     */
    restorePauseOverlayAfterSubOverlay() {
        if (!this.returnToPauseOverlay) return;
        this.showPauseOverlay();
        this.resetPauseOverlayReturn();
    },

    /**
     * Sets whether an overlay was opened from the pause overlay.
     * @param {HTMLElement} overlay Overlay element.
     * @param {boolean} active Whether the state is active.
     * @returns {void}
     */
    setOverlayOpenedFromPause(overlay, active) {
        if (!overlay) return;
        overlay.classList.toggle('overlay-opened-from-pause', active);
    },

    /**
     * Sets whether the controls overlay was opened from the pause overlay.
     * @param {boolean} active Whether the state is active.
     * @returns {void}
     */
    setControlsOverlayFromPause(active) {
        this.setOverlayOpenedFromPause(this.dom.controlsOverlay, active);
    },

    /**
     * Sets whether the credits overlay was opened from the pause overlay.
     * @param {boolean} active Whether the state is active.
     * @returns {void}
     */
    setCreditsOverlayFromPause(active) {
        this.setOverlayOpenedFromPause(this.dom.creditsOverlay, active);
    }
};