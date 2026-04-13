import { PopupText } from "../../../classes/ui/popup-text.class.js";

export const townEvents_part6 = [
    /**
     * Time event that increases the blue fire height over time
     * and keeps it aligned relative to the character.
     */
    {
        type: "time",
        delay: 53000,
        step: 25,
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

    /**
     * Time event that updates Tadeo's spirit echo animation,
     * shows a speech bubble, and plays sound effects.
     */
    {
        type: "time",
        delay: 55000,
        step: 25,
        action: (setup) => {
            setup.environment.tadeoSpiritEcho.updateAnimationState('spiritOffering', 1000 / 6);
            setup.sounds.voTadeoSpiritEcho02.play();
            setup.dialogManager.playBubble(setup.speechBubblesTadeoSpiritEcho[5], {
                duration: 2000, now: setup.world.timestamp
            });
            setup.world.audioManager.playOneShot('beamChargeSfx', { volume: 0.8 });
        }
    },

    /**
     * Time event that fades out Tadeo's spirit echo.
     */
    {
        type: "time",
        delay: 56000,
        step: 25,
        action: (setup) => {
            setup.environment.tadeoSpiritEcho.fadeOut(setup.world.timestamp, 4000);
        }
    },

    /**
     * Time event that increases the blue fire height over time
     * and keeps it aligned relative to the character.
     */
    {
        type: "time",
        delay: 57000,
        step: 25,
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

    /**
     * Time event that triggers an earthquake effect
     * and plays the final beam charge sound effect.
     */
    {
        type: "time",
        delay: 59000,
        step: 25,
        action: (setup) => {
            setup.world.audioManager.playOneShot('earthquakeSfx', { volume: 0.6 });
            setup.state.shakeIntensity = 18;
            setup.state.earthquakeStart = true;
            setup.world.audioManager.playOneShot('beamChargeFinalSfx', { volume: 0.8 });
        },
    },

    /**
     * Time event that increases the blue fire width over time.
     */
    {
        type: "time",
        delay: 59000,
        step: 25,
        once: false,
        action: (setup) => {
            if (setup.environment.fireBlue.width <= 500) {
                setup.environment.fireBlue.width += 0.5;
            }
        },
    },

    /**
     * Time event that plays the boss hurt sound effect.
     */
    {
        type: "time",
        delay: 63000,
        step: 25,
        action: (setup) => {
            setup.world.audioManager.playOneShot('bossHurtSfx', { volume: 0.8 });
        },
    },

    /**
     * Time event that starts the white flash transition.
     */
    {
        type: "time",
        delay: 65000,
        step: 25,
        action: (setup) => {
            setup.whiteFlashTransition.start(setup.world.timestamp);
        },
    },

    /**
     * Time event that completes the task, updates the end scene state,
     * and advances the quest.
     */
    {
        type: "time",
        delay: 66000,
        step: 25,
        action: (setup) => {
            setup.world.taskWindow.markDone(3);
            setup.state.popupTexts.push(new PopupText("Aufgabe Erledigt!", setup.world.canvas.width / 2, 400));
            setup.sounds.taskCompletedSfx.play();
            setup.world.character.isAttackEndScene = false;
            setup.world.character.y = 370;
            setup.environment.fireBlue.opacity = 0;
            setup.environment.rockyDesertPedestal.opacity = 0;
            setup.world.audioManager.fadeOutAudio(setup.sounds.endSceneMusic, 1000);
            setup.state.effectsBehind[0].opacity = 0;
            setup.characters.endboss.isDead = true;
            setup.world.townLevelController.questManager.advance(26);
        },
    },

    /**
     * Quest event that positions the soul
     * and fades in the soul theme music.
     */
    {
        type: "quest",
        step: 26,
        action: (setup) => {
            const boss = setup.characters.endboss;
            const soul = setup.characters.soul;
            soul.x = boss.x + 75;
            soul.y = boss.y + 200;
            setup.sounds.soulThemeMusic.loop = true;
            setup.world.audioManager.fadeInAudio(setup.sounds.soulThemeMusic, 2000, 0.4);

        },
    },

    /**
     * Time event that moves the character to a target position.
     */
    {
        type: "time",
        delay: 4000,
        step: 26,
        once: false,
        action: (setup) => {
            setup.world.character.movementCtrl.moveToX(27600, {
                speed: 1.5, faceTarget: true, setWalkFlag: true
            });
        }
    },

    /**
     * Position event that fades in the soul,
     * stops the character movement, and advances the quest.
     */
    {
        type: 'position',
        area: { x: 27600, width: 50 },
        step: 26,
        action: (setup) => {
            setup.characters.soul.fadeIn(setup.world.timestamp, 4000);
            setup.world.character.isWalk = false;
            setup.world.townLevelController.questManager.advance(27);
        }
    },

    /**
     * Quest event that moves the soul upward
     * and advances the quest on arrival.
     */
    {
        type: 'quest',
        step: 27,
        once: false,
        action: (setup) => {
            const arriveY = setup.characters.soul.moveToY(250, { speed: 0.5 });
            if (arriveY) {
                setup.world.townLevelController.questManager.advance(28);
            }
        }
    },

    /**
     * Quest event that plays a soul voice line
     * and starts a dialog.
     */
    {
        type: 'quest',
        step: 28,
        action: (setup) => {
            setup.world.audioManager.safePlay(setup.sounds.voSoulSpeak01);
            setup.dialogManager.startDialog('soul:01', setup.world.timestamp);
        }
    },

    /**
     * Quest event that updates the peace state
     * and advances the quest.
     */
    {
        type: 'quest',
        step: 28,
        condition: (setup) => setup.sounds.voSoulSpeak01.currentTime >= 18,
        action: (setup) => {
            setup.world.character.isMeditation = true;
            setup.characters.soul.updateAnimationState('findsPeace', 1000 / 5);
            setup.characters.endboss.isFindsPeace = true;
            setup.world.audioManager.fadeAudioTo(setup.sounds.soulThemeMusic, 8000, 1);
            setup.world.townLevelController.questManager.advance(29);
        }
    },

    /**
     * Quest event that fades out the endboss over time.
     */
    {
        type: 'quest',
        step: 29,
        once: false,
        action: (setup) => {
            setup.characters.endboss.opacity = Math.max(
                0, (setup.characters.endboss.opacity ?? 1) - 0.0015);
        }
    },

    /**
     * Quest event that moves the soul upward
     * and advances the quest on arrival.
     */
    {
        type: 'quest',
        step: 29,
        once: false,
        action: (setup) => {
            const arriveY = setup.characters.soul.moveToY(-500, { speed: 1 });
            if (arriveY) {
                setup.world.townLevelController.questManager.advance(30);
            }
        }
    },

    /**
     * Time event that starts the white flash transition
     * and advances the quest.
     */
    {
        type: 'time',
        delay: 4000,
        step: 30,
        action: (setup) => {
            setup.whiteFlashTransition.start(setup.world.timestamp);
            setup.world.townLevelController.questManager.advance(31);
        }
    },

    /**
     * Time event that updates the ending scene state
     * and switches the audio to the happy end theme.
     */
    {
        type: 'time',
        delay: 1000,
        step: 31,
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

    /**
     * Time event that moves Sollita to a target position,
     * starts the ending dialog, and advances the quest.
     */
    {
        type: 'time',
        delay: 5000,
        step: 31,
        once: false,
        action: (setup) => {
            const arriveX = setup.characters.sollita.moveToX(27380, { speed: 1 });
            if (arriveX) {
                setup.world.character.isFlipped = true;
                setup.characters.sollita.updateAnimationState('idle');
                setup.world.audioManager.fadeAudioTo(setup.sounds.happyEndMusic, 2000, 0.6);
                setup.sounds.voSollitaSpeak03.play();
                setup.dialogManager.startDialog('sollita:endScene', setup.world.timestamp);
                setup.world.townLevelController.questManager.advance(32);
            }
        }
    },

    /**
     * Time event that starts the white flash transition
     * and fades out the happy end music.
     */
    {
        type: 'time',
        delay: 4000,
        step: 32,
        condition: (setup) => setup.sounds.voSollitaSpeak03.ended,
        action: (setup) => {
            setup.whiteFlashTransition.start(setup.world.timestamp);
            setup.world.audioManager.fadeOutAudio(setup.sounds.happyEndMusic, 1000);
        }
    },

    /**
     * Time event that changes the scene to the end credits.
     */
    {
        type: 'time',
        delay: 5500,
        step: 32,
        condition: (setup) => setup.sounds.voSollitaSpeak03.ended,
        action: (setup) => {
            setup.world.currentScene = 'endCredits';
        }
    }
];