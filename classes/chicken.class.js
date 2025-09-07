class Chicken extends MovableObject {
    speed = 0.15;
    isGameCharakter = true;
    isDead = false;

    walkImages = [
        './assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        './assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        './assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ]

    constructor() {
        super();
        super.loadImage('./assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png')
        this.x = 600 + Math.random() * 500;
        this.y = 570;
        this.height = 100;
        this.isMovingLeft = true;
        this.speed = 0.15 + Math.random() * 0.5;
        this.offset.top = 4;
        this.offset.left = 0;
        this.offset.right = 3;
        this.offset.bottom = 8;

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
            this.img.src = './assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
            return;
        } else if (this.isMovingLeft || this.isMovingRight) {
            this.currentAnimation = 'walk';
            this.frameInterval = 1000 / 8;
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