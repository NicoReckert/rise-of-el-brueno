class World {

    ctx;
    canvas;
    currentScene = 'townLevel';

    constructor(canvas, keyboard, characterImages, entityImages, allAudios) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keyboard = keyboard;
        this.characterImages = characterImages;
        this.entityImages = entityImages;
        this.allAudios = allAudios;
        // this.listenStartButton();


        this.lastThrowCheck = 0;
        this.throwCheckDelay = 120;

        this.lastStepCheck = 0;
        this.stepCheckDelay = 400;
        this.character = new Character(this.characterImages);
        this.footStepSound = this.allAudios.footStepSound;
        this.jumpSound = this.allAudios.jumpSound;
        this.landingSound = this.allAudios.landingSound;
        this.camera_x = 0;

        this.lastTime = performance.now();
        this.intro = new IntroScreen(this.ctx, this.canvas);
        this.chapterSound = this.allAudios.chapterSound;
        this.isChapterSoundPlayed = false;
        this.isKeysStopp = false;

        this.volumeLevel = 0.6;
        this.minVolumeLevel = 0;
        this.volumeLevel2 = 0;
        this.minVolumeLevel2 = 0.1;
        this.volumeLevel3 = 0.1;
        this.minVolumeLevel3 = 1;
        this.isPlay = false;
        this.paused = false;
        this.isRunning = true;
        this.frameId = null;
    }

    startGame() {
        this.farmLevelSetup = new FarmLevelSetup(this);
        this.farmLevelController = new FarmLevelController(this.farmLevelSetup);
        this.stableLevelSetup = new StableLevelSetup(this);
        this.stableLevelController = new StableLevelController(this.stableLevelSetup);
        this.setWorld();
        this.draw();
    }

    draw(timestamp) {

        if (!this.isRunning) {
            this._drawing = false;
            return;
        }
        if (this.paused) {
            this.frameId = requestAnimationFrame((timestamp) => this.draw(timestamp));
            return;
        }
        // const deltaTime = timestamp - this.lastTime;
        // this.lastTime = timestamp;
        // if (!this.intro.done) {
        //     this.intro.update(deltaTime);
        //     this.intro.draw();
        //     if (!this.isChapterSoundPlayed) {
        //         this.chapterSound.play();
        //         this.isChapterSoundPlayed = true;
        //     }
        switch (this.currentScene) {

            case 'farmLevel':
                this.farmLevelController.update(timestamp);
                break;
            case 'stableLevel':
                this.stableLevelController.update(timestamp);
                break;
            case 'townLevel':
                const deltaTime = timestamp - this.lastTime;
                this.lastTime = timestamp;
                if (!this.intro.done) {
                    this.intro.update(deltaTime);
                    this.intro.draw();
                    if (!this.isChapterSoundPlayed) {
                        this.chapterSound.play();
                        this.isChapterSoundPlayed = true;
                    }
                } else this.townLevelController.update(timestamp);
                break;
            case 'nayelisHouseLevel':
                this.nayelisHouseLevelController.update(timestamp);
                break;
            case 'newWeaponLevel':
                this.newWeaponLevelController.update(timestamp);
                break;
            case 'levelComplete':
                this.levelCompleteController.update(timestamp);
                break;
            // }
        }
        this.frameId = requestAnimationFrame((timestamp) => {
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

        ctx.globalAlpha = object.opacity !== undefined ? object.opacity : 1;

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
                const left = object.width - off.left - (object.width - off.right); // gespiegelt
                const top = off.top;
                const w = object.width - off.left - off.right;
                const h = object.height - off.top - off.bottom;

                // In einfacherer Form:
                const hitX = object.width - off.right - w; // Startpunkt nach links gespiegelt
                const hitY = off.top;

                ctx.strokeStyle = 'blue';
                ctx.strokeRect(hitX, hitY, w, h);
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

    addToWorldTEST(object, ctx = this.ctx) {
        if (!object || !object.img) return;

        const flipped = !!(object.isFlipped ?? false);
        const flippedNPC = !!(object.isNpcFlipped ?? false);
        const isFlipped = flipped || flippedNPC;
        const off = Object.assign({ left: 0, right: 0, top: 0, bottom: 0 }, object.offset || {});

        ctx.save();
        ctx.globalAlpha = object.opacity !== undefined ? object.opacity : 1;

        if (isFlipped) {
            // Koordinatensystem für Spiegelung verschieben
            ctx.translate(object.x + object.width, Math.round(object.y));
            ctx.scale(-1, 1);

            // Offsets für gespiegelte Richtung tauschen
            const drawOffsetX = off.right; // swap left/right
            const drawOffsetY = off.top;

            // Bild zeichnen
            ctx.drawImage(object.img, drawOffsetX, drawOffsetY, object.width, object.height);


            // Lokale Debugrahmen (spiegelungsabhängig)
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'red';
            ctx.strokeRect(drawOffsetX, drawOffsetY, object.width, object.height);

            const w = object.width - off.left - off.right;
            const h = object.height - off.top - off.bottom;
            ctx.strokeStyle = 'blue';
            ctx.strokeRect(drawOffsetX + off.right, drawOffsetY + off.top, w, h);


        } else {
            // Normale, nicht gespiegelte Darstellung
            const drawX = Math.round(object.x - off.left);
            const drawY = Math.round(object.y - off.top);

            ctx.drawImage(object.img, drawX, drawY, object.width, object.height);

            if (object.isGamecharacter) {
                // Lokale Debugrahmen
                ctx.lineWidth = 2;
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

        // Globale Debug-Rahmen (unabhängig von Transform / Flip)
        if (object.isGamecharacter) {
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0); // zurücksetzen auf globale Koordinaten
            ctx.lineWidth = 2;

            // Grüner globaler Rahmen (volle Bildgröße)
            ctx.strokeStyle = 'lime';
            ctx.strokeRect(object.x, object.y, object.width, object.height);

            // Magenta globale Hitbox (mit Offsets)
            const off = Object.assign({ left: 0, right: 0, top: 0, bottom: 0 }, object.offset || {});
            ctx.strokeStyle = 'magenta';
            ctx.strokeRect(
                object.x + off.left,
                object.y + off.top,
                object.width - off.left - off.right,
                object.height - off.top - off.bottom
            );

            ctx.restore();
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
                    if (this.townLevelSetup.endbossMusicIsPlayed) {
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

            if (this.keyboard.T && !this.farmLevelSetup.tKeyPressed) {
                this.farmLevelSetup.taskWindow.toggle();
                this.farmLevelSetup.tKeyPressed = true;
            }
            if (!this.keyboard.T) {
                this.farmLevelSetup.tKeyPressed = false;
            }

            if (this.keyboard.A && !this.character.isAttack) {
                this.character.isAttack = true;
                this.townLevelSetup.sounds.attackSound.play();
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
            // if (this.character.isCollidingBefore(element, 0, 0) && !this.character.isJumpOn(element) && !element.isDead) {
            //     if (this.character.speedX > 0 && this.character.x < element.x) {
            //         this.character.speedX = 0;
            //     } else if (this.character.speedX < 0 && this.character.x > element.x) {
            //         this.character.speedX = 0;
            //     } else {
            //         this.character.speedX = 10;
            //     }
            // }
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

        if (this.townLevelSetup.characters.endboss.y >= 690 && this.townLevelSetup.characters.endboss.isDead) {
            clearInterval(this.townLevelSetup.characters.endboss.intervalMoveDownAfterDead);
            this.townLevelSetup.characters.endboss.isUnderTheGround = true;
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
                if (bottle.isCollidingBefore(this.townLevelSetup.characters.endboss, 0, 50) && !this.townLevelSetup.characters.endboss.isDead) {
                    if (!bottle.isBrokenSound) {
                        this.playBottelBrokenSound();
                        this.townLevelSetup.characters.endboss.isHurt = true;
                        this.townLevelSetup.characters.endboss.frameIndex = 0;
                        bottle.isBrokenSound = true;
                        bottle.isBroken = true;
                        bottle.isThrow = false;
                        bottle.isGravity = false;
                        bottle.isBrokenAnimation = true;
                        this.townLevelSetup.characters.endboss.energy = this.townLevelSetup.characters.endboss.energy - 20;
                        this.townLevelSetup.statusBar2.setPercentage(this.townLevelSetup.characters.endboss.energy);
                        if (this.townLevelSetup.characters.endboss.energy <= 0) {
                            this.townLevelSetup.characters.endboss.isDead = true;
                            this.townLevelSetup.characters.endboss.frameIndex = 0;
                        }
                        break;
                    }
                }

            }

        }
        // if (this.character.x >= 1050 && this.character.x <= 1250) {
        //     if (this.townLevelSetup.endbossMusicIsPlayed || this.endbossAlarmSoundIsPlayed) return;
        // document.getElementById('background-music').pause();
        // this.playEndbossMusic("play");
        // this.playEndbossAlarmSound();
        // this.level1.endboss.animationHurt();
        //     this.townLevelController.townLevelSetup.endbossMusicIsPlayed = true;
        //     this.endbossAlarmSoundIsPlayed = true;
        // }

        if (!this.townLevelSetup.characters.endboss.isDead) {
            this.townLevelSetup.characters.soul.x = this.townLevelSetup.characters.endboss.x + 75;
            this.townLevelSetup.characters.soul.y = this.townLevelSetup.characters.endboss.y + 200;
        }

        if (this.townLevelSetup.characters.endboss.isDead && this.townLevelSetup.characters.soul.y >= 250) {
            this.townLevelSetup.characters.soul.y -= 1.5;
        }

        if (this.townLevelSetup.characters.soul.y <= 250) {
            if (this.volumeLevel > this.minVolumeLevel) {
                this.volumeLevel = Math.max(this.volumeLevel - 0.010, this.minVolumeLevel);
                this.townLevelSetup.endbossMusic.volume = this.volumeLevel;
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
                this.townLevelSetup.characters.soul.updateState('findsPeace', 1000 / 5);
                this.townLevelSetup.characters.endboss.isFindsPeace = true;
                if (this.townLevelSetup.characters.soul.y >= -500) {
                    this.townLevelSetup.characters.soul.y -= 1;
                }
                if (this.volumeLevel3 < this.minVolumeLevel3) {
                    this.volumeLevel3 = Math.min(this.volumeLevel3 + 0.005, this.minVolumeLevel3);
                    this.townLevelSetup.sounds.soulMusic.volume = this.volumeLevel3;
                }
            }
        }

        for (let j = 0; j < this.townLevelSetup.townLevel.enemies.length; j++) {
            const enemy = this.townLevelSetup.townLevel.enemies[j];
            if (this.character.isCollidingBeforeWithAttackHitbox(enemy, 25, 0, this.character.attackHitbox) && !this.character.hasHitEnemyThisAttack && !enemy.isDead) {
                enemy.health--;
                this.character.hasHitEnemyThisAttack = true;

                if (enemy.isAttack) {
                    enemy.isAttack = false;        // Angriff sofort stoppen
                    enemy.hasFiredThisAttack = false; // sicherheitshalber verhindern, dass der Schuss noch kommt
                }


                const knockbackPowerX = 12;  // seitlicher Impuls
                const knockbackPowerY = 12; // vertikaler Impuls

                enemy.speedX = this.character.isFlipped ? -knockbackPowerX : knockbackPowerX;
                enemy.speedY = knockbackPowerY;
                enemy.isGravity = true;
                enemy.knockbackActive = true;
                if (enemy.health <= 0) {
                    enemy.isDead = true;
                    enemy.isMovingLeft = false;
                    enemy.isMovingRight = false;
                    this.playChickenDeathSound();
                    const removeEnemyIndex = j;
                    setTimeout(() => {
                        this.townLevelSetup.townLevel.enemies.splice(removeEnemyIndex, 1);
                    }, 2000);
                } else {
                    this.townLevelSetup.sounds.enemyHurtSound.play();
                    enemy.isMovingLeft = false;
                    enemy.isHurt = true;
                    setTimeout(() => {
                        if (enemy.isDead) return;
                        enemy.isHurt = false;
                        enemy.isGravity = false;
                        enemy.knockbackActive = false;
                        enemy.isMovingLeft = true;
                    }, 1000);
                }
                break;
            }

            // Nur für große Mutations-Hühner
            if (enemy.currentEnemy !== "chickenMutatesBig" || enemy.isDead || enemy.isHurt) continue;

            const attackRange = 250;   // Entfernung in px, ab der er angreift
            const attackCooldown = 3000; // ms zwischen zwei Angriffen

            // Abstand zum Charakter
            const dx = (this.character.x + this.character.width / 2) - (enemy.x + enemy.width / 2);
            const distance = Math.abs(dx);

            // Prüfen, ob in Reichweite und kein aktiver Cooldown
            if (distance < attackRange && !enemy.attackOnCooldown) {
                const baseSound = this.allAudios.fireballLoadUpSound;
                const audio = new Audio(baseSound.src);
                audio.play();
                enemy.isAttack = true;
                enemy.frameIndex = 0;
                enemy.attackOnCooldown = true;
                enemy.isMovingLeft = false;

                // Richtung setzen
                enemy.isFlipped = dx > 0; // Charakter ist rechts → Huhn schaut nach rechts
                setTimeout(() => {
                    if (enemy.isDead) return;
                    enemy.isAttack = false;
                    enemy.isMovingLeft = true;
                }, 2000); // Dauer des Angriffs

                // Cooldown
                setTimeout(() => {
                    enemy.attackOnCooldown = false;
                }, attackCooldown);
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

    // listenStartButton() {
    //     document.getElementById('start-button').addEventListener('click', () => {
    //         this.startGame();
    //         document.getElementById('overlay-startscreen').style.display = 'none';
    //         document.getElementById('overlay-start-initialisation').style.display = 'none';
    //         document.getElementById('canvas').style.display = 'block';
    //         document.getElementById('move-button-box').classList.remove('d-none');
    //         // document.getElementById('background-music').play();
    //         // this.character.playSpeakSound();
    //         setFullscreen();
    //         titleMusic.pause();
    //         titleMusic2.pause();
    //     });
    // }

    initRemainingSetups() {
        this.townLevelSetup = new TownLevelSetup(this);
        this.townLevelController = new TownLevelController(this.townLevelSetup);
        this.nayelisHouseLevelSetup = new NayelisHouseLevelSetup(this);
        this.nayelisHouseLevelController = new NayelisHouseLevelController(this.nayelisHouseLevelSetup);
        this.newWeaponLevelSetup = new NewWeaponLevelSetup(this);
        this.newWeaponLevelController = new NewWeaponLevelController(this.newWeaponLevelSetup);
        this.levelCompleteSetup = new LevelCompleteSetup(this);
        this.levelCompleteController = new LevelCompleteController(this.levelCompleteSetup);
    }

    playCoinSound() {
        const baseSound = this.allAudios.coinSound;
        const sound = baseSound.cloneNode();
        sound.volume = 0.4;
        sound.play();
    }

    playBottleSound() {
        const baseSound = this.allAudios.bottleClinkSound;
        const sound = baseSound.cloneNode();
        sound.volume = 0.6;
        sound.play();
    }

    playChickenDeathSound() {
        const sound = this.allAudios.chickenDeathSound;
        sound.volume = 0.6;
        sound.play();
    }

    playEmptyBottelsSound() {
        const sound = this.allAudios.bottleEmptySound;
        sound.volume = 0.6;
        sound.play();
    }

    playBottelBrokenSound() {
        const sound = this.allAudios.bottleBrokenSound;
        sound.volume = 0.6;
        sound.play();
    }

    playBottelThrowSound() {
        const sound = this.allAudios.bottleThrowSound;
        sound.volume = 0.6;
        sound.play();
    }

    playEndbossMusic(state) {
        switch (state) {
            case "play":
                this.townLevelSetup.endbossMusic.play();
                break;

            case "stop":
                this.townLevelSetup.endbossMusic.pause();
                this.townLevelSetup.endbossMusic.currentTime = 0;
                break;
        }
    }

    playEndbossAlarmSound() {
        this.endbossAlarmSound = this.allAudios.endbossAlarmSound;
        this.endbossAlarmSound.play();
    }

    endbossReaction() {
        const boss = this.townLevelSetup.characters.endboss;
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

    restartLevel(levelName) {
        this.stop();
        fadeOutAudio(this.levelCompleteSetup.sounds.levelCompleteMusic);
        if (this.character) {
            // 🧹 Eventuelle laufende Sounds stoppen
            if (this.character.footStepSound) {
                this.character.footStepSound.pause();
                this.character.footStepSound.currentTime = 0;
            }

            // 🧹 Animationen, Timer oder eigene Loops stoppen
            if (this.character.intervalJump) {
                clearInterval(this.character.intervalJump);
                this.character.intervalJump = null;
            }

            // 🔥 Referenz löschen
            this.character = null;
        }
        setTimeout(() => {
            this.character = new Character(this.characterImages);
            // this.character.resetTimers();
            this.setWorld();
            this.camera_x = this.character.x - 100;   // Starte synchron zur Figur
            this.lastTime = performance.now();
            switch (levelName) {
                case 'farmLevel':
                    this.farmLevelSetup = new FarmLevelSetup(this);
                    this.farmLevelController = new FarmLevelController(this.farmLevelSetup);
                    this.stableLevelSetup = new StableLevelSetup(this);
                    this.stableLevelController = new StableLevelController(this.stableLevelSetup);
                    break;
                // andere Levels, falls du das auch brauchst
            }

            this.currentScene = levelName;
            document.getElementById('level-complete-button-box').classList.add('d-none');
            this.isRunning = true;
            this.draw();
        }, 50);



    }

    destroy() {
        // 🧩 Spiel pausieren und Rendering stoppen
        this.paused = true;

        // 🧹 Falls du den letzten Frame-Loop gespeichert hast, abbrechen
        if (this.frameId) {
            cancelAnimationFrame(this.frameId);
            this.frameId = null;
        }

        // 🧹 Canvas leeren
        if (this.ctx && this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

        // 🛑 Alle Sounds stoppen
        const stopSound = (sound) => {
            if (sound && !sound.paused) {
                try {
                    sound.pause();
                    sound.currentTime = 0;
                } catch (e) { }
            }
        };

        // Liste aller Sounds im World-Scope
        [
            this.townLevelSetup.endbossMusic,
            this.footStepSound,
            this.jumpSound,
            this.landingSound,
            this.chapterSound,
            ...(this.farmLevelSetup?.sounds ? Object.values(this.farmLevelSetup.sounds) : []),
            ...(this.stableLevelSetup?.sounds ? Object.values(this.stableLevelSetup.sounds) : []),
            ...(this.townLevelSetup?.sounds ? Object.values(this.townLevelSetup.sounds) : []),
            ...(this.nayelisHouseLevelSetup?.sounds ? Object.values(this.nayelisHouseLevelSetup.sounds) : []),
            ...(this.newWeaponLevelSetup?.sounds ? Object.values(this.newWeaponLevelSetup.sounds) : []),
            ...(this.levelCompleteSetup?.sounds ? Object.values(this.levelCompleteSetup.sounds) : []),
        ].forEach(stopSound);

        // 🧱 Video-Elemente entfernen (z. B. aus Nayelis-House-Level)
        const removeVideo = (setup) => {
            if (setup?.video && setup.video.parentNode) {
                setup.video.pause();
                setup.video.src = "";
                setup.video.parentNode.removeChild(setup.video);
            }
        };
        [
            this.farmLevelSetup,
            this.stableLevelSetup,
            this.townLevelSetup,
            this.nayelisHouseLevelSetup,
            this.newWeaponLevelSetup,
            this.levelCompleteSetup
        ].forEach(removeVideo);

        // 🗑️ Controller und Setups dereferenzieren
        this.farmLevelController = null;
        this.stableLevelController = null;
        this.townLevelController = null;
        this.nayelisHouseLevelController = null;
        this.newWeaponLevelController = null;
        this.levelCompleteController = null;

        this.farmLevelSetup = null;
        this.stableLevelSetup = null;
        this.townLevelSetup = null;
        this.nayelisHouseLevelSetup = null;
        this.newWeaponLevelSetup = null;
        this.levelCompleteSetup = null;

        // 👤 Charakter & andere Entities entfernen
        this.character = null;

        // 🎮 Input deaktivieren
        this.isKeysStopp = true;
        this.keyboard = null;

        // 🔧 Welt-Referenzen
        this.ctx = null;
        this.canvas = null;
        this.characterImages = null;
        this.entityImages = null;
        this.intro = null;

        console.info("World wurde zerstört und kann neu initialisiert werden.");
    }

    stop() {
        this.isRunning = false; // 👈 Nur Flag setzen – das reicht
        if (this.frameId) {
            cancelAnimationFrame(this.frameId);
            this.frameId = null;
        }
    }

}