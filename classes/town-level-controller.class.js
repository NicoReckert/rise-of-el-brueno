class TownLevelController {
    constructor(setup) {
        this.setup = setup;
        this.world = setup.world;
        this.ctx = this.world.ctx;
        this.canvas = this.world.canvas;
        this.addObject = this.world.addObject.bind(this.world);
        this.addToWorld = this.world.addToWorld.bind(this.world);
        this.character = this.world.character;
        this.checkPressKey = this.world.checkPressKey.bind(this.world);
        this.checkCollisions = this.world.checkCollisions.bind(this.world);
        this.checkThrowObjects = this.world.checkThrowObjects.bind(this.world);
        this.keyboard = this.world.keyboard;
        this.stepSoundCharacter = this.world.stepSoundCharacter.bind(this.world);
        this.landingSoundCharacter = this.world.landingSoundCharacter.bind(this.world);
        this.popupTexts = [];
        this.setup.backgroundMusic.play();
        this.setup.backgroundMusic.loop = true;
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
        this.updateEndboss(timestamp);
        this.handleInteractions();
        this.handlePopup();
        this.handleChickenInBasket();
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
        this.addToWorld(this.setup.statusBar2);
        this.addToWorld(this.setup.coinBar);
        this.addToWorld(this.setup.bottleBar);

    }

    renderNPCsAndCharacter() {
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX, 0);
        this.addToWorld(this.character);
        this.addObject(this.setup.townLevel.coins);
        this.addObject(this.setup.townLevel.bottles);
        this.addToWorld(this.chickenBasket);
        this.addToWorld(this.chickenInBasket);
        this.addObject(this.setup.townLevel.enemies);
        this.addToWorld(this.endbossAttack);
        this.addObject(this.setup.throwableObjects);
        if (!this.setup.townLevel.endboss.isUnderTheGround) {
            this.addToWorld(this.setup.townLevel.endboss);
        }
        this.ctx.restore();
    }

    handleSpeechBubble() {
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX, 0);
        // if (this.character.x > 1550 && this.character.x < 1700) {
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
        this.checkCollisions();
        this.checkThrowObjects(timestamp);
        this.character.updateState(timestamp);
        this.character.updateAnimation(timestamp);
        if (this.character.isJumping) this.character.applyGravity(timestamp);
        this.stepSoundCharacter(timestamp);
        this.landingSoundCharacter();
        this.setup.throwableObjects?.forEach(bottle => {
            bottle.updateState(timestamp);
            bottle.updateAnimation(timestamp);
            bottle.applyGravity2(timestamp);
        });

    }

    updateNPCs(timestamp) {
        const npcs = [/*'cow'*/];
        npcs.forEach(name => {
            this.setup.npcs[name].updateState(timestamp);
            this.setup.npcs[name].updateAnimation(timestamp);
        });
        this.setup.townLevel.enemies.forEach(enemy => {
            enemy.updateState();
            enemy.updateAnimation(timestamp);
        });
    }

    updateEndboss(timestamp) {
        this.setup.townLevel.endboss.updateState();
        this.setup.townLevel.endboss.updateAnimation(timestamp);
        this.setup.endbossAttack.updateState();
        this.setup.endbossAttack.updateAnimation(timestamp);
        if (this.setup.townLevel.endboss.isJumping) this.setup.townLevel.endboss.applyGravityBoss(timestamp);
    }

    handleInteractions() {
        // if (this.keyboard.F && this.character.x > 1550 && this.character.x < 1700) {
        //     this.camera_x = 0;
        //     this.character.x = 380;
        //     this.world.currentScene = 'stableLevel';
        //     this.keyboard.F = false;
        //     this.setup.farmLevel.level_end_x = 720;
        //     this.world.character.level_start_x = 360;
        // }
    }

    handlePopup() {
        const now = performance.now();
        this.popupTexts.forEach(p => p.draw(this.ctx, now));
        this.popupTexts = this.popupTexts.filter(p => p.active);
    }

    handleChickenInBasket() {
        const basketWobble = Math.sin(Date.now() / 100) * 0.5;
        if (this.character.isJumping) {
            this.setup.chickenBasket.setCoordinates(this.character.x + 38, this.character.y + 220);
        } else if (this.character.isMovingLeft || this.character.isMovingRight) {
            this.setup.chickenBasket.setCoordinates(this.character.x + 38, this.character.y + 228 + basketWobble);
        } else if (this.character.isFlipped) {
            this.setup.chickenBasket.setCoordinates(this.character.x + 38 + 17.5, this.character.y + 228 + basketWobble);
        } else {
            this.setup.chickenBasket.setCoordinates(this.character.x + 38, this.character.y + 228);
        }
        if (this.setup.chickenInBasket.isIdle && !this.setup.chickenInBasket.isReturning && !this.setup.chickenInBasket.justLanded) {
            this.setup.chickenInBasket.setCoordinates(
                this.setup.chickenBasket.x,
                this.setup.chickenBasket.y - 20
            )
        };
        this.setup.chickenInBasket.chickenAttack(this.character.x, this.character.y, this.setup.chickenInBasket.x, this.setup.chickenInBasket.y - 20);
        if (this.setup.chickenInBasket.isReturning) {
            this.setup.chickenInBasket.updateReturnFlight();
        }
        this.world.endbossReaction();
    }
}
