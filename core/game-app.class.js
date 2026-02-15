import { AssetLoader } from './asset-loader.class.js';
import { World } from '../classes/core/world.class.js';
import { AudioManager } from './audio-manager.class.js';
import { UIManager } from './ui-manager.class.js';
import { InputManager } from './input-manager.class.js';
import { Keyboard } from '../classes/systems/keyboard.class.js';
import { FullscreenManager } from './fullscreen-manager.class.js';
import { PauseManager } from './pause-manager.class.js';
import { VideoManager } from './video-manager.class.js';
import { MenuVisuals } from './menu-visuals.class.js';
import { MenuAudioAndCharacters } from './menu-audio-and-characters.class.js';

export class GameApp {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.world = null;
        this.characterImages = null;
        this.entityImages = null;
        this.assetLoader = new AssetLoader();
        this.uiManager = new UIManager();
        this.audioManager = new AudioManager(this.uiManager);
        this.fullscreenManager = new FullscreenManager();
        this.pauseManager = new PauseManager(this.uiManager, this.audioManager);
        this.keyboard = new Keyboard();
        this.inputManager = new InputManager(this.keyboard, this.uiManager);
        this.videoManager = new VideoManager();
        this.menuVisuals = new MenuVisuals(this.videoManager, this.audioManager, this.uiManager);
        this.menuAudioAndCharacters = new MenuAudioAndCharacters(this.audioManager, this.videoManager, this.uiManager);
    }

    async start() {
        await this.initCore();
        this.initWorld();
        this.bindUIEvents();
        this.startBackgroundAssetLoading();
    }


    async initCore() {
        await this.assetLoader.init();
        this.menuVisuals.init();
        this.audioManager.addAudios(this.assetLoader.introAudios);
        this.audioManager.addAudios(this.assetLoader.immediateAudios);
        this.menuAudioAndCharacters.setupTitleIntro();
        this.menuAudioAndCharacters.initCharacterData();
        this.restoreMutedState();
        this.uiManager.fadeOutLoadingOverlay();
        this.fullscreenManager.initFullscreenClassToggle(
            this.uiManager.dom.body,
            (active) => this.uiManager.updateFullscreenButtonUI(active)
        );
        this.inputManager.initMoveButtonVisuals(this.uiManager.dom.moveButtonBox);
    }

    initWorld() {
        this.world = new World(
            this.canvas,
            this.keyboard,
            this.assetLoader.characterImages,
            this.assetLoader.entityImages,
            this.audioManager,
            this.videoManager
        );
    }

    bindUIEvents() {
        this.bindStartButton();
        this.bindNextLevelButton();
        this.bindPauseToggleButton();
        this.bindPauseResumeButton();
        this.bindWelcomeButton();
        this.bindMenuCharactersButton();
        this.bindsmallCardBox();
        this.bindCloseButton();
        this.bindCloseCharactersOverlayButton();
        this.bindMenuStoryButton();
        this.bindCloseStoryOverlayButton();
        this.bindMenuControlsButton();
        this.bindCloseControlsOverlayButton();
        this.bindMenuCreditsButton();
        this.bindCloseCreditsOverlayButton();
        this.bindPauseKey();
        this.bindFullscreenToggleButton();
        this.bindRestartButtons();
        this.bindReturnToMenuButtons();
        this.bindMuteToggleButton();
    }

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
    }

    bindNextLevelButton() {
        this.inputManager.listenNextLevelButton(() => {
            this.world.startNextLevel();
            const music = this.world.levelCompleteSetup?.sounds?.levelCompleteMusic;
            if (music) this.audioManager.fadeOutAudio(music);
            this.uiManager.hideLevelCompleteButtonBox();
        });
    }

    bindPauseToggleButton() {
        this.inputManager.listenPauseToggleButton(() => {
            this.pauseManager.toggle(this.world);
        });
    }

    bindPauseResumeButton() {
        this.inputManager.listenPauseResumeButton(() => {
            this.pauseManager.toggle(this.world);
        });
    }

    bindWelcomeButton() {
        this.inputManager.listenWelcomeButton(() => {
            this.audioManager.playClickSound()
            this.fullscreenManager.setFullscreen(this.uiManager.dom.body);
            this.menuVisuals.startIntro();
        });
    }

    bindMenuCharactersButton() {
        this.inputManager.listenMenuCharactersButton(() => {
            this.menuAudioAndCharacters.openCharactersOverlay();
        })
    }

    bindsmallCardBox() {
        this.inputManager.listenSmallCardBox((event) => {
            const card = event.target.closest(".img-text-box");
            if (!card) return;

            const characterName = card.dataset.character;
            this.menuAudioAndCharacters.renderBigCard(characterName);
        })
    }

    bindCloseButton() {
        this.inputManager.listenCloseButton(() => {
            this.menuAudioAndCharacters.closeBigBox();
        })
    }

    bindCloseCharactersOverlayButton() {
        this.inputManager.listenCloseCharactersOverlayButton(() => {
            this.menuAudioAndCharacters.closeCharactersOverlay();
        })
    }

    bindMenuStoryButton() {
        this.inputManager.listenMenuStoryButton(() => {
            this.menuAudioAndCharacters.openStoryOverlay();
        })
    }

    bindCloseStoryOverlayButton() {
        this.inputManager.listenCloseStoryOverlayButton(() => {
            this.menuAudioAndCharacters.closeStoryOverlay();
        })
    }

    bindMenuControlsButton() {
        this.inputManager.listenMenuControlsButton(() => {
            this.menuAudioAndCharacters.openControlsOverlay();
        })
    }

    bindCloseControlsOverlayButton() {
        this.inputManager.listenCloseControlsOverlayButton(() => {
            this.menuAudioAndCharacters.closeControlsOverlay();
        })
    }

    bindMenuCreditsButton() {
        this.inputManager.listenMenuCreditsButton(() => {
            this.menuAudioAndCharacters.openCreditsOverlay();
        })
    }

    bindCloseCreditsOverlayButton() {
        this.inputManager.listenCloseCreditsOverlayButton(() => {
            this.menuAudioAndCharacters.closeCreditsOverlay();
        })
    }

    bindPauseKey() {
        this.inputManager.listenEscapeKey(() => {
            const btn = this.uiManager.dom.pauseToggleButton;
            const pauseButtonVisible = btn && !btn.classList.contains('d-none');
            if (!pauseButtonVisible || !this.world) return;
            this.pauseManager.toggle(this.world);
        });
    }

    bindFullscreenToggleButton() {
        this.inputManager.listenFullscreenToggleButton(() => {
            this.fullscreenManager.toggleFullscreen(this.uiManager.dom.body);
        });
    }

    bindRestartButtons() {
        const handler = () => this.restartGameFromCurrentLevel();
        this.inputManager.listenRepeatLevelButton(handler);
        this.inputManager.listenPauseRestartButton(handler);
    }

    bindReturnToMenuButtons() {
        const handler = () => this.returnToMainMenu();
        this.inputManager.listenMenuLevelButton(handler);
        this.inputManager.listenPauseMenuMainButton(handler);
    }

    bindMuteToggleButton() {
        this.inputManager.listenMuteToggleButton(() => {
            const newMuted = !this.audioManager.isMuted;
            this.audioManager.setMutedState(newMuted);
        });
    }

    startBackgroundAssetLoading() {
        this.loadDeferredIntoWorld();
        this.loadLazyIntoWorld();
    }

    restoreMutedState() {
        const savedMuted = localStorage.getItem("elBruenoMuted") === "1";
        this.audioManager.setMutedState(savedMuted);
    }

    async loadDeferredIntoWorld() {
        const { charDeferred, entityDeferred, deferredAudios, deferredVideos } =
            await this.assetLoader.loadDeferredManifests();
        if (deferredAudios && this.audioManager) {
            this.audioManager.addAudios(deferredAudios);
        }
        if (deferredVideos && this.videoManager) {
            this.videoManager.addVideos(deferredVideos);
        }
        this.world.applyDeferredAssets(charDeferred, entityDeferred);
        if (this.audioManager.isMuted) {
            this.audioManager.applyMuteToAllAudios(this.audioManager.audios);
        }
    }

    async loadLazyIntoWorld() {
        try {
            const { charLazy, entityLazy, lazyAudios } =
                await this.assetLoader.loadLazyManifests();
            if (lazyAudios && this.audioManager) {
                this.audioManager.addAudios(lazyAudios);
            }
            this.world.applyLazyAssets(charLazy, entityLazy);
            if (this.audioManager.isMuted) {
                this.audioManager.applyMuteToAllAudios(this.audioManager.audios);
            }
        } catch (e) {
            console.warn('[loadLazyAssets] unexpected error:', e);
        }
    }

    restartGameFromCurrentLevel() {
        if (!this.world) return;
        this.uiManager.hideLevelCompleteButtonBox();
        this.uiManager.hidePauseOverlay();
        this.uiManager.showGameControls();
        this.audioManager.resetAllAudios(this.audioManager.audios);
        this.world.restartLevel(this.world.currentScene);
    }

    returnToMainMenu() {
        if (!this.world) return;
        this.uiManager.hideLevelCompleteButtonBox();
        this.uiManager.hidePauseOverlay();
        this.uiManager.hideGameControls();
        this.stopLevelCompleteMusic();
        this.exitFullscreenIfNeeded();
        this.resetWorldStateForMenu();
        this.uiManager.showMainMenuScreen();
        this.startMenuMusic();
    }

    stopLevelCompleteMusic() {
        const music = this.world?.levelCompleteSetup?.sounds?.levelCompleteMusic;
        if (!music) return;
        this.audioManager.fadeOutAudio(music, 1000);
    }

    exitFullscreenIfNeeded() {
        if (!this.fullscreenManager.isFullscreenActive()) return;
        this.fullscreenManager.exitFullscreen();
    }

    resetWorldStateForMenu() {
        this.audioManager.resetAllAudios(this.audioManager.audios);
        this.world.destroy();
        this.world = null;
    }

    startMenuMusic() {
        const loop = this.audioManager.get('titleMusicLoop');
        if (!loop) return;
        loop.currentTime = 0;
        this.audioManager.fadeInAudio(loop, 2000);
    }
}