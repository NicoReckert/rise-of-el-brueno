class FarmLevelSetup {
    constructor(world) {
        this.world = world;
        this.farmLevel = farmLevel;
        this.entityImages = this.world.entityImages;
        this.allAudios = this.world.allAudios;
        this.farmEvents = farmEvents;
        this.characters = {
            chicken: new AnimatedEntity(this.entityImages, 'chicken', 150, 150, 1600, 540), // 500, 540
            chick: new AnimatedEntity(this.entityImages, 'chick', 120, 120, 1680, 587), // 575, 587
            cow: new AnimatedEntity(this.entityImages, 'cow', 200, 200, 500, 495), //255 Y
            bird: new AnimatedEntity(this.entityImages, 'bird', 80, 80, 1400, 178),
            drone: new AnimatedEntity(this.entityImages, 'drone', 300, 300, 5000, 190),
            portraits: {
                chicken: new AnimatedEntity(this.entityImages, 'chicken', 400, 400, 5200, 100), // 500, 540
                chick: new AnimatedEntity(this.entityImages, 'chick', 400, 400, 5200, 100), // 575, 587
                cow: new AnimatedEntity(this.entityImages, 'cow', 400, 400, 5200, 100)
            }
        };

        this.cutsceneActors = {
            chickenHypno: new AnimatedEntity(this.entityImages, 'chickenHypno', 90, 90, 200, 580),
            chickHypno: new AnimatedEntity(this.entityImages, 'chickHypno', 60, 60, 500, 600),
            cowHypno: new AnimatedEntity(this.entityImages, 'cowHypno', 200, 200, -100, 492)
        }

        this.environment = {
            pond: new AnimatedEntity(this.entityImages, 'pond', 500, 600, -28, 320),//500, 600, 150, 120
            trees: [
                new AnimatedEntity(this.entityImages, 'tree', 450, 450, 500, 250),
                new AnimatedEntity(this.entityImages, 'tree2', 450, 450, 4600, 250),
                new AnimatedEntity(this.entityImages, 'tree3', 450, 450, 5700, 255)
            ],
            flowers: [
                new AnimatedEntity(this.entityImages, 'flower', 65, 65, 5650, 600),
                new AnimatedEntity(this.entityImages, 'flower2', 65, 65, 5600, 600),
                new AnimatedEntity(this.entityImages, 'flower3', 65, 65, 5550, 600),
                new AnimatedEntity(this.entityImages, 'flower', 65, 65, 5070, 600),
                new AnimatedEntity(this.entityImages, 'flower2', 65, 65, 5120, 600),
                new AnimatedEntity(this.entityImages, 'flower3', 65, 65, 5170, 600),
                new AnimatedEntity(this.entityImages, 'flower', 65, 65, 4730, 600),
                new AnimatedEntity(this.entityImages, 'flower', 65, 65, 4800, 600)
            ],
            house: new AnimatedEntity(this.entityImages, 'house', 900, 900, 800, -30),
            stable: new AnimatedEntity(this.entityImages, 'stable', 600, 600, 1550, 177),
            clock: new AnimatedEntity(this.entityImages, 'clock', 150, 150, 5320, 400),
            campfire: new AnimatedEntity(this.entityImages, 'campfire', 200, 200, 650, 520),
            sun: new AnimatedEntity(this.entityImages, 'sun', 250, 250, 3000, 50),
            moon: new AnimatedEntity(this.entityImages, 'moon', 200, 200, 3000, 50)
        }
        this.environment.pond.isFlipped = false;
        this.cutsceneActors.cowHypno.isFlipped = true;
        this.characters.bird.updateAnimationState('idle', 1000 / 7);
        this.characters.drone.updateAnimationState('idle', 1000 / 7);
        this.world.camera_x = 800;
        this.statusBar = new LifeEnergyCharacterBar(this.entityImages);
        this.sounds = {
            farmMusic: this.allAudios.farmMusic,
            notificationSound: this.allAudios.notificationSound,
            nightMusic: this.allAudios.nightMusic,
            drohneSound: this.allAudios.drohneSound,
            drohneHypnoSound: this.allAudios.drohneHypnoSound,
            eveningSound: this.allAudios.eveningSound,
            yawningSound: this.allAudios.yawningSound,
            snoringSound: this.allAudios.snoringSound,
            earthquakeSound: this.allAudios.earthquakeSound,
            sadMusic: this.allAudios.sadMusic,
            dragonRoarSound: this.allAudios.dragonRoarSound,
            newTaskSound: this.allAudios.newTaskSound,
            taskCompletedSound: this.allAudios.taskCompletedSound,
            taskCompletedSound2: this.allAudios.taskCompletedSound.cloneNode(),
            cowSound: this.allAudios.cowSound,
            cowSound2: this.allAudios.cowSound2,
            doorOpeningSound: this.allAudios.doorOpeningSound,
            doorClosingSound: this.allAudios.doorClosingSound,
            happyTogetherMusic: this.allAudios.happyTogetherMusic,
            determinedMusic: this.allAudios.determinedMusic,
            windSound: this.allAudios.windSound,
            hintSound: this.allAudios.hintSound9,
            sadSoulMusic: this.allAudios.sadSoulMusic
        };
        this.speechBubbles = {
            bubbleFarm1: new SpeechBubble("Juanito, Pollito", this.world.character, 'speech', this.allAudios),
            bubbleFarm2: new SpeechBubble("Kommt wir machen unser Lagerfeuer", this.world.character, 'speech', this.allAudios),
            bubbleFarm3: new SpeechBubble("Was ist hier passiert ???", this.world.character, 'speech', this.allAudios),
            bubbleFarm4: new SpeechBubble("Freunde wo seit ihr ???", this.world.character, 'speech', this.allAudios),
            bubbleFarm5: new SpeechBubble("Neeeeiiiinnnnn.", this.world.character, 'speech', this.allAudios),
            bubbleFarm6: new SpeechBubble("Ich werde euch finden !!!", this.world.character, 'speech', this.allAudios),
            bubbleFarm7: new SpeechBubble("Und wenn ich die ganze Welt nach euch absuchen muss !!!", this.world.character, 'speech', this.allAudios),
            bubbleFarm8: new SpeechBubble("Haltet durch !!!", this.world.character, 'speech', this.allAudios),
            bubbleFarm9: new SpeechBubble("Pollito", this.world.character, 'speech', this.allAudios),
            bubbleFarm10: new SpeechBubble("Juanito", this.world.character, 'speech', this.allAudios),
            bubbleFarm11: new SpeechBubble("Lola", this.world.character, 'speech', this.allAudios),
        };
        this.sounds.farmMusic.loop = true;
        this.sounds.farmMusic.volume = 0.6;
        this.sounds.notificationSound.volume = 0.5;
        this.isNotificationPlay = false;
        this.isGameCharacterInHouse = false;
        this.shakeIntensity = 20;
        this.darknessLevel = 0;
        this.maxDarkness = 0.9;
        this.timeGoInHouse;
        this.timeGoOutHouse;
        this.timeAfterMakeAFire;
        this.timeElapsed;
        this.timeElapsedAfterMakeFire;
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
        this.isNight = false;
        this.isGameCharacterOutHouse = false;
        this.tasks = [
            "1. Kümmere dich um Juanito",
            "2. Kümmere dich um Pollito"
        ];
        this.taskWindow = new TaskWindow(this.world.canvas, this.tasks);
        this.tKeyPressed = false;
        this.timerManager = new TimerManager();
        this.popupTexts = [];
        this.comeFromStable = false;
        this.lyrics = [];
        this.earthquakeStart = false;
        this.doorState = 'closed';
        this.timeOnStable = null;
        this.lyricsRenderer = new LyricsRenderer(this.world, this.sounds.happyTogetherMusic);
        this.sunCycle = new SunCycle(this);
        this.moonCycle = new MoonCycle(this);
        this.hints = [
            new HollowHint("Betreten", this.world.character, 80, 'desert'),
            new HollowHint("Begleiten", this.characters.cow, 80, 'desert'),
            new HollowHint("Warten", this.characters.cow, 120, 'desert'),
            new HollowHint("Belohnen", this.characters.cow, 80, 'rose'),
            new HollowHint("Haus Betreten", this.world.character, 80, 'desert'),
            new HollowHint("Noch nicht", this.world.character, 100, 'desert')
        ];

        this.video = document.createElement('video');
        this.video.src = './assets/videos/prolog.mp4';
        this.video.preload = 'auto';
    }
}