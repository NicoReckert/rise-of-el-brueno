import { IntroScreen } from '../ui/intro-screen.class.js'
import { Character } from '../entities/character.class.js';
import { TaskWindow } from '../ui/task-window.class.js';
import { smartMerge } from '../../utils/asset-merge.util.js';
import { WorldRenderer } from './world-renderer.class.js';
import { CharacterAudioController } from '../systems/character-audio-controller.class.js';
import { LevelManager } from '../systems/level-manager.class.js';
import { WorldCleanup } from '../systems/world-cleanup.class.js';

/**
 * Represents the game world.
 */
export class World {
    /**
    * Creates a new instance.
    * @param {HTMLCanvasElement} canvas Rendering canvas.
    * @param {Object} keyboard Keyboard input handler.
    * @param {Object} characterImages Character image assets.
    * @param {Object} entityImages Entity image assets.
    * @param {Object} audioManager Audio manager instance.
    * @param {Object} videoManager Video manager instance.
    * @param {Object} inputManager Input manager instance.
    */
    constructor(canvas, keyboard, characterImages, entityImages, audioManager, videoManager, inputManager) {
        this.initCore(canvas, keyboard, characterImages, entityImages, audioManager, videoManager, inputManager);
        this.initCharacterAndAudio();
        this.initSystems();
        this.initThrowAndCameraState();
        this.initIntroAndPauseState();
        this.initCombatState();
        this.initLevelBounds();
        this.initTasks();
    }

