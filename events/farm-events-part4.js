import { PopupText } from "../classes/ui/popup-text.class.js";
import { AudioManager } from "../core/audio-manager.class.js";
import { farmHelper } from "./farm-helper.js";

const audioManager = new AudioManager();
const fadeOutAudio = audioManager.fadeOutAudio.bind(audioManager);

export const farmEvents_part4 = [
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

    /**
    * Time-based quest event that ends the kneel-and-cry state
    * and sets the character to a determined stance after a delay.
    */
    {
        type: 'time',
        delay: 35000,
        step: 19,
        action: (setup) => {
            setup.world.character.isKneelAndCry = false;
            setup.world.character.isStandUpAndLookDetermined = true;
        }
    },

    /**
    * Time-range event that starts, updates, and renders
    * the sixth farm speech bubble during the specified interval.
    */
    {
        type: 'time',
        from: 36000,
        to: 41000,
        step: 19,
        once: false,
        action: (setup) => {
            setup.world.ctx.save();
            setup.world.ctx.translate(-setup.world.farmLevelController.renderCameraX, 0);
            if (!setup.speechBubbles.bubbleFarm6.startTime) {
                setup.speechBubbles.bubbleFarm6.start();
            }
            setup.speechBubbles.bubbleFarm6.update(performance.now());
            setup.speechBubbles.bubbleFarm6.draw(setup.world.ctx, 0);
            setup.world.ctx.restore();
        }
    },

    /**
    * Time-range event that starts, updates, and renders
    * the seventh farm speech bubble during the specified interval.
    */
    {
        type: 'time',
        from: 41000,
        to: 46000,
        step: 19,
        once: false,
        action: (setup) => {
            setup.world.ctx.save();
            setup.world.ctx.translate(-setup.world.farmLevelController.renderCameraX, 0);
            if (!setup.speechBubbles.bubbleFarm7.startTime) {
                setup.speechBubbles.bubbleFarm7.start();
            }
            setup.speechBubbles.bubbleFarm7.update(performance.now());
            setup.speechBubbles.bubbleFarm7.draw(setup.world.ctx, 0);
            setup.world.ctx.restore();
        }
    },

    /**
    * Time-range event that starts and renders
    * the eighth farm speech bubble during the specified interval.
    */
    {
        type: 'time',
        from: 46000,
        to: 51000,
        step: 19,
        once: false,
        action: (setup) => {
            setup.speechBubbles.bubbleFarm8.start(5000)
            setup.speechBubbles.bubbleFarm8.render(setup.world.ctx, setup.world.farmLevelController.renderCameraX, 0);
            // setup.world.ctx.save();
            // setup.world.ctx.translate(-setup.world.farmLevelController.renderCameraX, 0);
            // if (!setup.speechBubbles.bubbleFarm8.startTime) {
            //     setup.speechBubbles.bubbleFarm8.start();
            // }
            // setup.speechBubbles.bubbleFarm8.update(performance.now());
            // setup.speechBubbles.bubbleFarm8.draw(setup.world.ctx, 0);
            // setup.world.ctx.restore();
        }
    },

    /**
    * Time-based quest event that switches the character
    * to a determined standing transition after a delay.
    */
    {
        type: 'time',
        delay: 46000,
        step: 19,
        action: (setup) => {
            setup.world.character.isStandUpAndLookDetermined = false;
            setup.world.character.isLookDeterminedAndStandUp = true;
        }
    },

    /**
    * Time-based quest event that starts the video playback
    * and ends the determined stand-up state after a delay.
    */
    {
        type: 'time',
        delay: 52000,
        step: 19,
        action: (setup) => {
            setup.video.play();
            setup.world.character.isLookDeterminedAndStandUp = false;
        }
    },

    /**
    * Time-range event that renders the video frame
    * onto the canvas while playback is active.
    */
    {
        type: 'time',
        from: 52000,
        to: 82000,
        step: 19,
        once: false,
        action: (setup) => {
            if (setup.video.readyState >= 2 && !setup.video.paused && !setup.video.ended) {
                setup.world.ctx.save();
                setup.world.ctx.drawImage(setup.video, 0, 0, setup.world.canvas.width, setup.world.canvas.height);
                setup.world.ctx.restore();
            }
        },
    },

    /**
    * Time-based quest event that fades out the sad music after a delay.
    */
    {
        type: 'time',
        delay: 82000,
        step: 19,
        action: (setup) => fadeOutAudio(setup.sounds.sadMusic, 4000)
    },

    /**
    * Time-based quest event that restores controls, adds a new task,
    * plays a sound, shows a popup, and advances the quest after a delay.
    */
    {
        type: 'time',
        delay: 84000,
        step: 19,
        action: (setup) => {
            setup.world.isKeysStopp = false;
            setup.world.taskWindow.addTask('8. Besuche nochmal den Stall', { active: true })
            setup.sounds.newTaskSound.play()
            setup.state.popupTexts.push(new PopupText("Neue Aufgabe im Log!", setup.world.canvas.width / 2, 400))
            setup.world.farmLevelController.questManager.advance(20);
        }
    },

    /**
    * Position-based quest event that shows a hint within the defined area
    * while the final task is not yet completed and hides it on leave.
    */
    {
        type: 'position',
        area: { x: 3000, width: 200 },
        objectA: 'character',
        step: 20,
        condition: (setup) => !setup.world.taskWindow.tasks[7].done,
        once: false,
        action: (setup) => {
            setup.hints[5].show();
        },
        onLeave: (setup) => {
            setup.hints[5].hide();
        }
    },

    /**
    * Position-based quest event that restricts character movement
    * until the task is completed, then triggers a determined state,
    * plays music, locks controls, and advances the quest.
    */
    {
        type: 'position',
        area: { x: 3000, width: 200 },
        objectA: 'character',
        step: 20,
        once: false,
        action: (setup) => {
            if (!setup.world.taskWindow.tasks[7].done) {
                const char = setup.world.character;
                char.movementCtrl.clampX(char, 2800, 3000);
            } else {
                setup.world.character.isWalkDetermined = true;
                setup.sounds.determinedMusic.play();
                setup.world.character.isMovingLeft = false
                setup.world.character.isMovingRight = false
                setup.world.isKeysStopp = true;
                setup.world.farmLevelController.questManager.advance(21);
            }
        }
    },

    /**
    * Quest event that moves the character toward the stable,
    * follows with the camera, and advances the quest on arrival.
    */
    {
        type: 'quest',
        step: 21,
        once: false,
        action: (setup) => {
            const char = setup.world.character;
            const arrivedX = char.movementCtrl.moveToX(5100, { speed: 1, faceTarget: true });
            const targetCamX = char.x - 300;
            setup.world.camera.moveToX(targetCamX, { speed: 1, tolerance: 3, snap: false });
            if (arrivedX) setup.world.farmLevelController.questManager.advance(22);
        }
    },

    /**
    * Quest event that switches the character to a determined stance
    * and activates portrait animations with a fade-in effect.
    */
    {
        type: 'quest',
        step: 22,
        action: (setup) => {
            setup.world.character.isWalkDetermined = false;
            setup.world.character.isStandDetermined = true;
            setup.characters.portraits.pollito.fadeIn(setup.world.farmLevelController.timestamp, 10000);
            setup.characters.portraits.pollito.updateAnimationState('portrait', 1000 / 5);
            setup.characters.portraits.juanito.updateAnimationState('portrait', 1000 / 5);
            setup.characters.portraits.cow.updateAnimationState('portrait', 1000 / 5);
        }
    },

    /**
    * Time-based quest event that starts the ninth farm speech bubble after a short delay.
    */
    {
        type: 'time',
        delay: 500,
        step: 22,
        action: (setup) => setup.speechBubbles.bubbleFarm9.start(4500)
    },

    /**
    * Time-range event that renders the pollito portrait with radial fade
    * and displays the ninth farm speech bubble during the specified interval.
    */
    {
        type: 'time',
        from: 500,
        to: 5500,
        once: false,
        step: 22,
        action: (setup) => {
            farmHelper.renderPortraitWithRadialFade(setup, setup.characters.portraits.pollito)
            setup.speechBubbles.bubbleFarm9.render(setup.world.ctx, setup.world.farmLevelController.renderCameraX, 0);
        }
    },

    /**
    * Time-based quest event that starts the tenth farm speech bubble after a delay.
    */
    {
        type: 'time',
        delay: 5500,
        step: 22,
        action: (setup) => setup.speechBubbles.bubbleFarm10.start(4500)
    },

    /**
    * Time-range event that renders the Juanito portrait with radial fade
    * and displays the tenth farm speech bubble during the specified interval.
    */
    {
        type: 'time',
        from: 5500,
        to: 10500,
        once: false,
        step: 22,
        action: (setup) => {
            farmHelper.renderPortraitWithRadialFade(setup, setup.characters.portraits.juanito);
            setup.speechBubbles.bubbleFarm10.render(setup.world.ctx, setup.world.farmLevelController.renderCameraX, 0);
        }
    },

    /**
    * Time-based quest event that starts the eleventh farm speech bubble after a delay.
    */
    {
        type: 'time',
        delay: 10500,
        step: 22,
        action: (setup) => setup.speechBubbles.bubbleFarm11.start(4500)
    },

    /**
    * Time-range event that renders the cow portrait with radial fade
    * and displays the eleventh farm speech bubble during the specified interval.
    */
    {
        type: 'time',
        from: 10500,
        to: 15500,
        once: false,
        step: 22,
        action: (setup) => {
            farmHelper.renderPortraitWithRadialFade(setup, setup.characters.portraits.cow);
            setup.speechBubbles.bubbleFarm11.render(setup.world.ctx, setup.world.farmLevelController.renderCameraX, 0);
        }
    },

    /**
    * Time-based quest event that restarts the eighth farm speech bubble after a delay.
    */
    {
        type: 'time',
        delay: 15500,
        step: 22,
        action: (setup) => setup.speechBubbles.bubbleFarm8.start(4500)
    },

    /**
    * Time-range event that renders the eighth farm speech bubble
    * during the specified interval.
    */
    {
        type: 'time',
        from: 15500,
        to: 20500,
        once: false,
        step: 22,
        action: (setup) => setup.speechBubbles.bubbleFarm8.render(setup.world.ctx, setup.world.farmLevelController.renderCameraX, -20)
    },

    /**
    * Time-based quest event that switches the character
    * from a determined stance back to determined walking after a delay.
    */
    {
        type: 'time',
        delay: 21000,
        step: 22,
        action: (setup) => {
            setup.world.character.isWalkDetermined = true;
            setup.world.character.isStandDetermined = false;
        }
    },

    /**
    * Time-based quest event that moves the character to the final position
    * and transitions to the level-complete scene on arrival.
    */
    {
        type: 'time',
        delay: 21000,
        once: false,
        step: 22,
        action: (setup) => {
            const char = setup.world.character;
            const arrivedX = char.movementCtrl.moveToX(6500, { speed: 1, faceTarget: true });
            if (arrivedX) {
                setup.world.isKeysStopp = false;
                setup.world.currentScene = 'levelComplete';
            }
        }
    }
];