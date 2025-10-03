class StableLevelSetup {
    constructor(world) {
        this.world = world;
        this.npcImages = this.world.npcImages
        this.stableLevel = stableLevel;
        this.isNotificationPlay = false;
        this.popupTexts = [];
        this.stableEvents = stableEvents;
        this.statusBar = new LifeEnergyCharacterBar();


        this.npcs = {
            chicken: new NotMovableNpc(this.npcImages, 'chicken', 150, 150, 635, 460, 0, 100, -20, 0),
            chick: new NotMovableNpc(this.npcImages, 'chick', 120, 120, 805, 515),
            memoryLight: new NotMovableNpc(this.npcImages, 'memoryLight', 200, 200, 590, 473),
        };
        this.npcs.chick.isFlipped = false;
        this.speechBubbles = {
            bubbleStable1: new SpeechBubble("Den Hühnerstall verlassen? {F} drücken!", this.world.character, 'info'),
            bubbleStable2: new SpeechBubble("Yordi streicheln {F} drücken", 'canvas', 'speech')
        };
        this.sounds = {
            chickSound: new Audio('./assets/audio/chick-sound2.opus'),
            chickenSound: new Audio('./assets/audio/chicken-sound.opus'),
            notificationSound: new Audio('./assets/audio/notification-sound.opus'),
        };

        this.video = document.createElement('video');
        this.video.src = './assets/videos/memory.mp4';
        document.body.appendChild(this.video);
    }
}