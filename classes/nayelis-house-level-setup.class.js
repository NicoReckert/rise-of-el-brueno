class NayelisHouseLevelSetup {
    constructor(world) {
        this.world = world;
        this.npcImages = this.world.npcImages
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
            notificationSound: new Audio('./assets/audio/notification-sound.opus'),
            nayelisMusic: new Audio('./assets/audio/nayelis-music.mp3'),
            nayelisSpeakSound: new Audio('./assets/audio/nayelis-speak-sound.mp3')
        };

        this.video = document.createElement('video');
        this.video.src = './assets/videos/test/190522-888122666_medium.mp4';
        document.body.appendChild(this.video);
    }
}