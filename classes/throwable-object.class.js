class ThrowableObject extends MovableObject {

    intervalThrowBottle = null;
    throwBottleCount = 0;


    throwBottleImages = [
        'assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
    ]

    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 100;
        super.loadImage('assets/img/6_salsa_bottle/salsa_bottle.png');
        this.throw();
    }

    animationThrowBottle() {
        if (this.intervalThrowBottle) return;
        this.intervalThrowBottle = setInterval(() => {
            let index = this.throwBottleCount % this.throwBottleImages.length;
            this.img.src = this.throwBottleImages[index];
            this.throwBottleCount++
        }, 1000 / 15);
    }

    throw() {
        this.speedY = 30;
        this.applyGravity();
        this.animationThrowBottle();
        setInterval(() => {
            this.x += 10;
        }, 25);
    }
}