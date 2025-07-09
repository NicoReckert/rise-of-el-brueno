class Endboss extends MovableObject {
    speed = 0.15;
    isGameCharakter = true;
    isDead = false;
    isUnderTheGround = false;
    idleImages =
        [
            './assets/img/4_enemie_boss_chicken/2_alert/G5.png',
            './assets/img/4_enemie_boss_chicken/2_alert/G6.png',
            './assets/img/4_enemie_boss_chicken/2_alert/G7.png',
            './assets/img/4_enemie_boss_chicken/2_alert/G8.png',
            './assets/img/4_enemie_boss_chicken/2_alert/G9.png',
            './assets/img/4_enemie_boss_chicken/2_alert/G10.png',
            './assets/img/4_enemie_boss_chicken/2_alert/G11.png',
            './assets/img/4_enemie_boss_chicken/2_alert/G12.png'
        ]
    walkImages =
        [
            './assets/img/4_enemie_boss_chicken/1_walk/G1.png',
            './assets/img/4_enemie_boss_chicken/1_walk/G2.png',
            './assets/img/4_enemie_boss_chicken/1_walk/G3.png',
            './assets/img/4_enemie_boss_chicken/1_walk/G4.png',
        ]

    deadImages =
        [
            './assets/img/4_enemie_boss_chicken/5_dead/G24.png',
            './assets/img/4_enemie_boss_chicken/5_dead/G25.png',
            './assets/img/4_enemie_boss_chicken/5_dead/G26.png'
        ]

    idleCount = 0;
    walkCount = 0;
    deadCount = 0;
    intervalIdle = null;
    intervalWalk = null;
    intervalDead = null;
    intervalMoveDownAfterDead = null;

    constructor() {
        super();
        super.loadImage('./assets/img/4_enemie_boss_chicken/2_alert/G5.png')
        this.x = 1500; //6200
        this.y = -35;
        this.width = 350;
        this.height = 500;
        this.animationIdle();
        this.offset.top = 98;
        this.offset.left = 15;
        this.offset.right = 13;
        this.offset.bottom = 14;
    }

    animation() {
        setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60);

    }

    animationIdle() {
        this.intervalIdle = setInterval(() => {
            let index = this.idleCount % this.idleImages.length;
            this.img.src = this.idleImages[index];
            this.idleCount++
        }, 1000 / 8);
    }

    animationWalk() {
        this.intervalWalk = setInterval(() => {
            let index = this.walkCount % this.walkImages.length;
            this.img.src = this.walkImages[index];
            this.walkCount++
        }, 1000 / 8);
    }

    animationDead() {
        if (this.intervalDead) return;
        clearInterval(this.intervalIdle);
        clearInterval(this.intervalWalk);
        this.intervalIdle = null;
        this.intervalWalk = null;
        this.intervalDead = setInterval(() => {
            if (this.deadCount != 3) {
                let index = this.deadCount % this.deadImages.length;
                this.img.src = this.deadImages[index];
                this.deadCount++
            } else {
                this.moveDownAfterDead();
            }
        }, 1000 / 8);
    }

    moveDownAfterDead() {
        this.intervalMoveDownAfterDead = setInterval(() => {
            clearInterval(this.intervalDead);
            this.intervalDead = null;
            this.y += 5;
        }, 1000 / 60);
    }
}