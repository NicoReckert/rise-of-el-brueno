import { IntroScreen } from '../ui/intro-screen.class.js'
import { Character } from '../entities/character.class.js';
import { FarmLevelSetup } from '../../levels/farm/farm-level-setup.class.js';
import { FarmLevelController } from '../../levels/farm/farm-level-controller.class.js';
import { StableLevelSetup } from '../../levels/stable/stable-level-setup.class.js';
import { StableLevelController } from '../../levels/stable/stable-level-controller.class.js';
import { TownLevelSetup } from '../../levels/town/town-level-setup.class.js';
import { TownLevelController } from '../../levels/town/town-level-controller.class.js';
import { NayelisHouseLevelSetup } from '../../levels/nayelis-house/nayelis-house-level-setup.class.js';
import { NayelisHouseLevelController } from '../../levels/nayelis-house/nayelis-house-level-controller.class.js';
import { NewWeaponLevelSetup } from '../../levels/new-weapon/new-weapon-level-setup.class.js';
import { NewWeaponLevelController } from '../../levels/new-weapon/new-weapon-level-controller.class.js';
import { LevelCompleteSetup } from '../../levels/level-complete/level-complete-setup.class.js';
import { LevelCompleteController } from '../../levels/level-complete/level-complete-controller.class.js';
import { TaskWindow } from '../ui/task-window.class.js';
import { AudioManager } from '../../core/audio-manager.class.js';
import { smartMerge } from '../../utils/asset-merge.util.js';
import { WorldRenderer } from './world-renderer.class.js';

export class World {

    ctx;
    canvas;
    currentScene = 'townLevel';

    constructor(canvas, keyboard, characterImages, entityImages, audioManager, videoManager, inputManager) {


        this.audioManager = new AudioManager();
        this.fadeOutAudio = this.audioManager.fadeOutAudio.bind(this.audioManager);

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.renderer = new WorldRenderer(this.ctx);
        this.keyboard = keyboard;
        this.characterImages = characterImages;
        this.entityImages = entityImages;
        this.audioManager = audioManager;
        this.videoManager = videoManager;
        this.inputManager = inputManager;
        this.allAudios = this.audioManager.audios;
        this.allVideos = this.videoManager.videos;




        this.lastThrowCheck = 0;
        this.throwCheckDelay = 120;

        this.lastStepCheck = 0;
        this.stepCheckDelay = 400;
        this.character = new Character(this.characterImages);
        this.footStepSound = this.allAudios.footStepSound;
        this.jumpSound = this.allAudios.jumpSound;
        this.landingSound = this.allAudios.landingSound;
        this.camera_x = 0;

        this.lastTime = performance.now();
        this.intro = new IntroScreen(this.ctx, this.canvas);
        this.chapterSound = this.allAudios.chapterSound;
        this.isChapterSoundPlayed = false;
        this.isKeysStopp = false;

        this.volumeLevel = 0.6;
        this.minVolumeLevel = 0;
        this.volumeLevel2 = 0;
        this.minVolumeLevel2 = 0.1;
        this.volumeLevel3 = 0.1;
        this.minVolumeLevel3 = 1;
        this.isPlay = false;
        this.paused = false;
        this.isRunning = true;
        this.frameId = null;

        this.attackStartTime = null;
        this.attackCommitUntil = null;

        this.tasks = [
            "1. Kümmere dich um Juanito",
            "2. Kümmere dich um Pollito"
        ];
        this.taskWindow = new TaskWindow(this.canvas, this.tasks);
        this.tKeyPressed = false;

        this.level_end_x = null;
    }

    startGame() {
        this.initLevels();
        this.draw();
    }

    startNextLevel() {
        this.currentScene = 'townLevel';
    }

    initLevels() {
        this.farmLevelSetup = new FarmLevelSetup(this);
        this.farmLevelController = new FarmLevelController(this.farmLevelSetup);
        this.stableLevelSetup = new StableLevelSetup(this);
        this.stableLevelController = new StableLevelController(this.stableLevelSetup);
        this.setWorld();
    }

