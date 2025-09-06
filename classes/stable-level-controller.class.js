class StableLevelController {
    constructor(setup, farmLevelSetup) {
        this.setup = setup;
        this.world = setup.world;
        this.farmLevelSetup = farmLevelSetup;
        this.ctx = this.world.ctx;
        this.canvas = this.world.canvas;
        this.addObject = this.world.addObject.bind(this.world);
        this.addToWorld = this.world.addToWorld.bind(this.world);
        this.charakter = this.world.charakter;
        this.checkPressKey = this.world.checkPressKey.bind(this.world);
        this.keyboard = this.world.keyboard;
        this.stepSoundCharakter = this.world.stepSoundCharakter.bind(this.world);
        this.landingSoundCharakter = this.world.landingSoundCharakter.bind(this.world);
        this.lastCowSoundTime = 0;
        this.popupTexts = [];
        this.starttime2;
    }

    update(timestamp) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateCamera();
        this.renderBackgrounds();
        this.renderStatusBar();
        this.renderNPCsAndCharacter();
        this.handleSpeechBubble();
        this.updateCharacter(timestamp);
        this.updateNPCs(timestamp);
        this.handleEvents();
        this.handlePopup();
    }

    updateCamera() {
        this.camera_x = this.setup.world.camera_x;
        this.renderCameraX = Math.round(this.camera_x);
    }

    renderBackgrounds() {
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX, 0);
        this.addObject(this.setup.stableLevel.sky);
        this.addObject(this.setup.stableLevel.grounds);
        this.addToWorld(this.setup.stableLevel.towns[0]);
        this.ctx.restore();
    }

    renderStatusBar() {
        this.addToWorld(this.setup.statusBar);
    }

    renderNPCsAndCharacter() {
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX, 0);
        if (this.charakter.isCaress) {
            this.addToWorld(this.charakter);
            this.addToWorld(this.setup.npcs.chicken);
            this.addToWorld(this.setup.npcs.chick);
        } else {
            this.addToWorld(this.setup.npcs.chicken);
            this.addToWorld(this.setup.npcs.chick);
            this.addToWorld(this.charakter);
        }
        this.ctx.restore();
    }

    handleSpeechBubble() {
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX, 0);
        if (this.charakter.x > 280 && this.charakter.x < 430) {
            if (!this.setup.speechBubbles.bubbleStable1.startTime) {
                this.setup.speechBubbles.bubbleStable1.start();
            }
            this.setup.speechBubbles.bubbleStable1.update(performance.now());
            this.setup.speechBubbles.bubbleStable1.draw(this.ctx);
            if (!this.setup.isNotificationPlay) {
                this.setup.sounds.notificationSound.currentTime = 0;
                this.setup.sounds.notificationSound.play();
                this.setup.isNotificationPlay = true;
            }
        } else {
            this.setup.isNotificationPlay = false;
            this.setup.speechBubbles.bubbleStable1.startTime = null;
        }
        if (this.charakter.isColliding(this.setup.npcs.chicken, 0, 0)) {
            this.ctx.save();
            this.ctx.translate(-this.renderCameraX, 0);
            // if (!this.setup.speechBubbles.bubbleStable2.startTime) {
            //     this.setup.speechBubbles.bubbleStable2.start();
            // }
            // this.setup.speechBubbles.bubbleStable2.update(performance.now());
            // this.setup.speechBubbles.bubbleStable2.draw(this.ctx, 0);
        }
        if (this.charakter.isColliding(this.setup.npcs.chick, 0, 0)) {
            this.ctx.save();
            this.ctx.translate(-this.renderCameraX, 0);
            // if (!this.setup.speechBubbles.bubbleStable2.startTime) {
            //     this.setup.speechBubbles.bubbleStable2.start();
            // }
            // this.setup.speechBubbles.bubbleStable2.update(performance.now());
            // this.setup.speechBubbles.bubbleStable2.draw(this.ctx, 0);
        }
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
        const npcs = ['chicken', 'chick'];
        npcs.forEach(name => {
            this.setup.npcs[name].updateState(timestamp);
            this.setup.npcs[name].updateAnimation(timestamp);
        });
    }

    handleEvents() {
        if (this.keyboard.F && this.charakter.x > 280 && this.charakter.x < 430) {
            this.world.currentScene = 'farmLevel';
            this.charakter.x = 1700;
            this.world.camera_x = this.charakter.x - 500;
            this.keyboard.F = false;
            farmLevel.level_end_x = 6409;
            this.charakter.level_start_x = 440;
        }

        if (this.charakter.isColliding(this.setup.npcs.chicken, 0, 0) && this.keyboard.F) {
            if (!this.starttime2) {
                this.starttime2 = performance.now();
            }
            const elapsed = performance.now() - this.starttime2;
            if (elapsed >= 0 && elapsed < 5000) {
                this.charakter.isCaress = true;
                this.world.isKeysStopp = true;
                this.charakter.x = 560;
                this.charakter.isFlipped = false;
                this.setup.npcs.chicken.updateState('love');
                this.setup.sounds.chickenSound.play();
            } else {
                this.charakter.isCaress = false;
                this.starttime2 = null;
                this.keyboard.F = false;
                this.world.isKeysStopp = false;
                this.setup.npcs.chicken.updateState('idle');
                if (!this.farmLevelSetup.taskWindow.tasks[0].done) {
                    this.farmLevelSetup.taskWindow.markDone(0)
                    this.farmLevelSetup.sounds.taskCompletedSound.play();
                    this.popupTexts.push(new PopupText("Aufgabe erledigt!", this.canvas.width / 2, 440));
                }
            }
        }

        if (this.charakter.isColliding(this.setup.npcs.chick, 0, 0) && this.keyboard.F) {
            if (!this.starttime2) {
                this.starttime2 = performance.now();
            }
            const elapsed = performance.now() - this.starttime2;
            if (elapsed >= 0 && elapsed < 5000) {
                this.charakter.isCaress = true;
                this.world.isKeysStopp = true;
                this.charakter.x = 720;
                this.charakter.isFlipped = false;
                this.setup.npcs.chick.updateState('love');
                this.setup.sounds.chickSound.play();
            } else {
                this.charakter.isCaress = false;
                this.starttime2 = null;
                this.keyboard.F = false;
                this.world.isKeysStopp = false;
                this.setup.npcs.chick.updateState('idle');
                if (!this.farmLevelSetup.taskWindow.tasks[1].done) {
                    this.farmLevelSetup.taskWindow.markDone(1)
                    this.farmLevelSetup.sounds.taskCompletedSound.play();
                    this.popupTexts.push(new PopupText("Aufgabe erledigt!", this.canvas.width / 2, 440));
                }
            }
        }
    }

    handlePopup() {
        const now = performance.now();
        this.popupTexts.forEach(p => p.draw(this.ctx, now));
        this.popupTexts = this.popupTexts.filter(p => p.active);
    }
}