import { MovableObject } from './movable-object.class.js';

export class AnimatedEntity extends MovableObject {

    constructor(entityImages, currentEntity, height = 150, width = 150, x = 355, y = 220, offsetTop = 0, offsetLeft = 0, offsetRight = 0, offsetBottom = 0) {
        super();
        this.isGamecharacter = false;
        this.entityImages = entityImages;
        this.currentEntity = currentEntity;
        this.loadImgFromCurrentEntity(this.currentEntity);
        this.height = height;
        this.width = width;
        this.x = x;
        this.y = y;
        this.lastFrameTime = 0;
        this.currentAnimation = 'idle';
        this.frameInterval = 1000 / 5.5;
        this.frameIndex = 0;
        this.isFlipped = true;
        this.offset.top = offsetTop;
        this.offset.left = offsetLeft;
        this.offset.right = offsetRight;
        this.offset.bottom = offsetBottom;
        this.speedX = 5;
        this.movementSpeed = 0;
        this.lastUpdateTime = 0;
        this.isMovingLeft = false;
        this.isMovingRight = false;

        this.opacity = 1;
        this.fading = null; // "in" | "out" | null
        this.fadeStart = null;
        this.fadeDuration = 1000;
        this.sheetIndex = 0;
    }

    loadImgFromCurrentEntity(currentEntity) {
        this.idle = this.entityImages[currentEntity]?.idle ?? [];
        this.controlled = this.entityImages[currentEntity]?.controlled ?? [];
        this.walk = this.entityImages[currentEntity]?.walk ?? [];
        this.love = this.entityImages[currentEntity]?.love ?? [];
        this.eat = this.entityImages[currentEntity]?.eat ?? [];
        this.flyUp = this.entityImages[currentEntity]?.flyUp ?? [];
        this.fly = this.entityImages[currentEntity]?.fly ?? [];
        this.afraid = this.entityImages[currentEntity]?.afraid ?? [];
        this.halfSizeFly = this.entityImages[currentEntity]?.halfSizeFly ?? [];
        this.fullSizeFly = this.entityImages[currentEntity]?.fullSizeFly ?? [];
        this.idleOpen = this.entityImages[currentEntity]?.idleOpen ?? [];
        this.doorOpens = this.entityImages[currentEntity]?.doorOpens ?? [];
        this.doorCloses = this.entityImages[currentEntity]?.doorCloses ?? [];
        this.happy = this.entityImages[currentEntity]?.happy ?? [];
        this.standUp = this.entityImages[currentEntity]?.standUp ?? [];
        this.swingToMusic = this.entityImages[currentEntity]?.swingToMusic ?? [];
        this.burningFire = this.entityImages[currentEntity]?.burningFire ?? [];
        this.fireGoesOn = this.entityImages[currentEntity]?.fireGoesOn ?? [];
        this.fireGoesOut = this.entityImages[currentEntity]?.fireGoesOut ?? [];
        this.findsPeace = this.entityImages[currentEntity]?.findsPeace || [];
        this.findsPeaceLoop = this.entityImages[currentEntity]?.findsPeaceLoop ?? [];
        this.sleep = this.entityImages[currentEntity]?.sleep ?? [];
        this.portrait = this.entityImages[currentEntity]?.portrait ?? [];
        this.walkWithStone = this.entityImages[currentEntity]?.walkWithStone ?? [];
        this.idleWithStone = this.entityImages[currentEntity]?.idleWithStone ?? [];
        this.stoneActivated = this.entityImages[currentEntity]?.stoneActivated ?? [];
        this.broken = this.entityImages[currentEntity]?.broken ?? [];
        this.spiritCuddle = this.entityImages[currentEntity]?.spiritCuddle ?? [];
        this.spiritCuddleLoop = this.entityImages[currentEntity]?.spiritCuddleLoop ?? [];
    }

    fade(direction = "in", timestamp, duration = 1000) {
        this.fading = direction;
        this.fadeStart = timestamp;
        this.fadeDuration = duration;
        this.opacity = direction === "in" ? 0 : 1;
    }

