class StableQuestManager {
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
            type: 'position',
            area: { x: 360, width: 100 },
            objectA: 'character',
            requireKey: 'F',
            once: false,
            action: (setup) => {
                setup.world.currentScene = 'farmLevel';
                setup.world.character.x = 1700;
                setup.world.camera_x = setup.world.character.x - 500;
                setup.world.keyboard.F = false;
                setup.world.farmLevelSetup.farmLevel.level_end_x = 6409;
                setup.world.character.level_start_x = 440;
            }
        });

        this.eventManager.add({
            type: 'collision',
            objectA: 'character',
            objectB: 'chicken',
            requireKey: 'F',
            once: false,
            step: 1,
            action: (setup) => {
                setup.world.character.isCaress = true
                setup.world.isKeysStopp = true
                setup.world.character.x = 560;
                setup.world.character.isFlipped = false
                setup.npcs.chicken.updateState('love')
                setup.sounds.chickenSound.loop = true
                setup.sounds.chickenSound.play()
                this.eventManager.emitNow('caressStartChicken');
                this.advance(2)
            }
        });

        this.eventManager.add({
            type: 'time',
            delay: 2500,
            resetOn: 'caressStartChicken',
            step: 2,
            action: (setup) => {
                setup.world.character.isCaress = false
                setup.world.keyboard.F = false
                setup.world.isKeysStopp = false
                setup.npcs.chicken.updateState('idle')
                setup.sounds.chickenSound.loop = false;
                this.advance(1)
            }
        });

        this.eventManager.add({
            type: 'time',
            delay: 2000,
            resetOn: 'caressStartChicken',
            step: 2,
            condition: (setup) => !setup.world.farmLevelSetup.taskWindow.tasks[0].done,
            action: (setup) => {
                setup.world.farmLevelSetup.taskWindow.markDone(0)
                setup.world.farmLevelSetup.sounds.taskCompletedSound.currenttime = 0;
                setup.world.farmLevelSetup.sounds.taskCompletedSound.play();
                setup.popupTexts.push(new PopupText("Aufgabe erledigt!", setup.world.canvas.width / 2, 440));
            }
        });

        this.eventManager.add({
            type: 'collision',
            objectA: 'character',
            objectB: 'chick',
            requireKey: 'F',
            once: false,
            step: 1,
            action: (setup) => {
                setup.world.character.isCaress = true
                setup.world.isKeysStopp = true
                setup.world.character.x = 720;
                setup.world.character.isFlipped = false
                setup.npcs.chick.updateState('love')
                setup.sounds.chickSound.loop = true
                setup.sounds.chickSound.play()
                this.eventManager.emitNow('caressStartChick');
                this.advance(3)
            }
        });

        this.eventManager.add({
            type: 'time',
            delay: 2500,
            resetOn: 'caressStartChick',
            step: 3,
            action: (setup) => {
                setup.world.character.isCaress = false
                setup.world.keyboard.F = false
                setup.world.isKeysStopp = false
                setup.npcs.chick.updateState('idle')
                setup.sounds.chickSound.loop = false;
                this.advance(1)
            }
        });

        this.eventManager.add({
            type: 'time',
            delay: 2000,
            resetOn: 'caressStartChick',
            step: 3,
            condition: (setup) => !setup.world.farmLevelSetup.taskWindow.tasks[1].done,
            action: (setup) => {
                setup.world.farmLevelSetup.taskWindow.markDone(1)
                setup.world.farmLevelSetup.sounds.taskCompletedSound.currenttime = 0;
                setup.world.farmLevelSetup.sounds.taskCompletedSound.play();
                setup.popupTexts.push(new PopupText("Aufgabe erledigt!", setup.world.canvas.width / 2, 440));
            }
        });
    }
}

// handleEvents() {


//     if (this.character.isColliding(this.setup.npcs.chick, 0, 0) && this.keyboard.F) {
//         if (!this.starttime2) {
//             this.starttime2 = performance.now();
//         }
//         const elapsed = performance.now() - this.starttime2;
//         if (elapsed >= 0 && elapsed < 5000) {
//             this.character.isCaress = true;
//             this.world.isKeysStopp = true;
//             this.character.x = 720;
//             this.character.isFlipped = false;
//             this.setup.npcs.chick.updateState('love');
//             this.setup.sounds.chickSound.play();
//         } else {
//             this.character.isCaress = false;
//             this.starttime2 = null;
//             this.keyboard.F = false;
//             this.world.isKeysStopp = false;
//             this.setup.npcs.chick.updateState('idle');
//             if (!this.farmLevelSetup.taskWindow.tasks[1].done) {
//                 this.farmLevelSetup.taskWindow.markDone(1)
//                 this.farmLevelSetup.sounds.taskCompletedSound.play();
//                 this.popupTexts.push(new PopupText("Aufgabe erledigt!", this.canvas.width / 2, 440));
//             }
//         }
//     }
// }
