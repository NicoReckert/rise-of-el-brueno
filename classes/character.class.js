class Character extends MovableObject {
    standImages = [
        'assets/img/2_character_pepe/1_idle/idle/I-1.png',
        'assets/img/2_character_pepe/1_idle/idle/I-2.png',
        'assets/img/2_character_pepe/1_idle/idle/I-3.png',
        'assets/img/2_character_pepe/1_idle/idle/I-4.png',
        'assets/img/2_character_pepe/1_idle/idle/I-5.png',
        'assets/img/2_character_pepe/1_idle/idle/I-6.png',
        'assets/img/2_character_pepe/1_idle/idle/I-7.png',
        'assets/img/2_character_pepe/1_idle/idle/I-8.png',
        'assets/img/2_character_pepe/1_idle/idle/I-9.png',
        'assets/img/2_character_pepe/1_idle/idle/I-10.png'
    ]

    walkImages = [
        'assets/img/2_character_pepe/2_walk/W-21.png',
        'assets/img/2_character_pepe/2_walk/W-22.png',
        'assets/img/2_character_pepe/2_walk/W-23.png',
        'assets/img/2_character_pepe/2_walk/W-24.png',
        'assets/img/2_character_pepe/2_walk/W-25.png',
        'assets/img/2_character_pepe/2_walk/W-26.png'
    ]

    jumpImages = [
        'assets/img/2_character_pepe/3_jump/J-31.png',
        'assets/img/2_character_pepe/3_jump/J-32.png',
        'assets/img/2_character_pepe/3_jump/J-33.png',
        'assets/img/2_character_pepe/3_jump/J-34.png',
        'assets/img/2_character_pepe/3_jump/J-35.png',
        'assets/img/2_character_pepe/3_jump/J-36.png',
        'assets/img/2_character_pepe/3_jump/J-37.png',
        'assets/img/2_character_pepe/3_jump/J-38.png',
        'assets/img/2_character_pepe/3_jump/J-39.png'
    ]

    deadImages = [
        'assets/img/2_character_pepe/5_dead/D-51.png',
        'assets/img/2_character_pepe/5_dead/D-52.png',
        'assets/img/2_character_pepe/5_dead/D-53.png',
        'assets/img/2_character_pepe/5_dead/D-54.png',
        'assets/img/2_character_pepe/5_dead/D-55.png',
        'assets/img/2_character_pepe/5_dead/D-56.png',
        'assets/img/2_character_pepe/5_dead/D-57.png'
    ]

    hurtImages = [
        'assets/img/2_character_pepe/4_hurt/H-41.png',
        'assets/img/2_character_pepe/4_hurt/H-42.png',
        'assets/img/2_character_pepe/4_hurt/H-43.png'
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
    intervalJump = null;
    intervalDead = null;
    intervalHurt = null;
    isFlipped = false;
    isMoving = false;
    isJumping = false;
    isGameCharakter = true;

    constructor() {
        super();
        super.loadImage('assets/img/2_character_pepe/1_idle/idle/I-1.png');
        this.height = 400;
        this.width = 200;
        this.x = 100;
        this.y = 40;
        this.animationStand();
    }

    moveLeft() {
        if (this.intervalMoveLeft) return;
        this.isFlipped = true;
        this.isMoving = true;
        this.clearAllInterval();
        this.intervalMoveLeft = setInterval(() => {
            if (this.x > 0) {
                this.x -= 5;
                this.world.camera_x = -this.x + 100;
            }
        }, 1000 / 60);
        this.animationWalk();
    }

    moveRight() {
        if (this.intervalMoveRight) return
        this.isFlipped = false;
        this.isMoving = true;
        this.clearAllInterval();
        this.intervalMoveRight = setInterval(() => {
            if (this.x < this.world.level.level_end_x) {
                this.x += 5;
                this.world.camera_x = -this.x + 100;
            }
        }, 1000 / 60);
        this.animationWalk();
    }

    moveStop() {
        this.isMoving = false;
        this.clearAllInterval();
        this.animationStand();
    }

    moveJump() {
        this.clearAllInterval();
        if (this.intervalJump) return
        if (this.intervalGravity) return
        console.log('ausgeführt');
        this.isMoving = true;
        this.speedY = 30;
        this.animationJump();
        this.applyGravity();
    }

    clearAllInterval() {
        clearInterval(this.intervalMoveLeft);
        this.intervalMoveLeft = null;
        clearInterval(this.intervalMoveRight);
        this.intervalMoveRight = null;
        clearInterval(this.intervalStand);
        this.intervalStand = null;
        clearInterval(this.intervalWalk);
        this.intervalWalk = null;
        clearInterval(this.intervalJump);
        this.intervalJump = null;
        clearInterval(this.intervalDead);
        this.intervalDead = null;
        clearInterval(this.intervalHurt);
        this.intervalHurt = null;
    }

    animationStand() {
        if (this.intervalStand) return;
        this.intervalStand = setInterval(() => {
            let index = this.standCount % this.standImages.length;
            this.img.src = this.standImages[index];
            this.standCount++
        }, 400);
    }

    animationWalk() {
        if (this.intervalWalk) return;
        this.intervalWalk = setInterval(() => {
            let index = this.walkCount % this.walkImages.length;
            this.img.src = this.walkImages[index];
            this.walkCount++
        }, 1000 / 8);
    }

    animationJump() {
        if (this.intervalJump) return;
        this.intervalJump = setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                let index = this.jumpCount % this.jumpImages.length;
                this.img.src = this.jumpImages[index];
                this.jumpCount++
            } else {
                this.isMoving = false;
                this.moveStop();
            }
        }, 1000 / 8);
    }

    animationDead() {
        if (this.intervalDead) return;
        this.clearAllInterval();
        this.intervalDead = setInterval(() => {
            if (this.deadCount === this.deadImages.length) return;
            let index = this.deadCount % this.deadImages.length;
            this.img.src = this.deadImages[index];
            this.deadCount++
        }, 1000 / 8);
    }

    animationHurt() {
        if (this.intervalHurt) return;
        this.clearAllInterval();
        this.intervalHurt = setInterval(() => {
            let index = this.hurtCount % this.hurtImages.length;
            this.img.src = this.hurtImages[index];
            this.hurtCount++
        }, 1000 / 8);
    }
}

// this.extractFramesCentered('assets/img/Walk.png', 128, 128, 8).then((frames) => {
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