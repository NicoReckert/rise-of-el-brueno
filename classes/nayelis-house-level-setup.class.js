class NayelisHouseLevelSetup {
    constructor(world) {
        this.world = world;
        this.npcImages = this.world.npcImages;
        this.allAudios = this.world.allAudios;
        this.nayelisHouseLevel = nayelisHouseLevel;
        this.nayelisHouseEvents = nayelisHouseEvents;
        this.isNotificationPlay = false;
        this.popupTexts = [];
        this.npcs = {
            nayeli: new NotMovableNpc(this.npcImages, 'nayeli', 180, 180, 800, 485)
        };
        this.speechBubbles = {
            // bubbleStable1: new SpeechBubble("Den Hühnerstall verlassen? {F} drücken!", this.world.character, 'info'),
            // bubbleStable2: new SpeechBubble("Yordi streicheln {F} drücken", 'canvas', 'speech')
        };
        this.sounds = {
            notificationSound: this.allAudios.notificationSound,
            nayelisMusic: this.allAudios.nayelisMusic,
            nayelisSpeakSound: this.allAudios.nayelisSpeakSound
        };

        this.video = document.createElement('video');
        this.video.src = './assets/videos/test/190522-888122666_medium.mp4';
        this.video.preload = 'auto';
        this.video.muted = true;
        this.video.loop = true;
        // document.body.appendChild(this.video);
    }
}