export const newWeaponEvents =
    [
        /**
         * Quest event that initializes character position, camera, and triggers new weapon sequence.
         */
        {
            type: 'quest',
            action: (setup) => {
                setup.world.character.x = 400; //550
                setup.world.character.y = 250;
                setup.world.camera_x = 0;
                setup.world.level_start_x = 290;
                setup.world.level_end_x = 845;
                setup.world.character.isNewWeapon = true;
                setup.sounds.newWeaponMusic.loop = true;
                setup.world.audioManager.fadeInAudio(setup.sounds.newWeaponMusic, 2000);
                setup.sounds.voNewWeapon01.play();
                setup.cutsceneIndicator.show({ skippable: false, silent: true });
                setup.video.loop = true;
                setup.video.play();
            }
        },

        /**
         * Time-based event that resets the new weapon state and fades out audio.
         */
        {
            type: 'time',
            delay: 20000,
            action: (setup) => {
                setup.world.character.isNewWeapon = false;
                setup.world.audioManager.fadeOutAudio(setup.sounds.newWeaponMusic, 1000);
            }
        },

        /**
         * Time-based event that switches scene and resets an event.
         */
        {
            type: 'time',
            delay: 21000,
            action: (setup) => {
                setup.world.nayelisHouseLevelSetup.comeFromNewWeapon = true;
                setup.world.nayelisHouseLevelController.eventManager.resetEventByName('init');
                setup.world.nayelisHouseLevelController.questManager.advance(3);
                setup.world.currentScene = 'nayelisHouseLevel';
            }
        }
    ];