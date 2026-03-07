import { PopupText } from "../classes/ui/popup-text.class.js";

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
            setup.sounds.doorClosingSound.play();
            setup.world.taskWindow.markDone(6)
            setup.world.farmLevelSetup.sounds.taskCompletedSound2.currentTime = 0;
            setup.world.farmLevelSetup.sounds.taskCompletedSound2.play();
            setup.state.popupTexts.push(new PopupText("Aufgabe erledigt!", setup.world.canvas.width / 2, 440));
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
            setup.sounds.yawningSound.play();
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
            setup.sounds.snoringSound.play();
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
            setup.sounds.earthquakeSound.play();
            setup.state.earthquakeStart = true;
        }
    },

    /**
     * Time-based quest event that renders the drone, moves the camera toward it,
     * and advances the quest once the camera reaches the target.
     */
    {
        type: 'time',
        delay: 22000,
        step: 14,
        once: false,
        action: (setup) => {
            const drone = setup.characters.drone;
            setup.world.ctx.save();
            setup.world.ctx.translate(-setup.world.farmLevelController.renderCameraX, 0);
            setup.world.renderer.addToWorld(drone);
            setup.world.ctx.restore();
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
     * Quest event that switches background audio,
     * pauses farm music, and starts drone and night ambience sounds.
     */
    {
        type: 'quest',
        step: 15,
        action: (setup) => {
            setup.sounds.farmMusic.pause();
            setup.sounds.drohneSound.loop = true;
            setup.sounds.drohneSound.play();
            setup.sounds.nightMusic.loop = true;
            setup.sounds.nightMusic.volume = 0.6;
            setup.sounds.nightMusic.play();
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
            setup.sounds.drohneSound.pause();
            setup.sounds.drohneControlledSound.loop = true;
            setup.sounds.drohneControlledSound.play();
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
            setup.cutsceneActors.cowTranced.moveToX(2600, {
                speed: 1.5,
                onArrive: () => setup.world.farmLevelController.questManager.advance(17)
            })
            setup.cutsceneActors.chickTranced.moveToX(2600, { speed: 1.5 });
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
            setup.sounds.drohneControlledSound.pause();
            setup.sounds.drohneSound.play();
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
     * Quest event that gradually lowers drone and ambience audio volumes
     * until the minimum level is reached.
     */
    {
        type: 'quest',
        step: 18,
        once: false,
        action: (setup) => {
            if (setup.state.volumeLevel2 > setup.state.minVolumeLevel) {
                setup.state.volumeLevel2 = Math.max(setup.state.volumeLevel2 - 0.002, setup.state.minVolumeLevel);
                setup.sounds.drohneSound.volume = setup.state.volumeLevel2;
                setup.sounds.nightMusic.volume = setup.state.volumeLevel2;
                setup.sounds.eveningSound.volume = setup.state.volumeLevel2;
            }
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
     * Time-based quest event that pauses drone and ambience sounds after a delay.
     */
    {
        type: 'time',
        delay: 7000,
        step: 18,
        action: (setup) => {
            setup.sounds.eveningSound.pause();
            setup.sounds.drohneSound.pause();
            setup.sounds.nightMusic.pause();
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
                setup.sounds.doorOpeningSound.play();
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
            setup.sounds.doorClosingSound.play();
        }
    },

    /**
     * Time-range event that starts, updates, and renders
     * the third farm speech bubble during the specified interval.
     */
    {
        type: 'time',
        from: 4000,
        to: 9000,
        step: 19,
        once: false,
        action: (setup) => {
            setup.world.ctx.save();
            setup.world.ctx.translate(-setup.world.farmLevelController.renderCameraX, 0);
            if (!setup.speechBubbles.bubbleFarm3.startTime) {
                setup.speechBubbles.bubbleFarm3.start();
            }
            setup.speechBubbles.bubbleFarm3.update(performance.now());
            setup.speechBubbles.bubbleFarm3.draw(setup.world.ctx);
            setup.world.ctx.restore();
        }
    },

    /**
     * Time-range event that starts, updates, and renders
     * the fourth farm speech bubble during the specified interval.
     */
    {
        type: 'time',
        from: 9000,
        to: 14000,
        step: 19,
        once: false,
        action: (setup) => {
            setup.world.ctx.save();
            setup.world.ctx.translate(-setup.world.farmLevelController.renderCameraX, 0);
            if (!setup.speechBubbles.bubbleFarm4.startTime) {
                setup.speechBubbles.bubbleFarm4.start();
            }
            setup.speechBubbles.bubbleFarm4.update(performance.now());
            setup.speechBubbles.bubbleFarm4.draw(setup.world.ctx);
            setup.world.ctx.restore();
        }
    },

    /**
     * Time-range event that starts, updates, and renders
     * the fifth farm speech bubble during the specified interval.
     */
    {
        type: 'time',
        from: 14000,
        to: 30000,
        step: 19,
        once: false,
        action: (setup) => {
            setup.world.ctx.save();
            setup.world.ctx.translate(-setup.world.farmLevelController.renderCameraX, 0);
            if (!setup.speechBubbles.bubbleFarm5.startTime) {
                setup.speechBubbles.bubbleFarm5.start();
            }
            setup.speechBubbles.bubbleFarm5.update(performance.now());
            setup.speechBubbles.bubbleFarm5.draw(setup.world.ctx, 40);
            setup.world.ctx.restore();
        }
    }
];