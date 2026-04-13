import { PopupText } from "../../../classes/ui/popup-text.class.js";
import { townHelper } from "../helpers/town-helper.js";

export const townEvents_part1 = [
    /**
     * Quest event that initializes the town quest state.
     */
    {
        name: 'init',
        type: 'quest',
        action: (setup) => {
            townHelper.initializeTownQuest(setup);
        }
    },

    /**
     * Position-based event that shows a hint on enter and hides it on leave.
     */
    {
        type: 'position',
        area: { x: 20275, width: 95 },
        objectA: 'character',
        step: 11,
        once: false,
        action: (setup) => {
            setup.hints[0].show();
        },
        onLeave: (setup) => {
            setup.hints[0].hide();
        }
    },

    /**
     * Position event that shows a hint on enter and hides it on leave.
     */
    {
        type: 'position',
        area: { x: 26500, width: 100 },
        objectA: 'character',
        once: false,
        action: (setup) => {
            setup.hints[2].show();
        },
        onLeave: (setup) => {
            setup.hints[2].hide();
        }
    },

    /**
     * Position-based event that stops character movement and starts a dialog.
     */
    {
        type: "position",
        area: { x: 3320, width: 100 },
        action: (setup) => {
            setup.world.character.isMovingLeft = false
            setup.world.character.isMovingRight = false
            setup.world.isKeysStopp = true;
            setup.cutsceneIndicator.show({ skippable: false });
            setup.dialogManager.startDialog('character:01', setup.world.timestamp, () => {
                setup.world.isKeysStopp = false;
                setup.cutsceneIndicator.hide();
            });
        }
    },

    /**
     * Quest event that starts the smoke animation sequence
     * for the destroyed stable environment object.
     */
    {
        type: 'quest',
        action: (setup) => {
            setup.environment.stableDestroyed.animSeqCtrl.start([
                { anim: 'smokeA', fps: 10, pause: 0, audio: { name: "stableSmokeSfx", volume: 1.0 } },
                { anim: "idle", fps: 0, pause: 3000 },
                { anim: 'smokeB', fps: 10, pause: 0 },
                { anim: "idle", fps: 0, pause: 3000 }
            ],
                setup.world.townLevelController.timerManager,
                { loop: true, audioManager: setup.world.audioManager }
            );
        }
    },

    /**
     * Quest event that starts the animation sequence
     * for the destroyed mill environment object.
     */
    {
        type: 'quest',
        action: (setup) => {
            setup.environment.millDestroyed.animSeqCtrl.start([
                { anim: 'forward', fps: 6.5, pause: 0, audio: { name: "windmillCreakSfx", volume: 1.0 } },
                { anim: "idleB", fps: 0, pause: 5000 },
                { anim: 'backward', fps: 6.5, pause: 0, audio: { name: "windmillCreakSfx", volume: 1.0 } },
                { anim: "idle", fps: 0, pause: 5000 },
            ],
                setup.world.townLevelController.timerManager,
                { loop: true, audioManager: setup.world.audioManager }
            );
        }
    },

    /**
     * Position event that fades out the background music
     * and starts the sad moment music when entering the area.
     */
    {
        type: "position",
        area: { x: 1300, width: 100 },
        action: (setup) => {
            setup.world.audioManager.fadeOutAudio(setup.sounds.townDayMusic, 1000);
            setup.sounds.sadMomentMusic.loop = true;
            setup.world.audioManager.fadeInAudio(setup.sounds.sadMomentMusic, 2000, 0.3);
        }
    },

    /**
     * Collision event that enables stable smoke audio while the character
     * is within the destroyed stable area and disables it on leave.
     */
    {
        type: "collision",
        objectA: 'character',
        objectB: 'stableDestroyed',
        toleranceB: { x: -400, width: -400 },
        once: false,
        action: (setup) => {
            setup.environment.stableDestroyed.audioEnabled = true;
        },
        onLeave: (setup) => {
            setup.environment.stableDestroyed.audioEnabled = false;
            setup.world.audioManager.stopAll("stableSmokeSfx");
        }
    },

    /**
     * Collision event that enables mill audio while the character
     * is within the destroyed mill area and disables it on leave.
     */
    {
        type: "collision",
        objectA: 'character',
        objectB: 'millDestroyed',
        toleranceB: { x: -400, width: -400 },
        once: false,
        action: (setup) => {
            setup.environment.millDestroyed.audioEnabled = true;
        },
        onLeave: (setup) => {
            setup.environment.millDestroyed.audioEnabled = false;
            setup.world.audioManager.stopAll("windmillCreakSfx");
        }
    },

    /**
     * Collision event that fades in the house fire sound while the character
     * is near the destroyed house and fades it out on leave.
     */
    {
        type: "collision",
        objectA: 'character',
        objectB: 'houseDestroyed',
        toleranceB: { x: -400, width: -400 },
        once: false,
        action: (setup) => {
            if (!setup.state.isNearDestroyedHouse) {
                setup.state.isNearDestroyedHouse = true;
                setup.sounds.houseFireSfx.currentTime = 0;
                setup.sounds.houseFireSfx.loop = true;
                setup.world.audioManager.fadeInAudio(setup.sounds.houseFireSfx, 2000, 0.3);
            }
        },
        onLeave: (setup) => {
            if (setup.state.isNearDestroyedHouse) {
                setup.state.isNearDestroyedHouse = false;
                setup.world.audioManager.fadeOutAudio(setup.sounds.houseFireSfx, 1000);
            }
        }
    },

    /**
     * Collision event that adjusts character movement
     * while walking on the destroyed house area.
     */
    {
        type: "collision",
        objectA: 'character',
        objectB: 'houseDestroyed',
        toleranceB: { x: 45, width: 30 },
        condition: (setup) => {
            const questManager = setup.world.townLevelController.questManager;
            return questManager.step < 5;
        },
        once: false,
        action: (setup) => {
            setup.world.character.walkOnDestroyedHouse = true;
            setup.world.character.speedX = 2;
        },
        onLeave: (setup) => {
            setup.world.character.walkOnDestroyedHouse = false;
            setup.world.character.speedX = 3;
        }
    },

    /**
     * Position event that switches to Nayeli's house level
     * when the interaction key is pressed within the area.
     */
    {
        name: 'changeLevel',
        type: "position",
        area: { x: 20275, width: 95 },
        requireKey: "F",
        action: (setup) => {
            setup.world.audioManager.fadeOutAudio(setup.sounds.tadeoHoldStoneMusic, 1000);
            setup.world.audioManager.fadeOutAudio(setup.sounds.townDayMusic, 1000);
            setup.world.nayelisHouseLevelController.eventManager.resetEventByName('init');
            setup.world.nayelisHouseLevelController.eventManager.resetEventByName('changeLevel');
            setup.world.keyboard.F = false;
            setup.world.currentScene = 'nayelisHouseLevel';
        }
    },

    /**
     * Time event that notifies the player about new tasks in the log.
     */
    {
        type: 'time',
        delay: 2000,
        step: 1,
        action: (setup) => {
            setup.sounds.newTaskSfx.play();
            setup.state.popupTexts.push(new PopupText("Neue Aufgaben im Log!", setup.world.canvas.width / 2, 400));
        }

    },

    /**
     * Time-based event that plays a character speech bubble after a delay.
     */
    {

        type: 'time',
        delay: 4000,
        step: 1,
        action: (setup) => {
            setup.dialogManager.playBubble(setup.speechBubblesCharacter[4], {
                duration: 4500, now: setup.world.timestamp
            });
        }
    },

    /**
     * Position-based quest event that advances the quest
     * when the character enters the defined area.
     */
    {
        type: "position",
        area: { x: 4000, width: 100 },
        step: 1,
        action: (setup) => {
            setup.world.townLevelController.questManager.advance(2)
        }
    },

    /**
     * Time-based quest event that gradually increases sandstorm intensity
     * and advances the quest when the sequence ends.
     */
    {
        type: "time",
        from: 0,
        to: 4000,
        step: 2,
        once: false,
        action: (setup, elapsed, progress) => {
            const sandstormCtrl = setup.world.townLevelController.sandstormCtrl;
            const intensity = Math.min(1, progress * 0.5);
            sandstormCtrl.setSandstorm(intensity);
        },
        onEnd: (setup) => {
            const ctrl = setup.world.townLevelController;
            const sandstormCtrl = setup.world.townLevelController.sandstormCtrl;
            sandstormCtrl.setSandstorm(0.5);
            ctrl.questManager.advance(3);
        }
    },

    /**
     * Position-based quest event that advances the quest
     * when the character enters the defined area.
     */
    {
        type: "position",
        area: { x: 5000, width: 2000 },
        step: 3,
        action: (setup) => {
            setup.dialogManager.playBubble(setup.speechBubblesCharacter[5], {
                duration: 4500, now: setup.world.timestamp
            });
            setup.world.taskWindow.addTask('2. Überlebe den Sandsturm', { active: true })
            setup.sounds.newTaskSfx.play();
            setup.state.popupTexts.push(new PopupText("Neue Aufgaben im Log!", setup.world.canvas.width / 2, 400));
            setup.world.townLevelController.questManager.advance(4)
        }
    },

    /**
     * Time-based quest event that increases sandstorm intensity
     * and updates character speed when the sequence ends.
     */
    {
        type: "time",
        from: 0,
        to: 4000,
        step: 4,
        once: false,
        action: (setup, elapsed, progress) => {
            const sandstormCtrl = setup.world.townLevelController.sandstormCtrl;
            const intensity = Math.min(1, 0.5 + progress * 0.5);
            sandstormCtrl.setSandstorm(intensity);
        },
        onEnd: (setup) => {
            const ctrl = setup.world.townLevelController;
            const sandstormCtrl = setup.world.townLevelController.sandstormCtrl;
            sandstormCtrl.setSandstorm(1.0);
            ctrl.questManager.advance(5);
        }
    },

    /**
     * Position-based quest event that enables storm hazards,
     * switches background music, and advances the quest.
     */
    {
        type: "position",
        area: { x: 6000, width: 2000 },
        step: 5,
        action: (setup) => {
            setup.world.townLevelController.stormHazards.enabled = true;
            setup.world.audioManager.fadeOutAudio(setup.sounds.sadMomentMusic, 1000);
            setup.sounds.stormHazardMusic.loop = true;
            setup.world.audioManager.fadeInAudio(setup.sounds.stormHazardMusic, 2000, 0.8);
            setup.world.townLevelController.questManager.advance(6)
        }
    },

    /**
     * Position-based quest event that increases storm hazard difficulty
     * and switches to the final storm music.
     */
    {
        type: "position",
        area: { x: 10500, width: 100 },
        step: 6,
        action: (setup) => {
            setup.world.townLevelController.stormHazards.setDifficulty('hard');
            setup.world.audioManager.fadeOutAudio(setup.sounds.stormHazardMusic, 1000);
            setup.sounds.finalStormHazardMusic.loop = true;
            setup.world.audioManager.fadeInAudio(setup.sounds.finalStormHazardMusic, 1000, 0.8);
        }
    },

    /**
     * Position event that disables storm hazards.
     */
    {
        type: "position",
        area: { x: 12800, width: 100 },
        step: 6,
        action: (setup) => {
            setup.world.townLevelController.stormHazards.enabled = false;
        }
    },

    /**
     * Position event that slows the character, enables storm walking,
     * starts a dialog, fades out one audio track, and fades in another.
     */
    {
        type: "position",
        area: { x: 13000, width: 100 },
        step: 6,
        action: (setup) => {
            setup.world.character.speedX = 1.5;
            setup.world.character.isWalkInStorm = true;
            setup.dialogManager.startDialog('character:02', setup.world.timestamp);
            setup.world.audioManager.fadeOutAudio(setup.sounds.finalStormHazardMusic, 1000);
            setup.world.audioManager.fadeInAudio(setup.sounds.airHitStunMusic, 2000, 0.8);
        }
    },
];