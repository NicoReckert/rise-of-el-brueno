import { PopupText } from "../classes/popup-text.class.js";
import { farmEvents_part1 } from "./farm-events-part1.js";
import { farmEvents_part2 } from "./farm-events-part2.js";
import { farmEvents_part3 } from "./farm-events-part3.js";
import { farmEvents_part4 } from "./farm-events-part4.js";

const farmEvents2 = [
    ...farmEvents_part1,
    ...farmEvents_part2,
    ...farmEvents_part3,
    ...farmEvents_part4
];

export const farmEvents =
    [
        {
            type: 'quest',
            name: 'initialize',
            once: true,
            action: (setup) => {
                setup.comeFromStable ? setup.world.character.x = 1700 : setup.world.character.x = 1000;
                setup.world.camera_x = setup.world.character.x - 500;
                setup.farmLevel.level_end_x = 6409;
                setup.world.character.level_start_x = 440;
                setup.sounds.farmMusic.play();
                setup.sounds.farmMusic.loop = true;
                setup.comeFromStable = false;
            }
        },

        // {
        //     type: "position",
        //     area: { x: 1620, width: 190 },
        //     objectA: "character",
        //     once: false,
        //     cooldown: 3000,
        //     action: (setup) => {
        //         const anim = setup.environment.stable.currentAnimation;
        //         if (setup.doorState !== 'open' && anim !== 'doorOpens' && anim !== 'idleOpen') {
        //             setup.doorState = 'open';
        //             setup.environment.stable.updateAnimationState("doorOpens");
        //             setup.sounds.doorOpeningSound.play();
        //         }
        //     },
        //     onLeave: (setup) => {
        //         const anim = setup.environment.stable.currentAnimation;
        //         if (setup.doorState !== 'closed' && anim !== 'doorCloses' && anim !== 'idle') {
        //             setup.doorState = 'closed';
        //             setup.environment.stable.updateAnimationState("doorCloses");
        //             setup.sounds.doorClosingSound.play();
        //         }
        //     }

        // },

        {
            type: "quest",
            once: false,
            action: (setup) => {
                const c = setup.world.character;
                const a = setup.environment.stable.currentAnimation;
                if (c.x >= 1620 && c.x <= 1810) {
                    if (!setup.timeOnStable) setup.timeOnStable = performance.now();
                    const elapsed = performance.now() - setup.timeOnStable;
                    if (setup.doorState !== 'open' && a !== 'doorOpens' && a !== 'idleOpen' && elapsed >= 350) {
                        setup.doorState = 'open';
                        setup.environment.stable.updateAnimationState('doorOpens');
                        setup.sounds.doorOpeningSound.play();
                    }
                } else {
                    setup.timeOnStable = null;
                    if (setup.doorState !== 'closed' && a !== 'doorCloses' && a !== 'idle') {
                        setup.doorState = 'closed';
                        setup.environment.stable.updateAnimationState('doorCloses');
                        setup.sounds.doorClosingSound.play();
                    }
                }
            }
        },

        {
            type: 'time',
            delay: 2000,
            step: 1,
            action: (setup) => {
                setup.sounds.newTaskSound.play();
                setup.popupTexts.push(new PopupText("Neue Aufgaben im Log!", setup.world.canvas.width / 2, 400));
            }

        },

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

        {
            type: 'collision',
            objectA: 'character',
            objectB: 'cow',
            step: 1,
            once: false,
            action: (setup) => setup.characters.cow.updateAnimationState('happy', 1000 / 5.5),
            onLeave: (setup) => setup.characters.cow.updateAnimationState('idle', 1000 / 5.5)
        },

        {
            type: 'collision',
            objectA: 'character',
            objectB: 'cow',
            step: 1,
            once: false,
            cooldown: 6000,
            action: (setup) => setup.sounds.cowSound2.play()
        },

        {
            type: 'quest',
            step: 1,
            once: false,
            condition: (setup) => setup.world.taskWindow.tasks[0].done && setup.world.taskWindow.tasks[1].done,
            action: (setup) => setup.world.farmLevelController.questManager.advance(2)
        },

        {
            type: 'quest',
            step: 2,
            action: (setup) => {
                setup.world.taskWindow.addTask('3. Bringe Lola zur Wiese', { active: true })
                setup.sounds.newTaskSound.play()
                setup.popupTexts.push(new PopupText("Neue Aufgabe im Log!", setup.world.canvas.width / 2, 400))
            }
        },

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

        {
            type: 'quest',
            step: 2,
            action: (setup) => setup.hints[1].show()
        },

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

        {
            type: 'quest',
            step: 4,
            action: (setup) => {
                setup.hints[1].hide();
                setup.world.taskWindow.markDone(2);
                setup.popupTexts.push(new PopupText("Aufgabe Erledigt!", setup.world.canvas.width / 2, 400));
                setup.sounds.taskCompletedSound.play();
                setup.characters.cow.isMovingRight = false;
                setup.characters.cow.updateAnimationState('eat', 1000 / 5.5);
            }
        },

        {
            type: 'time',
            delay: 3000,
            step: 4,
            action: (setup) => {
                setup.hints[2].show();
                setup.world.taskWindow.addTask('4. Warte bis Lola fertig ist', { active: true });
                setup.sounds.newTaskSound.play();
                setup.popupTexts.push(new PopupText("Neue Aufgabe im Log!", setup.world.canvas.width / 2, 400));
            }
        },

        {
            type: 'time',
            from: 4000,
            to: 14000,
            step: 4,
            once: false,
            action: (setup) => {
                setup.world.ctx.save();
                setup.world.ctx.translate(-setup.world.farmLevelController.renderCameraX, 0)
                setup.world.addToWorld(setup.environment.clock)
                setup.world.ctx.restore()
            }
        },

        {
            type: 'time',
            delay: 15000,
            step: 4,
            action: (setup) => {
                setup.hints[2].hide();
                setup.world.taskWindow.markDone(3)
                setup.sounds.taskCompletedSound.play()
                setup.popupTexts.push(new PopupText("Aufgabe erledigt!", setup.world.canvas.width / 2, 400))
            }
        },

        {
            type: 'time',
            delay: 18000,
            step: 4,
            action: (setup) => {
                setup.hints[3].show();
                setup.world.taskWindow.addTask('5. Belohne Lola', { active: true })
                setup.sounds.newTaskSound.play()
                setup.popupTexts.push(new PopupText("Neue Aufgabe im Log!", setup.world.canvas.width / 2, 400))
                setup.world.farmLevelController.questManager.advance(5)
            }
        },

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

        {
            type: "time",
            delay: 6000,
            step: 6,
            action: (setup) => {
                setup.hints[3].hide();
                setup.world.taskWindow.markDone(4);
                setup.sounds.taskCompletedSound.play();
                setup.popupTexts.push(new PopupText("Aufgabe erledigt!", setup.world.canvas.width / 2, 400));
            },
        },

        {
            type: "time",
            delay: 9000,
            step: 6,
            action: (setup) => {
                setup.world.farmLevelController.questManager.advance(7)
            },
        },

        {
            type: "quest",
            step: 7,
            action: (setup) => {
                setup.world.taskWindow.addTask('6. Bringe Lola wieder zurück', { active: true });
                setup.sounds.newTaskSound.play();
                setup.popupTexts.push(new PopupText("Neue Aufgabe im Log!", setup.world.canvas.width / 2, 400));
                setup.characters.cow.updateAnimationState('walk');
                setup.characters.cow.isFlipped = false;
            },
        },

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
                    setup.popupTexts.push(new PopupText("Aufgabe erledigt!", setup.world.canvas.width / 2, 400));
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

        {
            type: 'time',
            delay: 2000,
            step: 8,
            action: (setup) => {
                setup.speechBubbles.bubbleFarm1.start(4500)
            }
        },

        {
            type: 'time',
            from: 2000,
            to: 7000,
            once: false,
            step: 8,
            action: (setup) => setup.speechBubbles.bubbleFarm1.render(setup.world.ctx, setup.world.farmLevelController.renderCameraX)
        },

        {
            type: 'time',
            delay: 7000,
            step: 8,
            action: (setup) => setup.speechBubbles.bubbleFarm2.start(4500)

        },

        {
            type: 'time',
            from: 7000,
            to: 12000,
            once: false,
            step: 8,
            action: (setup) => setup.speechBubbles.bubbleFarm2.render(setup.world.ctx, setup.world.farmLevelController.renderCameraX)
        },

        {
            type: 'time',
            delay: 12000,
            step: 8,
            action: (setup) => {
                setup.characters.chicken.updateAnimationState('walk', 1000 / 8);
                setup.characters.chick.updateAnimationState('walk', 1000 / 8);
                setup.characters.chicken.speedX = 3;
                setup.characters.chicken.isMovingLeft = true;
                setup.characters.chick.speedX = 3;
                setup.characters.chick.isMovingLeft = true;
                setup.characters.chicken.isFlipped = true;
                setup.characters.chick.isFlipped = false;
            }
        },

        {
            type: 'time',
            delay: 6000,
            step: 8,
            once: false,
            action: (setup) => {
                if (setup.characters.chicken.x <= 500) setup.characters.chicken.isMovingLeft = false;
                if (setup.characters.chick.x <= 575) setup.characters.chick.isMovingLeft = false;
            }
        },

        {
            type: 'position',
            objectA: 'chick',
            area: { x: 525, width: 50 },
            step: 8,
            action: (setup) => {
                setup.world.farmLevelController.questManager.advance(9)
            }
        },

        {
            type: 'quest',
            step: 9,
            action: (setup) => {
                setup.characters.chicken.updateAnimationState('idle');
                setup.characters.chicken.isFlipped = false;
                setup.characters.chick.updateAnimationState('idle');
                setup.characters.chick.isFlipped = true;
                setup.world.character.isWalk = true;
                setup.world.character.speedX = 5;
            }
        },

        {
            type: 'quest',
            step: 9,
            condition: (setup) => setup.world.character.x >= 788,
            action: (setup) => setup.world.character.isFlipped = true
        },

        {
            type: 'quest',
            step: 9,
            condition: (setup) => setup.world.character.x <= 788,
            action: (setup) => setup.world.character.isFlipped = false
        },

        {
            type: 'quest',
            step: 9,
            once: false,
            action: (setup) => {
                const world = setup.world;
                const char = setup.world.character;
                const camArrived = world.moveCameraToX(108, { speed: 6 });
                const arrivedX = char.moveToX(788, { speed: 5, faceTarget: true });
                if (arrivedX) {
                    const arrivedY = char.moveToY(393, { speed: 1.5 });
                    if (arrivedY && camArrived) {
                        char.isFlipped = true;
                        char.isWalk = false;
                        char.yNormal = 393;
                        char.yVoidless = 510;
                        char.isLightACampfire = true;
                        setup.world.farmLevelController.questManager.advance(10)
                    }
                }
            }
        },

        // {
        //     type: 'quest',
        //     step: 9,
        //     once: false,
        //     action: (setup) => {
        //         if (setup.world.character.x <= 788 && setup.world.character.x >= 738 && setup.world.character.y <= 394 && setup.world.character.y >= 343 && setup.world.camera_x <= 108) {
        //             setup.world.character.isFlipped = true;
        //             setup.world.character.isWalk = false;
        //             setup.world.character.yNormal = 393;
        //             setup.world.character.yVoidless = 510;
        //             setup.world.character.isLightACampfire = true;
        //             setup.world.farmLevelController.questManager.advance(10)
        //         }
        //     }
        // },

        {
            type: 'quest',
            step: 10,
            action: (setup) => setup.sunCycle.start()
        },

        {
            type: 'quest',
            step: 10,
            once: false,
            action: (setup) => {
                if (setup.volumeLevel > setup.minVolumeLevel) {
                    setup.volumeLevel = Math.max(setup.volumeLevel - 0.005, setup.minVolumeLevel);
                    setup.sounds.farmMusic.volume = setup.volumeLevel;
                }
            }
        },

        {
            type: 'time',
            delay: 5000,
            step: 10,
            action: (setup) => setup.moonCycle.start()
        },

        {
            type: 'time',
            delay: 5000,
            step: 10,
            action: (setup) => setup.isNight = true
        },

        {
            type: 'quest',
            once: false,
            action: (setup) => {
                if ([10, 11, 12, 13, 14, 15, 16, 17].includes(setup.world.farmLevelController.questManager.step) && setup.isNight) {
                    if (setup.darknessLevel < setup.maxDarkness) setup.darknessLevel += 0.005;
                } else {
                    if (setup.darknessLevel > 0) setup.darknessLevel -= 0.005;
                }
                setup.world.ctx.fillStyle = `rgba(10,10,40,${setup.darknessLevel})`;
                setup.world.ctx.fillRect(0, 0, setup.world.canvas.width, setup.world.canvas.height);
            }
        },


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
                setup.characters.chick.updateAnimationState('swingToMusic', 1000 / 6.5);
                setup.characters.chicken.updateAnimationState('swingToMusic', 1000 / 6.5);
                setup.environment.moon.updateAnimationState('swingToMusic');
            }
        },

        {
            type: 'time',
            delay: 3000,
            step: 10,
            once: false,
            action: (setup) => {
                setup.lyricsRenderer.render();
            }
        },

        {
            type: 'quest',
            step: 10,
            once: false,
            action: (setup) => {
                if (setup.sounds.happyTogetherMusic.currentTime >= 97.0) {
                    setup.characters.cow.updateAnimationState('sleep', 1000 / 5.5);
                    setup.characters.chick.updateAnimationState('sleep', 1000 / 5.5);
                    setup.characters.chicken.updateAnimationState('sleep', 1000 / 5.5);
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

        {
            type: 'input',
            step: 10,
            key: 'F',
            condition: (setup) => setup.moonCycle.finished,
            action: (setup) => {
                setup.sounds.happyTogetherMusic.currentTime = 97.0;
            }
        },

        {
            type: 'quest',
            step: 11,
            action: (setup) => {
                setup.world.taskWindow.addTask('7. Gehe ins Haus', { active: true })
                setup.sounds.newTaskSound.play()
                setup.popupTexts.push(new PopupText("Neue Aufgabe im Log!", setup.world.canvas.width / 2, 400))
            }
        },

        {
            type: 'time',
            delay: 4000,
            step: 11,
            action: (setup) => {
                setup.world.character.isWalk = true;
                setup.world.character.isFlipped = false

            }
        },
        {
            type: 'time',
            delay: 4300,
            step: 11,
            once: false,
            action: (setup) => {
                const char = setup.world.character;
                const arrivedX = char.moveToX(820, { speed: 5, faceTarget: true });
                if (arrivedX) {
                    const arrivedY = char.moveToY(370, { speed: 1.5 });
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
                setup.popupTexts.push(new PopupText("Aufgabe erledigt!", setup.world.canvas.width / 2, 440));
                setup.world.farmLevelController.questManager.advance(13);
            }
        },

        {
            type: 'quest',
            step: 13,
            once: false,
            action: (setup) => {
                const camArrived = setup.world.moveCameraToX(900, { speed: 5 });
                if (camArrived) setup.world.farmLevelController.questManager.advance(14)
            }
        },

        {
            type: 'time',
            delay: 3000,
            step: 14,
            action: (setup) => {
                setup.sounds.yawningSound.play();
            }
        },
        {
            type: 'time',
            delay: 10000,
            step: 14,
            action: (setup) => {
                setup.sounds.snoringSound.play();
            }
        },

        {
            type: 'time',
            delay: 15000,
            step: 14,
            action: (setup) => {
                setup.sounds.earthquakeSound.play();
                setup.earthquakeStart = true;
            }
        },

        {
            type: 'time',
            delay: 22000,
            step: 14,
            once: false,
            action: (setup) => {
                const drone = setup.characters.drone;
                setup.world.ctx.save();
                setup.world.ctx.translate(-setup.world.farmLevelController.renderCameraX, 0);
                setup.world.addToWorld(drone);
                setup.world.ctx.restore();
                const camArrived = setup.world.moveCameraToX(drone.x - 300, { speed: 10 });
                if (camArrived) setup.world.farmLevelController.questManager.advance(15);
            }
        },

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

        {
            type: 'time',
            delay: 4000,
            step: 16,
            action: (setup) => {
                setup.sounds.drohneSound.pause();
                setup.sounds.drohneHypnoSound.loop = true;
                setup.sounds.drohneHypnoSound.play();
                setup.characters.drone.updateAnimationState('hypno', 1000 / 7);
                setup.cutsceneActors.chickenTranced.updateAnimationState('walk', 1000 / 7);
                setup.cutsceneActors.cowTranced.updateAnimationState('walk', 1000 / 5);
                setup.cutsceneActors.chickTranced.updateAnimationState('walk', 1000 / 7);
            }
        },

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

        {
            type: 'quest',
            step: 17,
            action: (setup) => {
                setup.sounds.drohneHypnoSound.pause();
                setup.sounds.drohneSound.play();
                setup.characters.drone.updateAnimationState('idle', 1000 / 7);
            }
        },

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

        {
            type: 'quest',
            step: 18,
            once: false,
            action: (setup) => {
                if (setup.volumeLevel2 > setup.minVolumeLevel) {
                    setup.volumeLevel2 = Math.max(setup.volumeLevel2 - 0.002, setup.minVolumeLevel);
                    setup.sounds.drohneSound.volume = setup.volumeLevel2;
                    setup.sounds.nightMusic.volume = setup.volumeLevel2;
                    setup.sounds.eveningSound.volume = setup.volumeLevel2;
                }
            }
        },

        {
            type: 'time',
            delay: 3000,
            step: 18,
            action: (setup) => {
                setup.isNight = false;
                setup.sounds.sadMusic.play();
            }
        },
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
        {
            type: 'time',
            delay: 7000,
            step: 18,
            once: false,
            action: (setup) => {
                const camArrived = setup.world.moveCameraToX(800, { speed: 3 });
                if (setup.world.camera_x <= 1000) {
                    setup.environment.house.updateAnimationState('doorOpens');
                    setup.sounds.doorOpeningSound.play();
                }
                if (camArrived) setup.world.farmLevelController.questManager.advance(19);

            }
        },

        {
            type: 'time',
            delay: 2000,
            step: 19,
            action: (setup) => {
                setup.environment.house.updateAnimationState('doorCloses');
                setup.sounds.doorClosingSound.play();
            }

        },

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
        },

        {
            type: 'time',
            delay: 16000,
            step: 19,
            action: (setup) => {
                setup.world.character.isKneelAndCry = true;
            }
        },
        {
            type: 'time',
            delay: 35000,
            step: 19,
            action: (setup) => {
                setup.world.character.isKneelAndCry = false;
                setup.world.character.isStandUpAndLookDetermined = true;
            }
        },

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

        {
            type: 'time',
            delay: 46000,
            step: 19,
            action: (setup) => {
                setup.world.character.isStandUpAndLookDetermined = false;
                setup.world.character.isLookDeterminedAndStandUp = true;
            }
        },

        {
            type: 'time',
            delay: 52000,
            step: 19,
            action: (setup) => {
                setup.video.play();
                setup.world.character.isLookDeterminedAndStandUp = false;
            }
        },

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

        {
            type: 'time',
            delay: 82000,
            step: 19,
            action: (setup) => fadeOutAudio(setup.sounds.sadMusic, 4000)
        },

        {
            type: 'time',
            delay: 84000,
            step: 19,
            action: (setup) => {
                setup.world.isKeysStopp = false;
                setup.world.taskWindow.addTask('8. Besuche nochmal den Stall', { active: true })
                setup.sounds.newTaskSound.play()
                setup.popupTexts.push(new PopupText("Neue Aufgabe im Log!", setup.world.canvas.width / 2, 400))
                setup.world.farmLevelController.questManager.advance(20);
            }
        },

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

        {
            type: 'position',
            area: { x: 3000, width: 200 },
            objectA: 'character',
            step: 20,
            once: false,
            action: (setup) => {
                if (!setup.world.taskWindow.tasks[7].done) {
                    const char = setup.world.character;
                    char.clampX(char, 2800, 3000);
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

        {
            type: 'quest',
            step: 21,
            once: false,
            action: (setup) => {
                const char = setup.world.character;
                const arrivedX = char.moveToX(5100, { speed: 1, faceTarget: true });
                const targetCamX = char.x - 300;
                setup.world.moveCameraToX(targetCamX, { speed: 1, tolerance: 3, snap: false });
                if (arrivedX) setup.world.farmLevelController.questManager.advance(22);
            }
        },

        {
            type: 'quest',
            step: 22,
            action: (setup) => {
                setup.world.character.isWalkDetermined = false;
                setup.world.character.isStandDetermined = true;
                setup.characters.portraits.chick.fadeIn(setup.world.farmLevelController.timestamp, 10000);
                setup.characters.portraits.chick.updateAnimationState('portrait', 1000 / 5);
                setup.characters.portraits.chicken.updateAnimationState('portrait', 1000 / 5);
                setup.characters.portraits.cow.updateAnimationState('portrait', 1000 / 5);
            }
        },

        // {
        //     type: 'time',
        //     delay: 500,
        //     once: false,
        //     step: 22,
        //     cooldown: 4000,
        //     action: (setup) => {
        //         setup.sounds.windSound.play();
        //     }
        // },

        {
            type: 'time',
            delay: 500,
            step: 22,
            action: (setup) => setup.speechBubbles.bubbleFarm9.start(4500)
        },


        {
            type: 'time',
            from: 500,
            to: 5500,
            once: false,
            step: 22,
            action: (setup) => {
                // setup.world.ctx.save();
                // setup.world.ctx.translate(-setup.world.farmLevelController.renderCameraX, 0);
                // setup.world.addToWorld(setup.characters.portraits.chick);
                // setup.world.ctx.restore();



                setup.world.ctx.save();
                setup.world.ctx.translate(-setup.world.farmLevelController.renderCameraX, 0);

                // === 1. Offscreen-Canvas vorbereiten ===
                const portrait = setup.characters.portraits.chick;
                const fadeOpacity = 0.75;

                const offscreen = document.createElement("canvas");
                offscreen.width = portrait.width;
                offscreen.height = portrait.height;
                const offCtx = offscreen.getContext("2d");

                // === 2. Bild in Offscreen-Canvas zeichnen ===
                setup.world.addToWorld({ ...portrait, x: 0, y: 0 }, offCtx);

                // === 3. Radial-Alpha-Maske anwenden ===
                const gradient = offCtx.createRadialGradient(
                    offscreen.width / 2,
                    offscreen.height / 2,
                    0,
                    offscreen.width / 2,
                    offscreen.height / 2,
                    Math.max(offscreen.width, offscreen.height) / 2
                );

                gradient.addColorStop(0.0, `rgba(0, 0, 0, ${fadeOpacity})`);
                gradient.addColorStop(0.85, `rgba(0, 0, 0, ${fadeOpacity})`);
                gradient.addColorStop(1.0, "rgba(0, 0, 0, 0)");

                offCtx.globalCompositeOperation = "destination-in";
                offCtx.fillStyle = gradient;
                offCtx.fillRect(0, 0, offscreen.width, offscreen.height);
                offCtx.globalCompositeOperation = "source-over";

                // === 4. Haupt-Canvas vorbereiten (mit optionalem Glow) ===
                setup.world.ctx.globalAlpha = fadeOpacity;
                setup.world.ctx.shadowColor = "rgba(0, 200, 255, 0.6)"; // Glow
                setup.world.ctx.shadowBlur = 30;

                // === 5. Offscreen auf Main-Canvas zeichnen ===
                setup.world.ctx.drawImage(offscreen, portrait.x, portrait.y);

                // === 6. Zurücksetzen ===
                setup.world.ctx.shadowBlur = 0;
                setup.world.ctx.globalAlpha = 1.0;
                setup.world.ctx.restore();

                setup.speechBubbles.bubbleFarm9.render(setup.world.ctx, setup.world.farmLevelController.renderCameraX, 0);
            }
        },

        {
            type: 'time',
            delay: 5500,
            step: 22,
            action: (setup) => setup.speechBubbles.bubbleFarm10.start(4500)
        },

        {
            type: 'time',
            from: 5500,
            to: 10500,
            once: false,
            step: 22,
            action: (setup) => {
                // setup.world.ctx.save();
                // setup.world.ctx.translate(-setup.world.farmLevelController.renderCameraX, 0);
                // setup.world.addToWorld(setup.characters.portraits.chicken);
                // setup.world.ctx.restore();

                setup.world.ctx.save();
                setup.world.ctx.translate(-setup.world.farmLevelController.renderCameraX, 0);

                // === 1. Offscreen-Canvas vorbereiten ===
                const portrait = setup.characters.portraits.chicken;
                const fadeOpacity = 0.75;

                const offscreen = document.createElement("canvas");
                offscreen.width = portrait.width;
                offscreen.height = portrait.height;
                const offCtx = offscreen.getContext("2d");

                // === 2. Bild in Offscreen-Canvas zeichnen ===
                setup.world.addToWorld({ ...portrait, x: 0, y: 0 }, offCtx);

                // === 3. Radial-Alpha-Maske anwenden ===
                const gradient = offCtx.createRadialGradient(
                    offscreen.width / 2,
                    offscreen.height / 2,
                    0,
                    offscreen.width / 2,
                    offscreen.height / 2,
                    Math.max(offscreen.width, offscreen.height) / 2
                );

                gradient.addColorStop(0.0, `rgba(0, 0, 0, ${fadeOpacity})`);
                gradient.addColorStop(0.85, `rgba(0, 0, 0, ${fadeOpacity})`);
                gradient.addColorStop(1.0, "rgba(0, 0, 0, 0)");

                offCtx.globalCompositeOperation = "destination-in";
                offCtx.fillStyle = gradient;
                offCtx.fillRect(0, 0, offscreen.width, offscreen.height);
                offCtx.globalCompositeOperation = "source-over";

                // === 4. Haupt-Canvas vorbereiten (mit optionalem Glow) ===
                setup.world.ctx.globalAlpha = fadeOpacity;
                setup.world.ctx.shadowColor = "rgba(0, 200, 255, 0.6)"; // Glow
                setup.world.ctx.shadowBlur = 30;

                // === 5. Offscreen auf Main-Canvas zeichnen ===
                setup.world.ctx.drawImage(offscreen, portrait.x, portrait.y);

                // === 6. Zurücksetzen ===
                setup.world.ctx.shadowBlur = 0;
                setup.world.ctx.globalAlpha = 1.0;
                setup.world.ctx.restore();

                setup.speechBubbles.bubbleFarm10.render(setup.world.ctx, setup.world.farmLevelController.renderCameraX, 0);
            }
        },

        {
            type: 'time',
            delay: 10500,
            step: 22,
            action: (setup) => setup.speechBubbles.bubbleFarm11.start(4500)
        },

        {
            type: 'time',
            from: 10500,
            to: 15500,
            once: false,
            step: 22,
            action: (setup) => {
                // setup.world.ctx.save();
                // setup.world.ctx.translate(-setup.world.farmLevelController.renderCameraX, 0);
                // setup.world.addToWorld(setup.characters.portraits.cow);
                // setup.world.ctx.restore();
                setup.world.ctx.save();
                setup.world.ctx.translate(-setup.world.farmLevelController.renderCameraX, 0);

                // === 1. Offscreen-Canvas vorbereiten ===
                const portrait = setup.characters.portraits.cow;
                const fadeOpacity = 0.75;

                const offscreen = document.createElement("canvas");
                offscreen.width = portrait.width;
                offscreen.height = portrait.height;
                const offCtx = offscreen.getContext("2d");

                // === 2. Bild in Offscreen-Canvas zeichnen ===
                setup.world.addToWorld({ ...portrait, x: 0, y: 0 }, offCtx);

                // === 3. Radial-Alpha-Maske anwenden ===
                const gradient = offCtx.createRadialGradient(
                    offscreen.width / 2,
                    offscreen.height / 2,
                    0,
                    offscreen.width / 2,
                    offscreen.height / 2,
                    Math.max(offscreen.width, offscreen.height) / 2
                );

                gradient.addColorStop(0.0, `rgba(0, 0, 0, ${fadeOpacity})`);
                gradient.addColorStop(0.85, `rgba(0, 0, 0, ${fadeOpacity})`);
                gradient.addColorStop(1.0, "rgba(0, 0, 0, 0)");

                offCtx.globalCompositeOperation = "destination-in";
                offCtx.fillStyle = gradient;
                offCtx.fillRect(0, 0, offscreen.width, offscreen.height);
                offCtx.globalCompositeOperation = "source-over";

                // === 4. Haupt-Canvas vorbereiten (mit optionalem Glow) ===
                setup.world.ctx.globalAlpha = fadeOpacity;
                setup.world.ctx.shadowColor = "rgba(0, 200, 255, 0.6)"; // Glow
                setup.world.ctx.shadowBlur = 30;

                // === 5. Offscreen auf Main-Canvas zeichnen ===
                setup.world.ctx.drawImage(offscreen, portrait.x, portrait.y);

                // === 6. Zurücksetzen ===
                setup.world.ctx.shadowBlur = 0;
                setup.world.ctx.globalAlpha = 1.0;
                setup.world.ctx.restore();

                setup.speechBubbles.bubbleFarm11.render(setup.world.ctx, setup.world.farmLevelController.renderCameraX, 0);
            }
        },

        {
            type: 'time',
            delay: 15500,
            step: 22,
            action: (setup) => setup.speechBubbles.bubbleFarm8.start(4500)
        },

        {
            type: 'time',
            from: 15500,
            to: 20500,
            once: false,
            step: 22,
            action: (setup) => setup.speechBubbles.bubbleFarm8.render(setup.world.ctx, setup.world.farmLevelController.renderCameraX, -20)
        },

        {
            type: 'time',
            delay: 21000,
            step: 22,
            action: (setup) => {
                setup.world.character.isWalkDetermined = true;
                setup.world.character.isStandDetermined = false;
            }
        },

        {
            type: 'time',
            delay: 21000,
            once: false,
            step: 22,
            action: (setup) => {
                const char = setup.world.character;
                const arrivedX = char.moveToX(6500, { speed: 1, faceTarget: true });
                if (arrivedX) {
                    setup.world.isKeysStopp = false;
                    setup.world.currentScene = 'levelComplete';
                }
            }
        }
    ];
