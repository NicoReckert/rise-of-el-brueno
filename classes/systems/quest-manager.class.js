
/**
 * Manages quest progression and quest-related events.
 */
export class QuestManager {
    /**
     * Creates a new quest manager instance.
     * @param {Object} setup Setup object.
     * @param {Object} eventManager Event manager instance.
     * @param {Array} events Quest event definitions.
     */
    constructor(setup, eventManager, events) {
        this.setup = setup;
        this.world = setup.world;
        this.eventManager = eventManager;
        this.events = events;
        this.step = 1;
        this.quests = [];
        this.registerEvents(this.events);
    }

    /**
     * Advances the quest to the specified step.
     * @param {number} step Quest step value.
     * @returns {void}
     */
    advance(step) {
        this.step = step;
    }

    /**
     * Adds a new quest.
     * @param {Object} quest Quest definition.
     * @returns {void}
     */
    addQuest(quest) {
        this.quests.push({
            done: false,
            ...quest
        });
    }

    /**
     * Registers quest events in the event manager.
     * @param {Array} events Quest event definitions.
     * @returns {void}
     */
    registerEvents(events) {
        events.forEach(element => this.eventManager.add(element));
    }

    /**
     * Updates the current quest state.
     * @returns {void}
     */
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