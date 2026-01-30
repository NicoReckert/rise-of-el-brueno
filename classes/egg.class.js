import { MovableObject } from './movable-object.class.js';

export class Egg extends MovableObject {
    constructor(entityImages, x, y, allAudios, options = {}) {
        super();
        this.entityImages = entityImages;

        this.x = x;
        this.y = y;
        this.width = options.width ?? 200;
        this.height = options.height ?? 200;

        this.groundY = options.groundY ?? 520;
        this.lastPhysicsTime = null;
        this.speedY = 0;
        this.acceleration = options.acceleration ?? 1800;

        this.isFalling = false;
        this.isBroken = false;
        this.isDestroyed = false;

        this.lastFrameTime = 0;
        this.frameIndex = 0;
        this.frameInterval = 1000 / 8;
        this.currentAnimation = "idle";

        this.onBreak = options.onBreak ?? null;

        this.initImages();
        this.initFallTiming(options.delayMin ?? 2000, options.delayMax ?? 3000);

        this.opacity = 1;
        this.blinkStart = 800;   // ms nach break
        this.fadeStart = 1500;    // ms nach break
        this.removeTime = 2000;  // komplett weg

        this.audios = allAudios || {};
        this.fallingSoundPlayed = false;
        this.impactSoundPlayed = false;
        this.crackSoundPlayed = false;

        this.eggFallingSound = this.audios.eggFallingSound?.cloneNode?.() || this.audios.eggFallingSound;
        this.eggImpactSound = this.audios.eggImpactSound?.cloneNode?.() || this.audios.eggImpactSound;
        this.eggCrackSound = this.audios.eggCrackSound?.cloneNode?.() || this.audios.eggCrackSound;

    }

    initImages() {
        this.idleImages = this.entityImages.egg?.idle || [];
        this.brokenImages = this.entityImages.egg?.broken || [];
    }

    initFallTiming(delayMin, delayMax) {
        const now = performance.now();
        const delay = delayMin + Math.random() * (delayMax - delayMin);
        this.fallStartTime = now + delay;
    }

    update(timestamp) {
        this.updateState(timestamp);
        this.updateAnimation(timestamp);
    }

    updateState(timestamp) {
        if (!this.lastPhysicsTime) this.lastPhysicsTime = timestamp;
        const dt = (timestamp - this.lastPhysicsTime) / 1000;
        this.lastPhysicsTime = timestamp;

        // 🟢 Start falling
        if (!this.isFalling && !this.isBroken && timestamp >= this.fallStartTime) {
            this.isFalling = true;
            this.speedY = 0;
            if (!this.fallingSoundPlayed && this.eggFallingSound) {
                this.fallingSoundPlayed = true;
                this.eggFallingSound.currentTime = 0;
                this.eggFallingSound.play();
            }
        }

        // 🟢 Gravity
        if (this.isFalling && !this.isBroken) {
            this.speedY += this.acceleration * dt;
            this.y += this.speedY * dt;
        }

        // 🟢 Boden-Kollision (WICHTIG!)
        if (!this.isBroken && this.y >= this.groundY) {
            this.y = this.groundY;
            this.isBroken = true;
            this.isFalling = false;
            this.currentAnimation = "broken";
            this.frameIndex = 0;
            this.breakTime = timestamp;
            this.opacity = 1;

            if (!this.impactSoundPlayed && this.eggImpactSound) {
                this.impactSoundPlayed = true;
                this.eggImpactSound.currentTime = 0;
                this.eggImpactSound.play();
            }

            // 🔊 crack sound (einmal) – entweder sofort oder beim Blinkstart
            if (!this.crackSoundPlayed && this.eggCrackSound) {
                this.crackSoundPlayed = true;
                this.eggCrackSound.currentTime = 0;
                this.eggCrackSound.play();
            }

            if (this.onBreak) this.onBreak(this);
        }

        // 🟡 Blink + Fade NUR wenn kaputt
        if (this.isBroken) {
            const elapsed = timestamp - this.breakTime;

            // 🔹 Blinkphase
            if (elapsed >= this.blinkStart && elapsed < this.fadeStart) {
                this.opacity = Math.floor(elapsed / 80) % 2 === 0 ? 1 : 0.2;
            }

            // 🔹 Fade-Out
            if (elapsed >= this.fadeStart) {
                const fadeProgress =
                    (elapsed - this.fadeStart) / (this.removeTime - this.fadeStart);
                this.opacity = Math.max(0, 1 - fadeProgress);
            }

            // 🔹 Entfernen
            if (elapsed >= this.removeTime) {
                this.isDestroyed = true;
            }
        }
    }


    updateAnimation(timestamp) {
        if (!this.lastFrameTime) this.lastFrameTime = timestamp;
        const dt = timestamp - this.lastFrameTime;
        if (dt <= this.frameInterval) return;

        let images;
        let isBrokenAnim = false;

        if (this.currentAnimation === "broken") {
            images = this.brokenImages;
            isBrokenAnim = true;
        } else {
            images = this.idleImages;
        }

        if (!images || images.length === 0) return;

        // 🔒 Broken-Animation: nur einmal abspielen
        if (isBrokenAnim) {
            if (this.frameIndex < images.length) {
                this.img = images[this.frameIndex];
                this.frameIndex++;
            } else {
                // bleibe auf letztem Frame
                this.img = images[images.length - 1];
            }
        } else {
            // normale Loop-Animationen
            this.img = images[this.frameIndex % images.length];
            this.frameIndex++;
        }

        this.lastFrameTime = timestamp;
    }

}
