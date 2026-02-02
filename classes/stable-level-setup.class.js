import { LifeEnergyCharacterBar } from './life-energy-character-bar.class.js';
import { AnimatedEntity } from './animated-entity.class.js';
import { HollowHint } from './hollow-hint.class.js';
import { stableLevel } from '../levels/stable-level.js';
import { stableEvents } from '../events/stable-level-events.js';

export class StableLevelSetup {
    constructor(world) {
        this.world = world;
        this.entityImages = this.world.entityImages;
        this.allAudios = this.world.allAudios;
        this.stableLevel = stableLevel;
        this.isNotificationPlay = false;
        this.popupTexts = [];
        this.stableEvents = stableEvents;
        this.statusBar = new LifeEnergyCharacterBar(this.entityImages);


        this.characters = {
            chicken: new AnimatedEntity(this.entityImages, 'chicken', 150, 150, 635, 460, 0, 100, -20, 0),
            chick: new AnimatedEntity(this.entityImages, 'chick', 120, 120, 805, 515)
        };

        this.environment = {
            memoryLight: new AnimatedEntity(this.entityImages, 'memoryLight', 200, 200, 590, 473, 0, 50, 50, 0)
        };
        this.characters.chick.isFlipped = false;
        this.sounds = {
            chickSound: this.allAudios.chickSound,
            chickenSound: this.allAudios.chickenSound,
        };

        this.video = document.createElement('video');
        this.video.src = './assets/videos/memory_video.mp4';
        this.video.preload = 'auto';
        // document.body.appendChild(this.video);
        this.hints = [
            new HollowHint("Streicheln", this.characters.chicken, 100, 'rose'),
            new HollowHint("Streicheln", this.characters.chick, 100, 'rose'),
            new HollowHint("Verlassen", this.world.character, 100, 'desert'),
            new HollowHint("Erinnerung", this.environment.memoryLight, 100, 'default'),
        ];
    }
}