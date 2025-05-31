class MovableObject {
    x = 120;
    y = 250;
    img;
    width = 100;
    height = 150;
    speedY = 0;
    acceleration = 2.5;
    intervalGravity = null;

    constructor() {
    }

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    applyGravity() {
        this.intervalGravity = setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    isAboveGround(){
        return this.y < 40;
    }
}