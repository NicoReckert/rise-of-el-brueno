class NotMovableNpc extends MovableObject {

    bird =
        {
            idle:
                [
                    './assets/img/npcs/bird/idle/image_1.png',
                    './assets/img/npcs/bird/idle/image_2.png',
                    './assets/img/npcs/bird/idle/image_3.png',
                    './assets/img/npcs/bird/idle/image_4.png',
                    './assets/img/npcs/bird/idle/image_5.png',
                    './assets/img/npcs/bird/idle/image_6.png',
                    './assets/img/npcs/bird/idle/image_7.png',
                    './assets/img/npcs/bird/idle/image_8.png'
                ]
        }

    cow =
        {
            idle:
                [
                    './assets/img/npcs/cow/idle/image_1.png',
                    './assets/img/npcs/cow/idle/image_2.png',
                    './assets/img/npcs/cow/idle/image_3.png',
                    './assets/img/npcs/cow/idle/image_4.png',
                    './assets/img/npcs/cow/idle/image_5.png',
                    './assets/img/npcs/cow/idle/image_6.png',
                    './assets/img/npcs/cow/idle/image_7.png',
                    './assets/img/npcs/cow/idle/image_8.png',
                    './assets/img/npcs/cow/idle/image_9.png',
                    './assets/img/npcs/cow/idle/image_10.png'
                ]
        }

    pond =
        {
            idle:
                [
                    './assets/img/npcs/pond/idle/image_1.png',
                    './assets/img/npcs/pond/idle/image_2.png',
                    './assets/img/npcs/pond/idle/image_3.png',
                    './assets/img/npcs/pond/idle/image_4.png',
                    './assets/img/npcs/pond/idle/image_5.png'
                ]
        }

    tree =
        {
            idle:
                [
                    './assets/img/npcs/tree/idle/image_2.png',
                    './assets/img/npcs/tree/idle/image_3.png',
                    './assets/img/npcs/tree/idle/image_4.png',
                    './assets/img/npcs/tree/idle/image_5.png',
                    './assets/img/npcs/tree/idle/image_6.png',
                    './assets/img/npcs/tree/idle/image_7.png',
                    './assets/img/npcs/tree/idle/image_8.png'
                ]
        }

    chicken =
        {
            idle:
                [
                    './assets/img/3_enemies_chicken/chicken_normal/4_sit/image_2.png',
                    './assets/img/3_enemies_chicken/chicken_normal/4_sit/image_3.png',
                    './assets/img/3_enemies_chicken/chicken_normal/4_sit/image_4.png',
                    './assets/img/3_enemies_chicken/chicken_normal/4_sit/image_5.png',
                    './assets/img/3_enemies_chicken/chicken_normal/4_sit/image_6.png',
                    './assets/img/3_enemies_chicken/chicken_normal/4_sit/image_7.png',
                    './assets/img/3_enemies_chicken/chicken_normal/4_sit/image_8.png',
                    './assets/img/3_enemies_chicken/chicken_normal/4_sit/image_9.png',
                    './assets/img/3_enemies_chicken/chicken_normal/4_sit/image_10.png'
                ]
        }

    allNpcs =
        {
            bird: this.bird,
            cow: this.cow,
            pond: this.pond,
            chicken: this.chicken,
            tree: this.tree
        }

    idleImages = [];

    constructor(currentNpc, height = 150, width = 150, x = 355, y = 220) {
        super();
        this.loadImgFromCurrentNpc(currentNpc);
        super.loadImage('./assets/img/3_enemies_chicken/chicken_normal/3_sit/image_3.png');
        this.height = height; // 150
        this.width = width; // 150
        this.x = x; // 355
        this.y = y; // 220
        this.lastFrameTime = 0;
        this.currentAnimation = 'idle';
        this.frameInterval = 1000 / 4;
        this.frameIndex = 0;
        this.isFlipped = true;
        this.isGameCharakter = true;
    }

    loadImgFromCurrentNpc(currentNpc) {
        this.idleImages = this.allNpcs[currentNpc].idle;
    }

    updateState() {
        this.currentAnimation = 'idle';
        this.frameInterval = 1000 / 4;
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

    getAnimationImages(state) {
        switch (state) {
            case 'idle': return this.idleImages;
        }
    }

}
