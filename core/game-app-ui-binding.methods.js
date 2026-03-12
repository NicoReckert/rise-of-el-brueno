export const gameAppUiBindingMethods = {

    /**
     * Binds all UI event handlers for the application.
     * @returns {void}
     */
    bindUIEvents() {
        this.bindMenuButtons();
        this.bindOverlayButtons();
        this.bindPauseControls();
        this.bindSystemControls();
    },

    /**
     * Binds UI events for main menu buttons.
     * @returns {void}
     */
    bindMenuButtons() {
        this.bindStartButton();
        this.bindNextLevelButton();
        this.bindWelcomeButton();
        this.bindMenuCharactersButton();
        this.bindMenuStoryButton();
        this.bindMenuControlsButton();
        this.bindMenuCreditsButton();
    },

    /**
     * Binds UI events for overlay buttons.
     * @returns {void}
     */
    bindOverlayButtons() {
        this.bindSmallCardBox();
        this.bindCloseButton();
        this.bindCloseCharactersOverlayButton();
        this.bindCloseStoryOverlayButton();
        this.bindCloseControlsOverlayButton();
        this.bindCloseCreditsOverlayButton();
    },

    /**
     * Binds UI events for pause controls.
     * @returns {void}
     */
    bindPauseControls() {
        this.bindPauseToggleButton();
        this.bindPauseResumeButton();
        this.bindPauseKey();
    },

    /**
     * Binds UI events for system control buttons.
     * @returns {void}
     */
    bindSystemControls() {
        this.bindFullscreenToggleButton();
        this.bindRestartButtons();
        this.bindReturnToMenuButtons();
        this.bindMuteToggleButton();
    },

    /**
     * Binds the start button to initialize and start the game.
     * @returns {void}
     */
    bindStartButton() {
        this.inputManager.listenStartButton(() => {
            if (!this.world) {
                this.initWorld();
            }
            this.world.startGame();
            this.uiManager.showGameScreen();
            this.fullscreenManager.setFullscreen(this.uiManager.dom.body);
            this.audioManager.stopTitleMusic();
        });
    },

    /**
     * Binds the next level button to start the next level.
     * @returns {void}
     */
    bindNextLevelButton() {
        this.inputManager.listenNextLevelButton(() => {
            if (!this.world) return;
            this.world.startNextLevel();
            const music = this.world.levelCompleteSetup?.sounds?.levelCompleteMusic;
            if (music) this.audioManager.fadeOutAudio(music);
            this.uiManager.hideLevelCompleteButtonBox();
        });
    },

    /**
     * Binds the pause toggle button to pause or resume the game.
     * @returns {void}
     */
    bindPauseToggleButton() {
        this.inputManager.listenPauseToggleButton(() => {
            this.pauseManager.toggle(this.world);
        });
    },

    /**
     * Binds the pause resume button to toggle the pause state.
     * @returns {void}
     */
    bindPauseResumeButton() {
        this.inputManager.listenPauseResumeButton(() => {
            this.pauseManager.toggle(this.world);
        });
    },

    /**
     * Binds the welcome button to start the intro sequence.
     * @returns {void}
     */
    bindWelcomeButton() {
        this.inputManager.listenWelcomeButton(() => {
            this.audioManager.playClickSound()
            this.fullscreenManager.setFullscreen(this.uiManager.dom.body);
            this.menuVisuals.startIntro();
        });
    },

    /**
     * Binds the characters menu button to open the characters overlay.
     * @returns {void}
     */
    bindMenuCharactersButton() {
        this.inputManager.listenMenuCharactersButton(() => {
            this.menuAudioAndCharacters.openCharactersOverlay();
        })
    },

    /**
     * Binds click events for character cards in the small card box.
     * @returns {void}
     */
    bindSmallCardBox() {
        this.inputManager.listenSmallCardBox((event) => {
            const card = event.target.closest(".img-text-box");
            if (!card) return;
            const characterName = card.dataset.character;
            this.menuAudioAndCharacters.renderBigCard(characterName);
        })
    },

    /**
     * Binds the close button for the character detail overlay.
     * @returns {void}
     */
    bindCloseButton() {
        this.inputManager.listenCloseButton(() => {
            this.menuAudioAndCharacters.closeBigBox();
        })
    },

    /**
     * Binds the button to close the characters overlay.
     * @returns {void}
     */
    bindCloseCharactersOverlayButton() {
        this.inputManager.listenCloseCharactersOverlayButton(() => {
            this.menuAudioAndCharacters.closeCharactersOverlay();
        })
    },

    /**
     * Binds the story menu button to open the story overlay.
     * @returns {void}
     */
    bindMenuStoryButton() {
        this.inputManager.listenMenuStoryButton(() => {
            this.menuAudioAndCharacters.openStoryOverlay();
        })
    },

    /**
     * Binds the button to close the story overlay.
     * @returns {void}
     */
    bindCloseStoryOverlayButton() {
        this.inputManager.listenCloseStoryOverlayButton(() => {
            this.menuAudioAndCharacters.closeStoryOverlay();
        })
    },

    /**
     * Binds the controls menu button to open the controls overlay.
     * @returns {void}
     */
    bindMenuControlsButton() {
        this.inputManager.listenMenuControlsButton(() => {
            this.menuAudioAndCharacters.openControlsOverlay();
        })
    },

    /**
     * Binds the button to close the controls overlay.
     * @returns {void}
     */
    bindCloseControlsOverlayButton() {
        this.inputManager.listenCloseControlsOverlayButton(() => {
            this.menuAudioAndCharacters.closeControlsOverlay();
        })
    },

    /**
     * Binds the credits menu button to open the credits overlay.
     * @returns {void}
     */
    bindMenuCreditsButton() {
        this.inputManager.listenMenuCreditsButton(() => {
            this.menuAudioAndCharacters.openCreditsOverlay();
        })
    },

    /**
     * Binds the button to close the credits overlay.
     * @returns {void}
     */
    bindCloseCreditsOverlayButton() {
        this.inputManager.listenCloseCreditsOverlayButton(() => {
            this.menuAudioAndCharacters.closeCreditsOverlay();
        })
    },

    /**
     * Binds the Escape key to toggle the pause state.
     * @returns {void}
     */
    bindPauseKey() {
        this.inputManager.listenEscapeKey(() => {
            const btn = this.uiManager.dom.pauseToggleButton;
            const pauseButtonVisible = btn && !btn.classList.contains('d-none');
            if (!pauseButtonVisible || !this.world) return;
            this.pauseManager.toggle(this.world);
        });
    },

    /**
     * Binds the fullscreen toggle button.
     * @returns {void}
     */
    bindFullscreenToggleButton() {
        this.inputManager.listenFullscreenToggleButton(() => {
            this.fullscreenManager.toggleFullscreen(this.uiManager.dom.body);
        });
    },

    /**
     * Binds restart buttons to restart the current level.
     * @returns {void}
     */
    bindRestartButtons() {
        const handler = () => this.restartGameFromCurrentLevel();
        this.inputManager.listenRepeatLevelButton(handler);
        this.inputManager.listenPauseRestartButton(handler);
    },

    /**
     * Binds buttons that return the game to the main menu.
     * @returns {void}
     */
    bindReturnToMenuButtons() {
        const handler = () => this.returnToMainMenu();
        this.inputManager.listenMenuLevelButton(handler);
        this.inputManager.listenPauseMenuMainButton(handler);
    },

    /**
     * Binds the mute toggle button to update the audio muted state.
     * @returns {void}
     */
    bindMuteToggleButton() {
        this.inputManager.listenMuteToggleButton(() => {
            const newMuted = !this.audioManager.isMuted;
            this.audioManager.setMutedState(newMuted);
        });
    }
}