class QuestManager {
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
        farmEvents.forEach(element => this.eventManager.add(element));
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



//     if (this.cowTaskStep === 10) {
//         if (this.setup.npcs.chicken2.x <= 500 && this.setup.npcs.chicken2.x >= 450 && this.setup.npcs.chick.x <= 575 && this.setup.npcs.chick.x >= 525) {
//             this.cowTaskStep = 11;
//         }
//     }
// }