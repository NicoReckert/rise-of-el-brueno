class EventManager {
    constructor(setup) {
        this.setup = setup;
        this.events = [];
        this.startTime = performance.now();
    }

    add(event) {
        this.events.push({
            triggered: false,
            once: true,          // Standard: nur einmal
            lastTrigger: 0,      // für cooldown nötig
            ...event
        });
    }

    update() {
        const now = performance.now();
        const elapsed = now - this.startTime;

        this.events.forEach(element => {
            if (element.triggered) return;

            const canTrigger = !element.cooldown || now - element.lastTrigger >= element.cooldown;

            const target = element.target
                ? this.setup.npcs[element.target] ?? this.setup.world[element.target]
                : this.setup.world.charakter;

            switch (element.type) {
                case "time": {
                    const start = element.from ?? element.delay ?? 0;
                    const end = element.to ?? Infinity;

                    if (elapsed >= start && elapsed <= end && canTrigger) {
                        element.action(this.setup);
                        element.lastTrigger = now;
                        if (element.once) element.triggered = true;
                    }
                    break;
                }

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
                        typeof target.isColliding === "function" &&
                        target.isColliding(areaBox) &&
                        (!element.requireKey || this.setup.world.keyboard[element.requireKey]);

                    if (inArea && canTrigger) {
                        element.action(this.setup, target);
                        element.lastTrigger = now;
                        if (element.once) element.triggered = true;
                    }

                    // --- Debug zeichnen ---
                    if (this.debug) {
                        const ctx = this.setup.world.ctx;
                        ctx.save();

                        // Trigger-Bereich
                        ctx.strokeStyle = inArea ? "lime" : "red";
                        ctx.lineWidth = 2;
                        ctx.strokeRect(
                            areaBox.x - this.setup.world.camera_x,
                            areaBox.y,
                            areaBox.width,
                            areaBox.height
                        );

                        // Target-Hitbox
                        if (target) {
                            const tLeft = target.isFlipped
                                ? target.x + target.offset.right
                                : target.x + target.offset.left;
                            const tRight = target.isFlipped
                                ? target.x + target.width - target.offset.left
                                : target.x + target.width - target.offset.right;
                            const tTop = target.y + target.offset.top;
                            const tBottom = target.y + target.height - target.offset.bottom;

                            ctx.strokeStyle = "blue"; // Hitbox vom Character oder NPC
                            ctx.strokeRect(
                                tLeft - this.setup.world.camera_x,
                                tTop,
                                tRight - tLeft,
                                tBottom - tTop
                            );
                        }

                        ctx.restore();
                    }
                    break;
                }

                case "quest": {
                    if (this.setup.questManager?.step === element.step && canTrigger) {
                        element.action(this.setup);
                        element.lastTrigger = now;
                        if (element.once) element.triggered = true;
                    }
                    break;
                }

                case "input": {
                    if (this.setup.world.keyboard[element.key] && canTrigger) {
                        element.action(this.setup);
                        element.lastTrigger = now;
                        if (element.once) element.triggered = true;
                    }
                    break;
                }
            }
        });
    }
}

