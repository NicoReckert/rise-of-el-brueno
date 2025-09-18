const farmEvents =
    [
        {
            type: 'collision',
            objectA: 'character',
            objectB: 'cow',
            step: 1,
            once: false,
            action: (setup) => setup.npcs.cow.updateState('happy', 1000 / 5.5),
            onLeave: (setup) => setup.npcs.cow.updateState('idle', 1000 / 5.5)
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
            condition: (setup) => setup.taskWindow.tasks[0].done && setup.taskWindow.tasks[1].done,
            action: (setup) => setup.world.farmLevelController.questManager.advance(2)
        },

        {
            type: 'quest',
            step: 2,
            action: (setup) => {
                setup.taskWindow.addTask('3. Bringe Lola zur Wiese', { active: true })
                setup.sounds.newTaskSound.play()
                setup.popupTexts.push(new PopupText("Neue Aufgabe im Log!", setup.world.canvas.width / 2, 400))
            }
        },

        {
            type: 'hold',
            objectA: 'character',
            objectB: 'cow',
            step: 2,
            requireKey: "F",
            duration: 2000,
            once: false,
            action: (setup) => {
                setup.npcs.cow.updateState('standUp', 1000 / 5.5)
                setup.npcs.cow.y = 485
                setup.world.farmLevelController.questManager.advance(3)
            }
        },

        {
            type: 'time',
            delay: 600,
            step: 3,
            action: (setup) => {
                setup.npcs.cow.updateState('walk')
                setup.world.keyboard.F = false
            }
        },

        {
            type: 'collision',
            objectA: 'character',
            objectB: 'cow',
            toleranceB: { x: -200, width: -250 },
            step: 3,
            once: false,
            action: (setup) => {
                if (setup.npcs.cow.x <= 5300) {
                    setup.npcs.cow.x += 2
                    setup.npcs.cow.updateState('walk')
                } else setup.world.farmLevelController.questManager.advance(4)
            },
            onLeave: (setup) => setup.npcs.cow.updateState('afraid', 1000 / 5)
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
                setup.taskWindow.markDone(2);
                setup.popupTexts.push(new PopupText("Aufgabe Erledigt!", setup.world.canvas.width / 2, 400));
                setup.sounds.taskCompletedSound.play();
                setup.npcs.cow.updateState('eat', 1000 / 5.5);
            }
        },

        {
            type: 'time',
            delay: 3000,
            step: 4,
            action: (setup) => {
                setup.taskWindow.addTask('4. Warte bis Lola fertig ist', { active: true });
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
                setup.world.addToWorld(setup.npcs.clock)
                setup.world.ctx.restore()
            }
        },

        {
            type: 'time',
            delay: 15000,
            step: 4,
            action: (setup) => {
                setup.taskWindow.markDone(3)
                setup.sounds.taskCompletedSound.play()
                setup.popupTexts.push(new PopupText("Aufgabe erledigt!", setup.world.canvas.width / 2, 400))
            }
        },

        {
            type: 'time',
            delay: 18000,
            step: 4,
            action: (setup) => {
                setup.taskWindow.addTask('5. Belohne Lola', { active: true })
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
                setup.npcs.cow.updateState('love');
                setup.world.character.x = setup.npcs.cow.x + 135;
                if (setup.npcs.cow.isFlipped) setup.world.character.isFlipped = true
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
                if (setup.npcs.cow.currentAnimation === 'love') setup.sounds.cowSound2.play()
            }
        },

        {
            type: "time",
            delay: 5000,
            step: 6,
            action: (setup) => {
                setup.npcs.cow.updateState('eat', 1000 / 5.5);
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
                setup.taskWindow.markDone(4);
                setup.sounds.taskCompletedSound.play();
                setup.popupTexts.push(new PopupText("Aufgabe erledigt!", setup.world.canvas.width / 2, 400));
                setup.world.farmLevelController.questManager.advance(7)
            },
        },

        {
            type: "time",
            delay: 3000,
            step: 7,
            action: (setup) => {
                setup.taskWindow.addTask('6. Bringe Lola wieder zurück', { active: true });
                setup.sounds.newTaskSound.play();
                setup.popupTexts.push(new PopupText("Neue Aufgabe im Log!", setup.world.canvas.width / 2, 400));
                setup.npcs.cow.updateState('walk');
                setup.npcs.cow.isFlipped = false;
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
                if (setup.npcs.cow.x >= 500) {
                    setup.npcs.cow.x -= 2
                    setup.npcs.cow.updateState('walk')
                } else {
                    setup.taskWindow.markDone(5);
                    setup.sounds.taskCompletedSound.play();
                    setup.popupTexts.push(new PopupText("Aufgabe erledigt!", setup.world.canvas.width / 2, 400));
                    setup.world.farmLevelController.questManager.advance(8)
                }
            },
            onLeave: (setup) => setup.npcs.cow.updateState('afraid', 1000 / 5)
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
            type: 'quest',
            step: 8,
            action: (setup) => {
                setup.world.character.isMovingLeft = false;
                setup.world.character.isMovingRight = false;
                // setup.world.isKeysStopp = true;
                setup.world.character.isFlipped = false;
                setup.npcs.cow.isFlipped = true;
                setup.npcs.chicken2.updateState('walk2', 1000 / 8);
                setup.npcs.chick.updateState('walk', 1000 / 8);
                setup.npcs.chicken2.isFlipped = true;
                setup.npcs.chick.isFlipped = true;
            }
        },

        {
            type: 'quest',
            step: 8,
            once: false,
            action: (setup) => {
                setup.world.ctx.save();
                setup.world.ctx.translate(-setup.world.farmLevelController.renderCameraX, 0);
                setup.world.addToWorld(setup.npcs.chicken2);
                setup.world.addToWorld(setup.npcs.chick);
                setup.world.ctx.restore();
                if (setup.npcs.chicken2.x >= 500) setup.npcs.chicken2.x -= 3;
                if (setup.npcs.chick.x >= 575) setup.npcs.chick.x -= 3;
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
                setup.npcs.chicken2.updateState('idle');
                setup.npcs.chicken2.isFlipped = false;
                setup.npcs.chick.updateState('idle');
                setup.npcs.chick.isFlipped = true;
                setup.world.character.isWalk = true;
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
                if (setup.world.camera_x <= 108) setup.world.camera_x += 5;
                if (setup.world.camera_x >= 108) setup.world.camera_x -= 5;
                setup.world.ctx.save();
                setup.world.ctx.translate(-setup.world.farmLevelController.renderCameraX, 0);
                setup.world.addToWorld(setup.npcs.cow);
                setup.world.addToWorld(setup.npcs.chick);
                setup.world.addToWorld(setup.npcs.chicken2);
                setup.world.addToWorld(setup.npcs.campfire);
                setup.world.addToWorld(setup.world.character);
                setup.world.addToWorld(setup.npcs.moon);
                setup.world.ctx.restore();
                if (setup.world.character.x < 788) setup.world.character.x += 5;
                if (setup.world.character.x > 788) setup.world.character.x -= 5;
                if (setup.world.character.y <= 393) setup.world.character.y += 1.5;
            }
        },

        {
            type: 'quest',
            step: 9,
            once: false,
            action: (setup) => {
                if (setup.world.character.x <= 788 && setup.world.character.x >= 738 && setup.world.character.y <= 394 && setup.world.character.y >= 343) {
                    setup.world.character.isFlipped = true;
                    setup.world.character.isWalk = false;
                    setup.world.character.yNormal = 393;
                    setup.world.character.yVoidless = 510;
                    setup.world.character.isLightACampfire = true;
                    setup.world.farmLevelController.cowTaskStep = 12;
                }
            }
        }
    ];