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
    intervalStand;
    standCount = 0;
    intervalWalk = null;
    walkCount = 0;
    intervalMoveLeft = null;
    intervalMoveRight = null;
    isFlipped = false;
    isMoving = false;

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
        this.intervalMoveLeft = setInterval(() => {
            if (this.x > 0) {
                this.x -= 5;
                this.world.camera_x = -this.x + 100;
            }
        }, 1000 / 60);
        clearInterval(this.intervalMoveRight);
        this.intervalMoveRight = null;
        clearInterval(this.intervalStand);
        this.intervalStand = null;
        clearInterval(this.intervalWalk);
        this.intervalWalk = null;
        this.animationWalk();

    }

    moveRight() {
        if (this.intervalMoveRight) return
        this.isFlipped = false;
        this.isMoving = true;
        this.intervalMoveRight = setInterval(() => {
            if (this.x < this.world.level.level_end_x) {
                this.x += 5;
                this.world.camera_x = -this.x + 100;
            }
        }, 1000 / 60);
        clearInterval(this.intervalMoveLeft);
        this.intervalMoveLeft = null;
        clearInterval(this.intervalStand);
        this.intervalStand = null;
        clearInterval(this.intervalWalk);
        this.intervalWalk = null;
        this.animationWalk();
    }

    moveStop() {
        this.isMoving = false;
        clearInterval(this.intervalMoveLeft);
        this.intervalMoveLeft = null;
        clearInterval(this.intervalMoveRight);
        this.intervalMoveRight = null;
        clearInterval(this.intervalStand);
        this.intervalStand = null;
        clearInterval(this.intervalWalk);
        this.intervalWalk = null;
        this.animationStand();
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
        this.intervalWalk = setInterval(() => {
            let index = this.walkCount % this.walkImages.length;
            this.img.src = this.walkImages[index];
            this.walkCount++
        }, 1000 / 8);
    }

    jump() {

    }
}