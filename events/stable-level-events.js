import { PopupText } from "../classes/ui/popup-text.class.js";

export const stableEvents =
    [
        /**
         * Quest event that initializes the level by setting camera,
         * character position, and level boundaries.
         */
        {
            type: 'quest',
            name: 'initialize',
            action: (setup) => {
                setup.world.camera_x = 0;
                setup.world.character.x = 380;
                setup.world.level_end_x = 720;
                setup.world.character.level_start_x = 360;
            }
        },

        /**
         * Position-based event that changes back to the farm level,
         * resets related events, and updates the return state.
         */
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
                setup.world.farmLevelSetup.state.comeFromStable = true;
            }
        },

        /**
         * Position-based quest event that shows a hint when the character
         * enters the defined area and hides it on leave.
         */
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

        /**
         * Collision-based quest event that triggers a caress interaction with Juanito,
         * plays audio, emits a stable event, and advances the quest.
         */
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
                    setup.sounds.chickenSfx.loop = true
                    setup.sounds.chickenSfx.play()
                    setup.world.stableLevelController.eventManager.emitNow('caressStartChicken');
                    setup.world.stableLevelController.questManager.advance(2)
                }
            }
        },

        /**
         * Collision-based quest event that shows a hint near Juanito
         * while the quest step is below 8 and hides it on leave.
         */
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

        /**
         * Time-based quest event that ends the caress interaction,
         * restores controls and audio, and resets the quest step.
         */
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
                setup.sounds.chickenSfx.loop = false;
                setup.world.stableLevelController.questManager.advance(1)
            }
        },

        /**
         * Time-based quest event that completes the first task,
         * plays a completion sound, and shows a popup after the caress trigger.
         */
        {
            type: 'time',
            delay: 2000,
            resetOn: 'caressStartChicken',
            step: 2,
            condition: (setup) => !setup.world.taskWindow.tasks[0].done,
            action: (setup) => {
                setup.world.taskWindow.markDone(0)
                setup.world.farmLevelSetup.sounds.taskCompletedSfx01.currentTime = 0;
                setup.world.farmLevelSetup.sounds.taskCompletedSfx01.play();
                setup.popupTexts.push(new PopupText("Aufgabe erledigt!", setup.world.canvas.width / 2, 440));
            }
        },

        /**
         * Collision-based quest event that triggers a caress interaction with Pollito,
         * plays audio, emits a stable event, and advances the quest.
         */
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
                    setup.sounds.chickSfx.loop = true
                    setup.sounds.chickSfx.play()
                    setup.world.stableLevelController.eventManager.emitNow('caressStartChick');
                    setup.world.stableLevelController.questManager.advance(3)
                }
            }
        },

        /**
         * Collision-based quest event that shows a hint near Pollito
         * while the quest step is below 8 and hides it on leave.
         */
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

        /**
         * Time-based quest event that ends the caress interaction with Pollito,
         * restores controls and audio, and resets the quest step.
         */
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
                setup.sounds.chickSfx.loop = false;
                setup.world.stableLevelController.questManager.advance(1)
            }
        },

        /**
         * Time-based quest event that completes the second task,
         * plays a completion sound, and shows a popup after the caress trigger.
         */
        {
            type: 'time',
            delay: 2000,
            resetOn: 'caressStartChick',
            step: 3,
            condition: (setup) => !setup.world.taskWindow.tasks[1].done,
            action: (setup) => {
                setup.world.taskWindow.markDone(1)
                setup.world.farmLevelSetup.sounds.taskCompletedSfx02.currentTime = 0;
                setup.world.farmLevelSetup.sounds.taskCompletedSfx02.play();
                setup.popupTexts.push(new PopupText("Aufgabe erledigt!", setup.world.canvas.width / 2, 440));
            }
        },

        /**
         * Collision-based event that shows a hint near the memory light
         * once the quest step reaches 20 and hides it on leave.
         */
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

        /**
         * Collision-based event that completes the final task,
         * plays audio, shows a popup, starts the video,
         * and locks character controls when interacting with the memory light.
         */
        {
            type: 'collision',
            objectA: 'character',
            objectB: 'memoryLight',
            requireKey: 'F',
            condition: (setup) => setup.world.farmLevelController.questManager.step >= 20,
            action: (setup) => {
                setup.world.taskWindow.markDone(7)
                setup.world.farmLevelSetup.sounds.taskCompletedSfx02.currentTime = 0;
                setup.world.farmLevelSetup.sounds.taskCompletedSfx02.play();
                setup.popupTexts.push(new PopupText("Aufgabe erledigt!", setup.world.canvas.width / 2, 440));
                setup.video.play();
                setup.world.character.isMovingLeft = false;
                setup.world.character.isMovingRight = false;
                setup.world.isKeysStopp = true;
            }
        },

        /**
         * Collision-based event that renders the memory video while playing
         * and restores controls once playback ends.
         */
        {
            type: 'collision',
            objectA: 'character',
            objectB: 'memoryLight',
            once: false,
            condition: (setup) => setup.video && setup.world.farmLevelController.questManager.step >= 20,
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

        /**
         * Input-based event that pauses the video when the S key is pressed
         * during active playback.
         */
        {
            type: 'input',
            key: 'S',
            condition: (setup) => setup.video && setup.video.readyState >= 2 && !setup.video.paused && !setup.video.ended,
            action: (setup) => {
                setup.video.pause();
            }
        }
    ];