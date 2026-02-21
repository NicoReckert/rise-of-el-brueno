import { PopupText } from "../classes/ui/popup-text.class.js";
import { Enemy } from "../classes/entities/enemy.class.js";
import { DamageText } from "../classes/ui/damage-text.class.js";
import { AudioManager } from "../core/audio-manager.class.js";
import { ThrowableObject } from "../classes/entities/throwable-object.class.js";

const audioManager = new AudioManager();
const fadeOutAudio = audioManager.fadeOutAudio.bind(audioManager);
const fadeInAudio = audioManager.fadeInAudio.bind(audioManager);

export const townEvents =
    [
        {
            type: 'quest',
            action: (setup) => {
                setup.backgroundMusic.loop = true;
                fadeInAudio(setup.sounds.backgroundMusic, 2000, 0.6);

                setup.world.character.x = 23000; // 100 //18500//23000
                setup.world.character.level_start_x = 0;
                setup.world.level_end_x = 25000;
                setup.world.camera_x = 22900; //0 // 18400 //22900
                setup.world.character.speedX = 10;
                setup.world.character.isWalkDetermined = false;
                setup.characters.tadeo.updateAnimationState('idle', 1000 / 5);

                // setup.world.character.isWalkInStorm = true;
                setup.world.character.speedX = 3; //2
            }
        },

        {
            type: "position",
            area: { x: 200, width: 100 },
            action: (setup) => {
                setup.townLevel.enemies.push(
                    new Enemy('dragonSmall', setup.entityImages, 170, 170, 300, 1000, setup.allAudios),
                )
                setup.townLevel.enemies.forEach(enemy => {
                    enemy.curentAnimation = 'idle';
                    enemy.world = setup.world;
                });
            }
        },

        {
            type: "position",
            area: { x: 10275, width: 95 },
            once: false,
            requireKey: "F",
            action: (setup) => {
                setup.world.currentScene = 'nayelisHouseLevel';
                setup.sounds.backgroundMusic.pause();
            }
        },

        {
            type: 'time',
            delay: 2000,
            step: 1,
            action: (setup) => {
                setup.sounds.newTaskSound.play();
                setup.popupTexts.push(new PopupText("Neue Aufgaben im Log!", setup.world.canvas.width / 2, 400));
            }

        },

        {
            type: "position",
            area: { x: 2000, width: 100 },
            step: 1,
            action: (setup) => {
                setup.world.townLevelController.questManager.advance(2)
            }
        },

        {
            type: "time",
            from: 0,
            to: 4000,
            step: 2,
            once: false,
            action: (setup, elapsed, progress) => {
                const ctrl = setup.world.townLevelController;
                const intensity = progress * 0.5;

                ctrl.setSandstorm(intensity);
            },
            onEnd: (setup) => {
                const ctrl = setup.world.townLevelController;
                ctrl.setSandstorm(0.5);
                ctrl.questManager.advance(3);
            }
        },

        {
            type: "position",
            area: { x: 3000, width: 100 },
            step: 3,
            action: (setup) => {
                setup.world.townLevelController.questManager.advance(4)
            }
        },

        {
            type: "time",
            from: 0,
            to: 4000,
            step: 4,
            once: false,
            action: (setup, elapsed, progress) => {
                const ctrl = setup.world.townLevelController;
                const intensity = 0.5 + progress * 0.5;
                ctrl.setSandstorm(intensity);
            },
            onEnd: (setup) => {
                const ctrl = setup.world.townLevelController;
                ctrl.setSandstorm(1.0);
                setup.world.character.isWalkInStorm = true;
                setup.world.character.speedX = 2; //2
                ctrl.questManager.advance(5);
            }
        },


        {
            type: "position",
            area: { x: 4000, width: 100 },
            step: 5,
            action: (setup) => {
                setup.characters.tadeo.updateAnimationState('walk');
                setup.world.character.isCollapse = true;
                setup.world.character.isMovingLeft = false
                setup.world.character.isMovingRight = false
                setup.world.isKeysStopp = true;
                setup.world.townLevelController.questManager.advance(6)

            }
        },

        {
            type: "position",
            area: { x: 5000, width: 100 },
            action: (setup) => {
                setup.townLevel.enemies.push(
                    new Enemy('chickenMutatesSmall', setup.entityImages, 120, 120, 545, 6000, setup.allAudios),
                    new Enemy('chickenMutatesSmall', setup.entityImages, 120, 120, 545, 6100, setup.allAudios),
                    new Enemy('chickenMutatesBig', setup.entityImages, 160, 160, 505, 6200, setup.allAudios),
                    // new Enemy('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),
                    // new Enemy('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),
                    // new Enemy('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),
                    // new Enemy('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),
                    // new Enemy('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),
                    // new Enemy('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),
                    // new Enemy('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),
                    // new Enemy('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),
                    // new Enemy('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),



                )
                setup.townLevel.enemies.forEach(enemy => {
                    enemy.world = setup.world;
                });
            }
        },

        {
            type: "position",
            area: { x: 6000, width: 100 },
            action: (setup) => {
                setup.townLevel.enemies.push(
                    new Enemy('chickenMutatesSmall', setup.entityImages, 120, 120, 545, 7000, setup.allAudios),
                    new Enemy('chickenMutatesSmall', setup.entityImages, 120, 120, 545, 7100, setup.allAudios),
                    new Enemy('chickenMutatesBig', setup.entityImages, 160, 160, 505, 7200, setup.allAudios),
                    // new Enemy('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),
                    // new Enemy('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),
                    // new Enemy('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),
                    // new Enemy('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),
                    // new Enemy('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),
                    // new Enemy('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),
                    // new Enemy('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),
                    // new Enemy('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),
                    // new Enemy('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),



                )
                setup.townLevel.enemies.forEach(enemy => {
                    enemy.world = setup.world;
                });
            }
        },

        {
            type: "position",
            area: { x: 7000, width: 100 },
            action: (setup) => {
                setup.townLevel.enemies.push(
                    new Enemy('chickenMutatesSmall', setup.entityImages, 120, 120, 545, 8000, setup.allAudios),
                    new Enemy('chickenMutatesSmall', setup.entityImages, 120, 120, 545, 8100, setup.allAudios),
                    new Enemy('chickenMutatesBig', setup.entityImages, 160, 160, 505, 8200, setup.allAudios),
                    // new Enemy('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),
                    // new Enemy('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),
                    // new Enemy('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),
                    // new Enemy('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),
                    // new Enemy('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),
                    // new Enemy('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),
                    // new Enemy('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),
                    // new Enemy('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),
                    // new Enemy('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),



                )
                setup.townLevel.enemies.forEach(enemy => {
                    enemy.world = setup.world;
                });
            }
        },

        {
            type: "position",
            area: { x: 8000, width: 100 },
            action: (setup) => {
                setup.townLevel.enemies.push(
                    new Enemy('chickenMutatesSmall', setup.entityImages, 120, 120, 545, 9000, setup.allAudios),
                    new Enemy('chickenMutatesSmall', setup.entityImages, 120, 120, 545, 9100, setup.allAudios),
                    new Enemy('chickenMutatesBig', setup.entityImages, 160, 160, 505, 9200, setup.allAudios),
                    // new Enemy('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),
                    // new Enemy('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),
                    // new Enemy('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),
                    // new Enemy('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),
                    // new Enemy('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),
                    // new Enemy('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),
                    // new Enemy('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),
                    // new Enemy('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),
                    // new Enemy('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),



                )
                setup.townLevel.enemies.forEach(enemy => {
                    enemy.world = setup.world;
                });
            }
        },

        {
            type: "quest",
            step: 6,
            once: false,
            action: (setup) => {
                const tadeo = setup.characters.tadeo;
                const arriveX = tadeo.moveToX(4020, { speed: 5 });
                if (arriveX) {
                    setup.characters.tadeo.updateAnimationState('idle');
                    // setup.speechBubbles[0].start(4500);
                    setup.world.townLevelController.questManager.advance(7);
                }
            }
        },

        {
            type: "time",
            delay: 2000,
            step: 6,
            action: (setup) => {
                fadeOutAudio(setup.sounds.backgroundMusic, 1000);
                fadeInAudio(setup.sounds.tadeosMusic, 2000, 0.6);
            }
        },

        // {
        //     type: "time",
        //     from: 0,
        //     to: 5000,
        //     step: 3,
        //     once: false,
        //     action: (setup) => setup.speechBubbles[0].render(setup.world.ctx, setup.world.townLevelController.renderCameraX, 0)
        // },

        // {
        //     type: "time",
        //     delay: 5000,
        //     step: 3,
        //     action: (setup) => setup.speechBubbles[1].start(4500)
        // },

        // {
        //     type: "time",
        //     from: 5000,
        //     to: 10000,
        //     step: 3,
        //     once: false,
        //     action: (setup) => setup.speechBubbles[1].render(setup.world.ctx, setup.world.townLevelController.renderCameraX)
        // },

        // {
        //     type: "time",
        //     delay: 10000,
        //     step: 3,
        //     action: (setup) => setup.speechBubbles[2].start(4500)
        // },

        // {
        //     type: "time",
        //     from: 10000,
        //     to: 15000,
        //     step: 3,
        //     once: false,
        //     action: (setup) => setup.speechBubbles[2].render(setup.world.ctx, setup.world.townLevelController.renderCameraX, 0)
        // }

        {
            type: "time",
            delay: 3000,
            step: 7,
            action: (setup) => {
                // setup.sounds.tadeoHoldStoneMusic.currentTime = 35;
                setup.sounds.tadeoHoldStoneMusic.loop = true;
                fadeInAudio(setup.sounds.tadeoHoldStoneMusic, 2000, 0.6);
                fadeOutAudio(setup.sounds.tadeosMusic, 1000);
                setup.characters.tadeo.updateAnimationState('stoneActivated', 1000 / 5.5);
                setup.panel.activate(performance.now());
                setup.world.townLevelController.magicShield.start();

            }
        },

        // {
        //     type: "time",
        //     delay: 6000,
        //     step: 7,
        //     action: (setup) => {
        //         setup.world.character.isCollapse = true;
        //     }
        // },

        {
            type: "time",
            delay: 13000,
            step: 7,
            action: (setup) => {
                setup.world.character.isCollapse = false;
                setup.world.isKeysStopp = false;
                setup.world.character.isStandUpAfterCollapse = true;
                setup.world.character.isWalkInStorm = false;
                setup.world.character.speedX = 5;
                setup.characters.tadeo.updateAnimationState('walkWithStone');
                // setup.characters.tadeo.speedX = 0.5;
                setup.characters.tadeo.isFlipped = false;
                setup.world.townLevelController.questManager.advance(8);
            }
        },

        // {
        //     type: "time",
        //     delay: 3000,
        //     step: 8,
        //     once: false,
        //     action: (setup) => {
        //         if (setup.characters.tadeo.x <= 10275 /*&& setup.world.character.x >= setup.characters.tadeo.x - 170 && setup.world.character.x <= setup.characters.tadeo.x + 170*/) {
        //             setup.characters.tadeo.isMovingRight = true;
        //             setup.characters.tadeo.updateAnimationState('walkWithStone');
        //             // setup.world.character.level_start_x = setup.characters.tadeo.x - 170;
        //             // setup.world.level_end_x = setup.characters.tadeo.x + 170;
        //         } else {
        //             setup.characters.tadeo.isMovingRight = false;
        //             setup.characters.tadeo.updateAnimationState('idleWithStone');
        //             // setup.world.character.level_start_x = setup.characters.tadeo.x - 170;
        //             // setup.world.level_end_x = setup.characters.tadeo.x + 170;
        //             // setup.world.townLevelController.questManager.advance(9);
        //         }
        //     }
        // },

        {
            type: 'collision',
            objectA: 'character',
            objectB: 'tadeo',
            toleranceB: { x: -50, width: -50 },
            step: 8,
            once: false,
            action: (setup) => {
                const tadeo = setup.characters.tadeo;
                // tadeo.speedX = 2;
                const arriveX = tadeo.moveToX(10275, { speed: 0.8 });
                if (!arriveX) setup.characters.tadeo.updateAnimationState('walkWithStone');
                if (arriveX) setup.characters.tadeo.updateAnimationState('idleWithStone');
            },
            onLeave: (setup) => {
                setup.characters.tadeo.isMovingRight = false;
                setup.characters.tadeo.updateAnimationState('idleWithStone');
            }
        },

        {
            type: 'quest',
            step: 8,
            once: false,
            action: (setup) => {
                const hero = setup.world.character;
                const tadeo = setup.characters.tadeo;
                const radius = 180;

                const left = tadeo.x - radius;
                const right = tadeo.x + radius;

                if (hero.x < left) hero.x = left;
                if (hero.x > right) hero.x = right;
            }
        },

        {
            type: 'collision',
            objectA: 'character',
            objectB: 'musician',

            toleranceB: { x: -150, width: -150 },
            once: false,
            cooldown: 500,
            action: (setup) => {
                if (!setup.isNearMusician) {
                    setup.isNearMusician = true;
                    setup.sounds.musicianTownMusic.currentTime = 0;
                    fadeOutAudio(setup.sounds.backgroundMusic, 1000);
                    fadeInAudio(setup.sounds.musicianTownMusic, 2000, 0.6);
                }
            },
            onLeave: (setup) => {
                if (setup.isNearMusician) {
                    setup.isNearMusician = false;
                    setup.sounds.backgroundMusic.currentTime = 0;
                    fadeOutAudio(setup.sounds.musicianTownMusic, 1000);
                    fadeInAudio(setup.sounds.backgroundMusic, 2000, 0.6);
                }
            }
        },

        {
            type: 'collision',
            objectA: 'character',
            objectB: 'sollita',
            toleranceB: { x: -80, width: -80 },
            once: false,
            cooldown: 500,
            action: (setup) => {
                if (!setup.isNearSollita) {
                    setup.isNearSollita = true;
                    setup.sounds.sollitasMusic.currentTime = 0;
                    fadeOutAudio(setup.sounds.backgroundMusic, 1000);
                    fadeInAudio(setup.sounds.sollitasMusic, 2000, 0.6);
                }
            },
            onLeave: (setup) => {
                if (setup.isNearSollita) {
                    setup.isNearSollita = false;
                    setup.sounds.backgroundMusic.currentTime = 0;
                    fadeOutAudio(setup.sounds.sollitasMusic, 1000);
                    fadeInAudio(setup.sounds.backgroundMusic, 2000, 0.6);
                }
            }
        },

        {
            type: "position",
            area: { x: 22500, width: 100 },
            action: (setup) => {
                setup.characters.endboss.x = 22000;
                setup.characters.endboss.y = -100;
                setup.characters.endboss.isFlipped = true;
                setup.characters.endboss.isFly = true;
                // setup.sounds.endbossFlappingWingsSound.play();
                // setup.sounds.endbossFlappingWingsSound.loop = true;
                // setup.sounds.endbossFlappingWingsSound.volume = 1.0;
                setup.endbossMusic.currentTime = 0;
                fadeOutAudio(setup.backgroundMusic, 1000);
                fadeInAudio(setup.endbossMusic, 2000, 0.6);


                const audio = setup.sounds.endbossFlappingWingsSound;
                const ctx = new AudioContext();

                const source = ctx.createMediaElementSource(audio);
                const gainNode = ctx.createGain();

                gainNode.gain.value = 6.0; // 200% Lautstärke

                source.connect(gainNode);
                gainNode.connect(ctx.destination);

                audio.play();
                audio.loop = true;
                setup.world.character.speedX = 8;


                setup.world.townLevelController.questManager.advance(12);

            }
        },

        // {
        //     type: "quest",
        //     action: (setup) => {
        //         setup.world.character.y = 165;
        //         setup.world.character.yNormal = 165;
        //         setup.world.character.yVoidless = 282;
        //         setup.characters.endboss.x = 23850
        //         setup.characters.endboss.isFireballAttack = true;
        //         setup.world.townLevelController.questManager.advance(20);
        //     }
        // },

        // {
        //     type: "quest",
        //     once: false,
        //     action: (setup) => {
        //         setup.characters.endboss.isFireballAttack = true;
        //     }
        // },

        // {
        //     type: "time",
        //     delay: 5000,
        //     step: 20,
        //     action: (setup) => {
        //         setup.world.character.isAirHitStun = true;
        //         setup.environment.juanitoSpirit.updateAnimationState('spiritCuddle', 1000 / 4);
        //         setup.environment.pollitoSpirit.updateAnimationState('spiritCuddle', 1000 / 4);
        //         setup.environment.lolaSpirit.updateAnimationState('spiritCuddle', 1000 / 4);
        //         fadeOutAudio(setup.backgroundMusic, 1000);
        //         fadeInAudio(setup.sounds.airHitStunMusic, 2000, 1.0);
        //     }
        // },
        {
            type: "quest",
            step: 12,
            once: false,
            action: (setup) => {
                const endboss = setup.characters.endboss;
                const arrivedX = endboss.moveToX(23000, 220);
                if (arrivedX) {
                    endboss.setPhase(endboss.ENDBOSS_PHASE.AIR_EGGS)
                    setup.world.townLevelController.questManager.advance(13)
                }
            }

        },


        //COLLIDINGS

        {
            type: 'quest',
            once: false,
            action: (setup) => {
                const char = setup.world.character
                if (char.isHurt) return;
                setup.world.projectiles.forEach(element => {
                    if (!element.isActive) return;
                    if (element.state === "explode") return;
                    const colliding = element.isColliding(char, { x: 0, width: 0 }, { x: 50, width: 50 });
                    if (colliding) {
                        const dmg = char.isProtect ? 2 : 10;
                        element.isActive = false;
                        element.explode();
                        char.combatCtrl.hit(setup.world.timestamp, dmg);
                        setup.statusBar.setPercentage(char.energy);
                        setup.damageTexts.push(new DamageText(char.x + char.width / 2, char.y - 10, dmg));

                    }
                });
            }
        },

        {
            type: 'quest',
            once: false,
            action: (setup) => {
                const char = setup.world.character
                const now = setup.world.timestamp;
                if (char.isHurt) return;
                setup.townLevel.enemies.forEach(enemy => {
                    if (enemy.isDead) return;
                    const IMMUNITY_DURATION = 500; // ms
                    const attackImmunity = (now - setup.world.attackCommitUntil) < IMMUNITY_DURATION;
                    const colliding = enemy.isColliding(char);
                    const effectiveColliding = colliding && enemy.currentEnemy !== 'dragonSmall' && !char.isJumping && !attackImmunity && !char.isAttack && !char.isProtect && !enemy.isHurt && !enemy.isDead;
                    const did = char.combatCtrl.handleEnemyTouch(enemy, effectiveColliding, now, {
                        dmg: char.isProtect ? 2 : 10,
                        knockX: 26,
                        knockY: 16
                    });
                    if (did) {
                        setup.statusBar.setPercentage(char.energy);
                        setup.damageTexts.push(
                            new DamageText(char.x + char.width / 2, char.y - 10, char.isProtect ? 2 : 10)
                        );
                    }
                });
            }
        },

        {
            type: 'quest',
            once: false,
            action: (setup) => {
                const char = setup.world.character
                if (char.isHurt) return;
                setup.townLevel.enemies.forEach(enemy => {
                    if (enemy.isDead) return;
                    if (
                        enemy.currentEnemy === 'chickenMutatesSmall' &&
                        enemy.attackHitbox?.active &&
                        char
                    ) {
                        if (!enemy.hasHitPlayerThisAttack && enemy.isCollidingBeforeWithAttackHitbox(char, 0, 0, enemy.attackHitbox)) {
                            const dmg = char.isProtect ? 2 : 10;
                            char.combatCtrl.hit(setup.world.timestamp, dmg);
                            setup.statusBar.setPercentage(char.energy);
                            setup.damageTexts.push(new DamageText(char.x + char.width / 2, char.y - 10, dmg));
                            enemy.hasHitPlayerThisAttack = true;
                        }
                    }
                });
            }
        },

        {
            type: 'quest',
            once: false,
            action: (setup) => {
                const char = setup.world.character;
                if (!char.isAttack || char.hasHitEnemyThisAttack) return;

                setup.townLevel.enemies.forEach(enemy => {
                    if (enemy.isDead || enemy.isRemoved) return;

                    if (char.isCollidingBeforeWithAttackHitbox(enemy, 25, 0, char.attackHitbox)) {
                        const hit = enemy.receiveHit(setup.world.timestamp, {
                            dmg: 1,
                            attackerFlipped: char.isFlipped,
                            knockX: 12,
                            knockY: 12,
                            deathRemoveMs: 2000,
                            onHurtSound: () => {
                                const sound = setup.sounds.enemyHurtSound.cloneNode();
                                sound.currentTime = 0;
                                sound.play();
                            },
                            onDeathSound: () => setup.world.audioManager.playOneShot('chickenDeathSound', { volume: 0.6 })
                        });

                        if (hit) {
                            char.hasHitEnemyThisAttack = true;
                        }
                    }
                });
            }
        },

        {
            type: 'quest',
            once: false,
            action: (setup) => {
                const char = setup.world.character;

                setup.townLevel.enemies.forEach(enemy => {
                    if (enemy.isDead || enemy.isRemoved) return;

                    if (char.isJumpOn(enemy)) {
                        enemy.isDead = true;
                        enemy.isMovingLeft = false;
                        enemy.isMovingRight = false;
                        enemy.removeAt = setup.world.timestamp + 2000;
                        console.log(enemy.removeAt)
                        enemy.isHurt = false; // optional: kein HURT-Anim bei Tod durch Sprung
                        setup.world.audioManager.playOneShot('chickenDeathSound', { volume: 0.6 });
                        char.movementCtrl.bounce();
                    }
                });
            }
        },

        {
            type: 'quest',
            once: false,
            action: (setup) => {
                // Entferne alle Gegner, die sich selbst als "entfernt" markiert haben
                setup.townLevel.enemies = setup.townLevel.enemies.filter(e => !e.isRemoved);

            }
        },

        {
            type: 'quest',
            once: false,
            action: (setup) => {
                const char = setup.world.character
                if (char.isHurt) return;
                setup.townLevel.enemies.forEach(enemy => {
                    if (enemy.isDead) return;
                    if (
                        enemy.currentEnemy === 'dragonSmall' &&
                        enemy.attackHitbox?.active &&
                        char
                    ) {
                        if (!enemy.hasHitPlayerThisAttack && enemy.isCollidingBeforeWithAttackHitbox(char, 0, 0, enemy.attackHitbox)) {
                            const dmg = char.isProtect ? 2 : 10;
                            char.combatCtrl.hit(setup.world.timestamp, dmg);
                            setup.statusBar.setPercentage(char.energy);
                            setup.damageTexts.push(new DamageText(char.x + char.width / 2, char.y - 10, dmg));
                            enemy.hasHitPlayerThisAttack = true;
                        }
                    }
                });
            }
        },

        //new Events von Check Collision from World

        // Spieler sammelt Coins ein
        {
            name: 'town_collect_coins',
            type: 'quest',
            once: false,
            action: (setup) => {
                const world = setup.world;
                const char = world.character;
                const coins = setup.townLevel.coins;
                const bar = setup.coinBar;

                for (let i = coins.length - 1; i >= 0; i--) {
                    const coin = coins[i];
                    if (char.isCollidingBefore(coin, 0, 0)) {
                        coins.splice(i, 1);
                        world.audioManager.playOneShot('coinSound', { volume: 0.4 });

                        // gleiche Logik wie vorher (effektiv +40, dann Clamp)
                        if (bar.percentage < 100) {
                            bar.percentage = Math.min(bar.percentage + 20, 100);
                        }
                        bar.setPercentage(bar.percentage);
                    }
                }
            }
        },

        // Spieler sammelt Bottles ein
        {
            name: 'town_collect_bottles',
            type: 'quest',
            once: false,
            action: (setup) => {
                const world = setup.world;
                const char = world.character;
                const bottles = setup.townLevel.bottles;
                const bar = setup.bottleBar;

                for (let i = bottles.length - 1; i >= 0; i--) {
                    const bottle = bottles[i];
                    if (char.isCollidingBefore(bottle, 0, 0) && bar.percentage !== 100) {
                        bottles.splice(i, 1);
                        world.audioManager.playOneShot('bottleClinkSound', { volume: 0.6 });

                        bar.percentage = Math.min(bar.percentage + 20, 100);
                        bar.setPercentage(bar.percentage);

                        if (char.throwableBottels < 5) {
                            char.throwableBottels += 1;
                        }
                    }
                }
            }
        },

        // Endboss sinkt nach dem Tod in den Boden
        {
            name: 'town_endboss_sinks',
            type: 'quest',
            once: false,
            action: (setup) => {
                const boss = setup.characters.endboss;
                if (!boss) return;

                if (boss.y >= 690 && boss.isDead && !boss.isUnderTheGround) {
                    if (boss.intervalMoveDownAfterDead) {
                        clearInterval(boss.intervalMoveDownAfterDead);
                    }
                    boss.isUnderTheGround = true;
                }
            }
        },

        // Logik für geworfene Flaschen
        {
            name: 'town_throwable_bottles',
            type: 'quest',
            once: false,
            action: (setup) => {
                const world = setup.world;
                const char = world.character;
                const bottles = setup.throwableObjects;
                const enemies = setup.townLevel.enemies;
                const boss = setup.characters.endboss;

                for (let i = bottles.length - 1; i >= 0; i--) {
                    const bottle = bottles[i];

                    // 1) Animation fertig → Bottle entfernen
                    if (!bottle.isBrokenAnimation && bottle.isBrokenAnimationDone) {
                        bottles.splice(i, 1);
                        char.isThrowing = false;
                        bottle.isBrokenSound = false;
                        continue;
                    }

                    // 2) Boden getroffen
                    if (bottle.y + bottle.height >= 670) {
                        if (!bottle.isBrokenSound) {
                            world.audioManager.playOneShot('bottleBrokenSound', { volume: 0.6 });
                            bottle.isBroken = true;
                            bottle.isThrow = false;
                            bottle.isGravity = false;
                            bottle.isBrokenAnimation = true;
                            bottle.isBrokenSound = true;
                            bottle.isMovingLeft = false;
                            bottle.isMovingRight = false;
                        }
                        if (!bottle.isBrokenAnimation) {
                            bottles.splice(i, 1);
                            char.isThrowing = false;
                            bottle.isBrokenSound = false;
                        }
                        continue;
                    }

                    // 3) Flasche fliegt noch → Kollision mit Enemies
                    if (!bottle.isBrokenAnimation) {
                        for (let j = 0; j < enemies.length; j++) {
                            const enemy = enemies[j];

                            // vorher: return; → hätte alle weiteren Gegner abgebrochen
                            if (enemy.currentEnemy === 'dragonSmall') continue;

                            if (bottle.isCollidingBefore(enemy, 50, 0) && !enemy.isDead) {
                                if (!bottle.isBrokenSound) {
                                    world.audioManager.playOneShot('bottleBrokenSound', { volume: 0.6 });
                                    bottle.isBrokenSound = true;
                                    bottle.isBroken = true;
                                    bottle.isThrow = false;
                                    bottle.isGravity = false;
                                    bottle.isBrokenAnimation = true;

                                    enemy.isDead = true;
                                    enemy.isMovingLeft = false;
                                    enemy.isMovingRight = false;
                                    world.audioManager.playOneShot('chickenDeathSound', { volume: 0.6 });


                                    const removeIndex = j;
                                    setTimeout(() => {
                                        enemies.splice(removeIndex, 1);
                                    }, 2000);
                                    break;
                                }
                            }
                        }

                        // 4) Kollision mit Endboss
                        if (boss && bottle.isCollidingBefore(boss, 0, 50) && !boss.isDead) {
                            if (!bottle.isBrokenSound) {
                                world.audioManager.playOneShot('bottleBrokenSound', { volume: 0.6 });
                                boss.isHurt = true;
                                boss.frameIndex = 0;

                                bottle.isBrokenSound = true;
                                bottle.isBroken = true;
                                bottle.isThrow = false;
                                bottle.isGravity = false;
                                bottle.isBrokenAnimation = true;

                                boss.energy -= 20;
                                setup.statusBar2.setPercentage(boss.energy);
                                if (boss.energy <= 0) {
                                    boss.isDead = true;
                                    boss.frameIndex = 0;
                                }
                            }
                        }
                    }
                }
            }
        },

        // Soul folgt dem Boss und steigt nach dem Tod hoch
        {
            name: 'town_soul_follow_and_rise',
            type: 'quest',
            once: false,
            action: (setup) => {
                const boss = setup.characters.endboss;
                const soul = setup.characters.soul;
                if (!boss || !soul) return;

                // Solange Boss lebt → Soul "klebt" an ihm
                if (!boss.isDead) {
                    soul.x = boss.x + 75;
                    soul.y = boss.y + 200;
                    return;
                }

                // Boss ist tot → Soul steigt hoch, bis y <= 250
                if (boss.isDead && soul.y >= 250) {
                    soul.y -= 1.5;
                }
            }
        },

        // Musik-Fade + Soul-Cutscene / Meditation
        {
            name: 'town_soul_cutscene',
            type: 'quest',
            once: false,
            action: (setup) => {
                const world = setup.world;
                const boss = setup.characters.endboss;
                const soul = setup.characters.soul;
                const sounds = setup.sounds;
                const audio = world.audioManager;

                if (!boss || !soul) return;

                // Cutscene startet, wenn Soul oben angekommen ist
                if (soul.y > 250 || boss.isFly) return;

                audio.fadeOutAudio(setup.endbossMusic, 3000);
                sounds.soulMusic.loop = true;
                audio.fadeInAudio(sounds.soulMusic, 3000, 0.1);
                audio.safePlay(sounds.soulSpeakSound);
                // 3) Nach ~18s: Meditation + Soul findet Frieden
                if (sounds.soulSpeakSound.currentTime >= 18) {
                    const char = world.character;

                    char.isMeditation = true;
                    soul.updateAnimationState('findsPeace', 1000 / 5);
                    boss.isFindsPeace = true;

                    if (soul.y >= -500) {
                        soul.y -= 1;
                    }

                    audio.fadeAudioTo(sounds.soulMusic, 8000, 1);
                }
            }
        },

        // Nahkampf-Hit auf Endboss
        {
            name: 'town_melee_hits_boss',
            type: 'quest',
            once: false,
            action: (setup) => {
                const world = setup.world;
                const char = world.character;
                const boss = setup.characters.endboss;

                if (!char || !boss) return;
                if (!char.isAttack || char.hasHitEnemyThisAttack || boss.isDead) return;

                if (char.isCollidingBeforeWithAttackHitbox(
                    boss,
                    0,
                    0,
                    char.attackHitbox
                )) {
                    boss.isHurt = true;
                    boss.frameIndex = 0;
                    boss.energy -= 5;
                    setup.statusBar2.setPercentage(boss.energy);

                    char.hasHitEnemyThisAttack = true;

                    if (boss.energy <= 0) {
                        boss.isDead = true;
                        boss.frameIndex = 0;
                    }
                }
            }
        },

        // Wurf von Flaschen mit Taste D
        {
            name: 'town_throw_bottle_input',
            type: 'quest',
            once: false,
            action: (setup) => {
                const world = setup.world;
                const char = world.character;

                // Cooldown wie vorher in checkThrowObjects
                if (world.timestamp - world.lastThrowCheck < world.throwCheckDelay) return;

                // Taste D muss gedrückt sein
                if (!world.keyboard.D) return;

                world.lastThrowCheck = world.timestamp;

                // Kann der Charakter aktuell überhaupt werfen?
                const canThrow =
                    char.throwableBottels > 0 &&
                    !char.isThrowing &&
                    !char.isAttack &&
                    !char.isProtect;

                if (canThrow) {
                    let bottle;

                    if (!char.isFlipped) {
                        bottle = new ThrowableObject(char.x + 35, char.y + 150);
                        bottle.isMovingRight = true;
                        bottle.characterIsFlipped = false;
                    } else {
                        bottle = new ThrowableObject(char.x - 35, char.y + 150);
                        bottle.isMovingLeft = true;
                        bottle.characterIsFlipped = true;
                    }

                    bottle.isThrow = true;
                    bottle.isBroken = false;
                    bottle.speedY = 30;
                    bottle.isGravity = true;

                    setup.throwableObjects.push(bottle);

                    // Sound + UI-Update wie vorher
                    world.audioManager.playOneShot('bottleThrowSound', { volume: 0.6 });

                    const bar = setup.bottleBar;
                    bar.percentage = Math.min(bar.percentage - 20, 100);
                    bar.setPercentage(bar.percentage);

                    if (char.throwableBottels > 0) {
                        char.throwableBottels -= 1;
                    }
                    char.isThrowing = true;

                } else if (char.throwableBottels === 0) {
                    // Keine Flaschen mehr → leeres "Klick" Geräusch
                    world.audioManager.playOneShot('bottleEmptySound', { volume: 0.6 });
                }
            }
        },
    ];