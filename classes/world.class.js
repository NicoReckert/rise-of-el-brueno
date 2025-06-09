class World {
    charakter = new Character();
    ctx;
    canvas;
    camera_x = 0;
    level = level1;
    statusBar = new StatusBar();
    throwableObjects = [];
    jetPackMusic = document.getElementById('jet-pack-music');
    jetPackSound = document.getElementById('jet-pack-sound');

    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.setWorld();
        this.draw();
        this.keyboard = keyboard;
        this.checkPressKey();
        this.checkCollisions();
        this.checkThrowObjects();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // this.updateCamera();
        this.ctx.translate(this.camera_x, 0);
        this.addObject(this.level.sky);
        this.addObject(this.level.clouds);
        this.addObject(this.level.grounds);
        this.ctx.translate(-this.camera_x, 0);
        this.addToWorld(this.statusBar);
        this.ctx.translate(this.camera_x, 0);
        this.addToWorld(this.charakter);
        this.addObject(this.throwableObjects);
        this.addObject(this.level.enemies);
        this.addToWorld(this.level.endboss);
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
            if (!object.isGameCharakter == true) return;
            this.ctx.beginPath();
            this.ctx.lineWidth = '3';
            this.ctx.strokeStyle = 'red';
            this.ctx.rect(-object.x - object.width, object.y, object.width, object.height);
            this.ctx.stroke();
            this.ctx.restore();
        } else {
            this.ctx.drawImage(object.img, object.x, object.y, object.width, object.height);
            if (!object.isGameCharakter == true) return;
            this.ctx.beginPath();
            this.ctx.lineWidth = '3';
            this.ctx.strokeStyle = 'red';
            this.ctx.rect(object.x, object.y, object.width, object.height);
            this.ctx.stroke();
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
            } else if (this.keyboard.UP && !this.charakter.isAboveGround() && !this.charakter.isFlying) {
                this.charakter.moveJump();
            } else if (this.keyboard.UP && this.charakter.isAboveGround() && this.charakter.isFlying) {
                this.charakter.moveUp();
            } else if (this.keyboard.J) {
                this.charakter.moveFly();
                this.jetPackMusic.play();
                this.jetPackSound.play();
            } else if (this.charakter.isDead()) {
                this.charakter.animationDead();
            } else if (this.charakter.isHurt()) {
                this.charakter.animationHurt();
            } else {
                clearInterval(this.intervalJump);
                this.intervalJump = null;
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

    checkCollisions() {
        setInterval(() => {
            this.level.enemies.forEach(element => {
                if (this.charakter.isColliding(element)) {
                    this.charakter.hit();
                    this.statusBar.setPercentage(this.charakter.energy);
                }
            })
        }, 200);
    }

    checkThrowObjects() {
        setInterval(() => {
            if (this.keyboard.D) {
                let bottle = new ThrowableObject(this.charakter.x + 50, this.charakter.y + 200);
                this.throwableObjects.push(bottle);
            }
        }, 200);
    }
}