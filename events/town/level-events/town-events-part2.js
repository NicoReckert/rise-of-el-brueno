import { PopupText } from "../../../classes/ui/popup-text.class.js";
import { Enemy } from "../../../classes/entities/enemy.class.js";
import { townHelper } from "../helpers/town-helper.js";

export const townEvents_part2 = [
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
                setup.world.townLevelController.questManager.advance(10);
            }
        }
    },

    /**
     * Position event that plays Tadeo voice audio and starts a dialog.
     */
    {
        type: "position",
        objectA: 'tadeo',
        area: { x: 15620, width: 100 },
        step: 9,
        action: (setup) => {
            setup.sounds.voTadeoSpeak01.play();
            setup.dialogManager.startDialog('tadeo:01', setup.world.timestamp);
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
            setup.sounds.voTadeoSpeak02.play();
            setup.characters.tadeo.updateAnimationState('stoneActivated', 1000 / 5.5);
            setup.panel.activate(performance.now());
            setup.world.townLevelController.magicShield.start();
            setup.world.audioManager.playOneShot("shieldChargeSfx", 0.7);
            setup.dialogManager.startDialog('tadeo:02', setup.world.timestamp);
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
            setup.world.character.speedX = 3;
            setup.world.character.isWalkInStorm = false;
            setup.characters.tadeo.updateAnimationState('idleWithStone');
            setup.sounds.voTadeoSpeak03.play();
            setup.dialogManager.startDialog('tadeo:03', setup.world.timestamp);
        }
    },

    /**
     * Time event that restores the character from collapse, starts a dialog,
     * and completes the task after the dialog callback.
     */
    {
        type: "time",
        delay: 20000,
        step: 10,
        action: (setup) => {
            setup.world.character.isCollapse = false;
            setup.world.character.isStandUpAfterCollapse = true;
            setup.sounds.voTadeoSpeak04.play();
            setup.dialogManager.startDialog('tadeo:04', setup.world.timestamp, () => {
                setup.world.taskWindow.markDone(1);
                setup.state.popupTexts.push(new PopupText("Aufgabe Erledigt!", setup.world.canvas.width / 2, 400));
                setup.sounds.taskCompletedSfx.play();
            });
        }
    },

    /**
     * Time event that starts a dialog, restores input,
     * updates the task log, and advances the quest.
     */
    {
        type: "time",
        delay: 30000,
        step: 10,
        action: (setup) => {
            setup.dialogManager.startDialog('character:03', setup.world.timestamp, () => {
                setup.world.isKeysStopp = false;
                setup.cutsceneIndicator.hide();
                setup.characters.tadeo.isFlipped = false;
                setup.world.taskWindow.addTask('3. Erreiche Nayeli', { active: true })
                setup.sounds.newTaskSfx.play();
                setup.state.popupTexts.push(new PopupText("Neue Aufgaben im Log!", setup.world.canvas.width / 2, 400));
                setup.world.townLevelController.questManager.advance(11);
            });
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
            const arriveX = tadeo.moveToX(20350, { speed: 0.8 });
            if (setup.state.isTadeoAfraid || setup.state.isTadeoPanic) {
                tadeo.isMovingRight = false;
                return;
            }
            if (!arriveX) setup.characters.tadeo.updateAnimationState('walkWithStone');
            if (arriveX && !setup.state.isTadeoArrivedNayelisHouse) {
                setup.characters.tadeo.updateAnimationState('idleWithStone');
                setup.state.isTadeoArrivedNayelisHouse = true;
            }
        },
        onLeave: (setup) => {
            if (setup.state.isTadeoAfraid || setup.state.isTadeoPanic) return;
            setup.characters.tadeo.isMovingRight = false;
            setup.characters.tadeo.updateAnimationState('idleWithStone');
        }
    },

    /**
     * Quest event that reacts when Tadeo arrives at Nayeli's house,
     * flips the character, and starts a dialog.
     */
    {
        type: 'quest',
        step: 11,
        condition: (setup) => setup.state.isTadeoArrivedNayelisHouse,
        action: (setup) => {
            setup.characters.tadeo.isFlipped = true;
            setup.sounds.voTadeoSpeak05.play();
            setup.dialogManager.startDialog('tadeo:05', setup.world.timestamp);
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
            if (setup.state.isTadeoPanic) return;
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
            const duration = 2600;
            const lockUntil = now + duration + 600;
            setup.state.tadeoSpeechLockUntil = Math.max(setup.state.tadeoSpeechLockUntil ?? 0, lockUntil);
            const bubbles = setup.speechBubblesTadeoAfraid;
            const idx = (Math.random() * bubbles.length) | 0;
            setup.state.tadeoAfraidIdx = idx;
            setup.dialogManager.playBubble(bubbles[idx], { now, duration });
            setup.world.audioManager.playOneShot(`voTadeoAfraid0${idx + 1}`, { volume: 0.9 });
        }
    },
];