    applyDeferredAssets(charDeferred, entityDeferred) {
        if (!charDeferred && !entityDeferred) return;

        Object.assign(this.characterImages, charDeferred);
        smartMerge(this.entityImages, entityDeferred);

        this.character?.initMovementImages();
        this.character?.initEmotionImages();
        this.character?.initActionImages();
        this.character?.initSpecialImages();
    }

    applyLazyAssets(charLazy, entityLazy) {
        if (!charLazy && !entityLazy) return;

        Object.assign(this.characterImages, charLazy);
        smartMerge(this.entityImages, entityLazy);

        this.character?.initMovementImages();
        this.character?.initEmotionImages();
        this.character?.initActionImages();
        this.character?.initSpecialImages();

        if (typeof this.initRemainingSetups === 'function') {
            this.initRemainingSetups();
        }
    }

    pauseGame() {
        this.paused = true;
        this.isKeysStopp = true;
    }

    resumeGame() {
        this.paused = false;
        this.isKeysStopp = false;
        const now = performance.now();
        this.lastTime = now;
        if (this.character) this.character.lastUpdateTime = now;
    }

    draw(timestamp) {
        this.timestamp = timestamp;

        if (!this.isRunning) {
            this._drawing = false;
            return;
        }
        if (this.paused) {
            if (typeof timestamp === 'number') {
                this.lastTime = timestamp;
            }
            this.frameId = requestAnimationFrame((timestamp) => this.draw(timestamp));
            return;
        }
        // const deltaTime = timestamp - this.lastTime;
        // this.lastTime = timestamp;
        // if (!this.intro.done) {
        //     this.intro.update(deltaTime);
        //     this.intro.draw();
        //     if (!this.isChapterSoundPlayed) {
        //         this.chapterSound.play();
        //         this.isChapterSoundPlayed = true;
        //     }
        switch (this.currentScene) {

            case 'farmLevel':
                this.farmLevelController.update(timestamp);
                break;
            case 'stableLevel':
                this.stableLevelController.update(timestamp);
                break;
            case 'townLevel':
                const deltaTime = timestamp - this.lastTime;
                this.lastTime = timestamp;
                if (!this.intro.done) {
                    this.intro.update(deltaTime);
                    this.intro.draw();
                    if (!this.isChapterSoundPlayed) {
                        this.chapterSound.play();
                        this.isChapterSoundPlayed = true;
                    }
                } else this.townLevelController.update(timestamp);
                break;
            case 'nayelisHouseLevel':
                this.nayelisHouseLevelController.update(timestamp);
                break;
            case 'newWeaponLevel':
                this.newWeaponLevelController.update(timestamp);
                break;
            case 'levelComplete':
                this.levelCompleteController.update(timestamp);
                break;
            // }
        }

        this.taskWindow.update(timestamp);
        this.taskWindow.draw(this.ctx);

        this.frameId = requestAnimationFrame((timestamp) => {
            this.draw(timestamp);
        });
    }

    setWorld() {
        this.character.world = this;
    }

    getCurrentSetup() {
        switch (this.currentScene) {
            case 'farmLevel':
                return this.farmLevelSetup;
            case 'stableLevel':
                return this.stableLevelSetup;
            case 'townLevel':
                return this.townLevelSetup;
            case 'nayelisHouseLevel':
                return this.nayelisHouseLevelSetup;
            case 'newWeaponLevel':
                return this.newWeaponLevelSetup;
            case 'levelComplete':
                return this.levelCompleteSetup;
            default:
                return null;
        }
    }

