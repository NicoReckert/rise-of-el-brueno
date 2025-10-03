const nayelisHouseEvents =
    [
        {
            type: 'quest',
            action: (setup) => {
                setup.world.camera_x = 0;
                setup.world.character.x = 300;
                setup.world.character.level_start_x = 290;
                setup.world.farmLevelSetup.farmLevel.level_end_x = 845;
                setup.npcs.nayeli.updateState('idle', 1000 / 5.2);
                setup.sounds.nayelisMusic.play();
                setup.sounds.nayelisMusic.volume = 0.3;
                setup.video.play();
            }
        },
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

        {
            type: 'time',
            delay: 8000,
            resetOn: 'newWeaponStart',
            step: 2,
            action: (setup) => {
                setup.world.currentScene = 'newWeaponLevel';
                // setup.world.camera_x = setup.world.character.x - 500;
                setup.world.character.x = 400;
                setup.world.character.level_start_x = 290;
                setup.world.farmLevelSetup.farmLevel.level_end_x = 845;
                setup.world.character.isNewWeapon = true;
                setup.world.newWeaponLevelSetup.sounds.newWeaponMusic.play();
                setup.world.newWeaponLevelSetup.sounds.newWeaponSpeakSound.play();
                setup.world.newWeaponLevelSetup.video.play()
                setup.world.nayelisHouseLevelSetup.sounds.nayelisMusic.pause();
            },
        },

    ];