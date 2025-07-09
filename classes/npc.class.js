class Npc extends MovableObject {

    standImages = [];
    walkImages = [];
    intervalStand = null;
    standCount = 0;
    isNpcFlipped = false;
    isGameCharakter = true;
    intervalWalk = null;
    walkCount = 0;
    intervalMoveLeft = null;
    isMoving = false;

    constructor(x, y, width, height) {
        super();
        super.loadImage('./assets/img/NPC-1.png');
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.extractFramesSimple('./assets/img/Girl_2/Idle.png', 128, 128, 7).then(frames => {
            this.standImages = frames;
        });
        this.extractFramesSimple('./assets/img/Girl_2/Walk.png', 128, 128, 12).then(frames => {
            this.walkImages = frames;
        });
    }

    extractFramesSimple(src, frameW, frameH, count) {
        return new Promise((resolve) => {
            const img = new Image();
            const frames = [];
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = frameW;
            canvas.height = frameH;

            img.onload = () => {
                for (let i = 0; i < count; i++) {
                    ctx.clearRect(0, 0, frameW, frameH);
                    ctx.drawImage(
                        img,
                        i * frameW, 0,           // Quelle (x, y)
                        frameW, frameH,          // Quelle (Breite, Höhe)
                        0, 0,                    // Ziel (x, y)
                        frameW, frameH           // Ziel (Breite, Höhe)
                    );
                    frames.push(canvas.toDataURL());
                }
                resolve(frames);
            };

            img.src = src;
        });
    }

    animationStand() {
        if (this.intervalStand) return;
        this.intervalStand = setInterval(() => {
            let index = this.standCount % this.standImages.length;
            this.img.src = this.standImages[index];
            this.standCount++
        }, 1000 / 6);
    }

    animationWalk() {
        if (this.intervalWalk) return;
        this.intervalWalk = setInterval(() => {
            let index = this.walkCount % this.walkImages.length;
            this.img.src = this.walkImages[index];
            this.walkCount++
        }, 1000 / 8);
    }

    moveLeft() {
        if (this.intervalMoveLeft) return;
        if (this.isMoving) return;
        this.isMoving = true;
        clearInterval(this.intervalStand);
        this.intervalMoveLeft = setInterval(() => {
            if (this.x > 1850) {
                this.x -= 5;
            }
        }, 1000 / 60);
        this.animationWalk();
    }

    moveStop() {
        this.isMoving = false;
        clearInterval(this.intervalWalk);
        clearInterval(this.intervalMoveLeft);
        this.animationStand();
    }

    walkToPosition() {
        if (this.x <= 1850) {
            this.moveStop();
            this.x = 1850;
        } else {
            this.moveLeft();
        }
    }

}