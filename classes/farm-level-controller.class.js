class FarmLevelController {
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
        this.starttime2;
        this.lastCowSoundTime = 0;
        this.doorState = 'closed';
        this.doorBusy = false;
        this.timerManager = this.setup.timerManager;
        this.doorState = 'close';
        this.timeOnStable = null;
        this.start1 = false;
        this.cowTaskStep = 1;

        // Mittelpunkt des Bogens (etwas links unterhalb vom Canvas)
        this.sunCenterX = 640;    // Mitte der Szene
        this.sunCenterY = 820;    // unter dem Boden
        this.sunRadius = 850;    // groß genug, damit Start hoch ist

        this.moonCenterX = 1200;   // 640
        this.moonCenterY = 320; // 820, unter Boden
        this.moonRadius = 700;   // Höhe des Bogens

        // Startwinkel: ca. 20° oberhalb rechts
        this.sunAngle = Math.PI / 6; // ~30°
        this.moonAngle = Math.PI / 2; // 45°, rechts-oben

        this.eventManager = new EventManager(this.setup);
        this.questManager = new QuestManager(this.setup, this.eventManager);
        this.eventManager.questManager = this.questManager;
    }

    update(timestamp) {
        this.start();
        this.setup.sounds.farmMusic.play();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.timerManager.update();
        this.updateCamera();
        this.handleEarthquake();
        this.renderBackgrounds();
        this.renderStatusBar();
        this.renderNPCsAndCharacter();
        const now = performance.now();
        this.setup.popupTexts.forEach(p => p.draw(this.ctx, now));
        this.setup.popupTexts = this.setup.popupTexts.filter(p => p.active);
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
        this.songSzene();
        this.ctx.restore();

        const isPlayerNearDoor = this.character.x > 1000 && this.character.x < 1100;

        if (isPlayerNearDoor && !this.isNearDoor) {
            // Spieler betritt den Bereich
            this.isNearDoor = true;
            this.tryOpenDoor();
        }
        else if (!isPlayerNearDoor && this.isNearDoor) {
            // Spieler verlässt den Bereich
            this.isNearDoor = false;
            this.tryCloseDoor();
        }

        this.stableOpen();
        this.eventManager.update();
        this.questManager.update();
        this.eventManager.debug = true;

    }

    start() {
        if (!this.start1) {
            setTimeout(() => {
                this.setup.sounds.newTaskSound.play();
                this.setup.popupTexts.push(new PopupText("Neue Aufgaben im Log!", this.canvas.width / 2, 400));
            }, 4000);
            this.start1 = true;
        }
    }


    tryOpenDoor() {
        if (this.doorState === "closed") {
            this.doorState = "opening";
            this.setup.npcs.house.updateState("doorOpens");

            // Nur 1x starten, verhindert mehrfaches Öffnen
            this.timerManager.addUnique("door", 600, () => {
                this.doorState = "open";
                this.setup.npcs.house.updateState("idleOpen");
            });
        }
    }

    tryCloseDoor() {
        if (this.doorState === "open") {
            this.doorState = "closing";
            this.setup.npcs.house.updateState("doorCloses");

            this.timerManager.addUnique("door", 600, () => {
                this.doorState = "closed";
                this.setup.npcs.house.updateState("idle");
            });
        }
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
        if (this.setup.isGamecharacterInHouse) {
            return;
        }
        this.addToWorld(this.setup.statusBar);
    }

    renderNPCsAndCharacter() {
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX, 0);
        if (!this.setup.isGamecharacterInHouse && !this.setup.isGamecharacterOutHouse) {
            this.addToWorld(this.setup.npcs.bird);
        }
        this.addToWorld(this.setup.npcs.tree);
        this.addToWorld(this.setup.npcs.tree2);
        this.addToWorld(this.setup.npcs.tree3);
        this.addToWorld(this.setup.npcs.flower);
        this.addToWorld(this.setup.npcs.flower2);
        this.addToWorld(this.setup.npcs.flower3);
        this.addToWorld(this.setup.npcs.flower4);
        this.addToWorld(this.setup.npcs.flower5);
        this.addToWorld(this.setup.npcs.flower6);
        this.addToWorld(this.setup.npcs.flower7);
        this.addToWorld(this.setup.npcs.flower8);
        this.addToWorld(this.setup.npcs.barrier);
        if (this.cowTaskStep === 12) this.addToWorld(this.setup.npcs.sun);
        this.addToWorld(this.setup.npcs.house);
        this.addToWorld(this.setup.npcs.stable);
        this.addToWorld(this.setup.npcs.campfire);
        this.setup.npcs.house.isFlipped = false;
        this.setup.npcs.stable.isFlipped = false;
        this.setup.npcs.barrier.isFlipped = false;
        if (!this.setup.isGamecharacterInHouse) {
            if (this.character.isCaress) {
                this.addToWorld(this.character);
                this.addToWorld(this.setup.npcs.cow);
            } else {
                if (!this.setup.isGamecharacterInHouse && !this.setup.isGamecharacterOutHouse && this.cowTaskStep !== 11) {
                    this.addToWorld(this.setup.npcs.cow);
                }
                this.addToWorld(this.character);
            }
        }
        this.addToWorld(this.setup.npcs.pond);
        // this.addToWorld(this.setup.npcs.blackDragon);
        // this.setup.npcs.blackDragon.isFlipped = false;
        // this.setup.npcs.blackDragon.updateState('idle', 1000 / 6.5);
        // this.setup.sounds.dragonRoarSound.play();
        //             if (this.setup.npcs.blackDragon.x <= 6000) {
        //         this.setup.npcs.blackDragon.x += 2;
        //     }


        this.ctx.restore();
    }

    handleSpeechBubble() {
        if (this.setup.isGamecharacterInHouse || this.setup.isGamecharacterOutHouse) {
            return;
        }
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX, 0);
        if (this.character.x > 1550 && this.character.x < 1700) {
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
            // this.bubbleFarm = new SpeechBubble("In den Hühnerstall gehen? {F} drücken!", this.character, performance.now());
            // this.drawSpeechBubble(this.ctx, "In den Hühnerstall gehen? {F} drücken!", this.character);
        } else {
            this.setup.isNotificationPlay = false;
            this.setup.speechBubbles.bubbleFarm.startTime = null;
        }
        if (this.character.x > 1000 && this.character.x < 1100) {
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
        if (this.setup.isGamecharacterInHouse) {
            return;
        }
        this.checkPressKey();
        this.character.updateState(timestamp);
        this.character.updateAnimation(timestamp);
        if (this.character.isJumping) this.character.applyGravity(timestamp);
        this.stepSoundCharacter(timestamp);
        this.landingSoundCharacter();
    }

    updateNPCs(timestamp) {
        const npcs = ['cow', 'bird', 'pond', 'tree', 'tree2', 'tree3', 'flower', 'flower2', 'flower3', 'flower4', 'flower5', 'flower6', 'flower7', 'flower8', 'drohne', 'chicken', 'cowHypno', 'chickHypno', 'blackDragon', 'barrier', 'house', 'stable', 'clock', 'campfire', 'chicken2', 'chick', 'sun', 'moon'];
        npcs.forEach(name => {
            this.setup.npcs[name].updateState(timestamp);
            this.setup.npcs[name].updateAnimation(timestamp);
        });
    }

    handleInteractions() {
        // this.eventManager.add({
        //     type: "position",
        //     area: { x: 1700, width: 135 },
        //     once: false,
        //     requireKey: "F",
        //     action: (setup) => {
        //         this.camera_x = 0;
        //         this.character.x = 380;
        //         this.world.currentScene = 'stableLevel';
        //         this.keyboard.F = false;
        //         setup.farmLevel.level_end_x = 720;
        //         this.world.character.level_start_x = 360;
        //     }
        // });


        if (this.keyboard.F && this.character.x >= 1620 && this.character.x <= 1810) {
            this.world.camera_x = 0;
            this.character.x = 380;
            this.world.currentScene = 'stableLevel';
            this.keyboard.F = false;
            this.setup.farmLevel.level_end_x = 720;
            this.world.character.level_start_x = 360;
        }

        if (this.keyboard.F && this.character.x > 1000 && this.character.x < 1100) {
            this.setup.isGamecharacterInHouse = true;
            this.keyboard.F = false;
            this.setup.isNotificationPlay = false;
            this.setup.speechBubbles.bubbleFarm2.startTime = null;
        }
    }

    updateHouseEffects() {
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX, 0);
        if (this.setup.isGamecharacterInHouse) {
            if (!this.setup.timeGoInHouse) {
                this.setup.timeGoInHouse = performance.now();
            }
            this.setup.timeElapsed = performance.now() - this.setup.timeGoInHouse;
        }
        if (this.setup.isGamecharacterOutHouse) {
            if (!this.setup.timeGoOutHouse) {
                this.setup.timeGoOutHouse = performance.now();
            }
            this.setup.timeElapsed = performance.now() - this.setup.timeGoOutHouse;
        }
        if (this.cowTaskStep === 12) {
            if (!this.setup.timeAfterMakeAFire) {
                this.setup.timeAfterMakeAFire = performance.now();
            }
            this.setup.timeElapsedAfterMakeFire = performance.now() - this.setup.timeAfterMakeAFire;
        }
        this.adjustDarknessAndVolume();
        this.playYawningAndSnoreSounds();
        this.ctx.restore();
    }

    adjustDarknessAndVolume() {
        if (this.setup.timeElapsedAfterMakeFire >= 5000) {

            if (this.setup.isNight) {
                if (this.setup.darknessLevel < this.setup.maxDarkness) {
                    this.setup.darknessLevel += 0.005; // Geschwindigkeit der Verdunkelung
                }
            } else {
                if (this.setup.darknessLevel > 0) {
                    this.setup.darknessLevel -= 0.005;
                }
            }

            // if (this.setup.volumeLevel > this.setup.minVolumeLevel) {
            //     this.setup.volumeLevel = Math.max(this.setup.volumeLevel - 0.005, this.setup.minVolumeLevel);
            //     this.setup.sounds.farmMusic.volume = this.setup.volumeLevel;
            // }

            let gradient = this.ctx.createRadialGradient(
                this.character.x - this.camera_x + 50,
                this.character.y + 180,
                0,
                this.character.x - this.camera_x + 50,
                this.character.y + 180,
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


        // this.nightMusic.play();
        // this.drohneSound.play();
    }

    drawDroneAndMoveCamera() {
        if (this.setup.timeElapsed >= 27000) {
            if (!this.setup.isGamecharacterOutHouse) {
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
            if (!this.setup.isGamecharacterOutHouse) {
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
            if (!this.setup.isGamecharacterOutHouse) {
                if (this.setup.world.camera_x > 800) {
                    this.setup.world.camera_x -= 3;
                } else {
                    this.setup.isGamecharacterInHouse = false;
                    this.setup.isGamecharacterOutHouse = true;
                }
            }
        }
        this.charBubbles();
    }

    charBubbles() {
        if (!this.setup.isGamecharacterOutHouse) return;
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
        if (!this.setup.isGamecharacterOutHouse) return;
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
        if (!this.setup.isGamecharacterOutHouse) return;
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
        if (!this.setup.isGamecharacterOutHouse) return;
        if (this.setup.timeElapsed >= 16000 && this.setup.timeElapsed <= 30500) {
            this.character.isKneelAndCry = true;
        }
        this.changeState2()
    }

    changeState2() {
        if (!this.setup.isGamecharacterOutHouse) return;
        if (this.setup.timeElapsed >= 35000 && this.setup.timeElapsed <= 35500) {
            this.character.isKneelAndCry = false;
            this.character.isStandUpAndLookDetermined = true;
        }
        this.charBubbles4();
    }

    charBubbles4() {
        if (!this.setup.isGamecharacterOutHouse) return;
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
        if (!this.setup.isGamecharacterOutHouse) return;
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
        if (!this.setup.isGamecharacterOutHouse) return;
        if (this.setup.timeElapsed >= 46000 && this.setup.timeElapsed <= 51000) {
            this.ctx.save();
            this.ctx.translate(-this.renderCameraX, 0);
            if (!this.setup.speechBubbles.bubbleFarm8.startTime) {
                this.setup.speechBubbles.bubbleFarm8.start();
            }
            this.setup.speechBubbles.bubbleFarm8.update(performance.now());
            this.setup.speechBubbles.bubbleFarm8.draw(this.ctx, 0);
            this.ctx.restore();
            this.character.isStandUpAndLookDetermined = false;
            this.character.isLookDeterminedAndStandUp = true;
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

    //1620 1810
    stableOpen() {

        if (this.character.x >= 1620 && this.character.x <= 1810) {
            if (!this.timeOnStable) this.timeOnStable = performance.now();
            const elapsed = performance.now() - this.timeOnStable;
            if (this.doorState !== 'open' && this.setup.npcs.stable.currentAnimation !== 'doorOpens' && this.setup.npcs.stable.currentAnimation !== 'idleOpen' && elapsed >= 350) {
                this.doorState = 'open';
                this.setup.npcs.stable.updateState('doorOpens');
                this.setup.sounds.doorOpeningSound.play();
            }
        } else {
            this.timeOnStable = null;
            if (this.doorState !== 'closed' && this.setup.npcs.stable.currentAnimation !== 'doorCloses' && this.setup.npcs.stable.currentAnimation !== 'idle') {
                this.doorState = 'closed';
                this.setup.npcs.stable.updateState('doorCloses');
                this.setup.sounds.doorClosingSound.play();
            }
        }
    }

    songSzene() {

        if (this.cowTaskStep === 12) {
            this.moveSunAndMoon();
            if (this.setup.volumeLevel > this.setup.minVolumeLevel) {
                this.setup.volumeLevel = Math.max(this.setup.volumeLevel - 0.005, this.setup.minVolumeLevel);
                this.setup.sounds.farmMusic.volume = this.setup.volumeLevel;
            }
            if (!this.starttime2) this.starttime2 = performance.now();
            const elapsed = performance.now() - this.starttime2;
            if (elapsed >= 1500) {
                this.setup.npcs.campfire.updateState('fireGoesOn');
                this.setup.sounds.happyTogetherMusic.play();
                // this.setup.sounds.farmMusic.pause();
                this.setup.sounds.eveningSound.play();
                this.setup.npcs.cow.updateState('swingToMusic', 1000 / 6.5);
                this.setup.npcs.chick.updateState('swingToMusic', 1000 / 6.5);
                this.setup.npcs.chicken2.updateState('swingToMusic', 1000 / 6.5);
                this.campfire();
            }
        }
    }


    renderLyrics() {
        const audio = this.setup.sounds.happyTogetherMusic;
        const currentTime = audio.currentTime;

        const line = this.lyrics.findLast(l => currentTime >= l.time);
        if (!line) return;

        const nextLine = this.lyrics.find(l => l.time > currentTime);
        const lineEnd = nextLine
            ? nextLine.time
            : (line.duration ? line.time + line.duration : audio.duration);
        const elapsed = currentTime - line.time;
        const total = lineEnd - line.time;
        const remaining = lineEnd - currentTime;

        // Fade
        const fadeIn = 0.35;
        const fadeOut = 0.35;
        let opacity = 1;
        if (elapsed < fadeIn) opacity = elapsed / fadeIn;
        else if (nextLine && remaining < fadeOut) opacity = remaining / fadeOut;

        this.ctx.save();

        // --- Hintergrund mit Verlauf ---
        const padding = 20;
        const boxHeight = 115; // 80
        const gradientBg = this.ctx.createLinearGradient(0, this.canvas.height - boxHeight - padding, 0, this.canvas.height);
        gradientBg.addColorStop(0, `rgba(0, 0, 0, 0)`);
        gradientBg.addColorStop(1, `rgba(252, 112, 5,${0.2 * opacity})`); // rgba(0,0,0,${0.6 * opacity})

        this.ctx.fillStyle = gradientBg;
        this.ctx.fillRect(
            0,
            this.canvas.height - boxHeight - padding,
            this.canvas.width,
            boxHeight + padding
        );

        // --- Text ---
        this.ctx.font = "bold 32px Adventure, Arial";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        const x = this.canvas.width / 2;
        const y = this.canvas.height - 25; //55

        // Zeilen umbrechen (max. 80% Breite)
        const maxWidth = this.canvas.width * 0.8;
        const words = line.text.split(" ");
        const lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            const testLine = currentLine + " " + words[i];
            const testWidth = this.ctx.measureText(testLine).width;
            if (testWidth < maxWidth) {
                currentLine = testLine;
            } else {
                lines.push(currentLine);
                currentLine = words[i];
            }
        }
        lines.push(currentLine);

        // Karaoke Fortschritt
        const progress = Math.min(elapsed / total, 1);

        // Für jede Zeile zeichnen
        lines.forEach((txt, i) => {
            const lineY = y - ((lines.length - 1) * 20) + i * 40;

            // Grauer Basistext
            this.ctx.shadowColor = "rgba(0,0,0,0.9)";
            this.ctx.shadowBlur = 6;
            this.ctx.shadowOffsetX = 2;
            this.ctx.shadowOffsetY = 2;
            this.ctx.lineWidth = 4;
            this.ctx.strokeStyle = "black";
            this.ctx.strokeText(txt, x, lineY);
            this.ctx.fillStyle = `rgba(200,200,200,${opacity})`;
            this.ctx.fillText(txt, x, lineY);

            // Highlight-Gradient (Gelb→Orange)
            const textWidth = this.ctx.measureText(txt).width;
            const highlightWidth = textWidth * progress;

            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.rect(x - textWidth / 2, lineY - 25, highlightWidth, 50);
            this.ctx.clip();

            const gradient = this.ctx.createLinearGradient(x - textWidth / 2, 0, x + textWidth / 2, 0);
            gradient.addColorStop(0, `rgba(255, 215, 0, ${opacity})`);
            gradient.addColorStop(1, `rgba(255, 140, 0, ${opacity})`);

            this.ctx.fillStyle = gradient;
            this.ctx.fillText(txt, x, lineY);
            this.ctx.restore();
        });

        this.ctx.restore();
    }

    campfire() {
        this.lyrics = [
            { time: 7.2, text: "Bailamos en la plaza," },
            { time: 9.3, text: "Cantando sin parar," },
            { time: 11.4, text: "Con mis amigos cerca," },
            { time: 13.5, text: "Es un día para amar." },

            { time: 15.7, text: "Juanito, Pollito, Lola, we sing," },
            { time: 20.2, text: "Happy together, joy that we bring," },
            { time: 24.1, text: "Juanito, Pollito, Lola, my friends," },
            { time: 28.2, text: "Our love and our laughter will never end." },
            { time: 32.1, text: "" },

            { time: 39.5, text: "Caminamos la calle," },
            { time: 41, text: "con sonrisas y fe," },
            { time: 43, text: "cada paso juntos," },
            { time: 45.5, text: "la vida se ve bien." },

            { time: 46.8, text: "Juanito, Pollito, Lola my friends," },
            { time: 52, text: "Singing together, the joy never ends," },
            { time: 55.5, text: "Juanito, Pollito, Lola we sing," },
            { time: 60, text: "Friendship forever, the joy that we bring." },
            { time: 64.5, text: "" },

            { time: 71.2, text: "Siempre cantando, amigos de verdad," },
            { time: 75.7, text: "Juanito, Pollito, y Lola están," },
            { time: 79.7, text: "Juanito, Pollito, Lola my friends," },
            { time: 84.1, text: "Amigos por siempre, love never ends.", duration: 1 },
            { time: 89.9, text: "" }
        ];

        switch (true) {
            case (this.setup.sounds.happyTogetherMusic.currentTime >= 0 && this.setup.sounds.happyTogetherMusic.currentTime <= 7.2):
                this.character.isSitDownAndPlayGuitar = true;
                break;
            case (this.setup.sounds.happyTogetherMusic.currentTime >= 7.2 && this.setup.sounds.happyTogetherMusic.currentTime <= 32.1):
                this.character.isSitDownAndPlayGuitar = false;
                this.character.isPlayGuitarAndSing = true;
                break;
            case (this.setup.sounds.happyTogetherMusic.currentTime >= 32.1 && this.setup.sounds.happyTogetherMusic.currentTime <= 39.5):
                this.character.isPlayGuitarAndSing = false;
                this.character.isPlayGuitar = true;
                break;
            case (this.setup.sounds.happyTogetherMusic.currentTime >= 39.5 && this.setup.sounds.happyTogetherMusic.currentTime <= 64.5):
                this.character.isPlayGuitar = false;
                this.character.isPlayGuitarAndSing = true;
                break;
            case (this.setup.sounds.happyTogetherMusic.currentTime >= 64.5 && this.setup.sounds.happyTogetherMusic.currentTime <= 71.2):
                this.character.isPlayGuitarAndSing = false;
                this.character.isPlayGuitar = true;
                break;
            case (this.setup.sounds.happyTogetherMusic.currentTime >= 71.2 && this.setup.sounds.happyTogetherMusic.currentTime <= 89.9):
                this.character.isPlayGuitar = false;
                this.character.isPlayGuitarAndSing = true;
                break;
            case (this.setup.sounds.happyTogetherMusic.currentTime >= 89.9):
                this.character.isPlayGuitarAndSing = false;
                this.character.isPlayGuitar = true;
                break;

        }
        this.renderLyrics();
    }

    moveSunAndMoon() {
        if (this.sunAngle < Math.PI) {
            this.sunAngle += 0.004;

        }
        if (!this.moonStartTime) {
            this.moonStartTime = performance.now();
        }

        const elapsed = performance.now() - this.moonStartTime;

        if (elapsed > 5000 && this.moonAngle < Math.PI * 0.85) {
            this.moonAngle += 0.004;
        }

        this.setup.npcs.sun.x = this.sunCenterX + this.sunRadius * Math.cos(this.sunAngle);
        this.setup.npcs.sun.y = this.sunCenterY - this.sunRadius * Math.sin(this.sunAngle);
        this.setup.npcs.moon.x = this.moonCenterX + this.moonRadius * Math.cos(this.moonAngle);
        this.setup.npcs.moon.y = this.moonCenterY - this.moonRadius * Math.sin(this.moonAngle);
    }
}
