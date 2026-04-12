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
        this.bindStartGameButton();
        this.bindNextLevelButton();
        this.bindIntroStartButton();
        this.bindIntroSkipButton();
        this.bindOpenCharactersButton();
        this.bindOpenStoryButton();
        this.bindOpenControlsButton();
        this.bindOpenCreditsButton();
    },

    /**
     * Binds UI events for overlay buttons.
     * @returns {void}
     */
    bindOverlayButtons() {
        this.bindCharacterList();
        this.bindCloseDetailOverlayButton();
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
     * Binds the start game button click event.
     * @returns {void}
     */
    bindStartGameButton() {
        this.inputManager.listenStartGameButton(() => {
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
            this.uiManager.hideLevelCompleteActions();
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
     * Binds the intro start button click event.
     * @returns {void}
     */
    bindIntroStartButton() {
        this.inputManager.listenIntroStartButton(() => {
            this.audioManager.playClickSound()
            this.fullscreenManager.setFullscreen(this.uiManager.dom.body);
            this.menuVisuals.startIntro();
        });
    },

    /**
     * Binds intro skip button behavior.
     * @returns {void}
     */
    bindIntroSkipButton() {
        this.inputManager.listenIntroSkipButton(() => {
            this.audioManager.playClickSound();
            this.fullscreenManager.setFullscreen(this.uiManager.dom.body);
            this.menuVisuals.skipIntro();
        });
    },

    /**
     * Binds the open characters button click event.
     * @returns {void}
     */
    bindOpenCharactersButton() {
        this.inputManager.listenOpenCharactersButton(() => {
            this.menuAudioAndCharacters.openCharactersOverlay();
        })
    },

    /**
     * Binds character list click events.
     * @returns {void}
     */
    bindCharacterList() {
        this.inputManager.listenCharacterList((event) => {
            const card = event.target.closest(".character-card");
            if (!card) return;
            const characterName = card.dataset.character;
            this.menuAudioAndCharacters.renderBigCard(characterName);
        })
    },

    /**
     * Binds the close detail overlay button click event.
     * @returns {void}
     */
    bindCloseDetailOverlayButton() {
        this.inputManager.listenCloseDetailOverlayButton(() => {
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
     * Binds the open story button click event.
     * @returns {void}
     */
    bindOpenStoryButton() {
        this.inputManager.listenOpenStoryButton(() => {
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
     * Binds the open controls button click event.
     * @returns {void}
     */
    bindOpenControlsButton() {
        this.inputManager.listenOpenControlsButton(() => {
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
     * Binds the open credits button click event.
     * @returns {void}
     */
    bindOpenCreditsButton() {
        this.inputManager.listenOpenCreditsButton(() => {
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
        this.inputManager.listenRestartLevelButton(handler);
        this.inputManager.listenGameOverRestartButton(handler);
        this.inputManager.listenPauseRestartButton(handler);
        this.inputManager.listenGameOverCheckpointButton(() => {
            this.restartGameFromTownCheckpoint();
        });
    },

    /**
     * Binds buttons that return the game to the main menu.
     * @returns {void}
     */
    bindReturnToMenuButtons() {
        const handler = () => this.returnToMainMenu();
        this.inputManager.listenLevelCompleteMenuButton(handler);
        this.inputManager.listenGameOverMenuButton(handler);
        this.inputManager.listenEndCreditsMenuButton(handler);
        this.inputManager.listenPauseMenuMainButton(handler);
    },

    /**
     * Binds a listener to toggle the global muted state.
     * @returns {void}
     */
    bindMuteToggleButton() {
        this.inputManager.listenMuteToggleButton(() => {
            const newMuted = !this.audioManager.isMuted;
            const creditsVideo = this.world?.endCreditsSetup?.video;
            this.audioManager.setMutedState(newMuted);
            if (creditsVideo) creditsVideo.muted = newMuted;
        });
    }
}