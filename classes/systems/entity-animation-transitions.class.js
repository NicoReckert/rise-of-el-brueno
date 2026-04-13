/**
 * Manages animation transition rules for an entity.
 */
export class EntityAnimationTransitions {
    static RULES = EntityAnimationTransitions.createRules();

    /**
     * Creates the rule collection.
     * @returns {Object} Rule collection.
     */
    static createRules() {
        return {
            ...this.createBaseRulesA(),
            ...this.createBaseRulesB(),
            tadeo: this.createTadeoRules()
        };
    }

    /**
     * Creates the base rule collection A.
     * @returns {Object} Base rule collection A.
     */
    static createBaseRulesA() {
        return {
            doorOpens: { skipIfCurrent: 'idleOpen', next: 'idleOpen' },
            doorCloses: { skipIfCurrent: 'idle', next: 'idle' },
            fireGoesOn: { skipIfCurrent: 'burningFire', next: 'burningFire' },
            fireGoesOut: { next: 'idle' },
            findsPeace: { skipIfCurrent: 'findsPeaceLoop', next: 'findsPeaceLoop' }
        };
    }

    /**
     * Creates the base rule collection B.
     * @returns {Object} Base rule collection B.
     */
    static createBaseRulesB() {
        return {
            stoneActivated: { skipIfCurrent: 'idleWithStone', next: 'idleWithStone' },
            broken: { next: 'idle' },
            spiritCuddle: { skipIfCurrent: 'spiritCuddleLoop', next: 'spiritCuddleLoop' },
            sustain: { skipIfCurrent: 'sustainLoop', next: 'sustainLoop' },
            spiritOffering: { next: 'idle' }
        };
    }

    /**
     * Creates the Tadeo rule collection.
     * @returns {Object} Tadeo rule collection.
     */
    static createTadeoRules() {
        return {
            afraid: { skipIfCurrent: 'afraidLoop', next: 'afraidLoop' },
            standUp: { skipIfCurrent: 'idleWithStone', next: 'idleWithStone' }
        };
    }

    /**
     * Creates a new instance.
     * @param {*} entity Associated entity.
     */
    constructor(entity) {
        this.entity = entity;
    }

    /**
     * Returns the transition rule for a given state.
     * @param {string} state Animation state.
     * @returns {Object|null} Transition rule or null if none exists.
     */
    rule(state) {
        const id = this.entity?.currentEntity;
        const perEntity = id ? EntityAnimationTransitions.RULES?.[id]?.[state] : null;
        if (perEntity) return perEntity;
        return EntityAnimationTransitions.RULES?.[state] ?? null;
    }

    /**
     * Determines whether a transition to the given state should be skipped.
     * @param {string} state Animation state.
     * @returns {boolean} True if the transition should be skipped, otherwise false.
     */
    shouldSkip(state) {
        const r = this.rule(state);
        return !!(r?.skipIfCurrent && this.entity.currentAnimation === r.skipIfCurrent);
    }

    /**
     * Handles post-animation transition logic.
     * @param {string} state Completed animation state.
     * @returns {void}
     */
    handlePostAnimation(state) {
        const r = this.rule(state);
        const next = r?.next;
        if (!next) return;
        const hasNext = !!this.entity.getAnimationImages?.(next);
        if (!hasNext) return;
        this.entity.setAnimation(next);
    }
}