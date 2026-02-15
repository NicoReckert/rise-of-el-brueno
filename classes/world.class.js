import { IntroScreen } from './intro-screen.class.js'
import { Character } from './character.class.js';
import { ThrowableObject } from './throwable-object.class.js';
import { FarmLevelSetup } from './farm-level-setup.class.js';
import { FarmLevelController } from './farm-level-controller.class.js';
import { StableLevelSetup } from './stable-level-setup.class.js';
import { StableLevelController } from './stable-level-controller.class.js';
import { TownLevelSetup } from './town-level-setup.class.js';
import { TownLevelController } from './town-level-controller.class.js';
import { NayelisHouseLevelSetup } from './nayelis-house-level-setup.class.js';
import { NayelisHouseLevelController } from './nayelis-house-level-controller.class.js';
import { NewWeaponLevelSetup } from './new-weapon-level-setup.class.js';
import { NewWeaponLevelController } from './new-weapon-level-controller.class.js';
import { LevelCompleteSetup } from './level-complete-setup.class.js';
import { LevelCompleteController } from './level-complete-controller.class.js';
import { TaskWindow } from './task-window.class.js';
import { AudioManager } from '../core/audio-manager.class.js';
import { smartMerge } from '../utils/asset-merge.util.js';

export class World {

    ctx;
    canvas;
    currentScene = 'farmLevel';

    constructor(canvas, keyboard, characterImages, entityImages, audioManager, videoManager) {

        //New
        this.audioManager = new AudioManager();
        this.fadeOutAudio = this.audioManager.fadeOutAudio.bind(this.audioManager);

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keyboard = keyboard;
        this.characterImages = characterImages;
        this.entityImages = entityImages;
        this.audioManager = audioManager;
        this.videoManager = videoManager;
        this.allAudios = this.audioManager.audios;
        this.allVideos = this.videoManager.videos;




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

        this.attackStartTime = null;
        this.attackCommitUntil = null;

        this.tasks = [
            "1. Kümmere dich um Juanito",
            "2. Kümmere dich um Pollito"
        ];
        this.taskWindow = new TaskWindow(this.canvas, this.tasks);
        this.tKeyPressed = false;
    }

    startGame() {
        this.initLevels();
        this.draw();
    }

    startNextLevel() {
        this.currentScene = 'townLevel';
    }

    initLevels() {
        this.farmLevelSetup = new FarmLevelSetup(this);
        this.farmLevelController = new FarmLevelController(this.farmLevelSetup);
        this.stableLevelSetup = new StableLevelSetup(this);
        this.stableLevelController = new StableLevelController(this.stableLevelSetup);
        this.setWorld();
    }

    // world.class.js
    applyDeferredAssets(charDeferred, entityDeferred) {
        if (!charDeferred && !entityDeferred) return;

        Object.assign(this.characterImages, charDeferred);
        smartMerge(this.entityImages, entityDeferred);

        this.character?.initMovementImages();
        this.character?.initEmotionImages();
        this.character?.initActionImages();
        this.character?.initSpecialImages();
    }

    applyLazyAssets(charLazy, entityLazy) {
        if (!charLazy && !entityLazy) return;

        Object.assign(this.characterImages, charLazy);
        smartMerge(this.entityImages, entityLazy);

        this.character?.initMovementImages();
        this.character?.initEmotionImages();
        this.character?.initActionImages();
        this.character?.initSpecialImages();

        if (typeof this.initRemainingSetups === 'function') {
            this.initRemainingSetups();
        }
    }



    pauseGame() {
        this.paused = true;
        this.isKeysStopp = true;   // Eingaben blocken
    }

    resumeGame() {
        this.paused = false;
        this.isKeysStopp = false;
        const now = performance.now();
        this.lastTime = now;
        if (this.character) this.character.lastUpdateTime = now;
    }

