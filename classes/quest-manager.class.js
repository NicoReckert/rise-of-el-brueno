export class QuestManager {
    constructor(setup, eventManager, events) {
        this.setup = setup;
        this.world = setup.world;
        this.eventManager = eventManager;
        this.events = events;
        this.step = 1;
        this.quests = [];
        this.registerEvents(this.events);
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

    registerEvents(events) {
        events.forEach(element => this.eventManager.add(element));
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