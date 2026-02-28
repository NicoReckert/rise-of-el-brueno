/**
 * Single ribbon ("smoky energy strand") in the sky.
 */
class DarkRibbon {
    constructor(worldWidth, worldHeight, opts = {}) {
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;

        this.opts = {
            yMin: 0,
            yMax: worldHeight * 0.55,     // nur Himmelbereich
            minLen: 220,
            maxLen: 520,
            minWidth: 2,
            maxWidth: 7,
            speedMin: 0.25,
            speedMax: 0.8,
            wobbleAmpMin: 8,
            wobbleAmpMax: 26,
            wobbleFreqMin: 0.010,
            wobbleFreqMax: 0.028,
            alphaMin: 0.05,
            alphaMax: 0.16,
            ...opts
        };

        this.reset(true);
    }

    reset(initial = false) {
        const o = this.opts;

        this.len = o.minLen + Math.random() * (o.maxLen - o.minLen);
        this.baseWidth = o.minWidth + Math.random() * (o.maxWidth - o.minWidth);

        this.x = initial
            ? Math.random() * this.worldWidth
            : this.worldWidth + 50 + Math.random() * this.worldWidth * 0.4;

        this.y = o.yMin + Math.random() * (o.yMax - o.yMin);

        this.speedX = -(o.speedMin + Math.random() * (o.speedMax - o.speedMin));

        this.amp = o.wobbleAmpMin + Math.random() * (o.wobbleAmpMax - o.wobbleAmpMin);
        this.freq = o.wobbleFreqMin + Math.random() * (o.wobbleFreqMax - o.wobbleFreqMin);

        this.alpha = o.alphaMin + Math.random() * (o.alphaMax - o.alphaMin);
        this.phase = Math.random() * Math.PI * 2;

        // leichte Neigung nach unten/oben (windig)
        this.slope = (Math.random() - 0.5) * 0.25;
    }

    update(time, cameraX, viewportW) {
        this.x += this.speedX;
        this.phase += 0.015;
        this.pulse = 0.75 + Math.sin(time * 0.0018 + this.phase) * 0.25;

        // Kamera-basiert: wenn Ribbon weit links aus dem View raus ist -> rechts neu spawnen
        const leftKill = cameraX - this.len - 250;
        if (this.x < leftKill) {
            this.x = cameraX + viewportW + 200 + Math.random() * 400;
            this.y = this.opts.yMin + Math.random() * (this.opts.yMax - this.opts.yMin);

            // optional: bei Respawn leicht neu randomisieren (macht weniger repetitiv)
            const o = this.opts;
            this.len = o.minLen + Math.random() * (o.maxLen - o.minLen);
            this.baseWidth = o.minWidth + Math.random() * (o.maxWidth - o.minWidth);
            this.amp = o.wobbleAmpMin + Math.random() * (o.wobbleAmpMax - o.wobbleAmpMin);
            this.freq = o.wobbleFreqMin + Math.random() * (o.wobbleFreqMax - o.wobbleFreqMin);
            this.alpha = o.alphaMin + Math.random() * (o.alphaMax - o.alphaMin);
            this.slope = (Math.random() - 0.5) * 0.6;
        }
    }

    draw(ctx, cameraX, canvasWidth) {
        const screenX = this.x - cameraX;
        if (screenX > canvasWidth + 200) return;
        if (screenX < -this.len - 220) return;

        const a = this.alpha * this.pulse;

        // Anzahl Segmente: mehr = glatter, aber teurer
        const segments = 10;
        const step = this.len / segments;

        // Path bauen (welliges Band)
        const points = [];
        for (let i = 0; i <= segments; i++) {
            const px = screenX + i * step;
            const t = (this.x + i * step) * this.freq + this.phase;
            const wobble = Math.sin(t) * this.amp + Math.sin(t * 0.7) * (this.amp * 0.35);
            const jitter = (Math.sin(t * 2.3) + Math.cos(t * 1.7)) * 1.2;
            const py = this.y + wobble + i * this.slope + jitter;
            points.push({ x: px, y: py });
        }

        ctx.save();

        // 1) dunkler Kern (source-over) – macht’s "böse" statt nur glow
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = a * 0.9;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "rgba(10, 6, 18, 0.9)";
        ctx.lineWidth = this.baseWidth * 0.85;
        this.strokeSmooth(ctx, points);

        // 2) violetter Glow (lighter/screen)
        ctx.globalCompositeOperation = "screen";
        ctx.globalAlpha = a * 1.0;

        // kleines Farb-Gradient über die Länge wirkt hochwertiger
        const g = ctx.createLinearGradient(points[0].x, points[0].y, points.at(-1).x, points.at(-1).y);
        g.addColorStop(0.00, "rgba(200, 90, 255, 0.00)");
        g.addColorStop(0.18, "rgba(200, 90, 255, 0.65)"); // Hotspot 1
        g.addColorStop(0.42, "rgba(120, 60, 220, 0.18)");
        g.addColorStop(0.62, "rgba(220, 120, 255, 0.55)"); // Hotspot 2
        g.addColorStop(1.00, "rgba(200, 90, 255, 0.00)");

        ctx.strokeStyle = g;
        ctx.lineWidth = this.baseWidth * 2.2;
        this.strokeSmooth(ctx, points);

        // 3) ganz leichter "smoke haze" um das Band (optional, subtil)
        ctx.globalCompositeOperation = "screen";
        ctx.globalAlpha = a * 0.9;
        ctx.strokeStyle = "rgba(180, 170, 150, 0.35)"; // staub-ashy haze
        ctx.lineWidth = this.baseWidth * 2.6;
        this.strokeSmooth(ctx, points);

        ctx.restore();
    }

    // Smooth stroke via quadratic segments
    strokeSmooth(ctx, pts) {
        if (pts.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);

        for (let i = 1; i < pts.length - 1; i++) {
            const xc = (pts[i].x + pts[i + 1].x) / 2;
            const yc = (pts[i].y + pts[i + 1].y) / 2;
            ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
        }
        // letzte Strecke
        const last = pts[pts.length - 1];
        ctx.lineTo(last.x, last.y);
        ctx.stroke();
    }
}

/**
 * Dark energy ribbons effect (Variant B).
 */
export class DarkEnergyEffect {
    /**
     * @param {number} worldWidth
     * @param {number} worldHeight
     * @param {number} [ribbonCount=10]
     * @param {object} [options]
     */
    constructor(worldWidth, worldHeight, ribbonCount = 10, options = {}) {
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.ribbons = Array.from({ length: ribbonCount }, () => new DarkRibbon(worldWidth, worldHeight, options));
    }

    update(time = performance.now(), cameraX = 0, viewportW = 800) {
        for (const r of this.ribbons) r.update(time, cameraX, viewportW);
    }

    draw(ctx, cameraX) {
        const canvasWidth = ctx.canvas.width; // hier NICHT *38 – Kamera kümmert sich
        for (const r of this.ribbons) r.draw(ctx, cameraX, canvasWidth);
    }
}