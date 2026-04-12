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
            gameTitle: document.getElementById('game-title'),
            startScreenOverlay: document.getElementById('start-screen-overlay'),
            introOverlay: document.getElementById('intro-overlay'),
            introActions: document.getElementById('intro-actions')
        };
    },

    /**
     * Caches DOM elements related to the main menu buttons.
     * @returns {Object} Object containing menu button DOM references.
     */
    cacheMenuButtonElements() {
        return {
            introStartButton: document.getElementById('intro-start-button'),
            introSkipButton: document.getElementById('intro-skip-button'),
            startGameButton: document.getElementById('start-game-button'),
            openCharactersButton: document.getElementById('open-characters-button'),
            openStoryButton: document.getElementById('open-story-button'),
            openControlsButton: document.getElementById('open-controls-button'),
            openCreditsButton: document.getElementById('open-credits-button'),
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
            levelCompleteMenuButton: document.getElementById('level-complete-menu-button'),
            gameOverMenuButton: document.getElementById('game-over-menu-button'),
            gameOverCheckpointButton: document.getElementById('game-over-checkpoint-button'),
            endCreditsMenuButton: document.getElementById('end-credits-menu-button'),
            levelCompleteActions: document.getElementById('level-complete-actions'),
            gameOverActions: document.getElementById('game-over-actions'),
            gameOverVideo: document.getElementById('game-over-video'),
            gameOverVideoOverlay: document.getElementById('game-over-video-overlay'),
            gameOverVideoVignette: document.getElementById('game-over-video-vignette'),
            gameOverVideoLight: document.getElementById('game-over-video-light'),
            endCreditsActions: document.getElementById('end-credits-actions'),
            endCreditsVideo: document.getElementById('end-credits-video'),
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
            gameOverRestartButton: document.getElementById('game-over-restart-button'),
            pauseRestartButton: document.getElementById('pause-restart-button'),
            pauseMenuMainButton: document.getElementById('pause-menu-main-button')
        };
    },

    /**
     * Caches DOM elements related to overlays and their close buttons.
     * @returns {Object} Object containing overlay DOM references.
     */
    cacheOverlayElements() {
        return {
            charactersOverlay: document.getElementById('characters-overlay'),
            characterDetailOverlay: document.getElementById('character-detail-overlay'),
            storyOverlay: document.getElementById('story-overlay'),
            controlsOverlay: document.getElementById('controls-overlay'),
            creditsOverlay: document.getElementById('credits-overlay'),
            closeDetailOverlayButton: document.getElementById('close-detail-overlay-button'),
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
            characterList: document.getElementById('character-list'),
            detailCardContainer: document.getElementById('detail-card-container'),
            storySection: document.getElementById('story-section'),
            controlsSection: document.getElementById('controls-section'),
            creditsSection: document.getElementById('credits-section'),
        };
    }
};