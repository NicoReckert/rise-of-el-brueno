class EventManager {
    constructor(setup, questManager) {
        if (!setup?.world) throw new Error("EventManager: setup.world fehlt!");
        this.setup = setup;
        this.events = [];
        this.startTime = performance.now();
        this.questManager = questManager;
        this.debugColors = { active: "lime", inactive: "red", hitA: "blue", hitB: "orange" };
    }

    resolveTarget(name) {
        if (!this.isValidName(name)) return null;
        for (const pool of this.getTargetPools()) {
            const target = this.findInPool(pool, name);
            if (target) return target;
        }
        return null;
    }

    isValidName(name) { return typeof name === "string" && name.trim().length > 0; }

    getTargetPools() {
        return [
            this.setup.world,
            this.setup.npcs,
            this.setup.enemies,
            this.setup.bosses,
            this.setup.throwables,
            this.setup.items,
            this.setup
        ];
    }

    findInPool(pool, name) {
        return pool && typeof pool === "object" ? pool[name] ?? null : null;
    }

    add(event) {
        this.events.push({
            triggered: false,
            once: true,
            lastTrigger: 0,
            lastLeave: 0,
            ...event
        });
    }

    emit(eventName) { this.events.forEach(e => { if (e.resetOn === eventName) e._resetFlag = true; }); }
    emitNow(eventName) { const now = performance.now(); this.events.forEach(e => { if (e.resetOn === eventName) this.resetEvent(e, now); }); }

    resetEvent(element, now) {
        element.startAt = now;
        element.triggered = false;
        element._ended = false;
        element._resetFlag = false;
    }

    resetEventByName(name) {
        const e = this.events.find(ev => ev.name === name);
        if (e) this.resetEvent(e, performance.now());
    }

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

    getDefaultTolerance(tol) {
        return {
            x: tol?.x ?? 0,
            y: tol?.y ?? 0,
            width: tol?.width ?? 0,
            height: tol?.height ?? 0
        };
    }

    calculateRawBox(obj, off, t) {
        const left = obj.isFlipped ? obj.x + off.right + t.x : obj.x + off.left + t.x;
        const right = obj.isFlipped
            ? obj.x + obj.width - off.left - t.width
            : obj.x + obj.width - off.right - t.width;
        const top = obj.y + off.top + t.y;
        const bottom = obj.y + obj.height - off.bottom - t.height;
        return { left, right, top, bottom };
    }

    normalizeBox(raw) {
        return {
            left: Math.min(raw.left, raw.right),
            right: Math.max(raw.left, raw.right),
            top: Math.min(raw.top, raw.bottom),
            bottom: Math.max(raw.top, raw.bottom)
        };
    }

    getCameraX() { return this.setup?.world?.camera_x ?? 0; }

    _drawBox(ctx, box, color) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(box.x, box.y, box.width, box.height);
        ctx.restore();
    }

    update() {
        const now = performance.now();
        this.events.forEach(e => this.handleEventUpdate(e, now));
    }

    handleEventUpdate(event, now) {
        if (this.shouldSkipEvent(event)) return;
        const canTrigger = this.canTrigger(event, now);
        const { objA, objB } = this.resolveEventObjects(event);
        this.routeEventByType(event, now, canTrigger, objA, objB);
    }

    shouldSkipEvent(e) {
        if (e.triggered) return true;
        if (e.step !== undefined && this.questManager?.step !== e.step) return true;
        if (e.condition && !e.condition(this.setup)) return true;
        return false;
    }

    canTrigger(e, now) { return !e.cooldown || now - (e.lastTrigger ?? 0) >= e.cooldown; }

    resolveEventObjects(e) {
        return {
            objA: e.objectA ? this.resolveTarget(e.objectA) : this.setup.world.character,
            objB: e.objectB ? this.resolveTarget(e.objectB) : null
        };
    }

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

    handleTimeEvent(e, now, canTrigger) {
        this.initTimeEvent(e, now);
        const elapsed = now - e.startAt;
        this.updateTimeProgress(e, elapsed);
        if (this.isWithinTime(e, elapsed) && canTrigger) this.triggerTimeAction(e, now, elapsed);
        else if (elapsed > (e.to ?? Infinity)) this.finishOrRepeatTimeEvent(e, now);
    }

    initTimeEvent(e, now) {
        if (e.startAt === undefined || e._lastStep !== this.questManager?.step) {
            e.startAt = now;
            e._lastStep = this.questManager?.step;
        }
        if (e._resetFlag) this.resetEvent(e, now);
    }

    updateTimeProgress(e, elapsed) {
        const from = e.from ?? e.delay ?? 0;
        const to = e.to ?? Infinity;
        e.progress = e.to
            ? Math.min(elapsed / (e.to - from), 1)
            : Math.min(elapsed / (e.delay ?? 1), 1);
    }

    isWithinTime(e, elapsed) {
        const start = e.from ?? e.delay ?? 0;
        const end = e.to ?? Infinity;
        return elapsed >= start && elapsed <= end;
    }

    triggerTimeAction(e, now, elapsed) {
        e.action?.(this.setup, elapsed, e.progress);
        e.lastTrigger = now;
        if (e.once && !e.repeat) e.triggered = true;
    }

    finishOrRepeatTimeEvent(e, now) {
        if (!e._ended && e.onEnd) { e.onEnd(this.setup); e._ended = true; }
        if (e.repeat) this.resetEvent(e, now);
    }

    handlePositionEvent(e, now, canTrigger, objA) {
        const area = this.getPositionArea(e);
        const inside = this.isInsideArea(objA, area, e);
        if (inside && canTrigger) this.triggerPositionEnter(e, now, objA);
        else if (!inside) this.triggerPositionLeave(e, now, objA);
        if (this.debug) this.drawPositionDebug(area, inside);
    }

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

    isInsideArea(objA, area, e) {
        return typeof objA?.isColliding === "function" &&
            objA.isColliding(area) &&
            (!e.requireKey || this.setup.world.keyboard[e.requireKey]);
    }

    triggerPositionEnter(e, now, objA) {
        e.action?.(this.setup, objA);
        e.lastTrigger = now;
        if (e.once) e.triggered = true;
    }

    triggerPositionLeave(e, now, objA) {
        if (!e.onLeave) return;
        if (!e.cooldown || now - (e.lastLeave ?? 0) >= e.cooldown) {
            e.onLeave(this.setup, objA);
            e.lastLeave = now;
        }
    }

    drawPositionDebug(area, active) {
        const ctx = this.setup.world.ctx;
        ctx.save();
        ctx.strokeStyle = active ? this.debugColors.active : this.debugColors.inactive;
        ctx.lineWidth = 2;
        ctx.strokeRect(area.x - this.getCameraX(), area.y, area.width, area.height);
        ctx.restore();
    }

    handleQuestEvent(e, now, canTrigger) {
        if (!canTrigger) return;
        e.action?.(this.setup);
        e.lastTrigger = now;
        if (e.once) e.triggered = true;
    }

    handleInputEvent(e, now, canTrigger) {
        if (!this.setup.world.keyboard[e.key] || !canTrigger) return;
        e.action?.(this.setup);
        e.lastTrigger = now;
        if (e.once) e.triggered = true;
    }

    handleCollisionEvent(e, now, canTrigger, a, b) {
        if (!a || !b || typeof a.isColliding !== "function") return;
        const tolA = this.getDefaultTolerance(e.toleranceA);
        const tolB = this.getDefaultTolerance(e.toleranceB);
        const hit = a.isColliding(b, tolA, tolB);
        const key = !e.requireKey || this.setup.world.keyboard[e.requireKey];
        if (hit && key && canTrigger) this.triggerCollision(e, now, a, b);
        else if (!hit) this.triggerCollisionLeave(e, now, a, b);
        if (this.debug) this.drawCollisionDebug(a, b, tolA, tolB, hit);
    }

    triggerCollision(e, now, a, b) {
        e.action?.(this.setup, a, b);
        e.lastTrigger = now;
        if (e.once) e.triggered = true;
    }

    triggerCollisionLeave(e, now, a, b) {
        if (e.onLeave && now - (e.lastTrigger ?? 0) >= (e.cooldown || 0)) {
            e.onLeave(this.setup, a, b);
            e.lastTrigger = now;
        }
    }

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
        if (!a || !b || typeof a.isColliding !== "function") return;
        const tolA = this.getDefaultTolerance(e.toleranceA);
        const tolB = this.getDefaultTolerance(e.toleranceB);
        const hit = a.isColliding(b, tolA, tolB);
        const key = !e.requireKey || this.setup.world.keyboard[e.requireKey];
        if (hit && key) this.updateHoldProgress(e, now, canTrigger, a, b);
        else this.cancelHold(e, a, b);
        if (this.debug) this.drawHoldDebug(e, a, b, tolA, tolB, hit);
    }

    updateHoldProgress(e, now, canTrigger, a, b) {
        if (!e.holdStart) e.holdStart = now;
        const elapsed = now - e.holdStart;
        e.progress = Math.min(elapsed / e.duration, 1);
        if (elapsed >= e.duration && canTrigger) {
            e.action?.(this.setup, a, b);
            e.lastTrigger = now;
            if (e.once) e.triggered = true;
        }
    }

    cancelHold(e, a, b) {
        if (e.progress > 0 && e.onCancel) e.onCancel(this.setup, a, b);
        e.holdStart = null;
        e.progress = 0;
    }

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

    drawHoldProgressCircle(ctx, e, objB) {
        const x = objB.x - this.getCameraX() + objB.width / 2;
        const y = objB.y - 40;
        const r = 20;
        ctx.beginPath();
        ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + e.progress * 2 * Math.PI);
        ctx.strokeStyle = this.debugColors.active;
        ctx.lineWidth = 4;
        ctx.stroke();
        if (e.requireKey) this.drawHoldKeyText(ctx, e, x, y);
    }

    drawHoldKeyText(ctx, e, x, y) {
        ctx.fillStyle = "white";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`Halte ${e.requireKey}`, x, y - 30);
    }
}