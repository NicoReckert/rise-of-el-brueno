class TownLevelSetup {
    constructor(world) {
        this.world = world;
        this.townLevel = townLevel;
        this.npcImages = this.world.npcImages;
        this.allAudios = this.world.allAudios;
        this.townEvents = townEvents;
        this.world.camera_x = 0;
        this.statusBar = new LifeEnergyCharacterBar(this.npcImages);
        this.statusBar2 = new LifeEnergyBossBar(this.npcImages);
        this.coinBar = new CoinBar(this.npcImages);
        this.bottleBar = new BottleBar(this.npcImages);
        this.throwableObjects = [];
        const endboss = new Endboss(this.npcImages);
        const soul = new NotMovableNpc(
            this.npcImages,
            'soul',
            200,
            200,
            endboss.x + (endboss.width / 2),
            endboss.y + 100
        );

        this.npcs = { endboss, soul };
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

        this.endbossMusic;
        this.endbossAlarmSound;
        this.endbossMusicIsPlayed = false;
        this.endbossAlarmSoundIsPlayed = false;
        this.endbossAttack = new EndbossAttack(this.npcImages);
        this.backgroundMusic = document.getElementById('background-music');
        this.backgroundMusic.volume = 0.6;
        this.jetPackMusic = document.getElementById('jet-pack-music');
        this.jetPackSound = document.getElementById('jet-pack-sound');
        this.bubble = new SpeechBubble("Ich bin Brünö ein Hühnerexperte, Compadre Amigo!", this.world.character, performance.now());
        this.bubble2 = new SpeechBubble("Ich bin Aria und wir haben große Probleme mit motierten Hühnern", this.npc2, performance.now());
        this.video = document.getElementById('portal-video');
    }
}