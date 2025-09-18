class EndbossAttack extends MovableObject {
    idleImages =
        [
            './assets/img/tornado/image_1.webp',
            './assets/img/tornado/image_2.webp',
            './assets/img/tornado/image_3.webp',
            './assets/img/tornado/image_4.webp',
            './assets/img/tornado/image_5.webp',
            './assets/img/tornado/image_6.webp',
            './assets/img/tornado/image_7.webp',
            './assets/img/tornado/image_8.webp',
            './assets/img/tornado/image_9.webp',
            './assets/img/tornado/image_10.webp'
        ]
    constructor() {
        super();
        super.loadImage('./assets/img/tornado/image_1.webp');
        this.x = 800; //6200
        this.y = 35;
        this.width = 300;
        this.height = 450;
        // this.offset.top = 98;
        // this.offset.left = 15;
        // this.offset.right = 13;
        // this.offset.bottom = 14;

        this.lastFrameTime = 0;
        this.currentAnimation = 'idle';
        this.frameInterval = 1000 / 15;
        this.frameIndex = 0;
    }

    updateState() {
        if (this.isMovingLeft) {
            this.isFlipped = false;
            if (this.x > 0) {
                this.x -= this.speedX;
            }
        } else if (this.isMovingRight) {
            this.isFlipped = true;
            this.x += this.speedX;
        } else if (this.isMovingLeft || this.isMovingRight) {
            this.currentAnimation = 'walk';
            this.frameInterval = 1000 / 8;
        } else {
            this.currentAnimation = 'idle';
            this.frameInterval = 1000 / 15;
        }
    }

    getAnimationImages(state) {
        switch (state) {
            case 'idle': return this.idleImages;
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