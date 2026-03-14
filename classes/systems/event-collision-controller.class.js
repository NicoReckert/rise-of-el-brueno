/**
 * Handles collision checks for event objects.
 */
export class EventCollisionController {
    /**
     * Creates a new event collision controller instance.
     * @param {Object} setup Setup reference.
     * @param {Object} geometryCtrl Geometry controller.
     */
    constructor(setup, geometryCtrl) {
        this.setup = setup;
        this.geometryCtrl = geometryCtrl;
        this.debug = false;
    }

    /**
     * Handles a collision-type event between objects.
     * @param {Object} e Event configuration.
     * @param {number} now Current timestamp.
     * @param {boolean} canTrigger Whether the event can trigger.
     * @param {Object} a Primary object.
     * @param {Object|Object[]} b Collision target object or array.
     * @returns {void}
     */
    handleCollisionEvent(e, now, canTrigger, a, b) {
        if (!this.isValidCollisionSource(a)) return;
        const state = this.buildCollisionState(e);
        if (Array.isArray(b)) return this.handleArrayCollisionEvent(e, now, canTrigger, a, b, state);
        if (!b) return;
        if (this.shouldSkipCollisionTarget(e, now, a, b, state)) return;
        const hit = a.isColliding(b, state.tolA, state.tolB, state.collOpts);
        if (hit && state.key && canTrigger) this.triggerCollision(e, now, a, b);
        else if (!hit) this.triggerCollisionLeave(e, now, a, b);
        if (this.debug) this.drawSingleCollisionDebug(a, b, state, hit);
    }

    /**
     * Checks whether a collision target should be skipped.
     * @param {Object} e Event configuration.
     * @param {number} now Current timestamp.
     * @param {Object} a Primary object.
     * @param {Object} b Collision target object.
     * @param {Object} state Collision state configuration.
     * @returns {boolean} True if the target should be skipped.
     */
    shouldSkipCollisionTarget(e, now, a, b, state) {
        if (!e.targetFilter || e.targetFilter(b, this.setup, a, e)) return false;
        this.triggerCollisionLeave(e, now, a, b);
        if (this.debug) this.drawSingleCollisionDebug(a, b, state, false);
        return true;
    }

    /**
     * Checks whether the object can be used as a collision source.
     * @param {Object} a Source object.
     * @returns {boolean} True if the object supports collision checks.
     */
    isValidCollisionSource(a) {
        return !!a && typeof a.isColliding === "function";
    }

    /**
     * Builds the collision state configuration for an event.
     * @param {Object} e Event configuration.
     * @returns {{tolA:Object,tolB:Object,key:boolean,collOpts:Object}} Collision state.
     */
    buildCollisionState(e) {
        return {
            tolA: this.geometryCtrl.getDefaultTolerance(e.toleranceA),
            tolB: this.geometryCtrl.getDefaultTolerance(e.toleranceB),
            key: !e.requireKey || this.setup.world.keyboard[e.requireKey],
            collOpts: {
                useAttackHitboxA: !!e.useAttackHitboxA,
                useAttackHitboxB: !!e.useAttackHitboxB,
                hitboxA: e.hitboxA ?? null,
                hitboxB: e.hitboxB ?? null
            }
        };
    }

    /**
     * Handles collision checks when the target is an array of objects.
     * @param {Object} e Event configuration.
     * @param {number} now Current timestamp.
     * @param {boolean} canTrigger Whether the event can trigger.
     * @param {Object} a Source object.
     * @param {Object[]} b Target objects.
     * @param {Object} state Collision state configuration.
     * @returns {void}
     */
    handleArrayCollisionEvent(e, now, canTrigger, a, b, state) {
        const hitObj = this.findFirstCollisionInArray(e, a, b, state);
        const hit = !!hitObj;
        if (hit && state.key && canTrigger) this.triggerArrayCollision(e, now, a, hitObj);
        else if (!hit) this.triggerArrayCollisionLeave(e, now, a);
        if (this.debug) this.drawArrayCollisionDebug(e, a, b, state, hit);
    }

    /**
     * Finds the first object in an array that collides with the source object.
     * @param {Object} e Event configuration.
     * @param {Object} a Source object.
     * @param {Object[]} b Target objects.
     * @param {Object} state Collision state configuration.
     * @returns {Object|null} Colliding object or null if none found.
     */
    findFirstCollisionInArray(e, a, b, state) {
        for (const item of b) {
            if (!item) continue;
            if (e.targetFilter && !e.targetFilter(item, this.setup, a, e)) continue;
            if (a.isColliding(item, state.tolA, state.tolB, state.collOpts)) return item;
        }
        return null;
    }

