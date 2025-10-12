class NewWeaponLevelSetup {
    constructor(world) {
        this.world = world;
        this.npcImages = this.world.npcImages;
        this.allAudios = this.world.allAudios;
        this.npcs = {
            macuahuitl: new NotMovableNpc(this.npcImages, 'macuahuitl', 300, 300, 700, 300) //412 x 412, 650, 250
        };
        this.sounds = {
            newWeaponMusic: this.allAudios.newWeaponMusic,
            newWeaponSpeakSound: this.allAudios.newWeaponSpeakSound
        };
        this.sounds.newWeaponMusic.volume = 0.8;
        this.npcs.macuahuitl.isFlipped = false;
        this.video = document.createElement('video');
        this.video.src = './assets/videos/test2/304-135918292_medium.mp4';
        this.video.preload = 'auto';
        this.video.muted = true;
        this.video.loop = true;
        // document.body.appendChild(this.video);
    }
}