    fadeIn(timestamp, duration = 1000) {
        this.fade("in", timestamp, duration);
    }

    fadeOut(timestamp, duration = 1000) {
        this.fade("out", timestamp, duration);
    }

    updateFade(timestamp) {
        if (!this.fading) return;

        const elapsed = timestamp - this.fadeStart;
        const t = Math.min(elapsed / this.fadeDuration, 1);

        this.opacity = this.fading === "in" ? t : 1 - t;

        if (t >= 1) {
            this.fading = null;
        }
    }

    updateState(timestamp) {
        this.updateAnimationState();
        this.updateDeltaTime(timestamp);
        this.handleMovement();
        this.updateAnimation(timestamp);
    }

    updateAnimationState(state, frameInterval = 1000 / 5.5) {
        switch (state) {
            case 'idle':
                this.setAnimation('idle');
                this.frameInterval = frameInterval;
                break;
            case 'walk':
                this.setAnimation('walk');
                this.frameInterval = frameInterval;
                break;
            case 'controlled':
                this.setAnimation('controlled');
                this.frameInterval = frameInterval;
                break;
            case 'love':
                this.setAnimation('love');
                this.frameInterval = frameInterval;
                break;
            case 'eat':
                this.setAnimation('eat');
                this.frameInterval = frameInterval;
                break;
            case 'flyUp':
                this.setAnimation('flyUp');
                this.frameInterval = frameInterval;
                break;
            case 'fly':
                this.setAnimation('fly');
                this.frameInterval = frameInterval;
                break;
            case 'afraid':
                this.setAnimation('afraid');
                this.frameInterval = frameInterval;
                break;
            case 'halfSizeFly':
                this.setAnimation('halfSizeFly');
                this.frameInterval = frameInterval;
                break;
            case 'idleOpen':
                this.setAnimation('idleOpen');
                this.frameInterval = frameInterval;
                break;
            case 'doorOpens':
                if (this.currentAnimation !== 'idleOpen') {
                    this.setAnimation('doorOpens');
                    this.frameInterval = frameInterval;
                }
                break;
            case 'doorCloses':
                if (this.currentAnimation !== 'idle') {
                    this.setAnimation('doorCloses');
                    this.frameInterval = frameInterval;
                }
                break;
            case 'happy':
                this.setAnimation('happy');
                this.frameInterval = frameInterval;
                break;
            case 'standUp':
                this.setAnimation('standUp');
                this.frameInterval = frameInterval;
                break;
            case 'swingToMusic':
                this.setAnimation('swingToMusic');
                this.frameInterval = frameInterval;
                break;
            case 'burningFire':
                this.setAnimation('burningFire');
                this.frameInterval = frameInterval;
                break;
            case 'fireGoesOn':
                if (this.currentAnimation !== 'burningFire') {
                    this.setAnimation('fireGoesOn');
                    this.frameInterval = frameInterval;
                }
                break;
            case 'fireGoesOut':
                this.setAnimation('fireGoesOut');
                this.frameInterval = frameInterval;
                break;
            case 'findsPeace':
                if (this.currentAnimation !== 'findsPeaceLoop') {
                    this.setAnimation('findsPeace');
                    this.frameInterval = frameInterval;
                }
                break;
            case 'sleep':
                this.setAnimation('sleep');
                this.frameInterval = frameInterval;
                break;
            case 'portrait':
                this.setAnimation('portrait');
                this.frameInterval = frameInterval;
                break;
            case 'walkWithStone':
                this.setAnimation('walkWithStone');
                this.frameInterval = frameInterval;
                break;
            case 'idleWithStone':
                this.setAnimation('idleWithStone');
                this.frameInterval = frameInterval;
                break;
            case 'stoneActivated':
                if (this.currentAnimation !== 'idleWithStone') {
                    this.setAnimation('stoneActivated');
                    this.frameInterval = frameInterval;
                }
                break;
            case 'broken':
                this.setAnimation('broken');
                this.frameInterval = frameInterval;
                break;
            case 'spiritCuddle':
                if (this.currentAnimation !== 'spiritCuddleLoop') {
                    this.setAnimation('spiritCuddle');
                    this.frameInterval = frameInterval;
                }
                break;

        }
    }

