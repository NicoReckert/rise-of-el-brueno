export const townBottleThrowHelperMethods = {
    /**
     * Tries to start a bottle throw.
     * @param {Object} setup Setup object.
     * @param {number} progress Throw progress value.
     * @returns {void}
     */
    tryStartBottleThrow(setup, progress) {
        const world = setup.world;
        const c = world.character;
        if (!progress || progress < 0.08) return;
        if (!townHelper.canStartBottleThrow(world, c)) {
            townHelper.handleEmptyBottleThrow(world, c);
            return;
        }
        townHelper.startBottleThrowAnimation(setup, c, progress);
        townHelper.consumeBottleForThrow(setup, c);
    },

    /**
     * Checks whether a bottle throw can be started.
     * @param {Object} world World object.
     * @param {Object} c Character object.
     * @returns {boolean} True if a bottle throw can be started, otherwise false.
     */
    canStartBottleThrow(world, c) {
        const noMoveInput = !world.keyboard.LEFT && !world.keyboard.RIGHT;
        const throwIsIdle = !c.isThrowing
            && (c.currentAnimation !== "throw" || c.animationFinished);
        return !c.isThrowing
            && noMoveInput
            && (c.throwableBottles ?? 0) > 0
            && !c.isAttack
            && !c.isProtect
            && throwIsIdle;
    },

    /**
     * Handles an empty bottle throw attempt.
     * @param {Object} world World object.
     * @param {Object} c Character object.
     * @returns {void}
     */
    handleEmptyBottleThrow(world, c) {
        if ((c.throwableBottles ?? 0) === 0) {
            world.audioManager.playOneShot("bottleEmptySfx", { volume: 0.6 });
        }
    },

    /**
     * Starts the bottle throw animation.
     * @param {Object} setup Setup object.
     * @param {Object} c Character object.
     * @param {number} progress Throw progress value.
     * @returns {void}
     */
    startBottleThrowAnimation(setup, c, progress) {
        setup.pendingThrowCharge = Math.min(Math.max(progress, 0), 1);
        c.isThrowing = true;
        c.currentAnimation = "throw";
        c.frameIndex = 0;
        c.sheetIndex = 0;
        c.animationFinished = false;
        c.lastFrameTime = null;
        c.deferSizeUpdate = true;
        c._thrownThisAnim = false;
    },

    /**
     * Consumes one bottle for a throw.
     * @param {Object} setup Setup object.
     * @param {Object} c Character object.
     * @returns {void}
     */
    consumeBottleForThrow(setup, c) {
        const bar = setup.bottleBar;
        if (bar) {
            bar.percentage = Math.max((bar.percentage ?? 0) - 20, 0);
            bar.setPercentage(bar.percentage);
        }
        c.throwableBottles = Math.max((c.throwableBottles ?? 0) - 1, 0);
    },

    /**
     * Renders the bottle throw charge indicator.
     * @param {Object} setup Setup object.
     * @returns {void}
     */
    renderBottleThrowChargeIndicator(setup) {
        const c = setup.world.character;
        const world = setup.world;
        if (!townHelper.canRenderThrowChargeIndicator(setup, c, world)) return;
        const p = setup.state.throwHoldProgress ?? 0;
        const ctx = world.ctx;
        const indicator = townHelper.getThrowChargeIndicatorData(setup, c, p);
        if (!indicator) return;
        townHelper.drawThrowChargeRing(ctx, indicator, p);
        townHelper.handleThrowChargeTick(setup, p);
        townHelper.drawThrowChargeParticles(ctx, indicator, p);
    },

    /**
     * Checks whether the bottle throw charge indicator can be rendered.
     * @param {Object} setup Setup object.
     * @param {Object} c Character object.
     * @param {Object} world World object.
     * @returns {boolean} True if the bottle throw charge indicator can be rendered, otherwise false.
     */
    canRenderThrowChargeIndicator(setup, c, world) {
        if (!c) return false;
        if ((c.throwableBottles ?? 0) <= 0) return false;
        if (world.keyboard.LEFT || world.keyboard.RIGHT) return false;
        return (setup.state.throwHoldProgress ?? 0) > 0;
    },

    /**
     * Gets the bottle throw charge indicator data.
     * @param {Object} setup Setup object.
     * @param {Object} char Character object.
     * @param {number} p Charge progress value.
     * @returns {Object} Bottle throw charge indicator data.
     */
    getThrowChargeIndicatorData(setup, char, p) {
        const camX = setup.world.townLevelController.renderCameraX;
        const hb = char.getHitboxRect?.();
        const headY = hb ? hb.top : char.y;
        const headX = hb ? hb.cx : (char.x + char.width * 0.5);
        const full = p >= 1;
        return {
            x: headX - camX,
            y: headY - 40,
            r: 18,
            full,
            pulse: full ? (0.85 + 0.15 * Math.sin(performance.now() / 90)) : 1
        };
    },

    /**
     * Draws the bottle throw charge ring.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {Object} indicator Bottle throw charge indicator data.
     * @param {number} p Charge progress value.
     * @returns {void}
     */
    drawThrowChargeRing(ctx, indicator, p) {
        const { x, y, r, pulse } = indicator;
        ctx.save();
        townHelper.drawThrowChargeGlow(ctx, x, y, r, pulse);
        townHelper.drawThrowChargeOutline(ctx, x, y, r);
        townHelper.drawThrowChargeProgress(ctx, x, y, r, p, pulse);
        townHelper.drawThrowChargeCenter(ctx, x, y);
        ctx.restore();
    },

    /**
     * Draws the bottle throw charge glow.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} x X position.
     * @param {number} y Y position.
     * @param {number} r Radius.
     * @param {number} pulse Pulse value.
     * @returns {void}
     */
    drawThrowChargeGlow(ctx, x, y, r, pulse) {
        ctx.globalAlpha = 0.18 * pulse;
        ctx.beginPath();
        ctx.arc(x, y, r + 6, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.globalAlpha = 0.30;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.strokeStyle = "white";
        ctx.stroke();
    },

    /**
     * Draws the bottle throw charge progress.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} x X position.
     * @param {number} y Y position.
     * @param {number} r Radius.
     * @param {number} p Charge progress value.
     * @param {number} pulse Pulse value.
     * @returns {void}
     */
    drawThrowChargeProgress(ctx, x, y, r, p, pulse) {
        ctx.globalAlpha = 0.95 * pulse;
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + p * 2 * Math.PI);
        ctx.strokeStyle = "white";
        ctx.stroke();
    },

    /**
     * Draws the bottle throw charge outline.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} x X position.
     * @param {number} y Y position.
     * @param {number} r Radius.
     * @returns {void}
     */
    drawThrowChargeOutline(ctx, x, y, r) {
        ctx.globalAlpha = 0.30;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.strokeStyle = "white";
        ctx.stroke();
    },

    /**
     * Draws the bottle throw charge center.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} x X position.
     * @param {number} y Y position.
     * @returns {void}
     */
    drawThrowChargeCenter(ctx, x, y) {
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();
    },

    /**
     * Handles the bottle throw charge tick.
     * @param {Object} setup Setup object.
     * @param {number} p Charge progress value.
     * @returns {void}
     */
    handleThrowChargeTick(setup, p) {
        const full = p >= 1;
        if (full && !setup._throwChargeTicked) {
            setup._throwChargeTicked = true;
            setup.world.audioManager.playOneShot("chargeTickSound", { volume: 0.6 });
        }
        if (!full) setup._throwChargeTicked = false;
    },

    /**
     * Draws the bottle throw charge particles.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {Object} indicator Bottle throw charge indicator data.
     * @param {number} p Charge progress value.
     * @returns {void}
     */
    drawThrowChargeParticles(ctx, indicator, p) {
        const t = performance.now() / 1000;
        const n = 6;
        const baseR = indicator.r + 10;
        const wobble = 2.5;
        ctx.save();
        ctx.globalAlpha = 0.75 * indicator.pulse;
        ctx.fillStyle = "white";
        for (let i = 0; i < n; i++) {
            townHelper.drawThrowChargeParticle(ctx, indicator, i, n, t, baseR, wobble);
        }
        ctx.restore();
    },

    /**
     * Draws a bottle throw charge particle.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {Object} indicator Bottle throw charge indicator data.
     * @param {number} i Particle index.
     * @param {number} n Total particle count.
     * @param {number} t Time value.
     * @param {number} baseR Base radius.
     * @param {number} wobble Wobble amount.
     * @returns {void}
     */
    drawThrowChargeParticle(ctx, indicator, i, n, t, baseR, wobble) {
        const a = (i / n) * Math.PI * 2 + t * 1.6;
        const rr = baseR + Math.sin(t * 3 + i) * wobble;
        const px = indicator.x + Math.cos(a) * rr;
        const py = indicator.y + Math.sin(a) * rr;
        const s = 1.6 + 0.8 * Math.sin(t * 4 + i * 2);
        ctx.beginPath();
        ctx.arc(px, py, Math.max(0.8, s), 0, 2 * Math.PI);
        ctx.fill();
    }
};