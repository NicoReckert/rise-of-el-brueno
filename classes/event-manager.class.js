class EventManager {
    constructor(setup, questManager) {
        this.setup = setup;
        this.events = [];
        this.startTime = performance.now();
        this.questManager = questManager;
    }

    resolveTarget(name) {
        if (!name) return null;

        const pools = [
            this.setup.world,
            this.setup.npcs,
            this.setup.enemies,
            this.setup.bosses,
            this.setup.throwables,
            this.setup.items,
            this.setup
        ];

        for (const pool of pools) {
            if (pool && pool[name]) {
                return pool[name];
            }
        }
        return null;
    }

    add(event) {
        this.events.push({
            triggered: false,
            once: true,
            lastTrigger: 0,
            lastLeave: 0, // neu für cooldown bei onLeave
            ...event
        });
    }

    emit(eventName) {
        this.events.forEach(e => {
            if (e.resetOn === eventName) {
                e._resetFlag = true;
            }
        });
    }

    emitNow(eventName) {
        const now = performance.now();
        this.events.forEach(e => {
            if (e.resetOn === eventName) {
                this.resetEvent(e, now); // sofort resetten
            }
        });
    }

    resetEvent(element, now) {
        element.startAt = now;
        element.triggered = false;
        element._ended = false;
        element._resetFlag = false;
    }

    resetEventByName(name) {
        const event = this.events.find(e => e.name === name);
        if (event) {
            this.resetEvent(event, performance.now());
        }
    }

    // Hilfsfunktion: Hitbox berechnen + NORMALISIEREN
    _getBox(obj, tol = { x: 0, y: 0, width: 0, height: 0 }) {
        // robuste Defaults
        const off = obj.offset || { left: 0, right: 0, top: 0, bottom: 0 };
        const t = {
            x: tol.x ?? 0,
            y: tol.y ?? 0,
            width: tol.width ?? 0,
            height: tol.height ?? 0
        };

        // Rohwerte (un-normalisiert)
        let left = obj.isFlipped
            ? obj.x + off.right + t.x
            : obj.x + off.left + t.x;

        let right = obj.isFlipped
            ? obj.x + obj.width - off.left - t.width
            : obj.x + obj.width - off.right - t.width;

        let top = obj.y + off.top + t.y;
        let bottom = obj.y + obj.height - off.bottom - t.height;

        // NORMALISIEREN: sicherstellen, dass left<=right & top<=bottom
        const normLeft = Math.min(left, right);
        const normRight = Math.max(left, right);
        const normTop = Math.min(top, bottom);
        const normBottom = Math.max(top, bottom);

        const camX = (this.setup && this.setup.world) ? this.setup.world.camera_x : 0;

        return {
            x: normLeft - camX,
            y: normTop,
            width: Math.max(0.001, normRight - normLeft),
            height: Math.max(0.001, normBottom - normTop)
        };
    }

    // Hilfsfunktion: Hitbox zeichnen (immer!)
    _drawBox(ctx, box, color) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(box.x, box.y, box.width, box.height);
        ctx.restore();
    }


    update() {
        const now = performance.now();

        this.events.forEach(element => {
            if (element.triggered) return;

            // Step-Check
            if (element.step !== undefined && this.questManager?.step !== element.step) {
                return;
            }

            // Condition-Check
            if (element.condition && !element.condition(this.setup)) {
                return;
            }

            const canTrigger = !element.cooldown || now - element.lastTrigger >= element.cooldown;
            const objA = element.objectA ? this.resolveTarget(element.objectA) : this.setup.world.character;
            const objB = element.objectB ? this.resolveTarget(element.objectB) : null;

            switch (element.type) {
                // --- Zeitbasiert ---
                case "time": {
                    if (element.startAt === undefined || element._lastStep !== this.questManager?.step) {
                        element.startAt = now;
                        element._lastStep = this.questManager?.step;
                    } if (element._resetFlag) this.resetEvent(element, now);

                    const elapsedTime = now - element.startAt;
                    element.progress = element.to
                        ? Math.min(elapsedTime / (element.to - (element.from ?? 0)), 1)
                        : Math.min(elapsedTime / (element.delay ?? 1), 1);

                    const start = element.from ?? element.delay ?? 0;
                    const end = element.to ?? Infinity;

                    if (elapsedTime >= start && elapsedTime <= end && canTrigger) {
                        if (element.action) element.action(this.setup, elapsedTime, element.progress);
                        element.lastTrigger = now;
                        if (element.once && !element.repeat) element.triggered = true;
                    }

                    if (elapsedTime > end) {
                        if (!element._ended && element.onEnd) {
                            element.onEnd(this.setup);
                            element._ended = true;
                        }
                        if (element.repeat) this.resetEvent(element, now);
                    }
                    break;
                }

                // --- Position ---
                case "position": {
                    const areaBox = {
                        x: element.area.x,
                        y: element.area.y ?? 0,
                        width: element.area.width ?? 50,
                        height: element.area.height ?? this.setup.world.canvas.height,
                        offset: { top: 0, left: 0, right: 0, bottom: 0 },
                        isFlipped: false
                    };

                    const inArea =
                        typeof objA?.isColliding === "function" &&
                        objA.isColliding(areaBox) &&
                        (!element.requireKey || this.setup.world.keyboard[element.requireKey]);

                    if (inArea && canTrigger) {
                        if (element.action) element.action(this.setup, objA);
                        element.lastTrigger = now;
                        if (element.once) element.triggered = true;
                    } else if (!inArea && element.onLeave) {
                        if (!element.cooldown || now - element.lastLeave >= element.cooldown) {
                            element.onLeave(this.setup, objA);
                            element.lastLeave = now;
                        }
                    }

                    // Debug
                    if (this.debug) {
                        const ctx = this.setup.world.ctx;
                        ctx.save();
                        ctx.strokeStyle = inArea ? "lime" : "red";
                        ctx.lineWidth = 2;
                        ctx.strokeRect(
                            areaBox.x - this.setup.world.camera_x,
                            areaBox.y,
                            areaBox.width,
                            areaBox.height
                        );
                        ctx.restore();
                    }
                    break;
                }

                // --- Quest ---
                case "quest": {
                    if (canTrigger) {
                        if (element.action) element.action(this.setup);
                        element.lastTrigger = now;
                        if (element.once) element.triggered = true;
                    }
                    break;
                }

                // --- Input ---
                case "input": {
                    if (this.setup.world.keyboard[element.key] && canTrigger) {
                        if (element.action) element.action(this.setup);
                        element.lastTrigger = now;
                        if (element.once) element.triggered = true;
                    }
                    break;
                }

                // --- Collision ---
                case "collision": {
                    if (!objA || !objB || typeof objA.isColliding !== "function") break;

                    const toleranceA = element.toleranceA || { x: 0, y: 0, width: 0, height: 0 };
                    const toleranceB = element.toleranceB || { x: 0, y: 0, width: 0, height: 0 };

                    const colliding = objA.isColliding(objB, toleranceA, toleranceB);
                    const keyDown = !element.requireKey || this.setup.world.keyboard[element.requireKey];

                    if (colliding && keyDown && canTrigger) {
                        if (element.action) element.action(this.setup, objA, objB);
                        element.lastTrigger = now;
                        if (element.once) element.triggered = true;
                    } else if (!colliding && element.onLeave) {
                        // Cooldown auch für onLeave berücksichtigen
                        if (now - element.lastTrigger >= (element.cooldown || 0)) {
                            element.onLeave(this.setup, objA, objB);
                            element.lastTrigger = now;
                        }
                    }

                    // --- Debug ---
                    if (this.debug) {
                        const ctx = this.setup.world.ctx;
                        ctx.save();

                        const a = this._getBox(objA, toleranceA);
                        const b = this._getBox(objB, toleranceB);

                        this._drawBox(ctx, a, colliding ? "lime" : "blue");
                        this._drawBox(ctx, b, colliding ? "lime" : "orange");

                        ctx.restore();
                    }
                    break;
                }
                // --- Hold ---
                case "hold": {
                    if (!objA || !objB || typeof objA.isColliding !== "function") break;

                    const toleranceA = element.toleranceA || { x: 0, y: 0, width: 0, height: 0 };
                    const toleranceB = element.toleranceB || { x: 0, y: 0, width: 0, height: 0 };

                    const colliding = objA.isColliding(objB, toleranceA, toleranceB);
                    const keyDown = !element.requireKey || this.setup.world.keyboard[element.requireKey];

                    if (colliding && keyDown) {
                        if (!element.holdStart) element.holdStart = now;

                        const elapsedHold = now - element.holdStart;
                        element.progress = Math.min(elapsedHold / element.duration, 1);

                        if (elapsedHold >= element.duration && canTrigger) {
                            if (element.action) element.action(this.setup, objA, objB);
                            element.lastTrigger = now;
                            if (element.once) element.triggered = true;
                        }
                    } else {
                        if (element.progress > 0 && element.onCancel) {
                            element.onCancel(this.setup, objA, objB);
                        }
                        element.holdStart = null;
                        element.progress = 0;
                    }

                    // --- Debug ---
                    if (this.debug) {
                        const ctx = this.setup.world.ctx;
                        ctx.save();

                        const a = this._getBox(objA, toleranceA);
                        const b = this._getBox(objB, toleranceB);

                        this._drawBox(ctx, a, colliding ? "lime" : "blue");
                        this._drawBox(ctx, b, colliding ? "lime" : "orange");

                        if (element.progress > 0) {
                            const x = objB.x - this.setup.world.camera_x + objB.width / 2;
                            const y = objB.y - 40;
                            const radius = 20;

                            ctx.beginPath();
                            ctx.arc(x, y, radius, -Math.PI / 2, -Math.PI / 2 + element.progress * 2 * Math.PI);
                            ctx.strokeStyle = "lime";
                            ctx.lineWidth = 4;
                            ctx.stroke();

                            if (element.requireKey) {
                                ctx.fillStyle = "white";
                                ctx.font = "14px Arial";
                                ctx.textAlign = "center";
                                ctx.fillText(`Halte ${element.requireKey}`, x, y - 30);
                            }
                        }

                        ctx.restore();
                    }
                    break;
                }
            }
        });
    }
}
