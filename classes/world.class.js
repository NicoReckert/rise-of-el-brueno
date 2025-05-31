class World {
    charakter = new Character();
    ctx;
    canvas;
    camera_x = 0;
    level = level1;

    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.setWorld();
        this.draw();
        this.keyboard = keyboard;
        this.checkPressKey();

    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // this.updateCamera();
        this.ctx.translate(this.camera_x, 0);
        this.addObject(this.level.sky);
        this.addObject(this.level.grounds);
        this.addToWorld(this.charakter);
        this.addObject(this.level.enemies);
        this.addToWorld(this.level.endboss);
        this.addObject(this.level.clouds);
        this.ctx.translate(-this.camera_x, 0);
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        })
    }

    addToWorld(object) {
        if (object.isFlipped) {
            this.ctx.save();
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(object.img, -object.x - object.width, object.y, object.width, object.height);
            this.ctx.restore();
        } else {
            this.ctx.drawImage(object.img, object.x, object.y, object.width, object.height);

        }
    }

    addObject(objectArray) {
        objectArray.forEach(element => {
            this.addToWorld(element);

        });
    }

    checkPressKey() {
        setInterval(() => {
            if (this.keyboard.LEFT) {
                this.charakter.moveLeft();
            } else if (this.keyboard.RIGHT) {
                this.charakter.moveRight();
            } else if (this.keyboard.UP && !this.charakter.isAboveGround()) {
                this.charakter.moveJump();
            } else {
                if (this.charakter.isMoving) this.charakter.moveStop();
            }
        }, 1000 / 60);
    }

    setWorld() {
        this.charakter.world = this;
    }

    setLevel(level) {
        this.sky = level.sky;
        this.grounds = level.grounds;
        this.enemies = level.enemies;
        this.clouds = level.clouds;
        this.endboss = level.endboss;
    }

    // updateCamera() {
    //     let target = -this.charakter.x;
    //     this.camera_x = this.lerp(this.camera_x, target, 0.1);
    // }

    // lerp(a, b, t) {
    //     return a + (b - a) * t;
    // }
}