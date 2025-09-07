class TownLevelController {
    constructor(setup) {
        this.setup = setup;
        this.world = setup.world;
        this.ctx = this.world.ctx;
        this.canvas = this.world.canvas;
        this.addObject = this.world.addObject.bind(this.world);
        this.addToWorld = this.world.addToWorld.bind(this.world);
        this.charakter = this.world.charakter;
        this.checkPressKey = this.world.checkPressKey.bind(this.world);
        this.keyboard = this.world.keyboard;
        this.stepSoundCharakter = this.world.stepSoundCharakter.bind(this.world);
        this.landingSoundCharakter = this.world.landingSoundCharakter.bind(this.world);
        this.popupTexts = [];

    }

    update(timestamp) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateCamera();
        this.renderBackgrounds();
        this.renderStatusBar();
        this.renderNPCsAndCharacter();
        this.setup.taskWindow.update();
        this.setup.taskWindow.draw(this.ctx);
        this.handleSpeechBubble();
        this.updateCharacter(timestamp);
        this.updateNPCs(timestamp);
        this.handleInteractions();
        this.handlePopup();
    }

    updateCamera() {
        this.camera_x = this.setup.world.camera_x;
        this.renderCameraX = Math.round(this.camera_x);

    }

    renderBackgrounds() {
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX, 0);
        this.addObject(this.setup.townLevel.sky);
        this.addObject(this.setup.townLevel.clouds);
        this.addObject(this.setup.townLevel.grounds);
        this.addObject(this.setup.townLevel.towns);
        this.ctx.restore();
    }

    renderStatusBar() {
        this.addToWorld(this.setup.statusBar);
    }

    renderNPCsAndCharacter() {
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX, 0);
        this.addToWorld(this.charakter);
        this.ctx.restore();
    }

    handleSpeechBubble() {
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX, 0);
        // if (this.charakter.x > 1550 && this.charakter.x < 1700) {
        //     if (!this.setup.speechBubbles.bubbleFarm.startTime) {
        //         this.setup.speechBubbles.bubbleFarm.start(); // Jetzt beginnt das Schreiben
        //     }
        //     this.setup.speechBubbles.bubbleFarm.update(performance.now());
        //     this.setup.speechBubbles.bubbleFarm.draw(this.ctx);
        //     if (!this.setup.isNotificationPlay) {
        //         this.setup.sounds.notificationSound.currentTime = 0;
        //         this.setup.sounds.notificationSound.play();
        //         this.setup.isNotificationPlay = true;
        //     }
        // } else {
        //     this.setup.isNotificationPlay = false;
        //     this.setup.speechBubbles.bubbleFarm.startTime = null;
        // }
        this.ctx.restore();
    }

    updateCharacter(timestamp) {
        this.checkPressKey();
        this.charakter.updateState(timestamp);
        this.charakter.updateAnimation(timestamp);
        if (this.charakter.isJumping) this.charakter.applyGravity(timestamp);
        this.stepSoundCharakter(timestamp);
        this.landingSoundCharakter();
    }

    updateNPCs(timestamp) {
        const npcs = [/*'cow'*/];
        npcs.forEach(name => {
            this.setup.npcs[name].updateState(timestamp);
            this.setup.npcs[name].updateAnimation(timestamp);
        });
    }

    handleInteractions() {
        // if (this.keyboard.F && this.charakter.x > 1550 && this.charakter.x < 1700) {
        //     this.camera_x = 0;
        //     this.charakter.x = 380;
        //     this.world.currentScene = 'stableLevel';
        //     this.keyboard.F = false;
        //     this.setup.farmLevel.level_end_x = 720;
        //     this.world.charakter.level_start_x = 360;
        // }
    }

    handlePopup() {
        const now = performance.now();
        this.popupTexts.forEach(p => p.draw(this.ctx, now));
        this.popupTexts = this.popupTexts.filter(p => p.active);
    }
}