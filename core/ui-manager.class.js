export class UIManager {
    constructor() {
        this.cacheDom();
    }

    cacheDom() {
        this.muteToggleButton = document.getElementById('mute-toggle-button');
        this.loadingOverlay = document.getElementById('loading-overlay');
    }

    updateMuteButtonUI(isMuted) {
        if (!this.muteToggleButton) return;
        this.muteToggleButton.textContent = isMuted ? "🔇" : "🔊";
    }

    fadeOutLoadingOverlay() {
        this.loadingOverlay.style.opacity = 0;
        setTimeout(() => this.loadingOverlay.remove(), 600);
    }

    showGameScreen() {
        document.getElementById('overlay-startscreen').style.display = 'none';
        document.getElementById('overlay-start-initialisation').style.display = 'none';
        document.getElementById('canvas').style.display = 'block';
        document.getElementById('move-button-box').classList.remove('d-none');
        document.getElementById('pause-toggle-button').classList.remove('d-none');
        document.getElementById('mute-toggle-button').classList.remove('d-none');
        document.getElementById('fullscreen-toggle-button').classList.remove('d-none');
        document.getElementById('move-button-box').classList.add('move-button-box-active');
    }
}