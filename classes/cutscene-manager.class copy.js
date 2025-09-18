class CutsceneManager {
    constructor(setup, eventManager) {
        this.setup = setup;
        this.world = setup.world;
        this.eventManager = eventManager;
        this.step = 1;
        this.quests = [];
        this.registerEvents();
    }

    advance(step) {
        this.step = step;
    }

    addQuest(quest) {
        this.quests.push({
            done: false,
            ...quest
        });
    }

    registerEvents() {

        this.eventManager.add({
            type: 'collision',
            objectA: 'character',
            objectB: 'cow',
            step: 1,
            once: false,
            action: (setup) => setup.npcs.cow.updateState('happy', 1000 / 5.5),
            onLeave: (setup) => setup.npcs.cow.updateState('idle', 1000 / 5.5)
        });

        this.eventManager.add({
            type: 'collision',
            objectA: 'character',
            objectB: 'cow',
            step: 1,
            once: false,
            cooldown: 6000,
            action: (setup) => setup.sounds.cowSound2.play()
        });

        this.eventManager.add({
            type: 'quest',
            step: 1,
            once: false,
            condition: (setup) => setup.taskWindow.tasks[0].done && setup.taskWindow.tasks[1].done,
            action: (setup) => this.advance(2)
        });

        this.eventManager.add({
            type: 'quest',
            step: 2,
            action: (setup) => {
                setup.taskWindow.addTask('3. Bringe Lola zur Wiese', { active: true })
                setup.sounds.newTaskSound.play()
                setup.popupTexts.push(new PopupText("Neue Aufgabe im Log!", setup.world.canvas.width / 2, 400))
            }
        });

        this.eventManager.add({
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
                this.advance(3)
            }
        });

        this.eventManager.add({
            type: 'time',
            delay: 600,
            step: 3,
            action: (setup) => {
                setup.npcs.cow.updateState('walk')
                setup.world.keyboard.F = false
            }
        });

        this.eventManager.add({
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
                } else this.advance(4)
            },
            onLeave: (setup) => setup.npcs.cow.updateState('afraid', 1000 / 5)
        });

        this.eventManager.add({
            type: 'collision',
            objectA: 'character',
            objectB: 'cow',
            toleranceB: { x: -200, width: -250 },
            step: 3,
            once: false,
            cooldown: 4000,
            onLeave: (setup) => setup.sounds.cowSound.play()
        });

        this.eventManager.add({
            type: 'quest',
            step: 4,
            action: (setup) => {
                setup.taskWindow.markDone(2);
                setup.popupTexts.push(new PopupText("Aufgabe Erledigt!", setup.world.canvas.width / 2, 400));
                setup.sounds.taskCompletedSound.play();
                setup.npcs.cow.updateState('eat', 1000 / 5.5);
            },
        });

        this.eventManager.add({
            type: 'time',
            delay: 3000,
            step: 4,
            action: (setup) => {
                setup.taskWindow.addTask('4. Warte bis Lola fertig ist', { active: true });
                setup.sounds.newTaskSound.play();
                setup.popupTexts.push(new PopupText("Neue Aufgabe im Log!", setup.world.canvas.width / 2, 400));
            },
        });

        this.eventManager.add({
            type: 'time',
            from: 4000,
            to: 14000,
            step: 4,
            once: false,
            action: (setup) => {
                setup.world.ctx.save();
                setup.world.ctx.translate(-setup.world.farmLevelController.renderCameraX, 0);
                setup.world.addToWorld(setup.npcs.clock);
                setup.world.ctx.restore();
            },
        });

        this.eventManager.add({
            type: 'time',
            delay: 15000,
            step: 4,
            action: (setup) => {
                setup.taskWindow.markDone(3);
                setup.sounds.taskCompletedSound.play();
                setup.popupTexts.push(new PopupText("Aufgabe erledigt!", setup.world.canvas.width / 2, 400));
            },
        });

        this.eventManager.add({
            type: 'time',
            delay: 18000,
            step: 4,
            action: (setup) => {
                setup.taskWindow.addTask('5. Belohne Lola', { active: true });
                setup.sounds.newTaskSound.play();
                setup.popupTexts.push(new PopupText("Neue Aufgabe im Log!", setup.world.canvas.width / 2, 400));
                this.advance(5)
            },
        });

        this.eventManager.add({
            type: 'collision',
            objectA: 'character',
            objectB: 'cow',
            step: 5,
            requireKey: 'F',
            action: (setup) => {
                setup.world.character.isCaress = true;
                setup.world.character.isMovingLeft = false;
                setup.world.character.isMovingRight = false;
                setup.world.isKeysStopp = true;
                setup.npcs.cow.updateState('love');
                setup.world.character.x = setup.npcs.cow.x + 135;
                if (setup.npcs.cow.isFlipped) setup.world.character.isFlipped = true;
                this.setup.sounds.cowSound2.play();
                this.advance(6)
            },
        });

        this.eventManager.add({
            type: 'collision',
            objectA: 'character',
            objectB: 'cow',
            step: 6,
            once: false,
            action: (setup) => {
                if (setup.npcs.cow.currentAnimation === 'love') this.setup.sounds.cowSound2.play();
            },
        });

        this.eventManager.add({
            type: "time",
            delay: 5000,
            step: 6,
            action: (setup) => {
                setup.npcs.cow.updateState('eat', 1000 / 5.5);
                setup.world.character.isCaress = false;
                setup.world.isKeysStopp = false;
                setup.world.keyboard.F = false;
            },
        });

        this.eventManager.add({
            type: "time",
            delay: 6000,
            step: 6,
            action: (setup) => {
                setup.taskWindow.markDone(4);
                setup.sounds.taskCompletedSound.play();
                setup.popupTexts.push(new PopupText("Aufgabe erledigt!", setup.world.canvas.width / 2, 400));
                this.advance(7)
            },
        });

        this.eventManager.add({
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
        });

        this.eventManager.add({
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
                    this.setup.taskWindow.markDone(5);
                    this.setup.sounds.taskCompletedSound.play();
                    this.setup.popupTexts.push(new PopupText("Aufgabe erledigt!", setup.world.canvas.width / 2, 400));
                    this.advance(8)
                }
            },
            onLeave: (setup) => setup.npcs.cow.updateState('afraid', 1000 / 5)
        });

        this.eventManager.add({
            type: 'collision',
            objectA: 'character',
            objectB: 'cow',
            toleranceB: { x: -200, width: -250 },
            step: 7,
            once: false,
            cooldown: 4000,
            onLeave: (setup) => setup.sounds.cowSound.play()
        });

    }

    update() {
        for (const quest of this.quests) {
            if (quest.done) continue;
            if (quest.step !== this.step) continue;

            if (!quest.condition || quest.condition(this.setup)) {
                quest.action(this.setup);
                quest.done = true;
                if (quest.onComplete) quest.onComplete(this.setup);
            }
        }
    }
}