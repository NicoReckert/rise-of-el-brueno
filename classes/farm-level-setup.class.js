class FarmLevelSetup {
    constructor(world) {
        this.world = world;
        this.farmLevel = farmLevel;
        this.npcs = {
            cow: new NotMovableNpc('cow', 200, 200, 1200, 485), //255 Y
            bird: new NotMovableNpc('bird', 80, 80, 1180, 313),
            pond: new NotMovableNpc('pond', 500, 600, -28, 320),//500, 600, 150, 120
            tree: new NotMovableNpc('tree', 450, 450, 500, 250),
            drohne: new NotMovableNpc('drohne', 300, 300, 5000, 190),
            chicken: new NotMovableNpc('chicken', 90, 90, 200, 580),
            cowHypno: new NotMovableNpc('cowHypno', 200, 200, -100, 495),
            chickHypno: new NotMovableNpc('chickHypno', 60, 60, 500, 600),
            blackDragon: new NotMovableNpc('blackDragon', 600, 600, 1000, 132)
        };
        this.npcs.pond.isFlipped = false;
        this.npcs.cowHypno.isFlipped = true;
        this.npcs.bird.updateState('idle', 1000 / 7);
        this.npcs.drohne.updateState('idle', 1000 / 7);
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
            snoringSound: new Audio('./assets/audio/snoring-sound.mp3'),
            earthquakeSound: new Audio('./assets/audio/earthquake-sound.mp3'),
            sadMusic: new Audio('./assets/audio/sad-music.mp3'),
            dragonRoarSound: new Audio('./assets/audio/dragon-roar-sound.mp3'),
            taskCompletedSound: new Audio('./assets/audio/task-completed-sound2.mp3'),
            cowSound: new Audio('./assets/audio/cow-sound.mp3'),
            cowSound2: new Audio('./assets/audio/cow-sound3.mp3')
        };
        this.speechBubbles = {
            bubbleFarm: new SpeechBubble("In den Hühnerstall gehen? {F} drücken!", this.world.charakter, 'info'),
            bubbleFarm2: new SpeechBubble("Ins Haus gehen? {F} drücken!", this.world.charakter, performance.now()),
            bubbleFarm3: new SpeechBubble("Was ist hier passiert ???", this.world.charakter, performance.now()),
            bubbleFarm4: new SpeechBubble("Freunde wo seit ihr ???", this.world.charakter, performance.now()),
            bubbleFarm5: new SpeechBubble("Neeeeiiiinnnnn. *Weinen*", this.world.charakter, performance.now()),
            bubbleFarm6: new SpeechBubble("Ich werde euch finden !!!", this.world.charakter, performance.now()),
            bubbleFarm7: new SpeechBubble("Und wenn ich die ganze Welt nach euch absuchen muss !!!", this.world.charakter, performance.now()),
            bubbleFarm8: new SpeechBubble("Haltet durch !!!", this.world.charakter, performance.now())
        };
        this.sounds.farmMusic.loop = true;
        this.sounds.farmMusic.volume = 0.6;
        this.sounds.notificationSound.volume = 0.5;
        this.isNotificationPlay = false;
        this.isGameCharakterInHouse = false;
        this.shakeIntensity = 20;
        this.darknessLevel = 0;
        this.maxDarkness = 0.9;
        this.timeGoInHouse;
        this.timeGoOutHouse;
        this.timeElapsed;
        this.volumeLevel = 0.6;
        this.volumeLevel2 = 0.8;
        this.minVolumeLevel = 0;
        this.isYawning = false;
        this.isSnore = false;
        this.earthquakeSoundIsPlaying = false;
        this.droneSoundIsPlaying = false;
        this.droneHypnoSoundIsPlaying = false;
        this.nightMusicIsPlaying = false;
        this.droneIsGo = false;
        this.isNight = true;
        this.isGameCharakterOutHouse = false;
        this.tasks = [
            "1. Kümmere dich um Yordi",
            "2. Kümmere dich um Yarris",
            "3. Kümmere dich um Lola"
        ];
        this.taskWindow = new TaskWindow(this.world.canvas, this.tasks);
        this.tKeyPressed = false;
    }
}