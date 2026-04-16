import { TimerManager } from '../../classes/systems/timer-manager.class.js';
import { DialogManager } from '../../classes/ui/dialog-manager.class.js';
import { SunCycle } from '../../classes/effects/sun-cycle.class.js';
import { MoonCycle } from '../../classes/effects/moon-cycle.class.js';
import { LyricsRenderer } from '../../classes/effects/lyrics-renderer.class.js';
import { createFarmLevel } from './farm-level.js';
import { farmEvents } from '../../events/farm/level-events/farm-level-events.js';
import { createFarmCharacters } from './farm-characters.js';
import { createFarmCutsceneActors } from './farm-cutscene-actors.js';
import { createFarmEnvironment } from './farm-environment.js';
import { createFarmSounds } from './farm-sounds.js';
import { createFarmSpeechBubbles } from './farm-speech-bubbles.js';
import { createFarmHints } from './farm-hints.js';
import { createFarmState } from './farm-state.js';
import { CutsceneIndicator } from '../../classes/ui/cutscene-indicator.class.js';
import { registerFarmDialogs } from './farm-dialogs.js';

/**
 * Sets up and initializes the farm level.
 */
export class FarmLevelSetup {
    /**
     * Creates a new instance and initializes the farm state.
     * @param {Object} world The game world instance.
     */
    constructor(world) {
        this.world = world;
        this.entityImages = this.world.entityImages;
        this.levelImages = this.world.levelImages;
        this.allAudios = this.world.allAudios;
        this.allVideos = this.world.allVideos;
        this.farmLevel = createFarmLevel({ levelImages: this.levelImages });
        this.farmEvents = farmEvents;
        this.state = createFarmState();
        this.init();
        this.video = this.allVideos.prolog || null;
    }

    /**
     * Initializes entities, UI audio, and systems.
     */
    init() {
        this.initEntities();
        this.initUIAudio();
        this.initSystems();
        registerFarmDialogs(this);
    }

    /**
     * Initializes characters, cutscene actors, and environment entities.
     */
    initEntities() {
        this.characters = createFarmCharacters(this.entityImages);
        this.cutsceneActors = createFarmCutsceneActors(this.entityImages);
        this.environment = createFarmEnvironment(this.entityImages);
    }

    /**
     * Initializes UI-related audio and visual components.
     */
    initUIAudio() {
        this.sounds = createFarmSounds(this.allAudios, this.world.audioManager);
        this.speechBubbles = createFarmSpeechBubbles(this.world.character, this.world.audioManager);
        this.hints = createFarmHints(this.world.character, this.characters);
    }

    /**
     * Initializes game systems and managers.
     */
    initSystems() {
        this.timerManager = new TimerManager();
        this.dialogManager = new DialogManager(this.world, this.world.keyboard);
        this.sunCycle = new SunCycle(this);
        this.moonCycle = new MoonCycle(this);
        this.lyricsRenderer = new LyricsRenderer(this.world, this.sounds.happyTogetherMusic);
        this.cutsceneIndicator = new CutsceneIndicator(this.world);
    }

    /**
     * Refreshes the sound collection.
     * @returns {void}
     */
    refreshSounds() {
        this.sounds = createFarmSounds(this.allAudios, this.world.audioManager);
    }

    /**
     * Refreshes the farm video reference.
     * @returns {void}
     */
    refreshVideo() {
        this.allVideos = this.world.allVideos;
        this.video = this.allVideos.prolog ?? null;
    }
}