export const uiManagerDomMethods = {

    /**
     * Caches all required DOM element references and stores them in `this.dom`.
     */
    cacheDom() {
        this.dom = {
            ...this.cacheLoadingElements(),
            ...this.cacheAppShellElements(),
            ...this.cacheMenuButtonElements(),
            ...this.cacheGameControlElements(),
            ...this.cachePauseElements(),
            ...this.cacheOverlayElements(),
            ...this.cacheOverlayContentElements()
        };
    },

    /**
     * Caches DOM elements related to the loading overlay.
     * @returns {Object} Object containing loading-related DOM references.
     */
    cacheLoadingElements() {
        return {
            loadingOverlay: document.getElementById('loading-overlay'),
        };
    },

    /**
     * Caches DOM elements related to the main application shell.
     * @returns {Object} Object containing app shell DOM references.
     */
    cacheAppShellElements() {
        return {
            body: document.body,
            canvas: document.getElementById('canvas'),
            introVideo: document.getElementById('intro-video'),
            h1: document.getElementById('h1'),
            overlayStartScreen: document.getElementById('overlay-start-screen'),
            overlayStartInitialisation: document.getElementById('overlay-start-initialisation')
        };
    },

    /**
     * Caches DOM elements related to the main menu buttons.
     * @returns {Object} Object containing menu button DOM references.
     */
    cacheMenuButtonElements() {
        return {
            welcomeButton: document.getElementById('welcome-button'),
            startButton: document.getElementById('start-button'),
            menuCharactersButton: document.getElementById('menu-characters-button'),
            menuStoryButton: document.getElementById('menu-story-button'),
            menuControlsButton: document.getElementById('menu-controls-button'),
            menuCreditsButton: document.getElementById('menu-credits-button'),
        };
    },

    /**
     * Caches DOM elements related to game control buttons and UI.
     * @returns {Object} Object containing game control DOM references.
     */
    cacheGameControlElements() {
        return {
            touchControls: document.getElementById('touch-controls'),
            pauseToggleButton: document.getElementById('pause-toggle-button'),
            fullscreenToggleButton: document.getElementById('fullscreen-toggle-button'),
            muteToggleButton: document.getElementById('mute-toggle-button'),
            nextLevelButton: document.getElementById('next-level-button'),
            LevelCompleteActions: document.getElementById('level-complete-actions'),
        };
    },

    /**
     * Caches DOM elements related to the pause menu and controls.
     * @returns {Object} Object containing pause-related DOM references.
     */
    cachePauseElements() {
        return {
            pauseOverlay: document.getElementById('pause-overlay'),
            pauseResumeButton: document.getElementById('pause-resume-button'),
            restartLevelButton: document.getElementById('restart-level-button'),
            pauseRestartButton: document.getElementById('pause-restart-button'),
            menuButton: document.getElementById('menu-button'),
            pauseMenuMainButton: document.getElementById('pause-menu-main-button'),
        };
    },

    /**
     * Caches DOM elements related to overlays and their close buttons.
     * @returns {Object} Object containing overlay DOM references.
     */
    cacheOverlayElements() {
        return {
            overlayCharacters: document.getElementById('overlay-characters'),
            overlayBigCard: document.getElementById('overlay-big-card'),
            overlayStory: document.getElementById('overlay-story'),
            overlayControls: document.getElementById('overlay-controls'),
            overlayCredits: document.getElementById('overlay-credits'),
            closeButton: document.getElementById('close-button'),
            closeCharactersOverlayButton: document.getElementById('close-characters-overlay-button'),
            closeStoryOverlayButton: document.getElementById('close-story-overlay-button'),
            closeControlsOverlayButton: document.getElementById('close-controls-overlay-button'),
            closeCreditsOverlayButton: document.getElementById('close-credits-overlay-button')
        };
    },

    /**
     * Caches DOM elements related to overlay content containers.
     * @returns {Object} Object containing overlay content DOM references.
     */
    cacheOverlayContentElements() {
        return {
            smallCardBox: document.getElementById('small-card-box'),
            bigCardBox: document.getElementById('big-card-box'),
            storyBox: document.getElementById('story-box'),
            controlsBox: document.getElementById('controls-box'),
            creditsBox: document.getElementById('credits-box'),
        };
    }
};