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
        this.questManager = new QuestManager(this.setup, this.eventManager, this.setup.farmEvents);
        this.eventManager.questManager = this.questManager;

        this.questManager.step = 1;
        this.sandstorm = new SandstormEffect(this.canvas);
        this.sandstorm.setAlpha(0.2);
        this.sandstorm.setSpeed(5);
        this.windParticles = new WindParticleEffect(this.canvas.width * 9, this.canvas.height, 1000);
    }

    update(timestamp) {
        this.start();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // this.timerManager.update();
        this.updateCamera();
        this.handleEarthquake();
        this.renderBackgrounds();
        this.renderStatusBar();
        this.renderNPCsAndCharacter();
        this.ctx.restore();
        this.ctx.restore();
        const now = performance.now();
        this.setup.popupTexts.forEach(p => p.draw(this.ctx, now));
        this.setup.popupTexts = this.setup.popupTexts.filter(p => p.active);
        this.setup.taskWindow.update();
        this.setup.taskWindow.draw(this.ctx);
        this.updateCharacter(timestamp);
        this.updateNPCs(timestamp);

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
        this.sandstorm.update();
        this.eventManager.update();
        this.questManager.update();
        // this.eventManager.debug = true;
        this.renderAfterDark()
        if(this.questManager.step >= 20)this.windParticles.update();
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
            if (this.questManager.step < 10) this.addToWorld(this.setup.npcs.bird);
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
        if (this.questManager.step === 10) this.addToWorld(this.setup.npcs.sun);
        this.addToWorld(this.setup.npcs.house);


        this.ctx.save();
        this.ctx.shadowColor = "rgba(0,0,0,0.4)"; // weiches Schwarz
        this.ctx.shadowBlur = 10;                 // Weichheit
        this.ctx.shadowOffsetX = 5;               // kleine Verschiebung
        this.ctx.shadowOffsetY = 5;
        this.addToWorld(this.setup.farmLevel.towns[0]);
        this.addToWorld(this.setup.npcs.stable);
        if (this.questManager.step < 8) this.addToWorld(this.setup.npcs.campfire);
        this.setup.npcs.house.isFlipped = false;
        this.setup.npcs.stable.isFlipped = false;
        this.setup.npcs.barrier.isFlipped = false;
        if (!this.setup.isGamecharacterInHouse) {
            if (this.character.isCaress) {
                this.addToWorld(this.character);
                this.addToWorld(this.setup.npcs.cow);
            } else {
                if (!this.setup.isGamecharacterInHouse && !this.setup.isGamecharacterOutHouse && this.cowTaskStep !== 11) {
                    if (this.questManager.step < 8) this.addToWorld(this.setup.npcs.cow);
                }
                if (this.questManager.step < 8 || this.questManager.step > 18) this.addToWorld(this.character);
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
        // this.sandstorm.draw(this.ctx, this.renderCameraX);
        if(this.questManager.step >= 20) this.windParticles.draw(this.ctx, this.renderCameraX);
    }

    renderAfterDark() {
        if (this.questManager.step >= 8) {
            this.ctx.save();
            this.ctx.translate(-this.renderCameraX, 0);
            if (this.questManager.step < 14) this.world.addToWorld(this.setup.npcs.cow);
            if (this.questManager.step < 14) this.world.addToWorld(this.setup.npcs.chick);
            if (this.questManager.step < 14) this.world.addToWorld(this.setup.npcs.chicken2);
            this.world.addToWorld(this.setup.npcs.campfire);
            if (this.questManager.step < 13) this.world.addToWorld(this.setup.world.character);
            if (this.questManager.step < 14) this.world.addToWorld(this.setup.npcs.moon);
            if (this.questManager.step >= 14 && this.questManager.step < 18) {
                this.addToWorld(this.setup.npcs.drohne);
                this.addToWorld(this.setup.npcs.chicken);
                this.addToWorld(this.setup.npcs.cowHypno);
                this.addToWorld(this.setup.npcs.chickHypno);
            }
            this.ctx.restore();
        }
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
        const npcs = ['cow', 'bird', 'pond', 'tree', 'tree2', 'tree3', 'flower', 'flower2', 'flower3', 'flower4', 'flower5', 'flower6', 'flower7', 'flower8', 'drohne', 'chicken', 'cowHypno', 'chickHypno', 'blackDragon', 'barrier', 'house', 'stable', 'clock', 'campfire', 'chicken2', 'chick', 'sun', 'moon', 'cowPortrait', 'chickenPortrait', 'chickPortrait'];
        npcs.forEach(name => {
            this.setup.npcs[name].updateState(timestamp);
            this.setup.npcs[name].updateAnimation(timestamp);
        });
    }

    handleEarthquake() {
        if (this.setup.earthquakeStart) {
            let shakeX = 0;
            let shakeY = 0;
            if (this.setup.shakeIntensity > 0) {
                shakeX = Math.round((Math.random() - 0.5) * this.setup.shakeIntensity);
                shakeY = Math.round((Math.random() - 0.5) * this.setup.shakeIntensity);
                this.setup.shakeIntensity *= 0.9955;
            } else this.setup.earthquakeStart = false;
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

    renderLyrics() {
        const audio = this.setup.sounds.happyTogetherMusic;
        const currentTime = audio.currentTime;

        const line = this.setup.lyrics.findLast(l => currentTime >= l.time);
        if (!line) return;

        const nextLine = this.setup.lyrics.find(l => l.time > currentTime);
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
}