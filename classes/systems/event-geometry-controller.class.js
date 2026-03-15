
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
     * @param {Object} obj Target object.
     * @param {Object} [tol={}] Tolerance values.
     * @param {Object} [options={}] Bounding box options.
     * @returns {{x:number, y:number, width:number, height:number}} Normalized box.
     */
    getBox(obj, tol = {}, options = {}) {
        const raw = this.calculateRawBox(obj, tol, options);
        const norm = this.normalizeBox(raw);
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
     * Calculates the raw collision box of an object.
     * @param {Object} obj Target object.
     * @param {Object} [tol={}] Tolerance values.
     * @param {Object} [options={}] Calculation options.
     * @returns {Object} Raw collision box.
     */
    calculateRawBox(obj, tol = {}, options = {}) {
        const hb = this.getCollisionHitbox(obj, options.hitbox, options.useAttackHitbox);
        const x = this.getDebugX(obj);
        const t = this.getDefaultTolerance(tol);
        return this.buildRawCollisionBox(obj, hb, x, t);
    }

    /**
     * Returns the debug x position of an object.
     * @param {Object} obj Target object.
     * @returns {number} Debug x position.
     */
    getDebugX(obj) {
        if (!obj) return 0;
        if (typeof obj.getRenderX === "function") {
            return obj.getRenderX();
        }
        return obj.x ?? 0;
    }

    /**
     * Builds a raw collision box from hitbox and tolerance values.
     * @param {Object} obj Target object.
     * @param {Object} hb Hitbox definition.
     * @param {number} x Base x-position used for collision calculation.
     * @param {Object} t Normalized tolerance values.
     * @returns {{left:number, right:number, top:number, bottom:number}} Raw collision box.
     */
    buildRawCollisionBox(obj, hb, x, t) {
        const isFlipped = !!obj?.isFlipped;
        const left = isFlipped ? x + hb.right + t.x : x + hb.left + t.x;
        const right = isFlipped ? x + obj.width - hb.left - t.width : x + obj.width - hb.right - t.width;
        const top = obj.y + hb.top + t.y;
        const bottom = obj.y + obj.height - hb.bottom - t.height;
        return { left, right, top, bottom };
    }

    /**
     * Resolves the hitbox used for collision calculation.
     * @param {Object} obj Target object.
     * @param {Object} customHitbox Custom hitbox override.
     * @param {boolean} useAttackHitbox Whether to use the attack hitbox if active.
     * @returns {Object} Resolved hitbox.
     */
    getCollisionHitbox(obj, customHitbox, useAttackHitbox) {
        return customHitbox ??
            (useAttackHitbox && obj.attackHitbox?.active ? obj.attackHitbox : null) ??
            obj.offset ??
            { top: 0, left: 0, right: 0, bottom: 0 };
    }

    /**
     * Resolves the x-position used for collision calculations.
     * @param {Object} obj Target object.
     * @param {boolean} useAttackHitbox Whether to use the attack hitbox if active.
     * @returns {number} X position used for collision checks.
     */
    getCollisionX(obj, useAttackHitbox) {
        const shouldUseRenderX = !!(useAttackHitbox && obj.attackHitbox?.active);
        if (shouldUseRenderX && typeof obj.getRenderX === "function") {
            return obj.getRenderX();
        }
        return obj?.x ?? 0;
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
     * Returns the current camera x position.
     * @returns {number} Current camera x position.
     */
    getCameraX() {
        return this.setup?.world?.getCurrentController?.()?.renderCameraX
            ?? this.setup?.world?.camera_x
            ?? 0;
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
     * Draws collision debug boxes.
     * @param {Object} a First object.
     * @param {Object} b Second object.
     * @param {Object} tolA Tolerance for object A.
     * @param {Object} tolB Tolerance for object B.
     * @param {boolean} hit Collision state.
     * @param {Object} [optionsA={}] Collision options for object A.
     * @param {Object} [optionsB={}] Collision options for object B.
     */
    drawCollisionDebug(a, b, tolA, tolB, hit, optionsA = {}, optionsB = {}) {
        const ctx = this.setup.world.ctx;
        ctx.save();
        const boxA = this.getBox(a, tolA, optionsA);
        const boxB = this.getBox(b, tolB, optionsB);
        this.drawBox(ctx, boxA, hit ? this.debugColors.active : this.debugColors.hitA);
        this.drawBox(ctx, boxB, hit ? this.debugColors.active : this.debugColors.hitB);
        ctx.restore();
    }

    /**
     * Draws hold event debug visuals.
     * @param {Object} e Event object.
     * @param {Object} a First object.
     * @param {Object} b Second object.
     * @param {Object} tolA Tolerance for object A.
     * @param {Object} tolB Tolerance for object B.
     * @param {boolean} hit Collision state.
     * @param {Object} [optionsA={}] Collision options for object A.
     * @param {Object} [optionsB={}] Collision options for object B.
     */
    drawHoldDebug(e, a, b, tolA, tolB, hit, optionsA = {}, optionsB = {}) {
        const ctx = this.setup.world.ctx;
        ctx.save();
        const boxA = this.getBox(a, tolA, optionsA);
        const boxB = this.getBox(b, tolB, optionsB);
        this.drawBox(ctx, boxA, hit ? this.debugColors.active : this.debugColors.hitA);
        this.drawBox(ctx, boxB, hit ? this.debugColors.active : this.debugColors.hitB);
        if (e.progress > 0) {
            this.drawHoldProgressCircle(ctx, e, b, tolB, optionsB);
        }
        ctx.restore();
    }

    /**
     * Draws the hold progress circle above the target collision box.
     * @param {CanvasRenderingContext2D} ctx Canvas rendering context.
     * @param {Object} e Event object containing progress state.
     * @param {Object} objB Target object.
     * @param {Object} [tolB={}] Tolerance for object B.
     * @param {Object} [optionsB={}] Collision options for object B.
     */
    drawHoldProgressCircle(ctx, e, objB, tolB = {}, optionsB = {}) {
        if (!objB) return;
        const box = this.getBox(objB, tolB, optionsB);
        const x = box.x + box.width / 2;
        const y = box.y - 40;
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