    /**
     * Triggers a collision event for an array target.
     * @param {Object} e Event configuration.
     * @param {number} now Current timestamp.
     * @param {Object} a Source object.
     * @param {Object} hitObj Colliding target object.
     * @returns {void}
     */
    triggerArrayCollision(e, now, a, hitObj) {
        e.action?.(this.setup, a, hitObj);
        e.lastTrigger = now;
        e._wasHit = true;
        if (e.once) e.triggered = true;
    }

    /**
     * Handles leave logic for an array collision event.
     * @param {Object} e Event configuration.
     * @param {number} now Current timestamp.
     * @param {Object} a Source object.
     * @returns {void}
     */
    triggerArrayCollisionLeave(e, now, a) {
        if (!e._wasHit) return;
        const cooldown = e.cooldown || 0;
        if (e.onLeave && now - (e.lastLeave ?? 0) >= cooldown) {
            e.onLeave(this.setup, a, null);
            e.lastLeave = now;
        }
        e._wasHit = false;
    }

    /**
     * Draws collision debug visuals for a single collision check.
     * @param {Object} a First object.
     * @param {Object} b Second object.
     * @param {Object} state Collision state.
     * @param {boolean} hit Collision state result.
     */
    drawSingleCollisionDebug(a, b, state, hit) {
        const optsA = {
            hitbox: state.collOpts.hitboxA,
            useAttackHitbox: state.collOpts.useAttackHitboxA
        };
        const optsB = {
            hitbox: state.collOpts.hitboxB,
            useAttackHitbox: state.collOpts.useAttackHitboxB
        };
        this.geometryCtrl.drawCollisionDebug(
            a, b, state.tolA, state.tolB, hit, optsA, optsB
        );
    }

    /**
     * Draws collision debug visuals for array-based collision checks.
     * @param {Object} e Event object.
     * @param {Object} a First object.
     * @param {Array} b Array of target objects.
     * @param {Object} state Collision state.
     * @param {boolean} hit Collision state result.
     */
    drawArrayCollisionDebug(e, a, b, state, hit) {
        const ctx = this.setup.world.ctx;
        const optsA = { hitbox: state.collOpts.hitboxA, useAttackHitbox: state.collOpts.useAttackHitboxA };
        const colorA = hit
            ? this.geometryCtrl.debugColors.active
            : this.geometryCtrl.debugColors.hitA;
        ctx.save();
        const boxA = this.geometryCtrl.getBox(a, state.tolA, optsA);
        this.geometryCtrl.drawBox(ctx, boxA, colorA);
        for (const item of b) this.drawArrayCollisionDebugItem(ctx, e, a, item, state);
        ctx.restore();
    }

    /**
     * Draws debug visuals for a single item in an array-based collision check.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {Object} e Event object.
     * @param {Object} a First object.
     * @param {Object} item Target item.
     * @param {Object} state Collision state.
     */
    drawArrayCollisionDebugItem(ctx, e, a, item, state) {
        if (!item) return;
        const boxB = this.geometryCtrl.getBox(item, state.tolB, {
            hitbox: state.collOpts.hitboxB,
            useAttackHitbox: state.collOpts.useAttackHitboxB
        });
        if (e.targetFilter && !e.targetFilter(item, this.setup, a, e)) {
            this.geometryCtrl.drawBox(ctx, boxB, this.geometryCtrl.debugColors.inactive);
            return;
        }
        const h = a.isColliding(item, state.tolA, state.tolB, state.collOpts);
        const color = h ? this.geometryCtrl.debugColors.active : this.geometryCtrl.debugColors.hitB;
        this.geometryCtrl.drawBox(ctx, boxB, color);
    }

    /**
     * Executes collision action.
     * @param {object} e - The event.
     * @param {number} now - The current time.
     * @param {object} a - The first object.
     * @param {object} b - The second object.
     */
    triggerCollision(e, now, a, b) {
        e.action?.(this.setup, a, b);
        e.lastTrigger = now;
        if (e.once) e.triggered = true;
    }

    /**
     * Handles collision leave.
     * @param {object} e Event object.
     * @param {number} now Current time.
     * @param {object} a First object.
     * @param {object} b Second object.
     * @returns {void}
     */
    triggerCollisionLeave(e, now, a, b) {
        if (!e.onLeave) return;
        if (!e.cooldown || now - (e.lastLeave ?? 0) >= e.cooldown) {
            e.onLeave(this.setup, a, b);
            e.lastLeave = now;
        }
    }

    /**
     * Handles a hold-type event with optional collision target.
     * @param {Object} e Event configuration.
     * @param {number} now Current timestamp.
     * @param {boolean} canTrigger Whether the event can trigger.
     * @param {Object} a Primary object.
     * @param {Object} b Secondary object.
     * @returns {void}
     */
    handleHoldEvent(e, now, canTrigger, a, b) {
        if (!a) return;
        const keyDown = !e.requireKey || this.setup.world.keyboard[e.requireKey];
        if (!b) return this.handleHoldWithoutTarget(e, now, canTrigger, a, keyDown);
        if (typeof a.isColliding !== "function") return;
        const state = this.buildCollisionState(e);
        const hit = a.isColliding(b, state.tolA, state.tolB, state.collOpts);
        if (hit && keyDown) this.updateHoldProgress(e, now, canTrigger, a, b);
        else this.cancelHold(e, a, b);
        if (this.debug) this.drawHoldEventDebug(e, a, b, state, hit);
    }

