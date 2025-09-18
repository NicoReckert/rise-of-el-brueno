class Chicken extends MovableObject {
    speed = 0.15;
    isGameCharacter = true;
    isDead = false;

    walkImages = [
        // './assets/img/3_enemies_chicken/chicken_mutates/image_1.webp',
        './assets/img/3_enemies_chicken/chicken_mutates/image_2.webp',
        './assets/img/3_enemies_chicken/chicken_mutates/image_3.webp',
        './assets/img/3_enemies_chicken/chicken_mutates/image_4.webp',
        './assets/img/3_enemies_chicken/chicken_mutates/image_5.webp',
        './assets/img/3_enemies_chicken/chicken_mutates/image_6.webp'
    ]

    constructor() {
        super();
        super.loadImage('./assets/img/3_enemies_chicken/chicken_mutates/image_1.webp')
        this.x = 600 + Math.random() * 2000;
        this.y = 545;
        this.height = 120;
        this.widht = 120,
        this.isMovingLeft = true;
        this.speed = 0.5 + Math.random() * 0.5;
        this.offset.top = 16;
        this.offset.left = 12;
        this.offset.right = 14;
        this.offset.bottom = 10;

        this.lastFrameTime = 0;
        this.currentAnimation = 'walk';
        this.frameInterval = 1000 / 8;
        this.frameIndex = 0;
    }

    updateState() {
        if (this.isMovingLeft) {
            this.isFlipped = false;
            if (this.x > 0) {
                this.x -= this.speed;
            }
        } else if (this.isMovingRight) {
            this.isFlipped = true;
            // if (this.x < this.world.level1_end_x) {
            this.x += this.speed;
            // }
        }

        if (this.isDead) {
            this.currentAnimation = null;
            this.img.src = 'assets/img/3_enemies_chicken/chicken_mutates/dead/image_1.webp';
            this.y = 565;
            return;
        } else if (this.isMovingLeft || this.isMovingRight) {
            this.currentAnimation = 'walk';
            this.frameInterval = 1000 / 5;
        }
    }

    getAnimationImages(state) {
        switch (state) {
            case 'walk': return this.walkImages;
        }
    }

    updateAnimation(timestamp) {
        if (!this.lastFrameTime) this.lastFrameTime = timestamp;

        const deltaTime = timestamp - this.lastFrameTime;

        if (deltaTime > this.frameInterval) {
            let images = this.getAnimationImages(this.currentAnimation);

            if (images && images.length > 0) {
                this.img.src = images[this.frameIndex % images.length];
                this.frameIndex++;
                this.lastFrameTime = timestamp;
            }
        }
    }
}