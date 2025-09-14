class Endboss extends MovableObject {
    speedX = 1;
    speedY = 0;
    isGameCharacter = true;
    isHurt = false;
    isDead = false;
    isDeadAnimationReady = false;
    isMovingLeft = false;
    isMovingRight = false;
    isJumping = false;
    isUnderTheGround = false;
    idleImages =
        [
            './assets/img/4_enemie_boss_chicken/0_idle/image_1.png',
            './assets/img/4_enemie_boss_chicken/0_idle/image_2.png',
            './assets/img/4_enemie_boss_chicken/0_idle/image_3.png',
            './assets/img/4_enemie_boss_chicken/0_idle/image_4.png',
            './assets/img/4_enemie_boss_chicken/0_idle/image_5.png',
            './assets/img/4_enemie_boss_chicken/0_idle/image_5.png',
            './assets/img/4_enemie_boss_chicken/0_idle/image_5.png',
            './assets/img/4_enemie_boss_chicken/0_idle/image_6.png',
            './assets/img/4_enemie_boss_chicken/0_idle/image_7.png',
            './assets/img/4_enemie_boss_chicken/0_idle/image_8.png',
            './assets/img/4_enemie_boss_chicken/0_idle/image_9.png',
            './assets/img/4_enemie_boss_chicken/0_idle/image_10.png',
            './assets/img/4_enemie_boss_chicken/0_idle/image_11.png',
            './assets/img/4_enemie_boss_chicken/0_idle/image_12.png'
        ]
    walkImages =
        [
            './assets/img/4_enemie_boss_chicken/1_walk/G1.png',
            './assets/img/4_enemie_boss_chicken/1_walk/G2.png',
            './assets/img/4_enemie_boss_chicken/1_walk/G3.png',
            './assets/img/4_enemie_boss_chicken/1_walk/G4.png',
        ]

    hurtImages =
        [
            './assets/img/4_enemie_boss_chicken/4_hurt/image_1.png',
            './assets/img/4_enemie_boss_chicken/4_hurt/image_2.png',
            './assets/img/4_enemie_boss_chicken/4_hurt/image_3.png',
            './assets/img/4_enemie_boss_chicken/4_hurt/image_4.png',
            './assets/img/4_enemie_boss_chicken/4_hurt/image_5.png',
            './assets/img/4_enemie_boss_chicken/4_hurt/image_6.png'
        ]

    deadImages =
        [
            './assets/img/4_enemie_boss_chicken/5_dead/image_1.png',
            './assets/img/4_enemie_boss_chicken/5_dead/image_2.png',
            './assets/img/4_enemie_boss_chicken/5_dead/image_3.png',
            './assets/img/4_enemie_boss_chicken/5_dead/image_4.png',
            './assets/img/4_enemie_boss_chicken/5_dead/image_5.png',
            './assets/img/4_enemie_boss_chicken/5_dead/image_6.png'
        ]

    intervalMoveDownAfterDead = null;

    constructor() {
        super();
        super.loadImage('./assets/img/4_enemie_boss_chicken/2_alert/G5.png')
        this.x = 6200; //6200
        this.y = 205;
        this.width = 350;
        this.height = 500;
        this.offset.top = 98;
        this.offset.left = 15;
        this.offset.right = 13;
        this.offset.bottom = 14;

        this.lastFrameTime = 0;
        this.currentAnimation = 'idle';
        this.frameInterval = 1000 / 8;
        this.frameIndex = 0;

    }

    // animation() {
    //     setInterval(() => {
    //         this.x -= this.speed;
    //     }, 1000 / 60);

    // }

    // animationIdle() {
    //     this.intervalIdle = setInterval(() => {
    //         let index = this.idleCount % this.idleImages.length;
    //         this.img.src = this.idleImages[index];
    //         this.idleCount++
    //     }, 1000 / 4);
    // }

    // animationWalk() {
    //     this.intervalWalk = setInterval(() => {
    //         let index = this.walkCount % this.walkImages.length;
    //         this.img.src = this.walkImages[index];
    //         this.walkCount++
    //     }, 1000 / 8);
    // }

    // animationHurt() {
    //     if (this.intervalHurt) return;
    //     clearInterval(this.intervalIdle);
    //     clearInterval(this.intervalWalk);
    //     this.intervalIdle = null;
    //     this.intervalWalk = null;
    //     this.isHurt = true;
    //     this.intervalHurt = setInterval(() => {
    //         if (this.hurtCount != 4) {
    //             let index = this.hurtCount % this.hurtImages.length;
    //             this.img.src = this.hurtImages[index];
    //             this.hurtCount++
    //         } else {
    //             clearInterval(this.intervalHurt);
    //             this.intervalHurt = null;
    //             this.hurtCount = 0;
    //             this.isHurt = false;
    //             if (!this.isDead) {
    //                 this.animationIdle();
    //             }
    //         }
    //     }, 1000 / 8);
    // }

    // animationDead() {
    //     if (this.intervalDead) return;
    //     clearInterval(this.intervalIdle);
    //     clearInterval(this.intervalWalk);
    //     this.intervalIdle = null;
    //     this.intervalWalk = null;
    //     this.intervalDead = setInterval(() => {
    //         if (this.isHurt) return;
    //         if (this.deadCount != 3) {
    //             let index = this.deadCount % this.deadImages.length;
    //             this.img.src = this.deadImages[index];
    //             this.deadCount++
    //         } else {
    //             this.moveDownAfterDead();
    //         }
    //     }, 1000 / 8);
    // }

    applyGravityBoss(timestamp) {
        if (!this.lastGravityUpdate) this.lastGravityUpdate = timestamp;

        const deltaTime = timestamp - this.lastGravityUpdate;

        if (deltaTime > this.gravityInterval) {

            if (this.isJumping || this.y < -35 || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
                if (this.y >= -35) {
                    this.y = -35;
                    this.speedY = 0;
                    this.isJumping = false;

                }
            } else {
                this.speedY = 0;
                this.isJumping = false;
            }
            this.lastGravityUpdate = timestamp;
        }
    }

    moveDownAfterDead() {
        this.intervalMoveDownAfterDead = setInterval(() => {
            clearInterval(this.intervalDead);
            this.intervalDead = null;
            this.y += 5;
        }, 1000 / 60);
    }

    updateState() {
        if (this.isDeadAnimationReady && !this.isUnderTheGround) {
            this.y += 3;
        }

        if (this.isMovingLeft) {
            this.isFlipped = false;
            if (this.x > 0) {
                this.x -= this.speedX;
            }
        } else if (this.isMovingRight) {
            this.isFlipped = true;
            // if (this.x < this.world.level1_end_x) {
            this.x += this.speedX;
            // }
        }

        if (this.isDead) {
            if (!this.isDeadAnimationReady) {
                this.currentAnimation = 'dead';
                this.frameInterval = 1000 / 8;
            } else {
                this.currentAnimation = null;
            }
            return;

        } else if (this.isHurt) {
            this.currentAnimation = 'hurt';
            this.frameInterval = 1000 / 8;
            if (this.frameIndex >= this.hurtImages.length) {
                this.isHurt = false;
                this.frameIndex = 0;
            }
        } else if (this.isJumping) {
            this.currentAnimation = 'jump';
            this.frameInterval = 1000 / 10;
        } else if (this.isMovingLeft || this.isMovingRight) {
            this.currentAnimation = 'walk';
            this.frameInterval = 1000 / 8;
        } else {
            this.currentAnimation = 'idle';
            this.frameInterval = 1000 / 8;
        }
    }

    getAnimationImages(state) {
        switch (state) {
            case 'dead': return this.deadImages;
            case 'hurt': return this.hurtImages;
            case 'jump': return this.jumpImages;
            case 'walk': return this.walkImages;
            case 'idle': return this.idleImages;
        }
    }

    updateAnimation(timestamp) {
        if (!this.lastFrameTime) this.lastFrameTime = timestamp;

        const deltaTime = timestamp - this.lastFrameTime;

        if (deltaTime > this.frameInterval) {
            let images = this.getAnimationImages(this.currentAnimation);

            if (images && images.length > 0) {
                this.img.src = images[this.frameIndex % images.length];
                this.frameIndex++;
                this.lastFrameTime = timestamp;
            }
            if (this.currentAnimation === 'dead' && this.frameIndex >= this.deadImages.length) {
                this.isDeadAnimationReady = true;
                this.frameIndex = 0;
                this.img.src = './assets/img/4_enemie_boss_chicken/5_dead/image_6.png'
            }
        }
    }
}