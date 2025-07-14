class Character extends MovableObject {



    standImages = [
        './assets/img/2_character_pepe/1_idle/idle/I-1.png',
        './assets/img/2_character_pepe/1_idle/idle/I-2.png',
        './assets/img/2_character_pepe/1_idle/idle/I-3.png',
        './assets/img/2_character_pepe/1_idle/idle/I-4.png',
        './assets/img/2_character_pepe/1_idle/idle/I-5.png',
        './assets/img/2_character_pepe/1_idle/idle/I-6.png',
        './assets/img/2_character_pepe/1_idle/idle/I-7.png',
        './assets/img/2_character_pepe/1_idle/idle/I-8.png',
        './assets/img/2_character_pepe/1_idle/idle/I-9.png',
        './assets/img/2_character_pepe/1_idle/idle/I-10.png'
    ]

    walkImages = [
        './assets/img/2_character_pepe/2_walk/W-21.png',
        './assets/img/2_character_pepe/2_walk/W-22.png',
        './assets/img/2_character_pepe/2_walk/W-23.png',
        './assets/img/2_character_pepe/2_walk/W-24.png',
        './assets/img/2_character_pepe/2_walk/W-25.png',
        './assets/img/2_character_pepe/2_walk/W-26.png'
    ]

    jumpImages = [
        './assets/img/2_character_pepe/3_jump/J-31.png',
        './assets/img/2_character_pepe/3_jump/J-32.png',
        './assets/img/2_character_pepe/3_jump/J-33.png',
        './assets/img/2_character_pepe/3_jump/J-34.png',
        './assets/img/2_character_pepe/3_jump/J-35.png',
        './assets/img/2_character_pepe/3_jump/J-36.png',
        './assets/img/2_character_pepe/3_jump/J-37.png',
        './assets/img/2_character_pepe/3_jump/J-38.png',
        './assets/img/2_character_pepe/3_jump/J-39.png'
    ]

    deadImages = [
        './assets/img/2_character_pepe/5_dead/D-51.png',
        './assets/img/2_character_pepe/5_dead/D-52.png',
        './assets/img/2_character_pepe/5_dead/D-53.png',
        './assets/img/2_character_pepe/5_dead/D-54.png',
        './assets/img/2_character_pepe/5_dead/D-55.png',
        './assets/img/2_character_pepe/5_dead/D-56.png',
        './assets/img/2_character_pepe/5_dead/D-57.png'
    ]

    hurtImages = [
        './assets/img/2_character_pepe/4_hurt/H-41.png',
        './assets/img/2_character_pepe/4_hurt/H-42.png',
        './assets/img/2_character_pepe/4_hurt/H-43.png'
    ]

    jetPackImages = [
        './assets/img/Pepe_Jetpack.png'
    ]

    intervalStand = null;
    standCount = 0;
    intervalWalk = null;
    walkCount = 0;
    jumpCount = 0;
    deadCount = 0;
    hurtCount = 0;
    intervalMoveLeft = null;
    intervalMoveRight = null;
    intervalMoveUp = null;
    intervalJump = null;
    intervalDead = null;
    intervalHurt = null;
    isFlipped = false;
    isMoving = false;
    isMovingLeft = false;
    isMovingRight = false;
    isDead = false;
    isHurt = false;
    isJumping;
    isThrowing = false;
    isGameCharakter = true;
    throwableBottels = 0;



    constructor() {
        super();
        super.loadImage('./assets/img/2_character_pepe/1_idle/idle/I-1.png');
        this.height = 300;
        this.width = 130;
        this.x = 100;
        this.y = 130;
        // this.startMainLoop()
        this.offset.top = 130;
        this.offset.left = 20;
        this.offset.right = 40;
        this.offset.bottom = 15;
        this.speedX = 10;
        this.isJumping = false;

        this.lastFrameTime = 0;        // Timestamp des letzten Framewechsels
        this.currentAnimation = 'stand';
        this.frameInterval = 1000 / 2.5; // Standard: 5 FPS
        this.frameIndex = 0;

    }

    // moveLeft() {
    //     if (this.intervalMoveLeft) return;
    //     this.isFlipped = true;
    //     this.isMoving = true;
    //     // this.clearAllInterval();
    //     clearInterval(this.intervalMoveRight);
    //     clearInterval(this.intervalStand);
    //     this.intervalMoveLeft = setInterval(() => {
    //         if (this.x > 0) {
    //             this.x -= this.speedX;
    //             this.world.camera_x = -this.x + 100;
    //             // this.updateCameraSmooth();
    //         }
    //     }, 1000 / 60);
    //     if (this.isFlying || this.isJumping) return;
    //     this.animationWalk();
    // }

    // moveRight() {
    //     if (this.intervalMoveRight) return
    //     this.isFlipped = false;
    //     this.isMoving = true;
    //     // this.clearAllInterval();
    //     clearInterval(this.intervalMoveLeft);
    //     clearInterval(this.intervalStand);
    //     this.intervalMoveRight = setInterval(() => {
    //         if (this.x < this.world.level1.level_end_x) {
    //             this.x += this.speedX;
    //             this.world.camera_x = -this.x + 100;
    //             // this.updateCameraSmooth();
    //         }
    //     }, 1000 / 60);
    //     if (this.isFlying || this.isJumping) return;
    //     this.animationWalk();
    // }

    // updateCameraSmooth() {
    //     const offset = this.isFlipped ? 600 : 0;
    //     const targetX = -this.x + offset;
    //     this.world.camera_x += (targetX - this.world.camera_x) * 0.08; // je kleiner 0.1, desto weicher
    // }

    // moveUp() {
    //     if (this.intervalMoveUp) return
    //     this.isMoving = true;
    //     if (this.y > -60) {
    //         this.y -= 10;
    //     }

    // }

    // moveDown() {
    //     if (this.intervalMoveDown) return
    //     this.isMoving = true;
    //     if (this.y + 10 < 130) {
    //         this.y += 10;
    //     } else {
    //         this.isFlying = false;
    //         this.y = 130;
    //         this.moveStop();
    //     }
    // }

    // moveStop() {
    //     this.isMoving = false;
    //     this.clearAllInterval();
    //     this.animationStand();
    // }

    // moveJump() {
    //     // this.clearAllInterval();
    //     // if (this.intervalJump) return
    //     // if (this.intervalGravity) return
    //     clearInterval(this.intervalWalk);
    //     this, this.intervalWalk = null;
    //     this.isJumping = true;
    //     this.isMoving = true;
    //     this.speedY = 23;
    //     this.animationJump();
    //     this.applyGravity();

    // }

    // moveFly() {
    //     this.clearAllInterval();
    //     if (this.isFlying) return;
    //     this.isFlying = true;
    //     this.y = 120;
    //     super.loadImage(this.jetPackImages[0]);
    // }

    // clearAllInterval() {
    //     clearInterval(this.intervalMoveLeft);
    //     this.intervalMoveLeft = null;
    //     clearInterval(this.intervalMoveRight);
    //     this.intervalMoveRight = null;
    //     clearInterval(this.intervalStand);
    //     this.intervalStand = null;
    //     clearInterval(this.intervalWalk);
    //     this.intervalWalk = null;
    //     clearInterval(this.intervalJump);
    //     this.intervalJump = null;
    //     clearInterval(this.intervalDead);
    //     this.intervalDead = null;
    //     clearInterval(this.intervalHurt);
    //     this.intervalHurt = null;
    // }

    // animationStand() {
    //     if (this.intervalStand) return;
    //     this.intervalStand = setInterval(() => {
    //         let index = this.standCount % this.standImages.length;
    //         this.img.src = this.standImages[index];
    //         this.standCount++
    //     }, 400);
    // }

    // animationWalk() {
    //     if (this.intervalWalk) return;
    //     this.intervalWalk = setInterval(() => {
    //         let index = this.walkCount % this.walkImages.length;
    //         this.img.src = this.walkImages[index];
    //         this.walkCount++
    //     }, 1000 / 8);
    // }

    // animationJump() {
    //     if (this.intervalJump) return;
    //     this.intervalJump = setInterval(() => {
    //         if (this.isAboveGround() || this.speedY > 0) {
    //             let index = this.jumpCount % this.jumpImages.length;
    //             this.img.src = this.jumpImages[index];
    //             this.jumpCount++
    //         } else {
    //             this.clearAllInterval();
    //             this.isMoving = false;
    //             this.isJumping = false;
    //             this.moveStop();
    //         }
    //     }, 1000 / 9);
    // }

    // animationDead() {
    //     if (this.intervalDead) return;
    //     this.clearAllInterval();
    //     this.intervalDead = setInterval(() => {
    //         if (this.deadCount === this.deadImages.length) return;
    //         let index = this.deadCount % this.deadImages.length;
    //         this.img.src = this.deadImages[index];
    //         this.deadCount++
    //     }, 1000 / 8);
    // }

    // animationHurt() {
    //     if (this.intervalHurt) return;
    //     this.clearAllInterval();
    //     this.intervalHurt = setInterval(() => {
    //         let index = this.hurtCount % this.hurtImages.length;
    //         this.img.src = this.hurtImages[index];
    //         this.hurtCount++
    //     }, 1000 / 8);
    // }

    // playSpeakSound() {
    //     if (this.x == 1650) {
    //         document.getElementById('speak-sound').play();
    //     }
    // }

    bounce() {
        this.speedY = 10; // kleiner Rücksprung nach oben
    }

    updateState() {
        // 1. Bewegung (immer erlaubt, auch beim Springen)
        if (this.isMovingLeft) {
            this.isFlipped = true;
            if (this.x > 0) {
                this.x -= this.speedX;
                this.world.camera_x = -this.x + 100;
            }
        } else if (this.isMovingRight) {
            this.isFlipped = false;
            if (this.x < this.world.level1.level_end_x) {
                this.x += this.speedX;
                this.world.camera_x = -this.x + 100;
            }
        }

        // 2. Animation (nach Priorität)
        if (this.isDead) {
            this.currentAnimation = 'dead';
            this.frameInterval = 1000 / 6;
        } else if (this.isJumping) {
            this.currentAnimation = 'jump';
            this.frameInterval = 1000 / 10;
        } else if (this.isMovingLeft || this.isMovingRight) {
            this.currentAnimation = 'walk';
            this.frameInterval = 1000 / 8;
        } else {
            this.currentAnimation = 'stand';
            this.frameInterval = 1000 / 2.5;
        }
    }


    updateState2() {
        if (this.isJumping) {
            this.currentAnimation = 'jump';
            this.frameInterval = 1000 / 10; // jump: 10 FPS
            return;
        }
        if (this.isDead) {
            this.currentAnimation = 'dead';
            this.frameInterval = 1000 / 6; // dead: 6 FPS
            return;
        }
        if (this.isMovingLeft) {
            this.currentAnimation = 'walk';
            this.frameInterval = 1000 / 8; // walk: 8 FPS
            this.isFlipped = true;
            if (this.x > 0) {
                this.x -= this.speedX;
                this.world.camera_x = -this.x + 100;
            }
        } else if (this.isMovingRight) {
            this.currentAnimation = 'walk';
            this.frameInterval = 1000 / 8; // walk: 8 FPS
            this.isFlipped = false;
            if (this.x < this.world.level1.level_end_x) {
                this.x += this.speedX;
                this.world.camera_x = -this.x + 100;
            }
        }
        else {
            this.currentAnimation = 'stand';
            this.frameInterval = 1000 / 2.5; // idle: 5 FPS
        }
    }

    // updateAnimation() {
    //     this.frameTimer += 1000 / 60;

    //     if (this.frameTimer >= this.frameInterval) {
    //         let animationFrames = this.getAnimationFrames(this.currentAnimation);
    //         this.img.src = animationFrames[this.imageIndex % animationFrames.length];
    //         this.imageIndex++;
    //         this.frameTimer = 0;
    //     }
    // }

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
        }
    }


    // getAnimationFrames(name) {
    //     switch (name) {
    //         case 'stand': return this.standImages;
    //         case 'walk': return this.walkImages;
    //         case 'jump': return this.jumpImages;
    //         case 'dead': return this.deadImages;
    //         case 'hurt': return this.hurtImages;
    //         default: return [this.standImages[0]];
    //     }
    // }

    getAnimationImages(state) {
        switch (state) {
            case 'walk': return this.walkImages;
            case 'jump': return this.jumpImages;
            case 'dead': return this.deadImages;
            case 'hurt': return this.hurtImages;
            case 'stand':
            default: return this.standImages;
        }
    }
}

// this.extractFramesCentered('./assets/img/Walk.png', 128, 128, 8).then((frames) => {
//             this.walkImages = frames;
//             this.loadImage(this.walkImages[0]);
//             this.animationWalk();
//         });
// extractFramesCentered(src, frameW, frameH, count, row = 0, pad = 30) {
//         return new Promise((resolve) => {
//             const img = new Image();
//             const frames = [];
//             const canvas = document.createElement('canvas');
//             const ctx = canvas.getContext('2d');

//             canvas.width = frameW + pad * 2;
//             canvas.height = frameH;

//             img.onload = () => {
//                 for (let i = 0; i < count; i++) {
//                     ctx.clearRect(0, 0, canvas.width, canvas.height);
//                     ctx.drawImage(
//                         img,
//                         i * frameW, row * frameH,
//                         frameW, frameH,
//                         pad, 0,
//                         frameW, frameH
//                     );
//                     frames.push(canvas.toDataURL());
//                 }
//                 resolve(frames);
//             };

//             img.src = src;
//         });
//     }