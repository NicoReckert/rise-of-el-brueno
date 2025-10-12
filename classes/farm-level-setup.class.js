class FarmLevelSetup {
    constructor(world) {
        this.world = world;
        this.farmLevel = farmLevel;
        this.npcImages = this.world.npcImages;
        this.allAudios = this.world.allAudios;
        this.farmEvents = farmEvents;
        this.npcs = {
            cow: new NotMovableNpc(this.npcImages, 'cow', 200, 200, 500, 495), //255 Y
            cowPortrait: new NotMovableNpc(this.npcImages, 'cow', 400, 400, 5200, 100),
            bird: new NotMovableNpc(this.npcImages, 'bird', 80, 80, 1400, 178),
            pond: new NotMovableNpc(this.npcImages, 'pond', 500, 600, -28, 320),//500, 600, 150, 120
            tree: new NotMovableNpc(this.npcImages, 'tree', 450, 450, 500, 250),
            tree2: new NotMovableNpc(this.npcImages, 'tree2', 450, 450, 4600, 250),
            tree3: new NotMovableNpc(this.npcImages, 'tree3', 450, 450, 5700, 255),
            flower: new NotMovableNpc(this.npcImages, 'flower', 65, 65, 5650, 600),
            flower2: new NotMovableNpc(this.npcImages, 'flower2', 65, 65, 5600, 600),
            flower3: new NotMovableNpc(this.npcImages, 'flower3', 65, 65, 5550, 600),
            flower4: new NotMovableNpc(this.npcImages, 'flower', 65, 65, 5070, 600),
            flower5: new NotMovableNpc(this.npcImages, 'flower2', 65, 65, 5120, 600),
            flower6: new NotMovableNpc(this.npcImages, 'flower3', 65, 65, 5170, 600),
            flower7: new NotMovableNpc(this.npcImages, 'flower', 65, 65, 4730, 600),
            flower8: new NotMovableNpc(this.npcImages, 'flower', 65, 65, 4800, 600),
            drohne: new NotMovableNpc(this.npcImages, 'drohne', 300, 300, 5000, 190),
            chicken: new NotMovableNpc(this.npcImages, 'chicken', 90, 90, 200, 580),
            cowHypno: new NotMovableNpc(this.npcImages, 'cowHypno', 200, 200, -100, 492),
            chickHypno: new NotMovableNpc(this.npcImages, 'chickHypno', 60, 60, 500, 600),
            blackDragon: new NotMovableNpc(this.npcImages, 'blackDragon', 600, 600, 1000, 132),
            barrier: new NotMovableNpc(this.npcImages, 'barrier', 450, 120, 7050, 305),
            house: new NotMovableNpc(this.npcImages, 'house', 900, 900, 800, -30),
            stable: new NotMovableNpc(this.npcImages, 'stable', 600, 600, 1550, 177),
            clock: new NotMovableNpc(this.npcImages, 'clock', 150, 150, 5320, 400),
            campfire: new NotMovableNpc(this.npcImages, 'campfire', 200, 200, 650, 520),
            chicken2: new NotMovableNpc(this.npcImages, 'chicken', 150, 150, 1600, 540), // 500, 540
            chickenPortrait: new NotMovableNpc(this.npcImages, 'chicken', 400, 400, 5200, 100), // 500, 540
            chick: new NotMovableNpc(this.npcImages, 'chick', 120, 120, 1680, 587), // 575, 587
            chickPortrait: new NotMovableNpc(this.npcImages, 'chick', 400, 400, 5200, 100), // 575, 587
            sun: new NotMovableNpc(this.npcImages, 'sun', 250, 250, 3000, 50),
            moon: new NotMovableNpc(this.npcImages, 'moon', 200, 200, 3000, 50)
        };
        this.npcs.pond.isFlipped = false;
        this.npcs.cowHypno.isFlipped = true;
        this.npcs.bird.updateState('idle', 1000 / 7);
        this.npcs.drohne.updateState('idle', 1000 / 7);
        this.world.camera_x = 800;
        this.statusBar = new LifeEnergyCharacterBar(this.npcImages);
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
            taskCompletedSound2: this.allAudios.taskCompletedSound,
            cowSound: this.allAudios.cowSound,
            cowSound2: this.allAudios.cowSound2,
            doorOpeningSound: this.allAudios.doorOpeningSound,
            doorClosingSound: this.allAudios.doorClosingSound,
            happyTogetherMusic: this.allAudios.happyTogetherMusic,
            determinedMusic: this.allAudios.determinedMusic,
            windSound: this.allAudios.windSound
        };
        this.speechBubbles = {
            bubbleFarm: new SpeechBubble("In den Hühnerstall gehen? {F} drücken!", this.world.character, 'info', this.allAudios),
            bubbleFarm2: new SpeechBubble("Ins Haus gehen? {F} drücken!", this.world.character, 'speech', this.allAudios),
            bubbleFarm3: new SpeechBubble("Was ist hier passiert ???", this.world.character, 'speech', this.allAudios),
            bubbleFarm4: new SpeechBubble("Freunde wo seit ihr ???", this.world.character, 'speech', this.allAudios),
            bubbleFarm5: new SpeechBubble("Neeeeiiiinnnnn. *Weinen*", this.world.character, 'speech', this.allAudios),
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
    }
}