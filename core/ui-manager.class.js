import {
    characterDialogTemplate,
    largeCharacterDialogTemplate,
    storyTextTemplate,
    controlsTemplate,
    legalNoticeTemplate
} from "../ui/menu-templates.js";

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
            ...this.cacheOverlayElements()
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
            h1: document.getElementById('h1'),
            menuStoryButton: document.getElementById('menu-story-button'),
            menuControlsButton: document.getElementById('menu-controls-button'),
            closeStoryOverlayButton: document.getElementById('close-story-overlay-button'),
            closeControlsOverlayButton: document.getElementById('close-controls-overlay-button'),
            menuCreditsButton: document.getElementById('menu-credits-button'),
            closeCreditsOverlayButton: document.getElementById('close-credits-overlay-button'),
            repeatLevelButton: document.getElementById('repeat-level-button'),
            pauseRestartButton: document.getElementById('pause-restart-button'),
            menuLevelButton: document.getElementById('menu-level-button'),
            pauseMenuMainButton: document.getElementById('pause-menu-main-button'),

        };
    }

    cacheControlElements() {
        return {
            canvas: document.getElementById('canvas'),
            moveButtonBox: document.getElementById('move-button-box'),
            moveButton: document.getElementById('move-button'),
            pauseToggleButton: document.getElementById('pause-toggle-button'),
            fullscreenToggleButton: document.getElementById('fullscreen-toggle-button'),
            muteToggleButton: document.getElementById('mute-toggle-button'),
            pauseOverlay: document.getElementById('pause-overlay'),
            welcomeButton: document.getElementById("welcome-button"),
            introVideo: document.getElementById('intro-video'),
            body: document.body,
            menuCharactersButton: document.getElementById('menu-characters-button'),
            smallCardBox: document.getElementById('small-card-box'),
            closeButton: document.getElementById('close-button'),
            closeCharactersOverlayButton: document.getElementById('close-characters-overlay-button'),
        };
    }

    cacheOverlayElements() {
        return {
            overlayCharacters: document.getElementById('overlay-characters'),
            overlayBigCard: document.getElementById('overlay-big-card'),
            overlayStory: document.getElementById('overlay-story'),
            overlayControls: document.getElementById('overlay-controls'),
            overlayCredits: document.getElementById('overlay-credits'),
            bigCardBox: document.getElementById('big-card-box'),
            storyBox: document.getElementById('story-box'),
            controlsBox: document.getElementById('controls-box'),
            creditsBox: document.getElementById('credits-box'),
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
        this.showGameControls();
    }

    hideLevelCompleteButtonBox() {
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

    updateFullscreenButtonUI(isActive) {
        const btn = this.dom.fullscreenToggleButton;
        if (!btn) return;
        btn.textContent = isActive ? '🡼' : '⛶';
    }

    showGameControls() {
        this.dom.pauseToggleButton.classList.remove('d-none');
        this.dom.muteToggleButton.classList.remove('d-none');
        this.dom.fullscreenToggleButton.classList.remove('d-none');
        this.setMoveButtonsActive(true);
    }

    hideGameControls() {
        this.dom.pauseToggleButton.classList.add('d-none');
        this.dom.muteToggleButton.classList.add('d-none');
        this.dom.fullscreenToggleButton.classList.add('d-none');
        this.setMoveButtonsActive(false);
    }

    setMoveButtonsActive(active) {
        const box = this.dom.moveButtonBox;
        if (!box) return;
        box.classList.toggle('d-none', !active);
        box.classList.toggle('move-button-box-active', active);
    }

    showMainMenuScreen() {
        this.dom.canvas.style.display = 'none';
        this.dom.overlayStartScreen.style.display = 'flex';
        if (this.dom.overlayStartInitialisation) {
            this.dom.overlayStartInitialisation.style.display = 'none';
        }
    }

    showElement(element) {
        if (!element) return;
        element.classList.remove('d-none');
    }

    hideElement(element) {
        if (!element) return;
        element.classList.add('d-none');
    }

    setBodyScrollLocked(active) {
        if (!this.dom.body) return;
        this.dom.body.classList.toggle('overflow-hidden', active);
    }

    setCharactersOverlayBlur(active) {
        const overlay = this.dom.overlayCharacters;
        if (!overlay) return;
        overlay.classList.toggle('blur-effect', active);
    }

    attachVideoToOverlay(overlay, video) {
        if (!overlay || !video) return;
        overlay.prepend(video);
    }

    showCharactersOverlay() {
        this.showElement(this.dom.overlayCharacters);
    }

    hideCharactersOverlay() {
        this.hideElement(this.dom.overlayCharacters);
    }

    showBigCardOverlay() {
        this.showElement(this.dom.overlayBigCard);
        this.setBodyScrollLocked(true);
        this.setCharactersOverlayBlur(true);
    }

    hideBigCardOverlay() {
        this.hideElement(this.dom.overlayBigCard);
        this.setBodyScrollLocked(false);
        this.setCharactersOverlayBlur(false);
    }

    showStoryOverlay() {
        this.showElement(this.dom.overlayStory);
    }

    hideStoryOverlay() {
        this.hideElement(this.dom.overlayStory);
    }

    showControlsOverlay() {
        this.showElement(this.dom.overlayControls);
    }

    hideControlsOverlay() {
        this.hideElement(this.dom.overlayControls);
    }

    showCreditsOverlay() {
        this.showElement(this.dom.overlayCredits);
    }

    hideCreditsOverlay() {
        this.hideElement(this.dom.overlayCredits);
    }

    renderCharacterCards(characters) {
        const box = this.dom.smallCardBox;
        if (!box) return;
        box.innerHTML = characters
            .map(character => characterDialogTemplate(character.name, character.text))
            .join('');
    }

    renderBigCharacterCard(character) {
        const box = this.dom.bigCardBox;
        if (!box || !character) return;
        box.innerHTML = largeCharacterDialogTemplate(character.name, character.text2);
    }

    renderStoryCard(text) {
        const box = this.dom.storyBox;
        if (!box) return;
        box.innerHTML = storyTextTemplate(text);
    }

    renderControlsCard(controls) {
        const box = this.dom.controlsBox;
        if (!box) return;
        box.innerHTML = controlsTemplate(controls);
    }

    renderCreditsCard() {
        const box = this.dom.creditsBox;
        if (!box) return;
        box.innerHTML = legalNoticeTemplate();
    }
}