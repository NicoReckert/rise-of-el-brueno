import { PopupText } from "../classes/ui/popup-text.class.js";
import { Enemy } from "../classes/entities/enemy.class.js";
import { DamageText } from "../classes/ui/damage-text.class.js";
import { townHelper } from "./town-helper.js";

export const townEvents =
    [
        /**
         * Quest event that initializes the town level state, music,
         * character position, and task window setup.
         */
        {
            name: 'init',
            type: 'quest',
            action: (setup) => {
                setup.sounds.townDayMusic.loop = true;
                setup.world.audioManager.fadeInAudio(setup.sounds.townDayMusic, 2000, 0.6);
                setup.world.character.x = setup.state.comeFromNayelisHouse ? 20265 : 100; // 100 //18500//23000
                setup.world.character.level_start_x = setup.state.comeFromNayelisHouse ? 20265 : 0;
                setup.world.level_end_x = 29000;
                setup.world.camera_x = setup.state.comeFromNayelisHouse ? 20015 : 0; //0 // 18400 //22900
                setup.world.character.isWalkDetermined = false;
                setup.characters.tadeo.updateAnimationState('idle', 1000 / 5);
                setup.world.character.speedX = 5;
                setup.world.initTasks();
                setup.world.taskWindow.y = 180;
                setup.state.comeFromNayelisHouse = false;
            }
        },

        /**
         * Position-based event that shows a hint on enter and hides it on leave.
         */
        {
            type: 'position',
            area: { x: 20275, width: 95 },
            objectA: 'character',
            once: false,
            action: (setup) => {
                setup.hints[0].show();
            },
            onLeave: (setup) => {
                setup.hints[0].hide();
            }
        },

        /**
         * Position-based event that stops character movement and starts a dialog.
         */
        {
            type: "position",
            area: { x: 3320, width: 100 },
            action: (setup) => {
                setup.world.character.isMovingLeft = false
                setup.world.character.isMovingRight = false
                setup.world.isKeysStopp = true;
                setup.dialogManager.startDialog('character:01', setup.world.timestamp, () => {
                    setup.world.isKeysStopp = false;
                });
            }
        },

        /**
         * Quest event that starts the smoke animation sequence
         * for the destroyed stable environment object.
         */
        {
            type: 'quest',
            action: (setup) => {
                setup.environment.stableDestroyed.animSeqCtrl.start([
                    { anim: 'smokeA', fps: 10, pause: 0, audio: { name: "stableSmokeSfx", volume: 1.0 } },
                    { anim: "idle", fps: 0, pause: 3000 },
                    { anim: 'smokeB', fps: 10, pause: 0 },
                    { anim: "idle", fps: 0, pause: 3000 }
                ],
                    setup.world.townLevelController.timerManager,
                    { loop: true, audioManager: setup.world.audioManager }
                );
            }
        },

        /**
         * Quest event that starts the animation sequence
         * for the destroyed mill environment object.
         */
        {
            type: 'quest',
            action: (setup) => {
                setup.environment.millDestroyed.animSeqCtrl.start([
                    { anim: 'forward', fps: 6.5, pause: 0, audio: { name: "windmillCreakSfx", volume: 1.0 } },
                    { anim: "idleB", fps: 0, pause: 5000 },
                    { anim: 'backward', fps: 6.5, pause: 0, audio: { name: "windmillCreakSfx", volume: 1.0 } },
                    { anim: "idle", fps: 0, pause: 5000 },
                ],
                    setup.world.townLevelController.timerManager,
                    { loop: true, audioManager: setup.world.audioManager }
                );
            }
        },

        /**
         * Position event that fades out the background music
         * and starts the sad moment music when entering the area.
         */
        {
            type: "position",
            area: { x: 1300, width: 100 },
            action: (setup) => {
                setup.world.audioManager.fadeOutAudio(setup.sounds.townDayMusic, 1000);
                setup.sounds.sadMomentMusic.loop = true;
                setup.world.audioManager.fadeInAudio(setup.sounds.sadMomentMusic, 2000, 0.3);
            }
        },

        /**
         * Collision event that enables stable smoke audio while the character
         * is within the destroyed stable area and disables it on leave.
         */
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
                setup.world.audioManager.stopAll("stableSmokeSfx");
            }
        },

        /**
         * Collision event that enables mill audio while the character
         * is within the destroyed mill area and disables it on leave.
         */
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
                setup.world.audioManager.stopAll("windmillCreakSfx");
            }
        },

        /**
         * Collision event that fades in the house fire sound while the character
         * is near the destroyed house and fades it out on leave.
         */
        {
            type: "collision",
            objectA: 'character',
            objectB: 'houseDestroyed',
            toleranceB: { x: -400, width: -400 },
            once: false,
            action: (setup) => {
                if (!setup.state.isNearDestroyedHouse) {
                    setup.state.isNearDestroyedHouse = true;
                    setup.sounds.houseFireSfx.currentTime = 0;
                    setup.sounds.houseFireSfx.loop = true;
                    setup.world.audioManager.fadeInAudio(setup.sounds.houseFireSfx, 2000, 0.3);
                }
            },
            onLeave: (setup) => {
                if (setup.state.isNearDestroyedHouse) {
                    setup.state.isNearDestroyedHouse = false;
                    setup.world.audioManager.fadeOutAudio(setup.sounds.houseFireSfx, 1000);
                }
            }
        },

        /**
         * Collision event that adjusts character movement
         * while walking on the destroyed house area.
         */
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
                setup.world.character.speedX = 5;
            }
        },

        /**
         * Position event that switches to Nayeli's house level
         * when the interaction key is pressed within the area.
         */
        {
            name: 'changeLevel',
            type: "position",
            area: { x: 20275, width: 95 },
            requireKey: "F",
            action: (setup) => {
                setup.world.audioManager.fadeOutAudio(setup.sounds.tadeoHoldStoneMusic, 1000);
                setup.world.audioManager.fadeOutAudio(setup.sounds.townDayMusic, 1000);
                setup.world.nayelisHouseLevelController.eventManager.resetEventByName('init');
                setup.world.nayelisHouseLevelController.eventManager.resetEventByName('changeLevel');
                setup.world.keyboard.F = false;
                setup.world.currentScene = 'nayelisHouseLevel';
            }
        },

        /**
         * Time event that notifies the player about new tasks in the log.
         */
        {
            type: 'time',
            delay: 2000,
            step: 1,
            action: (setup) => {
                setup.sounds.newTaskSfx.play();
                setup.state.popupTexts.push(new PopupText("Neue Aufgaben im Log!", setup.world.canvas.width / 2, 400));
            }

        },

        /**
         * Position-based quest event that advances the quest
         * when the character enters the defined area.
         */
        {
            type: "position",
            area: { x: 4000, width: 100 },
            step: 1,
            action: (setup) => {
                setup.world.townLevelController.questManager.advance(2)
            }
        },

        /**
         * Time-based quest event that gradually increases sandstorm intensity
         * and advances the quest when the sequence ends.
         */
        {
            type: "time",
            from: 0,
            to: 4000,
            step: 2,
            once: false,
            action: (setup, elapsed, progress) => {
                const sandstormCtrl = setup.world.townLevelController.sandstormCtrl;
                const intensity = Math.min(1, progress * 0.5);
                sandstormCtrl.setSandstorm(intensity);
            },
            onEnd: (setup) => {
                const ctrl = setup.world.townLevelController;
                const sandstormCtrl = setup.world.townLevelController.sandstormCtrl;
                sandstormCtrl.setSandstorm(0.5);
                ctrl.questManager.advance(3);
            }
        },

        /**
         * Position-based quest event that advances the quest
         * when the character enters the defined area.
         */
        {
            type: "position",
            area: { x: 5000, width: 100 },
            step: 3,
            action: (setup) => {
                setup.world.townLevelController.questManager.advance(4)
            }
        },

        /**
         * Time-based quest event that increases sandstorm intensity
         * and updates character speed when the sequence ends.
         */
        {
            type: "time",
            from: 0,
            to: 4000,
            step: 4,
            once: false,
            action: (setup, elapsed, progress) => {
                const sandstormCtrl = setup.world.townLevelController.sandstormCtrl;
                const intensity = Math.min(1, 0.5 + progress * 0.5);
                sandstormCtrl.setSandstorm(intensity);
            },
            onEnd: (setup) => {
                const ctrl = setup.world.townLevelController;
                const sandstormCtrl = setup.world.townLevelController.sandstormCtrl;
                sandstormCtrl.setSandstorm(1.0);
                // setup.world.character.isWalkInStorm = true;
                setup.world.character.speedX = 5; //2
                ctrl.questManager.advance(5);
            }
        },

        /**
         * Position-based quest event that enables storm hazards,
         * switches background music, and advances the quest.
         */
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

        /**
         * Position-based quest event that increases storm hazard difficulty
         * and switches to the final storm music.
         */
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

        /**
         * Position-based quest event that triggers the Nayeli spirit cutscene.
         */
        {
            type: "position",
            area: { x: 15000, width: 100 },
            step: 6,
            action: (setup) => {
                townHelper.startNayeliSpiritCutscene(setup)
            }
        },

        /**
         * Position-based quest event that triggers Nayeli spirit appearance,
         * switches music, and advances the quest.
         */
        {
            type: "position",
            area: { x: 15000, width: 100 },
            step: 6,
            action: (setup) => {
                setup.environment.nayeliSpirit.fadeIn(setup.world.timestamp, 2000);
                setup.world.audioManager.fadeOutAudio(setup.sounds.finalStormHazardMusic, 1000);
                setup.sounds.nayeliThemeMusic.loop = true;
                setup.world.audioManager.fadeInAudio(setup.sounds.nayeliThemeMusic, 2000, 0.3);
                setup.sounds.spiritAppearsSfx.play();
                setup.environment.nayeliSpirit.updateAnimationState('walk', 1000 / 10);
                setup.world.townLevelController.questManager.advance(7)
            }
        },

        /**
         * Quest event that moves Nayeli's spirit to a target position,
         * triggers dialogue audio, and advances the quest.
         */
        {
            type: "quest",
            step: 7,
            once: false,
            action: (setup) => {
                const nayeliSpirit = setup.environment.nayeliSpirit;
                const arriveX = nayeliSpirit.moveToX(15050, { speed: 0.8 });
                if (arriveX) {
                    setup.environment.nayeliSpirit.updateAnimationState('idle', 1000 / 8);
                    setup.sounds.voNayeliSpirit01.play();
                    setup.world.townLevelController.questManager.advance(8);
                }
            }
        },

        /**
         * Quest event that starts a dialog with Nayeli's spirit and
         * triggers the blessing sequence after the dialog ends.
         */
        {
            type: "quest",
            step: 8,
            action: (setup) => {
                setup.dialogManager.startDialog('nayeliSpirit:01', setup.world.timestamp, () => {
                    setup.environment.nayeliSpirit.updateAnimationState('blessing', 1000 / 6);
                    setup.sounds.spiritAppearsSfx.play();
                    setup.environment.nayeliSpirit.fadeOut(setup.world.timestamp, 1600);
                    setup.world.townLevelController.questManager.advance(9);
                })
            }
        },

        /**
         * Position event that spawns enemy chickens when the character
         * enters the defined area.
         */
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

        /**
         * Position-based event that spawns enemies in the level.
         */
        {
            type: "position",
            area: { x: 17000, width: 100 },
            action: (setup) => {
                setup.townLevel.enemies.push(
                    new Enemy('dragonSmall', setup.entityImages, 170, 170, 300, 18000, setup.allAudios, setup.world),
                    new Enemy('dragonSmall', setup.entityImages, 170, 170, 300, 18200, setup.allAudios, setup.world)
                );
            }
        },

        /**
         * Position event that spawns additional enemy chickens
         * when the character enters the defined area.
         */
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

        /**
         * Position event that spawns additional enemy chickens
         * when the character enters the defined area.
         */
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

        /**
         * Quest event that moves Tadeo to a target position
         * and advances the quest when the destination is reached.
         */
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

        /**
         * Time event that transitions the background music
         * from Nayeli's theme to Tadeo's theme.
         */
        {
            type: "time",
            delay: 2000,
            step: 9,
            action: (setup) => {
                setup.world.audioManager.fadeOutAudio(setup.sounds.nayeliThemeMusic, 1000);
                setup.world.audioManager.fadeInAudio(setup.sounds.tadeoThemeMusic, 2000, 0.6);
            }
        },

        /**
         * Time event that triggers Tadeo's stone activation sequence,
         * including music changes, animations, shield activation, and dialog.
         */
        {
            type: "time",
            delay: 3000,
            step: 10,
            action: (setup) => {
                setup.sounds.tadeoHoldStoneMusic.loop = true;
                setup.world.audioManager.fadeInAudio(setup.sounds.tadeoHoldStoneMusic, 2000, 0.6);
                setup.world.audioManager.fadeOutAudio(setup.sounds.tadeoThemeMusic, 1000);
                setup.sounds.voTadeoSpeak01.play();
                setup.characters.tadeo.updateAnimationState('stoneActivated', 1000 / 5.5);
                setup.panel.activate(performance.now());
                setup.world.townLevelController.magicShield.start();
                setup.world.audioManager.playOneShot("shieldChargeSfx", 0.7);
                setup.speechBubblesTadeo[0].start(1000);
                setup.dialogManager.startDialog('tadeo:01', setup.world.timestamp);
            }
        },

        /**
         * Time event that restores player control and updates Tadeo's state
         * after the stone activation sequence.
         */
        {
            type: "time",
            delay: 13000,
            step: 10,
            action: (setup) => {
                setup.world.character.isCollapse = false;
                setup.world.isKeysStopp = false;
                setup.world.character.isStandUpAfterCollapse = true;
                setup.world.character.isWalkInStorm = false;
                setup.characters.tadeo.updateAnimationState('walkWithStone');
                setup.characters.tadeo.isFlipped = false;
                setup.world.townLevelController.questManager.advance(11);
            }
        },

        /**
         * Collision event that controls Tadeo's movement and animation
         * while the character is within the defined interaction range.
         */
        {
            type: 'collision',
            objectA: 'character',
            objectB: 'tadeo',
            toleranceB: { x: -50, width: -50 },
            step: 11,
            once: false,
            action: (setup) => {
                const tadeo = setup.characters.tadeo;
                const arriveX = tadeo.moveToX(20250, { speed: 0.8 });
                if (setup.state.isTadeoAfraid || setup.state.isTadeoPanic) {
                    tadeo.isMovingRight = false;
                    return;
                }
                if (!arriveX) setup.characters.tadeo.updateAnimationState('walkWithStone');
                if (arriveX) setup.characters.tadeo.updateAnimationState('idleWithStone');
            },
            onLeave: (setup) => {
                if (setup.state.isTadeoAfraid || setup.state.isTadeoPanic) return;
                setup.characters.tadeo.isMovingRight = false;
                setup.characters.tadeo.updateAnimationState('idleWithStone');
            }
        },

        /**
         * Collision event that triggers Tadeo's fear reaction
         * when enemies approach and resets the state on leave.
         */
        {
            type: 'collision',
            objectA: 'tadeo',
            objectB: 'enemies',
            toleranceA: { x: -300, width: -300 },
            step: 11,
            once: false,
            action: (setup, tadeo) => {
                const wasAfraid = !!setup.state.isTadeoAfraid;
                setup.state.isTadeoAfraid = true;
                if (setup.state.isTadeoPanic) return
                if (!wasAfraid) {
                    tadeo.updateAnimationState('afraid', 1000 / 6);
                } else {
                    tadeo.updateAnimationState('afraidLoop', 1000 / 6);
                }
            },
            onLeave: (setup) => {
                if (!setup.state.isTadeoPanic) {
                    setup.characters.tadeo.updateAnimationState('standUp', 1000 / 6);
                }
                setup.world.townLevelController.eventManager.emitNow("afraidReset");
            }
        },

        /**
         * Time event that resets Tadeo's fear state after a delay
         * when the "afraidReset" event is triggered.
         */
        {
            type: "time",
            resetOn: "afraidReset",
            delay: 1500,
            manual: true,
            step: 11,
            once: true,
            action: (setup) => {
                setup.state.isTadeoAfraid = false;
            }
        },

        /**
         * Collision event that triggers Tadeo's afraid speech and audio
         * when enemies are nearby under specific conditions.
         */
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
                const speechOk = now >= (setup.state.tadeoSpeechLockUntil ?? 0);
                const panicGraceOk = now >= (setup.state.tadeoPanicUntil ?? 0);
                return speechOk && panicGraceOk && setup.state.isTadeoAfraid && !setup.state.isTadeoPanic;
            },
            action: (setup) => {
                const now = performance.now();
                const lockUntil = now + 2200;
                setup.state.tadeoSpeechLockUntil = Math.max(setup.state.tadeoSpeechLockUntil ?? 0, lockUntil);
                const bubbles = setup.speechBubblesTadeoAfraid;
                const idx = (Math.random() * bubbles.length) | 0;
                setup.state.tadeoAfraidIdx = idx;
                bubbles[idx].start();
                setup.world.audioManager.playOneShot(`voTadeoAfraid0${idx + 1}`, { volume: 0.9 });
                setup.world.townLevelController.eventManager.emitNow("tadeoAfraidBubbleRender");
            }
        },

        /**
         * Time event that renders Tadeo's afraid speech bubble
         * during the active speech interval.
         */
        {
            type: "time",
            resetOn: "tadeoAfraidBubbleRender",
            manual: true,
            once: false,
            from: 0,
            to: 2600,
            step: 11,
            action: (setup) => {
                const i = setup.state.tadeoAfraidIdx ?? 0;
                setup.speechBubblesTadeoAfraid[i].render(
                    setup.world.ctx,
                    setup.world.townLevelController.renderCameraX,
                    -40
                );
            }
        },

        /**
         * Collision event that triggers Tadeo's panic reaction
         * when hit by projectiles and resets the state on leave.
         */
        {
            type: 'collision',
            objectA: 'tadeo',
            objectB: 'projectiles',
            toleranceA: { x: -300, width: -300 },
            step: 11,
            once: false,
            action: (setup, tadeo) => {
                setup.state.isTadeoPanic = true;
                setup.state.tadeoPanicUntil = performance.now() + 1200;
                tadeo.updateAnimationState('panic', 1000 / 6);
            },
            onLeave: (setup, tadeo) => {
                tadeo.updateAnimationState('standUp', 1000 / 6);
                setup.world.townLevelController.eventManager.emitNow("panicReset");
            }
        },

        /**
         * Collision event that triggers Tadeo's panic reaction
         * when enemies are very close and resets the state on leave.
         */
        {
            type: 'collision',
            objectA: 'tadeo',
            objectB: 'enemies',
            toleranceA: { x: -60, width: -60 },
            step: 11,
            once: false,
            action: (setup, tadeo) => {
                setup.state.isTadeoPanic = true;
                setup.state.tadeoPanicUntil = performance.now() + 1200;
                tadeo.updateAnimationState('panic', 1000 / 6);
            },
            onLeave: (setup, tadeo) => {
                tadeo.updateAnimationState('standUp', 1000 / 6);
                setup.world.townLevelController.eventManager.emitNow("panicReset");
            }
        },

        /**
         * Time event that resets Tadeo's panic state after a delay
         * and restores the afraid animation if applicable.
         */
        {
            type: "time",
            resetOn: "panicReset",
            delay: 1500,
            manual: true,
            step: 11,
            once: true,
            action: (setup) => {
                setup.state.isTadeoPanic = false;
                setup.state.tadeoPanicUntil = Math.max(setup.state.tadeoPanicUntil ?? 0, performance.now() + 200); if (setup.state.isTadeoAfraid) {
                    setup.characters.tadeo.updateAnimationState('afraidLoop', 1000 / 6);
                }
            }
        },

        /**
         * Collision event that triggers Tadeo's panic speech and audio
         * when projectiles are nearby under specific conditions.
         */
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
                if (!setup.state.isTadeoPanic) return false;
                if (now < (setup.state.tadeoSpeechLockUntil ?? 0)) return false;
                return true;
            },
            action: (setup) => {
                const now = performance.now();
                const lockUntil = now + 2200;
                setup.state.tadeoSpeechLockUntil = Math.max(setup.state.tadeoSpeechLockUntil ?? 0, lockUntil);
                const bubbles = setup.speechBubblesTadeoPanic;
                const idx = (Math.random() * bubbles.length) | 0;
                setup.state.tadeoPanicProjIdx = idx;
                bubbles[idx].start();
                setup.world.audioManager.playOneShot(`voTadeoPanic0${idx + 1}`, { volume: 1.0 });
                setup.world.townLevelController.eventManager.emitNow("tadeoPanicProjBubbleRender");
            }
        },

        /**
         * Collision event that triggers Tadeo's panic speech and audio
         * when enemies are very close under specific conditions.
         */
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
                if (!setup.state.isTadeoPanic) return false;
                if (now < (setup.state.tadeoSpeechLockUntil ?? 0)) return false;
                return true;
            },
            action: (setup) => {
                const now = performance.now();
                const lockUntil = now + 2200;
                setup.state.tadeoSpeechLockUntil = Math.max(setup.state.tadeoSpeechLockUntil ?? 0, lockUntil);
                const bubbles = setup.speechBubblesTadeoPanic;
                const idx = (Math.random() * bubbles.length) | 0;
                setup.state.tadeoPanicNearIdx = idx;
                bubbles[idx].start();
                setup.world.audioManager.playOneShot(`voTadeoPanic0${idx + 1}`, { volume: 1.0 });
                setup.world.townLevelController.eventManager.emitNow("tadeoPanicNearBubbleRender");
            }
        },

        /**
         * Time event that renders Tadeo's panic speech bubble
         * for projectile-related panic during the active interval.
         */
        {
            type: "time",
            resetOn: "tadeoPanicProjBubbleRender",
            manual: true,
            once: false,
            from: 0,
            to: 2000,
            step: 11,
            action: (setup) => {
                const i = setup.state.tadeoPanicProjIdx ?? 0;
                setup.speechBubblesTadeoPanic[i].render(
                    setup.world.ctx,
                    setup.world.townLevelController.renderCameraX,
                    -40
                );
            }
        },

        /**
         * Time event that renders Tadeo's panic speech bubble
         * for nearby-enemy panic during the active interval.
         */
        {
            type: "time",
            resetOn: "tadeoPanicNearBubbleRender",
            manual: true,
            once: false,
            from: 0,
            to: 2000,
            step: 11,
            action: (setup) => {
                const i = setup.state.tadeoPanicNearIdx ?? 0;
                setup.speechBubblesTadeoPanic[i].render(
                    setup.world.ctx,
                    setup.world.townLevelController.renderCameraX,
                    -40
                );
            }
        },

        /**
         * Collision-based quest event that triggers Tadeo giving bottles
         * when enemies are nearby and the warning conditions are met.
         */
        {
            name: "tadeo_help_give_bottles",
            type: "collision",
            objectA: "tadeo",
            objectB: "enemies",
            toleranceA: { x: -600, width: -600 },
            step: 11,
            once: false,
            cooldown: 1000,
            condition: (setup) => townHelper.shouldTriggerTadeoWarning(setup),
            action: (setup) => {
                townHelper.triggerTadeoHelp(setup)
            }
        },

        /**
         * Quest event that resets the empty help state
         * when the character has throwable bottles again.
         */
        {
            name: "tadeo_help_reset_empty_phase",
            type: "quest",
            step: 11,
            once: false,
            action: (setup) => {
                const c = setup.world.character;
                if (!c) return;
                if ((c.throwableBottles ?? 0) > 0) {
                    setup.state.tadeoHelpGivenEmpty = false;
                }
            }
        },

        /**
         * Time event that renders Tadeo's help speech bubble
         * during the active help interval.
         */
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
                if (now > (setup.state.tadeoHelpUntil ?? 0)) return;
                const i = setup._tadeoHelpIdx ?? 0;
                setup.speechBubblesTadeoHelp[i].render(
                    setup.world.ctx,
                    setup.world.townLevelController.renderCameraX,
                    -40
                );
            }
        },

        /**
         * Quest event that restricts the character's horizontal position
         * within a radius around Tadeo.
         */
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
            type: 'quest',
            step: 12,
            once: false,
            action: (setup) => {
                setup.sandstormFar.setEnabled(false);
                setup.sandstorm.setEnabled(false);
                setup.sandstormNear.setEnabled(false);
                setup.magicShield.stop();
                setup.characters.tadeo.updateAnimationState('idle');
                setup.world.character.isHaveSword = true;
                setup.world.character.config.initCombatConfig();
                setup.state.enemyHealth = 2;
                setup.characters.tadeo.x = 20400; // muss wieder entfernt werden!!
            }
        },

        /**
         * Collision event that switches background music
         * when the character approaches or leaves the musician.
         */
        {
            type: 'collision',
            objectA: 'character',
            objectB: 'musician',
            toleranceB: { x: -150, width: -150 },
            step: 12,
            once: false,
            cooldown: 500,
            action: (setup) => {
                if (!setup.state.isNearMusician) {
                    setup.state.isNearMusician = true;
                    setup.sounds.musicianTownMusic.currentTime = 0;
                    setup.world.audioManager.fadeOutAudio(setup.sounds.townDayMusic, 1000);
                    setup.world.audioManager.fadeInAudio(setup.sounds.musicianTownMusic, 2000, 0.6);
                }
            },
            onLeave: (setup) => {
                if (setup.state.isNearMusician) {
                    setup.state.isNearMusician = false;
                    setup.sounds.townDayMusic.currentTime = 0;
                    setup.world.audioManager.fadeOutAudio(setup.sounds.musicianTownMusic, 1000);
                    setup.world.audioManager.fadeInAudio(setup.sounds.townDayMusic, 2000, 0.6);
                }
            }
        },

        /**
         * Collision event that switches background music
         * when the character approaches or leaves Sollita.
         */
        {
            type: 'collision',
            objectA: 'character',
            objectB: 'sollita',
            toleranceB: { x: -80, width: -80 },
            step: 12,
            once: false,
            cooldown: 500,
            action: (setup) => {
                if (!setup.state.isNearSollita) {
                    setup.state.isNearSollita = true;
                    setup.sounds.sollitaThemeMusic.currentTime = 0;
                    setup.world.audioManager.fadeOutAudio(setup.sounds.townDayMusic, 1000);
                    setup.world.audioManager.fadeInAudio(setup.sounds.sollitaThemeMusic, 2000, 0.6);
                }
            },
            onLeave: (setup) => {
                if (setup.state.isNearSollita) {
                    setup.state.isNearSollita = false;
                    setup.sounds.townDayMusic.currentTime = 0;
                    setup.world.audioManager.fadeOutAudio(setup.sounds.sollitaThemeMusic, 1000);
                    setup.world.audioManager.fadeInAudio(setup.sounds.townDayMusic, 2000, 0.6);
                }
            }
        },

        {
            type: "position",
            area: { x: 26500, width: 100 },
            action: (setup) => {
                setup.characters.endboss.x = 26000;
                setup.characters.endboss.y = -100;
                setup.characters.endboss.isFlipped = true;
                setup.characters.endboss.isFly = true;
                // setup.sounds.bossFlappingWingsSfx.play();
                // setup.sounds.bossFlappingWingsSfx.loop = true;
                // setup.sounds.bossFlappingWingsSfx.volume = 1.0;
                setup.sounds.bossBattleMusic.currentTime = 0;
                setup.world.audioManager.fadeOutAudio(setup.sounds.townDayMusic, 1000);
                setup.world.audioManager.fadeInAudio(setup.sounds.bossBattleMusic, 2000, 0.6);
                // const audio = setup.sounds.bossFlappingWingsSfx;
                // const ctx = new AudioContext();
                // const source = ctx.createMediaElementSource(audio);
                // const gainNode = ctx.createGain();
                // gainNode.gain.value = 6.0; // 200% Lautstärke
                // source.connect(gainNode);
                // gainNode.connect(ctx.destination);
                // audio.play();
                // audio.loop = true;
                setup.world.character.speedX = 8;
                setup.world.townLevelController.questManager.advance(13);

            }
        },

        /**
         * Quest event that moves the endboss to the target position
         * and starts the air eggs phase when the destination is reached.
         */
        {
            type: "quest",
            step: 13,
            once: false,
            action: (setup) => {
                const endboss = setup.characters.endboss;
                const arrivedX = endboss.moveToX(27000, 220);
                if (arrivedX) {
                    endboss.setPhase(endboss.ENDBOSS_PHASE.AIR_EGGS)
                    setup.world.townLevelController.questManager.advance(14)
                }
            }

        },

        {
            name: "follow_tornado_camera",
            type: "quest",
            step: 14,
            once: false,
            condition: (setup) => setup.world.character?.isCapturedByTornado,
            action: (setup) => {
                const tornado = setup.world.tornado;
                if (!tornado) return;
                setup.world.camera.moveToX(
                    tornado.x + tornado.width * 0.5 - 400,
                    { speed: 10, tolerance: 2, snap: false, clamp: true }
                );
            }
        },

        {
            type: "quest",
            step: 14,
            condition: (setup) => setup.world.character?.isCapturedByTornado,
            action: (setup) => {
                setup.world.character.isFlipped = false;
                setup.world.character.isMovingLeft = false;
                setup.world.character.isMovingRight = false;
                setup.world.isKeysStopp = true;
            }
        },

        {
            type: "quest",
            step: 14,
            condition: (setup) => setup.world.character?.isCapturedByTornado,
            once: false,
            action: (setup) => {
                const items = [
                    setup.statusBarCharacter,
                    setup.statusBarEndboss,
                    setup.coinBar,
                    setup.bottleBar
                ]
                items.forEach(item => {
                    if (!item) return;
                    item.opacity = Math.max(0, (item.opacity ?? 1) - 0.005);
                });
            }
        },

        {
            type: "time",
            delay: 4000,
            step: 15,
            action: (setup) => {
                setup.world.audioManager.fadeOutAudio(setup.sounds.airHitStunMusic, 1000);
                setup.world.audioManager.fadeInAudio(setup.sounds.endSceneMusic, 2000);
                setup.environment.macuahuitl.fadeIn(setup.world.timestamp, 4000)
            }
        },

        {
            type: "time",
            delay: 6000,
            step: 15,
            once: false,
            action: (setup) => {
                const macuahuitl = setup.environment.macuahuitl;
                const arriveY = macuahuitl.moveToY(150, { speed: 0.5 });
                if (arriveY) {
                    setup.world.audioManager.fadeAudioTo(setup.sounds.endSceneMusic, 2000, 0.4);
                    setup.world.townLevelController.questManager.advance(16);
                }
            }
        },

        {
            type: "time",
            delay: 1000,
            step: 16,
            action: (setup) => {
                setup.environment.nayeliSpiritEcho.updateAnimationState('spiritCuddle', 1000 / 5.5);
                setup.environment.nayeliSpiritEcho.fadeIn(setup.world.timestamp, 4000);
                setup.sounds.voNayeliSpirit01.play();
                setup.dialogManager.startDialog('nayeliSpiritEcho:01', setup.world.timestamp);
            },
        },

        {
            type: "time",
            delay: 8000,
            step: 16,
            action: (setup) => {
                setup.environment.nayeliSpiritEcho.fadeOut(setup.world.timestamp, 4000);
            },
        },

        {
            type: "time",
            delay: 9000,
            step: 16,
            action: (setup) => {
                setup.environment.sollitaSpiritEcho.updateAnimationState('spiritCuddle', 1000 / 5.5);
                setup.environment.sollitaSpiritEcho.fadeIn(setup.world.timestamp, 4000);
                setup.sounds.voSollitaSpiritEcho01.play();
                setup.dialogManager.startDialog('sollitaSpiritEcho:01', setup.world.timestamp);
            },
        },

        {
            type: "time",
            delay: 17000,
            step: 16,
            action: (setup) => {
                setup.environment.sollitaSpiritEcho.fadeOut(setup.world.timestamp, 4000);
            },
        },

        {
            type: "time",
            delay: 18000,
            step: 16,
            action: (setup) => {
                setup.environment.tadeoSpiritEcho.updateAnimationState('spiritCuddle', 1000 / 5.5);
                setup.environment.tadeoSpiritEcho.fadeIn(setup.world.timestamp, 4000);
                setup.sounds.voTadeoSpiritEcho01.play();
                setup.dialogManager.startDialog('tadeoSpiritEcho:01', setup.world.timestamp);
            },
        },

        {
            type: "time",
            delay: 18000,
            step: 16,
            once: false,
            action: (setup) => {
                const macuahuitl = setup.environment.macuahuitl;
                const arriveY = macuahuitl.moveToY(220, { speed: 0.5 });
                if (arriveY) {
                    setup.world.townLevelController.questManager.advance(17);
                }
            }
        },

        {
            type: "quest",
            step: 17,
            action: (setup) => {
                setup.environment.macuahuitl.fadeOut(setup.world.timestamp, 4000)
            }
        },

        {
            type: "time",
            delay: 4000,
            step: 17,
            action: (setup) => {
                // setup.world.audioManager.fadeAudioTo(setup.sounds.endSceneMusic, 2000, 1);
                // setup.world.audioManager.fadeOutAudio(setup.sounds.endSceneMusic, 1000);
                // setup.world.audioManager.fadeInAudio(setup.sounds.endSceneMusic02, 2000);
                setup.environment.tadeoSpiritEcho.fadeOut(setup.world.timestamp, 4000);
                setup.environment.juanitoSpirit.fadeOut(setup.world.timestamp, 4000);
                setup.environment.lolaSpirit.fadeOut(setup.world.timestamp, 4000);
                setup.environment.pollitoSpirit.fadeOut(setup.world.timestamp, 4000);
                setup.world.character.isStandUpAfterPainStun = true;
                setup.world.audioManager.fadeAudioTo(setup.sounds.endSceneMusic, 2000, 0.8);

            },
        },

        {
            type: "time",
            delay: 8000,
            step: 17,
            action: (setup) => {
                setup.environment.nayeliSpiritEcho.updateAnimationState('idle');
                setup.environment.sollitaSpiritEcho.updateAnimationState('idle');
                setup.environment.tadeoSpiritEcho.updateAnimationState('idle');
                setup.environment.nayeliSpiritEcho.x = 26970;
                setup.environment.nayeliSpiritEcho.width = 200;
                setup.environment.nayeliSpiritEcho.height = 200;
                setup.environment.sollitaSpiritEcho.width = 200;
                setup.environment.sollitaSpiritEcho.height = 200;
                setup.environment.tadeoSpiritEcho.width = 150;
                setup.environment.tadeoSpiritEcho.height = 150;
                setup.environment.sollitaSpiritEcho.x = 26970;
                setup.environment.tadeoSpiritEcho.x = 27095;
                setup.environment.nayeliSpiritEcho.y = 170;
                setup.environment.sollitaSpiritEcho.y = 370;
                setup.environment.tadeoSpiritEcho.y = 295;
                setup.environment.tadeoSpiritEcho.isFlipped = false;

                setup.environment.lolaSpirit.updateAnimationState('idle', 1000 / 4.5);
                setup.environment.juanitoSpirit.updateAnimationState('idle', 1000 / 4.5);
                setup.environment.pollitoSpirit.updateAnimationState('idle', 1000 / 4.5);

                setup.environment.lolaSpirit.x = 27120
                setup.environment.juanitoSpirit.x = 27145
                setup.environment.pollitoSpirit.x = 27195

                setup.environment.lolaSpirit.y = 400
                setup.environment.juanitoSpirit.y = 145
                setup.environment.pollitoSpirit.y = 320
                setup.environment.juanitoSpirit.isFlipped = false;
                setup.environment.pollitoSpirit.isFlipped = true;


                setup.environment.nayeliSpiritEcho.fadeIn(setup.world.timestamp, 4000);
                setup.environment.sollitaSpiritEcho.fadeIn(setup.world.timestamp, 4000);
                setup.environment.tadeoSpiritEcho.fadeIn(setup.world.timestamp, 4000);
                setup.environment.juanitoSpirit.fadeIn(setup.world.timestamp, 4000);
                setup.environment.lolaSpirit.fadeIn(setup.world.timestamp, 4000);
                setup.environment.pollitoSpirit.fadeIn(setup.world.timestamp, 4000);

            },
        },

        {
            type: "time",
            delay: 14000,
            step: 17,
            action: (setup) => {
                setup.environment.fireBlue.fadeIn(setup.world.timestamp, 4000);
                setup.world.audioManager.playOneShot('beamChargeSfx', { volume: 0.8 });
            }
        },

        {
            type: "time",
            delay: 14000,
            step: 17,
            once: false,
            action: (setup) => {
                const beam = setup.state.effectsBehind[0];
                if (beam && beam.width >= 300) {
                    beam.width -= 0.5;
                }
            }
        },

        {
            type: "time",
            delay: 16000,
            step: 17,
            action: (setup) => {
                setup.dialogManager.startDialog('character:endScene:part02', setup.world.timestamp);
            }
        },

        {
            type: "time",
            delay: 30000,
            step: 17,
            action: (setup) => {
                setup.world.audioManager.playOneShot('beamChargeSfx', { volume: 0.8 });
            }
        },

        {
            type: "time",
            delay: 30000,
            step: 17,
            once: false,
            action: (setup) => {
                if (setup.environment.fireBlue.width <= 250) {
                    setup.environment.fireBlue.width += 0.5;
                }
            }
        },

        {
            type: "time",
            delay: 30000,
            step: 17,
            once: false,
            action: (setup) => {
                const beam = setup.state.effectsBehind[0];
                if (beam && beam.width >= 250) {
                    beam.width -= 0.5;
                }
            }
        },

        {
            type: "time",
            delay: 32000,
            step: 17,
            action: (setup) => {
                setup.characters.endboss.isFireBreath = false;
                setup.characters.endboss.isRage = true;
                setup.world.audioManager.playOneShot('bossRoarSfx', { volume: 0.8 });
                setup.world.audioManager.playOneShot('bossBeamChargeSfx', { volume: 0.8 });
            }
        },

        {
            type: "time",
            delay: 32000,
            step: 17,
            once: false,
            action: (setup) => {
                const beam = setup.state.effectsBehind[0];
                if (beam && beam.height <= 700) {
                    beam.height += 0.5;
                }
            }
        },

        {
            type: "time",
            delay: 35000,
            step: 17,
            action: (setup) => {
                setup.environment.juanitoSpirit.updateAnimationState('spiritOffering', 1000 / 6);
                setup.dialogManager.playBubble(setup.speechBubblesJuanito[0], {
                    duration: 2000, now: setup.world.timestamp
                });
                setup.world.audioManager.playOneShot('chickenSfx', { volume: 1 });
                setup.world.audioManager.playOneShot('beamChargeSfx', { volume: 0.8 });
            }
        },


        {
            type: "time",
            delay: 37000,
            step: 17,
            action: (setup) => {
                const beam = setup.environment.fireBlue;
                const char = setup.world.character;
                beam.updateAnimationState('sustain', 1000 / 12);
                beam.height = 250;
                const anchorY = char.y - 36;
                beam.y = Math.round(anchorY + (500 - beam.height) / 2);
            }
        },

        {
            type: "time",
            delay: 38000,
            step: 17,
            action: (setup) => {
                setup.environment.juanitoSpirit.fadeOut(setup.world.timestamp, 4000);
            }
        },

        {
            type: "time",
            delay: 39000,
            step: 17,
            action: (setup) => {
                setup.environment.pollitoSpirit.updateAnimationState('spiritOffering', 1000 / 6);
                setup.dialogManager.playBubble(setup.speechBubblesPollito[0], {
                    duration: 2000, now: setup.world.timestamp
                });
                setup.world.audioManager.playOneShot('chickSfx', { volume: 1 });
                setup.world.audioManager.playOneShot('beamChargeSfx', { volume: 0.8 });
            }
        },

        {
            type: "time",
            delay: 40000,
            step: 17,
            action: (setup) => {
                setup.environment.pollitoSpirit.fadeOut(setup.world.timestamp, 4000);
            }
        },

        {
            type: "time",
            delay: 41000,
            step: 17,
            once: false,
            action: (setup) => {
                const beam = setup.environment.fireBlue;
                const char = setup.world.character;
                if (!beam || !char) return;
                if (beam && beam.height < 300) {
                    beam.height += 0.5;
                }
                const anchorY = char.y - 37;
                beam.y = Math.round(anchorY + (500 - beam.height) / 2);
            }
        },

        {
            type: "time",
            delay: 43000,
            step: 17,
            action: (setup) => {
                setup.environment.lolaSpirit.updateAnimationState('spiritOffering', 1000 / 6);
                setup.dialogManager.playBubble(setup.speechBubblesLola[0], {
                    duration: 2000, now: setup.world.timestamp
                });
                setup.world.audioManager.playOneShot('cowSfx01', { volume: 1 });
                setup.world.audioManager.playOneShot('beamChargeSfx', { volume: 0.8 });
            }
        },

        {
            type: "time",
            delay: 44000,
            step: 17,
            action: (setup) => {
                setup.environment.lolaSpirit.fadeOut(setup.world.timestamp, 4000);
            }
        },

        {
            type: "time",
            delay: 45000,
            step: 17,
            once: false,
            action: (setup) => {
                const beam = setup.environment.fireBlue;
                const char = setup.world.character;
                if (!beam || !char) return;
                if (beam && beam.height < 350) {
                    beam.height += 0.5;
                }
                const anchorY = char.y - 38;
                beam.y = Math.round(anchorY + (500 - beam.height) / 2);
            }
        },

        {
            type: "time",
            delay: 47000,
            step: 17,
            action: (setup) => {
                setup.environment.nayeliSpiritEcho.updateAnimationState('spiritOffering', 1000 / 6);
                setup.sounds.voNayeliSpiritEcho01.play();
                setup.dialogManager.playBubble(setup.speechBubblesNayeliSpiritEcho[3], {
                    duration: 2000, now: setup.world.timestamp
                });
                setup.world.audioManager.playOneShot('beamChargeSfx', { volume: 0.8 });
            }
        },

        {
            type: "time",
            delay: 48000,
            step: 17,
            action: (setup) => {
                setup.environment.nayeliSpiritEcho.fadeOut(setup.world.timestamp, 4000);
            }
        },

        {
            type: "time",
            delay: 49000,
            step: 17,
            once: false,
            action: (setup) => {
                const beam = setup.environment.fireBlue;
                const char = setup.world.character;
                if (!beam || !char) return;
                if (beam && beam.height < 400) {
                    beam.height += 0.5;
                }
                const anchorY = char.y - 39;
                beam.y = Math.round(anchorY + (500 - beam.height) / 2);
            }
        },

        {
            type: "time",
            delay: 51000,
            step: 17,
            action: (setup) => {
                setup.environment.sollitaSpiritEcho.updateAnimationState('spiritOffering', 1000 / 6);
                setup.sounds.voSollitaSpiritEcho02.play();
                setup.dialogManager.playBubble(setup.speechBubblesSollitaSpiritEcho[5], {
                    duration: 2000, now: setup.world.timestamp
                });
                setup.world.audioManager.playOneShot('beamChargeSfx', { volume: 0.8 });

            }
        },

        {
            type: "time",
            delay: 52000,
            step: 17,
            action: (setup) => {
                setup.environment.sollitaSpiritEcho.fadeOut(setup.world.timestamp, 4000);
            }
        },

        {
            type: "time",
            delay: 53000,
            step: 17,
            once: false,
            action: (setup) => {
                const beam = setup.environment.fireBlue;
                const char = setup.world.character;
                if (!beam || !char) return;
                if (beam && beam.height < 450) {
                    beam.height += 0.5;
                }
                const anchorY = char.y - 40;
                beam.y = Math.round(anchorY + (500 - beam.height) / 2);
            }
        },

        {
            type: "time",
            delay: 55000,
            step: 17,
            action: (setup) => {
                setup.environment.tadeoSpiritEcho.updateAnimationState('spiritOffering', 1000 / 6);
                setup.sounds.voTadeoSpiritEcho02.play();
                setup.dialogManager.playBubble(setup.speechBubblesTadeoSpiritEcho[5], {
                    duration: 2000, now: setup.world.timestamp
                });
                setup.world.audioManager.playOneShot('beamChargeSfx', { volume: 0.8 });
            }
        },

        {
            type: "time",
            delay: 56000,
            step: 17,
            action: (setup) => {
                setup.environment.tadeoSpiritEcho.fadeOut(setup.world.timestamp, 4000);
            }
        },

        {
            type: "time",
            delay: 57000,
            step: 17,
            once: false,
            action: (setup) => {
                const beam = setup.environment.fireBlue;
                const char = setup.world.character;
                if (!beam || !char) return;
                if (beam && beam.height < 500) {
                    beam.height += 0.5;
                }
                const anchorY = char.y - 41;
                beam.y = Math.round(anchorY + (500 - beam.height) / 2);
            }
        },

        {
            type: "time",
            delay: 59000,
            step: 17,
            action: (setup) => {
                setup.world.audioManager.playOneShot('beamChargeFinalSfx', { volume: 0.8 });
            },
        },

        {
            type: "time",
            delay: 59000,
            step: 17,
            once: false,
            action: (setup) => {
                if (setup.environment.fireBlue.width <= 500) {
                    setup.environment.fireBlue.width += 0.5;
                }
            },
        },

        {
            type: "time",
            delay: 63000,
            step: 17,
            action: (setup) => {
                setup.world.audioManager.playOneShot('bossHurtSfx', { volume: 0.8 });
            },
        },

        {
            type: "time",
            delay: 65000,
            step: 17,
            action: (setup) => {
                setup.whiteFlashTransition.start(setup.world.timestamp);
            },
        },

        {
            type: "time",
            delay: 66000,
            step: 17,
            action: (setup) => {
                setup.world.character.isAttackEndScene = false;
                setup.world.character.y = 370;
                setup.environment.fireBlue.opacity = 0;
                setup.environment.rockyDesertPedestal.opacity = 0;
                setup.world.audioManager.fadeOutAudio(setup.sounds.endSceneMusic, 1000);
                setup.state.effectsBehind[0].opacity = 0;
                setup.characters.endboss.isDead = true;
                setup.world.townLevelController.questManager.advance(18);
            },
        },

        {
            type: "quest",
            step: 18,
            action: (setup) => {
                const boss = setup.characters.endboss;
                const soul = setup.characters.soul;
                soul.x = boss.x + 75;
                soul.y = boss.y + 200;
                setup.sounds.soulThemeMusic.loop = true;
                setup.world.audioManager.fadeInAudio(setup.sounds.soulThemeMusic, 2000, 0.4);

            },
        },

        {
            type: "time",
            delay: 4000,
            step: 18,
            once: false,
            action: (setup) => {
                setup.world.character.movementCtrl.moveToX(27600, {
                    speed: 1.5, faceTarget: true, setWalkFlag: true
                });
            }
        },

        {
            type: 'position',
            area: { x: 27600, width: 50 },
            step: 18,
            action: (setup) => {
                setup.characters.soul.fadeIn(setup.world.timestamp, 4000);
                setup.world.character.isWalk = false;
                setup.world.townLevelController.questManager.advance(19);
            }
        },

        {
            type: 'quest',
            step: 19,
            once: false,
            action: (setup) => {
                const arriveY = setup.characters.soul.moveToY(250, { speed: 0.5 });
                if (arriveY) {
                    setup.world.townLevelController.questManager.advance(20);
                }
            }
        },

        {
            type: 'quest',
            step: 20,
            action: (setup) => {
                setup.world.audioManager.safePlay(setup.sounds.voSoulSpeak01);
            }
        },

        {
            type: 'quest',
            step: 20,
            condition: (setup) => setup.sounds.voSoulSpeak01.currentTime >= 18,
            action: (setup) => {
                setup.world.character.isMeditation = true;
                setup.characters.soul.updateAnimationState('findsPeace', 1000 / 5);
                setup.characters.endboss.isFindsPeace = true;
                setup.world.audioManager.fadeAudioTo(setup.sounds.soulThemeMusic, 8000, 1);
                setup.world.townLevelController.questManager.advance(21);
            }
        },

        {
            type: 'quest',
            step: 21,
            once: false,
            action: (setup) => {
                setup.characters.endboss.opacity = Math.max(
                    0, (setup.characters.endboss.opacity ?? 1) - 0.0015);
            }
        },

        {
            type: 'quest',
            step: 21,
            once: false,
            action: (setup) => {
                const arriveY = setup.characters.soul.moveToY(-500, { speed: 1 });
                if (arriveY) {
                    setup.world.townLevelController.questManager.advance(22);
                }
            }
        },

        {
            type: 'time',
            delay: 4000,
            step: 22,
            action: (setup) => {
                setup.whiteFlashTransition.start(setup.world.timestamp);
                setup.world.townLevelController.questManager.advance(23);
            }
        },

        {
            type: 'time',
            delay: 1000,
            step: 23,
            action: (setup) => {
                setup.characters.sollita.x = 26800;
                setup.characters.sollita.isFlipped = true;
                setup.characters.sollita.updateAnimationState('walk');
                setup.world.audioManager.fadeOutAudio(setup.sounds.soulThemeMusic, 1000);
                setup.world.audioManager.fadeInAudio(setup.sounds.happyEndMusic, 2000);
                setup.world.character.isMeditation = false;
                setup.townLevel.sky.usePreset('desertDay');
                setup.townLevel.grounds.townGrass.opacity = 1;
            }
        },

        {
            type: 'time',
            delay: 5000,
            step: 23,
            once: false,
            action: (setup) => {
                const arriveX = setup.characters.sollita.moveToX(27380, { speed: 1 });
                if (arriveX) {
                    setup.world.character.isFlipped = true;
                    setup.characters.sollita.updateAnimationState('idle');
                    setup.world.audioManager.fadeAudioTo(setup.sounds.happyEndMusic, 2000, 0.6);
                    setup.sounds.voSollitaSpeak02.play();
                    setup.dialogManager.startDialog('sollita:endScene', setup.world.timestamp);
                    setup.world.townLevelController.questManager.advance(24);
                }
            }
        },

        {
            type: 'time',
            delay: 4000,
            step: 24,
            condition: (setup) => setup.sounds.voSollitaSpeak02.ended,
            action: (setup) => {
                setup.whiteFlashTransition.start(setup.world.timestamp);
                setup.world.audioManager.fadeOutAudio(setup.sounds.happyEndMusic, 1000);
            }
        },

        {
            type: 'time',
            delay: 5500,
            step: 24,
            condition: (setup) => setup.sounds.voSollitaSpeak02.ended,
            action: (setup) => {
                setup.world.currentScene = 'endCredits';
            }
        },

        //COLLIDINGS

        {
            type: 'quest',
            once: false,
            action: (setup) => {
                const char = setup.world.character
                if (char.isHurt) return;
                setup.state.projectiles.forEach(element => {
                    if (!element.isActive) return;
                    if (element.currentAnimation === "explode") return;
                    const colliding = element.isColliding(char, { x: 0, width: 0 }, { x: 50, width: 50 });
                    if (colliding) {
                        const dmg = char.isProtect ? 2 : 10;
                        element.isActive = false;
                        element.explode();
                        char.combatCtrl.hit(setup.world.timestamp, dmg);
                        setup.statusBarCharacter.setPercentage(char.energy);
                        setup.state.damageTexts.push(new DamageText(char, dmg));

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
                        setup.statusBarCharacter.setPercentage(char.energy);
                        setup.state.damageTexts.push(
                            new DamageText(char, char.isProtect ? 2 : 10)
                        );
                    }
                });
            }
        },

        {
            type: "collision",
            once: false,
            objectA: "character",
            objectB: "enemies",
            useAttackHitboxB: true,
            condition: (setup) => {
                const char = setup.world.character;
                return !!char && !char.isHurt;
            },
            targetFilter: (enemy) =>
                !!enemy &&
                !enemy.isDead &&
                enemy.currentEnemy === "chickenMutatesSmall" &&
                !!enemy.attackHitbox?.active &&
                !enemy.hasHitPlayerThisAttack,
            action: (setup, char, enemy) => {
                const dmg = char.isProtect ? 2 : 10;
                char.combatCtrl.hit(setup.world.timestamp, dmg);
                setup.statusBarCharacter.setPercentage(char.energy);
                setup.state.damageTexts.push(new DamageText(char, dmg));
                enemy.hasHitPlayerThisAttack = true;
            }
        },

        {
            type: "collision",
            once: false,
            objectA: "character",
            objectB: "enemies",
            useAttackHitboxA: true,
            condition: (setup) => {
                const char = setup.world.character;
                return !!char && char.isAttack && !char.hasHitEnemyThisAttack;
            },
            targetFilter: (enemy, setup, char) => {
                if (!enemy || enemy.isDead || enemy.isRemoved) return false;

                const cBox = char.getHitboxRect?.();
                const eBox = enemy.getHitboxRect?.();

                const charCenterX = cBox ? cBox.cx : char.x + char.width * 0.5;
                const enemyCenterX = eBox ? eBox.cx : enemy.x + enemy.width * 0.5;

                return char.isFlipped
                    ? enemyCenterX < charCenterX
                    : enemyCenterX > charCenterX;
            },
            action: (setup, char, enemy) => {
                const hit = enemy.combatCtrl.receiveHit(setup.world.timestamp, {
                    dmg: 1,
                    attackerFlipped: char.isFlipped,
                    knockX: 12,
                    knockY: 12,
                    deathRemoveMs: 2000,
                    onHurtSound: () => {
                        const sound = setup.sounds.enemyHurtSfx.cloneNode();
                        sound.currentTime = 0;
                        sound.play();
                    },
                    onDeathSound: () =>
                        setup.world.audioManager.playOneShot("chickenDeathSfx", { volume: 0.6 })
                });

                if (hit) {
                    char.hasHitEnemyThisAttack = true;
                }
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
                        enemy.isHurt = false; // optional: kein HURT-Anim bei Tod durch Sprung
                        setup.world.audioManager.playOneShot('chickenDeathSfx', { volume: 0.6 });
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
            type: "collision",
            once: false,
            objectA: "character",
            objectB: "enemies",
            useAttackHitboxB: true,
            condition: (setup) => {
                const char = setup.world.character;
                return !!char && !char.isHurt;
            },
            targetFilter: (enemy) =>
                !!enemy &&
                !enemy.isDead &&
                enemy.currentEnemy === "dragonSmall" &&
                !!enemy.attackHitbox?.active &&
                !enemy.hasHitPlayerThisAttack,
            action: (setup, char, enemy) => {
                const dmg = char.isProtect ? 2 : 10;
                char.combatCtrl.hit(setup.world.timestamp, dmg);
                setup.statusBarCharacter.setPercentage(char.energy);
                setup.state.damageTexts.push(new DamageText(char, dmg));
                enemy.hasHitPlayerThisAttack = true;
            }
        },

        //new Events von Check Collision from World

        // Spieler sammelt Coins ein
        {
            name: "town_collect_coins",
            type: "collision",
            once: false,
            objectA: "character",
            objectB: "coins",
            targetFilter: (coin) => !!coin,
            action: (setup, char, coin) => {
                const coins = setup.townLevel.coins;
                const bar = setup.coinBar;

                const index = coins.indexOf(coin);
                if (index === -1) return;

                coins.splice(index, 1);
                setup.world.audioManager.playOneShot("coinPickupSfx", { volume: 0.4 });

                if (bar.percentage < 100) {
                    bar.percentage = Math.min(bar.percentage + 20, 100);
                }
                bar.setPercentage(bar.percentage);
            }
        },

        // Spieler sammelt Bottles ein
        {
            name: "town_collect_bottles",
            type: "collision",
            once: false,
            objectA: "character",
            objectB: "bottles",
            condition: (setup) => setup.bottleBar.percentage !== 100,
            action: (setup, char, bottle) => {
                const bottles = setup.townLevel.bottles;
                const bar = setup.bottleBar;

                const index = bottles.indexOf(bottle);
                if (index === -1) return;

                bottles.splice(index, 1);
                setup.world.audioManager.playOneShot("bottleClinkSfx", { volume: 0.6 });

                bar.percentage = Math.min(bar.percentage + 20, 100);
                bar.setPercentage(bar.percentage);

                if (char.throwableBottles < 5) {
                    char.throwableBottles += 1;
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
            name: "town_throwable_bottles_cleanup",
            type: "quest",
            once: false,
            action: (setup) => {
                const bottles = setup.state.throwableObjects;

                for (let i = bottles.length - 1; i >= 0; i--) {
                    const bottle = bottles[i];
                    if (!bottle.markedForRemoval) continue;
                    bottle.isBrokenSound = false;
                }
            }
        },

        {
            name: "town_throwable_bottles_ground_hit",
            type: "quest",
            once: false,
            action: (setup) => {
                const world = setup.world;
                const bottles = setup.state.throwableObjects;
                const groundBottomY = 680;

                for (let i = bottles.length - 1; i >= 0; i--) {
                    const bottle = bottles[i];
                    if (bottle.markedForRemoval) continue;

                    const footY = bottle.y + bottle.height - (bottle.offset?.bottom ?? 0);
                    if (footY < groundBottomY) continue;

                    bottle.y = groundBottomY - bottle.height + (bottle.offset?.bottom ?? 0);

                    if (!bottle.isBrokenSound) {
                        world.audioManager.playOneShot("bottleBreakSfx", { volume: 0.6 });
                        bottle.isBrokenSound = true;
                        bottle.isBroken = true;
                        bottle.isThrow = false;
                        bottle.isGravity = false;
                        bottle.isBrokenAnimation = true;
                        bottle.isMovingLeft = false;
                        bottle.isMovingRight = false;
                    }
                }
            }
        },

        {
            name: "town_throwable_bottles_hit_enemy",
            type: "quest",
            once: false,
            action: (setup) => {
                const world = setup.world;
                const bottles = setup.state.throwableObjects;
                const enemies = setup.townLevel.enemies;

                for (let i = bottles.length - 1; i >= 0; i--) {
                    const bottle = bottles[i];
                    if (bottle.isBroken || bottle.markedForRemoval || bottle.isBrokenAnimation) continue;

                    for (let j = 0; j < enemies.length; j++) {
                        const enemy = enemies[j];

                        if (enemy.currentEnemy === "dragonSmall") continue;
                        if (enemy.isDead) continue;

                        const hit = bottle.isColliding(
                            enemy,
                            {},
                            { y: 50 }
                        );

                        if (!hit) continue;
                        if (bottle.isBrokenSound) break;

                        world.audioManager.playOneShot("bottleBreakSfx", { volume: 0.6 });
                        bottle.isBrokenSound = true;
                        bottle.isBroken = true;
                        bottle.isThrow = false;
                        bottle.isGravity = false;
                        bottle.isBrokenAnimation = true;

                        enemy.isDead = true;
                        enemy.isMovingLeft = false;
                        enemy.isMovingRight = false;
                        enemy.removeAt = setup.world.timestamp + 2000;

                        world.audioManager.playOneShot("chickenDeathSfx", { volume: 0.6 });
                        break;
                    }
                }
            }
        },

        {
            name: "town_throwable_bottles_hit_boss",
            type: "quest",
            once: false,
            action: (setup) => {
                const world = setup.world;
                const boss = setup.characters.endboss;
                const bottles = setup.state.throwableObjects;

                if (!boss) return;

                for (let i = bottles.length - 1; i >= 0; i--) {
                    const bottle = bottles[i];
                    if (bottle.isBroken || bottle.markedForRemoval || bottle.isBrokenAnimation) continue;
                    if (boss.isDead) continue;

                    const hit = bottle.isColliding(
                        boss,
                        {},
                        { x: 50 }
                    );

                    if (!hit) continue;
                    if (bottle.isBrokenSound) continue;

                    world.audioManager.playOneShot("bottleBreakSfx", { volume: 0.6 });
                    boss.isHurt = true;
                    boss.frameIndex = 0;

                    bottle.isBrokenSound = true;
                    bottle.isBroken = true;
                    bottle.isThrow = false;
                    bottle.isGravity = false;
                    bottle.isBrokenAnimation = true;

                    boss.energy -= 20;
                    setup.statusBarEndboss.setPercentage(boss.energy);

                    if (boss.energy <= 0) {
                        boss.isDead = true;
                        boss.frameIndex = 0;
                    }
                }
            }
        },

        // Nahkampf-Hit auf Endboss
        {
            name: "town_melee_hits_boss",
            type: "collision",
            once: false,
            objectA: "character",
            objectB: "endboss",
            useAttackHitboxA: true,
            condition: (setup) => {
                const char = setup.world.character;
                const boss = setup.characters.endboss;
                return !!char && !!boss && char.isAttack && !char.hasHitEnemyThisAttack && !boss.isDead;
            },
            action: (setup, char, boss) => {
                boss.isHurt = true;
                boss.frameIndex = 0;
                boss.energy -= 5;
                setup.statusBarEndboss.setPercentage(boss.energy);

                char.hasHitEnemyThisAttack = true;

                if (boss.energy <= 0) {
                    boss.isDead = true;
                    boss.frameIndex = 0;
                }
            }
        },

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
                    (c.throwableBottles ?? 0) > 0 &&
                    !c.isAttack &&
                    !c.isProtect &&
                    throwIsIdle;

                if (!canThrow) {
                    if ((c.throwableBottles ?? 0) === 0) {
                        world.audioManager.playOneShot("bottleEmptySfx", { volume: 0.6 });
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
                c.throwableBottles = Math.max((c.throwableBottles ?? 0) - 1, 0);
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
                if ((c.throwableBottles ?? 0) <= 0) return;
                if (world.keyboard.LEFT || world.keyboard.RIGHT) return;
                const p = setup.state.throwHoldProgress ?? 0;
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
                return (c.throwableBottles ?? 0) <= 0;
            },
            action: (setup) => {
                setup.world.audioManager.playOneShot("bottleEmptySfx", { volume: 0.6 });
            }
        },
    ];