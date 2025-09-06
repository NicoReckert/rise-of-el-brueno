class StableLevelSetup {
    constructor() {
        this.stableLevel = stableLevel;
        this.camera_x = 0;
        this.charakter.x = 380;
        this.bubbleStall = new SpeechBubble("Den Hühnerstall verlassen? {F} drücken!", this.charakter, 'info');
        this.chickenNpc = new NotMovableNpc('chicken', 150, 150, 635, 460, 0, 100, -20, 0);
        this.chickNpc = new NotMovableNpc('chick', 120, 120, 805, 515);
        this.chickNpc.isFlipped = false;
        this.speechBubbles = {
            bubbleStable1: new SpeechBubble("Yordi streicheln {F} drücken", 'canvas', 'speech')
        };
        this.chickSound = new Audio('./assets/audio/chick-sound2.mp3');
        this.chickenSound = new Audio('./assets/audio/chicken-sound.mp3');
        this.popupTexts = [];
    }

}