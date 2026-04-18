export const gameAppSessionMethods = {
    /**
     * Restarts the game from the current level.
     * @returns {void}
     */
    restartGameFromCurrentLevel() {
        if (!this.world) return;
        this.resetSessionUiState();
        this.stopSessionMedia();
        this.uiManager.showGameControls();
        this.audioManager.resetAllAudios(this.audioManager.audios);
        this.world.restartLevel(this.world.currentScene);
    },

    /**
     * Returns the game to the main menu and resets the world state.
     * @returns {void}
     */
    returnToMainMenu() {
        if (!this.world) return;
        this.resetSessionUiState();
        this.uiManager.hideGameControls();
        this.stopSessionMedia();
        this.exitFullscreenIfNeeded();
        this.resetWorldStateForMenu();
        this.uiManager.showMainMenuScreen();
        this.uiManager.showMenuSystemControls();
        this.startMenuMusic();
    },

    /**
     * Resets shared UI state for restart and menu actions.
     * @returns {void}
     */
    resetSessionUiState() {
        this.uiManager.resetPauseOverlayReturn?.();
        this.uiManager.hideLevelCompleteActions();
        this.uiManager.hideGameOverActions();
        this.uiManager.hideGameOverVideoAndEffects();
        this.uiManager.hideEndCreditsActions();
        this.uiManager.hideEndCreditsVideo();
        this.uiManager.hidePauseOverlay();
        this.uiManager.setControlsOverlayFromPause(false);
        this.uiManager.setCreditsOverlayFromPause(false);
    },

    /**
     * Stops session-specific media.
     * @returns {void}
     */
    stopSessionMedia() {
        this.stopLevelCompleteMusic();
        this.stopGameOverMusic();
        this.stopEndCreditsVideoAudio();
    },

    /**
     * Fades out the level complete music if active.
     * @returns {void}
     */
    stopLevelCompleteMusic() {
        const music = this.world?.levelCompleteSetup?.sounds?.levelCompleteMusic;
        if (!music) return;
        this.audioManager.fadeOutAudio(music, 1000);
    },

    /**
     * Stops the game over music.
     * @returns {void}
     */
    stopGameOverMusic() {
        const music = this.world?.gameOverSetup?.sounds?.gameOverMusic;
        if (!music) return;
        this.audioManager.fadeOutAudio(music, 1000);
    },

    /**
     * Stops the end credits video audio with a fade-out.
     * @returns {void}
     */
    stopEndCreditsVideoAudio() {
        const video = this.world?.endCreditsSetup?.video;
        if (!video) return;
        this.audioManager.fadeOutAudio(video, 1000);
    },

    /**
     * Exits fullscreen mode if currently active.
     * @returns {void}
     */
    exitFullscreenIfNeeded() {
        if (!this.fullscreenManager.isFullscreenActive()) return;
        this.fullscreenManager.exitFullscreen();
    },

    /**
     * Resets the world state before returning to the main menu.
     * @returns {void}
     */
    resetWorldStateForMenu() {
        this.audioManager.resetAllAudios(this.audioManager.audios);
        this.world.destroy();
        this.world = null;
    },

    /**
     * Starts the main menu music with a fade-in.
     * @returns {void}
     */
    startMenuMusic() {
        const loop = this.audioManager.get('uiTitleLoopMusic');
        if (!loop) return;
        loop.currentTime = 0;
        this.audioManager.fadeInAudio(loop, 2000);
    },

    /**
     * Restarts the game from the town checkpoint.
     * @returns {void}
     */
    restartGameFromTownCheckpoint() {
        if (!this.world?.townCheckpoint) return;
        this.world.resumeFromTownCheckpoint = true;
        this.restartGameFromCurrentLevel();
    }
}