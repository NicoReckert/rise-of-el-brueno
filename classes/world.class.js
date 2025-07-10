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
    endbossMusicIsPlayed = false;
    statusBar = new LifeEnergyCharakterBar();
    statusBar2 = new LifeEnergyBossBar();
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
        this.addToWorld(this.statusBar2);
        this.addToWorld(this.coinBar);
        this.addToWorld(this.bottleBar);
        this.ctx.translate(this.camera_x, 0);
        this.addObject(this.level1.coins);
        this.addObject(this.level1.bottles);
        this.addToWorld(this.charakter);
        this.addObject(this.level1.enemies);
        if (!this.level1.endboss.isUnderTheGround) {
            this.addToWorld(this.level1.endboss);
        }
        this.addObject(this.throwableObjects);
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
            // this.ctx.beginPath();
            // this.ctx.lineWidth = '3';
            // this.ctx.strokeStyle = 'red';
            // this.ctx.rect(-object.x - object.width, object.y, object.width, object.height);
            // this.ctx.stroke();

            // this.ctx.beginPath();
            // this.ctx.lineWidth = '3';
            // this.ctx.strokeStyle = 'blue';
            // this.ctx.rect(-object.x - object.width, object.y, object.width, object.height);
            // this.ctx.stroke();
            this.ctx.restore();
        } else {
            this.ctx.drawImage(object.img, object.x, object.y, object.width, object.height);
            if (!object.isGameCharakter == true) return;
            // this.ctx.beginPath();
            // this.ctx.lineWidth = '3';
            // this.ctx.strokeStyle = 'red';
            // this.ctx.rect(object.x, object.y, object.width, object.height);
            // this.ctx.stroke();

            // this.ctx.beginPath();
            // this.ctx.lineWidth = '3';
            // this.ctx.strokeStyle = 'blue';
            // this.ctx.rect(object.x + object.offset.left, object.y + object.offset.top, object.width - object.offset.left - object.offset.right, object.height - object.offset.top - object.offset.bottom);
            // this.ctx.stroke();
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
            this.level1.enemies.forEach(element => {
                if (this.charakter.isColliding(element, 0, 0) && !element.isDead) {
                    this.charakter.hit();
                    this.statusBar.setPercentage(this.charakter.energy);
                }
                if (this.charakter.isColliding(element, 0, 0) && !this.charakter.isJumpOn(element) && !element.isDead) {
                    if (this.charakter.speedX > 0 && this.charakter.x < element.x) {
                        this.charakter.speedX = 0;
                    } else if (this.charakter.speedX < 0 && this.charakter.x > element.x) {
                        this.charakter.speedX = 0;
                    } else {
                        this.charakter.speedX = 10;
                    }
                }
            })

            // for (let i = 0; i < this.level1.enemies.length; i++) {
            //     const enemy = this.level1.enemies[i];
            //     if (this.charakter.isJumpOn(enemy)) {
            //         if(enemy.isDead) return;
            //         enemy.death(); 
            //         enemy.isDead = true;
            //         this.playChickenDeathSound();
            //         this.charakter.bounce(); 
            //         setTimeout(() => {
            //             this.level1.enemies.splice(i, 1);
            //         }, 2000);
            //     }
            // }

            for (let i = this.level1.enemies.length - 1; i >= 0; i--) {
                const enemy = this.level1.enemies[i];
                if (this.charakter.isJumpOn(enemy)) {
                    if (enemy.isDead) continue;
                    enemy.death();
                    enemy.isDead = true;
                    this.playChickenDeathSound();
                    this.charakter.bounce();
                    const removeIndex = i;
                    setTimeout(() => {
                        this.level1.enemies.splice(removeIndex, 1);
                    }, 2000);
                }
            }

            // this.level1.coins.forEach((element, index) => {
            //     if (this.charakter.isColliding(element)) {
            //         this.coinBar.percentage = this.coinBar.percentage == 100 ? this.coinBar.percentage + 0 : this.coinBar.percentage + 20;
            //         this.coinBar.setPercentage(this.coinBar.percentage);
            //         this.level1.coins.splice(index, 1);
            //     }
            // })

            for (let i = this.level1.coins.length - 1; i >= 0; i--) {
                const coin = this.level1.coins[i];
                if (this.charakter.isColliding(coin, 0, 0)) {
                    this.level1.coins.splice(i, 1);
                    // this.coinBar.percentage = this.coinBar.percentage == 100 ? this.coinBar.percentage + 0 : this.coinBar.percentage + 20;
                    // document.getElementById('coin-sound').play();
                    this.playCoinSound();
                    this.coinBar.percentage = Math.min(this.coinBar.percentage + 20, 100);
                    this.coinBar.setPercentage(this.coinBar.percentage);
                }
            }
            for (let i = this.level1.bottles.length - 1; i >= 0; i--) {
                const bottle = this.level1.bottles[i];
                if (this.charakter.isColliding(bottle, 0, 0)) {
                    this.level1.bottles.splice(i, 1);
                    // this.coinBar.percentage = this.coinBar.percentage == 100 ? this.coinBar.percentage + 0 : this.coinBar.percentage + 20;
                    // document.getElementById('coin-sound').play();
                    this.playBottleSound();
                    this.bottleBar.percentage = Math.min(this.bottleBar.percentage + 20, 100);
                    this.bottleBar.setPercentage(this.bottleBar.percentage);
                    this.charakter.throwableBottels != 5 ? this.charakter.throwableBottels += 1 : this.charakter.throwableBottels += 0;
                }
            }
            // this.level1.enemies.forEach(enemy => {
            //     if (bottle.isColliding(enemy) && !enemy.isDead) {
            //         enemy.death();
            //         enemy.isDead = true;
            //         this.playChickenDeathSound();
            //         this.level1.bottles.splice(i, 1); // Flasche zerstört
            //     }
            // });

            if (this.level1.endboss.y >= 450 && this.level1.endboss.isDead) {
                clearInterval(this.level1.endboss.intervalMoveDownAfterDead);
                this.level1.endboss.isUnderTheGround = true;
            }

            for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
                const bottle = this.throwableObjects[i];

                if (!bottle.isBrokenAnimation && bottle.isBrokenAnimationDone) {
                    this.throwableObjects.splice(i, 1);
                    this.charakter.isThrowing = false;
                    bottle.isBrokenSound = false;
                    continue;
                }

                if (bottle.y + bottle.height >= 420) {
                    if (!bottle.isBrokenSound) {
                        this.playBottelBrokenSound();
                        bottle.animationBrokenBottle();
                        clearInterval(bottle.intervalMoveBottle);
                        clearInterval(bottle.intervalGravity);
                        bottle.isBrokenSound = true;
                    }
                    if (!bottle.isBrokenAnimation) {
                        this.throwableObjects.splice(i, 1);
                        this.charakter.isThrowing = false;
                        bottle.isBrokenSound = false;
                    }
                    continue;
                }

                if (!bottle.isBrokenAnimation) {
                    for (let j = 0; j < this.level1.enemies.length; j++) {
                        const enemy = this.level1.enemies[j];

                        if (bottle.isColliding(enemy, 50, 0) && !enemy.isDead) {
                            if (!bottle.isBrokenSound) {
                                this.playBottelBrokenSound();
                                bottle.isBrokenSound = true;
                                bottle.animationBrokenBottle();
                                enemy.death();
                                enemy.isDead = true;
                                this.playChickenDeathSound();
                                clearInterval(bottle.intervalMoveBottle);
                                clearInterval(bottle.intervalGravity);
                                const removeEnemyIndex = j;
                                setTimeout(() => {
                                    this.level1.enemies.splice(removeEnemyIndex, 1);
                                }, 2000);
                                break;
                            }
                        }
                    }
                    if (bottle.isColliding(this.level1.endboss, 0, 50) && !this.level1.endboss.isDead) {
                        if (!bottle.isBrokenSound) {
                            this.playBottelBrokenSound();
                            this.level1.endboss.animationHurt();
                            this.level1.endboss.isHurt = true;
                            bottle.isBrokenSound = true;
                            bottle.animationBrokenBottle();
                            this.level1.endboss.energy = this.level1.endboss.energy - 20;
                            this.statusBar2.setPercentage(this.level1.endboss.energy);
                            clearInterval(bottle.intervalMoveBottle);
                            clearInterval(bottle.intervalGravity);
                            if (this.level1.endboss.energy <= 0) {
                                this.level1.endboss.isDead = true;
                                this.level1.endboss.animationDead();
                            }
                            break;
                        }
                    }

                }
            }
            if (this.charakter.x >= 1050 && this.charakter.x <= 1250) {
                if (this.endbossMusicIsPlayed) return;
                document.getElementById('background-music').pause();
                this.playEndbossMusic();
                this.playEndbossAlarmSound();
                this.level1.endboss.animationHurt();
                this.endbossMusicIsPlayed = true;
            }
        }, 1000 / 60);
    }

    checkThrowObjects() {
        setInterval(() => {
            if (this.keyboard.D && this.charakter.throwableBottels != 0 && !this.charakter.isThrowing) {
                let bottle;
                if (!this.charakter.isFlipped) {
                    bottle = new ThrowableObject(this.charakter.x + 35, this.charakter.y + 150);
                    bottle.charakterIsFlipped = false;
                } else {
                    bottle = new ThrowableObject(this.charakter.x - 35, this.charakter.y + 150);
                    bottle.charakterIsFlipped = true;
                }
                this.throwableObjects.push(bottle);
                this.playBottelThrowSound();
                this.bottleBar.percentage = Math.min(this.bottleBar.percentage - 20, 100);
                this.bottleBar.setPercentage(this.bottleBar.percentage);
                this.charakter.throwableBottels != 0 ? this.charakter.throwableBottels -= 1 : this.charakter.throwableBottels -= 0;
                this.charakter.isThrowing = true;
            } else if (this.keyboard.D && this.charakter.throwableBottels == 0) {
                this.playEmptyBottelsSound();
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

    playCoinSound() {
        const sound = new Audio('./assets/audio/coin2.mp3');
        sound.play();
    }

    playBottleSound() {
        const sound = new Audio('./assets/audio/bottle-clink1.mp3');
        sound.play();
    }

    playChickenDeathSound() {
        const sound = new Audio('./assets/audio/chicken-death.mp3');
        sound.play();
    }

    playEmptyBottelsSound() {
        const sound = new Audio('./assets/audio/empty-bottels2.mp3');
        sound.play();
    }

    playBottelBrokenSound() {
        const sound = new Audio('./assets/audio/bottle-shattering1.mp3');
        sound.play();
    }

    playBottelThrowSound() {
        const sound = new Audio('./assets/audio/throw2.mp3');
        sound.play();
    }

    playEndbossMusic() {
        const sound = new Audio('./assets/audio/endboss-music.mp3');
        sound.play();
    }

    playEndbossAlarmSound() {
        const sound = new Audio('./assets/audio/endboss-alarm.mp3');
        sound.play();
    }
}