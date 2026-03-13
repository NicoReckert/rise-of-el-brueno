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
        const overlay = this.dom.overlayCharacters;
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
        this.showElement(this.dom.overlayCharacters);
    },

    /**
     * Hides the characters overlay.
     */
    hideCharactersOverlay() {
        this.hideElement(this.dom.overlayCharacters);
    },

    /**
     * Shows the big card overlay and enables related UI effects.
     */
    showBigCardOverlay() {
        this.showElement(this.dom.overlayBigCard);
        this.setBodyScrollLocked(true);
        this.setCharactersOverlayBlur(true);
    },

    /**
     * Hides the big card overlay and disables related UI effects.
     */
    hideBigCardOverlay() {
        this.hideElement(this.dom.overlayBigCard);
        this.setBodyScrollLocked(false);
        this.setCharactersOverlayBlur(false);
    },

    /**
     * Shows the story overlay.
     */
    showStoryOverlay() {
        this.showElement(this.dom.overlayStory);
    },

    /**
     * Hides the story overlay.
     */
    hideStoryOverlay() {
        this.hideElement(this.dom.overlayStory);
    },

    /**
     * Shows the controls overlay.
     */
    showControlsOverlay() {
        this.showElement(this.dom.overlayControls);
    },

    /**
     * Hides the controls overlay.
     */
    hideControlsOverlay() {
        this.hideElement(this.dom.overlayControls);
    },

    /**
     * Shows the credits overlay.
     */
    showCreditsOverlay() {
        this.showElement(this.dom.overlayCredits);
    },

    /**
     * Hides the credits overlay.
     */
    hideCreditsOverlay() {
        this.hideElement(this.dom.overlayCredits);
    }
};