    /**
     * Handles a hold-type event without a collision target.
     * @param {Object} e Event configuration.
     * @param {number} now Current timestamp.
     * @param {boolean} canTrigger Whether the event can trigger.
     * @param {Object} a Primary object.
     * @param {boolean} keyDown Whether the required key is pressed.
     * @returns {void}
     */
    handleHoldWithoutTarget(e, now, canTrigger, a, keyDown) {
        if (keyDown) this.updateHoldProgress(e, now, canTrigger, a, null);
        else this.cancelHold(e, a, null);
    }

    /**
     * Draws debug visuals for hold-based collision events.
     * @param {Object} e Event object.
     * @param {Object} a First object.
     * @param {Object} b Second object.
     * @param {Object} state Collision state.
     * @param {boolean} hit Collision state result.
     */
    drawHoldEventDebug(e, a, b, state, hit) {
        const optsA = {
            hitbox: state.collOpts.hitboxA,
            useAttackHitbox: state.collOpts.useAttackHitboxA
        };
        const optsB = {
            hitbox: state.collOpts.hitboxB,
            useAttackHitbox: state.collOpts.useAttackHitboxB
        };
        this.geometryCtrl.drawHoldDebug(
            e, a, b, state.tolA, state.tolB, hit, optsA, optsB
        );
    }

    /**
     * Updates the progress of a hold event and triggers the action when completed.
     * @param {Object} e Event configuration.
     * @param {number} now Current timestamp.
     * @param {boolean} canTrigger Whether the event can trigger.
     * @param {Object} a Primary object.
     * @param {Object} b Secondary object.
     * @returns {void}
     */
    updateHoldProgress(e, now, canTrigger, a, b) {
        if (!e.holdStart) e.holdStart = now;
        if (this.shouldCancelThrowBottleHold(e, a, b)) return;
        const elapsed = now - e.holdStart;
        const dur = Math.max(1, e.duration ?? 1);
        e.progress = Math.min(elapsed / dur, 1);
        if (e.name === "town_throw_bottle_hold") this.setup.state.throwHoldProgress = e.progress;
        if (elapsed >= dur && canTrigger && !e._holdFired) {
            this.fireHoldAction(e, now, a, b);
        }
    }

    /**
     * Checks whether the throw bottle hold event should be canceled.
     * @param {Object} e Event configuration.
     * @param {Object} a Primary object.
     * @param {Object} b Secondary object.
     * @returns {boolean} True if the hold was canceled, otherwise false.
     */
    shouldCancelThrowBottleHold(e, a, b) {
        if (e.name !== "town_throw_bottle_hold") return false;
        const world = this.setup.world;
        const kb = world?.keyboard;
        const c = world?.character;
        if (!c || (c.throwableBottles ?? 0) <= 0) return this.cancelHoldAndTrue(e, a, b);
        if (kb?.LEFT || kb?.RIGHT) return this.cancelHoldAndTrue(e, a, b);
        return false;
    }

    /**
     * Cancels the hold event and returns true.
     * @param {Object} e Event configuration.
     * @param {Object} a Primary object.
     * @param {Object} b Secondary object.
     * @returns {boolean} Always true.
     */
    cancelHoldAndTrue(e, a, b) {
        this.cancelHold(e, a, b);
        return true;
    }

    /**
     * Executes the hold event action and updates its trigger state.
     * @param {Object} e Event configuration.
     * @param {number} now Current timestamp.
     * @param {Object} a Primary object.
     * @param {Object} b Secondary object.
     * @returns {void}
     */
    fireHoldAction(e, now, a, b) {
        e._holdFired = true;
        e.action?.(this.setup, a, b);
        e.lastTrigger = now;
        if (e.once) e.triggered = true;
    }

    /**
     * Cancels a hold event.
     * @param {object} e Event object.
     * @param {object} a First object.
     * @param {object} b Second object.
     * @returns {void}
     */
    cancelHold(e, a, b) {
        const p = e.progress ?? 0;
        if (p > 0 && e.onCancel) e.onCancel(this.setup, a, b, p);
        e.holdStart = null;
        e.progress = 0;
        e._holdFired = false;
        e._moveHoldStart = null;
        e._moveHoldDir = 0;
        if (e.name === "town_throw_bottle_hold") {
            this.setup.state.throwHoldProgress = 0;
        }
    }
}