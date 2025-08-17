class World {

    ctx;
    canvas;
    currentScene = 'farmScene';



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

    }
    scene = 2;
    inStall = false;

    startGame() {
        this.farmSceneSetup();
        this.setWorld();
        this.draw();
        // this.checkPressKey();
        // this.checkCollisions();
        // this.checkThrowObjects();
        // this.npc2.animationStand();
        // this.npc2.isNpcFlipped = true;
    }

    changeSetup() {
        this.inStallSetup();
        this.setWorld
        this.draw();
    }

    draw(timestamp) {
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
        // this.scene1(timestamp);
        switch (this.currentScene) {
            case 'farmScene':
                this.farmScene(timestamp);
                break;

            case 'stallScene':
                this.stallScene(timestamp);
                break;
        }
        requestAnimationFrame((timestamp) => {
            this.draw(timestamp);
        });
    }

    farmScene(timestamp) {
        this.renderCameraX = Math.round(this.camera_x);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // this.updateCamera();
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX, 0);
        this.addObject(this.farmLevel.sky);
        this.addObject(this.farmLevel.clouds);
        this.addObject(this.farmLevel.grounds);
        this.addObject(this.farmLevel.towns);
        // this.ctx.translate(-this.camera_x, 0);
        this.ctx.restore();
        this.addToWorld(this.statusBar);
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX, 0);
        this.addToWorld(this.charakter);
        if (this.charakter.x > 1550 && this.charakter.x < 1700) {
            if (!this.bubbleFarm.startTime) {
                this.bubbleFarm.start(); // Jetzt beginnt das Schreiben
            }
            this.bubbleFarm.update(performance.now());
            this.bubbleFarm.draw(this.ctx);
            if (!this.isNotificationPlay) {
                this.notificationSound.currentTime = 0;
                this.notificationSound.play();
                this.isNotificationPlay = true;
            }
            // this.bubbleFarm = new SpeechBubble("In den Hühnerstall gehen? {F} drücken!", this.charakter, performance.now());
            // this.drawSpeechBubble(this.ctx, "In den Hühnerstall gehen? {F} drücken!", this.charakter);
        } else {
            this.isNotificationPlay = false;
            this.bubbleFarm.startTime = null;
        }
        // this.ctx.translate(-this.camera_x, 0);
        this.ctx.restore();
        this.checkPressKey();
        // this.checkCollisions();
        this.charakter.updateState(timestamp);
        this.charakter.updateAnimation(timestamp);
        if (this.charakter.isJumping) {
            this.charakter.applyGravity(timestamp);
        }
        this.stepSoundCharakter(timestamp);
        this.landingSoundCharakter();
        if (this.keyboard.F && this.charakter.x > 1550 && this.charakter.x < 1700) {
            this.inStallSetup();
            this.currentScene = 'stallScene';
            this.keyboard.F = false;
            farmLevel.level_end_x = 500;
        }
        console.log(this.camera_x);
    }

    farmSceneSetup() {
        this.farmLevel = farmLevel;
        this.charakter = new Character();
        this.camera_x = 0;
        this.statusBar = new LifeEnergyCharakterBar();
        this.farmMusic = new Audio('./assets/audio/farm-music.mp3');
        this.farmMusic.play();
        this.farmMusic.loop = true;
        this.farmMusic.volume = 0.6;
        this.footStepSound = new Audio('./assets/audio/footstep-sound.mp3');
        this.jumpSound = new Audio('./assets/audio/jump-sound2.mp3');
        this.landingSound = new Audio('./assets/audio/landing-sound.mp3');
        this.bubbleFarm = new SpeechBubble("In den Hühnerstall gehen? {F} drücken!", this.charakter, performance.now());
        this.notificationSound = new Audio('./assets/audio/notification-sound.mp3');
        this.notificationSound.volume = 0.5;
        this.isNotificationPlay = false;
    }

    scene1(timestamp) {
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
        this.addToWorld(this.chickenBasket);
        this.addToWorld(this.chickenInBasket);

        this.addObject(this.level1.enemies);
        if (!this.level1.endboss.isUnderTheGround) {
            this.addToWorld(this.level1.endboss);
        }
        this.addToWorld(this.endbossAttack);
        this.addObject(this.throwableObjects);
        this.ctx.translate(-this.camera_x, 0);



        this.checkPressKey();
        this.checkCollisions();
        this.checkThrowObjects(timestamp);
        this.charakter.updateState();
        this.charakter.updateAnimation(timestamp);
        this.level1.endboss.updateState();
        this.level1.endboss.updateAnimation(timestamp);
        this.endbossAttack.updateState();
        this.endbossAttack.updateAnimation(timestamp);
        this.level1.enemies.forEach(enemy => {
            enemy.updateState();
            enemy.updateAnimation(timestamp);
        });

        if (this.charakter.isJumping) {
            this.charakter.applyGravity(timestamp);
        }
        if (this.level1.endboss.isJumping) {
            this.level1.endboss.applyGravityBoss(timestamp);
        }
        this.throwableObjects?.forEach(bottle => {
            bottle.updateState(timestamp);
            bottle.updateAnimation(timestamp);
            bottle.applyGravity2(timestamp);
        });
        const basketWobble = Math.sin(Date.now() / 100) * 0.5;
        if (this.charakter.isJumping) {
            this.chickenBasket.setCoordinates(this.charakter.x + 38, this.charakter.y + 220);
        } else if (this.charakter.isMovingLeft || this.charakter.isMovingRight) {
            this.chickenBasket.setCoordinates(this.charakter.x + 38, this.charakter.y + 228 + basketWobble);
        } else if (this.charakter.isFlipped) {
            this.chickenBasket.setCoordinates(this.charakter.x + 38 + 17.5, this.charakter.y + 228 + basketWobble);
        } else {
            this.chickenBasket.setCoordinates(this.charakter.x + 38, this.charakter.y + 228);
        }
        if (this.chickenInBasket.isIdle && !this.chickenInBasket.isReturning && !this.chickenInBasket.justLanded) {
            this.chickenInBasket.setCoordinates(
                this.chickenBasket.x,
                this.chickenBasket.y - 20
            )
        };
        this.chickenInBasket.chickenAttack(this.charakter.x, this.charakter.y, this.chickenInBasket.x, this.chickenInBasket.y - 20);
        if (this.chickenInBasket.isReturning) {
            this.chickenInBasket.updateReturnFlight();
        }
        this.endbossReaction();

    }

    scene1Setup() {
        this.charakter = new Character();
        this.chickenBasket = new ChickenBasket(this.charakter.x + 38, this.charakter.y + 228);
        this.chickenInBasket = new ChickenInBasket(this.chickenBasket.x, this.chickenBasket.y - 20);
        this.npc1 = new Npc(1750, 130, 130, 300);
        this.npc2 = new Npc(2500, 170, 180, 250);
        this.camera_x = 0;
        this.level1 = level1;

        this.endbossMusic;
        this.endbossAlarmSound;
        this.endbossMusicIsPlayed = false;
        this.endbossAlarmSoundIsPlayed = false;
        this.statusBar = new LifeEnergyCharakterBar();
        this.statusBar2 = new LifeEnergyBossBar();
        this.coinBar = new CoinBar();
        this.bottleBar = new BottleBar();
        this.throwableObjects = [];
        this.endbossAttack = new EndbossAttack();
        this.backgroundMusic = document.getElementById('background-music');
        this.jetPackMusic = document.getElementById('jet-pack-music');
        this.jetPackSound = document.getElementById('jet-pack-sound');
        this.bubble = new SpeechBubble("Ich bin Brünö ein Hühnerexperte, Compadre Amigo!", this.charakter, performance.now());
        this.bubble2 = new SpeechBubble("Ich bin Aria und wir haben große Probleme mit motierten Hühnern", this.npc2, performance.now());
        this.video = document.getElementById('portal-video');
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

    stallScene(timestamp) {
        this.renderCameraX = Math.round(this.camera_x);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // this.updateCamera();
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX, 0);
        this.addObject(this.scene2.sky);
        // this.addObject(this.scene2.clouds);
        this.addObject(this.scene2.grounds);
        this.addToWorld(this.scene2.towns[0]);
        this.ctx.restore();
        // this.ctx.translate(-this.camera_x, 0);
        this.addToWorld(this.statusBar);
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX, 0);
        this.addToWorld(this.charakter);
        this.addToWorld(this.chickenNpc);
        // this.ctx.translate(-this.camera_x, 0);
        if (this.charakter.x > 0 && this.charakter.x < 150) {
            if (!this.bubbleStall.startTime) {
                this.bubbleStall.start();
            }
            this.bubbleStall.update(performance.now());
            this.bubbleStall.draw(this.ctx);
            if (!this.isNotificationPlay) {
                this.notificationSound.currentTime = 0;
                this.notificationSound.play();
                this.isNotificationPlay = true;
            }
            // this.bubbleFarm = new SpeechBubble("In den Hühnerstall gehen? {F} drücken!", this.charakter, performance.now());
            // this.drawSpeechBubble(this.ctx, "In den Hühnerstall gehen? {F} drücken!", this.charakter);
        } else {
            this.isNotificationPlay = false;
            this.bubbleStall.startTime = null;
        }
        this.ctx.restore();

        this.checkPressKey();
        // this.checkCollisions();
        this.charakter.updateState(timestamp);
        this.charakter.updateAnimation(timestamp);
        this.chickenNpc.updateState();
        this.chickenNpc.updateAnimation(timestamp);

        if (this.charakter.isJumping) {
            this.charakter.applyGravity(timestamp);
        }
        this.stepSoundCharakter(timestamp);
        this.landingSoundCharakter();
        if (this.keyboard.F && this.charakter.x > 0 && this.charakter.x < 150) {
            // this.farmSceneSetup();
            this.currentScene = 'farmScene';
            console.log(this.camera_x);
            this.charakter.x = 1620;
            this.camera_x = this.charakter.x - 100;
            this.keyboard.F = false;
            farmLevel.level_end_x = 6409;
        }

        if(this.charakter.x > 340 && this.charakter.x < 380) {
            this.charakter.isStreicheln = true;
            this.charakter.height = 200;
            this.charakter.y = 200;
            this.charakter.width = 150;
        }

        // let self = this;
    }

    inStallSetup() {
        this.scene2 = scene2;
        // this.charakter = new Character();
        this.camera_x = 0;
        this.charakter.x = 100;
        this.bubbleStall = new SpeechBubble("Den Hühnerstall verlassen? {F} drücken!", this.charakter, performance.now());
        this.chickenNpc = new NotMovableNpc();
        // this.statusBar = new LifeEnergyCharakterBar();
        // this.farmMusic = new Audio('./assets/audio/farm-music.mp3');
        // this.farmMusic.play();
        // this.farmMusic.loop = true;
        // this.farmMusic.volume = 0.6;
        // this.footStepSound = new Audio('./assets/audio/footstep-sound.mp3');
        // this.jumpSound = new Audio('./assets/audio/jump-sound2.mp3');
        // this.landingSound = new Audio('./assets/audio/landing-sound.mp3');
        // this.bubbleFarm = new SpeechBubble("In den Hühnerstall gehen? {F} drücken!", this.charakter, performance.now());
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
        if (object.isFlipped || object.isNpcFlipped) {
            this.ctx.save();
            this.ctx.scale(-1, 1);
            const drawX = Math.round(-object.x - object.width);
            const drawY = Math.round(object.y);
            this.ctx.drawImage(object.img, drawX, drawY, object.width, object.height);
            if (!object.isGameCharakter == true) return;
            this.ctx.restore();
        } else {
            const drawX = Math.round(object.x);
            const drawY = Math.round(object.y);
            this.ctx.drawImage(object.img, drawX, drawY, object.width, object.height);
            if (!object.isGameCharakter == true) return;
        }
    }


    addObject(objectArray) {
        objectArray.forEach(element => {
            this.addToWorld(element);

        });
    }

    checkPressKey() {
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
        if (this.keyboard.S && this.chickenInBasket.isIdle && !this.chickenInBasket.isReturning && !this.chickenInBasket.justLanded) {
            this.chickenInBasket.isAttack = true;
            this.chickenInBasket.isIdle = false;
            this.chickenInBasket.attackStartX = this.chickenInBasket.x;
        }
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
                enemy.isDead = true;
                enemy.isMovingLeft = false;
                enemy.isMovingRight = false;
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
            if (this.charakter.isColliding(bottle, 0, 0) && this.bottleBar.percentage != 100) {
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

            if (bottle.y + bottle.height >= 430) {
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
                                this.level1.enemies.splice(removeEnemyIndex, 1);
                            }, 2000);
                            break;
                        }
                    }
                }
                if (bottle.isColliding(this.level1.endboss, 0, 50) && !this.level1.endboss.isDead) {
                    if (!bottle.isBrokenSound) {
                        this.playBottelBrokenSound();
                        this.level1.endboss.isHurt = true;
                        this.level1.endboss.frameIndex = 0;
                        bottle.isBrokenSound = true;
                        bottle.isBroken = true;
                        bottle.isThrow = false;
                        bottle.isGravity = false;
                        bottle.isBrokenAnimation = true;
                        this.level1.endboss.energy = this.level1.endboss.energy - 20;
                        this.statusBar2.setPercentage(this.level1.endboss.energy);
                        if (this.level1.endboss.energy <= 0) {
                            this.level1.endboss.isDead = true;
                            this.level1.endboss.frameIndex = 0;
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

        for (let j = 0; j < this.level1.enemies.length; j++) {
            const enemy = this.level1.enemies[j];
            if (this.chickenInBasket.isColliding(enemy, 25, 0) && !enemy.isDead) {
                this.chickenInBasket.isAttack = false;
                this.chickenInBasket.isIdle = true;
                enemy.isDead = true;
                enemy.isMovingLeft = false;
                enemy.isMovingRight = false;
                this.playChickenDeathSound();
                const removeEnemyIndex = j;
                setTimeout(() => {
                    this.level1.enemies.splice(removeEnemyIndex, 1);
                }, 2000);
                break;
            }
        }
        if (this.chickenInBasket.isColliding(this.level1.endboss, 0, 80) && !this.level1.endboss.isDead) {
            this.chickenInBasket.isAttack = false;
            this.chickenInBasket.isIdle = true;
            this.level1.endboss.animationHurt();
            this.level1.endboss.isHurt = true;
            this.level1.endboss.energy = this.level1.endboss.energy - 5;
            this.statusBar2.setPercentage(this.level1.endboss.energy);
            if (this.level1.endboss.energy <= 0) {
                this.level1.endboss.isDead = true;
                this.level1.endboss.animationDead();
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
            this.throwableObjects.push(bottle);
            this.playBottelThrowSound();
            this.bottleBar.percentage = Math.min(this.bottleBar.percentage - 20, 100);
            this.bottleBar.setPercentage(this.bottleBar.percentage);
            this.charakter.throwableBottels != 0 ? this.charakter.throwableBottels -= 1 : this.charakter.throwableBottels -= 0;
            this.charakter.isThrowing = true;
        } else if (this.keyboard.D && this.charakter.throwableBottels == 0) {
            this.playEmptyBottelsSound();
        }
    }

    listenStartButton() {
        document.getElementById('start-button').addEventListener('click', () => {
            this.startGame();
            document.getElementById('overlay-startscreen').style.display = 'none';
            document.getElementById('canvas').style.display = 'block';
            // document.getElementById('background-music').play();
            setFullscreen();
            // this.charakter.playSpeakSound();
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
        const boss = this.level1.endboss;
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

    drawSpeechBubble2(ctx, text, charakter) {
        console.log('wird ausgeführt')
        const padding = 10;
        const fontSize = 16;
        const tailSize = 10;

        ctx.save();
        ctx.font = `${fontSize}px sans-serif`;

        const textWidth = ctx.measureText(text).width;
        const bubbleWidth = textWidth + padding * 2;
        const bubbleHeight = fontSize + padding * 2;

        // Position der Bubble relativ zur Figur

        const x = charakter.x + charakter.width / 2 - bubbleWidth / 2;
        const y = charakter.y - 50;

        // Schatten
        ctx.shadowColor = "rgba(0,0,0,0.2)";
        ctx.shadowBlur = 4;

        // Sprechblasen-Hintergrund
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 2;

        // Hauptrechteck mit abgerundeten Ecken
        ctx.beginPath();
        this.roundRect(ctx, x, y, bubbleWidth, bubbleHeight, 10);
        ctx.fill();
        ctx.stroke();

        // "Pfeil" unten
        ctx.beginPath();
        ctx.moveTo(x + bubbleWidth / 2 - tailSize, y + bubbleHeight);
        ctx.lineTo(x + bubbleWidth / 2, y + bubbleHeight + tailSize);
        ctx.lineTo(x + bubbleWidth / 2 + tailSize, y + bubbleHeight);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Text
        ctx.fillStyle = "#000";
        ctx.fillText(text, x + padding, y + fontSize + 2);

        ctx.restore();
    }

    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();

    }



}