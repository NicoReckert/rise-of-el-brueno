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
                setup.world.character.x = setup.comeFromNewWeapon ? 725 : 300;
                setup.world.character.y = 370;
                setup.world.character.level_start_x = 290;
                setup.world.level_end_x = 845;
                setup.characters.nayeli.updateAnimationState('idle', 1000 / 5.2);
                setup.sounds.nayelisMusic.loop = true;
                setup.world.audioManager.fadeInAudio(setup.sounds.nayelisMusic, 2000, 0.3);
                setup.video.loop = true;
                setup.video.play();
                setup.comeFromNewWeapon = false;
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
            step: 2,
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
            step: 2,
            requireKey: "F",
            action: (setup) => {
                setup.world.townLevelSetup.state.comeFromNayelisHouse = true;
                setup.world.townLevelController.eventManager.resetEventByName('init');
                setup.world.townLevelController.eventManager.resetEventByName('changeLevel');
                setup.world.audioManager.fadeOutAudio(setup.sounds.nayelisMusic, 1000);
                setup.world.keyboard.F = false;
                setup.world.character.isFlipped = false;
                setup.world.currentScene = 'townLevel';
            }
        },

        /**
         * Collision-based event that triggers Nayeli interaction and advances the quest.
         */
        {
            type: 'collision',
            objectA: 'character',
            objectB: 'nayeli',
            toleranceB: { x: -80, width: 50 },
            action: (setup) => {
                setup.sounds.nayelisSpeakSound.play()
                setup.world.nayelisHouseLevelController.questManager.advance(2)
            }

        },

        /**
         * Time-based event that updates character state, fades out audio, and switches scene.
         */
        {
            type: 'time',
            delay: 8000,
            step: 2,
            action: (setup) => {
                setup.world.character.isFlipped = false;
                setup.world.audioManager.fadeOutAudio(setup.sounds.nayelisMusic, 1000);
                setup.world.currentScene = 'newWeaponLevel';
            },
        }
    ];