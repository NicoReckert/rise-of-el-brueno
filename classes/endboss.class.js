class Endboss extends MovableObject {
    speed = 0.15;
    idleImages = [
        'assets/img/4_enemie_boss_chicken/2_alert/G5.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G6.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G7.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G8.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G9.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G10.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G11.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G12.png'
    ]
    walkImages = [
        'assets/img/4_enemie_boss_chicken/1_walk/G1.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G2.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G3.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G4.png',
    ]

    idleCount = 0;
    walkCount = 0;

    constructor() {
        super();
        super.loadImage('assets/img/4_enemie_boss_chicken/2_alert/G5.png')
        this.x = 1200;
        this.y = -35;
        this.width = 350;
        this.height = 500;
        this.animationIdle();
    }

    animation() {
        setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60);

    }

    animationIdle() {
        setInterval(() => {
            let index = this.idleCount % this.idleImages.length;
            this.img.src = this.idleImages[index];
            this.idleCount++
        }, 1000 / 8);
    }

    animationWalk() {
        setInterval(() => {
            let index = this.walkCount % this.walkImages.length;
            this.img.src = this.walkImages[index];
            this.walkCount++
        }, 1000 / 8);
    }
}