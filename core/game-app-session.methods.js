export const gameAppSessionMethods = {

    /**
     * Restarts the game from the current level.
     * @returns {void}
     */
    restartGameFromCurrentLevel() {
        if (!this.world) return;
        this.uiManager.hideLevelCompleteActions();
        this.uiManager.hidePauseOverlay();
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
        this.uiManager.hideLevelCompleteActions();
        this.uiManager.hidePauseOverlay();
        this.uiManager.hideGameControls();
        this.stopLevelCompleteMusic();
        this.exitFullscreenIfNeeded();
        this.resetWorldStateForMenu();
        this.uiManager.showMainMenuScreen();
        this.startMenuMusic();
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
    }
}