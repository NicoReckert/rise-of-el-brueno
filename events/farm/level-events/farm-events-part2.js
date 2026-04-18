import { PopupText } from "../../../classes/ui/popup-text.class.js";
import { farmHelper } from "../helpers/farm-helper.js";

export const farmEvents_part2 = [
    /**
     * Collision-based event that moves the cow, updates task progress,
     * and advances the quest when the target position is reached.
     */
    {
        type: 'collision',
        objectA: 'character',
        objectB: 'cow',
        toleranceB: { x: -200, width: -250 },
        step: 7,
        once: false,
        action: (setup) => {
            setup.hints[1].hide();
            const cow = setup.characters.cow
            const arrivedX = cow.moveToX(500);
            if (!arrivedX) {
                setup.characters.cow.updateAnimationState('walk')
            } else {
                setup.world.taskWindow.markDone(5);
                setup.sounds.taskCompletedSfx.play();
                setup.state.popupTexts.push(new PopupText("Aufgabe erledigt!", setup.world.canvas.width / 2, 400));
                setup.characters.cow.updateAnimationState('idle');
                setup.world.farmLevelController.questManager.advance(8)
            }
        },
        onLeave: (setup) => {
            setup.hints[1].show();
            setup.characters.cow.updateAnimationState('afraid', 1000 / 5);
            setup.characters.cow.isMovingLeft = false;
        }
    },

    /**
     * Collision-based event that plays a cow sound on leave with a cooldown.
     */
    {
        type: 'collision',
        objectA: 'character',
        objectB: 'cow',
        toleranceB: { x: -200, width: -250 },
        step: 7,
        once: false,
        cooldown: 4000,
        onLeave: (setup) => setup.sounds.cowSfx01.play()
    },

    /**
     * Time-based quest event that stops character movement,
     * locks controls, and adjusts character orientations.
     */
    {
        type: 'time',
        delay: 0,
        step: 8,
        action: (setup) => {
            setup.world.character.isMovingLeft = false;
            setup.world.character.isMovingRight = false;
            setup.world.isKeysStopp = true;
            setup.world.character.isFlipped = false;
            setup.characters.cow.isFlipped = true;
            setup.cutsceneIndicator.show({ skippable: false });
        }
    },

    /**
     * Time-based event that starts the first character dialog
     * after the specified delay.
     */
    {
        type: 'time',
        delay: 2000,
        step: 8,
        action: (setup) => {
            setup.dialogManager.startDialog('character:01', setup.world.timestamp);
        }
    },

    /**
     * Time-based event that updates Juanito and Pollito,
     * sets their movement speed, and adjusts their direction
     * after the specified delay.
     */
    {
        type: 'time',
        delay: 12000,
        step: 8,
        action: (setup) => {
            setup.characters.juanito.updateAnimationState('walk', 1000 / 8);
            setup.characters.pollito.updateAnimationState('walk', 1000 / 8);
            setup.characters.juanito.speedX = 3;
            setup.characters.juanito.isMovingLeft = true;
            setup.characters.pollito.speedX = 3;
            setup.characters.pollito.isMovingLeft = true;
            setup.characters.juanito.isFlipped = true;
            setup.characters.pollito.isFlipped = false;
        }
    },

    /**
     * Time-based event that moves Juanito and Pollito
     * to their target positions and advances the quest
     * when both have arrived.
     */
    {
        type: 'time',
        delay: 12000,
        step: 8,
        once: false,
        action: (setup) => {
            const arrivedXJuanito = setup.characters.juanito.moveToX(500);
            const arrivedXPollito = setup.characters.pollito.moveToX(575);
            setup.world.character.idleStartedAt = 0;
            if (arrivedXJuanito) setup.characters.juanito.isMovingLeft = false;
            if (arrivedXPollito) setup.characters.pollito.isMovingLeft = false;
            if (arrivedXJuanito && arrivedXPollito) setup.world.farmLevelController.questManager.advance(9)
        }
    },

    /**
     * Quest event that sets Juanito and Pollito to idle,
     * adjusts their orientation, and enables character walking.
     */
    {
        type: 'quest',
        step: 9,
        action: (setup) => {
            setup.characters.juanito.updateAnimationState('idle');
            setup.characters.juanito.isFlipped = false;
            setup.characters.pollito.updateAnimationState('idle');
            setup.characters.pollito.isFlipped = true;
            setup.world.character.isWalk = true;
            setup.world.character.speedX = 5;
        }
    },

    /**
     * Quest event that transitions the character
     * to the campfire scene.
     */
    {
        type: 'quest',
        step: 9,
        once: false,
        action: (setup) => {
            farmHelper.moveCharacterToCampfireScene(setup);
        }
    },

    /**
     * Quest event that starts the sun cycle
     * and fades out the farm day music.
     */
    {
        type: 'quest',
        step: 10,
        action: (setup) => {
            setup.sunCycle.start();
            setup.world.audioManager.fadeOutAudio(setup.sounds.farmDayMusic, 2000);
        }
    },

    /**
     * Time-based quest event that starts the moon cycle after a delay.
     */
    {
        type: 'time',
        delay: 5000,
        step: 10,
        action: (setup) => setup.moonCycle.start()
    },

    /**
     * Time-based quest event that sets the world state to night after a delay.
     */
    {
        type: 'time',
        delay: 5000,
        step: 10,
        action: (setup) => setup.state.isNight = true
    },

    /**
     * Quest event that updates the darkness overlay.
     */
    {
        type: 'quest',
        once: false,
        action: (setup) => {
            farmHelper.syncDarknessOverlay(setup);
        }
    },

    /**
     * Time-based quest event that starts the campfire animation,
     * switches background audio, and sets characters and moon to music animations.
     */
    {
        type: 'time',
        delay: 1500,
        step: 10,
        action: (setup) => {
            setup.environment.campfire.updateAnimationState('fireGoesOn');
            setup.sounds.happyTogetherMusic.play();
            setup.sounds.farmNightAmbience.loop = true;
            setup.sounds.farmNightAmbience.play();
            setup.characters.cow.updateAnimationState('swingToMusic', 1000 / 6.5);
            setup.characters.pollito.updateAnimationState('swingToMusic', 1000 / 6.5);
            setup.characters.juanito.updateAnimationState('swingToMusic', 1000 / 6.5);
            setup.environment.moon.updateAnimationState('swingToMusic');
        }
    },

    /**
     * Time-based event that continuously renders the song lyrics after a delay.
     */
    {
        type: 'time',
        delay: 3000,
        step: 10,
        once: false,
        action: (setup) => {
            setup.lyricsRenderer.render();
        }
    },

    /**
     * Quest event that transitions the scene to night rest when the music ends,
     * updates animations, plays a sound, and advances the quest.
     */
    {
        type: 'quest',
        step: 10,
        once: false,
        action: (setup) => {
            if (setup.sounds.happyTogetherMusic.currentTime >= 97.0) {
                setup.characters.cow.updateAnimationState('sleep', 1000 / 5.5);
                setup.characters.pollito.updateAnimationState('sleep', 1000 / 5.5);
                setup.characters.juanito.updateAnimationState('sleep', 1000 / 5.5);
                setup.environment.campfire.updateAnimationState('fireGoesOut');
                setup.environment.moon.updateAnimationState('idle');
                setup.world.character.isPlayGuitar = false;
                setup.world.character.isStandUp = true;
                setup.environment.house.updateAnimationState('doorOpens');
                setup.sounds.doorOpenSfx.play();
                setup.cutsceneIndicator.show({ skippable: false });
                setup.world.farmLevelController.questManager.advance(11);
            }
        }
    },

    /**
     * Quest event that shows the cutscene indicator when the moon cycle is finished.
     */
    {
        type: 'quest',
        step: 10,
        condition: (setup) => setup.moonCycle.finished,
        action: (setup) => {
            setup.cutsceneIndicator.show({ skippable: true });
        }
    },

    /**
     * Input-based quest event that skips to the end of the music
     * when the moon cycle is finished and the F key is pressed.
     */
    {
        type: 'input',
        step: 10,
        key: 'X',
        condition: (setup) => setup.moonCycle.finished,
        action: (setup) => {
            setup.sounds.happyTogetherMusic.currentTime = 97.0;
            setup.cutsceneIndicator.show({ skippable: false });
        }
    },

    /**
     * Quest event that adds a new task, plays a sound,
     * and displays a popup message.
     */
    {
        type: 'quest',
        step: 11,
        action: (setup) => {
            setup.world.taskWindow.addTask('7. Gehe ins Haus', { active: true })
            setup.sounds.newTaskSfx.play()
            setup.state.popupTexts.push(new PopupText("Neue Aufgabe im Log!", setup.world.canvas.width / 2, 400))
        }
    },

    /**
     * Time-based quest event that enables character walking
     * and resets orientation after a delay.
     */
    {
        type: 'time',
        delay: 4000,
        step: 11,
        action: (setup) => {
            setup.world.character.isWalk = true;
            setup.world.character.isFlipped = false

        }
    }
];