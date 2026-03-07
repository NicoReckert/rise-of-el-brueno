export const nayelisHouseEvents =
    [
        /**
         * Quest event that initializes the scene, positions the character,
         * sets Nayeli to idle, starts background music, and plays the video.
         */
        {
            type: 'quest',
            action: (setup) => {
                setup.world.camera_x = 0;
                setup.world.character.x = 300;
                setup.world.character.level_start_x = 290;
                setup.world.level_end_x = 845;
                setup.characters.nayeli.updateAnimationState('idle', 1000 / 5.2);
                setup.sounds.nayelisMusic.volume = 0.3;
                setup.sounds.nayelisMusic.loop = true;
                setup.sounds.nayelisMusic.play();
                setup.video.loop = true;
                setup.video.play();
            }
        },

        /**
         * Collision-based event that triggers Nayeli dialogue,
         * emits a new weapon event, and advances the quest.
         */
        {
            type: 'collision',
            objectA: 'character',
            objectB: 'nayeli',
            toleranceB: { x: -80, width: 50 },
            action: (setup) => {
                setup.sounds.nayelisSpeakSound.play()
                setup.world.nayelisHouseLevelController.eventManager.emitNow('newWeaponStart');
                setup.world.nayelisHouseLevelController.questManager.advance(2)
            }

        },

        /**
         * Time-based quest event that transitions to the new weapon level,
         * updates character state, switches audio, and starts the level video.
         */
        {
            type: 'time',
            delay: 8000,
            resetOn: 'newWeaponStart',
            step: 2,
            action: (setup) => {
                setup.world.currentScene = 'newWeaponLevel';
                setup.world.character.x = 400;
                setup.world.character.level_start_x = 290;
                setup.world.level_end_x = 845;
                setup.world.character.isNewWeapon = true;
                setup.world.newWeaponLevelSetup.sounds.newWeaponMusic.loop = true;
                setup.world.newWeaponLevelSetup.sounds.newWeaponMusic.play();
                setup.world.newWeaponLevelSetup.sounds.newWeaponSpeakSound.play();
                setup.world.newWeaponLevelSetup.video.loop = true;
                setup.world.newWeaponLevelSetup.video.play();
                setup.world.nayelisHouseLevelSetup.sounds.nayelisMusic.pause();
            },
        },
    ];