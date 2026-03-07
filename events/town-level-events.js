import { PopupText } from "../classes/ui/popup-text.class.js";
import { Enemy } from "../classes/entities/enemy.class.js";
import { DamageText } from "../classes/ui/damage-text.class.js";

export const townEvents =
    [
        {
            type: 'quest',
            action: (setup) => {
                setup.sounds.backgroundMusic.loop = true;
                setup.world.audioManager.fadeInAudio(setup.sounds.backgroundMusic, 2000, 0.6);
                setup.world.character.x = 100; // 100 //18500//23000
                setup.world.character.level_start_x = 0;
                setup.world.level_end_x = 25000;
                setup.world.camera_x = 0; //0 // 18400 //22900
                setup.world.character.speedX = 10;
                setup.world.character.isWalkDetermined = false;
                setup.characters.tadeo.updateAnimationState('idle', 1000 / 5);
                setup.world.character.speedX = 3; //2
                setup.world.initTasks();
                setup.world.taskWindow.y = 180;
            }
        },

        {
            type: "collision",
            objectA: 'character',
            objectB: 'houseDestroyed',
            toleranceB: { x: 200, width: 200 },
            action: (setup) => {
                setup.dialogManager.startDialog(0, setup.world.timestamp);
            }
        },

        {
            type: 'quest',
            action: (setup) => {
                setup.environment.stableDestroyed.animSeqCtrl.start([
                    { anim: 'smokeA', fps: 10, pause: 0, audio: { name: "stableSmokeSound", volume: 1.0 } },
                    { anim: "idle", fps: 0, pause: 3000 },
                    { anim: 'smokeB', fps: 10, pause: 0 },
                    { anim: "idle", fps: 0, pause: 3000 }
                ],
                    setup.world.townLevelController.timerManager,
                    { loop: true, audioManager: setup.world.audioManager }
                );
            }
        },

        {
            type: 'quest',
            action: (setup) => {
                setup.environment.millDestroyed.animSeqCtrl.start([
                    { anim: 'forward', fps: 6.5, pause: 0, audio: { name: "millScratchySound", volume: 1.0 } },
                    { anim: "idleB", fps: 0, pause: 5000 },
                    { anim: 'backward', fps: 6.5, pause: 0, audio: { name: "millScratchySound", volume: 1.0 } },
                    { anim: "idle", fps: 0, pause: 5000 },
                ],
                    setup.world.townLevelController.timerManager,
                    { loop: true, audioManager: setup.world.audioManager }
                );
            }
        },

        {
            type: "position",
            area: { x: 1300, width: 100 },
            action: (setup) => {
                setup.world.audioManager.fadeOutAudio(setup.sounds.backgroundMusic, 1000);
                setup.sounds.sadMomentMusic.loop = true;
                setup.world.audioManager.fadeInAudio(setup.sounds.sadMomentMusic, 2000, 0.3);
            }
        },

        {
            type: "collision",
            objectA: 'character',
            objectB: 'stableDestroyed',
            toleranceB: { x: -400, width: -400 },
            once: false,
            action: (setup) => {
                setup.environment.stableDestroyed.audioEnabled = true;
            },
            onLeave: (setup) => {
                setup.environment.stableDestroyed.audioEnabled = false;
                setup.world.audioManager.stopAll("stableSmokeSound");
            }
        },

        {
            type: "collision",
            objectA: 'character',
            objectB: 'millDestroyed',
            toleranceB: { x: -400, width: -400 },
            once: false,
            action: (setup) => {
                setup.environment.millDestroyed.audioEnabled = true;
            },
            onLeave: (setup) => {
                setup.environment.millDestroyed.audioEnabled = false;
                setup.world.audioManager.stopAll("millScratchySound");
            }
        },

        {
            type: "collision",
            objectA: 'character',
            objectB: 'houseDestroyed',
            toleranceB: { x: -400, width: -400 },
            once: false,
            action: (setup) => {
                if (!setup.isNearDestroyedHouse) {
                    setup.isNearDestroyedHouse = true;
                    setup.sounds.houseFireSound.currentTime = 0;
                    setup.sounds.houseFireSound.loop = true;
                    setup.world.audioManager.fadeInAudio(setup.sounds.houseFireSound, 2000, 0.3);
                }
            },
            onLeave: (setup) => {
                if (setup.isNearDestroyedHouse) {
                    setup.isNearDestroyedHouse = false;
                    setup.world.audioManager.fadeOutAudio(setup.sounds.houseFireSound, 1000);
                }
            }
        },

        {
            type: "collision",
            objectA: 'character',
            objectB: 'houseDestroyed',
            toleranceB: { x: 45, width: 30 },
            once: false,
            action: (setup) => {
                setup.world.character.walkOnDestroyedHouse = true;
                setup.world.character.speedX = 2;
            },
            onLeave: (setup) => {
                setup.world.character.walkOnDestroyedHouse = false;
                setup.world.character.speedX = 3;
            }
        },


        // {
        //     type: "position",
        //     area: { x: 200, width: 100 },
        //     action: (setup) => {
        //         setup.townLevel.enemies.push(
        //             new Enemy('dragonSmall', setup.entityImages, 170, 170, 300, 1000, setup.allAudios),
        //         )
        //         setup.townLevel.enemies.forEach(enemy => {
        //             enemy.curentAnimation = 'idle';
        //             enemy.world = setup.world;
        //         });
        //     }
        // },

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
            area: { x: 4000, width: 100 },
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
                const intensity = Math.min(1, progress * 0.5);
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
            area: { x: 5000, width: 100 },
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
                const intensity = Math.min(1, 0.5 + progress * 0.5);
                ctrl.setSandstorm(intensity);
            },
            onEnd: (setup) => {
                const ctrl = setup.world.townLevelController;
                ctrl.setSandstorm(1.0);
                // setup.world.character.isWalkInStorm = true;
                setup.world.character.speedX = 5; //2
                ctrl.questManager.advance(5);
            }
        },

        {
            type: "position",
            area: { x: 6000, width: 100 },
            step: 5,
            action: (setup) => {
                setup.world.townLevelController.stormHazards.enabled = true;
                setup.world.audioManager.fadeOutAudio(setup.sounds.sadMomentMusic, 1000);
                setup.sounds.stormHazardMusic.loop = true;
                setup.world.audioManager.fadeInAudio(setup.sounds.stormHazardMusic, 2000, 0.8);
                setup.world.townLevelController.questManager.advance(6)
            }
        },

        {
            type: "position",
            area: { x: 10500, width: 100 },
            step: 6,
            action: (setup) => {
                setup.world.townLevelController.stormHazards.setDifficulty('hard');
                setup.world.audioManager.fadeOutAudio(setup.sounds.stormHazardMusic, 1000);
                setup.sounds.finalStormHazardMusic.loop = true;
                setup.world.audioManager.fadeInAudio(setup.sounds.finalStormHazardMusic, 1000, 0.8);
            }
        },

        {
            type: "position",
            area: { x: 15000, width: 100 },
            step: 6,
            action: (setup) => {
                setup.world.townLevelController.stormHazards.enabled = false;
                setup.characters.tadeo.updateAnimationState('walk');
                setup.world.character.isCollapse = true;
                setup.world.character.isMovingLeft = false
                setup.world.character.isMovingRight = false
                setup.world.isKeysStopp = true;
                setup.environment.nayeliSpirit.fadeIn(setup.world.timestamp, 2000);
                setup.world.audioManager.fadeOutAudio(setup.sounds.finalStormHazardMusic, 1000);
                setup.sounds.nayelisMusic.loop = true;
                setup.world.audioManager.fadeInAudio(setup.sounds.nayelisMusic, 2000, 0.3);
                setup.sounds.spiritAppearsSound.play();
                setup.environment.nayeliSpirit.updateAnimationState('walk', 1000 / 10);
                setup.world.townLevelController.questManager.advance(7)
            }
        },

        {
            type: "quest",
            step: 7,
            once: false,
            action: (setup) => {
                const nayeliSpirit = setup.environment.nayeliSpirit;
                const arriveX = nayeliSpirit.moveToX(15050, { speed: 0.8 });
                if (arriveX) {
                    setup.environment.nayeliSpirit.updateAnimationState('idle', 1000 / 8);
                    setup.sounds.nayelisSpiritSpeakSound.play();
                    setup.world.townLevelController.questManager.advance(8);
                }
            }
        },

        {
            type: "quest",
            step: 8,
            action: (setup) => {
                setup.dialogManager.startDialog(1, setup.world.timestamp, () => {
                    setup.environment.nayeliSpirit.updateAnimationState('blessing', 1000 / 6);
                    setup.sounds.spiritAppearsSound.play();
                    setup.environment.nayeliSpirit.fadeOut(setup.world.timestamp, 1600);
                    setup.world.townLevelController.questManager.advance(9);
                })
            }
        },

        {
            type: "position",
            area: { x: 16000, width: 100 },
            action: (setup) => {
                setup.townLevel.enemies.push(
                    new Enemy('chickenMutatesSmall', setup.entityImages, 120, 120, 545, 17000, setup.allAudios, setup.world),
                    new Enemy('chickenMutatesSmall', setup.entityImages, 120, 120, 545, 17100, setup.allAudios, setup.world),
                    new Enemy('chickenMutatesBig', setup.entityImages, 160, 160, 505, 17200, setup.allAudios, setup.world),
                );
            }
        },

        {
            type: "position",
            area: { x: 17000, width: 100 },
            action: (setup) => {
                setup.townLevel.enemies.push(
                    new Enemy('chickenMutatesSmall', setup.entityImages, 120, 120, 545, 18000, setup.allAudios, setup.world),
                    new Enemy('chickenMutatesSmall', setup.entityImages, 120, 120, 545, 18100, setup.allAudios, setup.world),
                    new Enemy('chickenMutatesBig', setup.entityImages, 160, 160, 505, 18200, setup.allAudios, setup.world)
                );
            }
        },

        {
            type: "position",
            area: { x: 18000, width: 100 },
            action: (setup) => {
                setup.townLevel.enemies.push(
                    new Enemy('chickenMutatesSmall', setup.entityImages, 120, 120, 545, 19000, setup.allAudios, setup.world),
                    new Enemy('chickenMutatesSmall', setup.entityImages, 120, 120, 545, 19100, setup.allAudios, setup.world),
                    new Enemy('chickenMutatesBig', setup.entityImages, 160, 160, 505, 19200, setup.allAudios, setup.world)
                );
            }
        },

        {
            type: "position",
            area: { x: 19000, width: 100 },
            action: (setup) => {
                setup.townLevel.enemies.push(
                    new Enemy('chickenMutatesSmall', setup.entityImages, 120, 120, 545, 20000, setup.allAudios, setup.world),
                    new Enemy('chickenMutatesSmall', setup.entityImages, 120, 120, 545, 20100, setup.allAudios, setup.world),
                    new Enemy('chickenMutatesBig', setup.entityImages, 160, 160, 505, 20200, setup.allAudios, setup.world),
                );
            }
        },

        {
            type: "quest",
            step: 9,
            once: false,
            action: (setup) => {
                const tadeo = setup.characters.tadeo;
                const arriveX = tadeo.moveToX(15020, { speed: 5 });
                if (arriveX) {
                    setup.characters.tadeo.updateAnimationState('idle');
                    // setup.speechBubbles[0].start(4500);
                    setup.world.townLevelController.questManager.advance(10);
                }
            }
        },

        {
            type: "time",
            delay: 2000,
            step: 9,
            action: (setup) => {
                setup.world.audioManager.fadeOutAudio(setup.sounds.nayelisMusic, 1000);
                setup.world.audioManager.fadeInAudio(setup.sounds.tadeosMusic, 2000, 0.6);
            }
        },

        {
            type: "time",
            delay: 3000,
            step: 10,
            action: (setup) => {
                setup.sounds.tadeoHoldStoneMusic.loop = true;
                setup.world.audioManager.fadeInAudio(setup.sounds.tadeoHoldStoneMusic, 2000, 0.6);
                setup.world.audioManager.fadeOutAudio(setup.sounds.tadeosMusic, 1000);
                setup.sounds.tadeosSpeakSound.play();
                setup.characters.tadeo.updateAnimationState('stoneActivated', 1000 / 5.5);
                setup.panel.activate(performance.now());
                setup.world.townLevelController.magicShield.start();
                setup.world.audioManager.playOneShot("shieldLoadingSound", 0.7);
                setup.speechBubblesTadeo[0].start(1000);
                setup.dialogManager.startDialog(2, setup.world.timestamp);
            }
        },

        {
            type: "time",
            delay: 13000,
            step: 10,
            action: (setup) => {
                setup.world.character.isCollapse = false;
                setup.world.isKeysStopp = false;
                setup.world.character.isStandUpAfterCollapse = true;
                setup.world.character.isWalkInStorm = false;
                setup.world.character.speedX = 5;
                setup.characters.tadeo.updateAnimationState('walkWithStone');
                setup.characters.tadeo.isFlipped = false;
                setup.world.townLevelController.questManager.advance(11);
            }
        },

        {
            type: 'collision',
            objectA: 'character',
            objectB: 'tadeo',
            toleranceB: { x: -50, width: -50 },
            step: 11,
            once: false,
            action: (setup) => {
                const tadeo = setup.characters.tadeo;
                const arriveX = tadeo.moveToX(17775, { speed: 0.8 });
                if (setup.isTadeoAfraid || setup.isTadeoPanic) {
                    tadeo.isMovingRight = false;
                    return;
                }
                if (!arriveX) setup.characters.tadeo.updateAnimationState('walkWithStone');
                if (arriveX) setup.characters.tadeo.updateAnimationState('idleWithStone');
            },
            onLeave: (setup) => {
                if (setup.isTadeoAfraid || setup.isTadeoPanic) return;
                setup.characters.tadeo.isMovingRight = false;
                setup.characters.tadeo.updateAnimationState('idleWithStone');
            }
        },

        {
            type: 'collision',
            objectA: 'tadeo',
            objectB: 'enemies',
            toleranceA: { x: -300, width: -300 },
            step: 11,
            once: false,
            action: (setup, tadeo) => {
                const wasAfraid = !!setup.isTadeoAfraid;
                setup.isTadeoAfraid = true;
                if (setup.isTadeoPanic) return
                if (!wasAfraid) {
                    tadeo.updateAnimationState('afraid', 1000 / 6);
                } else {
                    tadeo.updateAnimationState('afraidLoop', 1000 / 6);
                }
            },
            onLeave: (setup) => {
                if (!setup.isTadeoPanic) {
                    setup.characters.tadeo.updateAnimationState('standUp', 1000 / 6);
                }
                setup.world.townLevelController.eventManager.emitNow("afraidReset");
            }
        },

        {
            type: "time",
            resetOn: "afraidReset",
            delay: 1500,
            manual: true,
            step: 11,
            once: true,
            action: (setup) => {
                setup.isTadeoAfraid = false;
            }
        },

        {
            type: 'collision',
            objectA: 'tadeo',
            objectB: 'enemies',
            toleranceA: { x: -300, width: -300 },
            once: false,
            step: 11,
            cooldown: 10000,
            condition: (setup) => {
                const now = performance.now();
                const speechOk = now >= (setup.tadeoSpeechLockUntil ?? 0);
                const panicGraceOk = now >= (setup.tadeoPanicUntil ?? 0);
                return speechOk && panicGraceOk && setup.isTadeoAfraid && !setup.isTadeoPanic;
            },
            action: (setup) => {
                const now = performance.now();
                const lockUntil = now + 2200;
                setup.tadeoSpeechLockUntil = Math.max(setup.tadeoSpeechLockUntil ?? 0, lockUntil);
                const bubbles = setup.speechBubblesTadeoAfraid;
                const idx = (Math.random() * bubbles.length) | 0;
                setup._tadeoAfraidIdx = idx;
                bubbles[idx].start();
                setup.world.audioManager.playOneShot(`vo_tadeo_afraid_0${idx + 1}`, { volume: 0.9 });
                setup.world.townLevelController.eventManager.emitNow("tadeoAfraidBubbleRender");
            }
        },

        {
            type: "time",
            resetOn: "tadeoAfraidBubbleRender",
            manual: true,
            once: false,
            from: 0,
            to: 2600,
            step: 11,
            action: (setup) => {
                const i = setup._tadeoAfraidIdx ?? 0;
                setup.speechBubblesTadeoAfraid[i].render(
                    setup.world.ctx,
                    setup.world.townLevelController.renderCameraX,
                    -40
                );
            }
        },

        {

            type: 'collision',
            objectA: 'tadeo',
            objectB: 'projectiles',
            toleranceA: { x: -300, width: -300 },
            step: 11,
            once: false,
            action: (setup, tadeo) => {
                setup.isTadeoPanic = true;
                setup.tadeoPanicUntil = performance.now() + 1200;
                tadeo.updateAnimationState('panic', 1000 / 6);
            },
            onLeave: (setup, tadeo) => {
                tadeo.updateAnimationState('standUp', 1000 / 6);
                setup.world.townLevelController.eventManager.emitNow("panicReset");
            }
        },

        {
            type: 'collision',
            objectA: 'tadeo',
            objectB: 'enemies',
            toleranceA: { x: -60, width: -60 },
            step: 11,
            once: false,
            action: (setup, tadeo) => {
                setup.isTadeoPanic = true;
                setup.tadeoPanicUntil = performance.now() + 1200;
                tadeo.updateAnimationState('panic', 1000 / 6);
            },
            onLeave: (setup, tadeo) => {
                tadeo.updateAnimationState('standUp', 1000 / 6);
                setup.world.townLevelController.eventManager.emitNow("panicReset");
            }
        },

        {
            type: "time",
            resetOn: "panicReset",
            delay: 1500,
            manual: true,
            step: 11,
            once: true,
            action: (setup) => {
                setup.isTadeoPanic = false;
                setup.tadeoPanicUntil = Math.max(setup.tadeoPanicUntil ?? 0, performance.now() + 200); if (setup.isTadeoAfraid) {
                    setup.characters.tadeo.updateAnimationState('afraidLoop', 1000 / 6);
                }
            }
        },

        {
            type: 'collision',
            objectA: 'tadeo',
            objectB: 'projectiles',
            toleranceA: { x: -300, width: -300 },
            once: false,
            step: 11,
            cooldown: 7000,
            condition: (setup) => {
                const now = performance.now();
                if (!setup.isTadeoPanic) return false;
                if (now < (setup.tadeoSpeechLockUntil ?? 0)) return false;
                return true;
            },
            action: (setup) => {
                const now = performance.now();
                const lockUntil = now + 2200;
                setup.tadeoSpeechLockUntil = Math.max(setup.tadeoSpeechLockUntil ?? 0, lockUntil);
                const bubbles = setup.speechBubblesTadeoPanic;
                const idx = (Math.random() * bubbles.length) | 0;
                setup._tadeoPanicProjIdx = idx;
                bubbles[idx].start();
                setup.world.audioManager.playOneShot(`vo_tadeo_panic_0${idx + 1}`, { volume: 1.0 });
                setup.world.townLevelController.eventManager.emitNow("tadeoPanicProjBubbleRender");
            }
        },

        {
            type: 'collision',
            objectA: 'tadeo',
            objectB: 'enemies',
            toleranceA: { x: -60, width: -60 },
            once: false,
            step: 11,
            cooldown: 7000,
            condition: (setup) => {
                const now = performance.now();
                if (!setup.isTadeoPanic) return false;
                if (now < (setup.tadeoSpeechLockUntil ?? 0)) return false;
                return true;
            },
            action: (setup) => {
                const now = performance.now();
                const lockUntil = now + 2200;
                setup.tadeoSpeechLockUntil = Math.max(setup.tadeoSpeechLockUntil ?? 0, lockUntil);
                const bubbles = setup.speechBubblesTadeoPanic;
                const idx = (Math.random() * bubbles.length) | 0;
                setup._tadeoPanicNearIdx = idx;
                bubbles[idx].start();
                setup.world.audioManager.playOneShot(`vo_tadeo_panic_0${idx + 1}`, { volume: 1.0 });
                setup.world.townLevelController.eventManager.emitNow("tadeoPanicNearBubbleRender");
            }
        },

        {
            type: "time",
            resetOn: "tadeoPanicProjBubbleRender",
            manual: true,
            once: false,
            from: 0,
            to: 2000,
            step: 11,
            action: (setup) => {
                const i = setup._tadeoPanicProjIdx ?? 0;
                setup.speechBubblesTadeoPanic[i].render(
                    setup.world.ctx,
                    setup.world.townLevelController.renderCameraX,
                    -40
                );
            }
        },

        {
            type: "time",
            resetOn: "tadeoPanicNearBubbleRender",
            manual: true,
            once: false,
            from: 0,
            to: 2000,
            step: 11,
            action: (setup) => {
                const i = setup._tadeoPanicNearIdx ?? 0;
                setup.speechBubblesTadeoPanic[i].render(
                    setup.world.ctx,
                    setup.world.townLevelController.renderCameraX,
                    -40
                );
            }
        },

        {
            name: "tadeo_help_give_bottles",
            type: "collision",
            objectA: "tadeo",
            objectB: "enemies",
            toleranceA: { x: -600, width: -600 },
            step: 11,
            once: false,
            cooldown: 1000, // klein lassen, weil wir mit Flag "pro empty phase" begrenzen
            condition: (setup) => {
                const char = setup.world.character;
                const tadeo = setup.characters.tadeo;
                if (!char || !tadeo) return false;

                // pro empty phase nur einmal
                if (setup._tadeoHelpGivenEmpty) return false;

                // nur wenn wirklich empty
                if ((char.throwableBottels ?? 0) > 0) return false;

                // nicht während panic
                if (setup.isTadeoPanic) return false;
                const now = performance.now();
                if (now < (setup.tadeoSpeechLockUntil ?? 0)) return false;

                const list = setup.townLevel?.enemies ?? [];

                // innerhalb 300 -> keine Hilfe mehr
                const tolB0 = { x: 0, y: 0, width: 0, height: 0 };
                const tol300 = { x: -300, width: -300 };
                const enemyIn300 = list.some(e =>
                    e && !e.isDead && !e.isRemoved &&
                    tadeo.isColliding(e, tol300, tolB0)
                );
                if (enemyIn300) return false;

                // innerhalb 600 -> ja, Hilfe
                const tol600 = { x: -600, width: -600 };
                const enemyIn600 = list.some(e =>
                    e && !e.isDead && !e.isRemoved &&
                    tadeo.isColliding(e, tol600, tolB0)
                );
                return enemyIn600;
            },

            action: (setup) => {
                const now = performance.now();
                setup.tadeoHelpUntil = Math.max(setup.tadeoHelpUntil ?? 0, now + 2000);
                const char = setup.world.character;
                const audio = setup.world.audioManager;

                const give = 2;

                // Flag setzen -> diese Empty-Phase ist erledigt
                setup._tadeoHelpGivenEmpty = true;

                // Speech lock: verhindert afraid/panic barks kurzzeitig
                const lockUntil = now + 2200;
                setup.tadeoSpeechLockUntil = Math.max(setup.tadeoSpeechLockUntil ?? 0, lockUntil);
                setup.tadeoPanicUntil = Math.max(setup.tadeoPanicUntil ?? 0, lockUntil); // <-- NEU
                // Inventar + UI-Bar
                char.throwableBottels = (char.throwableBottels ?? 0) + give;

                const bar = setup.bottleBar;
                if (bar) {
                    for (let i = 0; i < give; i++) {
                        bar.percentage = Math.min((bar.percentage ?? 0) + 20, 100);
                        bar.setPercentage(bar.percentage);
                    }
                }

                // Sounds
                audio.playOneShot("bottleClinkSound", { volume: 0.9 });
                setTimeout(() => audio.playOneShot("bottleClinkSound", { volume: 0.9 }), 150);

                // Bubble + VO
                const bubbles = setup.speechBubblesTadeoHelp;
                const idx = (Math.random() * bubbles.length) | 0;
                setup._tadeoHelpIdx = idx;

                bubbles[idx].start();
                audio.playOneShot(`vo_tadeo_help_0${idx + 1}`, { volume: 0.95 });
                setup.world.townLevelController.eventManager.emitNow("tadeoHelpBubbleRender");
            }
        },

        {
            name: "tadeo_help_reset_empty_phase",
            type: "quest",
            step: 11,
            once: false,
            action: (setup) => {
                const c = setup.world.character;
                if (!c) return;
                if ((c.throwableBottels ?? 0) > 0) {
                    setup._tadeoHelpGivenEmpty = false;
                }
            }
        },

        {
            name: "tadeo_help_bubble_render",
            type: "time",
            resetOn: "tadeoHelpBubbleRender",
            manual: true,
            once: false,
            from: 0,
            to: 2800,
            step: 11,
            action: (setup) => {
                const now = performance.now();
                if (now > (setup.tadeoHelpUntil ?? 0)) return;
                const i = setup._tadeoHelpIdx ?? 0;
                setup.speechBubblesTadeoHelp[i].render(
                    setup.world.ctx,
                    setup.world.townLevelController.renderCameraX,
                    -40
                );
            }
        },

        {
            type: 'quest',
            step: 11,
            once: false,
            action: (setup) => {
                const char = setup.world.character;
                const tadeo = setup.characters.tadeo;
                const radius = 180;
                const left = tadeo.x - radius;
                const right = tadeo.x + radius;
                if (char.x < left) char.x = left;
                if (char.x > right) char.x = right;
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
                    setup.world.audioManager.fadeOutAudio(setup.sounds.backgroundMusic, 1000);
                    setup.world.audioManager.fadeInAudio(setup.sounds.musicianTownMusic, 2000, 0.6);
                }
            },
            onLeave: (setup) => {
                if (setup.isNearMusician) {
                    setup.isNearMusician = false;
                    setup.sounds.backgroundMusic.currentTime = 0;
                    setup.world.audioManager.fadeOutAudio(setup.sounds.musicianTownMusic, 1000);
                    setup.world.audioManager.fadeInAudio(setup.sounds.backgroundMusic, 2000, 0.6);
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
                    setup.world.audioManager.fadeOutAudio(setup.sounds.backgroundMusic, 1000);
                    setup.world.audioManager.fadeInAudio(setup.sounds.sollitasMusic, 2000, 0.6);
                }
            },
            onLeave: (setup) => {
                if (setup.isNearSollita) {
                    setup.isNearSollita = false;
                    setup.sounds.backgroundMusic.currentTime = 0;
                    setup.world.audioManager.fadeOutAudio(setup.sounds.sollitasMusic, 1000);
                    setup.world.audioManager.fadeInAudio(setup.sounds.backgroundMusic, 2000, 0.6);
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
                setup.world.audioManager.fadeOutAudio(setup.sounds.backgroundMusic, 1000);
                setup.world.audioManager.fadeInAudio(setup.sounds.endbossMusic, 2000, 0.6);
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
                setup.townLevel.projectiles.forEach(element => {
                    if (!element.isActive) return;
                    if (element.currentAnimation === "explode") return;
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
                        const hit = enemy.combatCtrl.receiveHit(setup.world.timestamp, {
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
                    if (bottle.markedForRemoval) {
                        bottle.isBrokenSound = false;
                        continue;
                    }
                    const groundBottomY = 680;
                    const footY = bottle.y + bottle.height - (bottle.offset?.bottom ?? 0);
                    // 2) Boden getroffen
                    if (footY >= groundBottomY) {
                        // SNAP: exakt auf Boden setzen
                        bottle.y = groundBottomY - bottle.height + (bottle.offset?.bottom ?? 0);
                        if (!bottle.isBrokenSound) {
                            world.audioManager.playOneShot('bottleBrokenSound', { volume: 0.6 });
                            bottle.isBrokenSound = true;
                            bottle.isBroken = true;
                            bottle.isThrow = false;
                            bottle.isGravity = false;
                            bottle.isBrokenAnimation = true;
                            bottle.isMovingLeft = false;
                            bottle.isMovingRight = false;
                        }
                        continue;
                    }

                    // 3) Flasche fliegt noch → Kollision mit Enemies
                    if (!bottle.isBroken && !bottle.markedForRemoval && !bottle.isBrokenAnimation) {
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
                                    enemy.removeAt = setup.world.timestamp + 2000;
                                    world.audioManager.playOneShot('chickenDeathSound', { volume: 0.6 });
                                    break;
                                }
                            }
                        }

                        // 4) Kollision mit Endboss
                        if (!bottle.isBroken && !bottle.markedForRemoval && !bottle.isBrokenAnimation) {
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
        // {
        //     name: 'town_throw_bottle_input',
        //     type: 'quest',
        //     once: false,
        //     action: (setup) => {
        //         const world = setup.world;
        //         const char = world.character;

        //         // Cooldown wie vorher in checkThrowObjects
        //         if (world.timestamp - world.lastThrowCheck < world.throwCheckDelay) return;

        //         // Taste D muss gedrückt sein
        //         if (!world.keyboard.D) return;

        //         world.lastThrowCheck = world.timestamp;

        //         // Kann der Charakter aktuell überhaupt werfen?
        //         const noMoveInput = !world.keyboard.LEFT && !world.keyboard.RIGHT;
        //         const throwIsIdle =
        //             !char.isThrowing && (char.currentAnimation !== 'throw' || char.animationFinished);
        //         const canThrow =
        //             !char.isThrowing &&
        //             noMoveInput &&
        //             char.throwableBottels > 0 &&
        //             !char.isAttack &&
        //             !char.isProtect &&
        //             throwIsIdle;


        //         if (canThrow) {
        //             char.isThrowing = true;
        //             char.currentAnimation = 'throw';
        //             char.frameIndex = 0;
        //             char.sheetIndex = 0;
        //             char.animationFinished = false;
        //             char.lastFrameTime = null;
        //             char.deferSizeUpdate = true;
        //             char._thrownThisAnim = false;
        //             world.throwStartTime = world.timestamp;
        //             world.throwCommitUntil = world.timestamp + 100;
        //             const bar = setup.bottleBar;
        //             bar.percentage = Math.min(bar.percentage - 20, 100);
        //             bar.setPercentage(bar.percentage);

        //             if (char.throwableBottels > 0) {
        //                 char.throwableBottels -= 1;
        //             }
        //         } else if (char.throwableBottels === 0) {
        //             // Keine Flaschen mehr → leeres "Klick" Geräusch
        //             world.audioManager.playOneShot('bottleEmptySound', { volume: 0.6 });
        //         }
        //     }
        // },

        {
            name: "town_throw_bottle_hold",
            type: "hold",
            requireKey: "D",
            duration: 600,
            once: false,

            onCancel: (setup, char, _b, progress) => {
                const world = setup.world;
                const c = world.character;

                // losgelassen ohne wirklich zu halten? -> ignorieren
                if (!progress || progress < 0.08) return;

                const noMoveInput = !world.keyboard.LEFT && !world.keyboard.RIGHT;
                const throwIsIdle = !c.isThrowing && (c.currentAnimation !== "throw" || c.animationFinished);

                const canThrow =
                    !c.isThrowing &&
                    noMoveInput &&
                    (c.throwableBottels ?? 0) > 0 &&
                    !c.isAttack &&
                    !c.isProtect &&
                    throwIsIdle;

                if (!canThrow) {
                    if ((c.throwableBottels ?? 0) === 0) {
                        world.audioManager.playOneShot("bottleEmptySound", { volume: 0.6 });
                    }
                    return;
                }

                // charge für den Spawn merken (0..1)
                setup.pendingThrowCharge = Math.min(Math.max(progress, 0), 1);

                // Throw starten
                c.isThrowing = true;
                c.currentAnimation = "throw";
                c.frameIndex = 0;
                c.sheetIndex = 0;
                c.animationFinished = false;
                c.lastFrameTime = null;
                c.deferSizeUpdate = true;
                c._thrownThisAnim = false;

                // bottle bar -20
                const bar = setup.bottleBar;
                if (bar) {
                    bar.percentage = Math.max((bar.percentage ?? 0) - 20, 0);
                    bar.setPercentage(bar.percentage);
                }

                // inventar -1
                c.throwableBottels = Math.max((c.throwableBottels ?? 0) - 1, 0);
            }
        },

        {
            name: "town_throw_charge_ring",
            type: "time",
            once: false,
            from: 0,
            to: Infinity,
            action: (setup) => {
                const c = setup.world.character;
                const world = setup.world;
                if (!c) return;
                if ((c.throwableBottels ?? 0) <= 0) return;
                if (world.keyboard.LEFT || world.keyboard.RIGHT) return;
                const p = setup.throwHoldProgress ?? 0;
                if (p <= 0) return;

                const ctx = setup.world.ctx;
                const camX = setup.world.townLevelController.renderCameraX;
                const char = setup.world.character;
                if (!char) return;

                // ✅ Kopf-Anchor über Hitbox (unabhängig von Sprite-Höhe)
                const hb = char.getHitboxRect?.();
                const headY = hb ? hb.top : char.y;
                const headX = hb ? hb.cx : (char.x + char.width * 0.5);

                const x = (headX - camX);
                const y = headY - 40;  // Abstand über Kopf (tunen 18–28)
                const r = 18;

                // Full-charge pulse
                const full = p >= 1;
                const pulse = full ? (0.85 + 0.15 * Math.sin(performance.now() / 90)) : 1;

                ctx.save();

                // Soft glow background
                ctx.globalAlpha = 0.18 * pulse;
                ctx.beginPath();
                ctx.arc(x, y, r + 6, 0, 2 * Math.PI);
                ctx.fillStyle = "white";
                ctx.fill();

                // Back ring
                ctx.globalAlpha = 0.30;
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, 2 * Math.PI);
                ctx.strokeStyle = "white";
                ctx.stroke();

                // Progress ring
                ctx.globalAlpha = 0.95 * pulse;
                ctx.lineWidth = 5;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + p * 2 * Math.PI);
                ctx.strokeStyle = "white";
                ctx.stroke();

                // Tiny center dot
                ctx.globalAlpha = 0.9;
                ctx.beginPath();
                ctx.arc(x, y, 2.2, 0, 2 * Math.PI);
                ctx.fillStyle = "white";
                ctx.fill();

                ctx.restore();

                // Optional: Full-charge tick sound (einmal)
                if (full && !setup._throwChargeTicked) {
                    setup._throwChargeTicked = true;
                    setup.world.audioManager.playOneShot("chargeTickSound", { volume: 0.6 }); // optional sound
                }
                if (!full) {
                    setup._throwChargeTicked = false;
                }
                // --- Partikel-Orbit (simple) ---
                const t = performance.now() / 1000;
                const n = 6;                      // Anzahl Partikel
                const baseR = r + 10;             // Orbit-Radius
                const wobble = 2.5;               // leichtes Wobbeln

                ctx.save();
                ctx.globalAlpha = 0.75 * pulse;
                ctx.fillStyle = "white";

                for (let i = 0; i < n; i++) {
                    const a = (i / n) * Math.PI * 2 + t * 1.6;          // Drehgeschwindigkeit
                    const rr = baseR + Math.sin(t * 3 + i) * wobble;     // leicht variieren
                    const px = x + Math.cos(a) * rr;
                    const py = y + Math.sin(a) * rr;

                    const s = 1.6 + 0.8 * Math.sin(t * 4 + i * 2);      // Größenpuls
                    ctx.beginPath();
                    ctx.arc(px, py, Math.max(0.8, s), 0, 2 * Math.PI);
                    ctx.fill();
                }
                ctx.restore();
            }
        },

        {
            name: "town_bottle_empty_click",
            type: "input",
            key: "D",
            once: false,
            cooldown: 250,
            condition: (setup) => {
                const c = setup.world.character;
                if (!c) return false;
                return (c.throwableBottels ?? 0) <= 0;
            },
            action: (setup) => {
                setup.world.audioManager.playOneShot("bottleEmptySound", { volume: 0.6 });
            }
        },
    ];