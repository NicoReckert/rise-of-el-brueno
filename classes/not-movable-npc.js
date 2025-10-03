class NotMovableNpc extends MovableObject {
    idleImages = [];
    hypnoImages = [];
    walkImages = [];
    walk2Images = [];
    loveImages = [];
    love2Images = [];
    eatImages = [];
    flyUpImages = [];
    afraidImages = [];
    halfSizeFlyImages = [];
    fullSizeFlyImages = [];
    idleOpenImages = [];
    doorOpensImages = [];
    doorClosesImages = [];
    happyImages = [];
    standUpImages = [];
    swingToMusicImages = [];
    burningFireImages = [];
    fireGoesOnImages = [];
    fireGoesOutImages = [];
    findsPeaceImages = [];
    findsPeaceLoopImages = [];
    sleepImages = [];
    portraitImages = [];

    constructor(npcImages, currentNpc, height = 150, width = 150, x = 355, y = 220, offsetTop = 0, offsetLeft = 0, offsetRight = 0, offsetBottom = 0) {
        super();
        this.npcImages = npcImages;
        this.currentNpc = currentNpc;
        this.loadImgFromCurrentNpc(currentNpc);
        // super.loadImage(this.idleImages[0]);
        this.height = height; // 150
        this.width = width; // 150
        this.x = x; // 355
        this.y = y; // 220
        this.lastFrameTime = 0;
        this.currentAnimation = 'idle';
        this.frameInterval = 1000 / 5.5;
        this.frameIndex = 0;
        this.isFlipped = true;
        this.isGameCharacter = true;
        this.offset.top = offsetTop;
        this.offset.left = offsetLeft;
        this.offset.right = offsetRight;
        this.offset.bottom = offsetBottom;


        this.opacity = 1;
        this.fading = null; // "in" | "out" | null
        this.fadeStart = null;
        this.fadeDuration = 1000;

    }

    loadImgFromCurrentNpc(currentNpc) {
        this.idleImages = this.npcImages[`${currentNpc}_idle`] || [];
        this.hypnoImages = this.npcImages[`${currentNpc}_hypno`] || [];
        this.walkImages = this.npcImages[`${currentNpc}_walk`] || [];
        this.walk2Images = this.npcImages[`${currentNpc}_walk2`] || [];
        this.loveImages = this.npcImages[`${currentNpc}_love`] || [];
        this.love2Images = this.npcImages[`${currentNpc}_love2`] || [];
        this.eatImages = this.npcImages[`${currentNpc}_eat`] || [];
        this.flyUpImages = this.npcImages[`${currentNpc}_flyUp`] || [];
        this.afraidImages = this.npcImages[`${currentNpc}_afraid`] || [];
        this.halfSizeFlyImages = this.npcImages[`${currentNpc}_halfSizeFly`] || [];
        this.fullSizeFlyImages = this.npcImages[`${currentNpc}_fullSizeFly`] || [];
        this.idleOpenImages = this.npcImages[`${currentNpc}_idleOpen`] || [];
        this.doorOpensImages = this.npcImages[`${currentNpc}_doorOpens`] || [];
        this.doorClosesImages = this.npcImages[`${currentNpc}_doorCloses`] || [];
        this.happyImages = this.npcImages[`${currentNpc}_happy`] || [];
        this.standUpImages = this.npcImages[`${currentNpc}_standUp`] || [];
        this.swingToMusicImages = this.npcImages[`${currentNpc}_swingToMusic`] || [];
        this.burningFireImages = this.npcImages[`${currentNpc}_burningFire`] || [];
        this.fireGoesOnImages = this.npcImages[`${currentNpc}_fireGoesOn`] || [];
        this.fireGoesOutImages = this.npcImages[`${currentNpc}_fireGoesOut`] || [];
        this.findsPeaceImages = this.npcImages[`${currentNpc}_findsPeace`] || [];
        this.findsPeaceLoopImages = this.npcImages[`${currentNpc}_findsPeaceLoop`] || [];
        this.sleepImages = this.npcImages[`${currentNpc}_sleep`] || [];
        this.portraitImages = this.npcImages[`${currentNpc}_portrait`] || [];

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



    updateState(state, frameInterval = 1000 / 5.5) {
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
            case 'love2':
                this.currentAnimation = 'love2';
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
        }

    }

    updateAnimation(timestamp) {
        if (!this.lastFrameTime) this.lastFrameTime = timestamp;
        const deltaTime = timestamp - this.lastFrameTime;

        if (deltaTime > this.frameInterval) {
            let images = this.getAnimationImages(this.currentAnimation);

            if (images && images.length > 0) {
                this.img = images[this.frameIndex % images.length];
                // if (this.deferSizeUpdate) {
                //     if (['walk', 'walk2' ].includes(this.currentAnimation) && (this.currentNpc === 'chicken2' || this.currentNpc === 'chick')) {
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
            if (this.frameIndex >= images.length && (this.currentAnimation == 'doorOpens' || this.currentAnimation == 'doorCloses' || this.currentAnimation == 'fireGoesOn' || this.currentAnimation == 'fireGoesOut' || this.currentAnimation == 'findsPeace')) {
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
            case 'love2': return this.love2Images;
            case 'eat': return this.eatImages;
            case 'flyUp': return this.flyUpImages;
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
