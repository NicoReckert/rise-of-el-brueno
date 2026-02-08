import { AssetLoader } from './asset-loader.class.js';
import { World } from '../classes/world.class.js';
import { allAudios } from '../media-store.js';
import { AudioManager } from './audio-manager.class.js';
import { UIManager } from './ui-manager.class.js';
import { InputManager } from './input-manager.class.js';
import { Keyboard } from '../classes/keyboard.class.js';
import { stopTitleMusic } from '../script.js';
import { FullscreenManager } from './fullscreen-manager.class.js';
import { PauseManager } from './pause-manager.class.js';

export class GameApp {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.world = null;
        this.characterImages = null;
        this.entityImages = null;
        this.assetLoader = new AssetLoader();
        this.uiManager = new UIManager();
        this.audioManager = new AudioManager;
        this.fullscreenManager = new FullscreenManager();
        this.pauseManager = new PauseManager(this.uiManager, this.audioManager, this.allAudios);
        this.keyboard = new Keyboard();
        this.inputManager = new InputManager(this.keyboard, this.uiManager);
    }

    async start() {
        await this.initCore();
        this.initWorld();
        this.bindUIEvents();
        this.startBackgroundAssetLoading();
    }


    async initCore() {
        await this.assetLoader.init();
        this.restoreMutedState();
        this.uiManager.fadeOutLoadingOverlay();
    }

    initWorld() {
        this.world = new World(
            this.canvas,
            this.keyboard,
            this.assetLoader.characterImages,
            this.assetLoader.entityImages
        );
    }

    bindUIEvents() {
        this.bindStartButton();
        this.bindNextLevelButton();
        this.bindPauseToggleButton();
        this.bindPauseResumeButton();
    }

    bindStartButton() {
        this.inputManager.listenStartButton(() => {
            this.world.startGame();
            this.uiManager.showGameScreen();
            this.fullscreenManager.setFullscreen();
            stopTitleMusic();
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

    startBackgroundAssetLoading() {
        this.loadDeferredIntoWorld();
        this.loadLazyIntoWorld();
    }






    restoreMutedState() {
        const savedMuted = localStorage.getItem("elBruenoMuted") === "1";
        this.audioManager.setMutedState(savedMuted);
    }

    async loadDeferredIntoWorld() {
        const { charDeferred, entityDeferred, audioRes, videoRes } =
            await this.assetLoader.loadDeferredManifests();
        this.logDeferredErrors(audioRes, videoRes);
        this.world.applyDeferredAssets(charDeferred, entityDeferred);
        if (this.audioManager.isMuted) {
            this.audioManager.applyMuteToAllAudios();
        }
    }

    logDeferredErrors(audioRes, videoRes) {
        if (audioRes.status === 'rejected') {
            console.warn('[loadDeferredAssets] farmAudioManifestDeferred failed:', audioRes.reason);
        }
        if (videoRes.status === 'rejected') {
            console.warn('[loadDeferredAssets] farmVideoManifestDeferred failed:', videoRes.reason);
        } else if (videoRes.status === 'fulfilled') {
            console.log('[loadDeferredAssets] videos loaded (deferred)');
        }
    }

    async loadLazyIntoWorld() {
        try {
            const { charLazy, entityLazy, audioRes } =
                await this.assetLoader.loadLazyManifests();
            if (audioRes.status === 'rejected') {
                console.warn('[loadLazyAssets] otherLevelAudioManifestLazy failed:', audioRes.reason);
            }
            this.world.applyLazyAssets(charLazy, entityLazy);
            if (this.audioManager.isMuted) {
                this.audioManager.applyMuteToAllAudios();
            }
        } catch (e) {
            console.warn('[loadLazyAssets] unexpected error:', e);
        }
    }


































    restartGameFromCurrentLevel() {
        // Level-Complete-Overlay und Pause-Overlay schließen
        document.getElementById('level-complete-button-box').classList.add('d-none');
        pauseOverlay.classList.add('d-none');

        if (world) world.destroy();
        resetAllAudios(allAudios, { log: true });

        world = new World(canvas, characterImages, entityImages, allAudios);
        if (typeof world.initRemainingSetups === "function") {
            world.initRemainingSetups();
        }
        world.startGame();
        document.getElementById('pause-toggle-button').classList.remove('d-none');
        document.getElementById('mute-toggle-button').classList.remove('d-none');
        document.getElementById('fullscreen-toggle-button').classList.remove('d-none');
        document.getElementById('move-button-box').classList.add('move-button-box-active');
    }

    returnToMainMenu() {
        // Level-Complete-Box & Pause-Overlay schließen
        document.getElementById('level-complete-button-box').classList.add('d-none');
        pauseOverlay.classList.add('d-none');
        document.getElementById('pause-toggle-button').classList.add('d-none');
        document.getElementById('mute-toggle-button').classList.add('d-none');
        document.getElementById('fullscreen-toggle-button').classList.add('d-none');
        document.getElementById('move-button-box').classList.remove('move-button-box-active');


        try {
            fadeOutAudio(world.levelCompleteSetup.sounds.levelCompleteMusic, 1000);
        } catch (e) {
            // falls levelCompleteSetup hier noch nicht existiert → ignorieren
        }

        fadeInTitleMusic();
        document.getElementById('overlay-startscreen').style.display = 'flex';
        document.getElementById('move-button-box').classList.add('d-none');

        if (document.fullscreenElement) {
            try {
                document.exitFullscreen();
            } catch (err) {
                console.warn('Fehler beim Beenden des Fullscreens:', err);
            }
        }

        if (world) world.destroy();
        resetAllAudios(allAudios, { log: true });

        world = new World(canvas, characterImages, entityImages, allAudios);
        if (typeof world.initRemainingSetups === "function") {
            world.initRemainingSetups();
        }
    }
}
