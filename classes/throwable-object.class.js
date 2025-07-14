class ThrowableObject extends MovableObject {

    intervalThrowBottle = null;
    intervalBrokenBottle = null;
    intervalMoveBottle = null;
    throwBottleCount = 0;
    brokenBottleCount = 0;
    isGameCharakter = true;
    isBrokenAnimation = false;
    isBrokenAnimationDone = false;
    isBrokenSound = false;
    charakterIsFlipped = false
    isMovingLeft = false;
    isMovingRight = false;

    speedY = 0;
    acceleration = 2.5;


    throwBottleImages = [
        './assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
    ]

    brokenBottleImages = [
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ]

    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 100;
        super.loadImage('./assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        // this.throw();
        this.offset.top = 14;
        this.offset.left = 10;
        this.offset.right = 10;
        this.offset.bottom = 11;

        this.lastFrameTime = 0;
        this.currentAnimation = 'throw';
        this.frameInterval = 1000 / 15;
        this.frameIndex = 0;

        this.lastGravityUpdate = 0;
        this.gravityInterval = 1000 / 10;

        this.lastMovingUpdate = 0;
        this.movingInterval = 1000 / 80;

        this.isGravity = false;
        this.lastAnimation = null;
    }

    animationThrowBottle() {
        if (this.intervalThrowBottle) return;
        this.intervalThrowBottle = setInterval(() => {
            let index = this.throwBottleCount % this.throwBottleImages.length;
            this.img.src = this.throwBottleImages[index];
            this.throwBottleCount++
        }, 1000 / 15);
    }

    animationBrokenBottle() {
        if (this.intervalBrokenBottle) return;
        clearInterval(this.intervalThrowBottle);
        this.isBrokenAnimation = true;
        this.intervalBrokenBottle = null;
        this.intervalBrokenBottle = setInterval(() => {
            if (this.brokenBottleCount < 6) {
                let index = this.brokenBottleCount % this.brokenBottleImages.length;
                this.img.src = this.brokenBottleImages[index];
                this.brokenBottleCount++
            } else {
                clearInterval(this.intervalBrokenBottle);
                this.isBrokenAnimation = false;
                this.isBrokenAnimationDone = true;
            }
        }, 1000 / 10);
    }

    // throw() {
    //     this.isGravity = true;
    //     this.speedY = 30;
    // this.applyGravity();
    // }


    updateState(timestamp) {
        if (!this.lastMovingUpdate) this.lastMovingUpdate = timestamp;

        const deltaTime = timestamp - this.lastMovingUpdate;

        if (deltaTime > this.movingInterval && !this.isBroken) {
            if (this.isMovingLeft) {
                this.x -= 10;
            } else if (this.isMovingRight) {
                this.x += 10;
            }
            this.lastMovingUpdate = timestamp;
        }

        if (this.isThrow) {
            this.currentAnimation = 'throw';
            this.frameInterval = 1000 / 15;
        } else if (this.isBroken) {
            this.currentAnimation = 'broken';
            this.frameInterval = 1000 / 10;
        }
    }

    getAnimationImages(state) {
        switch (state) {
            case 'broken': return this.brokenBottleImages;
            case 'throw': return this.throwBottleImages;
        }
    }

    updateAnimation(timestamp) {
        if (!this.lastFrameTime) this.lastFrameTime = timestamp;

        const deltaTime = timestamp - this.lastFrameTime;

        if (this.currentAnimation !== this.lastAnimation) {
            this.frameIndex = 0;
            this.lastAnimation = this.currentAnimation;
        }

        if (deltaTime > this.frameInterval) {
            let images = this.getAnimationImages(this.currentAnimation);

            if (images && images.length > 0) {
                const framePath = images[this.frameIndex % images.length];
                this.loadImage(framePath);
                this.frameIndex++;
                this.lastFrameTime = timestamp;
                console.log(this.frameIndex);
            }

            if (this.currentAnimation === 'broken' &&
                this.frameIndex >= images.length) {
                console.log('index in if: ' + this.frameIndex)
                this.isBrokenAnimation = false;
                this.isBrokenAnimationDone = true;
            }
        }
    }

    applyGravity2(timestamp) {
        if (!this.isGravity) return;
        if (!this.lastGravityUpdate) this.lastGravityUpdate = timestamp;
        const deltaTime = (timestamp - this.lastGravityUpdate) / 1000;
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY * deltaTime * 30;
                this.speedY -= this.acceleration * deltaTime * 30;
            } else {
                this.speedY = 0;
            }
            this.lastGravityUpdate = timestamp;
    }


}