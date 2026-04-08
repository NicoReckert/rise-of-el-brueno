export const inputManagerButtonMethods = {

    /**
     * Binds a click event handler to a DOM element.
     * @param {HTMLElement} element Target element.
     * @param {Function} handler Click event handler.
     */
    bindClick(element, handler) {
        if (!element || !handler) return;
        element.addEventListener('click', handler);
    },

    /**
     * Registers a click listener for the start game button.
     * @param {Function} onStartGame Click handler.
     * @returns {void}
     */
    listenStartGameButton(onStartGame) {
        this.bindClick(this.uiManager.dom.startGameButton, onStartGame);
    },

    /**
     * Registers the next level button click handler.
     * @param {Function} onStartNextLevel Callback triggered when the next level button is clicked.
     */
    listenNextLevelButton(onStartNextLevel) {
        this.bindClick(this.uiManager.dom.nextLevelButton, onStartNextLevel);
    },

    /**
     * Registers the pause toggle button click handler.
     * @param {Function} onTogglePause Callback triggered when the pause toggle button is clicked.
     */
    listenPauseToggleButton(onTogglePause) {
        this.bindClick(this.uiManager.dom.pauseToggleButton, onTogglePause);
    },

    /**
     * Registers the pause resume button click handler.
     * @param {Function} onTogglePause Callback triggered when the pause resume button is clicked.
     */
    listenPauseResumeButton(onTogglePause) {
        this.bindClick(this.uiManager.dom.pauseResumeButton, onTogglePause);
    },

    /**
     * Registers a click listener for the intro start button.
     * @param {Function} onStartIntro Click handler.
     * @returns {void}
     */
    listenIntroStartButton(onStartIntro) {
        this.bindClick(this.uiManager.dom.introStartButton, onStartIntro);
    },

    /**
     * Registers a click listener for the open characters button.
     * @param {Function} onClick Click handler.
     * @returns {void}
     */
    listenOpenCharactersButton(onClick) {
        this.bindClick(this.uiManager.dom.openCharactersButton, onClick);
    },

    /**
     * Registers a click listener for the character list.
     * @param {Function} onClick Click handler.
     * @returns {void}
     */
    listenCharacterList(onClick) {
        this.bindClick(this.uiManager.dom.characterList, onClick);
    },

    /**
     * Registers a click listener for the close detail overlay button.
     * @param {Function} onClick Click handler.
     * @returns {void}
     */
    listenCloseDetailOverlayButton(onClick) {
        this.bindClick(this.uiManager.dom.closeDetailOverlayButton, onClick);
    },

    /**
     * Registers the close characters overlay button click handler.
     * @param {Function} onClick Callback triggered when the close characters overlay button is clicked.
     */
    listenCloseCharactersOverlayButton(onClick) {
        this.bindClick(this.uiManager.dom.closeCharactersOverlayButton, onClick);
    },

    /**
     * Registers a click listener for the open story button.
     * @param {Function} onClick Click handler.
     * @returns {void}
     */
    listenOpenStoryButton(onClick) {
        this.bindClick(this.uiManager.dom.openStoryButton, onClick);
    },

    /**
     * Registers the close story overlay button click handler.
     * @param {Function} onClick Callback triggered when the close story overlay button is clicked.
     */
    listenCloseStoryOverlayButton(onClick) {
        this.bindClick(this.uiManager.dom.closeStoryOverlayButton, onClick);
    },

    /**
     * Registers a click listener for the open controls button.
     * @param {Function} onClick Click handler.
     * @returns {void}
     */
    listenOpenControlsButton(onClick) {
        this.bindClick(this.uiManager.dom.openControlsButton, onClick);
    },

    /**
     * Registers the close controls overlay button click handler.
     * @param {Function} onClick Callback triggered when the close controls overlay button is clicked.
     */
    listenCloseControlsOverlayButton(onClick) {
        this.bindClick(this.uiManager.dom.closeControlsOverlayButton, onClick);
    },

    /**
     * Registers a click listener for the open credits button.
     * @param {Function} onClick Click handler.
     * @returns {void}
     */
    listenOpenCreditsButton(onClick) {
        this.bindClick(this.uiManager.dom.openCreditsButton, onClick);
    },

    /**
     * Registers the close credits overlay button click handler.
     * @param {Function} onClick Callback triggered when the close credits overlay button is clicked.
     */
    listenCloseCreditsOverlayButton(onClick) {
        this.bindClick(this.uiManager.dom.closeCreditsOverlayButton, onClick);
    },

    /**
     * Registers the fullscreen toggle button click handler.
     * @param {Function} onToggle Callback triggered when the fullscreen toggle button is clicked.
     */
    listenFullscreenToggleButton(onToggle) {
        this.bindClick(this.uiManager.dom.fullscreenToggleButton, onToggle);
    },

    /**
     * Registers the repeat level button click handler.
     * @param {Function} onClick Callback triggered when the repeat level button is clicked.
     */
    listenRestartLevelButton(onClick) {
        this.bindClick(this.uiManager.dom.restartLevelButton, onClick);
    },

    /**
     * Binds click listener for the game over restart button.
     * @param {Function} onClick Click handler.
     * @returns {void}
     */
    listenGameOverRestartButton(onClick) {
        this.bindClick(this.uiManager.dom.gameOverRestartButton, onClick);
    },

    /**
     * Registers the pause restart button click handler.
     * @param {Function} onClick Callback triggered when the pause restart button is clicked.
     */
    listenPauseRestartButton(onClick) {
        this.bindClick(this.uiManager.dom.pauseRestartButton, onClick);
    },

    /**
     * Registers a click listener for the level complete menu button.
     * @param {Function} onClick Click handler.
     * @returns {void}
     */
    listenLevelCompleteMenuButton(onClick) {
        this.bindClick(this.uiManager.dom.levelCompleteMenuButton, onClick);
    },

    /**
     * Binds click listener for the game over menu button.
     * @param {Function} onClick Click handler.
     * @returns {void}
     */
    listenGameOverMenuButton(onClick) {
        this.bindClick(this.uiManager.dom.gameOverMenuButton, onClick);
    },

    /**
     * Binds a click handler to the end credits menu button.
     * @param {Function} onClick Click handler.
     */
    listenEndCreditsMenuButton(onClick) {
        this.bindClick(this.uiManager.dom.endCreditsMenuButton, onClick);
    },

    /**
     * Registers the pause menu main button click handler.
     * @param {Function} onClick Callback triggered when the pause menu main button is clicked.
     */
    listenPauseMenuMainButton(onClick) {
        this.bindClick(this.uiManager.dom.pauseMenuMainButton, onClick);
    },

    /**
     * Registers the mute toggle button click handler.
     * @param {Function} onToggle Callback triggered when the mute toggle button is clicked.
     */
    listenMuteToggleButton(onToggle) {
        this.bindClick(this.uiManager.dom.muteToggleButton, onToggle);
    }
}