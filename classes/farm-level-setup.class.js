class FarmLevelSetup {
    constructor(world) {
        this.world = world;
        this.farmLevel = farmLevel;
        this.npcs = {
            cow: new NotMovableNpc('cow', 200, 200, 1200, 255),
            bird: new NotMovableNpc('bird', 80, 80, 1180, 73),
            pond: new NotMovableNpc('pond', 500, 600, -28, 80),//500, 600, 150, 120
            tree: new NotMovableNpc('tree', 450, 450, 500, 10),
            drohne: new NotMovableNpc('drohne', 300, 300, 1500, -50)
        };
        this.npcs.pond.isFlipped = false;
        this.world.camera_x = 800;
        this.statusBar = new LifeEnergyCharakterBar();
        this.sounds = {
            farmMusic: new Audio('./assets/audio/farm-music.mp3'),
            notificationSound: new Audio('./assets/audio/notification-sound.mp3'),
            nightMusic: new Audio('./assets/audio/night-music.mp3'),
            drohneSound: new Audio('./assets/audio/drohne-sound.mp3'),
            drohneHypnoSound: new Audio('./assets/audio/drohne-sound2.mp3'),
            eveningSound: new Audio('./assets/audio/evening-sound.mp3'),
            yawningSound: new Audio('./assets/audio/yawning-sound.mp3'),
            snoringSound: new Audio('./assets/audio/snoring-sound.mp3')
        };
        this.speechBubbles = {
            bubbleFarm: new SpeechBubble("In den Hühnerstall gehen? {F} drücken!", this.world.charakter, performance.now()),
            bubbleFarm2: new SpeechBubble("Ins Haus gehen? {F} drücken!", this.world.charakter, performance.now())
        };
        this.sounds.farmMusic.play();
        this.sounds.farmMusic.loop = true;
        this.sounds.farmMusic.volume = 0.6;
        this.sounds.notificationSound.volume = 0.5;
        this.isNotificationPlay = false;
        this.isGameCharakterInHouse = false;
        // this.shakeIntensity = 2;
        this.darknessLevel = 0;
        this.maxDarkness = 0.9;
        this.timeGoInHouse;
        this.timeElapsed;
        this.volumeLevel = 0.6;
        this.minVolumeLevel = 0;
        this.isYawning = false;
        this.isSnore = false;
    }
}