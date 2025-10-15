class StableLevelController {
    constructor(setup) {
        this.setup = setup;
        this.world = setup.world;
        this.ctx = this.world.ctx;
        this.canvas = this.world.canvas;
        this.addObject = this.world.addObject.bind(this.world);
        this.addToWorld = this.world.addToWorld.bind(this.world);
        this.character = this.world.character;
        this.checkPressKey = this.world.checkPressKey.bind(this.world);
        this.keyboard = this.world.keyboard;
        this.stepSoundCharacter = this.world.stepSoundCharacter.bind(this.world);
        this.landingSoundCharacter = this.world.landingSoundCharacter.bind(this.world);
        this.lastCowSoundTime = 0;
        this.eventManager = new EventManager(this.setup);
        this.questManager = new QuestManager(this.setup, this.eventManager, this.setup.stableEvents);
        this.eventManager.questManager = this.questManager;
        this.init();
    }

    init() {
        
    }

    update(timestamp) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateCamera();
        this.renderBackgrounds();
        this.renderStatusBar();
        this.renderNPCsAndCharacter();
        // this.handleSpeechBubble();
        this.updateCharacter(timestamp);
        this.updateEntities(timestamp);
        this.handlePopup();
        this.eventManager.update();
        // this.eventManager.debug = true;
    }

    updateCamera() {
        this.camera_x = this.setup.world.camera_x;
        this.renderCameraX = Math.round(this.camera_x);
    }

    renderBackgrounds() {
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX, 0);
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
        if (this.character.isCaress) {
            this.addToWorld(this.character);
            if (this.setup.world.farmLevelController.questManager.step < 8) {
                this.addToWorld(this.setup.characters.chicken);
                this.addToWorld(this.setup.characters.chick);
            }
        } else {
            if (this.setup.world.farmLevelController.questManager.step < 8) {
                this.addToWorld(this.setup.characters.chicken);
                this.addToWorld(this.setup.characters.chick);
            }
            if (this.setup.world.farmLevelController.questManager.step >= 20) this.addToWorld(this.setup.environment.memoryLight);
            this.addToWorld(this.character);
        }
        this.ctx.restore();
    }

    handleSpeechBubble() {
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX, 0);
        if (this.character.x > 280 && this.character.x < 430) {
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
        if (this.character.isColliding(this.setup.characters.chicken, 0, 0)) {
            this.ctx.save();
            this.ctx.translate(-this.renderCameraX, 0);
            // if (!this.setup.speechBubbles.bubbleStable2.startTime) {
            //     this.setup.speechBubbles.bubbleStable2.start();
            // }
            // this.setup.speechBubbles.bubbleStable2.update(performance.now());
            // this.setup.speechBubbles.bubbleStable2.draw(this.ctx, 0);
        }
        if (this.character.isColliding(this.setup.characters.chick, 0, 0)) {
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
        this.character.updateState(timestamp);
        this.character.updateAnimation(timestamp);
        if (this.character.isJumping) this.character.applyGravity(timestamp);
        this.stepSoundCharacter(timestamp);
        this.landingSoundCharacter();
    }

    updateEntities(timestamp) {
        Object.values(this.setup.characters).forEach(element => {
            element.updateState(timestamp);
        });
        Object.values(this.setup.environment).forEach(element => {
            element.updateState(timestamp);
        });
    }


    handlePopup() {
        const now = performance.now();
        this.setup.popupTexts.forEach(p => p.draw(this.ctx, now));
        this.setup.popupTexts = this.setup.popupTexts.filter(p => p.active);
    }
}