class World {

    ctx;
    canvas;
    currentScene = 'farmLevel';

    constructor(canvas, keyboard, characterImages, npcImages) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keyboard = keyboard;
        this.characterImages = characterImages;
        this.npcImages = npcImages;
        this.listenStartButton();
        this.endbossMusic = new Audio('./assets/audio/endboss-music.opus');

        this.lastThrowCheck = 0;
        this.throwCheckDelay = 120;

        this.lastStepCheck = 0;
        this.stepCheckDelay = 400;
        this.character = new Character(this.characterImages);
        this.footStepSound = new Audio('./assets/audio/footstep-sound.opus');
        this.jumpSound = new Audio('./assets/audio/jump-sound2.opus');
        this.landingSound = new Audio('./assets/audio/landing-sound.opus');
        this.camera_x = 0;

        this.lastTime = performance.now();
        this.intro = new IntroScreen(this.ctx, this.canvas);
        this.chapterSound = new Audio('./assets/audio/chapter-sound1.opus');
        this.isChapterSoundPlayed = false;
        this.isKeysStopp = false;
    }

    startGame() {
        this.farmLevelSetup = new FarmLevelSetup(this);
        this.farmLevelController = new FarmLevelController(this.farmLevelSetup);
        this.stableLevelSetup = new StableLevelSetup(this);
        this.stableLevelController = new StableLevelController(this.stableLevelSetup, this.farmLevelSetup);
        // this.townLevelSetup = new TownLevelSetup(this);
        // this.townLevelController = new TownLevelController(this.townLevelSetup);
        this.setWorld();
        this.draw();
    }

    draw(timestamp) {
        // this.townLevelController.update(timestamp);

        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        if (!this.intro.done) {
            this.intro.update(deltaTime);
            this.intro.draw();
            if (!this.isChapterSoundPlayed) {
                this.chapterSound.play();
                this.isChapterSoundPlayed = true;
            }
        } else {
            switch (this.currentScene) {

                case 'farmLevel':
                    this.farmLevelController.update(timestamp);
                    break;

                case 'stableLevel':
                    this.stableLevelController.update(timestamp);
                    break;
            }
        }
        requestAnimationFrame((timestamp) => {
            this.draw(timestamp);
        });
    }

    addToWorld2(object) {
        if (object.isFlipped || object.isNpcFlipped) {
            this.ctx.save();
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(object.img, -object.x - object.width, object.y, object.width, object.height);
            if (!object.isGamecharacter == true) return;
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
            if (!object.isGamecharacter == true) return;
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
            // if (!object.isGamecharacter == true) return;
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
            // if (!object.isGamecharacter == true) return;
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
            this.character.isMovingLeft = false;
            this.character.isMovingRight = false;
            if (this.keyboard.LEFT) {
                this.character.isMovingLeft = true;
            }
            if (this.keyboard.RIGHT) {
                this.character.isMovingRight = true;
            }
            if (this.keyboard.UP && !this.character.isAboveGround() && !this.character.isFlying && !this.character.isJumping) {
                this.character.isJumping = true;
                this.character.speedY = 23;
                this.jumpSound.play();
            }
            if (this.keyboard.UP && this.character.isAboveGround() && this.character.isFlying) {
                this.character.moveUp();
            }
            if (this.keyboard.DOWN && this.character.isAboveGround() && this.character.isFlying) {
                if (this.character.y + 10 == 130) {
                    this.keyboard.J = false;
                    this.character.isFlying = false;
                    this.jetPackMusic.pause();
                    this.jetPackMusic.currentTime = 0;
                    this.jetPackSound.pause();
                    this.jetPackSound.currentTime = 0;
                    if (this.endbossMusicIsPlayed) {
                        this.playEndbossMusic("play")
                    } else {
                        this.backgroundMusic.play();
                    }
                    this.character.y = 130;
                    this.character.moveStop();
                } else {
                    this.character.moveDown();
                }
            }
            if (this.keyboard.J) {
                this.character.moveFly();
                this.backgroundMusic.pause();
                this.backgroundMusic.currentTime = 0;
                this.playEndbossMusic("stop");
                this.jetPackMusic.play();
                this.jetPackSound.play();
            }
            if (this.character.isDead) {
                this.character.animationDead();
            }
            // if (this.character.isHurt) {
            //     this.character.animationHurt();
            // }
            // else {
            //     if (this.character.isJumping) return;
            //     clearInterval(this.intervalJump);
            //     this.intervalJump = null;
            //     this.character.jumpCount = 0;
            //     if (this.character.isMoving) this.character.moveStop();
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
        this.character.world = this;
    }

    checkCollisions() {
        this.townLevelSetup.townLevel.enemies.forEach(element => {
            if (this.character.isColliding(element, 0, 0) && !element.isDead) {
                this.character.hit();
                this.townLevelSetup.statusBar.setPercentage(this.character.energy);
            }
            if (this.character.isColliding(element, 0, 0) && !this.character.isJumpOn(element) && !element.isDead) {
                if (this.character.speedX > 0 && this.character.x < element.x) {
                    this.character.speedX = 0;
                } else if (this.character.speedX < 0 && this.character.x > element.x) {
                    this.character.speedX = 0;
                } else {
                    this.character.speedX = 10;
                }
            }
        })

        for (let i = this.townLevelSetup.townLevel.enemies.length - 1; i >= 0; i--) {
            const enemy = this.townLevelSetup.townLevel.enemies[i];
            if (this.character.isJumpOn(enemy)) {
                if (enemy.isDead) continue;
                enemy.isDead = true;
                enemy.isMovingLeft = false;
                enemy.isMovingRight = false;
                this.playChickenDeathSound();
                this.character.bounce();
                const removeIndex = i;
                setTimeout(() => {
                    this.townLevelSetup.townLevel.enemies.splice(removeIndex, 1);
                }, 2000);
            }
        }

        for (let i = this.townLevelSetup.townLevel.coins.length - 1; i >= 0; i--) {
            const coin = this.townLevelSetup.townLevel.coins[i];
            if (this.character.isColliding(coin, 0, 0)) {
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
            if (this.character.isColliding(bottle, 0, 0) && this.townLevelSetup.bottleBar.percentage != 100) {
                this.townLevelSetup.townLevel.bottles.splice(i, 1);
                // this.coinBar.percentage = this.coinBar.percentage == 100 ? this.coinBar.percentage + 0 : this.coinBar.percentage + 20;
                // document.getElementById('coin-sound').play();
                this.playBottleSound();
                this.townLevelSetup.bottleBar.percentage = Math.min(this.townLevelSetup.bottleBar.percentage + 20, 100);
                this.townLevelSetup.bottleBar.setPercentage(this.townLevelSetup.bottleBar.percentage);
                this.character.throwableBottels != 5 ? this.character.throwableBottels += 1 : this.character.throwableBottels += 0;
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
                this.character.isThrowing = false;
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
                    this.character.isThrowing = false;
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
        if (this.character.x >= 1050 && this.character.x <= 1250) {
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
        if (this.keyboard.D && this.character.throwableBottels != 0 && !this.character.isThrowing) {
            let bottle;
            if (!this.character.isFlipped) {
                bottle = new ThrowableObject(this.character.x + 35, this.character.y + 150);
                bottle.isMovingRight = true;
                bottle.isThrow = true;
                bottle.isBroken = false;
                bottle.speedY = 30;
                bottle.isGravity = true;
                bottle.characterIsFlipped = false;
            } else {
                bottle = new ThrowableObject(this.character.x - 35, this.character.y + 150);
                bottle.isMovingLeft = true;
                bottle.isThrow = true;
                bottle.isBroken = false;
                bottle.speedY = 30;
                bottle.isGravity = true;
                bottle.characterIsFlipped = true;
            }
            this.townLevelSetup.throwableObjects.push(bottle);
            this.playBottelThrowSound();
            this.townLevelSetup.bottleBar.percentage = Math.min(this.townLevelSetup.bottleBar.percentage - 20, 100);
            this.townLevelSetup.bottleBar.setPercentage(this.townLevelSetup.bottleBar.percentage);
            this.character.throwableBottels != 0 ? this.character.throwableBottels -= 1 : this.character.throwableBottels -= 0;
            this.character.isThrowing = true;
        } else if (this.keyboard.D && this.character.throwableBottels == 0) {
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
            // this.character.playSpeakSound();
            titleMusic.pause();
            titleMusic2.pause();
        });
    }

    playCoinSound() {
        const sound = new Audio('./assets/audio/coin2.opus');
        sound.play();
    }

    playBottleSound() {
        const sound = new Audio('./assets/audio/bottle-clink1.opus');
        sound.play();
    }

    playChickenDeathSound() {
        const sound = new Audio('./assets/audio/chicken-death.opus');
        sound.play();
    }

    playEmptyBottelsSound() {
        const sound = new Audio('./assets/audio/empty-bottels2.opus');
        sound.play();
    }

    playBottelBrokenSound() {
        const sound = new Audio('./assets/audio/bottle-shattering1.opus');
        sound.play();
    }

    playBottelThrowSound() {
        const sound = new Audio('./assets/audio/throw2.opus');
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
        this.endbossAlarmSound = new Audio('./assets/audio/endboss-alarm.opus');
        this.endbossAlarmSound.play();
    }

    endbossReaction() {
        const boss = this.townLevelSetup.townLevel.endboss;
        const player = this.character;
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

    stepSoundCharacter(timestamp) {
        if (timestamp - this.lastStepCheck < this.stepCheckDelay) return;
        this.lastStepCheck = timestamp;
        if ((this.character.isMovingLeft || this.character.isMovingRight) && !this.character.isJumping && !this.character.isFlying) {
            this.footStepSound.currentTime = 0;
            this.footStepSound.play();
        }
    }

    landingSoundCharacter() {
        if (this.character.isLanding) {
            this.landingSound.currentTime = 0;
            this.landingSound.play();
            this.character.isLanding = false;
        }
    }
}