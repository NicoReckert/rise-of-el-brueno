import { LifeEnergyCharacterBar } from '../../classes/ui/life-energy-character-bar.class.js';
import { AnimatedEntity } from '../../classes/entities/animated-entity.class.js';
import { HollowHint } from '../../classes/ui/hollow-hint.class.js';
import { stableLevel } from './stable-level.js';
import { stableEvents } from '../../events/stable-level-events.js';

export class StableLevelSetup {
    constructor(world) {
        this.world = world;
        this.entityImages = this.world.entityImages;
        this.allAudios = this.world.allAudios;
        this.allVideos = this.world.allVideos;
        this.stableLevel = stableLevel;
        this.isNotificationPlay = false;
        this.popupTexts = [];
        this.stableEvents = stableEvents;
        this.statusBar = new LifeEnergyCharacterBar(this.entityImages);


        this.characters = {
            juanito: new AnimatedEntity(this.entityImages, 'juanito', 150, 150, 635, 460, 0, 100, -20, 0),
            pollito: new AnimatedEntity(this.entityImages, 'pollito', 120, 120, 805, 515)
        };

        this.environment = {
            memoryLight: new AnimatedEntity(this.entityImages, 'memoryLight', 200, 200, 590, 473, 0, 50, 50, 0)
        };
        this.characters.pollito.isFlipped = false;
        this.sounds = {
            chickSound: this.allAudios.chickSound,
            chickenSound: this.allAudios.chickenSound,
        };

        this.video = this.allVideos.memory || null;
        this.hints = [
            new HollowHint("Streicheln", this.characters.juanito, 100, 'rose'),
            new HollowHint("Streicheln", this.characters.pollito, 100, 'rose'),
            new HollowHint("Verlassen", this.world.character, 100, 'desert'),
            new HollowHint("Erinnerung", this.environment.memoryLight, 100, 'default'),
        ];
    }
}