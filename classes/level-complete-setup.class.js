class LevelCompleteSetup {
    constructor(world) {
        this.world = world;
        this.npcImages = this.world.npcImages;
        this.levelCompleteEvents = levelCompleteEvents;
        this.npcs = {
            levelComplete: new NotMovableNpc(this.npcImages, 'levelComplete', 512, 512, 410, 180)
        };
        this.sounds = {
            levelCompleteMusic: new Audio('./assets/audio/level-complete-music.mp3'),
            levelCompleteSound: new Audio('./assets/audio/level-complete-sound.mp3'),
        };
        this.video = document.createElement('video');
        this.video.src = './assets/videos/level-complete-background.mp4';
        this.video.loop = true;
        document.body.appendChild(this.video);
    }
}