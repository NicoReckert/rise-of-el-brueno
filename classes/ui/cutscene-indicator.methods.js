export const cutsceneIndicatorMethods = {
    /**
     * Hides touch controls.
     * @returns {void}
     */
    hideTouchControls() {
        this.touchControlsElement?.classList.add("touch-controls-cutscene-hidden");
    },

    /**
     * Shows touch controls.
     * @returns {void}
     */
    showTouchControls() {
        this.touchControlsElement?.classList.remove("touch-controls-cutscene-hidden");
    },

    /**
     * Binds panel touch events.
     * @returns {void}
     */
    bindPanelTouch() {
        if (!this.canvas || this.panelTouchBound) return;
        this.canvas.addEventListener("touchstart", this.boundHandlePanelTouch, { passive: false });
        this.canvas.addEventListener("mousedown", this.boundHandlePanelTouch);
        this.panelTouchBound = true;
    },

    /**
     * Unbinds panel touch events.
     * @returns {void}
     */
    unbindPanelTouch() {
        if (!this.canvas || !this.panelTouchBound) return;
        this.canvas.removeEventListener("touchstart", this.boundHandlePanelTouch);
        this.canvas.removeEventListener("mousedown", this.boundHandlePanelTouch);
        this.panelTouchBound = false;
    },

    /**
     * Handles panel touch input.
     * @param {Event} event Input event.
     * @returns {void}
     */
    handlePanelTouch(event) {
        if (!this.active || !this.showSkip || !this.canvas) return;
        const point = this.getPointerPosition(event);
        if (!point) return;
        const metrics = this.getPanelMetricsFromCanvas(this.canvas);
        if (!this.isPointInsideTriangle(point, metrics.panel)) return;
        event.preventDefault();
        this.triggerSkipKey();
    },

    /**
     * Triggers the skip key.
     * @returns {void}
     */
    triggerSkipKey() {
        const keyboard = this.world?.keyboard;
        if (!keyboard) return;
        if (typeof keyboard.triggerVirtualKeyPress === "function") {
            keyboard.triggerVirtualKeyPress("x");
            return;
        }
        keyboard.X = true;
        setTimeout(() => { keyboard.X = false; }, 120);
    },

    /**
     * Returns the pointer position relative to the canvas.
     * @param {Event} event Input event.
     * @returns {{x: number, y: number} | null} Pointer position or null.
     */
    getPointerPosition(event) {
        const rect = this.canvas.getBoundingClientRect();
        const point = this.getPointerClientPosition(event);
        if (!point) return null;
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        return { x: (point.x - rect.left) * scaleX, y: (point.y - rect.top) * scaleY };
    },

    /**
     * Returns the client pointer position from an input event.
     * @param {Event} event Input event.
     * @returns {{x: number, y: number} | null} Client pointer position or null.
     */
    getPointerClientPosition(event) {
        if (event.touches?.length) {
            return { x: event.touches[0].clientX, y: event.touches[0].clientY };
        }
        if (typeof event.clientX === "number" && typeof event.clientY === "number") {
            return { x: event.clientX, y: event.clientY };
        }
        return null;
    },

    /**
     * Checks whether a point is inside a triangle.
     * @param {{x: number, y: number}} point Point data.
     * @param {Object} triangle Triangle data.
     * @returns {boolean} True if the point is inside the triangle, otherwise false.
     */
    isPointInsideTriangle(point, triangle) {
        const a = triangle.bottomLeft;
        const b = triangle.topLeft;
        const c = triangle.tipRight;
        const area = (p1, p2, p3) =>
            (p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y)) / 2;
        const A = Math.abs(area(a, b, c));
        const A1 = Math.abs(area(point, b, c));
        const A2 = Math.abs(area(a, point, c));
        const A3 = Math.abs(area(a, b, point));
        return Math.abs(A - (A1 + A2 + A3)) < 0.5;
    },

    /**
     * Returns panel metrics.
     * @param {CanvasRenderingContext2D} ctx Canvas context.
     * @returns {*} Panel metrics.
     */
    getPanelMetrics(ctx) {
        return this.getPanelMetricsFromCanvas(ctx.canvas);
    },

    /**
     * Returns panel metrics for a canvas.
     * @param {HTMLCanvasElement} canvas Canvas element.
     * @returns {{H: number, panel: *, accent: *, iconAnchor: {x: number, y: number}}} Panel metrics.
     */
    getPanelMetricsFromCanvas(canvas) {
        const H = canvas.height;
        return {
            H,
            panel: this.buildPanelTriangle(H),
            accent: this.buildPanelAccent(H),
            iconAnchor: { x: 27, y: H - 38 }
        };
    },

    /**
     * Builds the panel triangle.
     * @param {number} H Canvas height.
     * @returns {{bottomLeft: {x: number, y: number}, topLeft: {x: number, y: number}, tipRight: {x: number, y: number}}} Triangle data.
     */
    buildPanelTriangle(H) {
        const panelWidth = 92;
        const panelHeight = 112;
        return {
            bottomLeft: { x: 0, y: H },
            topLeft: { x: 0, y: H - panelHeight },
            tipRight: { x: panelWidth, y: H }
        };
    },

    /**
     * Builds the accent area coordinates for the panel.
     * @param {number} H Canvas height.
     * @returns {{start: {x: number, y: number}, end: {x: number, y: number}}} Accent area coordinates.
     */
    buildPanelAccent(H) {
        const panelWidth = 92;
        const panelHeight = 112;
        return {
            start: { x: 10, y: H - panelHeight + 18 },
            end: { x: panelWidth - 12, y: H - 10 }
        };
    },

    /**
     * Draws the triangle panel.
     * @param {CanvasRenderingContext2D} ctx Canvas context.
     * @param {Object} metrics Panel metrics.
     * @returns {void}
     */
    drawTriangle(ctx, metrics) {
        const { H, panel } = metrics;
        const colors = this.getTriangleColors();
        ctx.save();
        this.traceTrianglePath(ctx, panel);
        this.fillTriangleGradient(ctx, panel, H, colors);
        this.fillTriangleGlow(ctx, H, colors);
        this.strokeTriangle(ctx, colors);
        ctx.restore();
    },

    /**
     * Returns triangle color configuration.
     * @returns {{dark: string, mid: string, light: string, edge: string, glow: string}} Color values.
     */
    getTriangleColors() {
        return {
            dark: "rgba(18, 48, 110, 0.96)",
            mid: "rgba(45, 118, 220, 0.94)",
            light: "rgba(155, 220, 255, 0.50)",
            edge: "rgba(242, 248, 255, 0.95)",
            glow: "rgba(110, 205, 255, 0.22)"
        };
    },

    /**
     * Traces the triangle path.
     * @param {CanvasRenderingContext2D} ctx Canvas context.
     * @param {Object} panel Triangle panel data.
     * @returns {void}
     */
    traceTrianglePath(ctx, panel) {
        ctx.beginPath();
        ctx.moveTo(panel.bottomLeft.x, panel.bottomLeft.y);
        ctx.lineTo(panel.topLeft.x, panel.topLeft.y);
        ctx.lineTo(panel.tipRight.x, panel.tipRight.y);
        ctx.closePath();
    },

    /**
     * Fills the triangle with a gradient.
     * @param {CanvasRenderingContext2D} ctx Canvas context.
     * @param {Object} panel Triangle panel data.
     * @param {number} H Canvas height.
     * @param {Object} colors Color configuration.
     * @returns {void}
     */
    fillTriangleGradient(ctx, panel, H, colors) {
        const gradient = ctx.createLinearGradient(
            panel.bottomLeft.x,
            H - 108,
            panel.tipRight.x,
            H
        );
        gradient.addColorStop(0, colors.dark);
        gradient.addColorStop(0.45, colors.mid);
        gradient.addColorStop(0.82, colors.light);
        gradient.addColorStop(1, "rgba(255,255,255,0.20)");
        ctx.fillStyle = gradient;
        ctx.fill();
    },

    /**
     * Fills the triangle with a glow effect.
     * @param {CanvasRenderingContext2D} ctx Canvas context.
     * @param {number} H Canvas height.
     * @param {Object} colors Color configuration.
     * @returns {void}
     */
    fillTriangleGlow(ctx, H, colors) {
        const glow = ctx.createRadialGradient(18, H - 18, 2, 18, H - 18, 56);
        glow.addColorStop(0, colors.glow);
        glow.addColorStop(1, "rgba(110,205,255,0)");
        ctx.fillStyle = glow;
        ctx.fill();
    },

    /**
     * Strokes the triangle outline.
     * @param {CanvasRenderingContext2D} ctx Canvas context.
     * @param {Object} colors Color configuration.
     * @returns {void}
     */
    strokeTriangle(ctx, colors) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = colors.edge;
        ctx.shadowColor = "rgba(120,210,255,0.32)";
        ctx.shadowBlur = 10;
        ctx.stroke();
    },

    /**
     * Draws the accent line.
     * @param {CanvasRenderingContext2D} ctx Canvas context.
     * @param {Object} metrics Panel metrics.
     * @returns {void}
     */
    drawAccentLine(ctx, metrics) {
        const { accent } = metrics;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(accent.start.x, accent.start.y);
        ctx.lineTo(accent.end.x, accent.end.y);
        ctx.strokeStyle = "rgba(255,255,255,0.14)";
        ctx.lineWidth = 1.2;
        ctx.shadowColor = "rgba(180,220,255,0.18)";
        ctx.shadowBlur = 4;
        ctx.stroke();
        ctx.restore();
    },

    /**
     * Draws the icon.
     * @param {CanvasRenderingContext2D} ctx Canvas context.
     * @param {number} pulse Pulse factor.
     * @param {Object} metrics Panel metrics.
     * @returns {void}
     */
    drawIcon(ctx, pulse, metrics) {
        const now = performance.now();
        const { iconAnchor } = metrics;
        const iconState = this.getIconState(now);
        if (!iconState?.icon?.complete) return;
        ctx.save();
        this.setupIconTransform(ctx, iconAnchor, pulse, iconState);
        this.drawIconImage(ctx, iconState);
        ctx.restore();
    },

    /**
     * Sets up the icon transform.
     * @param {CanvasRenderingContext2D} ctx Canvas context.
     * @param {{x: number, y: number}} iconAnchor Icon anchor position.
     * @param {number} pulse Pulse factor.
     * @param {Object} iconState Icon state.
     * @returns {void}
     */
    setupIconTransform(ctx, iconAnchor, pulse, iconState) {
        ctx.translate(iconAnchor.x, iconAnchor.y);
        ctx.globalAlpha = iconState.alpha;
        const scale = 1 + pulse * 0.03;
        ctx.scale(scale, scale);
        ctx.shadowColor = "rgba(0, 0, 0, 0.24)";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;
        if ("filter" in ctx) ctx.filter = "brightness(1.12) contrast(1.1)";
    },

    /**
     * Draws the icon image.
     * @param {CanvasRenderingContext2D} ctx Canvas context.
     * @param {Object} iconState Icon state.
     * @returns {void}
     */
    drawIconImage(ctx, iconState) {
        ctx.drawImage(
            iconState.icon,
            -iconState.size / 2,
            -iconState.size / 2,
            iconState.size,
            iconState.size
        );
    },

    /**
     * Returns the current icon state.
     * @param {number} now Current timestamp.
     * @returns {*} Icon state.
     */
    getIconState(now) {
        if (!this.showSkip) return this.getPlayIconState(now);
        return this.getCyclingIconState(now);
    },

    /**
     * Returns the play icon state.
     * @param {number} now Current timestamp.
     * @returns {{icon: *, size: number, alpha: number}} Icon state.
     */
    getPlayIconState(now) {
        const local = (now % this.iconInterval) / this.iconInterval;
        return {
            icon: this.playIcon,
            size: 100,
            alpha: this.getSoftFade(local)
        };
    },

    /**
     * Returns the cycling icon state.
     * @param {number} now Current timestamp.
     * @returns {{icon: *, size: number, alpha: number}} Icon state.
     */
    getCyclingIconState(now) {
        const total = this.iconInterval * 2;
        const cycle = now % total;
        const local = (cycle % this.iconInterval) / this.iconInterval;
        const alpha = this.getSoftFade(local);
        if (cycle < this.iconInterval) return { icon: this.playIcon, size: 100, alpha };
        return { icon: this.skipIcon, size: 60, alpha };
    },

    /**
     * Returns a soft fade value.
     * @param {number} t Normalized time value.
     * @returns {number} Fade value.
     */
    getSoftFade(t) {
        return Math.pow(Math.sin(t * Math.PI), 1.15);
    }
};