import { PopupText } from "../../../classes/ui/popup-text.class.js";

export const farmEvents_part4 = [
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
     * Time-based event that starts the third character dialog
     * after the specified delay.
     */
    {
        type: 'time',
        delay: 36000,
        step: 19,
        action: (setup) => {
            setup.dialogManager.startDialog('character:03', setup.world.timestamp);
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
        condition: (setup) => !setup.state.prologVideoStarted && !!setup.video,
        action: (setup) => {
            setup.state.prologVideoStarted = true;
            setup.video.play();
            setup.world.character.isLookDeterminedAndStandUp = false;
            setup.cutsceneIndicator.show({ skippable: true });
        }
    },

    /**
     * Quest event that marks the prolog video as finished
     * after playback has ended.
     */
    {
        type: 'quest',
        step: 19,
        condition: (setup) =>
            setup.state.prologVideoStarted &&
            setup.video &&
            setup.video.ended,
        action: (setup) => {
            setup.state.prologVideoFinished = true;
        }
    },

    /**
     * Quest event that restores input, hides the cutscene indicator,
     * adds a new task, shows feedback, and advances the quest
     * after the prolog video has finished.
     */
    {
        type: 'quest',
        step: 19,
        condition: (setup) => setup.state.prologVideoFinished,
        action: (setup) => {
            setup.world.audioManager.fadeOutAudio(setup.sounds.sadMusic, 4000);
            setup.world.isKeysStopp = false;
            setup.cutsceneIndicator.hide();
            setup.world.taskWindow.addTask('8. Besuche nochmal den Stall', { active: true })
            setup.sounds.newTaskSfx.play()
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
            setup.hints[6].show();
        },
        onLeave: (setup) => {
            setup.hints[6].hide();
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
                setup.world.audioManager.fadeInAudio(setup.sounds.determinedMusic, 2000, 0.6);
                setup.world.character.isMovingLeft = false
                setup.world.character.isMovingRight = false
                setup.world.isKeysStopp = true;
                setup.cutsceneIndicator.show({ skippable: false });
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
     * Quest event that updates the character state
     * and switches portraits to their portrait animation.
     */
    {
        type: 'quest',
        step: 22,
        action: (setup) => {
            setup.world.character.isWalkDetermined = false;
            setup.world.character.isStandDetermined = true;
            setup.characters.portraits.pollito.updateAnimationState('portrait', 1000 / 5);
            setup.characters.portraits.juanito.updateAnimationState('portrait', 1000 / 5);
            setup.characters.portraits.cow.updateAnimationState('portrait', 1000 / 5);
        }
    },

    /**
     * Time-based event that starts the fourth character dialog
     * after the specified delay.
     */
    {
        type: 'time',
        delay: 500,
        step: 22,
        action: (setup) => setup.dialogManager.startDialog('character:04', setup.world.timestamp)
    },

    /**
     * Time-based event that activates the Pollito portrait
     * and fades it in after the specified delay.
     */
    {
        type: 'time',
        delay: 500,
        step: 22,
        action: (setup) => {
            const portrait = setup.characters.portraits.pollito;
            setup.state.activePortrait = portrait;
            portrait.fadeIn(setup.world.timestamp, 1500);
        }
    },

    /**
     * Time-based event that fades out the Pollito portrait
     * after the specified delay.
     */
    {
        type: 'time',
        delay: 4000,
        step: 22,
        action: (setup) => {
            const portrait = setup.characters.portraits.pollito;
            portrait.fadeOut(setup.world.timestamp, 1500);
        }
    },

    /**
     * Time-based event that activates the Juanito portrait
     * and fades it in after the specified delay.
     */
    {
        type: 'time',
        delay: 5500,
        step: 22,
        action: (setup) => {
            const portrait = setup.characters.portraits.juanito;
            setup.state.activePortrait = portrait;
            portrait.fadeIn(setup.world.timestamp, 1500);
        }
    },

    /**
     * Time-based event that fades out the Juanito portrait
     * after the specified delay.
     */
    {
        type: 'time',
        delay: 9000,
        step: 22,
        action: (setup) => {
            const portrait = setup.characters.portraits.juanito;
            portrait.fadeOut(setup.world.timestamp, 1500);
        }
    },

    /**
     * Time-based event that activates the cow portrait
     * and fades it in after the specified delay.
     */
    {
        type: 'time',
        delay: 10500,
        step: 22,
        action: (setup) => {
            const portrait = setup.characters.portraits.cow;
            setup.state.activePortrait = portrait;
            portrait.fadeIn(setup.world.timestamp, 1500);
        }
    },

    /**
     * Time-based event that fades out the cow portrait
     * after the specified delay.
     */
    {
        type: 'time',
        delay: 14000,
        step: 22,
        action: (setup) => {
            const portrait = setup.characters.portraits.cow;
            portrait.fadeOut(setup.world.timestamp, 1500);
        }
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
                setup.cutsceneIndicator.hide({ silent: true, immediate: true });
                setup.world.isKeysStopp = false;
                setup.world.currentScene = 'levelComplete';
            }
        }
    }
];