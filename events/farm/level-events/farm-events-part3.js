import { PopupText } from "../../../classes/ui/popup-text.class.js";

export const farmEvents_part3 = [
    /**
     * Time-based quest event that moves the character to the house entrance
     * and advances the quest once the target position is reached.
     */
    {
        type: 'time',
        delay: 4300,
        step: 11,
        once: false,
        action: (setup) => {
            const char = setup.world.character;
            const arrivedX = char.movementCtrl.moveToX(820, { speed: 5, faceTarget: true });
            if (arrivedX) {
                const arrivedY = char.movementCtrl.moveToY(370, { speed: 1.5 });
                if (arrivedY) {
                    char.yNormal = 370;
                    char.yVoidless = 487;
                    setup.world.isKeysStopp = false;
                    char.isWalk = false;
                    setup.cutsceneIndicator.hide();
                    setup.world.farmLevelController.questManager.advance(12);
                }
            }
        }
    },

    /**
     * Position-based quest event that shows a hint when the character
     * enters the defined area and hides it on leave.
     */
    {
        type: 'position',
        area: { x: 1170, width: 100 },
        objectA: 'character',
        step: 12,
        once: false,
        action: (setup) => {
            setup.hints[4].show();
        },
        onLeave: (setup) => {
            setup.hints[4].hide();
        }
    },

    /**
     * Position-based quest event that closes the house door,
     * completes the task, plays sounds, shows a popup,
     * and advances the quest when the F key is pressed.
     */
    {
        type: 'position',
        objectA: 'character',
        area: { x: 1170, width: 100 },
        step: 12,
        requireKey: 'F',
        action: (setup) => {
            setup.world.character.isMovingLeft = false;
            setup.world.character.isMovingRight = false;
            setup.world.isKeysStopp = true;
            setup.world.character.isFlipped = false;
            setup.hints[4].hide();
            setup.environment.house.updateAnimationState('doorCloses');
            setup.sounds.doorCloseSfx.play();
            setup.world.taskWindow.markDone(6)
            setup.world.audioManager.playOneShot(setup.sounds.taskCompletedSfx);
            setup.state.popupTexts.push(new PopupText("Aufgabe erledigt!", setup.world.canvas.width / 2, 440));
            setup.cutsceneIndicator.show({ skippable: false });
            setup.world.farmLevelController.questManager.advance(13);
        }
    },

    /**
     * Quest event that moves the camera to a target position
     * and advances the quest once the movement is complete.
     */
    {
        type: 'quest',
        step: 13,
        once: false,
        action: (setup) => {
            const camArrived = setup.world.camera.moveToX(900, { speed: 5 });
            if (camArrived) setup.world.farmLevelController.questManager.advance(14)
        }
    },

    /**
     * Time-based quest event that plays a yawning sound after a delay.
     */
    {
        type: 'time',
        delay: 3000,
        step: 14,
        action: (setup) => {
            setup.sounds.yawningSfx.play();
        }
    },

    /**
     * Time-based quest event that plays a snoring sound after a delay.
     */
    {
        type: 'time',
        delay: 10000,
        step: 14,
        action: (setup) => {
            setup.sounds.snoringSfx.play();
        }
    },

    /**
     * Time-based quest event that starts an earthquake effect
     * and plays the corresponding sound after a delay.
     */
    {
        type: 'time',
        delay: 15000,
        step: 14,
        action: (setup) => {
            setup.sounds.earthquakeSfx.play();
            setup.state.earthquakeStart = true;
        }
    },

    /**
     * Time-based event that moves the camera to the drone
     * and advances the quest when the target position is reached.
     */
    {
        type: 'time',
        delay: 22000,
        step: 14,
        once: false,
        action: (setup) => {
            const drone = setup.characters.drone;
            const camArrived = setup.world.camera.moveToX(drone.x - 300, { speed: 10 });
            if (camArrived) setup.world.farmLevelController.questManager.advance(15);
        }
    },

    /**
     * Quest event that moves the drone to a target position,
     * smoothly follows it with the camera, and advances the quest on arrival.
     */
    {
        type: 'quest',
        step: 15,
        once: false,
        action: (setup) => {
            const drone = setup.characters.drone;
            drone.moveToX(1500, {
                onArrive: () => setup.world.farmLevelController.questManager.advance(16)
            });
            setup.world.camera_x += ((drone.x - 300) - setup.world.camera_x) * 0.1;
        }
    },

    /**
     * Quest event that starts the drone idle sound
     * and fades in the farm night music.
     */
    {
        type: 'quest',
        step: 15,
        action: (setup) => {
            setup.sounds.droneIdleSfx.loop = true;
            setup.sounds.droneIdleSfx.play();
            setup.sounds.farmNightMusic.loop = true;
            setup.world.audioManager.fadeInAudio(setup.sounds.farmNightMusic, 2000, 0.6);
        }
    },

    /**
     * Time-based quest event that switches drone audio and
     * starts controlled and trance animations after a delay.
     */
    {
        type: 'time',
        delay: 4000,
        step: 16,
        action: (setup) => {
            setup.sounds.droneIdleSfx.pause();
            setup.sounds.droneControlledSfx.loop = true;
            setup.sounds.droneControlledSfx.play();
            setup.characters.drone.updateAnimationState('controlled', 1000 / 7);
            setup.cutsceneActors.chickenTranced.updateAnimationState('walk', 1000 / 7);
            setup.cutsceneActors.cowTranced.updateAnimationState('walk', 1000 / 5);
            setup.cutsceneActors.chickTranced.updateAnimationState('walk', 1000 / 7);
        }
    },

    /**
     * Time-based quest event that moves trance actors to a target position
     * and advances the quest once the cow reaches it.
     */
    {
        type: 'time',
        delay: 4000,
        step: 16,
        once: false,
        action: (setup) => {
            setup.cutsceneActors.chickenTranced.moveToX(2600, { speed: 1.5 });
            setup.cutsceneActors.chickTranced.moveToX(2600, { speed: 1.5 });
            setup.cutsceneActors.cowTranced.moveToX(2600, {
                speed: 1.5,
                onArrive: () => setup.world.farmLevelController.questManager.advance(17)
            })
        }
    },

    /**
     * Quest event that switches drone audio back
     * and sets the drone to idle animation.
     */
    {
        type: 'quest',
        step: 17,
        action: (setup) => {
            setup.sounds.droneControlledSfx.pause();
            setup.sounds.droneIdleSfx.play();
            setup.characters.drone.updateAnimationState('idle', 1000 / 7);
        }
    },

    /**
     * Quest event that moves the drone to a target position
     * and advances the quest once it arrives.
     */
    {
        type: 'quest',
        step: 17,
        once: false,
        action: (setup) => {
            setup.characters.drone.moveToX(3500, {
                onArrive: () => setup.world.farmLevelController.questManager.advance(18)
            });
        }
    },

    /**
     * Quest event that fades out the drone idle sound,
     * farm night music, and farm night ambience.
     */
    {
        type: 'quest',
        step: 18,
        action: (setup) => {
            setup.world.audioManager.fadeOutAudio(setup.sounds.droneIdleSfx, 4000);
            setup.world.audioManager.fadeOutAudio(setup.sounds.farmNightMusic, 4000);
            setup.world.audioManager.fadeOutAudio(setup.sounds.farmNightAmbience, 4000);
        }
    },

    /**
     * Time-based quest event that ends the night state
     * and starts sad music after a delay.
     */
    {
        type: 'time',
        delay: 3000,
        step: 18,
        action: (setup) => {
            setup.state.isNight = false;
            setup.sounds.sadMusic.play();
        }
    },

    /**
     * Time-based quest event that moves the camera,
     * opens the house door with sound, and advances the quest on arrival.
     */
    {
        type: 'time',
        delay: 7000,
        step: 18,
        once: false,
        action: (setup) => {
            const camArrived = setup.world.camera.moveToX(800, { speed: 3 });
            if (setup.world.camera_x <= 1000) {
                setup.environment.house.updateAnimationState('doorOpens');
                setup.sounds.doorOpenSfx.play();
            }
            if (camArrived) setup.world.farmLevelController.questManager.advance(19);

        }
    },

    /**
     * Time-based quest event that closes the house door
     * and plays the corresponding sound after a delay.
     */
    {
        type: 'time',
        delay: 2000,
        step: 19,
        action: (setup) => {
            setup.environment.house.updateAnimationState('doorCloses');
            setup.sounds.doorCloseSfx.play();
        }
    },

    /**
     * Time-based event that starts the second character dialog
     * after the specified delay.
     */
    {
        type: 'time',
        delay: 4000,
        step: 19,
        action: (setup) => {
            setup.dialogManager.startDialog('character:02', setup.world.timestamp);
        }
    },

    /**
     * Time-based quest event that sets the character
     * to a kneel-and-cry state after a delay.
     */
    {
        type: 'time',
        delay: 16000,
        step: 19,
        action: (setup) => {
            setup.world.character.isKneelAndCry = true;
        }
    },
];