    draw(timestamp) {
        this.timestamp = timestamp;

        if (!this.isRunning) {
            this._drawing = false;
            return;
        }
        if (this.paused) {
            if (typeof timestamp === 'number') {
                this.lastTime = timestamp;
            }
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

        this.taskWindow.update(timestamp);
        this.taskWindow.draw(this.ctx);

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

    addToWorldBEFORE(object, ctx = this.ctx) {
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

    addToWorld(object, ctx = this.ctx) {
        if (!object || !object.img) return;

        const flipped = !!(object.isFlipped ?? false);
        const flippedNPC = !!(object.isNpcFlipped ?? false);
        const isFlipped = flipped || flippedNPC;

        const off = Object.assign({ left: 0, right: 0, top: 0, bottom: 0 }, object.offset || {});
        const drawOff = Object.assign({ x: 0, y: 0, flipX: 0 }, object.drawOffset || {});
        const dx = drawOff.x;
        const dy = drawOff.y;
        const fx = drawOff.flipX;

        ctx.save();
        ctx.globalAlpha = object.opacity !== undefined ? object.opacity : 1;

        if (isFlipped) {
            const tx = Math.round(object.x + object.width + dx + fx);
            const ty = Math.round(object.y + dy);

            ctx.translate(tx, ty);
            ctx.scale(-1, 1);

            // Draw sprite (local coords)
            this.drawSprite(
                ctx,
                object.img,
                0,
                0,
                object.width,
                object.height,
                object.frameSource
            );

            if (object.isGamecharacter) {
                ctx.lineWidth = 3;

                // Outer bbox (red) - local
                ctx.strokeStyle = 'red';
                ctx.strokeRect(0, 0, object.width, object.height);

                // Normal hitbox (blue) - local
                const w = object.width - off.left - off.right;
                const h = object.height - off.top - off.bottom;
                ctx.strokeStyle = 'blue';
                ctx.strokeRect(off.left, off.top, w, h);

                // Attack hitbox (yellow) - local, but X must be mirrored in flip
                if (object.attackHitbox) {
                    const hb = object.attackHitbox;
                    const wA = object.width - hb.left - hb.right;
                    const hA = object.height - hb.top - hb.bottom;

                    // show only when active (change to `if (object.attackHitbox)` to always show)
                    if (hb.active) {
                        const attackX = object.width - hb.right - wA; // mirrored
                        const attackY = hb.top;

                        ctx.strokeStyle = 'yellow';
                        ctx.strokeRect(attackX, attackY, wA, hA);
                    }
                }
            }
        } else {
            const drawX = Math.round(object.x + dx);
            const drawY = Math.round(object.y + dy);

            // Draw sprite (world coords)
            this.drawSprite(
                ctx,
                object.img,
                drawX,
                drawY,
                object.width,
                object.height,
                object.frameSource
            );

            if (object.isGamecharacter) {
                ctx.lineWidth = 3;

                // Outer bbox (red)
                ctx.strokeStyle = 'red';
                ctx.strokeRect(drawX, drawY, object.width, object.height);

                // Normal hitbox (blue)
                ctx.strokeStyle = 'blue';
                ctx.strokeRect(
                    drawX + off.left,
                    drawY + off.top,
                    object.width - off.left - off.right,
                    object.height - off.top - off.bottom
                );

                // Attack hitbox (yellow)
                if (object.attackHitbox) {
                    const hb = object.attackHitbox;
                    const wA = object.width - hb.left - hb.right;
                    const hA = object.height - hb.top - hb.bottom;

                    // show only when active (change to `if (object.attackHitbox)` to always show)
                    if (hb.active) {
                        ctx.strokeStyle = 'yellow';
                        ctx.strokeRect(drawX + hb.left, drawY + hb.top, wA, hA);
                    }
                }
            }
        }

        ctx.restore();
    }

    drawSprite(ctx, img, dx, dy, dw, dh, frameSource = null) {
        if (frameSource) {
            ctx.drawImage(
                img,
                frameSource.sx,
                frameSource.sy,
                frameSource.sw,
                frameSource.sh,
                dx,
                dy,
                dw,
                dh
            );
        } else {
            ctx.drawImage(img, dx, dy, dw, dh);
        }
    }

    checkPressKey() {
        if (!this.isKeysStopp) {
            this.character.isMovingLeft = false;
            this.character.isMovingRight = false;
            if (this.keyboard.LEFT) {
                if (this.character.isProtect) this.character.isProtect = false;
                const now = this.timestamp;
                const isTryingToMove = this.character.isMovingLeft;
                if (this.character.isAttack) {
                    if (now < this.attackCommitUntil) {
                        this.character.isMovingLeft = false;
                        return;
                    }

                    if (isTryingToMove) {
                        this.character.isAttack = false;
                    }
                }
                this.character.isMovingLeft = true;
            }
            if (this.keyboard.RIGHT) {
                if (this.character.isProtect) this.character.isProtect = false;
                const now = this.timestamp;
                const isTryingToMove = this.character.isMovingRight;
                if (this.character.isAttack) {
                    if (now < this.attackCommitUntil) {
                        this.character.isMovingRight = false;
                        return;
                    }

                    if (isTryingToMove) {
                        this.character.isAttack = false;
                    }
                }
                this.character.isMovingRight = true;
            }
            if (this.keyboard.UP && !this.character.isAboveGround() && !this.character.isFlying && !this.character.isJumping) {
                if (this.character.isAttack || this.character.isProtect) {
                    this.character.isAttack = false;
                    this.character.isProtect = false;
                }
                this.character.isJumping = true;
                this.character.speedY = 25;
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
            const currentSetup = this.getCurrentSetup();
            if (!currentSetup) return;
            if (this.keyboard.T && !this.tKeyPressed) {
                this.taskWindow.toggle();
                this.tKeyPressed = true;
            }
            if (!this.keyboard.T) {
                this.tKeyPressed = false;
            }

            if (this.keyboard.A && !this.character.isAttack && !this.character.isMovingLeft && !this.character.isMovingRight) {
                this.character.isAttack = true;
                this.attackStartTime = this.timestamp;
                this.attackCommitUntil = this.timestamp + 180;
                const setup = this.getCurrentSetup();
                setup?.sounds?.attackSound?.play();
            }
            if (this.keyboard.S && !this.character.isProtect && !this.character.isMovingLeft && !this.character.isMovingRight) {
                this.character.isProtect = true;
            }

            if (!this.keyboard.S && this.character.isProtect) {
                this.character.isProtect = false;
            }
        }
    }

    setWorld() {
        this.character.world = this;
    }

    getCurrentSetup() {
        switch (this.currentScene) {
            case 'farmLevel':
                return this.farmLevelSetup;
            case 'stableLevel':
                return this.stableLevelSetup;
            case 'townLevel':
                return this.townLevelSetup;
            case 'nayelisHouseLevel':
                return this.nayelisHouseLevelSetup;
            case 'newWeaponLevel':
                return this.newWeaponLevelSetup;
            case 'levelComplete':
                return this.levelCompleteSetup;
            default:
                return null;
        }
    }


    checkCollisions() {
        // this.townLevelSetup.townLevel.enemies.forEach(element => {
        //     if (this.character.isCollidingBefore(element, 0, 0) && !element.isDead) {
        //         this.character.hit();
        //         this.townLevelSetup.statusBar.setPercentage(this.character.energy);
        //     }
        // if (this.character.isCollidingBefore(element, 0, 0) && !this.character.isJumpOn(element) && !element.isDead) {
        //     if (this.character.speedX > 0 && this.character.x < element.x) {
        //         this.character.speedX = 0;
        //     } else if (this.character.speedX < 0 && this.character.x > element.x) {
        //         this.character.speedX = 0;
        //     } else {
        //         this.character.speedX = 10;
        //     }
        // }
        // })

        // for (let i = this.townLevelSetup.townLevel.enemies.length - 1; i >= 0; i--) {
        //     const enemy = this.townLevelSetup.townLevel.enemies[i];
        //     if (this.character.isJumpOn(enemy)) {
        //         if (enemy.isDead) continue;
        //         enemy.isDead = true;
        //         enemy.isMovingLeft = false;
        //         enemy.isMovingRight = false;
        //         this.playChickenDeathSound();
        //         this.character.bounce();
        //         const removeIndex = i;
        //         setTimeout(() => {
        //             this.townLevelSetup.townLevel.enemies.splice(removeIndex, 1);
        //         }, 2000);
        //     }
        // }

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
                    if (enemy.currentEnemy === 'dragonSmall') return;

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

        if (this.townLevelSetup.characters.soul.y <= 250 && !this.townLevelSetup.characters.endboss.isFly) {
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
                this.townLevelSetup.characters.soul.updateAnimationState('findsPeace', 1000 / 5);
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
            if (enemy.currentEnemy === 'dragonSmall') return;
            if (this.character.isCollidingBeforeWithAttackHitbox(enemy, 25, 0, this.character.attackHitbox)
                && !this.character.hasHitEnemyThisAttack
                && !enemy.isDead) {

                const hit = enemy.receiveHit(this.timestamp, {
                    dmg: 1,
                    attackerFlipped: this.character.isFlipped,
                    knockX: 12,
                    knockY: 12,
                    hurtMs: 350,
                    deathRemoveMs: 2000,
                    onHurtSound: () => this.townLevelSetup.sounds.enemyHurtSound.play(),
                    onDeathSound: () => this.playChickenDeathSound()
                });

                if (hit) {
                    this.character.hasHitEnemyThisAttack = true;
                    break;
                }
            }
        }

        // remove dead enemies (ohne timeouts)
        this.townLevelSetup.townLevel.enemies =
            this.townLevelSetup.townLevel.enemies.filter(e => !e.isRemoved);

        if (this.character.isCollidingBeforeWithAttackHitbox(this.townLevelSetup.characters.endboss, 0, 0, this.character.attackHitbox) && this.character.isAttack && !this.character.hasHitEnemyThisAttack && !this.townLevelSetup.characters.endboss.isDead) {
            this.townLevelSetup.characters.endboss.isHurt = true;
            this.townLevelSetup.characters.endboss.frameIndex = 0;
            this.townLevelSetup.characters.endboss.energy = this.townLevelSetup.characters.endboss.energy - 5;
            this.townLevelSetup.statusBar2.setPercentage(this.townLevelSetup.characters.endboss.energy);
            this.character.hasHitEnemyThisAttack = true;
            if (this.townLevelSetup.characters.endboss.energy <= 0) {
                this.townLevelSetup.characters.endboss.isDead = true;
                this.townLevelSetup.characters.endboss.frameIndex = 0;
            }
        }
    }

    checkThrowObjects(timestamp) {
        if (timestamp - this.lastThrowCheck < this.throwCheckDelay) return;

        this.lastThrowCheck = timestamp;
        if (this.keyboard.D && this.character.throwableBottels != 0 && !this.character.isThrowing && !this.character.isAttack && !this.character.isProtect) {
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
        // Loop stoppen
        this.stop();

        // LevelComplete-Musik ausblenden
        if (this.levelCompleteSetup?.sounds?.levelCompleteMusic) {
            this.fadeOutAudio(this.levelCompleteSetup.sounds.levelCompleteMusic);
        }

        // alten Character aufräumen
        if (this.character) {
            if (this.character.intervalJump) {
                clearInterval(this.character.intervalJump);
                this.character.intervalJump = null;
            }
            this.character = null;
        }

        // globale State-Flags zurücksetzen
        this.paused = false;
        this.isRunning = true;
        this.isKeysStopp = false;
        this.camera_x = 0;

        // neuen Character + Level-Setups
        this.character = new Character(this.characterImages);
        this.setWorld();
        this.lastTime = performance.now();

        switch (levelName) {
            case 'farmLevel':
                this.farmLevelSetup = new FarmLevelSetup(this);
                this.farmLevelController = new FarmLevelController(this.farmLevelSetup);
                this.stableLevelSetup = new StableLevelSetup(this);
                this.stableLevelController = new StableLevelController(this.stableLevelSetup);
                break;
            // später: weitere Levels
        }

        this.currentScene = levelName;
        document.getElementById('level-complete-button-box').classList.add('d-none');

        // neuen Loop starten
        this.frameId = requestAnimationFrame(ts => this.draw(ts));
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
            // this.townLevelSetup.endbossMusic,
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

    moveCameraToX(targetX, {
        tolerance = 1,
        speed = 6,      // px pro Frame @60fps
        snap = true,
        clamp = true,
        onArrive = null
    } = {}) {
        // ✅ Eingaben hart normalisieren
        targetX = Number(targetX);
        speed = Number(speed);

        // ✅ camera_x absichern (falls schon NaN wurde)
        if (!Number.isFinite(this.camera_x)) this.camera_x = 0;

        // ✅ targetX/speed müssen valide sein
        if (!Number.isFinite(targetX) || !Number.isFinite(speed)) {
            return false;
        }

        // ✅ dt absichern (nie NaN, nie Infinity, nie riesig)
        let dt = Number(this.character?.deltaTime);
        if (!Number.isFinite(dt) || dt <= 0) dt = 1 / 60;
        dt = Math.min(dt, 0.05); // max 50ms (Tabwechsel / Lagschutz)

        const d = targetX - this.camera_x;

        // angekommen?
        if (Math.abs(d) <= tolerance) {
            if (snap) this.camera_x = targetX;
            if (clamp) this.clampCamera();
            onArrive?.();
            return true;
        }

        // zeitbasierter Schritt (speed = px pro Frame @60fps)
        const step = speed * dt * 60;

        // ✅ nicht overshooten
        const move = Math.sign(d) * Math.min(Math.abs(d), step);
        this.camera_x += move;

        if (clamp) this.clampCamera();
        return false;
    }


    clampCamera() {
        const levelEnd = Number(this.farmLevelSetup?.farmLevel?.level_end_x);
        if (!Number.isFinite(levelEnd)) return;

        const maxCameraX = levelEnd - 720;

        if (!Number.isFinite(this.camera_x)) this.camera_x = 0;
        this.camera_x = Math.max(0, Math.min(this.camera_x, maxCameraX));
    }
}