import { PopupText } from "../classes/ui/popup-text.class.js";
import { farmHelper } from "./farm-helper.js";

export const farmEvents_part2 = [
    /**
     * Collision-based quest event that guides the cow back,
     * completes the task upon arrival, and restores hint and animation on leave.
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
            if (setup.characters.cow.x >= 500) {
                setup.characters.cow.isMovingLeft = true;
                setup.characters.cow.updateAnimationState('walk');
            } else {
                setup.characters.cow.isMovingLeft = false;
                setup.world.taskWindow.markDone(5);
                setup.sounds.taskCompletedSound.play();
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
        onLeave: (setup) => setup.sounds.cowSound.play()
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
        }
    },

    /**
     * Time-based quest event that starts the first farm speech bubble after a delay.
     */
    {
        type: 'time',
        delay: 2000,
        step: 8,
        action: (setup) => {
            setup.speechBubbles[0].start(4500)
        }
    },

    /**
     * Time-range event that renders the first farm speech bubble
     * during the specified interval.
     */
    {
        type: 'time',
        from: 2000,
        to: 7000,
        once: false,
        step: 8,
        action: (setup) => setup.speechBubbles[0].render(setup.world.ctx, setup.world.farmLevelController.renderCameraX)
    },

    /**
     * Time-based quest event that starts the second farm speech bubble after a delay.
     */
    {
        type: 'time',
        delay: 7000,
        step: 8,
        action: (setup) => setup.speechBubbles[1].start(4500)
    },

    /**
     * Time-range event that renders the second farm speech bubble
     * during the specified interval.
     */
    {
        type: 'time',
        from: 7000,
        to: 12000,
        once: false,
        step: 8,
        action: (setup) => setup.speechBubbles[1].render(setup.world.ctx, setup.world.farmLevelController.renderCameraX)
    },

    /**
     * Time-based quest event that starts movement animations and
     * moves Juanito and Pollito in opposite directions after a delay.
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
     * Time-based event that stops Juanito and Pollito
     * once they reach their target positions.
     */
    {
        type: 'time',
        delay: 6000,
        step: 8,
        once: false,
        action: (setup) => {
            if (setup.characters.juanito.x <= 500) setup.characters.juanito.isMovingLeft = false;
            if (setup.characters.pollito.x <= 575) setup.characters.pollito.isMovingLeft = false;
        }
    },

    /**
     * Position-based quest event that advances the quest
     * when Pollito reaches the defined area.
     */
    {
        type: 'position',
        objectA: 'pollito',
        area: { x: 525, width: 50 },
        step: 8,
        action: (setup) => {
            setup.world.farmLevelController.questManager.advance(9)
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
     * Quest event that flips the character
     * once the defined position is reached.
     */
    {
        type: 'quest',
        step: 9,
        condition: (setup) => setup.world.character.x >= 788,
        action: (setup) => setup.world.character.isFlipped = true
    },

    /**
     * Quest event that resets the character orientation
     * when returning past the defined position.
     */
    {
        type: 'quest',
        step: 9,
        condition: (setup) => setup.world.character.x <= 788,
        action: (setup) => setup.world.character.isFlipped = false
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
     * Quest event that starts the sun cycle.
     */
    {
        type: 'quest',
        step: 10,
        action: (setup) => setup.sunCycle.start()
    },

    /**
     * Quest event that gradually lowers the farm music volume
     * until the minimum level is reached.
     */
    {
        type: 'quest',
        step: 10,
        once: false,
        action: (setup) => {
            if (setup.state.volumeLevel > setup.state.minVolumeLevel) {
                setup.state.volumeLevel = Math.max(setup.state.volumeLevel - 0.005, setup.state.minVolumeLevel);
                setup.sounds.farmMusic.volume = setup.state.volumeLevel;
            }
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
     * Quest event that dynamically adjusts and renders a darkness overlay
     * based on the current quest step and night state.
     */
    {
        type: 'quest',
        once: false,
        action: (setup) => {
            if ([10, 11, 12, 13, 14, 15, 16, 17].includes(setup.world.farmLevelController.questManager.step) && setup.state.isNight) {
                if (setup.state.darknessLevel < setup.state.maxDarkness) setup.state.darknessLevel += 0.005;
            } else {
                if (setup.state.darknessLevel > 0) setup.state.darknessLevel -= 0.005;
            }
            setup.world.ctx.fillStyle = `rgba(10,10,40,${setup.state.darknessLevel})`;
            setup.world.ctx.fillRect(0, 0, setup.world.canvas.width, setup.world.canvas.height);
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
            setup.sounds.farmMusic.loop = false;
            setup.sounds.eveningSound.loop = true;
            setup.sounds.eveningSound.play();
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
                setup.sounds.doorOpeningSound.play();
                setup.world.farmLevelController.questManager.advance(11);
            }
        }
    },

    /**
     * Input-based quest event that skips to the end of the music
     * when the moon cycle is finished and the F key is pressed.
     */
    {
        type: 'input',
        step: 10,
        key: 'F',
        condition: (setup) => setup.moonCycle.finished,
        action: (setup) => {
            setup.sounds.happyTogetherMusic.currentTime = 97.0;
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
            setup.sounds.newTaskSound.play()
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