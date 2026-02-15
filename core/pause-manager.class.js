export class PauseManager {
    constructor(uiManager, audioManager) {
        this.uiManager = uiManager;
        this.audioManager = audioManager;
        this.audios = this.audioManager.audios;
    }

    isOpen() {
        return this.uiManager.isOpenPauseOverlay();
    }

    open(world) {
        if (!world) return;
        this.uiManager.showPauseOverlay();
        this.uiManager.setMoveButtonsActive(false);
        world.pauseGame?.();
        this.audioManager.pauseAllAudios(this.audios);
    }

    close(world) {
        if (!world) return;
        this.uiManager.hidePauseOverlay();
        this.uiManager.setMoveButtonsActive(true);
        world.resumeGame?.();
        this.audioManager.resumeAllAudios(this.audios);
    }

    toggle(world) {
        if (this.isOpen()) this.close(world);
        else this.open(world);
    }
}