    initRemainingSetups() {
        this.townLevelSetup = new TownLevelSetup(this);
        this.townLevelController = new TownLevelController(this.townLevelSetup);
        this.nayelisHouseLevelSetup = new NayelisHouseLevelSetup(this);
        this.nayelisHouseLevelController = new NayelisHouseLevelController(this.nayelisHouseLevelSetup);
        this.newWeaponLevelSetup = new NewWeaponLevelSetup(this);
        this.newWeaponLevelController = new NewWeaponLevelController(this.newWeaponLevelSetup);
        this.levelCompleteSetup = new LevelCompleteSetup(this);
        this.levelCompleteController = new LevelCompleteController(this.levelCompleteSetup);
    }

    playCoinSound() {
        const baseSound = this.allAudios.coinSound;
        const sound = baseSound.cloneNode();
        sound.volume = 0.4;
        sound.play();
    }

    playBottleSound() {
        const baseSound = this.allAudios.bottleClinkSound;
        const sound = baseSound.cloneNode();
        sound.volume = 0.6;
        sound.play();
    }

    playChickenDeathSound() {
        const sound = this.allAudios.chickenDeathSound;
        sound.volume = 0.6;
        sound.play();
    }

    playEmptyBottelsSound() {
        const sound = this.allAudios.bottleEmptySound;
        sound.volume = 0.6;
        sound.play();
    }

    playBottelBrokenSound() {
        const sound = this.allAudios.bottleBrokenSound;
        sound.volume = 0.6;
        sound.play();
    }

    playBottelThrowSound() {
        const sound = this.allAudios.bottleThrowSound;
        sound.volume = 0.6;
        sound.play();
    }

    playEndbossMusic(state) {
        switch (state) {
            case "play":
                this.townLevelSetup.endbossMusic.play();
                break;

            case "stop":
                this.townLevelSetup.endbossMusic.pause();
                this.townLevelSetup.endbossMusic.currentTime = 0;
                break;
        }
    }

    playEndbossAlarmSound() {
        this.endbossAlarmSound = this.allAudios.endbossAlarmSound;
        this.endbossAlarmSound.play();
    }

    stepSoundCharacter(timestamp) {
        if (timestamp - this.lastStepCheck < this.stepCheckDelay) return;
        this.lastStepCheck = timestamp;
        if ((this.character.isMovingLeft || this.character.isMovingRight) && !this.character.isJumping && !this.character.isFlying) {
            this.footStepSound.currentTime = 0;
            this.footStepSound.play();
        }
    }

    landingSoundCharacter() {
        if (this.character.isLanding) {
            this.landingSound.currentTime = 0;
            this.landingSound.play();
            this.character.isLanding = false;
        }
    }

    restartLevel(levelName) {
        this.stop();
        this.fadeOutLevelCompleteMusic();
        this.cleanupCharacter();
        this.resetGlobalState();
        this.createNewCharacter();
        this.initLevelForRestart(levelName);
        this.currentScene = levelName;
        this.hideLevelCompleteUI();
        this.startLoop();
    }

    fadeOutLevelCompleteMusic() {
        const music = this.levelCompleteSetup?.sounds?.levelCompleteMusic;
        if (music) this.fadeOutAudio(music);
    }

    cleanupCharacter() {
        if (!this.character) return;
        if (this.character.intervalJump) {
            clearInterval(this.character.intervalJump);
            this.character.intervalJump = null;
        }
        this.character = null;
    }

    resetGlobalState() {
        this.paused = false;
        this.isRunning = true;
        this.isKeysStopp = false;
        this.camera_x = 0;
        this.lastTime = performance.now();
    }

    createNewCharacter() {
        this.character = new Character(this.characterImages);
        this.setWorld();
    }

    initLevelForRestart(levelName) {
        const map = {
            farmLevel: () => this.initFarmLevelRestart(),
            stableLevel: () => this.initStableLevelRestart(),
            townLevel: () => this.initTownLevelRestart(),
            nayelisHouseLevel: () => this.initNayelisHouseLevelRestart(),
            newWeaponLevel: () => this.initNewWeaponLevelRestart(),
            levelComplete: () => this.initLevelCompleteRestart(),
        };
        const initFn = map[levelName];
        if (initFn) initFn();
    }

