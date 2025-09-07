class TownLevelSetup {
        constructor(world) {
        this.world = world;
        this.townLevel = townLevel;
        this.npcs = {
            // cow: new NotMovableNpc('cow', 200, 200, 1200, 485), //255 Y
        };
        this.world.camera_x = 800;
        this.statusBar = new LifeEnergyCharakterBar();
        this.sounds = {
            notificationSound: new Audio('./assets/audio/notification-sound.mp3'),
            taskCompletedSound: new Audio('./assets/audio/task-completed-sound2.mp3'),
        };
        this.speechBubbles = {
            // bubbleFarm: new SpeechBubble("In den Hühnerstall gehen? {F} drücken!", this.world.charakter, 'info'),
        };
        this.sounds.notificationSound.volume = 0.5;
        this.isNotificationPlay = false;
        this.tasks = [
            // "1. Kümmere dich um Yordi",
            // "2. Kümmere dich um Yarris",
            // "3. Kümmere dich um Lola"
        ];
        this.taskWindow = new TaskWindow(this.world.canvas, this.tasks);
        this.tKeyPressed = false;
    }
}