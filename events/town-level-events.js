const townEvents =
    [
        {
            type: 'quest',
            action: (setup) => {
                setup.backgroundMusic.loop = true;
                fadeInAudio(setup.backgroundMusic, 2000, 0.6);
                setup.world.character.x = 100;
                setup.world.character.level_start_x = 0;
                setup.world.farmLevelSetup.farmLevel.level_end_x = 25000;
                setup.world.camera_x = 0;
                setup.world.character.speedX = 10;
                setup.world.character.isWalkDetermined = false;
                setup.characters.tadeo.updateAnimationState('idle', 1000 / 5);
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
        },

        {
            type: "position",
            area: { x: 500, width: 100 },
            step: 1,
            action: (setup) => {
                fadeOutAudio(setup.backgroundMusic, 1000);
                fadeInAudio(setup.sounds.tadeosMusic, 2000, 0.6);
                setup.characters.tadeo.updateAnimationState('walk');
                setup.world.townLevelController.questManager.advance(2)
            }
        },

        {
            type: "quest",
            step: 2,
            once: false,
            action: (setup) => {
                if (setup.characters.tadeo.x >= 800) {
                    setup.characters.tadeo.isMovingLeft = true;
                } else {
                    setup.characters.tadeo.isMovingLeft = false;
                    setup.characters.tadeo.updateAnimationState('idle');
                    setup.speechBubbles[0].start(4500);
                    setup.world.townLevelController.questManager.advance(3);
                }
            }
        },

        {
            type: "time",
            from: 0,
            to: 5000,
            step: 3,
            once: false,
            action: (setup) => setup.speechBubbles[0].render(setup.world.ctx, setup.world.townLevelController.renderCameraX, 0)
        },

        {
            type: "time",
            delay: 5000,
            step: 3,
            action: (setup) => setup.speechBubbles[1].start(4500)
        },

        {
            type: "time",
            from: 5000,
            to: 10000,
            step: 3,
            once: false,
            action: (setup) => setup.speechBubbles[1].render(setup.world.ctx, setup.world.townLevelController.renderCameraX)
        },

        {
            type: "time",
            delay: 10000,
            step: 3,
            action: (setup) => setup.speechBubbles[2].start(4500)
        },

        {
            type: "time",
            from: 10000,
            to: 15000,
            step: 3,
            once: false,
            action: (setup) => setup.speechBubbles[2].render(setup.world.ctx, setup.world.townLevelController.renderCameraX, 0)
        }
    ];


