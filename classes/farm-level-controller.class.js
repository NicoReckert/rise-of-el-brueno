class FarmLevelController {
    constructor(setup) {
        this.setup = setup;
        this.ctx = this.setup.world.ctx;
        this.canvas = this.setup.world.canvas;
        this.addObject = this.setup.world.addObject;
        this.addToWorld = this.setup.world.addToWorld;
        this.charakter = this.setup.world.charakter;
        this.checkPressKey = this.setup.world.checkPressKey;
        this.keyboard = this.setup.world.keyboard;
        this.stepSoundCharakter = this.setup.world.stepSoundCharakter;
        this.landingSoundCharakter = this.setup.world.landingSoundCharakter;
        this.footStepSound = this.setup.world.footStepSound;
        this.jumpSound = this.setup.world.jumpSound;
        this.landingSound = this.setup.world.landingSound;
    }

    // let shakeX = 0;
    // let shakeY = 0;
    // if (this.shakeIntensity > 0) {
    //     shakeX = Math.round((Math.random() - 0.5) * this.shakeIntensity);
    //     shakeY = Math.round((Math.random() - 0.5) * this.shakeIntensity);
    // this.shakeIntensity *= 0.993; // Dämpfung, Beben hört langsam auf
    // }

    // this.ctx.save();
    // this.ctx.translate(shakeX, shakeY);



    // this.updateCamera();
    update(timestamp) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateCamera();
        this.renderBackgrounds();
        this.renderStatusBar();
        this.renderNPCsAndCharacter();
        this.handleSpeechBubble();
        this.updateHouseEffects();
        this.updateCharacter(timestamp);
        this.updateNPCs(timestamp);
        this.handleInteractions();
    }

    updateCamera() {
        this.camera_x = this.setup.world.camera_x;
        this.renderCameraX = Math.round(this.camera_x);

    }

    renderBackgrounds() {
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX, 0);
        this.addObject(this.setup.farmLevel.sky);
        this.addObject(this.setup.farmLevel.clouds);
        this.addObject(this.setup.farmLevel.grounds);
        this.addObject(this.setup.farmLevel.towns);
        this.ctx.restore();
    }

    renderStatusBar() {
        this.addToWorld(this.setup.statusBar);
    }

    renderNPCsAndCharacter() {
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX, 0);
        if (!this.setup.isGameCharakterInHouse) {
            this.addToWorld(this.setup.npcs.cow);
            this.addToWorld(this.setup.npcs.bird);
        }
        this.addToWorld(this.setup.npcs.tree);
        if (!this.setup.isGameCharakterInHouse) {
            this.addToWorld(this.charakter);
        }
        this.addToWorld(this.setup.npcs.pond);
        this.ctx.restore();
    }

    handleSpeechBubble() {
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX, 0);
        if (this.charakter.x > 1550 && this.charakter.x < 1700) {
            if (!this.setup.speechBubbles.bubbleFarm.startTime) {
                this.setup.speechBubbles.bubbleFarm.start(); // Jetzt beginnt das Schreiben
            }
            this.setup.speechBubbles.bubbleFarm.update(performance.now());
            this.setup.speechBubbles.bubbleFarm.draw(this.ctx);
            if (!this.setup.isNotificationPlay) {
                this.setup.sounds.notificationSound.currentTime = 0;
                this.setup.sounds.notificationSound.play();
                this.setup.isNotificationPlay = true;
            }
            // this.bubbleFarm = new SpeechBubble("In den Hühnerstall gehen? {F} drücken!", this.charakter, performance.now());
            // this.drawSpeechBubble(this.ctx, "In den Hühnerstall gehen? {F} drücken!", this.charakter);
        } else {
            this.setup.isNotificationPlay = false;
            this.setup.speechBubbles.bubbleFarm.startTime = null;
        }
        if (this.charakter.x > 1000 && this.charakter.x < 1100) {
            if (!this.setup.speechBubbles.bubbleFarm2.startTime) {
                this.setup.speechBubbles.bubbleFarm2.start(); // Jetzt beginnt das Schreiben
            }
            this.setup.speechBubbles.bubbleFarm2.update(performance.now());
            this.setup.speechBubbles.bubbleFarm2.draw(this.ctx);
            if (!this.setup.isNotificationPlay) {
                this.setup.sounds.notificationSound.currentTime = 0;
                this.setup.sounds.notificationSound.play();
                this.setup.isNotificationPlay = true;
            }
        } else {
            this.setup.isNotificationPlay = false;
            this.setup.speechBubbles.bubbleFarm2.startTime = null;
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
        const npcs = ['cow', 'bird', 'pond', 'tree', 'drohne'];
        npcs.forEach(name => {
            this.setup.npcs[name].updateState(timestamp);
            this.setup.npcs[name].updateAnimation(timestamp);
        });
    }

    handleInteractions() {
        if (this.keyboard.F && this.charakter.x > 1550 && this.charakter.x < 1700) {
            this.inStallSetup();
            this.currentScene = 'stallScene';
            this.keyboard.F = false;
            this.setup.farmLevel.level_end_x = 500;
        }

        if (this.keyboard.F && this.charakter.x > 1000 && this.charakter.x < 1100) {
            this.setup.isGameCharakterInHouse = true;
            this.keyboard.F = false;
            this.setup.isNotificationPlay = false;
            this.setup.speechBubbles.bubbleFarm2.startTime = null;
        }
    }

    updateHouseEffects() {
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX, 0);
        if (this.setup.isGameCharakterInHouse) {
            if (!this.setup.timeGoInHouse) {
                this.setup.timeGoInHouse = performance.now();
            }
            this.setup.timeElapsed = performance.now() - this.setup.timeGoInHouse;
        }
        this.adjustDarknessAndVolume();
        this.playYawningAndSnoreSounds();
        this.ctx.restore();
    }

    adjustDarknessAndVolume() {
        if (this.setup.timeElapsed >= 5000) {

            if (this.setup.darknessLevel < this.setup.maxDarkness) {
                this.setup.darknessLevel += 0.005; // Geschwindigkeit der Verdunkelung
            }

            if (this.setup.volumeLevel > this.setup.minVolumeLevel) {
                this.setup.volumeLevel = Math.max(this.setup.volumeLevel - 0.005, this.setup.minVolumeLevel);
                this.setup.sounds.farmMusic.volume = this.setup.volumeLevel;
            }

            let gradient = this.ctx.createRadialGradient(
                this.charakter.x - this.camera_x + 50,
                this.charakter.y + 180,
                0,
                this.charakter.x - this.camera_x + 50,
                this.charakter.y + 180,
                200 // Radius des Lichtkegels
            );
            // gradient.addColorStop(0, 'rgba(255,255,255,0.4)');    // Licht in der Mitte
            gradient.addColorStop(1, `rgba(10,10,40,${this.setup.darknessLevel})`); // Dunkel außen

            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width * 9, this.canvas.height);
        }
    }

    playYawningAndSnoreSounds() {
        if (this.setup.timeElapsed >= 8000 && !this.setup.isYawning) {
            this.setup.isYawning = true;
            this.setup.sounds.farmMusic.pause();
            this.setup.sounds.eveningSound.play();
            this.setup.sounds.yawningSound.play();
        }

        if (this.setup.timeElapsed >= 12000 && !this.setup.isYawning) {
            this.setup.isYawning = true;
            this.setup.sounds.farmMusic.pause();
            this.setup.sounds.eveningSound.play();
            this.setup.sounds.yawningSound.play();
        }

        if (this.setup.timeElapsed >= 15000 && !this.setup.isSnore) {
            this.setup.isSnore = true;
            this.setup.sounds.snoringSound.play();
            this.camera_x = this.setup.npcs.drohne.x;
        }

        this.addToWorld(this.setup.npcs.drohne);
        //     this.nightMusic.play();
        //     this.drohneSound.play();
    }
}
