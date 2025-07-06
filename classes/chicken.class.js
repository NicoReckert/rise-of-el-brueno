class Chicken extends MovableObject {
    speed = 0.15;
    isGameCharakter = true;
    isDead = false;
    
    walkImages = [
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ]

    walkCount = 0;
    intervalMoveLeft = null;
    intervalWalkAnimation = null;

    constructor() {
        super();
        super.loadImage('assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png')
        this.x = 200 + Math.random() * 500;
        this.y = 330;
        this.height = 100;
        this.animation();
        this.animationWalk();
        this.speed = 0.15 + Math.random() * 0.5;
        this.offset.top = 4;
        this.offset.left = 0;
        this.offset.right = 3;
        this.offset.bottom = 8;
    }

    animation() {
        this.intervalMoveLeft = setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60);

    }

    animationWalk() {
        this.intervalWalkAnimation = setInterval(() => {
            let index = this.walkCount % this.walkImages.length;
            this.img.src = this.walkImages[index];
            this.walkCount++
        }, 1000 / 8);
    }

    death() {
        clearInterval(this.intervalMoveLeft);
        this.intervalMoveLeft = null;
        clearInterval(this.intervalWalkAnimation);
        this.intervalWalkAnimation = null;
        this.img.src = 'assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    }

    eat() {

    }
}