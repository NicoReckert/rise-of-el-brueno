class StableLevelSetup {
    constructor(world) {
        this.world = world;
        this.npcImages = this.world.npcImages;
        this.allAudios = this.world.allAudios;
        this.stableLevel = stableLevel;
        this.isNotificationPlay = false;
        this.popupTexts = [];
        this.stableEvents = stableEvents;
        this.statusBar = new LifeEnergyCharacterBar(this.npcImages);


        this.npcs = {
            chicken: new NotMovableNpc(this.npcImages, 'chicken', 150, 150, 635, 460, 0, 100, -20, 0),
            chick: new NotMovableNpc(this.npcImages, 'chick', 120, 120, 805, 515),
            memoryLight: new NotMovableNpc(this.npcImages, 'memoryLight', 200, 200, 590, 473),
        };
        this.npcs.chick.isFlipped = false;
        this.speechBubbles = {
            bubbleStable1: new SpeechBubble("Den Hühnerstall verlassen? {F} drücken!", this.world.character, 'info', this.allAudios),
            bubbleStable2: new SpeechBubble("Yordi streicheln {F} drücken", 'canvas', 'speech', this.allAudios)
        };
        this.sounds = {
            chickSound: this.allAudios.chickSound,
            chickenSound: this.allAudios.chickenSound,
            notificationSound: this.allAudios.notificationSound
        };

        this.video = document.createElement('video');
        this.video.src = './assets/videos/memory.mp4';
        this.video.preload = 'auto';
        // document.body.appendChild(this.video);
    }
}