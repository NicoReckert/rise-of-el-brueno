/**
 * Manages pause state and related UI/audio interactions.
 */
export class PauseManager {
    /**
     * Creates a new UI audio controller instance.
     * @param {Object} uiManager UI manager reference.
     * @param {Object} audioManager Audio manager reference.
     */
    constructor(uiManager, audioManager) {
        this.uiManager = uiManager;
        this.audioManager = audioManager;
        this.audios = this.audioManager.audios;
    }

    /**
     * Checks whether the pause overlay is open.
     * @returns {boolean} True if the pause overlay is open.
     */
    isOpen() {
        return this.uiManager.isOpenPauseOverlay();
    }

    /**
     * Opens the pause state.
     * @param {Object} world World instance.
     * @returns {void}
     */
    open(world) {
        if (!world) return;
        this.uiManager.showPauseOverlay();
        this.uiManager.setMoveButtonsActive(false);
        world.pauseGame?.();
        this.audioManager.pauseAllAudios(this.audios);
        world.endCreditsSetup?.video?.pause();
    }

    /**
     * Closes the pause state.
     * @param {Object} world World instance.
     * @returns {void}
     */
    close(world) {
        if (!world) return;
        this.uiManager.hidePauseOverlay();
        this.uiManager.setMoveButtonsActive(true);
        world.resumeGame?.();
        this.audioManager.resumeAllAudios(this.audios);
        world.endCreditsSetup?.video?.play();
    }

    /**
     * Toggles the pause state.
     * @param {Object} world World instance.
     * @returns {void}
     */
    toggle(world) {
        if (this.isOpen()) this.close(world);
        else this.open(world);
    }
}