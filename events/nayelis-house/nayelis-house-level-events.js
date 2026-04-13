import { PopupText } from "../../classes/ui/popup-text.class.js";

export const nayelisHouseEvents =
    [
        /**
         * Quest event that initializes the scene, positions the character,
         * sets Nayeli to idle, starts background music, and plays the video.
         */
        {
            name: 'init',
            type: 'quest',
            action: (setup) => {
                setup.world.camera_x = 0;
                setup.world.character.x = setup.comeFromNewWeapon ? 710 : 300;
                setup.world.character.speedX = 2;
                setup.world.character.y = 370;
                setup.world.level_start_x = 290;
                setup.world.level_end_x = 845;
                setup.characters.nayeli.updateAnimationState('idle', 1000 / 5.2);
                setup.sounds.nayeliThemeMusic.loop = true;
                setup.world.audioManager.fadeInAudio(setup.sounds.nayeliThemeMusic, 2000, 0.3);
                setup.video.loop = true;
                setup.video.play();
                setup.comeFromNewWeapon = false;
                setup.cutsceneIndicator.hide({ silent: true, immediate: true });

                // setup.world.townLevelController.questManager.advance(12); // muss wieder entfernt werden!!
                // setup.world.nayelisHouseLevelController.questManager.advance(3); // muss wieder entfernt werden!!
            }
        },

        /**
         * Quest event that resets the camera position.
         */
        {
            type: 'quest',
            once: false,
            action: (setup) => {
                setup.world.camera_x = 0;
            }
        },


        /**
         * Position-based event that shows a hint on enter and hides it on leave.
         */
        {
            type: 'position',
            area: { x: 300, width: 50 },
            objectA: 'character',
            step: 3,
            once: false,
            action: (setup) => {
                setup.hints[0].show();
            },
            onLeave: (setup) => {
                setup.hints[0].hide();
            }
        },

        /**
         * Position-based event that changes the level, resets events, and updates state.
         */
        {
            name: 'changeLevel',
            type: "position",
            area: { x: 300, width: 50 },
            step: 3,
            requireKey: "F",
            action: (setup) => {
                setup.world.townLevelSetup.state.comeFromNayelisHouse = true;
                setup.world.townLevelController.eventManager.resetEventByName('init');
                setup.world.audioManager.fadeOutAudio(setup.sounds.nayeliThemeMusic, 1000);
                setup.world.keyboard.F = false;
                setup.world.character.isFlipped = false;
                setup.world.townLevelController.questManager.advance(12);
                setup.world.currentScene = 'townLevel';
            }
        },

        /**
         * Collision-based event that triggers Nayeli interaction and advances the quest.
         */
        {
            type: 'position',
            area: { x: 800, width: 10 },
            action: (setup) => {
                setup.world.taskWindow.markDone(2);
                setup.popupTexts.push(new PopupText("Aufgabe Erledigt!", setup.world.canvas.width / 2, 400));
                setup.world.audioManager.playOneShot('taskCompletedSfx');
                setup.world.taskWindow.setActive(0);
                setup.world.character.isMovingLeft = false;
                setup.world.character.isMovingRight = false;
                setup.world.isKeysStopp = true;
                setup.cutsceneIndicator.show({ skippable: false });
                setup.sounds.voNayeliSpeak01.play();
                setup.dialogManager.startDialog('nayeli:01', setup.world.timestamp);
                setup.world.nayelisHouseLevelController.questManager.advance(2);
            }

        },

        /**
         * Time-based event that updates character state, fades out audio, and switches scene.
         */
        {
            type: 'time',
            delay: 2000,
            step: 2,
            condition: (setup) => setup.sounds.voNayeliSpeak01.ended,
            action: (setup) => {
                setup.world.character.isFlipped = false;
                setup.world.audioManager.fadeOutAudio(setup.sounds.nayeliThemeMusic, 1000);
                setup.world.currentScene = 'newWeaponLevel';
            },
        },

        /**
         * Time-based event that starts the character dialog after a delay.
         */
        {
            type: 'time',
            delay: 2000,
            step: 3,
            action: (setup) => {
                setup.dialogManager.startDialog('character:01', setup.world.timestamp, () => {
                    setup.sounds.voNayeliSpeak02.play();
                    setup.dialogManager.startDialog('nayeli:02', setup.world.timestamp);
                });
            }
        },

        /**
         * Quest event that unlocks input after the Nayeli voice audio has ended.
         */
        {
            type: 'quest',
            step: 3,
            condition: (setup) => setup.sounds.voNayeliSpeak02.ended,
            action: (setup) => {
                setup.world.isKeysStopp = false;
                setup.cutsceneIndicator.hide();
            }
        }
    ];