const townEvents =
    [
        {
            type: 'quest',
            action: (setup) => {
                setup.backgroundMusic.play();
                setup.backgroundMusic.loop = true;
                setup.world.character.x = 100;
                setup.world.character.level_start_x = 0;
                setup.world.farmLevelSetup.farmLevel.level_end_x = 25000;
                setup.world.camera_x = 0;
                setup.world.character.speedX = 10;
            }
        },

        {
            type: "position",
            area: { x: 10275, width: 95 },
            once: false,
            requireKey: "F",
            action: (setup) => {
                setup.world.currentScene = 'nayelisHouseLevel';
                setup.backgroundMusic.pause();
            }
        }
    ];