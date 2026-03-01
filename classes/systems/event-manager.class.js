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
        if (!setup?.world) throw new Error("EventManager: setup.world fehlt!");
        this.setup = setup;
        this.events = [];
        this.startTime = performance.now();
        this.questManager = questManager;
        this.debugColors = { active: "lime", inactive: "red", hitA: "blue", hitB: "orange" };
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
     * Creates a normalized bounding box.
     * @param {object} obj - The target object.
     * @param {object} [tol={}] - The tolerance values.
     * @returns {object} The normalized box.
     */
    _getBox(obj, tol = {}) {
        const off = obj.offset ?? { left: 0, right: 0, top: 0, bottom: 0 };
        const t = this.getDefaultTolerance(tol);
        const { left, right, top, bottom } = this.calculateRawBox(obj, off, t);
        const norm = this.normalizeBox({ left, right, top, bottom });
        const camX = this.getCameraX();
        return {
            x: norm.left - camX,
            y: norm.top,
            width: Math.max(0.001, norm.right - norm.left),
            height: Math.max(0.001, norm.bottom - norm.top)
        };
    }

    /**
     * Returns default tolerance values.
     * @param {object} tol - Partial tolerance overrides.
     * @returns {object} The full tolerance object.
     */
    getDefaultTolerance(tol) {
        return {
            x: tol?.x ?? 0,
            y: tol?.y ?? 0,
            width: tol?.width ?? 0,
            height: tol?.height ?? 0
        };
    }

    /**
     * Calculates raw box coordinates.
     * @param {object} obj - The object.
     * @param {object} off - The offset.
     * @param {object} t - The tolerance.
     * @returns {object} The raw box coordinates.
     */
    calculateRawBox(obj, off, t) {
        const x = this.getObjX(obj);
        const isFlipped = !!(obj.isFlipped);

        const left = isFlipped ? x + off.right + t.x : x + off.left + t.x;
        const right = isFlipped
            ? x + obj.width - off.left - t.width
            : x + obj.width - off.right - t.width;

        const top = obj.y + off.top + t.y;
        const bottom = obj.y + obj.height - off.bottom - t.height;

        return { left, right, top, bottom };
    }


    /**
     * Normalizes box coordinates.
     * @param {object} raw - The raw box.
     * @returns {object} The normalized box.
     */
    normalizeBox(raw) {
        return {
            left: Math.min(raw.left, raw.right),
            right: Math.max(raw.left, raw.right),
            top: Math.min(raw.top, raw.bottom),
            bottom: Math.max(raw.top, raw.bottom)
        };
    }

    /**
     * Returns the camera X position.
     * @returns {number} The camera X value.
     */
    getCameraX() {
        return this.setup?.world?.camera_x ?? 0;
    }

    /**
     * Draws a debug box.
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @param {object} box - The box to draw.
     * @param {string} color - The box color.
     */
    _drawBox(ctx, box, color) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(box.x, box.y, box.width, box.height);
        ctx.restore();
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
            case "position": return this.handlePositionEvent(e, now, canTrigger, objA);
            case "quest": return this.handleQuestEvent(e, now, canTrigger);
            case "input": return this.handleInputEvent(e, now, canTrigger);
            case "collision": return this.handleCollisionEvent(e, now, canTrigger, objA, objB);
            case "hold": return this.handleHoldEvent(e, now, canTrigger, objA, objB);
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
     * Handles position-based events.
     * @param {object} e - The event.
     * @param {number} now - The current time.
     * @param {boolean} canTrigger - Whether it can trigger.
     * @param {object} objA - The object to check.
     */
    handlePositionEvent(e, now, canTrigger, objA) {
        const area = this.getPositionArea(e);
        const inside = this.isInsideArea(objA, area, e);
        if (inside && canTrigger) this.triggerPositionEnter(e, now, objA);
        else if (!inside) this.triggerPositionLeave(e, now, objA);
        if (this.debug) this.drawPositionDebug(area, inside);
    }

    /**
     * Gets position area data.
     * @param {object} e - The event.
     * @returns {object} The position area.
     */
    getPositionArea(e) {
        return {
            x: e.area.x,
            y: e.area.y ?? 0,
            width: e.area.width ?? 50,
            height: e.area.height ?? this.setup.world.canvas.height,
            offset: { top: 0, left: 0, right: 0, bottom: 0 },
            isFlipped: false
        };
    }

    /**
     * Checks if object is inside area.
     * @param {object} objA - The object.
     * @param {object} area - The area.
     * @param {object} e - The event.
     * @returns {boolean} True if inside.
     */
    isInsideArea(objA, area, e) {
        return typeof objA?.isColliding === "function" &&
            objA.isColliding(area) &&
            (!e.requireKey || this.setup.world.keyboard[e.requireKey]);
    }

    /**
     * Triggers position enter action.
     * @param {object} e - The event.
     * @param {number} now - The current time.
     * @param {object} objA - The object.
     */
    triggerPositionEnter(e, now, objA) {
        e.action?.(this.setup, objA);
        e.lastTrigger = now;
        if (e.once) e.triggered = true;
    }

    /**
     * Triggers position leave action.
     * @param {object} e - The event.
     * @param {number} now - The current time.
     * @param {object} objA - The object.
     */
    triggerPositionLeave(e, now, objA) {
        if (!e.onLeave) return;
        if (!e.cooldown || now - (e.lastLeave ?? 0) >= e.cooldown) {
            e.onLeave(this.setup, objA);
            e.lastLeave = now;
        }
    }

    /**
     * Draws debug area.
     * @param {object} area - The area.
     * @param {boolean} active - Active state.
     */
    drawPositionDebug(area, active) {
        const ctx = this.setup.world.ctx;
        ctx.save();
        ctx.strokeStyle = active ? this.debugColors.active : this.debugColors.inactive;
        ctx.lineWidth = 2;
        ctx.strokeRect(area.x - this.getCameraX(), area.y, area.width, area.height);
        ctx.restore();
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
     * Handles collision events.
     * @param {object} e - The event.
     * @param {number} now - The current time.
     * @param {boolean} canTrigger - Whether it can trigger.
     * @param {object} a - The first object.
     * @param {object} b - The second object.
     */
    handleCollisionEvent(e, now, canTrigger, a, b) {
        if (!a || typeof a.isColliding !== "function") return;
        const tolA = this.getDefaultTolerance(e.toleranceA);
        const tolB = this.getDefaultTolerance(e.toleranceB);
        const key = !e.requireKey || this.setup.world.keyboard[e.requireKey];
        const collOpts = {
            useAttackHitboxA: !!e.useAttackHitboxA,
            useAttackHitboxB: !!e.useAttackHitboxB,
            hitboxA: e.hitboxA ?? null,
            hitboxB: e.hitboxB ?? null,
        };
        if (Array.isArray(b)) {
            let hitObj = null;
            for (const item of b) {
                if (!item) continue;
                if (a.isColliding(item, tolA, tolB, collOpts)) { hitObj = item; break; }
            }
            const hit = !!hitObj;
            if (hit && key && canTrigger) {
                e.action?.(this.setup, a, hitObj);
                e.lastTrigger = now;
                e._wasHit = true;
                if (e.once) e.triggered = true;
            } else if (!hit && e._wasHit) {
                if (e.onLeave && now - (e.lastLeave ?? 0) >= (e.cooldown || 0)) {
                    e.onLeave(this.setup, a, null);
                    e.lastLeave = now;
                }
                e._wasHit = false;
            }
            if (this.debug) {
                const ctx = this.setup.world.ctx;
                ctx.save();
                const dbgA = collOpts.useAttackHitboxA && a.attackHitbox?.active
                    ? this.makeHitboxDebugProxy(a, a.attackHitbox)
                    : (collOpts.hitboxA ? this.makeHitboxDebugProxy(a, collOpts.hitboxA) : a);
                const boxA = this._getBox(dbgA, tolA);
                this._drawBox(ctx, boxA, hit ? this.debugColors.active : this.debugColors.hitA);

                for (const item of b) {
                    if (!item) continue;
                    const h = a.isColliding(item, tolA, tolB, collOpts);

                    const dbgB = collOpts.useAttackHitboxB && item.attackHitbox?.active
                        ? this.makeHitboxDebugProxy(item, item.attackHitbox)
                        : (collOpts.hitboxB ? this.makeHitboxDebugProxy(item, collOpts.hitboxB) : item);

                    const boxB = this._getBox(dbgB, tolB);
                    this._drawBox(ctx, boxB, h ? this.debugColors.active : this.debugColors.hitB);
                }
                ctx.restore();
            }
            return;
        }
        if (!b) return;
        const hit = a.isColliding(b, tolA, tolB, collOpts);
        if (hit && key && canTrigger) this.triggerCollision(e, now, a, b);
        else if (!hit) this.triggerCollisionLeave(e, now, a, b);
        if (this.debug) {
            const dbgA = collOpts.useAttackHitboxA && a.attackHitbox?.active
                ? this.makeHitboxDebugProxy(a, a.attackHitbox)
                : (collOpts.hitboxA ? this.makeHitboxDebugProxy(a, collOpts.hitboxA) : a);
            const dbgB = collOpts.useAttackHitboxB && b.attackHitbox?.active
                ? this.makeHitboxDebugProxy(b, b.attackHitbox)
                : (collOpts.hitboxB ? this.makeHitboxDebugProxy(b, collOpts.hitboxB) : b);
            this.drawCollisionDebug(dbgA, dbgB, tolA, tolB, hit);
        }
    }

    makeHitboxDebugProxy(obj, hitbox) {
        if (!obj || !hitbox) return obj;
        return {
            ...obj,
            offset: hitbox,
            getRenderX: obj.getRenderX?.bind(obj) || (() => obj.x),
        };
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
     * Draws collision debug boxes.
     * @param {object} a - First object.
     * @param {object} b - Second object.
     * @param {object} tolA - Tolerance A.
     * @param {object} tolB - Tolerance B.
     * @param {boolean} hit - Collision state.
     */
    drawCollisionDebug(a, b, tolA, tolB, hit) {
        const ctx = this.setup.world.ctx;
        ctx.save();
        const boxA = this._getBox(a, tolA);
        const boxB = this._getBox(b, tolB);
        this._drawBox(ctx, boxA, hit ? this.debugColors.active : this.debugColors.hitA);
        this._drawBox(ctx, boxB, hit ? this.debugColors.active : this.debugColors.hitB);
        ctx.restore();
    }

    handleHoldEvent(e, now, canTrigger, a, b) {
        if (!a) return;
        const keyDown = !e.requireKey || this.setup.world.keyboard[e.requireKey];
        if (!b) {
            if (keyDown) this.updateHoldProgress(e, now, canTrigger, a, null);
            else this.cancelHold(e, a, null);
            return;
        }
        if (typeof a.isColliding !== "function") return;
        const tolA = this.getDefaultTolerance(e.toleranceA);
        const tolB = this.getDefaultTolerance(e.toleranceB);
        const collOpts = {
            useAttackHitboxA: !!e.useAttackHitboxA,
            useAttackHitboxB: !!e.useAttackHitboxB,
            hitboxA: e.hitboxA ?? null,
            hitboxB: e.hitboxB ?? null,
        };
        const hit = a.isColliding(b, tolA, tolB, collOpts);
        if (hit && keyDown) this.updateHoldProgress(e, now, canTrigger, a, b);
        else this.cancelHold(e, a, b);
        if (this.debug) {
            const dbgA = collOpts.useAttackHitboxA && a.attackHitbox?.active
                ? this.makeHitboxDebugProxy(a, a.attackHitbox)
                : (collOpts.hitboxA ? this.makeHitboxDebugProxy(a, collOpts.hitboxA) : a);

            const dbgB = collOpts.useAttackHitboxB && b.attackHitbox?.active
                ? this.makeHitboxDebugProxy(b, b.attackHitbox)
                : (collOpts.hitboxB ? this.makeHitboxDebugProxy(b, collOpts.hitboxB) : b);
            this.drawHoldDebug(e, dbgA, dbgB, tolA, tolB, hit);
        }
    }

    /**
     * Updates hold progress.
     * @param {object} e - The event.
     * @param {number} now - The current time.
     * @param {boolean} canTrigger - Whether it can trigger.
     * @param {object} a - First object.
     * @param {object} b - Second object.
     */
    updateHoldProgress(e, now, canTrigger, a, b) {
        if (!e.holdStart) e.holdStart = now;
        if (e.name === "town_throw_bottle_hold") {
            const world = this.setup.world;
            const kb = world?.keyboard;
            const c = world?.character;

            if (!c || (c.throwableBottels ?? 0) <= 0) {
                this.cancelHold(e, a, b);
                return;
            }
            if (kb?.LEFT || kb?.RIGHT) {
                this.cancelHold(e, a, b);
                return;
            }
        }
        const elapsed = now - e.holdStart;
        const dur = Math.max(1, e.duration ?? 1);
        e.progress = Math.min(elapsed / dur, 1);

        if (e.name === "town_throw_bottle_hold") {
            this.setup.throwHoldProgress = e.progress;
        }
        if (elapsed >= dur && canTrigger && !e._holdFired) {
            e._holdFired = true;
            e.action?.(this.setup, a, b);
            e.lastTrigger = now;
            if (e.once) e.triggered = true;
        }
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
            this.setup.throwHoldProgress = 0;
        }
    }

    /**
     * Draws hold event debug visuals.
     * @param {object} e - The event.
     * @param {object} a - First object.
     * @param {object} b - Second object.
     * @param {object} tolA - Tolerance A.
     * @param {object} tolB - Tolerance B.
     * @param {boolean} hit - Collision state.
     */
    drawHoldDebug(e, a, b, tolA, tolB, hit) {
        const ctx = this.setup.world.ctx;
        ctx.save();
        const boxA = this._getBox(a, tolA);
        const boxB = this._getBox(b, tolB);
        this._drawBox(ctx, boxA, hit ? this.debugColors.active : this.debugColors.hitA);
        this._drawBox(ctx, boxB, hit ? this.debugColors.active : this.debugColors.hitB);
        if (e.progress > 0) this.drawHoldProgressCircle(ctx, e, b);
        ctx.restore();
    }

    /**
     * Draws hold progress circle.
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @param {object} e - The event.
     * @param {object} objB - The target object.
     */
    drawHoldProgressCircle(ctx, e, objB) {
        const bx = this.getObjX(objB);
        const x = bx - this.getCameraX() + objB.width / 2;
        const y = objB.y - 40;
        const r = 20;
        ctx.beginPath();
        ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + e.progress * 2 * Math.PI);
        ctx.strokeStyle = this.debugColors.active;
        ctx.lineWidth = 4;
        ctx.stroke();
        if (e.requireKey) this.drawHoldKeyText(ctx, e, x, y);
    }

    /**
     * Draws key hint text for hold events.
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @param {object} e - The event.
     * @param {number} x - X position.
     * @param {number} y - Y position.
     */
    drawHoldKeyText(ctx, e, x, y) {
        ctx.fillStyle = "white";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`Halte ${e.requireKey}`, x, y - 30);
    }

    getObjX(obj) {
        if (!obj) return 0;
        if (typeof obj.getRenderX === "function") return obj.getRenderX();
        return obj.x ?? 0;
    }
}