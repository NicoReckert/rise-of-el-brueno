export class PauseManager {
    constructor(uiManager, audioManager, allAudios) {
        this.ui = uiManager;
        this.audio = audioManager;
        this.allAudios = allAudios;
    }

    isOpen() {
        return this.ui.isOpenPauseOverlay();
    }

    open(world) {
        if (!world) return;
        this.ui.showPauseOverlay();
        this.ui.setMoveButtonsActive(false);
        world.pauseGame?.();
        this.audio.pauseAllAudios(this.allAudios);
    }

    close(world) {
        if (!world) return;
        this.ui.hidePauseOverlay();
        this.ui.setMoveButtonsActive(true);
        world.resumeGame?.();
        this.audio.resumeAllAudios(this.allAudios);
    }

    toggle(world) {
        if (this.isOpen()) this.close(world);
        else this.open(world);
    }

}