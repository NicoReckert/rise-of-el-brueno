class Chicken extends MovableObject {
    walkImages = [
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ]

    walkCount = 0;

    constructor() {
        super();
        super.loadImage('assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png')
        this.x = 200 + Math.random() * 500;
        this.y = 330;
        this.height = 100;
        this.animation();
        this.animationWalk();
    }

    animation() {
        setInterval(() => {
            this.x -= 0.3;
        }, 1000 / 60);

    }

    animationWalk() {
        setInterval(() => {
            this.walkCount >= 3 ? this.walkCount = 0 : this.walkCount;
            this.img.src = this.walkImages[this.walkCount];
            this.walkCount++
        }, 1000 / 8);
    }

    eat() {

    }
}