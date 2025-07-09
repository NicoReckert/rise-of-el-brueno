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
        this.throw();
        this.offset.top = 14;
        this.offset.left = 10;
        this.offset.right = 10;
        this.offset.bottom = 11;
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

    throw() {
        this.speedY = 30;
        this.applyGravity();
        this.animationThrowBottle();
        this.intervalMoveBottle = setInterval(() => {
            if (!this.charakterIsFlipped) {
                this.x += 10;
            } else {
                this.x -= 10;
            }
        }, 25);
    }
}