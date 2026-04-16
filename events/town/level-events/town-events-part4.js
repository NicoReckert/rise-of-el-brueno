import { PopupText } from "../../../classes/ui/popup-text.class.js";
import { townHelper } from "../helpers/town-helper.js";

export const townEvents_part4 = [
    /**
     * Quest event that plays a dialog sequence, updates audio,
     * restores input, and advances the quest.
     */
    {
        type: 'quest',
        step: 18,
        action: (setup) => {
            setup.sounds.voSollitaSpeak01.play();
            setup.dialogManager.startDialog('sollita:01', setup.world.timestamp, () => {
                setup.dialogManager.startDialog('character:04', setup.world.timestamp, () => {
                    setup.sounds.voSollitaSpeak02.play();
                    setup.dialogManager.startDialog('sollita:02', setup.world.timestamp, () => {
                        setup.world.audioManager.fadeInAudio(setup.sounds.townDayMusic, 2000, 0.5);
                        setup.world.audioManager.fadeOutAudio(setup.sounds.sollitaThemeMusic, 1000);
                        setup.world.isKeysStopp = false;
                        setup.cutsceneIndicator.hide();
                        setup.world.townLevelController.questManager.advance(19);
                    });
                });
            });
        }
    },

    /**
     * Position event that plays the town heal sequence.
     */
    {
        type: 'position',
        area: { x: 26500, width: 50 },
        step: 19,
        action: (setup) => {
            townHelper.playTownHealSequence(setup)
        }
    },

    /**
     * Time event that restores input and hides the cutscene indicator.
     */
    {
        type: 'time',
        delay: 4000,
        step: 20,
        action: (setup) => {
            setup.world.isKeysStopp = false;
            setup.cutsceneIndicator.hide();
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
                setup.world.audioManager.fadeInAudio(setup.sounds.townDayMusic, 2000, 0.5);
            }
        }
    },

    /**
     * Position event that updates the battle area, adds a task,
     * starts the boss encounter, and updates the audio state.
     */
    {
        type: "position",
        area: { x: 27500, width: 100 },
        step: 20,
        action: (setup) => {
            setup.world.level_start_x = 27000;
            setup.world.camera_start_x = 26800;
            setup.world.taskWindow.addTask('4. Besiege den Endboss', { active: true })
            setup.sounds.newTaskSfx.play();
            setup.state.popupTexts.push(new PopupText("Neue Aufgaben im Log!", setup.world.canvas.width / 2, 400));
            setup.characters.endboss.opacity = 1;
            setup.sounds.voUnknownSpeak01.play();
            setup.characters.endboss.isFlipped = true;
            setup.characters.endboss.isFly = true;
            setup.world.audioManager.fadeOutAudio(setup.sounds.townDayMusic, 1000);
            setup.world.audioManager.fadeInAudio(setup.sounds.bossBattleMusic, 2000, 0.6);
            setup.world.townLevelController.eventManager.emitNow("voiceReset");
        }
    },

    /**
     * Time event that plays a voice line after a reset-triggered delay.
     */
    {
        type: "time",
        resetOn: "voiceReset",
        delay: 2500,
        manual: true,
        step: 20,
        action: (setup) => {
            setup.sounds.voSollitaSpeak04.play();
        }
    },

    /**
     * Time event that triggers an earthquake effect
     * and advances the quest after a reset-triggered delay.
     */
    {
        type: "time",
        resetOn: "voiceReset",
        delay: 4500,
        manual: true,
        step: 20,
        action: (setup) => {
            setup.world.audioManager.playOneShot('earthquakeSfx');
            setup.state.shakeIntensity = 18;
            setup.state.earthquakeStart = true;
            setup.world.townLevelController.questManager.advance(21);
        }
    },

    /**
     * Quest event that moves the endboss to the target position
     * and starts the air eggs phase when the destination is reached.
     */
    {
        type: "quest",
        step: 21,
        once: false,
        action: (setup) => {
            const endboss = setup.characters.endboss;
            const arrivedX = endboss.moveToX(27000, 220);
            if (arrivedX) {
                endboss.setPhase(endboss.ENDBOSS_PHASE.AIR_EGGS)
                setup.world.townLevelController.questManager.advance(22)
            }
        }

    },

    /**
     * Quest event that triggers an earthquake effect
     * while the character is not captured by a tornado.
     */
    {
        type: "quest",
        step: 22,
        once: false,
        cooldown: 20000,
        condition: (setup) => !setup.world.character?.isCapturedByTornado,
        action: (setup) => {
            setup.world.audioManager.playOneShot('earthquakeSfx', { volume: 0.6 });
            setup.state.shakeIntensity = 15;
            setup.state.earthquakeStart = true;
        }
    },

    /**
     * Quest event that clears the town combat state
     * when the character is captured by a tornado.
     */
    {
        name: "town_kill_enemies_on_tornado_capture",
        type: "quest",
        step: 22,
        once: true,
        condition: (setup) => setup.world.character?.isCapturedByTornado,
        action: (setup) => {
            townHelper.clearTownCombatState(setup);
        }
    },

    /**
     * Quest event that follows the tornado with the camera
     * while the character is captured.
     */
    {
        name: "follow_tornado_camera",
        type: "quest",
        step: 22,
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

    /**
     * Quest event that locks input and shows the cutscene indicator
     * while the character is captured by a tornado.
     */
    {
        type: "quest",
        step: 22,
        condition: (setup) => setup.world.character?.isCapturedByTornado,
        action: (setup) => {
            setup.world.character.isFlipped = false;
            setup.world.character.isMovingLeft = false;
            setup.world.character.isMovingRight = false;
            setup.world.isKeysStopp = true;
            setup.cutsceneIndicator.show({ skippable: false });
        }
    },

    /**
     * Quest event that fades out UI elements
     * while the character is captured by a tornado.
     */
    {
        type: "quest",
        step: 22,
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

    /**
     * Time event that updates the audio state
     * and fades in the Macuahuitl environment object.
     */
    {
        type: "time",
        delay: 4000,
        step: 23,
        action: (setup) => {
            setup.world.audioManager.fadeOutAudio(setup.sounds.airHitStunMusic, 1000);
            setup.world.audioManager.fadeInAudio(setup.sounds.endSceneMusic, 2000);
            setup.environment.macuahuitl.fadeIn(setup.world.timestamp, 4000)
        }
    },

    /**
     * Time event that moves the Macuahuitl object upward
     * and advances the quest on arrival.
     */
    {
        type: "time",
        delay: 6000,
        step: 23,
        once: false,
        action: (setup) => {
            const macuahuitl = setup.environment.macuahuitl;
            const arriveY = macuahuitl.moveToY(150, { speed: 0.5 });
            if (arriveY) {
                setup.world.audioManager.fadeAudioTo(setup.sounds.endSceneMusic, 2000, 0.4);
                setup.world.townLevelController.questManager.advance(24);
            }
        }
    },

    /**
     * Time event that starts the Nayeli spirit sequence,
     * fades in the spirit echo, and starts a dialog.
     */
    {
        type: "time",
        delay: 1000,
        step: 24,
        action: (setup) => {
            setup.environment.nayeliSpiritEcho.updateAnimationState('spiritCuddle', 1000 / 5.5);
            setup.environment.nayeliSpiritEcho.fadeIn(setup.world.timestamp, 4000);
            setup.sounds.voNayeliSpirit01.play();
            setup.dialogManager.startDialog('nayeliSpiritEcho:01', setup.world.timestamp);
        },
    },

    /**
     * Time event that fades out the Nayeli spirit echo.
     */
    {
        type: "time",
        delay: 8000,
        step: 24,
        action: (setup) => {
            setup.environment.nayeliSpiritEcho.fadeOut(setup.world.timestamp, 4000);
        },
    },

    /**
     * Time event that starts the Sollita spirit sequence,
     * fades in the spirit echo, and starts a dialog.
     */
    {
        type: "time",
        delay: 9000,
        step: 24,
        action: (setup) => {
            setup.environment.sollitaSpiritEcho.updateAnimationState('spiritCuddle', 1000 / 5.5);
            setup.environment.sollitaSpiritEcho.fadeIn(setup.world.timestamp, 4000);
            setup.sounds.voSollitaSpiritEcho01.play();
            setup.dialogManager.startDialog('sollitaSpiritEcho:01', setup.world.timestamp);
        },
    },

    /**
     * Time event that fades out the Sollita spirit echo.
     */
    {
        type: "time",
        delay: 17000,
        step: 24,
        action: (setup) => {
            setup.environment.sollitaSpiritEcho.fadeOut(setup.world.timestamp, 4000);
        },
    },

    /**
     * Time event that starts the Tadeo spirit sequence,
     * fades in the spirit echo, and starts a dialog.
     */
    {
        type: "time",
        delay: 18000,
        step: 24,
        action: (setup) => {
            setup.environment.tadeoSpiritEcho.updateAnimationState('spiritCuddle', 1000 / 5.5);
            setup.environment.tadeoSpiritEcho.fadeIn(setup.world.timestamp, 4000);
            setup.sounds.voTadeoSpiritEcho01.play();
            setup.dialogManager.startDialog('tadeoSpiritEcho:01', setup.world.timestamp);
        },
    },

    /**
     * Time event that moves the Macuahuitl object downward
     * and advances the quest on arrival.
     */
    {
        type: "time",
        delay: 18000,
        step: 24,
        once: false,
        action: (setup) => {
            const macuahuitl = setup.environment.macuahuitl;
            const arriveY = macuahuitl.moveToY(220, { speed: 0.5 });
            if (arriveY) {
                setup.world.townLevelController.questManager.advance(25);
            }
        }
    },

    /**
     * Quest event that fades out the Macuahuitl object.
     */
    {
        type: "quest",
        step: 25,
        action: (setup) => {
            setup.environment.macuahuitl.fadeOut(setup.world.timestamp, 4000)
        }
    }
];