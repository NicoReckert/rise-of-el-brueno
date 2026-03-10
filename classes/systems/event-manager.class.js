import { EventGeometryController } from "./event-geometry-controller.class.js";
import { EventCollisionController } from "./event-collision-controller.class.js";

/**
 * Manages world events and their state.
 */
export class EventManager {
    /**
     * Creates a new EventManager instance.
     * @param {object} setup - The game setup containing world and objects.
     * @param {object} questManager - The quest manager instance.
     */
    constructor(setup, questManager) {
        if (!setup?.world) throw new Error("EventManager: setup.world is missing!");
        this.setup = setup;
        this.events = [];
        this.startTime = performance.now();
        this.questManager = questManager;
        this.debugColors = { active: "lime", inactive: "red", hitA: "blue", hitB: "orange" };
        this.geometryCtrl = new EventGeometryController(this.setup, this.debugColors);
        this.collisionCtrl = new EventCollisionController(this.setup, this.geometryCtrl);
    }

    /**
     * Resolves a target by name.
     * @param {string} name Target name.
     * @returns {object|null} Resolved target or null.
     */
    resolveTarget(name) {
        if (!this.isValidName(name)) return null;
        for (const pool of this.getTargetPools()) {
            const target = this.findInPool(pool, name);
            if (target) return target;
        }
        const tl = this.setup?.townLevel;
        if (tl && Array.isArray(tl[name])) return tl[name];
        return null;
    }

    /**
     * Checks if a name is valid.
     * @param {string} name - The name to validate.
     * @returns {boolean} True if valid, otherwise false.
     */
    isValidName(name) {
        return typeof name === "string" && name.trim().length > 0;
    }

    /**
     * Returns all available target pools.
     * @returns {object[]} The list of target pools.
     */
    getTargetPools() {
        return [
            this.setup.world,
            this.setup.characters,
            this.setup.cutsceneActors,
            this.setup.environment,
            this.setup.enemies,
            this.setup.bosses,
            this.setup.throwables,
            this.setup.items,
            this.setup
        ];
    }

    /**
     * Finds an object by name in a pool.
     * @param {object} pool - The object pool.
     * @param {string} name - The target name.
     * @returns {object|null} The found object or null.
     */
    findInPool(pool, name) {
        return pool && typeof pool === "object" ? pool[name] ?? null : null;
    }

    /**
     * Adds a new event.
     * @param {object} event - The event data.
     */
    add(event) {
        this.events.push({
            triggered: false,
            once: event.once ?? true,
            lastTrigger: 0,
            lastLeave: 0,
            armed: event.armed ?? !(event.type === "time" && event.manual === true),
            ...event
        });
    }

    /**
     * Emits a reset flag for matching events.
     * @param {string} eventName - The event name to reset.
     */
    emit(eventName) {
        this.events.forEach(e => { if (e.resetOn === eventName) e._resetFlag = true; });
    }

    /**
     * Immediately resets matching events.
     * @param {string} eventName - The event name to reset.
     */
    emitNow(eventName) {
        const now = performance.now();
        this.events.forEach(e => { if (e.resetOn === eventName) this.resetEvent(e, now); });
    }

    /**
     * Resets an event state.
     * @param {object} element - The event element.
     * @param {number} now - The current timestamp.
     */
    resetEvent(element, now) {
        element.startAt = now;
        element.triggered = false;
        element._ended = false;
        element._resetFlag = false;
        element.armed = true;
    }

    /**
     * Resets an event by name.
     * @param {string} name - The event name.
     */
    resetEventByName(name) {
        const e = this.events.find(ev => ev.name === name);
        if (e) this.resetEvent(e, performance.now());
    }

    /**
     * Updates all events.
     */
    update() {
        const now = performance.now();
        this.events.forEach(e => this.handleEventUpdate(e, now));
    }

    /**
     * Handles event update logic.
     * @param {object} event - The event object.
     * @param {number} now - The current time.
     */
    handleEventUpdate(event, now) {
        if (this.shouldSkipEvent(event)) return;
        const canTrigger = this.canTrigger(event, now);
        const { objA, objB } = this.resolveEventObjects(event);
        this.routeEventByType(event, now, canTrigger, objA, objB);
    }

    /**
     * Determines if an event should be skipped.
     * @param {object} e - The event.
     * @returns {boolean} True if skipped.
     */
    shouldSkipEvent(e) {
        if (e.armed === false) return true;
        if (e.triggered) return true;
        if (e.step !== undefined && this.questManager?.step !== e.step) return true;
        if (e.condition && !e.condition(this.setup)) return true;
        return false;
    }

    /**
     * Checks if an event can trigger.
     * @param {object} e - The event.
     * @param {number} now - The current time.
     * @returns {boolean} True if it can trigger.
     */
    canTrigger(e, now) {
        return !e.cooldown || now - (e.lastTrigger ?? 0) >= e.cooldown;
    }

