const townEvents =
    [
        {
            type: 'quest',
            action: (setup) => {
                setup.backgroundMusic.loop = true;
                fadeInAudio(setup.backgroundMusic, 2000, 0.6);
                setup.world.character.x = 23000; // 100 //18500
                setup.world.character.level_start_x = 0;
                setup.world.farmLevelSetup.farmLevel.level_end_x = 25000;
                setup.world.camera_x = 22900; //0 // 18400
                setup.world.character.speedX = 10;
                setup.world.character.isWalkDetermined = false;
                setup.characters.tadeo.updateAnimationState('idle', 1000 / 5);

                // setup.world.character.isWalkInStorm = true;
                setup.world.character.speedX = 5; //2

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
            type: 'time',
            delay: 2000,
            step: 1,
            action: (setup) => {
                setup.sounds.newTaskSound.play();
                setup.popupTexts.push(new PopupText("Neue Aufgaben im Log!", setup.world.canvas.width / 2, 400));
            }

        },

        {
            type: "position",
            area: { x: 1000, width: 100 },
            step: 1,
            action: (setup) => {
                setup.world.townLevelController.questManager.advance(2)
            }
        },

        {
            type: "time",
            from: 0,
            to: 5000,
            step: 2,
            once: false,
            action: (setup, elapsed, progress) => {
                const ctrl = setup.world.townLevelController;
                const intensity = progress * 0.5;

                ctrl.setSandstorm(intensity);
            },
            onEnd: (setup) => {
                const ctrl = setup.world.townLevelController;
                ctrl.setSandstorm(0.5);
                ctrl.questManager.advance(3);
            }
        },

        {
            type: "position",
            area: { x: 1300, width: 100 },
            step: 3,
            action: (setup) => {
                setup.world.townLevelController.questManager.advance(4)
            }
        },

        {
            type: "time",
            from: 0,
            to: 5000,
            step: 4,
            once: false,
            action: (setup, elapsed, progress) => {
                const ctrl = setup.world.townLevelController;
                const intensity = 0.5 + progress * 0.5;
                ctrl.setSandstorm(intensity);
            },
            onEnd: (setup) => {
                const ctrl = setup.world.townLevelController;
                ctrl.setSandstorm(1.0);
                ctrl.questManager.advance(5);
            }
        },


        {
            type: "position",
            area: { x: 1700, width: 100 },
            step: 5,
            action: (setup) => {
                setup.characters.tadeo.updateAnimationState('walk');
                setup.world.character.isCollapse = true;
                setup.world.townLevelController.questManager.advance(6)

            }
        },

        // {
        //     type: "position",
        //     area: { x: 1000, width: 100 },
        //     action: (setup) => {
        //         setup.townLevel.enemies.push(
        //             new Chicken('chickenMutatesSmall', images, 120, 120, 545, 2000, allAudios), 
        //             new Chicken('chickenMutatesSmall', images, 120, 120, 545, 2050, allAudios),
        //             new Chicken('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),
        //             new Chicken('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),
        //             new Chicken('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),
        //             new Chicken('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),
        //             new Chicken('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),
        //             new Chicken('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),
        //             new Chicken('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),
        //             new Chicken('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),
        //             new Chicken('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),
        //             new Chicken('chickenMutatesBig', images, 160, 160, 505, 2100, allAudios),



        //         )
        //         setup.townLevel.enemies.forEach(enemy => {
        //         enemy.world = setup.world;
        //     });
        //     }
        // },

        {
            type: "quest",
            step: 6,
            once: false,
            action: (setup) => {
                if (setup.characters.tadeo.x >= 2000) {
                    setup.characters.tadeo.isMovingLeft = true;
                } else {
                    setup.characters.tadeo.isMovingLeft = false;
                    setup.characters.tadeo.updateAnimationState('idle');
                    setup.speechBubbles[0].start(4500);
                    setup.world.townLevelController.questManager.advance(7);
                }
            }
        },

        {
            type: "time",
            delay: 2000,
            step: 6,
            action: (setup) => {
                fadeOutAudio(setup.backgroundMusic, 1000);
                fadeInAudio(setup.sounds.tadeosMusic, 2000, 0.6);

            }
        },

        // {
        //     type: "time",
        //     from: 0,
        //     to: 5000,
        //     step: 3,
        //     once: false,
        //     action: (setup) => setup.speechBubbles[0].render(setup.world.ctx, setup.world.townLevelController.renderCameraX, 0)
        // },

        // {
        //     type: "time",
        //     delay: 5000,
        //     step: 3,
        //     action: (setup) => setup.speechBubbles[1].start(4500)
        // },

        // {
        //     type: "time",
        //     from: 5000,
        //     to: 10000,
        //     step: 3,
        //     once: false,
        //     action: (setup) => setup.speechBubbles[1].render(setup.world.ctx, setup.world.townLevelController.renderCameraX)
        // },

        // {
        //     type: "time",
        //     delay: 10000,
        //     step: 3,
        //     action: (setup) => setup.speechBubbles[2].start(4500)
        // },

        // {
        //     type: "time",
        //     from: 10000,
        //     to: 15000,
        //     step: 3,
        //     once: false,
        //     action: (setup) => setup.speechBubbles[2].render(setup.world.ctx, setup.world.townLevelController.renderCameraX, 0)
        // }

        {
            type: "time",
            delay: 3000,
            step: 7,
            action: (setup) => {
                // setup.sounds.tadeoHoldStoneMusic.currentTime = 35;
                fadeInAudio(setup.sounds.tadeoHoldStoneMusic, 2000, 0.6);
                fadeOutAudio(setup.sounds.tadeosMusic, 1000);
                setup.characters.tadeo.updateAnimationState('stoneActivated', 1000 / 5.5);
                setup.panel.activate(performance.now());
                setup.world.townLevelController.magicShield.start();

            }
        },

        {
            type: "time",
            delay: 6000,
            step: 7,
            action: (setup) => {
                setup.world.character.isCollapse = true;
            }
        },

        {
            type: "time",
            delay: 8000,
            step: 7,
            action: (setup) => {
                setup.world.character.isCollapse = false;
                setup.world.character.isStandUpAfterCollapse = true;
                setup.world.character.isWalkInStorm = false;
                setup.world.character.speedX = 5;
                setup.characters.tadeo.updateAnimationState('walkWithStone');
                setup.characters.tadeo.speedX = 0.5;
                setup.characters.tadeo.isFlipped = false;
                setup.world.townLevelController.questManager.advance(8);
            }
        },

        // {
        //     type: "time",
        //     delay: 3000,
        //     step: 8,
        //     once: false,
        //     action: (setup) => {
        //         if (setup.characters.tadeo.x <= 10275 /*&& setup.world.character.x >= setup.characters.tadeo.x - 170 && setup.world.character.x <= setup.characters.tadeo.x + 170*/) {
        //             setup.characters.tadeo.isMovingRight = true;
        //             setup.characters.tadeo.updateAnimationState('walkWithStone');
        //             // setup.world.character.level_start_x = setup.characters.tadeo.x - 170;
        //             // setup.world.farmLevelSetup.farmLevel.level_end_x = setup.characters.tadeo.x + 170;
        //         } else {
        //             setup.characters.tadeo.isMovingRight = false;
        //             setup.characters.tadeo.updateAnimationState('idleWithStone');
        //             // setup.world.character.level_start_x = setup.characters.tadeo.x - 170;
        //             // setup.world.farmLevelSetup.farmLevel.level_end_x = setup.characters.tadeo.x + 170;
        //             // setup.world.townLevelController.questManager.advance(9);
        //         }
        //     }
        // },

        {
            type: 'collision',
            objectA: 'character',
            objectB: 'tadeo',
            toleranceB: { x: -50, width: -50 },
            step: 8,
            once: false,
            action: (setup) => {
                if (setup.characters.tadeo.x <= 10275 /*&& setup.world.character.x >= setup.characters.tadeo.x - 170 && setup.world.character.x <= setup.characters.tadeo.x + 170*/) {
                    setup.characters.tadeo.isMovingRight = true;
                    setup.characters.tadeo.updateAnimationState('walkWithStone');
                }
            },
            onLeave: (setup) => {
                setup.characters.tadeo.isMovingRight = false;
                setup.characters.tadeo.updateAnimationState('idleWithStone');
            }
        },

        {
            type: 'quest',
            step: 8,
            once: false,
            action: (setup) => {
                const hero = setup.world.character;
                const tadeo = setup.characters.tadeo;
                const radius = 180;

                const left = tadeo.x - radius;
                const right = tadeo.x + radius;

                if (hero.x < left) hero.x = left;
                if (hero.x > right) hero.x = right;
            }
        },

        {
            type: 'collision',
            objectA: 'character',
            objectB: 'musician',

            toleranceB: { x: -150, width: -150 },
            once: false,
            cooldown: 500,
            action: (setup) => {
                if (!setup.isNearMusician) {
                    setup.isNearMusician = true;
                    setup.sounds.musicianTownMusic.currentTime = 0;
                    fadeOutAudio(setup.backgroundMusic, 1000);
                    fadeInAudio(setup.sounds.musicianTownMusic, 2000, 0.6);
                }
            },
            onLeave: (setup) => {
                if (setup.isNearMusician) {
                    setup.isNearMusician = false;
                    setup.backgroundMusic.currentTime = 0;
                    fadeOutAudio(setup.sounds.musicianTownMusic, 1000);
                    fadeInAudio(setup.backgroundMusic, 2000, 0.6);
                }
            }
        },

        {
            type: 'collision',
            objectA: 'character',
            objectB: 'sollita',
            toleranceB: { x: -80, width: -80 },
            once: false,
            cooldown: 500,
            action: (setup) => {
                if (!setup.isNearSollita) {
                    setup.isNearSollita = true;
                    setup.sounds.sollitasMusic.currentTime = 0;
                    fadeOutAudio(setup.backgroundMusic, 1000);
                    fadeInAudio(setup.sounds.sollitasMusic, 2000, 0.6);
                }
            },
            onLeave: (setup) => {
                if (setup.isNearSollita) {
                    setup.isNearSollita = false;
                    setup.backgroundMusic.currentTime = 0;
                    fadeOutAudio(setup.sounds.sollitasMusic, 1000);
                    fadeInAudio(setup.backgroundMusic, 2000, 0.6);
                }
            }
        },

        {
            type: "position",
            area: { x: 22500, width: 100 },
            action: (setup) => {
                setup.characters.endboss.x = 22000;
                setup.characters.endboss.y = -100;
                setup.characters.endboss.isFlipped = true;
                setup.characters.endboss.isFly = true;
                // setup.sounds.endbossFlappingWingsSound.play();
                // setup.sounds.endbossFlappingWingsSound.loop = true;
                // setup.sounds.endbossFlappingWingsSound.volume = 1.0;
                setup.endbossMusic.currentTime = 0;
                fadeOutAudio(setup.backgroundMusic, 1000);
                fadeInAudio(setup.endbossMusic, 2000, 0.6);


                const audio = setup.sounds.endbossFlappingWingsSound;
                const ctx = new AudioContext();

                const source = ctx.createMediaElementSource(audio);
                const gainNode = ctx.createGain();

                gainNode.gain.value = 6.0; // 200% Lautstärke

                source.connect(gainNode);
                gainNode.connect(ctx.destination);

                audio.play();
                audio.loop = true;
                setup.world.character.speedX = 8;


                setup.world.townLevelController.questManager.advance(12);

            }
        },

        // {
        //     type: "quest",
        //     action: (setup) => {
        //         setup.world.character.y = 165;
        //         setup.world.character.yNormal = 165;
        //         setup.world.character.yVoidless = 282;
        //         setup.characters.endboss.x = 23850
        //         setup.characters.endboss.isFireballAttack = true;
        //         setup.world.townLevelController.questManager.advance(20);
        //     }
        // },

        // {
        //     type: "quest",
        //     once: false,
        //     action: (setup) => {
        //         setup.characters.endboss.isFireballAttack = true;
        //     }
        // },

        // {
        //     type: "time",
        //     delay: 5000,
        //     step: 20,
        //     action: (setup) => {
        //         setup.world.character.isAirHitStun = true;
        //         setup.environment.juanitoSpirit.updateAnimationState('spiritCuddle', 1000 / 4);
        //         setup.environment.pollitoSpirit.updateAnimationState('spiritCuddle', 1000 / 4);
        //         setup.environment.lolaSpirit.updateAnimationState('spiritCuddle', 1000 / 4);
        //         fadeOutAudio(setup.backgroundMusic, 1000);
        //         fadeInAudio(setup.sounds.airHitStunMusic, 2000, 1.0);
        //     }
        // },
        {
            type: "quest",
            step: 12,
            once: false,
            action: (setup) => {
                if (setup.characters.endboss.x <= 23000) {
                    setup.characters.endboss.x += 3;
                } else {
                    setup.characters.endboss.setPhase(
                        setup.characters.endboss.ENDBOSS_PHASE.AIR_EGGS
                    );
                    setup.world.townLevelController.questManager.advance(13);
                }

            }
        },
    ];