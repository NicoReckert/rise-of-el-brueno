class FarmLevelController {
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
    }

    update(timestamp) {
        this.setup.sounds.farmMusic.play();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateCamera();
        this.handleEarthquake();
        this.renderBackgrounds();
        this.renderStatusBar();
        this.renderNPCsAndCharacter();
        this.setup.taskWindow.update();
        this.setup.taskWindow.draw(this.ctx);
        this.handleSpeechBubble();
        this.updateHouseEffects();
        this.updateCharacter(timestamp);
        this.updateNPCs(timestamp);
        this.handleInteractions();
        this.drawDroneAndMoveCamera();
        this.playDroneHypnoSound();
        this.droneGo();
        this.ctx.restore();
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
        if (this.setup.isGameCharakterInHouse) {
            return;
        }
        this.addToWorld(this.setup.statusBar);
    }

    renderNPCsAndCharacter() {
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX, 0);
        if (!this.setup.isGameCharakterInHouse && !this.setup.isGameCharakterOutHouse) {
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
        if (this.setup.isGameCharakterInHouse || this.setup.isGameCharakterOutHouse) {
            return;
        }
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
        if (this.setup.isGameCharakterInHouse) {
            return;
        }
        this.checkPressKey();
        this.charakter.updateState(timestamp);
        this.charakter.updateAnimation(timestamp);
        if (this.charakter.isJumping) this.charakter.applyGravity(timestamp);
        this.stepSoundCharakter(timestamp);
        this.landingSoundCharakter();
    }

    updateNPCs(timestamp) {
        const npcs = ['cow', 'bird', 'pond', 'tree', 'drohne', 'chicken', 'cowHypno', 'chickHypno'];
        npcs.forEach(name => {
            this.setup.npcs[name].updateState(timestamp);
            this.setup.npcs[name].updateAnimation(timestamp);
        });
    }

    handleInteractions() {
        if (this.keyboard.F && this.charakter.x > 1550 && this.charakter.x < 1700) {
            this.world.inStallSetup();
            this.world.currentScene = 'stallScene';
            this.keyboard.F = false;
            this.setup.farmLevel.level_end_x = 500;
            this.world.charakter.level_start_x = 80;
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
        if (this.setup.isGameCharakterOutHouse) {
            if (!this.setup.timeGoOutHouse) {
                this.setup.timeGoOutHouse = performance.now();
            }
            this.setup.timeElapsed = performance.now() - this.setup.timeGoOutHouse;
        }
        this.adjustDarknessAndVolume();
        this.playYawningAndSnoreSounds();
        this.ctx.restore();
    }

    adjustDarknessAndVolume() {
        if (this.setup.timeElapsed >= 5000) {

            if (this.setup.isNight) {
                if (this.setup.darknessLevel < this.setup.maxDarkness) {
                    this.setup.darknessLevel += 0.005; // Geschwindigkeit der Verdunkelung
                }
            } else {
                if (this.setup.darknessLevel > 0) {
                    this.setup.darknessLevel -= 0.005;
                }
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
            this.ctx.fillRect(0, this.canvas.height, this.canvas.width * 9, -this.canvas.height * 2);
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


        //     this.nightMusic.play();
        //     this.drohneSound.play();
    }

    drawDroneAndMoveCamera() {
        if (this.setup.timeElapsed >= 27000) {
            if (!this.setup.isGameCharakterOutHouse) {
                this.ctx.save();
                this.ctx.translate(-this.renderCameraX, 0);
                this.addToWorld(this.setup.npcs.drohne);
                this.ctx.restore();
            }
            if (!this.setup.droneIsGo) {
                if (this.setup.world.camera_x <= this.setup.npcs.drohne.x - 300) {
                    this.setup.world.camera_x += 10;
                } else {
                    if (this.setup.npcs.drohne.x >= 1500) {
                        this.setup.npcs.drohne.x -= 5;
                        this.setup.world.camera_x += ((this.setup.npcs.drohne.x - 300) - this.setup.world.camera_x) * 0.1;
                    }
                    if (!this.setup.droneSoundIsPlaying) {
                        this.setup.sounds.drohneSound.loop = true;
                        this.setup.sounds.drohneSound.play();
                        this.setup.droneSoundIsPlaying = true;
                    }
                    if (!this.setup.nightMusicIsPlaying) {
                        this.setup.sounds.nightMusic.loop = true;
                        this.setup.sounds.nightMusic.volume = 0.6;
                        this.setup.sounds.nightMusic.play();
                        this.setup.nightMusicIsPlaying = true;
                    }
                }
            }

        }
    }

    playDroneHypnoSound() {
        if (this.setup.timeElapsed >= 49000) {
            this.setup.sounds.drohneSound.pause();
            if (!this.setup.droneHypnoSoundIsPlaying) {
                this.setup.sounds.drohneHypnoSound.loop = true;
                this.setup.sounds.drohneHypnoSound.play();
                this.setup.droneHypnoSoundIsPlaying = true;
            }
            this.setup.npcs.drohne.updateState('hypno', 1000 / 7);
            if (!this.setup.isGameCharakterOutHouse) {
                this.ctx.save();
                this.ctx.translate(-this.renderCameraX, 0);
                this.addToWorld(this.setup.npcs.chicken);
                this.addToWorld(this.setup.npcs.cowHypno);
                this.addToWorld(this.setup.npcs.chickHypno);
                this.ctx.restore();

                this.setup.npcs.chicken.updateState('walk', 1000 / 7);
                this.setup.npcs.cowHypno.updateState('walk', 1000 / 5);
                this.setup.npcs.chickHypno.updateState('walk', 1000 / 7);
                if (this.setup.npcs.chicken.x < 2500) {
                    this.setup.npcs.chicken.x += 1.5;
                }
                if (this.setup.npcs.cowHypno.x < 2500) {
                    this.setup.npcs.cowHypno.x += 1.5;
                }
                if (this.setup.npcs.chickHypno.x < 2500) {
                    this.setup.npcs.chickHypno.x += 1.5;
                }
            }
        }
    }

    droneGo() {
        if (this.setup.timeElapsed >= 75000) {
            this.setup.npcs.drohne.updateState('idle', 1000 / 7);
            this.setup.sounds.drohneHypnoSound.pause();
            this.setup.sounds.drohneSound.play();
            this.setup.droneIsGo = true;
            if (this.setup.npcs.drohne.x <= 2000) {
                this.setup.npcs.drohne.x += 5;
            }
        }
        this.soundAndMusicStop();
    }

    soundAndMusicStop() {
        if (this.setup.timeElapsed >= 83000) {
            if (this.setup.volumeLevel2 > this.setup.minVolumeLevel) {
                this.setup.volumeLevel2 = Math.max(this.setup.volumeLevel2 - 0.002, this.setup.minVolumeLevel);
                this.setup.sounds.drohneSound.volume = this.setup.volumeLevel2;
                this.setup.sounds.nightMusic.volume = this.setup.volumeLevel2;
            }
        }
        this.makeLight();
    }

    makeLight() {
        if (this.setup.timeElapsed >= 86000 && this.setup.timeElapsed < 86500) {
            this.setup.isNight = false;
            this.setup.sounds.sadMusic.play();
        }
        this.cameraGo();
    }

    cameraGo() {
        if (this.setup.timeElapsed >= 90000) {
            this.setup.sounds.eveningSound.pause();
            this.setup.sounds.drohneSound.pause();
            this.setup.sounds.nightMusic.pause();
            if (!this.setup.isGameCharakterOutHouse) {
                if (this.setup.world.camera_x > 800) {
                    this.setup.world.camera_x -= 3;
                } else {
                    this.setup.isGameCharakterInHouse = false;
                    this.setup.isGameCharakterOutHouse = true;
                }
            }
        }
        this.charBubbles();
    }

    charBubbles() {
        if (!this.setup.isGameCharakterOutHouse) return;
        if (this.setup.timeElapsed >= 4000 && this.setup.timeElapsed <= 9000) {
            this.ctx.save();
            this.ctx.translate(-this.renderCameraX, 0);
            if (!this.setup.speechBubbles.bubbleFarm3.startTime) {
                this.setup.speechBubbles.bubbleFarm3.start();
            }
            this.setup.speechBubbles.bubbleFarm3.update(performance.now());
            this.setup.speechBubbles.bubbleFarm3.draw(this.ctx);
            this.ctx.restore();
        }
        this.charBubbles2();
    }

    charBubbles2() {
        if (!this.setup.isGameCharakterOutHouse) return;
        if (this.setup.timeElapsed >= 9000 && this.setup.timeElapsed <= 14000) {
            this.ctx.save();
            this.ctx.translate(-this.renderCameraX, 0);
            if (!this.setup.speechBubbles.bubbleFarm4.startTime) {
                this.setup.speechBubbles.bubbleFarm4.start();
            }
            this.setup.speechBubbles.bubbleFarm4.update(performance.now());
            this.setup.speechBubbles.bubbleFarm4.draw(this.ctx);
            this.ctx.restore();
        }
        this.charBubbles3();
    }

    charBubbles3() {
        if (!this.setup.isGameCharakterOutHouse) return;
        if (this.setup.timeElapsed >= 14000 && this.setup.timeElapsed <= 30000) {
            this.ctx.save();
            this.ctx.translate(-this.renderCameraX, 0);
            if (!this.setup.speechBubbles.bubbleFarm5.startTime) {
                this.setup.speechBubbles.bubbleFarm5.start();
            }
            this.setup.speechBubbles.bubbleFarm5.update(performance.now());
            this.setup.speechBubbles.bubbleFarm5.draw(this.ctx, 40);
            this.ctx.restore();
        }
        this.changeState();
    }

    changeState() {
        if (!this.setup.isGameCharakterOutHouse) return;
        if (this.setup.timeElapsed >= 16000 && this.setup.timeElapsed <= 30500) {
            this.charakter.isKneelAndCry = true;
        }
        this.changeState2()
    }

    changeState2() {
        if (!this.setup.isGameCharakterOutHouse) return;
        if (this.setup.timeElapsed >= 35000 && this.setup.timeElapsed <= 35500) {
            this.charakter.isKneelAndCry = false;
            this.charakter.isStandUpAndLookDetermined = true;
        }
        this.charBubbles4();
    }

    charBubbles4() {
        if (!this.setup.isGameCharakterOutHouse) return;
        if (this.setup.timeElapsed >= 36000 && this.setup.timeElapsed <= 41000) {
            this.ctx.save();
            this.ctx.translate(-this.renderCameraX, 0);
            if (!this.setup.speechBubbles.bubbleFarm6.startTime) {
                this.setup.speechBubbles.bubbleFarm6.start();
            }
            this.setup.speechBubbles.bubbleFarm6.update(performance.now());
            this.setup.speechBubbles.bubbleFarm6.draw(this.ctx, 0);
            this.ctx.restore();
        }
        this.charBubbles5();
    }

    charBubbles5() {
        if (!this.setup.isGameCharakterOutHouse) return;
        if (this.setup.timeElapsed >= 41000 && this.setup.timeElapsed <= 46000) {
            this.ctx.save();
            this.ctx.translate(-this.renderCameraX, 0);
            if (!this.setup.speechBubbles.bubbleFarm7.startTime) {
                this.setup.speechBubbles.bubbleFarm7.start();
            }
            this.setup.speechBubbles.bubbleFarm7.update(performance.now());
            this.setup.speechBubbles.bubbleFarm7.draw(this.ctx, 0);
            this.ctx.restore();
        }
        this.charBubbles6();
    }

    charBubbles6() {
        if (!this.setup.isGameCharakterOutHouse) return;
        if (this.setup.timeElapsed >= 46000 && this.setup.timeElapsed <= 51000) {
            this.ctx.save();
            this.ctx.translate(-this.renderCameraX, 0);
            if (!this.setup.speechBubbles.bubbleFarm8.startTime) {
                this.setup.speechBubbles.bubbleFarm8.start();
            }
            this.setup.speechBubbles.bubbleFarm8.update(performance.now());
            this.setup.speechBubbles.bubbleFarm8.draw(this.ctx, 0);
            this.ctx.restore();
            this.charakter.isStandUpAndLookDetermined = false;
            this.charakter.isLookDeterminedAndStandUp = true;
        }

    }


    handleEarthquake() {
        if (this.setup.timeElapsed >= 20000) {
            let shakeX = 0;
            let shakeY = 0;
            if (this.setup.shakeIntensity > 0) {
                shakeX = Math.round((Math.random() - 0.5) * this.setup.shakeIntensity);
                shakeY = Math.round((Math.random() - 0.5) * this.setup.shakeIntensity);
                this.setup.shakeIntensity *= 0.9955; // Dämpfung, Beben hört langsam auf
                if (!this.setup.earthquakeSoundIsPlaying) {
                    this.setup.sounds.earthquakeSound.play();
                    this.setup.earthquakeSoundIsPlaying = true;
                }
            }
            this.ctx.save();
            this.ctx.translate(shakeX, shakeY);
        }
    }
}
