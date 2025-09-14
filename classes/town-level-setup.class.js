class TownLevelSetup {
    constructor(world) {
        this.world = world;
        this.townLevel = townLevel;
        this.world.camera_x = 0;
        this.statusBar = new LifeEnergyCharacterBar();
        this.statusBar2 = new LifeEnergyBossBar();
        this.coinBar = new CoinBar();
        this.bottleBar = new BottleBar();
        this.throwableObjects = [];
        this.world.character.x = 100;
        this.world.character.level_start_x = 0;
        this.chickenBasket = new ChickenBasket(this.world.character.x + 38, this.world.character.y + 228);
        this.chickenInBasket = new ChickenInBasket(this.chickenBasket.x, this.chickenBasket.y - 20);
        this.npc1 = new Npc(1750, 130, 130, 300);
        this.npc2 = new Npc(2500, 170, 180, 250);
        this.sounds = {
            notificationSound: new Audio('./assets/audio/notification-sound.mp3'),
            taskCompletedSound: new Audio('./assets/audio/task-completed-sound2.mp3'),
        };
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

        this.endbossMusic;
        this.endbossAlarmSound;
        this.endbossMusicIsPlayed = false;
        this.endbossAlarmSoundIsPlayed = false;
        this.endbossAttack = new EndbossAttack();
        this.backgroundMusic = document.getElementById('background-music');
        this.jetPackMusic = document.getElementById('jet-pack-music');
        this.jetPackSound = document.getElementById('jet-pack-sound');
        this.bubble = new SpeechBubble("Ich bin Brünö ein Hühnerexperte, Compadre Amigo!", this.world.character, performance.now());
        this.bubble2 = new SpeechBubble("Ich bin Aria und wir haben große Probleme mit motierten Hühnern", this.npc2, performance.now());
        this.video = document.getElementById('portal-video');
    }
}