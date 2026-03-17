import { AssetLoader } from './asset-loader.class.js';
import { World } from '../classes/core/world.class.js';
import { AudioManager } from './audio-manager.class.js';
import { UIManager } from './ui-manager.class.js';
import { InputManager } from './input-manager.class.js';
import { GameplayInputController } from './gameplay-input-controller.class.js';
import { Keyboard } from '../classes/systems/keyboard.class.js';
import { FullscreenManager } from './fullscreen-manager.class.js';
import { PauseManager } from './pause-manager.class.js';
import { VideoManager } from './video-manager.class.js';
import { MenuVisuals } from './menu-visuals.class.js';
import { MenuAudioAndCharacters } from './menu-audio-and-characters.class.js';
import { gameAppUiBindingMethods } from './game-app-ui-binding.methods.js';
import { gameAppAssetMethods } from './game-app-assets.methods.js';
import { gameAppSessionMethods } from './game-app-session.methods.js';

/**
 * Main application class responsible for initializing and managing the game.
 */
export class GameApp {
    /**
     * Creates a new GameApp instance.
     */
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.world = null;
        this.characterImages = null;
        this.entityImages = null;
        this.initCoreManagers();
        this.initInputManagers();
        this.initMenuManagers();
    }

    /**
     * Initializes core managers used by the application.
     * @returns {void}
     */
    initCoreManagers() {
        this.assetLoader = new AssetLoader();
        this.uiManager = new UIManager();
        this.audioManager = new AudioManager(this.uiManager);
        this.fullscreenManager = new FullscreenManager();
        this.pauseManager = new PauseManager(this.uiManager, this.audioManager);
    }

    /**
     * Initializes input-related managers.
     * @returns {void}
     */
    initInputManagers() {
        this.keyboard = new Keyboard();
        this.inputManager = new InputManager(this.keyboard, this.uiManager);
        this.gameplayInputController = new GameplayInputController(this.keyboard);
        this.videoManager = new VideoManager();
    }

    /**
     * Initializes menu-related managers and visual components.
     * @returns {void}
     */
    initMenuManagers() {
        this.menuVisuals = new MenuVisuals(this.videoManager, this.audioManager, this.uiManager);
        this.menuAudioAndCharacters = new MenuAudioAndCharacters(this.audioManager, this.videoManager, this.uiManager);
    }

    /**
     * Starts the application by initializing core systems and the world.
     * @returns {Promise<void>}
     */
    async start() {
        await this.initCore();
        this.initWorld();
        this.bindUIEvents();
        this.startBackgroundAssetLoading();
    }

    /**
     * Initializes core assets and application state.
     * @returns {Promise<void>}
     */
    async initCore() {
        await this.assetLoader.init();
        this.initMenuAfterAssets();
        this.restoreMutedState();
        this.finishCoreInit();
    }

    /**
     * Initializes menu visuals and audio after core assets are loaded.
     * @returns {void}
     */
    initMenuAfterAssets() {
        this.menuVisuals.init();
        this.audioManager.addAudios(this.assetLoader.introAudios);
        this.audioManager.addAudios(this.assetLoader.immediateAudios);
        this.menuAudioAndCharacters.setupTitleIntro();
        this.menuAudioAndCharacters.initCharacterData();
    }

    /**
     * Finalizes core initialization and updates UI state.
     * @returns {void}
     */
    finishCoreInit() {
        this.uiManager.fadeOutLoadingOverlay();
        this.fullscreenManager.initFullscreenClassToggle(
            this.uiManager.dom.body,
            (active) => this.uiManager.updateFullscreenButtonUI(active)
        );
        this.inputManager.initMoveButtonVisuals(this.uiManager.dom.touchControls);
    }

    /**
     * Initializes the game world instance.
     * @returns {void}
     */
    initWorld() {
        this.world = new World(
            this.canvas,
            this.keyboard,
            this.assetLoader.characterImages,
            this.assetLoader.entityImages,
            this.assetLoader.levelImages,
            this.audioManager,
            this.videoManager,
            this.gameplayInputController
        );
    }
}

/**
 * Extends GameApp with UI binding, asset handling, and session methods.
 */
Object.assign(
    GameApp.prototype,
    gameAppUiBindingMethods,
    gameAppAssetMethods,
    gameAppSessionMethods
);