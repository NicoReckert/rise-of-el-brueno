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

    drohne =
        {
            idle:
                [
                    './assets/img/drohne/image_1.png',
                    './assets/img/drohne/image_2.png',
                    './assets/img/drohne/image_3.png',
                    './assets/img/drohne/image_4.png',
                    './assets/img/drohne/image_5.png',
                    './assets/img/drohne/image_6.png',
                    './assets/img/drohne/image_7.png',
                    './assets/img/drohne/image_8.png',
                    './assets/img/drohne/image_9.png',
                    './assets/img/drohne/image_10.png'
                ],

                hypno:
                [
                    // './assets/img/drohne/hypno/image_1.png',
                    // './assets/img/drohne/hypno/image_2.png',
                    './assets/img/drohne/hypno/image_3.png',
                    './assets/img/drohne/hypno/image_4.png',
                    './assets/img/drohne/hypno/image_5.png',
                    './assets/img/drohne/hypno/image_6.png',
                    './assets/img/drohne/hypno/image_7.png',
                    './assets/img/drohne/hypno/image_8.png',
                    './assets/img/drohne/hypno/image_9.png',
                    './assets/img/drohne/hypno/image_10.png',
                    './assets/img/drohne/hypno/image_11.png',
                    './assets/img/drohne/hypno/image_12.png',
                    './assets/img/drohne/hypno/image_13.png',
                    './assets/img/drohne/hypno/image_14.png',
                    './assets/img/drohne/hypno/image_15.png',
                    './assets/img/drohne/hypno/image_16.png',
                    './assets/img/drohne/hypno/image_17.png',
                    './assets/img/drohne/hypno/image_18.png',
                    './assets/img/drohne/hypno/image_19.png',
                    './assets/img/drohne/hypno/image_20.png'
                ]
        }




    allNpcs =
        {
            bird: this.bird,
            cow: this.cow,
            pond: this.pond,
            chicken: this.chicken,
            tree: this.tree,
            drohne: this.drohne
        }

    idleImages = [];
    hypnoImages = [];

    constructor(currentNpc, height = 150, width = 150, x = 355, y = 220) {
        super();
        this.loadImgFromCurrentNpc(currentNpc);
        super.loadImage(this.idleImages[0]);
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
        this.hypnoImages = this.allNpcs[currentNpc].hypno;
    }

    updateState() {
        this.currentAnimation = 'idle';
        this.frameInterval = 1000 / 7;
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
            case 'hypno': return this.hypnoImages;
        }
    }

}
