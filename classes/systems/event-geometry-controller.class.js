
/**
 * Controller responsible for event-related geometry handling and debugging.
 */
export class EventGeometryController {
    /**
     * Creates a new EventGeometryController instance.
     * @param {Object} setup Level or event setup reference.
     * @param {Object} debugColors Color configuration used for debug rendering.
     */
    constructor(setup, debugColors) {
        this.setup = setup;
        this.debugColors = debugColors;
        this.debug = false;
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
     * Creates a normalized bounding box.
     * @param {object} obj - The target object.
     * @param {object} [tol={}] - The tolerance values.
     * @returns {object} The normalized box.
     */
    getBox(obj, tol = {}) {
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
    drawBox(ctx, box, color) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(box.x, box.y, box.width, box.height);
        ctx.restore();
    }

    /**
     * Returns the render x-position of an object.
     * @param {Object} obj Object with position data.
     * @returns {number} X position of the object.
     */
    getObjX(obj) {
        if (!obj) return 0;
        if (typeof obj.getRenderX === "function") return obj.getRenderX();
        return obj.x ?? 0;
    }

    /**
     * Creates a proxy object for hitbox debugging.
     * @param {Object} obj Source object.
     * @param {Object} hitbox Hitbox offset data.
     * @returns {Object} Proxy object with overridden offset and render position.
     */
    makeHitboxDebugProxy(obj, hitbox) {
        if (!obj || !hitbox) return obj;
        return {
            ...obj,
            offset: hitbox,
            getRenderX: obj.getRenderX?.bind(obj) || (() => obj.x),
        };
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
        const boxA = this.getBox(a, tolA);
        const boxB = this.getBox(b, tolB);
        this.drawBox(ctx, boxA, hit ? this.debugColors.active : this.debugColors.hitA);
        this.drawBox(ctx, boxB, hit ? this.debugColors.active : this.debugColors.hitB);
        ctx.restore();
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
        const boxA = this.getBox(a, tolA);
        const boxB = this.getBox(b, tolB);
        this.drawBox(ctx, boxA, hit ? this.debugColors.active : this.debugColors.hitA);
        this.drawBox(ctx, boxB, hit ? this.debugColors.active : this.debugColors.hitB);
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
}