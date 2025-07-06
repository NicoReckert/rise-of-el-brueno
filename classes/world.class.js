class World {
    charakter = new Character();
    npc1 = new Npc(1750, 130, 130, 300);
    npc2 = new Npc(2500, 170, 180, 250);
    ctx;
    canvas;
    camera_x = 0;
    level1 = level1;
    level2 = level2;
    level3 = scene2;
    statusBar = new LifeEnergyCharakterBar();
    coinBar = new CoinBar();
    bottleBar = new BottleBar();
    throwableObjects = [];
    backgroundMusic = document.getElementById('background-music');
    jetPackMusic = document.getElementById('jet-pack-music');
    jetPackSound = document.getElementById('jet-pack-sound');
    bubble = new SpeechBubble("Ich bin Brünö ein Hühnerexperte, Compadre Amigo!", this.charakter, performance.now());
    bubble2 = new SpeechBubble("Ich bin Aria und wir haben große Probleme mit motierten Hühnern", this.npc2, performance.now());
    video = document.getElementById('portal-video');
    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keyboard = keyboard;
        this.listenStartButton();
    }
    scene = 2;
    inStall = false;

    startGame() {
        this.setWorld();
        this.draw();
        this.checkPressKey();
        this.checkCollisions();
        this.checkThrowObjects();
        // this.npc2.animationStand();
        // this.npc2.isNpcFlipped = true;
    }

    draw() {
        // if (this.charakter.x == 1800) {
        //     this.scene = 3;
        //     this.charakter.x = 100;
        // } 
        // if(this.charakter.x < 5) {
        //     this.scene = 2;
        //     this.charakter.x = 1790;
        // } 
        // if (this.scene == 2) {
        //     this.scene2();
        // } else {
        //     this.scene3();
        // }
        this.scene1();
        requestAnimationFrame(() => {
            this.draw();
        })
    }

    scene1() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // this.updateCamera();
        this.ctx.translate(this.camera_x, 0);
        this.addObject(this.level1.sky);
        this.addObject(this.level1.clouds);
        this.addObject(this.level1.grounds);
        this.ctx.translate(-this.camera_x, 0);
        this.addToWorld(this.statusBar);
        this.addToWorld(this.coinBar);
        this.addToWorld(this.bottleBar);
        this.ctx.translate(this.camera_x, 0);
        this.addObject(this.level1.coins);
        this.addToWorld(this.charakter);
        this.addObject(this.throwableObjects);
        this.addObject(this.level1.enemies);
        this.addToWorld(this.level1.endboss);
        this.ctx.translate(-this.camera_x, 0);
    }

    scene1_1() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // this.updateCamera();
        this.ctx.translate(this.camera_x, 0);
        this.addObject(this.level1.sky);
        this.addObject(this.level1.clouds);
        this.addObject(this.level1.grounds);
        this.addToWorld(this.level1.towns[0]);
        this.addToWorld(this.level1.towns[1]);
        this.addToWorld(this.level1.towns[2]);
        this.addToWorld(this.level1.towns[6]);
        this.addToWorld(this.level1.towns[7]);
        this.addToWorld(this.level1.towns[8]);
        // this.ctx.drawImage(this.video, 0, 0, 1000, 480);
        // this.video.play();
        this.addToWorld(this.level1.towns[4]);
        this.ctx.translate(-this.camera_x, 0);
        this.addToWorld(this.statusBar);
        this.ctx.translate(this.camera_x, 0);
        this.addToWorld(this.npc1);
        this.addToWorld(this.npc2);
        this.addToWorld(this.charakter);
        this.addToWorld(this.level1.towns[3]);
        this.addToWorld(this.level1.towns[5]);
        if (this.charakter.x === 1650) {
            // this.drawSpeechBubble(this.ctx, "Ich bin Brünö ein Hühnerexperte, Compadre Amigo!", this.charakter);
            this.bubble.update(performance.now());
            this.bubble.draw(this.ctx);
            this.bubble2.update(performance.now());
            this.bubble2.draw(this.ctx);
        }
        this.addObject(this.throwableObjects);
        this.addObject(this.level1.enemies);
        this.addToWorld(this.level1.endboss);
        this.ctx.translate(-this.camera_x, 0);
        // let self = this;
    }

    scene2() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // this.updateCamera();
        this.ctx.translate(this.camera_x, 0);
        this.addObject(this.level2.sky);
        this.addObject(this.level2.clouds);
        this.addObject(this.level2.grounds);
        this.addToWorld(this.level2.towns[0]);
        this.addToWorld(this.level2.towns[1]);
        this.addToWorld(this.level2.towns[2]);
        this.ctx.translate(-this.camera_x, 0);
        this.addToWorld(this.statusBar);
        this.ctx.translate(this.camera_x, 0);
        this.addToWorld(this.charakter);
        this.addObject(this.throwableObjects);
        this.ctx.translate(-this.camera_x, 0);
        // let self = this;
    }

    scene3() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // this.updateCamera();
        this.ctx.translate(this.camera_x, 0);
        this.addObject(this.level3.sky);
        this.addObject(this.level3.grounds);
        this.addObject(this.level3.towns);
        this.ctx.translate(-this.camera_x, 0);
        this.addToWorld(this.statusBar);
        this.ctx.translate(this.camera_x, 0);
        this.addToWorld(this.charakter);
        this.addObject(this.throwableObjects);
        this.ctx.translate(-this.camera_x, 0);
        // let self = this;
    }

    addToWorld(object) {
        if (object.isFlipped || object.isNpcFlipped) {
            this.ctx.save();
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(object.img, -object.x - object.width, object.y, object.width, object.height);
            if (!object.isGameCharakter == true) return;
            this.ctx.beginPath();
            this.ctx.lineWidth = '3';
            this.ctx.strokeStyle = 'red';
            this.ctx.rect(-object.x - object.width, object.y, object.width, object.height);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.lineWidth = '3';
            this.ctx.strokeStyle = 'blue';
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

            this.ctx.beginPath();
            this.ctx.lineWidth = '3';
            this.ctx.strokeStyle = 'blue';
            this.ctx.rect(object.x + object.offset.left, object.y + object.offset.top, object.width - object.offset.left - object.offset.right, object.height - object.offset.top - object.offset.bottom);
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
            } else if (this.keyboard.DOWN && this.charakter.isAboveGround() && this.charakter.isFlying) {
                if (this.charakter.y + 10 == 130) {
                    this.keyboard.J = false;
                    this.charakter.isFlying = false;
                    this.jetPackMusic.pause();
                    this.jetPackMusic.currentTime = 0;
                    this.jetPackSound.pause();
                    this.jetPackSound.currentTime = 0;
                    this.backgroundMusic.play();
                    this.charakter.y = 130;
                    this.charakter.moveStop();
                } else {
                    this.charakter.moveDown();
                }
            } else if (this.keyboard.J) {
                this.charakter.moveFly();
                this.backgroundMusic.pause();
                this.backgroundMusic.currentTime = 0;
                this.jetPackMusic.play();
                this.jetPackSound.play();
            } else if (this.charakter.isDead()) {
                this.charakter.animationDead();
            } else if (this.charakter.isHurt()) {
                this.charakter.animationHurt();
            } else {
                if (this.charakter.isJumping) return;
                clearInterval(this.intervalJump);
                this.intervalJump = null;
                this.charakter.jumpCount = 0;
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
            // this.level1.enemies.forEach(element => {
            //     if (this.charakter.isColliding(element)) {
            //         this.charakter.hit();
            //         this.statusBar.setPercentage(this.charakter.energy);
            //     }
            // })
            this.level1.coins.forEach((element, index) => {
                if (this.charakter.isColliding(element)) {
                    this.coinBar.percentage = this.coinBar.percentage == 100 ? this.coinBar.percentage + 0 : this.coinBar.percentage + 20;
                    this.coinBar.setPercentage(this.coinBar.percentage);
                    this.level1.coins.splice(index, 1);
                }


        })
        // for (let i = this.level1.coins.length - 1; i >= 0; i--) {
        //     const coin = this.level1.coins[i];
        //     if (this.charakter.isColliding(coin)) {
        //         this.level1.coins.splice(i, 1);
        //                             this.coinBar.percentage = this.coinBar.percentage == 100 ? this.coinBar.percentage + 0 : this.coinBar.percentage + 20;

                // this.coinBar.percentage = Math.min(this.coinBar.percentage + 20, 100);
        //         this.coinBar.setPercentage(this.coinBar.percentage);
        //     }
        // }
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

listenStartButton() {
    document.getElementById('start-button').addEventListener('click', () => {
        this.startGame();
        document.getElementById('overlay-startscreen').style.display = 'none';
        document.getElementById('canvas').style.display = 'block';
        document.getElementById('background-music').play();
        setFullscreen();
        this.charakter.playSpeakSound();
    });
}

drawSpeechBubble(ctx, text, target) {
    const padding = 10;
    const fontSize = 16;
    const maxWidth = 200;

    ctx.font = `${fontSize}px Arial`;
    const textMetrics = ctx.measureText(text);
    const bubbleWidth = Math.min(maxWidth, textMetrics.width + padding * 2);
    const bubbleHeight = fontSize + padding * 2;

    // Position über dem Kopf des Charakters
    const x = target.x + target.width / 2 - bubbleWidth / 2;
    const y = target.y - bubbleHeight + 80; // 20px über dem Kopf

    // Sprechblasenrechteck
    ctx.beginPath();
    ctx.roundRect(x, y, bubbleWidth, bubbleHeight, 10);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.stroke();

    // Pfeil zur Figur
    ctx.beginPath();
    ctx.moveTo(target.x + target.width / 2 - 5, y + bubbleHeight);
    ctx.lineTo(target.x + target.width / 2 + 5, y + bubbleHeight);
    ctx.lineTo(target.x + target.width / 2, y + bubbleHeight + 10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Text
    ctx.fillStyle = 'black';
    ctx.fillText(text, x + padding, y + fontSize);
}
}