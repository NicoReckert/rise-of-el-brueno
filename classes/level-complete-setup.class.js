import { AnimatedEntity } from './animated-entity.class.js';

export class LevelCompleteSetup {
    constructor(world) {
        this.world = world;
        this.entityImages = this.world.entityImages;
        this.allAudios = this.world.allAudios;
        this.levelCompleteEvents = levelCompleteEvents;
        this.characters = {
            levelCompleteCharacter: new AnimatedEntity(this.entityImages, 'levelCompleteCharacter', 512, 512, 410, 180)
        };
        this.sounds = {
            levelCompleteMusic: this.allAudios.levelCompleteMusic,
            levelCompleteSound: this.allAudios.levelCompleteSound
        };
        this.video = document.createElement('video');
        this.video.src = './assets/videos/level-complete-background.mp4';
        this.video.preload = 'auto';
        this.video.muted = true;
        this.video.loop = true;
        // document.body.appendChild(this.video);
    }
}