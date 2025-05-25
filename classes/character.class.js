class Character extends MovableObject {

    walkImages = [
        'assets/img/2_character_pepe/2_walk/W-21.png',
        'assets/img/2_character_pepe/2_walk/W-22.png',
        'assets/img/2_character_pepe/2_walk/W-23.png',
        'assets/img/2_character_pepe/2_walk/W-24.png',
        'assets/img/2_character_pepe/2_walk/W-25.png',
        'assets/img/2_character_pepe/2_walk/W-26.png'
    ]

    walkCount = 0;

    constructor() {
        super();
        super.loadImage('assets/img/2_character_pepe/2_walk/W-21.png');
        this.height = 400;
        this.width = 200;
        this.x = 10;
        this.y = 40;
        this.animationWalk();
    }

    animationWalk() {
        setInterval(() => {
            this.walkCount >= 6 ? this.walkCount = 0 : this.walkCount;
            this.img.src = this.walkImages[this.walkCount];
            this.walkCount++
        }, 1000 / 8);
    }

    jump() {

    }
}