import { LifeEnergyCharacterBar } from './life-energy-character-bar.class.js';
import { TimerManager } from './timer-manager.class.js';
import { SunCycle } from './sun-cycle.class.js';
import { MoonCycle } from './moon-cycle.class.js';
import { LyricsRenderer } from './lyrics-renderer.class.js';
import { createFarmLevel } from '../levels/farm-level.js';
import { farmEvents } from '../events/farm-level-events.js';
import { createFarmCharacters } from '../levels/farm/farm-characters.js';
import { createFarmCutsceneActors } from '../levels/farm/farm-cutscene-actors.js';
import { createFarmEnvironment } from '../levels/farm/farm-environment.js';
import { createFarmSounds } from '../levels/farm/farm-sounds.js';
import { createFarmSpeechBubbles } from '../levels/farm/farm-speech-bubbles.js';
import { createFarmHints } from '../levels/farm/farm-hints.js';
import { createFarmState } from '../levels/farm/farm-state.js';

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
        this.farmLevel = createFarmLevel();
        this.entityImages = this.world.entityImages;
        this.allAudios = this.world.allAudios;
        this.allVideos = this.world.allVideos;
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
        this.sounds = createFarmSounds(this.allAudios);
        this.speechBubbles = createFarmSpeechBubbles(this.world.character, this.allAudios);
        this.hints = createFarmHints(this.world.character, this.characters);
        this.statusBar = new LifeEnergyCharacterBar(this.entityImages);
    }

    /**
     * Initializes game systems and managers.
     */
    initSystems() {
        this.timerManager = new TimerManager();
        this.sunCycle = new SunCycle(this);
        this.moonCycle = new MoonCycle(this);
        this.lyricsRenderer = new LyricsRenderer(this.world, this.sounds.happyTogetherMusic);
    }
}