import { PopupText } from "../classes/ui/popup-text.class.js";
import { farmHelper } from "./farm-helper.js";

export const farmEvents_part1 = [
    /**
     * Quest event that initializes the level state,
     * sets character and camera positions, and starts farm music.
     */
    {
        type: 'quest',
        name: 'initialize',
        once: true,
        action: (setup) => {
            setup.state.comeFromStable ? setup.world.character.x = 1700 : setup.world.character.x = 1000;
            setup.world.camera_x = setup.world.character.x - 500;
            setup.world.level_end_x = 6409;
            setup.world.character.level_start_x = 440;
            setup.sounds.farmMusic.loop = true;
            setup.sounds.farmMusic.volume = 0.6;
            setup.sounds.farmMusic.play();
            setup.state.comeFromStable = false;
        }
    },

    /**
     * Quest event that handles the stable door trigger logic.
     */
    {
        type: "quest",
        once: false,
        action: (setup) => {
            farmHelper.handleStableDoorTrigger(setup);
        }
    },

    /**
     * Time-based event that plays the new task sound and
     * displays a popup message after a delay.
     */
    {
        type: 'time',
        delay: 2000,
        step: 1,
        action: (setup) => {
            setup.sounds.newTaskSound.play();
            setup.state.popupTexts.push(new PopupText("Neue Aufgaben im Log!", setup.world.canvas.width / 2, 400));
        }

    },

    /**
     * Position-based event that changes to the stable level,
     * resets related events, and clears the interaction key.
     */
    {
        type: 'position',
        name: 'changeLevel',
        area: { x: 1705, width: 125 },
        objectA: 'character',
        requireKey: 'F',
        action: (setup) => {
            setup.world.currentScene = 'stableLevel';
            setup.world.stableLevelController.eventManager.resetEventByName('initialize');
            setup.world.stableLevelController.eventManager.resetEventByName('changeLevel');
            setup.world.keyboard.F = false;
        }
    },

    /**
     * Position-based event that shows a hint when the character
     * enters the defined area and hides it on leave.
     */
    {
        type: 'position',
        area: { x: 1705, width: 125 },
        objectA: 'character',
        once: false,
        action: (setup) => {
            setup.hints[0].show();
        },
        onLeave: (setup) => {
            setup.hints[0].hide();
        }
    },

    /**
     * Collision-based event that sets the cow animation to "happy"
     * while colliding and resets it to "idle" on leave.
     */
    {
        type: 'collision',
        objectA: 'character',
        objectB: 'cow',
        step: 1,
        once: false,
        action: (setup) => setup.characters.cow.updateAnimationState('happy', 1000 / 5.5),
        onLeave: (setup) => setup.characters.cow.updateAnimationState('idle', 1000 / 5.5)
    },

    /**
     * Collision-based event that plays a cow sound with a cooldown.
     */
    {
        type: 'collision',
        objectA: 'character',
        objectB: 'cow',
        step: 1,
        once: false,
        cooldown: 6000,
        action: (setup) => setup.sounds.cowSound2.play()
    },

    /**
     * Quest event that advances to step 2 when the first two tasks are completed.
     */
    {
        type: 'quest',
        step: 1,
        once: false,
        condition: (setup) => setup.world.taskWindow.tasks[0].done && setup.world.taskWindow.tasks[1].done,
        action: (setup) => setup.world.farmLevelController.questManager.advance(2)
    },

    /**
     * Quest event that adds a new task, plays a sound,
     * and displays a popup message.
     */
    {
        type: 'quest',
        step: 2,
        action: (setup) => {
            setup.world.taskWindow.addTask('3. Bringe Lola zur Wiese', { active: true })
            setup.sounds.newTaskSound.play()
            setup.state.popupTexts.push(new PopupText("Neue Aufgabe im Log!", setup.world.canvas.width / 2, 400))
        }
    },

    /**
     * Collision-based quest event that triggers the cow stand-up animation,
     * hides the hint, starts movement, and advances the quest after a delay.
     */
    {
        type: 'collision',
        objectA: 'character',
        objectB: 'cow',
        step: 2,
        requireKey: "F",
        action: (setup) => {
            setup.characters.cow.updateAnimationState('standUp', 1000 / 5.5)
            setup.hints[1].hide()
            setup.characters.cow.speedX = 2;
            setup.timerManager.addUnique('cow-standup-finished', 600,
                () => {
                    setup.characters.cow.y = 485
                    setup.world.farmLevelController.questManager.advance(3)
                })
        }
    },

    /**
     * Quest event that shows the second hint.
     */
    {
        type: 'quest',
        step: 2,
        action: (setup) => setup.hints[1].show()
    },

    /**
     * Collision-based quest event that guides the cow to a target position,
     * advances the quest upon arrival, and restores hint and animation on leave.
     */
    {
        type: 'collision',
        objectA: 'character',
        objectB: 'cow',
        toleranceB: { x: -200, width: -250 },
        step: 3,
        once: false,
        action: (setup) => {
            setup.hints[1].hide()
            const cow = setup.characters.cow
            const arrivedX = cow.moveToX(5300);
            if (!arrivedX) {
                setup.characters.cow.updateAnimationState('walk')
            } else setup.world.farmLevelController.questManager.advance(4)
        },
        onLeave: (setup) => {
            setup.hints[1].show()
            setup.characters.cow.isMovingRight = false;
            setup.characters.cow.updateAnimationState('afraid', 1000 / 5)
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
        step: 3,
        once: false,
        cooldown: 4000,
        onLeave: (setup) => setup.sounds.cowSound.play()
    },

    /**
     * Quest event that completes the task, shows a completion popup,
     * plays a sound, and sets the cow to the eating animation.
     */
    {
        type: 'quest',
        step: 4,
        action: (setup) => {
            setup.hints[1].hide();
            setup.world.taskWindow.markDone(2);
            setup.state.popupTexts.push(new PopupText("Aufgabe Erledigt!", setup.world.canvas.width / 2, 400));
            setup.sounds.taskCompletedSound.play();
            setup.characters.cow.isMovingRight = false;
            setup.characters.cow.updateAnimationState('eat', 1000 / 5.5);
        }
    },

    /**
     * Time-based quest event that shows a hint, adds a new task,
     * plays a sound, and displays a popup message after a delay.
     */
    {
        type: 'time',
        delay: 3000,
        step: 4,
        action: (setup) => {
            setup.hints[2].show();
            setup.world.taskWindow.addTask('4. Warte bis Lola fertig ist', { active: true });
            setup.sounds.newTaskSound.play();
            setup.state.popupTexts.push(new PopupText("Neue Aufgabe im Log!", setup.world.canvas.width / 2, 400));
        }
    },

    /**
     * Time-range event that renders the clock in the world
     * while the timer is within the specified interval.
     */
    {
        type: 'time',
        from: 4000,
        to: 14000,
        step: 4,
        once: false,
        action: (setup) => {
            setup.world.ctx.save();
            setup.world.ctx.translate(-setup.world.farmLevelController.renderCameraX, 0)
            setup.world.renderer.addToWorld(setup.environment.clock)
            setup.world.ctx.restore()
        }
    },

    /**
     * Time-based quest event that hides the hint, marks the task as done,
     * plays a completion sound, and displays a popup message after a delay.
     */
    {
        type: 'time',
        delay: 15000,
        step: 4,
        action: (setup) => {
            setup.hints[2].hide();
            setup.world.taskWindow.markDone(3)
            setup.sounds.taskCompletedSound.play()
            setup.state.popupTexts.push(new PopupText("Aufgabe erledigt!", setup.world.canvas.width / 2, 400))
        }
    },

    /**
     * Time-based quest event that shows a hint, adds a new task,
     * plays a sound, displays a popup message, and advances the quest.
     */
    {
        type: 'time',
        delay: 18000,
        step: 4,
        action: (setup) => {
            setup.hints[3].show();
            setup.world.taskWindow.addTask('5. Belohne Lola', { active: true })
            setup.sounds.newTaskSound.play()
            setup.state.popupTexts.push(new PopupText("Neue Aufgabe im Log!", setup.world.canvas.width / 2, 400))
            setup.world.farmLevelController.questManager.advance(5)
        }
    },

    /**
     * Collision-based quest event that triggers a caress interaction,
     * updates animations and states, plays a sound, and advances the quest.
     */
    {
        type: 'collision',
        objectA: 'character',
        objectB: 'cow',
        step: 5,
        requireKey: 'F',
        action: (setup) => {
            setup.world.character.isCaress = true
            setup.world.character.isMovingLeft = false
            setup.world.character.isMovingRight = false
            setup.world.isKeysStopp = true;
            setup.characters.cow.updateAnimationState('love');
            setup.world.character.x = setup.characters.cow.x + 135;
            if (setup.characters.cow.isFlipped) setup.world.character.isFlipped = true
            setup.sounds.cowSound2.play();
            setup.world.farmLevelController.questManager.advance(6)
        }
    },

    /**
     * Collision-based quest event that plays a cow sound
     * while the cow is in the "love" animation state.
     */
    {
        type: 'collision',
        objectA: 'character',
        objectB: 'cow',
        step: 6,
        once: false,
        action: (setup) => {
            if (setup.characters.cow.currentAnimation === 'love') setup.sounds.cowSound2.play()
        }
    },

    /**
     * Time-based quest event that restores controls and
     * sets the cow back to the eating animation after a delay.
     */
    {
        type: "time",
        delay: 5000,
        step: 6,
        action: (setup) => {
            setup.characters.cow.updateAnimationState('eat', 1000 / 5.5);
            setup.world.character.isCaress = false;
            setup.world.isKeysStopp = false;
            setup.world.keyboard.F = false;
        },
    },

    /**
     * Time-based quest event that hides the hint, marks the task as done,
     * plays a completion sound, and displays a popup message after a delay.
     */
    {
        type: "time",
        delay: 6000,
        step: 6,
        action: (setup) => {
            setup.hints[3].hide();
            setup.world.taskWindow.markDone(4);
            setup.sounds.taskCompletedSound.play();
            setup.state.popupTexts.push(new PopupText("Aufgabe erledigt!", setup.world.canvas.width / 2, 400));
        },
    },

    /**
     * Time-based quest event that advances the quest after a delay.
     */
    {
        type: "time",
        delay: 9000,
        step: 6,
        action: (setup) => {
            setup.world.farmLevelController.questManager.advance(7)
        },
    },

    /**
     * Quest event that adds a new task, plays a sound,
     * displays a popup message, and sets the cow to walk.
     */
    {
        type: "quest",
        step: 7,
        action: (setup) => {
            setup.world.taskWindow.addTask('6. Bringe Lola wieder zurück', { active: true });
            setup.sounds.newTaskSound.play();
            setup.state.popupTexts.push(new PopupText("Neue Aufgabe im Log!", setup.world.canvas.width / 2, 400));
            setup.characters.cow.updateAnimationState('walk');
            setup.characters.cow.isFlipped = false;
        },
    }
];