    updateDeltaTime(timestamp) {
        if (!this.lastUpdateTime) this.lastUpdateTime = timestamp;
        const deltaTime = (timestamp - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = timestamp;
        this.movementSpeed = this.speedX * deltaTime * 60;
    }

    /**
     * Handles horizontal movement based on direction flags.
     */
    handleMovement() {
        if (this.isMovingLeft) return this.moveLeft();
        if (this.isMovingRight) return this.moveRight();
    }

    /**
     * Moves the object to the left.
     */
    moveLeft() {
        // this.isFlipped = false;
        if (this.x > 0) {
            this.x -= this.movementSpeed;
        }
    }

    /**
     * Moves the object to the right.
     */
    moveRight() {
        // this.isFlipped = true;
        this.x += this.movementSpeed;
    }

    updateAnimation(timestamp) {
        if (!this.lastFrameTime) this.lastFrameTime = timestamp;
        const deltaTime = timestamp - this.lastFrameTime;

        if (deltaTime > this.frameInterval) {
            const anim = this.getAnimationImages(this.currentAnimation);
            if (!anim) return;

            // 🔹 Einzelbilder
            if (Array.isArray(anim)) {
                if (anim.length === 0) return;
                this.applyNextFrame(anim);
                this.frameIndex++;

                // One-Shot für Arrays
                if (
                    this.frameIndex >= anim.length &&
                    this.isOneShotAnimation(this.currentAnimation)
                ) {
                    this.animationFinished = true;
                    this.handlePostAnimation(this.currentAnimation);
                }
            }

            else if (anim.type === 'sheetSequence') {
                const currentSheet = anim.sheets[this.sheetIndex];

                this.applyNextSheetFrame(currentSheet);
                this.frameIndex++;

                const def =
                    currentSheet.meta.animations?.[this.currentAnimation] ??
                    currentSheet.meta.animations?.default;

                const from = def?.from ?? 0;
                const to = def?.to ?? (currentSheet.meta.frames - 1);
                const count = to - from + 1;

                if (this.frameIndex >= count) {
                    this.frameIndex = 0;
                    this.sheetIndex++;

                    // Ende der Sequenz?
                    if (this.sheetIndex >= anim.sheets.length) {
                        if (anim.loop) {
                            this.sheetIndex = 0;
                        } else {
                            this.animationFinished = true;
                            this.handlePostAnimation(this.currentAnimation);
                        }
                    }
                }
            }


            // 🔹 Spritesheet
            else if (anim.type === 'sheet') {
                this.applyNextSheetFrame(anim);
                this.frameIndex++;

                const animName = anim.anim ?? this.currentAnimation;
                const def =
                    anim.meta.animations?.[animName] ??
                    anim.meta.animations?.default;

                if (def) {
                    const from = def.from ?? 0;
                    const to = def.to ?? (anim.meta.frames - 1);
                    const count = to - from + 1;

                    if (this.frameIndex >= count) {
                        if (def.loop !== false) {
                            this.frameIndex = 0;
                        } else {
                            this.animationFinished = true;
                            this.handlePostAnimation(this.currentAnimation);
                        }
                    }
                }
            }

            this.lastFrameTime = timestamp;
        }

        this.updateFade(timestamp);
    }

    getAnimationImages(state) {

        // return this[state] ?? null;

        switch (state) {
            case 'idle': return this.idle;
            case 'controlled': return this.controlled;
            case 'walk': return this.walk;
            case 'love': return this.love;
            case 'eat': return this.eat;
            case 'flyUp': return this.flyUp;
            case 'fly': return this.fly;
            case 'afraid': return this.afraid;
            case 'halfSizeFly': return this.halfSizeFly;
            case 'fullSizeFly': return this.fullSizeFly;
            case 'idleOpen': return this.idleOpen;
            case 'doorOpens': return this.doorOpens;
            case 'doorCloses': return this.doorCloses;
            case 'happy': return this.happy;
            case 'standUp': return this.standUp;
            case 'swingToMusic': return this.swingToMusic;
            case 'burningFire': return this.burningFire;
            case 'fireGoesOn': return this.fireGoesOn;
            case 'fireGoesOut': return this.fireGoesOut;
            case 'findsPeace': return this.findsPeace
            case 'findsPeaceLoop': return this.findsPeaceLoop;
            case 'sleep': return this.sleep;
            case 'portrait': return this.portrait;
            case 'walkWithStone': return this.walkWithStone;
            case 'idleWithStone': return this.idleWithStone;
            case 'stoneActivated': return this.stoneActivated;
            case 'broken': return this.broken;
            case 'spiritCuddle': return this.spiritCuddle;
            case 'spiritCuddleLoop': return this.spiritCuddleLoop;
        }
    }

    setAnimation(newAnimation) {
        if (this.currentAnimation !== newAnimation) {
            this.currentAnimation = newAnimation;
            this.frameIndex = 0;
            this.sheetIndex = 0;          // Frame-Index zurücksetzen
            this.animationFinished = false; // Flag zurücksetzen
            this.lastFrameTime = null;     // Timer zurücksetzen
        }
    }

    moveToX(targetX, {
        tolerance = 3,
        snap = true,
        speed = null,
        onArrive = null,
        moveAnimation = null,
        idleAnimation = null
    } = {}) {
        if (speed !== null && this._moveSpeedBackup === undefined) {
            this._moveSpeedBackup = this.speedX;
            this.speedX = speed;
        }
        const d = targetX - this.x;

        this.isMovingRight = d > tolerance;
        this.isMovingLeft = d < -tolerance;

        // optional Animation beim Laufen
        if ((this.isMovingLeft || this.isMovingRight) && moveAnimation) {
            this.updateAnimationState(moveAnimation);
        }

        // angekommen?
        if (Math.abs(d) <= tolerance) {
            this.isMovingRight = false;
            this.isMovingLeft = false;

            if (snap) this.x = targetX;

            if (this._moveSpeedBackup !== undefined) {
                this.speedX = this._moveSpeedBackup;
                delete this._moveSpeedBackup;
            }

            // optional Idle-Animation nach Ankunft
            if (idleAnimation) this.updateAnimationState(idleAnimation);

            onArrive?.();
            return true;
        }

        return false;
    }

    applyNextSheetFrame(sheet) {
        const { image, meta, anim } = sheet;

        const animName = anim ?? this.currentAnimation;
        const def =
            meta.animations?.[animName] ??
            meta.animations?.default;

        const from = def?.from ?? 0;
        const to = def?.to ?? (meta.frames - 1);
        const count = to - from + 1;

        const frame = from + (this.frameIndex % count);
        const col = frame % meta.columns;
        const row = Math.floor(frame / meta.columns);

        this.img = image;
        this.frameSource = {
            sx: col * meta.frameWidth,
            sy: row * meta.frameHeight,
            sw: meta.frameWidth,
            sh: meta.frameHeight
        };
    }

    isOneShotAnimation(anim) {
        return [
            'doorOpens',
            'doorCloses',
            'fireGoesOn',
            'fireGoesOut',
            'findsPeace',
            'stoneActivated',
            'broken',
            'spiritCuddle'
        ].includes(anim);
    }

    handlePostAnimation(anim) {
        switch (anim) {
            case 'doorOpens': return this.setAnimation('idleOpen');
            case 'doorCloses': return this.setAnimation('idle');
            case 'fireGoesOn': return this.setAnimation('burningFire');
            case 'fireGoesOut': return this.setAnimation('idle');
            case 'findsPeace': return this.setAnimation('findsPeaceLoop');
            case 'stoneActivated': return this.setAnimation('idleWithStone');
            case 'broken': return this.setAnimation('idle');
            case 'spiritCuddle': return this.setAnimation('spiritCuddleLoop');
        }
    }

    // Ergänzung in AnimatedEntity
    applyNextFrame(images) {
        this.img = images[this.frameIndex % images.length];
        this.frameSource = null;  // wichtig für Nicht-Sheet-Animationen
    }

}
