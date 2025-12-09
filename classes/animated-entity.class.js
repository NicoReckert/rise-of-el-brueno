class AnimatedEntity extends MovableObject {

    constructor(entityImages, currentEntity, height = 150, width = 150, x = 355, y = 220, offsetTop = 0, offsetLeft = 0, offsetRight = 0, offsetBottom = 0) {
        super();
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
    }

    loadImgFromCurrentEntity(currentEntity) {
        this.idleImages = this.entityImages[currentEntity]?.idle || [];
        this.hypnoImages = this.entityImages[currentEntity]?.hypno || [];
        this.walkImages = this.entityImages[currentEntity]?.walk || [];
        this.walk2Images = this.entityImages[currentEntity]?.walk2 || [];
        this.loveImages = this.entityImages[currentEntity]?.love || [];
        this.eatImages = this.entityImages[currentEntity]?.eat || [];
        this.flyUpImages = this.entityImages[currentEntity]?.flyUp || [];
        this.flyImages = this.entityImages[currentEntity]?.fly || [];
        this.afraidImages = this.entityImages[currentEntity]?.afraid || [];
        this.halfSizeFlyImages = this.entityImages[currentEntity]?.halfSizeFly || [];
        this.fullSizeFlyImages = this.entityImages[currentEntity]?.fullSizeFly || [];
        this.idleOpenImages = this.entityImages[currentEntity]?.idleOpen || [];
        this.doorOpensImages = this.entityImages[currentEntity]?.doorOpens || [];
        this.doorClosesImages = this.entityImages[currentEntity]?.doorCloses || [];
        this.happyImages = this.entityImages[currentEntity]?.happy || [];
        this.standUpImages = this.entityImages[currentEntity]?.standUp || [];
        this.swingToMusicImages = this.entityImages[currentEntity]?.swingToMusic || [];
        this.burningFireImages = this.entityImages[currentEntity]?.burningFire || [];
        this.fireGoesOnImages = this.entityImages[currentEntity]?.fireGoesOn || [];
        this.fireGoesOutImages = this.entityImages[currentEntity]?.fireGoesOut || [];
        this.findsPeaceImages = this.entityImages[currentEntity]?.findsPeace || [];
        this.findsPeaceLoopImages = this.entityImages[currentEntity]?.findsPeaceLoop || [];
        this.sleepImages = this.entityImages[currentEntity]?.sleep || [];
        this.portraitImages = this.entityImages[currentEntity]?.portrait || [];
        this.walkWithStoneImages = this.entityImages[currentEntity]?.walkWithStone || [];
        this.idleWithStoneImages = this.entityImages[currentEntity]?.idleWithStone || [];
        this.stoneActivatedImages = this.entityImages[currentEntity]?.stoneActivated || [];
        this.brokenImages = this.entityImages[currentEntity]?.broken || [];
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
                this.currentAnimation = 'idle';
                this.frameInterval = frameInterval;
                break;
            case 'walk':
                this.currentAnimation = 'walk';
                this.frameInterval = frameInterval;
                break;
            case 'walk2':
                this.currentAnimation = 'walk2';
                this.frameInterval = frameInterval;
                break;
            case 'hypno':
                this.currentAnimation = 'hypno';
                this.frameInterval = frameInterval;
                break;
            case 'love':
                this.currentAnimation = 'love';
                this.frameInterval = frameInterval;
                break;
            case 'eat':
                this.currentAnimation = 'eat';
                this.frameInterval = frameInterval;
                break;
            case 'flyUp':
                this.currentAnimation = 'flyUp';
                this.frameInterval = frameInterval;
                break;
            case 'fly':
                this.currentAnimation = 'fly';
                this.frameInterval = frameInterval;
                break;
            case 'afraid':
                this.currentAnimation = 'afraid';
                this.frameInterval = frameInterval;
                break;
            case 'halfSizeFly':
                this.currentAnimation = 'halfSizeFly';
                this.frameInterval = frameInterval;
                break;
            case 'idleOpen':
                this.currentAnimation = 'idleOpen';
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
                this.currentAnimation = 'happy';
                this.frameInterval = frameInterval;
                break;
            case 'standUp':
                this.currentAnimation = 'standUp';
                this.frameInterval = frameInterval;
                break;
            case 'swingToMusic':
                this.currentAnimation = 'swingToMusic';
                this.frameInterval = frameInterval;
                break;
            case 'burningFire':
                this.currentAnimation = 'burningFire';
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
            let images = this.getAnimationImages(this.currentAnimation);

            if (images && images.length > 0) {
                this.img = images[this.frameIndex % images.length];
                // if (this.deferSizeUpdate) {
                //     if (['walk', 'walk2' ].includes(this.currentAnimation) && (this.currentEntity === 'chicken2' || this.currentEntity === 'chick')) {
                //         this.width = 158;
                //         this.height = 183;
                //         this.y = 487;
                // this.offset.top = 13;
                // this.offset.left = 33;
                // this.offset.right = 55;
                // this.offset.bottom = 15;

                // } else {
                //     this.width = 130;
                //     this.height = 300;
                //     this.y = 370;
                // this.offset.top = 130;
                // this.offset.left = 20;
                // this.offset.right = 40;
                // this.offset.bottom = 15;

                //     }
                //     this.deferSizeUpdate = false;
                // }
                this.frameIndex++;
            }
            this.lastFrameTime = timestamp;
            if (this.frameIndex >= images.length && (this.currentAnimation == 'doorOpens' || this.currentAnimation == 'doorCloses' || this.currentAnimation == 'fireGoesOn' || this.currentAnimation == 'fireGoesOut' || this.currentAnimation == 'findsPeace' || this.currentAnimation == 'stoneActivated' || this.currentAnimation == 'broken')) {
                this.animationFinished = true;
                switch (this.currentAnimation) {
                    case 'doorOpens':
                        this.setAnimation('idleOpen');
                        break;
                    case 'doorCloses':
                        this.setAnimation('idle');
                        break;
                    case 'fireGoesOn':
                        this.setAnimation('burningFire');
                        break;
                    case 'fireGoesOut':
                        this.setAnimation('idle');
                        break;
                    case 'findsPeace':
                        this.setAnimation('findsPeaceLoop');
                        break;
                    case 'stoneActivated':
                        this.setAnimation('idleWithStone');
                        break;
                    case 'broken':
                        this.setAnimation('idle');
                        break;
                }
            }
        }
        this.updateFade(timestamp);
    }

    getAnimationImages(state) {
        switch (state) {
            case 'idle': return this.idleImages;
            case 'hypno': return this.hypnoImages;
            case 'walk': return this.walkImages;
            case 'walk2': return this.walk2Images;
            case 'love': return this.loveImages;
            case 'eat': return this.eatImages;
            case 'flyUp': return this.flyUpImages;
            case 'fly': return this.flyImages;
            case 'afraid': return this.afraidImages;
            case 'halfSizeFly': return this.halfSizeFlyImages;
            case 'fullSizeFly': return this.fullSizeFlyImages;
            case 'idleOpen': return this.idleOpenImages;
            case 'doorOpens': return this.doorOpensImages;
            case 'doorCloses': return this.doorClosesImages;
            case 'happy': return this.happyImages;
            case 'standUp': return this.standUpImages;
            case 'swingToMusic': return this.swingToMusicImages;
            case 'burningFire': return this.burningFireImages;
            case 'fireGoesOn': return this.fireGoesOnImages;
            case 'fireGoesOut': return this.fireGoesOutImages;
            case 'findsPeace': return this.findsPeaceImages;
            case 'findsPeaceLoop': return this.findsPeaceLoopImages;
            case 'sleep': return this.sleepImages;
            case 'portrait': return this.portraitImages;
            case 'walkWithStone': return this.walkWithStoneImages;
            case 'idleWithStone': return this.idleWithStoneImages;
            case 'stoneActivated': return this.stoneActivatedImages;
            case 'broken': return this.brokenImages;
        }
    }

    setAnimation(newAnimation) {
        if (this.currentAnimation !== newAnimation) {
            this.currentAnimation = newAnimation;
            this.frameIndex = 0;          // Frame-Index zurücksetzen
            this.animationFinished = false; // Flag zurücksetzen
            this.lastFrameTime = null;     // Timer zurücksetzen
            this.deferSizeUpdate = true;
        }
    }

}
