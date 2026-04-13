import { PopupText } from "../../../classes/ui/popup-text.class.js";
import { townHelper } from "../helpers/town-helper.js";

export const townEvents_part3 = [
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
            setup.state.tadeoPanicUntil = Math.max(setup.state.tadeoPanicUntil ?? 0, performance.now() + 200);
            if (setup.state.isTadeoAfraid) {
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
            const duration = 2000;
            const lockUntil = now + duration + 600;
            setup.state.tadeoSpeechLockUntil = Math.max(setup.state.tadeoSpeechLockUntil ?? 0, lockUntil);
            const bubbles = setup.speechBubblesTadeoPanic;
            const idx = (Math.random() * bubbles.length) | 0;
            setup.state.tadeoPanicProjIdx = idx;
            setup.dialogManager.playBubble(bubbles[idx], { now, duration });
            setup.world.audioManager.playOneShot(`voTadeoPanic0${idx + 1}`, { volume: 1.0 });
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
            const duration = 2000;
            const lockUntil = now + duration + 600;
            setup.state.tadeoSpeechLockUntil = Math.max(setup.state.tadeoSpeechLockUntil ?? 0, lockUntil);
            const bubbles = setup.speechBubblesTadeoPanic;
            const idx = (Math.random() * bubbles.length) | 0;
            setup.state.tadeoPanicNearIdx = idx;
            setup.dialogManager.playBubble(bubbles[idx], { now, duration });
            setup.world.audioManager.playOneShot(`voTadeoPanic0${idx + 1}`, { volume: 1.0 });
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

    /**
     * Quest event that updates the world state, disables storm effects,
     * enables combat state, and advances the quest.
     */
    {
        type: 'quest',
        step: 12,
        action: (setup) => {
            setup.world.camera_start_x = 20065;
            setup.sandstormFar.setEnabled(false);
            setup.sandstorm.setEnabled(false);
            setup.sandstormNear.setEnabled(false);
            setup.magicShield.stop();
            setup.characters.tadeo.updateAnimationState('idle');
            setup.world.character.isHaveSword = true;
            setup.world.character.config.initCombatConfig();
            setup.state.enemyHealth = 2;
            setup.world.townLevelController.questManager.advance(13);
        }
    },

    /**
     * Quest event that plays the Tadeo dialog 06 sequence.
     */
    {
        type: 'quest',
        step: 13,
        action: (setup) => {
            townHelper.playTadeoDialog06Sequence(setup);
        }
    },

    /**
     * Collision event that moves Tadeo to a target position,
     * completes the task on arrival, and restores the hint on leave.
     */
    {
        type: 'collision',
        objectA: 'character',
        objectB: 'tadeo',
        toleranceB: { x: -200 },
        step: 14,
        once: false,
        condition: (setup) => setup.sounds.voTadeoSpeak06.ended,
        action: (setup) => {
            setup.hints[1].hide();
            const tadeo = setup.characters.tadeo
            const arrivedX = tadeo.moveToX(22500, { speed: 2.0 });
            if (!arrivedX) {
                setup.characters.tadeo.updateAnimationState('walk')
            } else {
                setup.world.taskWindow.markDone(0);
                setup.state.popupTexts.push(new PopupText("Aufgabe Erledigt!", setup.world.canvas.width / 2, 400));
                setup.sounds.taskCompletedSfx.play();
                setup.world.townLevelController.questManager.advance(15)
            }
        },
        onLeave: (setup) => {
            setup.hints[1].show();
            setup.characters.tadeo.updateAnimationState('idle');
            setup.characters.tadeo.isMovingRight = false;
        }
    },

    /**
     * Collision event that plays a random encouragement voice line
     * and shows a speech bubble on leave.
     */
    {
        type: 'collision',
        objectA: 'character',
        objectB: 'tadeo',
        toleranceB: { x: -200 },
        step: 14,
        once: false,
        cooldown: 12000,
        onLeave: (setup) => {
            const index = Math.floor(Math.random() * 2) + 1;
            setup.world.audioManager.playOneShot(`voTadeoEncourage0${index}`);
            setup.dialogManager.playBubble(
                setup.speechBubblesTadeoEncourage[index - 1],
                { now: setup.world.timestamp }
            );
        }
    },

    /**
     * Quest event that limits the character position relative to Tadeo.
     */
    {
        type: 'quest',
        step: 14,
        once: false,
        action: (setup) => {
            const char = setup.world.character;
            const tadeo = setup.characters.tadeo;
            const gap = 20;
            const maxX = tadeo.x - char.width + gap;
            if (char.x > maxX) char.x = maxX;
        }
    },

    /**
     * Quest event that plays the Tadeo dialog 07 sequence.
     */
    {
        type: 'quest',
        step: 15,
        action: (setup) => {
            townHelper.playTadeoDialog07Sequence(setup);
        }
    },

    /**
     * Quest event that moves Tadeo to a target position.
     */
    {
        type: 'quest',
        step: 16,
        once: false,
        action: (setup) => {
            const tadeo = setup.characters.tadeo;
            const arrivedX = tadeo.moveToX(21000, { speed: 1.5 });
            if (!arrivedX) tadeo.updateAnimationState('walk');
        }
    },

    /**
     * Time event that fades out Tadeo.
     */
    {
        type: 'time',
        delay: 5000,
        step: 16,
        action: (setup) => {
            const tadeo = setup.characters.tadeo;
            tadeo.fadeOut(setup.world.timestamp, 1000);
        }
    },

    /**
     * Position event that locks input, updates audio,
     * and advances the quest.
     */
    {
        type: 'position',
        area: { x: 23500, width: 50 },
        step: 16,
        action: (setup) => {
            setup.world.character.isFlipped = false;
            setup.world.character.isMovingLeft = false;
            setup.world.character.isMovingRight = false;
            setup.world.isKeysStopp = true;
            setup.cutsceneIndicator.show({ skippable: false });
            setup.sounds.sollitaThemeMusic.currentTime = 0;
            setup.world.audioManager.fadeOutAudio(setup.sounds.townDayMusic, 1000);
            setup.world.audioManager.fadeInAudio(setup.sounds.sollitaThemeMusic, 2000, 0.6);
            setup.world.townLevelController.questManager.advance(17)
        }
    },

    /**
     * Quest event that moves Sollita to a target position
     * and advances the quest on arrival.
     */
    {
        type: 'quest',
        step: 17,
        once: false,
        action: (setup) => {
            const sollita = setup.characters.sollita;
            const arrivedX = sollita.moveToX(23500, { speed: 1.5 });
            if (!arrivedX) sollita.updateAnimationState('walk');
            if (arrivedX) {
                sollita.updateAnimationState('idle');
                setup.world.townLevelController.questManager.advance(18)
            }
        }
    },
];