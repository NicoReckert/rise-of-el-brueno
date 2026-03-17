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
     * Registers the start button click handler.
     * @param {Function} onStartGame Callback triggered when the start button is clicked.
     */
    listenStartButton(onStartGame) {
        this.bindClick(this.uiManager.dom.startButton, onStartGame);
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
     * Registers the welcome button click handler.
     * @param {Function} onStartIntro Callback triggered when the welcome button is clicked.
     */
    listenWelcomeButton(onStartIntro) {
        this.bindClick(this.uiManager.dom.welcomeButton, onStartIntro);
    },

    /**
     * Registers the characters menu button click handler.
     * @param {Function} onClick Callback triggered when the characters menu button is clicked.
     */
    listenMenuCharactersButton(onClick) {
        this.bindClick(this.uiManager.dom.menuCharactersButton, onClick);
    },

    /**
     * Registers the small card container click handler.
     * @param {Function} onClick Callback triggered when the small card container is clicked.
     */
    listenSmallCardBox(onClick) {
        this.bindClick(this.uiManager.dom.smallCardBox, onClick);
    },

    /**
     * Registers the close button click handler.
     * @param {Function} onClick Callback triggered when the close button is clicked.
     */
    listenCloseButton(onClick) {
        this.bindClick(this.uiManager.dom.closeButton, onClick);
    },

    /**
     * Registers the close characters overlay button click handler.
     * @param {Function} onClick Callback triggered when the close characters overlay button is clicked.
     */
    listenCloseCharactersOverlayButton(onClick) {
        this.bindClick(this.uiManager.dom.closeCharactersOverlayButton, onClick);
    },

    /**
     * Registers the story menu button click handler.
     * @param {Function} onClick Callback triggered when the story menu button is clicked.
     */
    listenMenuStoryButton(onClick) {
        this.bindClick(this.uiManager.dom.menuStoryButton, onClick);
    },

    /**
     * Registers the close story overlay button click handler.
     * @param {Function} onClick Callback triggered when the close story overlay button is clicked.
     */
    listenCloseStoryOverlayButton(onClick) {
        this.bindClick(this.uiManager.dom.closeStoryOverlayButton, onClick);
    },

    /**
     * Registers the controls menu button click handler.
     * @param {Function} onClick Callback triggered when the controls menu button is clicked.
     */
    listenMenuControlsButton(onClick) {
        this.bindClick(this.uiManager.dom.menuControlsButton, onClick);
    },

    /**
     * Registers the close controls overlay button click handler.
     * @param {Function} onClick Callback triggered when the close controls overlay button is clicked.
     */
    listenCloseControlsOverlayButton(onClick) {
        this.bindClick(this.uiManager.dom.closeControlsOverlayButton, onClick);
    },

    /**
     * Registers the credits menu button click handler.
     * @param {Function} onClick Callback triggered when the credits menu button is clicked.
     */
    listenMenuCreditsButton(onClick) {
        this.bindClick(this.uiManager.dom.menuCreditsButton, onClick);
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
     * Registers the pause restart button click handler.
     * @param {Function} onClick Callback triggered when the pause restart button is clicked.
     */
    listenPauseRestartButton(onClick) {
        this.bindClick(this.uiManager.dom.pauseRestartButton, onClick);
    },

    /**
     * Registers the level menu button click handler.
     * @param {Function} onClick Callback triggered when the level menu button is clicked.
     */
    listenMenuButton(onClick) {
        this.bindClick(this.uiManager.dom.menuButton, onClick);
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