    /**
    * Initializes core properties and dependencies.
    * @param {HTMLCanvasElement} canvas Rendering canvas.
    * @param {Object} keyboard Keyboard input handler.
    * @param {Object} characterImages Character image assets.
    * @param {Object} entityImages Entity image assets.
    * @param {Object} audioManager Audio manager instance.
    * @param {Object} videoManager Video manager instance.
    * @param {Object} inputManager Input manager instance.
    */
    initCore(canvas, keyboard, characterImages, entityImages, audioManager, videoManager, inputManager) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.renderer = new WorldRenderer(this.ctx);
        this.keyboard = keyboard;
        this.characterImages = characterImages;
        this.entityImages = entityImages;
        this.audioManager = audioManager;
        this.videoManager = videoManager;
        this.inputManager = inputManager;
        this.currentScene = 'farmLevel';
    }

    /**
    * Initializes character and audio components.
    */
    initCharacterAndAudio() {
        this.character = new Character(this.characterImages);
        this.characterAudio = new CharacterAudioController(this.character, this.audioManager);
        this.allAudios = this.audioManager.audios;
        this.allVideos = this.videoManager.videos;
    }

    /**
    * Initializes system components.
    */
    initSystems() {
        this.levelManager = new LevelManager(this);
        this.cleanup = new WorldCleanup(this);
    }

    /**
    * Initializes throw and camera state.
    */
    initThrowAndCameraState() {
        this.lastThrowCheck = 0;
        this.throwCheckDelay = 120;
        this.camera_x = 0;
        this.lastTime = performance.now();
        this.frameId = null;
    }

    /**
    * Initializes intro and pause state.
    */
    initIntroAndPauseState() {
        this.intro = new IntroScreen(this.ctx, this.canvas);
        this.chapterSound = this.allAudios.chapterSound;
        this.isChapterSoundPlayed = false;
        this.isKeysStopp = false;
        this.paused = false;
        this.isRunning = true;
    }

    /**
    * Initializes combat state.
    */
    initCombatState() {
        this.attackStartTime = null;
        this.attackCommitUntil = null;
    }

    /**
    * Initializes level boundary state.
    */
    initLevelBounds() {
        this.level_end_x = null;
    }

    /**
    * Initializes task-related state.
    */
    initTasks() {
        this.tasks = [
            "1. Kümmere dich um Juanito",
            "2. Kümmere dich um Pollito"
        ];
        this.taskWindow = new TaskWindow(this.canvas, this.tasks);
        this.tKeyPressed = false;
    }

    /**
    * Starts the game.
    */
    startGame() {
        this.levelManager.initLevels();
        this.draw();
    }

    /**
    * Starts the next level.
    */
    startNextLevel() {
        this.currentScene = 'townLevel';
    }

    /**
    * Applies deferred asset updates.
    * @param {Object} charDeferred Deferred character image assets.
    * @param {Object} entityDeferred Deferred entity image assets.
    */
    applyDeferredAssets(charDeferred, entityDeferred) {
        if (!charDeferred && !entityDeferred) return;
        Object.assign(this.characterImages, charDeferred);
        smartMerge(this.entityImages, entityDeferred);
        this.character?.initMovementImages();
        this.character?.initEmotionImages();
        this.character?.initActionImages();
        this.character?.initSpecialImages();
    }

    /**
    * Applies lazy-loaded asset updates.
    * @param {Object} charLazy Lazy character image assets.
    * @param {Object} entityLazy Lazy entity image assets.
    */
    applyLazyAssets(charLazy, entityLazy) {
        if (!charLazy && !entityLazy) return;
        Object.assign(this.characterImages, charLazy);
        smartMerge(this.entityImages, entityLazy);
        this.character?.initMovementImages();
        this.character?.initEmotionImages();
        this.character?.initActionImages();
        this.character?.initSpecialImages();
        if (typeof this.levelManager.initRemainingSetups === 'function') {
            this.levelManager.initRemainingSetups();
        }
    }

    /**
    * Pauses the game.
    */
    pauseGame() {
        this.paused = true;
        this.isKeysStopp = true;
    }

    /**
    * Resumes the game.
    */
    resumeGame() {
        this.paused = false;
        this.isKeysStopp = false;
        const now = performance.now();
        this.lastTime = now;
        if (this.character) this.character.lastUpdateTime = now;
    }

    /**
    * Renders a frame.
    * @param {number} timestamp Frame timestamp.
    */
    draw(timestamp) {
        this.timestamp = timestamp;
        if (!this.handleRunningState(timestamp)) return;
        const deltaTime = this.updateDeltaTime(timestamp);
        const introActive = this.handleIntroPhase(deltaTime);
        if (!introActive) {
            this.updateCurrentScene(timestamp);
        }
        this.updateUI(timestamp);
        this.scheduleNextFrame();
    }

    /**
    * Handles running and paused state before rendering.
    * @param {number} timestamp Frame timestamp.
    * @returns {boolean} True if rendering should continue, otherwise false.
    */
    handleRunningState(timestamp) {
        if (!this.isRunning) {
            this._drawing = false;
            return false;
        }
        if (this.paused) {
            if (typeof timestamp === 'number') {
                this.lastTime = timestamp;
            }
            this.frameId = requestAnimationFrame(ts => this.draw(ts));
            return false;
        }
        return true;
    }

    /**
    * Updates and returns the delta time since the last frame.
    * @param {number} timestamp Frame timestamp.
    * @returns {number} Delta time in milliseconds.
    */
    updateDeltaTime(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        return deltaTime;
    }

    /**
    * Handles the intro phase rendering and updates.
    * @param {number} deltaTime Delta time in milliseconds.
    * @returns {boolean} True if intro is active, otherwise false.
    */
    handleIntroPhase(deltaTime) {
        if (this.intro?.done) return false;
        this.intro.update(deltaTime);
        this.intro.draw();
        if (!this.isChapterSoundPlayed) {
            this.chapterSound?.play();
            this.isChapterSoundPlayed = true;
        }
        return true;
    }

    /**
    * Updates the current scene.
    * @param {number} timestamp Frame timestamp.
    */
    updateCurrentScene(timestamp) {
        const controller = this.getCurrentController();
        controller?.update(timestamp);
    }

    /**
    * Returns the controller for the current scene.
    * @returns {*|null} Scene controller or null if not found.
    */
    getCurrentController() {
        const map = {
            farmLevel: this.farmLevelController,
            stableLevel: this.stableLevelController,
            townLevel: this.townLevelController,
            nayelisHouseLevel: this.nayelisHouseLevelController,
            newWeaponLevel: this.newWeaponLevelController,
            levelComplete: this.levelCompleteController
        };
        return map[this.currentScene] ?? null;
    }

    /**
    * Updates and renders UI elements.
    * @param {number} timestamp Frame timestamp.
    */
    updateUI(timestamp) {
        this.taskWindow.update(timestamp);
        this.taskWindow.draw(this.ctx);
    }

    /**
    * Schedules the next animation frame.
    */
    scheduleNextFrame() {
        this.frameId = requestAnimationFrame(ts => this.draw(ts));
    }

    /**
    * Assigns the world reference to the character.
    */
    setWorld() {
        this.character.world = this;
    }

    /**
    * Returns the current setup instance.
    * @returns {*} Current setup.
    */
    getCurrentSetup() {
        return this.getSetupByScene(this.currentScene);
    }

    /**
    * Returns the setup instance for the given scene.
    * @param {string} scene Scene identifier.
    * @returns {*|null} Setup instance or null if not found.
    */
    getSetupByScene(scene) {
        const map = {
            farmLevel: this.farmLevelSetup,
            stableLevel: this.stableLevelSetup,
            townLevel: this.townLevelSetup,
            nayelisHouseLevel: this.nayelisHouseLevelSetup,
            newWeaponLevel: this.newWeaponLevelSetup,
            levelComplete: this.levelCompleteSetup
        };
        return map[scene] ?? null;
    }

    /**
    * Restarts the specified level.
    * @param {string} levelName Level identifier.
    */
    restartLevel(levelName) {
        this.levelManager.restartLevel(levelName);
    }

    /**
    * Fades out the level complete music.
    */
    fadeOutLevelCompleteMusic() {
        this.levelManager.fadeOutLevelCompleteMusic();
    }

    /**
    * Starts the main loop.
    */
    startLoop() {
        this.levelManager.startLoop();
    }

    /**
    * Stops the main loop.
    */
    stop() {
        this.levelManager.stop();
    }

    /**
    * Destroys the world instance.
    */
    destroy() {
        this.cleanup.destroy();
    }

    /**
    * Pauses and stops the main loop.
    */
    pauseAndStopLoop() {
        this.cleanup.pauseAndStopLoop();
    }

    /**
    * Clears the canvas.
    */
    clearCanvas() {
        this.cleanup.clearCanvas();
    }

    /**
    * Stops all active sounds.
    */
    stopAllSounds() {
        this.cleanup.stopAllSounds();
    }

    /**
    * Stops a sound.
    * @param {HTMLMediaElement} sound Audio element to stop.
    */
    stopSound(sound) {
        this.cleanup.stopSound(sound);
    }

    /**
    * Moves the camera towards a target position.
    * @param {number} targetX Target x-coordinate.
    * @param {Object} [options={}] Movement options.
    * @returns {boolean} True if the movement is finished, otherwise false.
    */
    moveCameraToX(targetX, options = {}) {
        const cfg = this.prepareCameraMove(targetX, options);
        if (!cfg) return false;
        if (this.tryFinishCameraMove(cfg)) return true;
        this.advanceCamera(cfg);
        return false;
    }

    /**
    * Prepares configuration for a camera movement.
    * @param {number} targetX Target x-coordinate.
    * @param {Object} [options={}] Movement options.
    * @param {number} [options.tolerance=1] Distance threshold to consider arrival.
    * @param {number} [options.speed=6] Movement speed.
    * @param {boolean} [options.snap=true] Whether to snap to target on arrival.
    * @param {boolean} [options.clamp=true] Whether to clamp camera within bounds.
    * @param {?Function} [options.onArrive=null] Callback invoked on arrival.
    * @returns {Object|null} Movement configuration or null if invalid.
    */
    prepareCameraMove(targetX, options = {}) {
        const {
            tolerance = 1,
            speed = 6,
            snap = true,
            clamp = true,
            onArrive = null
        } = options;
        const norm = this.normalizeCameraParams(targetX, speed);
        if (!norm) return null;
        const dt = this.getCameraDeltaTime();
        return { ...norm, tolerance, snap, clamp, onArrive, dt };
    }

    /**
    * Normalizes camera movement parameters.
    * @param {number} targetX Target x-coordinate.
    * @param {number} speed Movement speed.
    * @returns {{targetX: number, speed: number}|null} Normalized parameters or null if invalid.
    */
    normalizeCameraParams(targetX, speed) {
        const tx = Number(targetX);
        const sp = Number(speed);
        if (!Number.isFinite(this.camera_x)) this.camera_x = 0;
        if (!Number.isFinite(tx) || !Number.isFinite(sp)) return null;
        return { targetX: tx, speed: sp };
    }

    /**
    * Returns the delta time used for camera movement.
    * @returns {number} Clamped delta time value.
    */
    getCameraDeltaTime() {
        let dt = Number(this.character?.deltaTime);
        if (!Number.isFinite(dt) || dt <= 0) dt = 1 / 60;
        return Math.min(dt, 0.05);
    }

    /**
    * Attempts to finish the camera movement if within tolerance.
    * @param {Object} cfg Movement configuration.
    * @returns {boolean} True if movement is finished, otherwise false.
    */
    tryFinishCameraMove(cfg) {
        const d = cfg.targetX - this.camera_x;
        if (Math.abs(d) > cfg.tolerance) return false;
        if (cfg.snap) this.camera_x = cfg.targetX;
        if (cfg.clamp) this.clampCamera();
        cfg.onArrive?.();
        return true;
    }

    /**
    * Advances the camera position towards the target.
    * @param {Object} cfg Movement configuration.
    */
    advanceCamera(cfg) {
        const d = cfg.targetX - this.camera_x;
        const step = cfg.speed * cfg.dt * 60;
        const move = Math.sign(d) * Math.min(Math.abs(d), step);
        this.camera_x += move;
        if (cfg.clamp) this.clampCamera();
    }

    /**
    * Clamps the camera position within level boundaries.
    */
    clampCamera() {
        const levelEnd = Number(this.level_end_x);
        if (!Number.isFinite(levelEnd)) return;
        const maxCameraX = levelEnd - 720;
        if (!Number.isFinite(this.camera_x)) this.camera_x = 0;
        this.camera_x = Math.max(0, Math.min(this.camera_x, maxCameraX));
    }
}