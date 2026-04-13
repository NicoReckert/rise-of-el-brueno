import { townHelper } from "../helpers/town-helper.js";

export const townEvents_part5 = [
    /**
     * Time event that fades out spirit objects,
     * restores the character state, and updates the audio volume.
     */
    {
        type: "time",
        delay: 4000,
        step: 25,
        action: (setup) => {
            setup.environment.tadeoSpiritEcho.fadeOut(setup.world.timestamp, 4000);
            setup.environment.juanitoSpirit.fadeOut(setup.world.timestamp, 4000);
            setup.environment.lolaSpirit.fadeOut(setup.world.timestamp, 4000);
            setup.environment.pollitoSpirit.fadeOut(setup.world.timestamp, 4000);
            setup.world.character.isStandUpAfterPainStun = true;
            setup.world.audioManager.fadeAudioTo(setup.sounds.endSceneMusic, 2000, 0.8);

        },
    },

    /**
     * Time event that spawns the town spirits.
     */
    {
        type: "time",
        delay: 8000,
        step: 25,
        action: (setup) => {
            townHelper.spawnTownSpirits(setup);
        },
    },

    /**
     * Time event that fades in the blue fire
     * and plays a charge sound effect.
     */
    {
        type: "time",
        delay: 14000,
        step: 25,
        action: (setup) => {
            setup.environment.fireBlue.fadeIn(setup.world.timestamp, 4000);
            setup.world.audioManager.playOneShot('beamChargeSfx', { volume: 0.8 });
        }
    },

    /**
     * Time event that reduces the beam width over time.
     */
    {
        type: "time",
        delay: 14000,
        step: 25,
        once: false,
        action: (setup) => {
            const beam = setup.state.effectsBehind[0];
            if (beam && beam.width >= 300) {
                beam.width -= 0.5;
            }
        }
    },

    /**
     * Time event that starts the end scene dialog.
     */
    {
        type: "time",
        delay: 16000,
        step: 25,
        action: (setup) => {
            setup.dialogManager.startDialog('character:endScene:part02', setup.world.timestamp);
        }
    },

    /**
     * Time event that plays a charge sound effect.
     */
    {
        type: "time",
        delay: 30000,
        step: 25,
        action: (setup) => {
            setup.world.audioManager.playOneShot('beamChargeSfx', { volume: 0.8 });
        }
    },

    /**
     * Time event that increases the blue fire width over time.
     */
    {
        type: "time",
        delay: 30000,
        step: 25,
        once: false,
        action: (setup) => {
            if (setup.environment.fireBlue.width <= 250) {
                setup.environment.fireBlue.width += 0.5;
            }
        }
    },

    /**
     * Time event that reduces the beam width over time.
     */
    {
        type: "time",
        delay: 30000,
        step: 25,
        once: false,
        action: (setup) => {
            const beam = setup.state.effectsBehind[0];
            if (beam && beam.width >= 250) {
                beam.width -= 0.5;
            }
        }
    },

    /**
     * Time event that triggers an earthquake effect,
     * updates the boss state, and plays sound effects.
     */
    {
        type: "time",
        delay: 32000,
        step: 25,
        action: (setup) => {
            setup.world.audioManager.playOneShot('earthquakeSfx', { volume: 0.6 });
            setup.state.shakeIntensity = 18;
            setup.state.earthquakeStart = true;
            setup.characters.endboss.isFireBreath = false;
            setup.characters.endboss.isRage = true;
            setup.world.audioManager.playOneShot('bossRoarSfx', { volume: 0.8 });
            setup.world.audioManager.playOneShot('bossBeamChargeSfx', { volume: 0.8 });
        }
    },

    /**
     * Time event that increases the beam height over time.
     */
    {
        type: "time",
        delay: 32000,
        step: 25,
        once: false,
        action: (setup) => {
            const beam = setup.state.effectsBehind[0];
            if (beam && beam.height <= 700) {
                beam.height += 0.5;
            }
        }
    },

    /**
     * Time event that updates Juanito's spirit animation,
     * shows a speech bubble, and plays sound effects.
     */
    {
        type: "time",
        delay: 35000,
        step: 25,
        action: (setup) => {
            setup.environment.juanitoSpirit.updateAnimationState('spiritOffering', 1000 / 6);
            setup.dialogManager.playBubble(setup.speechBubblesJuanito[0], {
                duration: 2000, now: setup.world.timestamp
            });
            setup.world.audioManager.playOneShot('chickenSfx', { volume: 1 });
            setup.world.audioManager.playOneShot('beamChargeSfx', { volume: 0.8 });
        }
    },

    /**
     * Time event that updates the blue fire animation
     * and aligns it relative to the character.
     */
    {
        type: "time",
        delay: 37000,
        step: 25,
        action: (setup) => {
            const beam = setup.environment.fireBlue;
            const char = setup.world.character;
            beam.updateAnimationState('sustain', 1000 / 12);
            beam.height = 250;
            const anchorY = char.y - 36;
            beam.y = Math.round(anchorY + (500 - beam.height) / 2);
        }
    },

    /**
     * Time event that fades out Juanito's spirit.
     */
    {
        type: "time",
        delay: 38000,
        step: 25,
        action: (setup) => {
            setup.environment.juanitoSpirit.fadeOut(setup.world.timestamp, 4000);
        }
    },

    /**
     * Time event that updates Pollito's spirit animation,
     * shows a speech bubble, and plays sound effects.
     */
    {
        type: "time",
        delay: 39000,
        step: 25,
        action: (setup) => {
            setup.environment.pollitoSpirit.updateAnimationState('spiritOffering', 1000 / 6);
            setup.dialogManager.playBubble(setup.speechBubblesPollito[0], {
                duration: 2000, now: setup.world.timestamp
            });
            setup.world.audioManager.playOneShot('chickSfx', { volume: 1 });
            setup.world.audioManager.playOneShot('beamChargeSfx', { volume: 0.8 });
        }
    },

    /**
     * Time event that fades out Pollito's spirit.
     */
    {
        type: "time",
        delay: 40000,
        step: 25,
        action: (setup) => {
            setup.environment.pollitoSpirit.fadeOut(setup.world.timestamp, 4000);
        }
    },

    /**
     * Time event that increases the blue fire height over time
     * and keeps it aligned relative to the character.
     */
    {
        type: "time",
        delay: 41000,
        step: 25,
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

    /**
     * Time event that updates Lola's spirit animation,
     * shows a speech bubble, and plays sound effects.
     */
    {
        type: "time",
        delay: 43000,
        step: 25,
        action: (setup) => {
            setup.environment.lolaSpirit.updateAnimationState('spiritOffering', 1000 / 6);
            setup.dialogManager.playBubble(setup.speechBubblesLola[0], {
                duration: 2000, now: setup.world.timestamp
            });
            setup.world.audioManager.playOneShot('cowSfx01', { volume: 1 });
            setup.world.audioManager.playOneShot('beamChargeSfx', { volume: 0.8 });
        }
    },

    /**
     * Time event that fades out Lola's spirit.
     */
    {
        type: "time",
        delay: 44000,
        step: 25,
        action: (setup) => {
            setup.environment.lolaSpirit.fadeOut(setup.world.timestamp, 4000);
        }
    },

    /**
     * Time event that increases the blue fire height over time
     * and keeps it aligned relative to the character.
     */
    {
        type: "time",
        delay: 45000,
        step: 25,
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

    /**
     * Time event that updates Nayeli's spirit echo animation,
     * shows a speech bubble, and plays sound effects.
     */
    {
        type: "time",
        delay: 47000,
        step: 25,
        action: (setup) => {
            setup.environment.nayeliSpiritEcho.updateAnimationState('spiritOffering', 1000 / 6);
            setup.sounds.voNayeliSpiritEcho01.play();
            setup.dialogManager.playBubble(setup.speechBubblesNayeliSpiritEcho[3], {
                duration: 2000, now: setup.world.timestamp
            });
            setup.world.audioManager.playOneShot('beamChargeSfx', { volume: 0.8 });
        }
    },

    /**
     * Time event that fades out Nayeli's spirit echo.
     */
    {
        type: "time",
        delay: 48000,
        step: 25,
        action: (setup) => {
            setup.environment.nayeliSpiritEcho.fadeOut(setup.world.timestamp, 4000);
        }
    },

    /**
     * Time event that increases the blue fire height over time
     * and keeps it aligned relative to the character.
     */
    {
        type: "time",
        delay: 49000,
        step: 25,
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

    /**
     * Time event that updates Sollita's spirit echo animation,
     * shows a speech bubble, and plays sound effects.
     */
    {
        type: "time",
        delay: 51000,
        step: 25,
        action: (setup) => {
            setup.environment.sollitaSpiritEcho.updateAnimationState('spiritOffering', 1000 / 6);
            setup.sounds.voSollitaSpiritEcho02.play();
            setup.dialogManager.playBubble(setup.speechBubblesSollitaSpiritEcho[5], {
                duration: 2000, now: setup.world.timestamp
            });
            setup.world.audioManager.playOneShot('beamChargeSfx', { volume: 0.8 });

        }
    },

    /**
     * Time event that fades out Sollita's spirit echo.
     */
    {
        type: "time",
        delay: 52000,
        step: 25,
        action: (setup) => {
            setup.environment.sollitaSpiritEcho.fadeOut(setup.world.timestamp, 4000);
        }
    }
];