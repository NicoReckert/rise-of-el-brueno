class World {

    ctx;
    canvas;
    currentScene = 'farmLevel';

    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keyboard = keyboard;
        this.listenStartButton();
        this.endbossMusic = new Audio('./assets/audio/endboss-music.mp3');

        this.lastThrowCheck = 0;
        this.throwCheckDelay = 120;

        this.lastStepCheck = 0;
        this.stepCheckDelay = 400;
        this.charakter = new Character();
        this.footStepSound = new Audio('./assets/audio/footstep-sound.mp3');
        this.jumpSound = new Audio('./assets/audio/jump-sound2.mp3');
        this.landingSound = new Audio('./assets/audio/landing-sound.mp3');
        this.camera_x = 0;

        this.lastTime = performance.now();
        this.intro = new IntroScreen(this.ctx, this.canvas);
        this.chapterSound = new Audio('./assets/audio/chapter-sound1.mp3');
        this.isChapterSoundPlayed = false;
        this.isKeysStopp = false;
    }

    startGame() {
        this.farmLevelSetup = new FarmLevelSetup(this);
        this.farmLevelController = new FarmLevelController(this.farmLevelSetup);
        this.stableLevelSetup = new StableLevelSetup(this);
        this.stableLevelController = new StableLevelController(this.stableLevelSetup, this.farmLevelSetup);
        this.townLevelSetup = new TownLevelSetup(this);
        this.townLevelController = new TownLevelController(this.townLevelSetup);
        this.setWorld();
        this.draw();
    }

    draw(timestamp) {
        this.townLevelController.update(timestamp);

        // const deltaTime = timestamp - this.lastTime;
        // this.lastTime = timestamp;
        // if (!this.intro.done) {
        //     this.intro.update(deltaTime);
        //     this.intro.draw();
        //     if (!this.isChapterSoundPlayed) {
        //         this.chapterSound.play();
        //         this.isChapterSoundPlayed = true;
        //     }
        // } else {
        // switch (this.currentScene) {

        //     case 'farmLevel':
        //         this.farmLevelController.update(timestamp);
        //         break;

        //     case 'stableLevel':
        //         this.stableLevelController.update(timestamp);
        //         break;
        // }
        requestAnimationFrame((timestamp) => {
            this.draw(timestamp);
        });
    }

    addToWorld2(object) {
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


    addToWorld(object) {
        if (!object || !object.img) return;

        const flipped = object.isFlipped ?? false;
        const flippedNPC = object.isNpcFlipped ?? false;

        if (flipped || flippedNPC) {
            this.ctx.save();
            this.ctx.scale(-1, 1);
            const drawX = Math.round(-object.x - object.width);
            const drawY = Math.round(object.y);
            this.ctx.drawImage(object.img, drawX, drawY, object.width, object.height);
            // if (!object.isGameCharakter == true) return;
            // this.ctx.beginPath();
            // this.ctx.lineWidth = '3';
            // this.ctx.strokeStyle = 'red';
            // this.ctx.rect(-object.x - object.width, object.y, object.width, object.height);
            // this.ctx.stroke();

            // this.ctx.beginPath();
            // this.ctx.lineWidth = '3';
            // this.ctx.strokeStyle = 'blue';
            // this.ctx.rect(-object.x - object.width + object.offset.left, object.y + object.offset.top, object.width - object.offset.left - object.offset.right, object.height - object.offset.top - object.offset.bottom); this.ctx.stroke();
            this.ctx.restore();
        } else {
            const drawX = Math.round(object.x);
            const drawY = Math.round(object.y);
            this.ctx.drawImage(object.img, drawX, drawY, object.width, object.height);
            // if (!object.isGameCharakter == true) return;
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
        if (!this.isKeysStopp) {
            this.charakter.isMovingLeft = false;
            this.charakter.isMovingRight = false;
            if (this.keyboard.LEFT) {
                this.charakter.isMovingLeft = true;
            }
            if (this.keyboard.RIGHT) {
                this.charakter.isMovingRight = true;
            }
            if (this.keyboard.UP && !this.charakter.isAboveGround() && !this.charakter.isFlying && !this.charakter.isJumping) {
                this.charakter.isJumping = true;
                this.charakter.speedY = 23;
                this.jumpSound.play();
            }
            if (this.keyboard.UP && this.charakter.isAboveGround() && this.charakter.isFlying) {
                this.charakter.moveUp();
            }
            if (this.keyboard.DOWN && this.charakter.isAboveGround() && this.charakter.isFlying) {
                if (this.charakter.y + 10 == 130) {
                    this.keyboard.J = false;
                    this.charakter.isFlying = false;
                    this.jetPackMusic.pause();
                    this.jetPackMusic.currentTime = 0;
                    this.jetPackSound.pause();
                    this.jetPackSound.currentTime = 0;
                    if (this.endbossMusicIsPlayed) {
                        this.playEndbossMusic("play")
                    } else {
                        this.backgroundMusic.play();
                    }
                    this.charakter.y = 130;
                    this.charakter.moveStop();
                } else {
                    this.charakter.moveDown();
                }
            }
            if (this.keyboard.J) {
                this.charakter.moveFly();
                this.backgroundMusic.pause();
                this.backgroundMusic.currentTime = 0;
                this.playEndbossMusic("stop");
                this.jetPackMusic.play();
                this.jetPackSound.play();
            }
            if (this.charakter.isDead) {
                this.charakter.animationDead();
            }
            // if (this.charakter.isHurt) {
            //     this.charakter.animationHurt();
            // }
            // else {
            //     if (this.charakter.isJumping) return;
            //     clearInterval(this.intervalJump);
            //     this.intervalJump = null;
            //     this.charakter.jumpCount = 0;
            //     if (this.charakter.isMoving) this.charakter.moveStop();
            // }
            if (this.keyboard.S && this.townLevelSetup.chickenInBasket.isIdle && !this.townLevelSetup.chickenInBasket.isReturning && !this.townLevelSetup.chickenInBasket.justLanded) {
                this.townLevelSetup.chickenInBasket.isAttack = true;
                this.townLevelSetup.chickenInBasket.isIdle = false;
                this.townLevelSetup.chickenInBasket.attackStartX = this.townLevelSetup.chickenInBasket.x;
            }

            if (this.keyboard.T && !this.farmLevelSetup.tKeyPressed) {
                this.farmLevelSetup.taskWindow.toggle();
                this.farmLevelSetup.tKeyPressed = true;
            }
            if (!this.keyboard.T) {
                this.farmLevelSetup.tKeyPressed = false;
            }
        }
    }

    setWorld() {
        this.charakter.world = this;
    }

    checkCollisions() {
        this.townLevelSetup.townLevel.enemies.forEach(element => {
            if (this.charakter.isColliding(element, 0, 0) && !element.isDead) {
                this.charakter.hit();
                this.townLevelSetup.statusBar.setPercentage(this.charakter.energy);
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

        for (let i = this.townLevelSetup.townLevel.enemies.length - 1; i >= 0; i--) {
            const enemy = this.townLevelSetup.townLevel.enemies[i];
            if (this.charakter.isJumpOn(enemy)) {
                if (enemy.isDead) continue;
                enemy.isDead = true;
                enemy.isMovingLeft = false;
                enemy.isMovingRight = false;
                this.playChickenDeathSound();
                this.charakter.bounce();
                const removeIndex = i;
                setTimeout(() => {
                    this.townLevelSetup.townLevel.enemies.splice(removeIndex, 1);
                }, 2000);
            }
        }

        for (let i = this.townLevelSetup.townLevel.coins.length - 1; i >= 0; i--) {
            const coin = this.townLevelSetup.townLevel.coins[i];
            if (this.charakter.isColliding(coin, 0, 0)) {
                this.townLevelSetup.townLevel.coins.splice(i, 1);
                // this.coinBar.percentage = this.coinBar.percentage == 100 ? this.coinBar.percentage + 0 : this.coinBar.percentage + 20;
                // document.getElementById('coin-sound').play();
                this.playCoinSound();
                this.townLevelSetup.coinBar.percentage = Math.min(this.townLevelSetup.coinBar.percentage + 20, 100);
                this.townLevelSetup.coinBar.setPercentage(this.townLevelSetup.coinBar.percentage);
            }
        }
        for (let i = this.townLevelSetup.townLevel.bottles.length - 1; i >= 0; i--) {
            const bottle = this.townLevelSetup.townLevel.bottles[i];
            if (this.charakter.isColliding(bottle, 0, 0) && this.townLevelSetup.bottleBar.percentage != 100) {
                this.townLevelSetup.townLevel.bottles.splice(i, 1);
                // this.coinBar.percentage = this.coinBar.percentage == 100 ? this.coinBar.percentage + 0 : this.coinBar.percentage + 20;
                // document.getElementById('coin-sound').play();
                this.playBottleSound();
                this.townLevelSetup.bottleBar.percentage = Math.min(this.townLevelSetup.bottleBar.percentage + 20, 100);
                this.townLevelSetup.bottleBar.setPercentage(this.townLevelSetup.bottleBar.percentage);
                this.charakter.throwableBottels != 5 ? this.charakter.throwableBottels += 1 : this.charakter.throwableBottels += 0;
            }
        }

        if (this.townLevelSetup.townLevel.endboss.y >= 690 && this.townLevelSetup.townLevel.endboss.isDead) {
            clearInterval(this.townLevelSetup.townLevel.endboss.intervalMoveDownAfterDead);
            this.townLevelSetup.townLevel.endboss.isUnderTheGround = true;
        }

        for (let i = this.townLevelSetup.throwableObjects.length - 1; i >= 0; i--) {
            const bottle = this.townLevelSetup.throwableObjects[i];

            if (!bottle.isBrokenAnimation && bottle.isBrokenAnimationDone) {
                this.townLevelSetup.throwableObjects.splice(i, 1);
                this.charakter.isThrowing = false;
                bottle.isBrokenSound = false;
                continue;
            }

            if (bottle.y + bottle.height >= 670) {
                if (!bottle.isBrokenSound) {
                    this.playBottelBrokenSound();
                    bottle.isBroken = true;
                    bottle.isThrow = false;
                    bottle.isGravity = false;
                    bottle.isBrokenAnimation = true;
                    bottle.isBrokenSound = true;
                    bottle.isMovingLeft = false;
                    bottle.isMovingRight = false;
                }
                if (!bottle.isBrokenAnimation) {
                    this.townLevelSetup.throwableObjects.splice(i, 1);
                    this.charakter.isThrowing = false;
                    bottle.isBrokenSound = false;
                }
                continue;
            }

            if (!bottle.isBrokenAnimation) {
                for (let j = 0; j < this.townLevelSetup.townLevel.enemies.length; j++) {
                    const enemy = this.townLevelSetup.townLevel.enemies[j];

                    if (bottle.isColliding(enemy, 50, 0) && !enemy.isDead) {
                        if (!bottle.isBrokenSound) {
                            this.playBottelBrokenSound();
                            bottle.isBrokenSound = true;
                            bottle.isBroken = true;
                            bottle.isThrow = false;
                            bottle.isGravity = false;
                            bottle.isBrokenAnimation = true;
                            enemy.isDead = true;
                            enemy.isMovingLeft = false;
                            enemy.isMovingRight = false;
                            this.playChickenDeathSound();
                            const removeEnemyIndex = j;
                            setTimeout(() => {
                                this.townLevelSetup.townLevel.enemies.splice(removeEnemyIndex, 1);
                            }, 2000);
                            break;
                        }
                    }
                }
                if (bottle.isColliding(this.townLevelSetup.townLevel.endboss, 0, 50) && !this.townLevelSetup.townLevel.endboss.isDead) {
                    if (!bottle.isBrokenSound) {
                        this.playBottelBrokenSound();
                        this.townLevelSetup.townLevel.endboss.isHurt = true;
                        this.townLevelSetup.townLevel.endboss.frameIndex = 0;
                        bottle.isBrokenSound = true;
                        bottle.isBroken = true;
                        bottle.isThrow = false;
                        bottle.isGravity = false;
                        bottle.isBrokenAnimation = true;
                        this.townLevelSetup.townLevel.endboss.energy = this.townLevelSetup.townLevel.endboss.energy - 20;
                        this.townLevelSetup.statusBar2.setPercentage(this.townLevelSetup.townLevel.endboss.energy);
                        if (this.townLevelSetup.townLevel.endboss.energy <= 0) {
                            this.townLevelSetup.townLevel.endboss.isDead = true;
                            this.townLevelSetup.townLevel.endboss.frameIndex = 0;
                        }
                        break;
                    }
                }

            }

        }
        if (this.charakter.x >= 1050 && this.charakter.x <= 1250) {
            if (this.endbossMusicIsPlayed || this.endbossAlarmSoundIsPlayed) return;
            document.getElementById('background-music').pause();
            console.log('wird ausgeführt');
            this.playEndbossMusic("play");
            this.playEndbossAlarmSound();
            // this.level1.endboss.animationHurt();
            this.endbossMusicIsPlayed = true;
            this.endbossAlarmSoundIsPlayed = true;
        }

        for (let j = 0; j < this.townLevelSetup.townLevel.enemies.length; j++) {
            const enemy = this.townLevelSetup.townLevel.enemies[j];
            if (this.townLevelSetup.chickenInBasket.isColliding(enemy, 25, 0) && !enemy.isDead) {
                this.townLevelSetup.chickenInBasket.isAttack = false;
                this.townLevelSetup.chickenInBasket.isIdle = true;
                enemy.isDead = true;
                enemy.isMovingLeft = false;
                enemy.isMovingRight = false;
                this.playChickenDeathSound();
                const removeEnemyIndex = j;
                setTimeout(() => {
                    this.townLevelSetup.townLevel.enemies.splice(removeEnemyIndex, 1);
                }, 2000);
                break;
            }
        }
        if (this.townLevelSetup.chickenInBasket.isColliding(this.townLevelSetup.townLevel.endboss, 0, 80) && !this.townLevelSetup.townLevel.endboss.isDead) {
            this.townLevelSetup.chickenInBasket.isAttack = false;
            this.townLevelSetup.chickenInBasket.isIdle = true;
            this.townLevelSetup.townLevel.endboss.animationHurt();
            this.townLevelSetup.townLevel.endboss.isHurt = true;
            this.townLevelSetup.townLevel.endboss.energy = this.townLevelSetup.townLevel.endboss.energy - 5;
            this.statusBar2.setPercentage(this.townLevelSetup.townLevel1.endboss.energy);
            if (this.townLevelSetup.townLevel.endboss.energy <= 0) {
                this.townLevelSetup.townLevel.endboss.isDead = true;
                this.townLevelSetup.townLevel.endboss.animationDead();
            }
        }

    }

    checkThrowObjects(timestamp) {
        if (timestamp - this.lastThrowCheck < this.throwCheckDelay) return;

        this.lastThrowCheck = timestamp;
        if (this.keyboard.D && this.charakter.throwableBottels != 0 && !this.charakter.isThrowing) {
            let bottle;
            if (!this.charakter.isFlipped) {
                bottle = new ThrowableObject(this.charakter.x + 35, this.charakter.y + 150);
                bottle.isMovingRight = true;
                bottle.isThrow = true;
                bottle.isBroken = false;
                bottle.speedY = 30;
                bottle.isGravity = true;
                bottle.charakterIsFlipped = false;
            } else {
                bottle = new ThrowableObject(this.charakter.x - 35, this.charakter.y + 150);
                bottle.isMovingLeft = true;
                bottle.isThrow = true;
                bottle.isBroken = false;
                bottle.speedY = 30;
                bottle.isGravity = true;
                bottle.charakterIsFlipped = true;
            }
            this.townLevelSetup.throwableObjects.push(bottle);
            this.playBottelThrowSound();
            this.townLevelSetup.bottleBar.percentage = Math.min(this.townLevelSetup.bottleBar.percentage - 20, 100);
            this.townLevelSetup.bottleBar.setPercentage(this.townLevelSetup.bottleBar.percentage);
            this.charakter.throwableBottels != 0 ? this.charakter.throwableBottels -= 1 : this.charakter.throwableBottels -= 0;
            this.charakter.isThrowing = true;
        } else if (this.keyboard.D && this.charakter.throwableBottels == 0) {
            this.playEmptyBottelsSound();
        }
    }

    listenStartButton() {
        document.getElementById('welcome-button').addEventListener('click', () => {
            this.startGame();
            document.getElementById('overlay-startscreen').style.display = 'none';
            document.getElementById('overlay-start-initialisation').style.display = 'none';
            document.getElementById('canvas').style.display = 'block';
            // document.getElementById('background-music').play();
            setFullscreen();
            // this.charakter.playSpeakSound();
            titleMusic.pause();
            titleMusic2.pause();
        });
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

    playEndbossMusic(state) {
        switch (state) {
            case "play":
                this.endbossMusic.play();
                break;

            case "stop":
                this.endbossMusic.pause();
                this.endbossMusic.currentTime = 0;
                break;
        }
    }

    playEndbossAlarmSound() {
        this.endbossAlarmSound = new Audio('./assets/audio/endboss-alarm.mp3');
        this.endbossAlarmSound.play();
    }

    endbossReaction() {
        const boss = this.townLevelSetup.townLevel.endboss;
        const player = this.charakter;
        const distance = Math.abs((player.x + player.width / 2) - (boss.x + boss.width / 2));

        if (distance < 200 && !boss.isDead) {
            // Wenn noch nicht springt, dann Starte den Sprung
            if (!boss.isJumping) {
                boss.speedY = 20;
                boss.isJumping = true;
            }
            if (player.x < boss.x) {
                boss.isMovingLeft = true;
                boss.isMovingRight = false;
            } else {
                boss.isMovingRight = true;
                boss.isMovingLeft = false;
            }
        } else if (distance < 500 && !boss.isDead) {
            boss.isJumping = false; // Nur laufen
            if (player.x < boss.x) {
                boss.isMovingLeft = true;
                boss.isMovingRight = false;
            } else {
                boss.isMovingRight = true;
                boss.isMovingLeft = false;
            }
        } else {
            boss.isMovingLeft = false;
            boss.isMovingRight = false;
            boss.isJumping = false;
        }
    }

    stepSoundCharakter(timestamp) {
        if (timestamp - this.lastStepCheck < this.stepCheckDelay) return;
        this.lastStepCheck = timestamp;
        if ((this.charakter.isMovingLeft || this.charakter.isMovingRight) && !this.charakter.isJumping && !this.charakter.isFlying) {
            this.footStepSound.currentTime = 0;
            this.footStepSound.play();
        }
    }

    landingSoundCharakter() {
        if (this.charakter.isLanding) {
            this.landingSound.currentTime = 0;
            this.landingSound.play();
            this.charakter.isLanding = false;
        }
    }
}