export const uiManagerScreenMethods = {

    /**
     * Updates the mute toggle button UI.
     * @param {boolean} isMuted Whether the audio is muted.
     */
    updateMuteButtonUI(isMuted) {
        if (!this.dom.muteToggleButton) return;
        this.dom.muteToggleButton.textContent = isMuted ? '🔇' : '🔊';
    },

    /**
     * Fades out the loading overlay and removes it after a delay.
     */
    fadeOutLoadingOverlay() {
        const overlay = this.dom.loadingOverlay;
        if (!overlay) return;
        overlay.style.opacity = 0;
        setTimeout(() => overlay.remove(), 600);
    },

    /**
     * Displays the game screen and activates the game controls.
     */
    showGameScreen() {
        this.dom.startScreenOverlay.style.display = 'none';
        this.dom.introOverlay.style.display = 'none';
        this.dom.canvas.style.display = 'block';
        this.showGameControls();
    },

    /**
     * Hides the level complete button box.
     */
    hideLevelCompleteActions() {
        this.dom.LevelCompleteActions.classList.add('d-none');
    },

    /**
     * Checks whether the pause overlay is currently visible.
     * @returns {boolean} True if the pause overlay is open, otherwise false.
     */
    isOpenPauseOverlay() {
        return !this.dom.pauseOverlay.classList.contains('d-none');
    },

    /**
     * Shows the pause overlay.
     */
    showPauseOverlay() {
        this.dom.pauseOverlay.classList.remove('d-none');
    },

    /**
     * Hides the pause overlay.
     */
    hidePauseOverlay() {
        this.dom.pauseOverlay.classList.add('d-none');
    },

    /**
     * Applies a fade-in effect to the intro video.
     */
    fadeInIntroVideo() {
        this.dom.introVideo.classList.remove('opacity-none');
        this.dom.introVideo.classList.add('fade-in-intro');
    },

    /**
     * Transitions from the initialization overlay to the start screen.
     */
    transitionToStartScreen() {
        this.dom.introOverlay.classList.add('animation-overlay-fade-out');
        this.dom.startScreenOverlay.classList.remove('opacity-none');
    },

    /**
     * Hides the intro overlay.
     */
    hideIntroOverlay() {
        this.dom.introOverlay.classList.add('opacity-none');
    },

    /**
     * Plays the title animation and updates related CSS classes.
     */
    playTitleAnimation() {
        const title = this.dom.gameTitle;
        if (!title) return;
        title.classList.add('animation');
        setTimeout(() => {
            title.classList.remove('before-animation');
        }, 800);
    },

    /**
     * Updates the fullscreen toggle button UI.
     * @param {boolean} isActive Whether fullscreen mode is active.
     */
    updateFullscreenButtonUI(isActive) {
        const btn = this.dom.fullscreenToggleButton;
        if (!btn) return;
        btn.textContent = isActive ? '🡼' : '⛶';
    },

    /**
     * Shows the main game control buttons and activates movement controls.
     */
    showGameControls() {
        this.dom.pauseToggleButton.classList.remove('d-none');
        this.dom.muteToggleButton.classList.remove('d-none');
        this.dom.fullscreenToggleButton.classList.remove('d-none');
        this.setMoveButtonsActive(true);
    },

    /**
     * Hides the main game control buttons and deactivates movement controls.
     */
    hideGameControls() {
        this.dom.pauseToggleButton.classList.add('d-none');
        this.dom.muteToggleButton.classList.add('d-none');
        this.dom.fullscreenToggleButton.classList.add('d-none');
        this.setMoveButtonsActive(false);
    },

    /**
     * Toggles the visibility and active state of the move button container.
     * @param {boolean} active Whether the move buttons should be active.
     */
    setMoveButtonsActive(active) {
        const box = this.dom.touchControls;
        if (!box) return;
        box.classList.toggle('d-none', !active);
        box.classList.toggle('touch-controls-active', active);
    },

    /**
     * Shows the main menu screen and hides the game canvas.
     */
    showMainMenuScreen() {
        this.dom.canvas.style.display = 'none';
        this.dom.startScreenOverlay.style.display = 'flex';
        if (this.dom.introOverlay) {
            this.dom.introOverlay.style.display = 'none';
        }
    }
};