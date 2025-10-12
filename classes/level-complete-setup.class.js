class LevelCompleteSetup {
    constructor(world) {
        this.world = world;
        this.npcImages = this.world.npcImages;
        this.allAudios = this.world.allAudios;
        this.levelCompleteEvents = levelCompleteEvents;
        this.npcs = {
            levelComplete: new NotMovableNpc(this.npcImages, 'levelComplete', 512, 512, 410, 180)
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