export class UIManager {
    constructor() {
        this.dom = {};
        this.cacheDom();
    }

    cacheDom() {
        this.dom = {
            ...this.cacheLoadingElements(),
            ...this.cacheStartScreenElements(),
            ...this.cacheControlElements(),
        };
    }

    cacheLoadingElements() {
        return {
            loadingOverlay: document.getElementById('loading-overlay'),
        };
    }

    cacheStartScreenElements() {
        return {
            overlayStartScreen: document.getElementById('overlay-start-screen'),
            overlayStartInitialisation: document.getElementById('overlay-start-initialisation'),
            startButton: document.getElementById('start-button'),
            nextLevelButton: document.getElementById('next-level-button'),
            levelCompleteButtonBox: document.getElementById('level-complete-button-box'),
            pauseResumeButton: document.getElementById('pause-resume-button'),
            overlayStartInitialisation: document.getElementById('overlay-start-initialisation'),
            h1: document.getElementById('h1')
        };
    }

    cacheControlElements() {
        return {
            canvas: document.getElementById('canvas'),
            moveButtonBox: document.getElementById('move-button-box'),
            pauseToggleButton: document.getElementById('pause-toggle-button'),
            fullscreenToggleButton: document.getElementById('fullscreen-toggle-button'),
            muteToggleButton: document.getElementById('mute-toggle-button'),
            pauseOverlay: document.getElementById('pause-overlay'),
            welcomeButton: document.getElementById("welcome-button"),
            introVideo: document.getElementById('intro-video'),
            body: document.body,
            menuCharactersButton: document.getElementById('menu-characters-button'),
            smallCardBox: document.getElementById("small-card-box")
        };
    }

    updateMuteButtonUI(isMuted) {
        if (!this.dom.muteToggleButton) return;
        this.dom.muteToggleButton.textContent = isMuted ? "🔇" : "🔊";
    }

    fadeOutLoadingOverlay() {
        this.dom.loadingOverlay.style.opacity = 0;
        setTimeout(() => this.dom.loadingOverlay.remove(), 600);
    }

    showGameScreen() {
        this.dom.overlayStartScreen.style.display = 'none';
        this.dom.overlayStartInitialisation.style.display = 'none';
        this.dom.canvas.style.display = 'block';
        this.dom.moveButtonBox.classList.remove('d-none');
        this.dom.pauseToggleButton.classList.remove('d-none');
        this.dom.muteToggleButton.classList.remove('d-none');
        this.dom.fullscreenToggleButton.classList.remove('d-none');
        this.dom.moveButtonBox.classList.add('move-button-box-active');
    }

    hideLevelCompleteButtonBox() {
        this.dom.levelCompleteButtonBox.classList.add('d-none');
    }

    hidePauseOverlayAndMoveButtonBox() {
        this.dom.levelCompleteButtonBox.classList.add('d-none');
    }

    isOpenPauseOverlay() {
        return !this.dom.pauseOverlay.classList.contains('d-none');
    }

    showPauseOverlay() {
        this.dom.pauseOverlay.classList.remove('d-none');
    }

    hidePauseOverlay() {
        this.dom.pauseOverlay.classList.add('d-none');
    }

    setMoveButtonsActive(active) {
        this.dom.moveButtonBox.classList.toggle('move-button-box-active', active);
    }

    fadeInIntroVideo() {
        this.dom.introVideo.classList.remove('opacity-none');
        this.dom.introVideo.classList.add('fade-in-intro');
    }

    transitionToStartScreen() {
        this.dom.overlayStartInitialisation.classList.add('animation-overlay-fade-out');
        this.dom.overlayStartScreen.classList.remove('opacity-none');
    }

    hideStartInitialisationOverlay() {
        this.dom.overlayStartInitialisation.classList.add('opacity-none');
    }

    playTitleAnimation() {
        this.dom.h1.classList.add('animation');
        setTimeout(() => {
            this.dom.h1.classList.remove('before-animation');
        }, 800);
    }
}