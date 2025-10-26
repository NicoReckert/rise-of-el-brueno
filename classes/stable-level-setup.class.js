class StableLevelSetup {
    constructor(world) {
        this.world = world;
        this.entityImages = this.world.entityImages;
        this.allAudios = this.world.allAudios;
        this.stableLevel = stableLevel;
        this.isNotificationPlay = false;
        this.popupTexts = [];
        this.stableEvents = stableEvents;
        this.statusBar = new LifeEnergyCharacterBar(this.entityImages);


        this.characters = {
            chicken: new AnimatedEntity(this.entityImages, 'chicken', 150, 150, 635, 460, 0, 100, -20, 0),
            chick: new AnimatedEntity(this.entityImages, 'chick', 120, 120, 805, 515)
        };

        this.environment = {
            memoryLight: new AnimatedEntity(this.entityImages, 'memoryLight', 200, 200, 590, 473)
        };
        this.characters.chick.isFlipped = false;
        this.speechBubbles = {
            bubbleStable1: new SpeechBubble("Den Hühnerstall verlassen? {F} drücken!", this.world.character, 'info', this.allAudios),
            bubbleStable2: new SpeechBubble("Yordi streicheln {F} drücken", 'canvas', 'speech', this.allAudios)
        };
        this.sounds = {
            chickSound: this.allAudios.chickSound,
            chickenSound: this.allAudios.chickenSound,
            notificationSound: this.allAudios.notificationSound,
            hintSound: this.allAudios.hintSound7
        };

        this.video = document.createElement('video');
        this.video.src = './assets/videos/memory.mp4';
        this.video.preload = 'auto';
        // document.body.appendChild(this.video);
        this.sounds.hintSound.volume = 0.2;
        this.hints = [
            new HollowHint("Streicheln", this.characters.chicken, 100, 'rose'),
            new HollowHint("Streicheln", this.characters.chick, 100, 'rose'),
            new HollowHint("Verlassen", this.world.character, 100, 'desert'),
        ];
    }
}