class TownLevelSetup {
    constructor(world) {
        this.world = world;
        this.townLevel = townLevel;
        this.entityImages = this.world.entityImages;
        this.allAudios = this.world.allAudios;
        this.townEvents = townEvents;
        this.world.camera_x = 0;
        this.statusBar = new LifeEnergyCharacterBar(this.entityImages);
        this.statusBar2 = new LifeEnergyBossBar(this.entityImages);
        this.coinBar = new CoinBar(this.entityImages);
        this.bottleBar = new BottleBar(this.entityImages);
        this.throwableObjects = [];
        const endboss = new Endboss(this.entityImages);
        const soul = new AnimatedEntity(
            this.entityImages,
            'soul',
            200,
            200,
            endboss.x + (endboss.width / 2),
            endboss.y + 100
        );

        this.characters = { endboss, soul };
        this.sounds = {
            notificationSound: this.allAudios.notificationSound,
            taskCompletedSound: this.allAudios.taskCompletedSound,
            soulMusic: this.allAudios.soulMusic,
            soulSpeakSound: this.allAudios.soulSpeakSound
        };
        this.sounds.soulMusic.volume = 0;
        this.speechBubbles = {
            // bubbleFarm: new SpeechBubble("In den Hühnerstall gehen? {F} drücken!", this.world.character, 'info'),
        };
        this.sounds.notificationSound.volume = 0.5;
        this.isNotificationPlay = false;
        this.tasks = [
            // "1. Kümmere dich um Juanito",
            // "2. Kümmere dich um Pollito",
            // "3. Kümmere dich um Lola"
        ];
        this.taskWindow = new TaskWindow(this.world.canvas, this.tasks);
        this.tKeyPressed = false;

        this.endbossMusic = this.allAudios.endbossMusic;
        this.endbossMusic.volume = 0.6;
        this.endbossAlarmSound;
        this.endbossMusicIsPlayed = false;
        this.endbossAlarmSoundIsPlayed = false;
        this.endbossAttack = new EndbossAttack(this.entityImages);
        this.backgroundMusic = document.getElementById('background-music');
        this.backgroundMusic.volume = 0.6;
    }
}