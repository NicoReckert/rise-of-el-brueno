class NewWeaponLevelSetup {
    constructor(world) {
        this.world = world;
        this.npcImages = this.world.npcImages
        this.world.character.x = 400;
        this.world.character.level_start_x = 290;
        this.world.farmLevelSetup.farmLevel.level_end_x = 845;
        this.world.character.isNewWeapon = true;
        this.npcs = {
            macuahuitl: new NotMovableNpc(this.npcImages, 'macuahuitl', 300, 300, 700, 300) //412 x 412, 650, 250
        };
        this.sounds = {
            newWeaponMusic: new Audio('./assets/audio/new-weapon-music.mp3'),
            newWeaponSpeakSound: new Audio('./assets/audio/new-weapon-speak-sound.mp3')
        };
        this.sounds.newWeaponMusic.play();
        this.sounds.newWeaponMusic.volume = 0.8;
        this.sounds.newWeaponSpeakSound.play();
        this.npcs.macuahuitl.isFlipped = false;
        this.video = document.createElement('video');
        this.video.src = './assets/videos/test2/304-135918292_medium.mp4';
        this.video.autoplay = true;
        this.video.loop = true;
        document.body.appendChild(this.video);
    }
}