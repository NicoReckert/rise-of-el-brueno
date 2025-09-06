class StableLevelSetup {
    constructor(world) {
        this.world = world;
        this.stableLevel = stableLevel;
        this.isNotificationPlay = false;
        this.popupTexts = [];

        this.npcs = {
            chicken: new NotMovableNpc('chicken', 150, 150, 635, 460, 0, 100, -20, 0),
            chick: new NotMovableNpc('chick', 120, 120, 805, 515)
        };
        this.npcs.chick.isFlipped = false;
        this.speechBubbles = {
            bubbleStable1: new SpeechBubble("Den Hühnerstall verlassen? {F} drücken!", this.world.charakter, 'info'),
            bubbleStable2: new SpeechBubble("Yordi streicheln {F} drücken", 'canvas', 'speech')
        };
        this.sounds = {
            chickSound: new Audio('./assets/audio/chick-sound2.mp3'),
            chickenSound: new Audio('./assets/audio/chicken-sound.mp3'),
            notificationSound: new Audio('./assets/audio/notification-sound.mp3'),
        };
    }
}