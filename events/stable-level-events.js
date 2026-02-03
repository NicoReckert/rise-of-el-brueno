import { PopupText } from "../classes/popup-text.class.js";

export const stableEvents =
    [
        {
            type: 'quest',
            name: 'initialize',
            action: (setup) => {
                setup.world.camera_x = 0;
                setup.world.character.x = 380;
                setup.world.farmLevelSetup.farmLevel.level_end_x = 720;
                setup.world.character.level_start_x = 360;
            }
        },
        {
            type: 'position',
            name: 'changeLevel',
            area: { x: 360, width: 100 },
            objectA: 'character',
            requireKey: 'F',
            action: (setup) => {
                setup.world.currentScene = 'farmLevel';
                setup.world.farmLevelController.eventManager.resetEventByName('initialize');
                setup.world.farmLevelController.eventManager.resetEventByName('changeLevel');
                setup.world.keyboard.F = false;
                setup.world.farmLevelSetup.comeFromStable = true;
            }
        },

        {
            type: 'position',
            area: { x: 360, width: 100 },
            objectA: 'character',
            once: false,
            step: 1,
            action: (setup) => {
                setup.hints[2].show();
            },
            onLeave: (setup) => {
                setup.hints[2].hide();
            }
        },


        {
            type: 'collision',
            objectA: 'character',
            objectB: 'juanito',
            requireKey: 'F',
            once: false,
            step: 1,
            action: (setup) => {
                if (setup.world.farmLevelController.questManager.step < 8) {
                    setup.world.character.isCaress = true
                    setup.world.isKeysStopp = true
                    setup.world.character.x = 560;
                    setup.world.character.isFlipped = false
                    setup.characters.juanito.updateAnimationState('love')
                    setup.sounds.chickenSound.loop = true
                    setup.sounds.chickenSound.play()
                    setup.world.stableLevelController.eventManager.emitNow('caressStartChicken');
                    setup.world.stableLevelController.questManager.advance(2)
                }
            }
        },

        {
            type: 'collision',
            objectA: 'character',
            objectB: 'juanito',
            once: false,
            step: 1,
            condition: (setup) => setup.world.farmLevelController.questManager.step < 8,
            action: (setup) => {
                setup.hints[0].show();
            },
            onLeave: (setup) => {
                setup.hints[0].hide();
            }
        },

        {
            type: 'time',
            delay: 2500,
            resetOn: 'caressStartChicken',
            step: 2,
            action: (setup) => {
                setup.world.character.isCaress = false
                setup.world.keyboard.F = false
                setup.world.isKeysStopp = false
                setup.characters.juanito.updateAnimationState('idle')
                setup.sounds.chickenSound.loop = false;
                setup.world.stableLevelController.questManager.advance(1)
            }
        },

        {
            type: 'time',
            delay: 2000,
            resetOn: 'caressStartChicken',
            step: 2,
            condition: (setup) => !setup.world.taskWindow.tasks[0].done,
            action: (setup) => {
                setup.world.taskWindow.markDone(0)
                setup.world.farmLevelSetup.sounds.taskCompletedSound.currentTime = 0;
                setup.world.farmLevelSetup.sounds.taskCompletedSound.play();
                setup.popupTexts.push(new PopupText("Aufgabe erledigt!", setup.world.canvas.width / 2, 440));
            }
        },

        {
            type: 'collision',
            objectA: 'character',
            objectB: 'pollito',
            requireKey: 'F',
            once: false,
            step: 1,
            action: (setup) => {
                if (setup.world.farmLevelController.questManager.step < 8) {
                    setup.world.character.isCaress = true
                    setup.world.isKeysStopp = true
                    setup.world.character.x = 720;
                    setup.world.character.isFlipped = false
                    setup.characters.pollito.updateAnimationState('love')
                    setup.sounds.chickSound.loop = true
                    setup.sounds.chickSound.play()
                    setup.world.stableLevelController.eventManager.emitNow('caressStartChick');
                    setup.world.stableLevelController.questManager.advance(3)
                }
            }
        },

        {
            type: 'collision',
            objectA: 'character',
            objectB: 'pollito',
            once: false,
            step: 1,
            condition: (setup) => setup.world.farmLevelController.questManager.step < 8,
            action: (setup) => {
                setup.hints[1].show();
            },
            onLeave: (setup) => {
                setup.hints[1].hide();
            }
        },

        {
            type: 'time',
            delay: 2500,
            resetOn: 'caressStartChick',
            step: 3,
            action: (setup) => {
                setup.world.character.isCaress = false
                setup.world.keyboard.F = false
                setup.world.isKeysStopp = false
                setup.characters.pollito.updateAnimationState('idle')
                setup.sounds.chickSound.loop = false;
                setup.world.stableLevelController.questManager.advance(1)
            }
        },

        {
            type: 'time',
            delay: 2000,
            resetOn: 'caressStartChick',
            step: 3,
            condition: (setup) => !setup.world.taskWindow.tasks[1].done,
            action: (setup) => {
                setup.world.taskWindow.markDone(1)
                setup.world.farmLevelSetup.sounds.taskCompletedSound2.currentTime = 0;
                setup.world.farmLevelSetup.sounds.taskCompletedSound2.play();
                setup.popupTexts.push(new PopupText("Aufgabe erledigt!", setup.world.canvas.width / 2, 440));
            }
        },

        {
            type: 'collision',
            objectA: 'character',
            objectB: 'memoryLight',
            once: false,
            condition: (setup) => setup.world.farmLevelController.questManager.step >= 20,
            action: (setup) => {
                setup.hints[3].show();
            },
            onLeave: (setup) => {
                setup.hints[3].hide();
            }
        },

        {
            type: 'collision',
            objectA: 'character',
            objectB: 'memoryLight',
            requireKey: 'F',
            condition: (setup) => setup.world.farmLevelController.questManager.step >= 20,
            action: (setup) => {
                setup.world.taskWindow.markDone(7)
                setup.world.farmLevelSetup.sounds.taskCompletedSound2.currentTime = 0;
                setup.world.farmLevelSetup.sounds.taskCompletedSound2.play();
                setup.popupTexts.push(new PopupText("Aufgabe erledigt!", setup.world.canvas.width / 2, 440));
                setup.video.play();
                setup.world.character.isMovingLeft = false;
                setup.world.character.isMovingRight = false;
                setup.world.isKeysStopp = true;
            }
        },

        {
            type: 'collision',
            objectA: 'character',
            objectB: 'memoryLight',
            once: false,
            condition: (setup) => setup.world.farmLevelController.questManager.step >= 20,
            action: (setup) => {
                if (setup.video.readyState >= 2 && !setup.video.paused && !setup.video.ended) {
                    setup.world.ctx.save();
                    setup.world.ctx.drawImage(setup.video, 0, 0, setup.world.canvas.width, setup.world.canvas.height);
                    setup.world.ctx.restore();
                } else {
                    setup.world.isKeysStopp = false;
                }
            }
        },

        {
            type: 'input',
            key: 'S',
            condition: (setup) => setup.video.readyState >= 2 && !setup.video.paused && !setup.video.ended,
            action: (setup) => {
                setup.video.pause();
            }
        }

    ];