    /**
     * Resolves event objects.
     * @param {object} e - The event.
     * @returns {{objA: object, objB: object|null}} The resolved objects.
     */
    resolveEventObjects(e) {
        return {
            objA: e.objectA ? this.resolveTarget(e.objectA) : this.setup.world.character,
            objB: e.objectB ? this.resolveTarget(e.objectB) : null
        };
    }

    /**
     * Routes event logic by type.
     * @param {object} e - The event.
     * @param {number} now - The current time.
     * @param {boolean} canTrigger - Whether it can trigger.
     * @param {object} objA - The first object.
     * @param {object} objB - The second object.
     */
    routeEventByType(e, now, canTrigger, objA, objB) {
        switch (e.type) {
            case "time": return this.handleTimeEvent(e, now, canTrigger);
            case "position": return this.geometryCtrl.handlePositionEvent(e, now, canTrigger, objA);
            case "quest": return this.handleQuestEvent(e, now, canTrigger);
            case "input": return this.handleInputEvent(e, now, canTrigger);
            case "collision": return this.collisionCtrl.handleCollisionEvent(e, now, canTrigger, objA, objB);
            case "hold": return this.collisionCtrl.handleHoldEvent(e, now, canTrigger, objA, objB);
        }
    }

    /**
     * Handles time-based events.
     * @param {object} e - The event.
     * @param {number} now - The current time.
     * @param {boolean} canTrigger - Whether it can trigger.
     */
    handleTimeEvent(e, now, canTrigger) {
        this.initTimeEvent(e, now);
        const elapsed = now - e.startAt;
        this.updateTimeProgress(e, elapsed);
        if (this.isWithinTime(e, elapsed) && canTrigger) this.triggerTimeAction(e, now, elapsed);
        else if (elapsed >= (e.to ?? Infinity)) this.finishOrRepeatTimeEvent(e, now);
    }

    /**
     * Initializes time-based event data.
     * @param {object} e Event object.
     * @param {number} now Current time.
     * @returns {void}
     */
    initTimeEvent(e, now) {
        if (e.startAt === undefined) {
            e.startAt = now;
        }
        if (e.step !== undefined) {
            if (e._lastStep === undefined) {
                e._lastStep = this.questManager?.step;
            } else if (e._lastStep !== this.questManager?.step) {
                e.startAt = now;
                e._lastStep = this.questManager?.step;
            }
        }
        if (e._resetFlag) this.resetEvent(e, now);
    }

    /**
     * Updates time event progress.
     * @param {object} e - The event.
     * @param {number} elapsed - Elapsed time.
     */
    updateTimeProgress(e, elapsed) {
        const from = e.from ?? e.delay ?? 0;
        const to = e.to ?? Infinity;
        e.progress = e.to
            ? Math.min(elapsed / (e.to - from), 1)
            : Math.min(elapsed / (e.delay ?? 1), 1);
    }

    /**
     * Checks if a time event is within range.
     * @param {object} e - The event.
     * @param {number} elapsed - Elapsed time.
     * @returns {boolean} True if within range.
     */
    isWithinTime(e, elapsed) {
        const start = e.from ?? e.delay ?? 0;
        const end = e.to ?? Infinity;
        return elapsed >= start && elapsed <= end;
    }

    /**
     * Triggers a time event action.
     * @param {object} e - The event.
     * @param {number} now - The current time.
     * @param {number} elapsed - Elapsed time.
     */
    triggerTimeAction(e, now, elapsed) {
        e.action?.(this.setup, elapsed, e.progress);
        e.lastTrigger = now;
        if (e.once && !e.repeat) e.triggered = true;
    }

    /**
     * Finishes or repeats a time event.
     * @param {object} e - The event.
     * @param {number} now - The current time.
     */
    finishOrRepeatTimeEvent(e, now) {
        if (!e._ended && e.onEnd) { e.onEnd(this.setup); e._ended = true; }
        if (e.repeat) this.resetEvent(e, now);
        else if (e.manual === true) e.armed = false;
    }

    /**
     * Handles quest events.
     * @param {object} e - The event.
     * @param {number} now - The current time.
     * @param {boolean} canTrigger - Whether it can trigger.
     */
    handleQuestEvent(e, now, canTrigger) {
        if (!canTrigger) return;
        e.action?.(this.setup);
        e.lastTrigger = now;
        if (e.once) e.triggered = true;
    }

    /**
     * Handles input events.
     * @param {object} e - The event.
     * @param {number} now - The current time.
     * @param {boolean} canTrigger - Whether it can trigger.
     */
    handleInputEvent(e, now, canTrigger) {
        if (!this.setup.world.keyboard[e.key] || !canTrigger) return;
        e.action?.(this.setup);
        e.lastTrigger = now;
        if (e.once) e.triggered = true;
    }

    /**
     * Sets the debug state and propagates it to related controllers.
     * @param {boolean} value Debug state.
     */
    set debug(value) {
        this._debug = value;
        this.geometryCtrl.debug = value;
        this.collisionCtrl.debug = value;
    }

    /**
     * Returns the current debug state.
     * @returns {boolean} Debug state.
     */
    get debug() {
        return this._debug ?? false;
    }
}