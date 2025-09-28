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
        this.endbossMusic.volume = 0.6;

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

        this.volumeLevel = 0.6;
        this.minVolumeLevel = 0;
        this.volumeLevel2 = 0;
        this.minVolumeLevel2 = 0.1;
        this.volumeLevel3 = 0.1;
        this.minVolumeLevel3 = 1;
        this.isPlay = false;
    }

    startGame() {
        this.farmLevelSetup = new FarmLevelSetup(this);
        // this.farmLevelController = new FarmLevelController(this.farmLevelSetup);
        // this.stableLevelSetup = new StableLevelSetup(this);
        // this.stableLevelController = new StableLevelController(this.stableLevelSetup, this.farmLevelSetup);
        // this.townLevelSetup = new TownLevelSetup(this);
        // this.townLevelController = new TownLevelController(this.townLevelSetup);
        // this.nayelisHouseLevelSetup = new NayelisHouseLevelSetup(this);
        // this.nayelisHouseLevelController = new NayelisHouseLevelController(this.nayelisHouseLevelSetup);
        this.newWeaponLevelSetup = new NewWeaponLevelSetup(this);
        this.newWeaponLevelController = new NewWeaponLevelController(this.newWeaponLevelSetup);
        this.setWorld();
        this.draw();
    }

    draw(timestamp) {
        this.newWeaponLevelController.update(timestamp);

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
        //     switch (this.currentScene) {

        //         case 'farmLevel':
        //             this.farmLevelController.update(timestamp);
        //             break;

        //         case 'stableLevel':
        //             this.stableLevelController.update(timestamp);
        //             break;
        //     }
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


    addToWorld3(object) {
        if (!object || !object.img) return;

        const flipped = object.isFlipped ?? false;
        const flippedNPC = object.isNpcFlipped ?? false;

        if (flipped || flippedNPC) {
            this.ctx.save();
            this.ctx.translate(object.x + object.width, 0);
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(object.img, 0, object.y, object.width, object.height);
            if (!object.isGamecharacter) return;
            this.ctx.beginPath();
            this.ctx.lineWidth = '3';
            this.ctx.strokeStyle = 'red';
            this.ctx.rect(-object.x - object.width, object.y, object.width, object.height);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.lineWidth = '3';
            this.ctx.strokeStyle = 'blue';
            this.ctx.rect(-object.x - object.width + object.offset.left, object.y + object.offset.top, object.width - object.offset.left - object.offset.right, object.height - object.offset.top - object.offset.bottom); this.ctx.stroke();
        } else {
            const drawX = Math.round(object.x);
            const drawY = Math.round(object.y);
            this.ctx.drawImage(object.img, drawX, drawY, object.width, object.height);
            if (!object.isGamecharacter == true) return;
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
        this.ctx.restore();
    }

    // addToWorld(object) {
    //     if (!object || !object.img) return;

    //     const flipped = object.isFlipped ?? false;
    //     const flippedNPC = object.isNpcFlipped ?? false;

    //     this.ctx.save();

    //     let drawX = Math.round(object.x);
    //     const drawY = Math.round(object.y);

    //     if (flipped || flippedNPC) {
    //         this.ctx.translate(object.x + object.width, 0);
    //         this.ctx.scale(-1, 1);
    //         drawX = 0; // ab hier wird im gespiegelten System gezeichnet
    //     }

    //     // Bild
    //     this.ctx.drawImage(object.img, drawX, drawY, object.width, object.height);

    //     // Debug-Boxen nur wenn Gamecharacter
    //     if (object.isGamecharacter) {
    //         this.ctx.lineWidth = 3;

    //         // Außenrand (rot)
    //         this.ctx.strokeStyle = 'red';
    //         this.ctx.strokeRect(drawX, drawY, object.width, object.height);

    //         // Hitbox mit Offset (blau)
    //         const off = object.offset || { left: 0, right: 0, top: 0, bottom: 0 };
    //         this.ctx.strokeStyle = 'blue';
    //         this.ctx.strokeRect(
    //             drawX + off.left,
    //             drawY + off.top,
    //             object.width - off.left - off.right,
    //             object.height - off.top - off.bottom
    //         );
    //     }

    //     this.ctx.restore(); // immer am Ende!
    // }

    addToWorld(object, ctx = this.ctx) {
        if (!object || !object.img) return;

        const flipped = !!(object.isFlipped ?? false);
        const flippedNPC = !!(object.isNpcFlipped ?? false);
        const isFlipped = flipped || flippedNPC;
        const off = Object.assign({ left: 0, right: 0, top: 0, bottom: 0 }, object.offset || {});

        ctx.save();

        if (isFlipped) {
            // verschiebe Origin so dass lokales 0,0 an der Position (object.x + object.width, object.y) liegt
            ctx.translate(object.x + object.width, Math.round(object.y));
            ctx.scale(-1, 1);
            // im lokalen System zeichnen wir bei 0,0
            ctx.drawImage(object.img, 0, 0, object.width, object.height);

            if (object.isGamecharacter) {
                ctx.lineWidth = 3;
                ctx.strokeStyle = 'red';
                // Außenrand (lokal bei 0,0)
                ctx.strokeRect(0, 0, object.width, object.height);

                // Hitbox: bei Spiegeln muss left/right getauscht werden
                const left = off.right;   // swap
                const top = off.top;
                const w = object.width - off.left - off.right;
                const h = object.height - off.top - off.bottom;
                ctx.strokeStyle = 'blue';
                ctx.strokeRect(left, top, w, h);
            }
        } else {
            // nicht gespiegelt: normale Koordinaten verwenden
            const drawX = Math.round(object.x);
            const drawY = Math.round(object.y);
            ctx.drawImage(object.img, drawX, drawY, object.width, object.height);

            if (object.isGamecharacter) {
                ctx.lineWidth = 3;
                ctx.strokeStyle = 'red';
                ctx.strokeRect(drawX, drawY, object.width, object.height);

                ctx.strokeStyle = 'blue';
                ctx.strokeRect(
                    drawX + off.left,
                    drawY + off.top,
                    object.width - off.left - off.right,
                    object.height - off.top - off.bottom
                );
            }
        }

        ctx.restore();
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

            if (this.keyboard.A && !this.character.isAttack) {
                this.character.isAttack = true;
            }
        }
    }

    setWorld() {
        this.character.world = this;
    }

    checkCollisions() {
        this.townLevelSetup.townLevel.enemies.forEach(element => {
            if (this.character.isCollidingBefore(element, 0, 0) && !element.isDead) {
                this.character.hit();
                this.townLevelSetup.statusBar.setPercentage(this.character.energy);
            }
            if (this.character.isCollidingBefore(element, 0, 0) && !this.character.isJumpOn(element) && !element.isDead) {
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
            if (this.character.isCollidingBefore(coin, 0, 0)) {
                this.townLevelSetup.townLevel.coins.splice(i, 1);
                this.townLevelSetup.coinBar.percentage = this.townLevelSetup.coinBar.percentage == 100 ? this.townLevelSetup.coinBar.percentage + 0 : this.townLevelSetup.coinBar.percentage + 20;
                this.playCoinSound();
                this.townLevelSetup.coinBar.percentage = Math.min(this.townLevelSetup.coinBar.percentage + 20, 100);
                this.townLevelSetup.coinBar.setPercentage(this.townLevelSetup.coinBar.percentage);
            }
        }
        for (let i = this.townLevelSetup.townLevel.bottles.length - 1; i >= 0; i--) {
            const bottle = this.townLevelSetup.townLevel.bottles[i];
            if (this.character.isCollidingBefore(bottle, 0, 0) && this.townLevelSetup.bottleBar.percentage != 100) {
                this.townLevelSetup.townLevel.bottles.splice(i, 1);
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

                    if (bottle.isCollidingBefore(enemy, 50, 0) && !enemy.isDead) {
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
                if (bottle.isCollidingBefore(this.townLevelSetup.townLevel.endboss, 0, 50) && !this.townLevelSetup.townLevel.endboss.isDead) {
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
        // if (this.character.x >= 1050 && this.character.x <= 1250) {
        //     if (this.endbossMusicIsPlayed || this.endbossAlarmSoundIsPlayed) return;
        // document.getElementById('background-music').pause();
        // this.playEndbossMusic("play");
        // this.playEndbossAlarmSound();
        // this.level1.endboss.animationHurt();
        //     this.endbossMusicIsPlayed = true;
        //     this.endbossAlarmSoundIsPlayed = true;
        // }

        for (let j = 0; j < this.townLevelSetup.townLevel.enemies.length; j++) {
            const enemy = this.townLevelSetup.townLevel.enemies[j];
            if (this.townLevelSetup.chickenInBasket.isCollidingBefore(enemy, 25, 0) && !enemy.isDead) {
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
        if (this.townLevelSetup.chickenInBasket.isCollidingBefore(this.townLevelSetup.townLevel.endboss, 0, 80) && !this.townLevelSetup.townLevel.endboss.isDead) {
            this.townLevelSetup.chickenInBasket.isAttack = false;
            this.townLevelSetup.chickenInBasket.isIdle = true;
            this.townLevelSetup.townLevel.endboss.isHurt = true;
            this.townLevelSetup.townLevel.endboss.energy = this.townLevelSetup.townLevel.endboss.energy - 5;
            this.townLevelSetup.statusBar2.setPercentage(this.townLevelSetup.townLevel.endboss.energy);
            if (this.townLevelSetup.townLevel.endboss.energy <= 0) {
                this.townLevelSetup.townLevel.endboss.isDead = true;
            }
        }






        if (!this.townLevelSetup.townLevel.endboss.isDead) {
            this.townLevelSetup.npcs.soul.x = this.townLevelSetup.townLevel.endboss.x + 75;
            this.townLevelSetup.npcs.soul.y = this.townLevelSetup.townLevel.endboss.y + 200;
        }

        if (this.townLevelSetup.townLevel.endboss.isDead && this.townLevelSetup.npcs.soul.y >= 250) {
            this.townLevelSetup.npcs.soul.y -= 1.5;
        }

        if (this.townLevelSetup.npcs.soul.y <= 250) {
            if (this.volumeLevel > this.minVolumeLevel) {
                this.volumeLevel = Math.max(this.volumeLevel - 0.010, this.minVolumeLevel);
                this.endbossMusic.volume = this.volumeLevel;
            } else {
                if (!this.isPlay) {
                    this.townLevelSetup.sounds.soulSpeakSound.play();
                    this.isPlay = true;
                }
            }
            if (this.volumeLevel2 < this.minVolumeLevel2) {
                this.volumeLevel2 = Math.min(this.volumeLevel2 + 0.010, this.minVolumeLevel2);
                this.townLevelSetup.sounds.soulMusic.volume = this.volumeLevel2;
            }
            this.townLevelSetup.sounds.soulMusic.play();

            if (this.townLevelSetup.sounds.soulSpeakSound.currentTime >= 18) {
                this.character.isMeditation = true
                this.townLevelSetup.npcs.soul.updateState('findsPeace', 1000 / 5);
                this.townLevelSetup.townLevel.endboss.isFindsPeace = true;
                if (this.townLevelSetup.npcs.soul.y >= -500) {
                    this.townLevelSetup.npcs.soul.y -= 1;
                }
                if (this.volumeLevel3 < this.minVolumeLevel3) {
                    this.volumeLevel3 = Math.min(this.volumeLevel3 + 0.005, this.minVolumeLevel3);
                    this.townLevelSetup.sounds.soulMusic.volume = this.volumeLevel3;
                }
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
            // this.character.playSpeakSound();
            setFullscreen();
            titleMusic.pause();
            titleMusic2.pause();
        });
    }

    playCoinSound() {
        const sound = new Audio('./assets/audio/coin2.opus');
        sound.volume = 0.4;
        sound.play();
    }

    playBottleSound() {
        const sound = new Audio('./assets/audio/bottle-clink1.opus');
        sound.volume = 0.6;
        sound.play();
    }

    playChickenDeathSound() {
        const sound = new Audio('./assets/audio/chicken-death.opus');
        sound.volume = 0.6;
        sound.play();
    }

    playEmptyBottelsSound() {
        const sound = new Audio('./assets/audio/empty-bottels2.opus');
        sound.volume = 0.6;
        sound.play();
    }

    playBottelBrokenSound() {
        const sound = new Audio('./assets/audio/bottle-shattering1.opus');
        sound.volume = 0.6;
        sound.play();
    }

    playBottelThrowSound() {
        const sound = new Audio('./assets/audio/throw2.opus');
        sound.volume = 0.6;
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