    initFarmLevelRestart() {
        this.farmLevelSetup = new FarmLevelSetup(this);
        this.farmLevelController =
            new FarmLevelController(this.farmLevelSetup);
    }

    initStableLevelRestart() {
        this.stableLevelSetup = new StableLevelSetup(this);
        this.stableLevelController =
            new StableLevelController(this.stableLevelSetup);
    }

    initTownLevelRestart() {
        this.townLevelSetup = new TownLevelSetup(this);
        this.townLevelController =
            new TownLevelController(this.townLevelSetup);
    }

    initNayelisHouseLevelRestart() {
        this.nayelisHouseLevelSetup =
            new NayelisHouseLevelSetup(this);
        this.nayelisHouseLevelController =
            new NayelisHouseLevelController(this.nayelisHouseLevelSetup);
    }

    initNewWeaponLevelRestart() {
        this.newWeaponLevelSetup = new NewWeaponLevelSetup(this);
        this.newWeaponLevelController =
            new NewWeaponLevelController(this.newWeaponLevelSetup);
    }

    initLevelCompleteRestart() {
        this.levelCompleteSetup = new LevelCompleteSetup(this);
        this.levelCompleteController =
            new LevelCompleteController(this.levelCompleteSetup);
    }

    hideLevelCompleteUI() {
        const box = document.getElementById('level-complete-button-box');
        if (box) box.classList.add('d-none');
    }

    startLoop() {
        this.frameId = requestAnimationFrame(ts => this.draw(ts));
    }

    stop() {
        this.isRunning = false;
        if (this.frameId) {
            cancelAnimationFrame(this.frameId);
            this.frameId = null;
        }
    }

    destroy() {
        this.pauseAndStopLoop();
        this.clearCanvas();
        this.stopAllSounds();
        this.removeAllVideos();
        this.cleanupControllers();
        this.cleanupSetups();
        this.cleanupWorldRefs();
    }

    pauseAndStopLoop() {
        this.paused = true;
        if (this.frameId) {
            cancelAnimationFrame(this.frameId);
            this.frameId = null;
        }
    }

    clearCanvas() {
        if (!this.ctx || !this.canvas) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    stopAllSounds() {
        if (!this.audioManager || !this.audioManager.audios) return;
        Object.values(this.audioManager.audios)
            .forEach(sound => this.stopSound(sound));
    }

    stopSound(sound) {
        if (!sound || sound.paused) return;
        try {
            sound.pause();
            sound.currentTime = 0;
        } catch (e) { }
    }

    moveCameraToX(targetX, {
        tolerance = 1,
        speed = 6,
        snap = true,
        clamp = true,
        onArrive = null
    } = {}) {
        targetX = Number(targetX);
        speed = Number(speed);
        if (!Number.isFinite(this.camera_x)) this.camera_x = 0;
        if (!Number.isFinite(targetX) || !Number.isFinite(speed)) {
            return false;
        }
        let dt = Number(this.character?.deltaTime);
        if (!Number.isFinite(dt) || dt <= 0) dt = 1 / 60;
        dt = Math.min(dt, 0.05);
        const d = targetX - this.camera_x;
        if (Math.abs(d) <= tolerance) {
            if (snap) this.camera_x = targetX;
            if (clamp) this.clampCamera();
            onArrive?.();
            return true;
        }
        const step = speed * dt * 60;
        const move = Math.sign(d) * Math.min(Math.abs(d), step);
        this.camera_x += move;
        if (clamp) this.clampCamera();
        return false;
    }

    clampCamera() {
        const levelEnd = Number(this.level_end_x);
        if (!Number.isFinite(levelEnd)) return;
        const maxCameraX = levelEnd - 720;
        if (!Number.isFinite(this.camera_x)) this.camera_x = 0;
        this.camera_x = Math.max(0, Math.min(this.camera_x, maxCameraX));
    }
}