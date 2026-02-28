/**
 * Represents a magic shield visual effect.
 */
export class MagicShieldEffect {
    /**
    * Creates a new instance.
    * @param {HTMLCanvasElement} canvas Canvas element.
    */
    constructor(canvas) {
        this.canvas = canvas;
        this.initEffectState();
    }

    /**
    * Initializes the internal state of the effect.
    */
    initEffectState() {
        this.active = false;

        // Base radius
        this.radius = 230;

        // --- Intro / build-up ---
        this.introDuration = 5000; // ms (shield builds up over this time)
        this.introStart = 0;      // timestamp when started
        this.introT = 0;          // 0..1 eased progress

        // Animation state
        this.pulse = 0;
        this.pulseSpeed = 0.03;
        this.ringTimer = 0;
        this.rings = [];
        this.particles = [];
        this.lastTime = 0;
        this.spawnAccumulator = 0;

        // Clip jitter (used for subtle wobble)
        this.clipJitterX = 0;
        this.clipJitterY = 0;

        // Dynamic offset used by getDynamicRadius
        this.dynamicOffset = 0;
    }

    /**
    * Activates the effect and resets its state.
    * @param {number} [timestamp] Optional timestamp; defaults to performance.now()
    */
    start(timestamp = performance.now()) {
        this.active = true;

        // Intro start
        this.introStart = timestamp;
        this.introT = 0;

        // Reset animated elements
        this.pulse = 0;
        this.rings = [];
        this.particles = [];
        this.lastTime = 0;
        this.spawnAccumulator = 0;

        // Prevent immediate ring spawn at frame 1
        this.ringTimer = timestamp;
    }

    /**
    * Deactivates the effect and clears active elements.
    */
    stop() {
        this.active = false;
        this.rings = [];
        this.particles = [];
        this.introT = 0;
    }

    /**
    * Updates the effect state.
    * @param {number} timestamp Frame timestamp.
    */
    update(timestamp) {
        if (!this.active) return;

        const dt = this.computeDeltaTime(timestamp);

        // --- Intro progress (0..1) with easeOutCubic ---
        const raw = Math.min(1, (timestamp - this.introStart) / this.introDuration);
        this.introT = 1 - Math.pow(1 - raw, 3);

        this.updatePulseAndOffset(timestamp);

        // Start spawning a bit after the intro begins (prevents "instant full busy look")
        if (this.introT > 0.2) {
            this.maybeSpawnRing(timestamp);
            this.spawnNewParticles(dt);
        }

        this.updateRings(dt);
        this.updateParticles(dt);
        this.updateClipJitter(timestamp);
    }

    /**
    * Computes the delta time since the last update.
    * @param {number} timestamp Frame timestamp.
    * @returns {number} Delta time in seconds.
    */
    computeDeltaTime(timestamp) {
        if (!this.lastTime) {
            this.lastTime = timestamp;
        }
        const dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;
        return dt;
    }

    /**
    * Updates pulse and dynamic offset values.
    * @param {number} timestamp Frame timestamp.
    */
    updatePulseAndOffset(timestamp) {
        this.pulse = Math.sin(timestamp * this.pulseSpeed) * 15;
        const slowWave = Math.sin(timestamp * 0.002) * 6;
        const fastWave = Math.sin(timestamp * 0.005) * 3;
        this.dynamicOffset = slowWave + fastWave;
    }

    /**
    * Spawns a new ring if the interval has elapsed.
    * @param {number} timestamp Frame timestamp.
    */
    maybeSpawnRing(timestamp) {
        if (timestamp - this.ringTimer <= 350) return;

        this.rings.push({
            radius: this.getDynamicRadius(),
            alpha: 0.6
        });

        if (this.onShockwave) {
            this.onShockwave();
        }

        this.ringTimer = timestamp;
    }

    /**
    * Updates active rings.
    * @param {number} dt Delta time in seconds.
    */
    updateRings(dt) {
        const radiusSpeed = 4 * 60;
        const alphaFade = 0.01 * 60;

        this.rings.forEach(ring => {
            ring.radius += radiusSpeed * dt;
            ring.alpha -= alphaFade * dt;
        });

        this.rings = this.rings.filter(ring => ring.alpha > 0);
    }

    /**
    * Spawns new particles based on accumulated time.
    * @param {number} dt Delta time in seconds.
    */
    spawnNewParticles(dt) {
        this.spawnAccumulator += 3 * 60 * dt;

        while (this.spawnAccumulator >= 1) {
            const speedPerSec = (1 + Math.random() * 2) * 60;

            this.particles.push({
                angle: Math.random() * Math.PI * 2,
                dist: this.getDynamicRadius(),
                speed: speedPerSec,
                alpha: 0.8
            });

            this.spawnAccumulator -= 1;
        }
    }

    /**
    * Updates active particles.
    * @param {number} dt Delta time in seconds.
    */
    updateParticles(dt) {
        const alphaFade = 0.02 * 60;

        this.particles.forEach(particle => {
            particle.dist += particle.speed * dt;
            particle.alpha -= alphaFade * dt;
        });

        this.particles = this.particles.filter(p => p.alpha > 0);
    }

    /**
    * Updates clip jitter offsets.
    * @param {number} timestamp Frame timestamp.
    */
    updateClipJitter(timestamp) {
        this.clipJitterX = Math.sin(timestamp * 0.004) * 4;
        this.clipJitterY = Math.cos(timestamp * 0.003) * 4;
    }

    /**
     * Draws the effect.
     * Intro behavior included:
     *  - Global fade-in using introT
     *  - Circular reveal (clip) using introT so the shield "builds up" instead of popping in
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} x X-coordinate of the effect center.
     * @param {number} y Y-coordinate of the effect center.
     */
    draw(ctx, x, y) {
        if (!this.active) return;

        ctx.save();
        ctx.globalCompositeOperation = "lighter";

        const isIntro = this.introT < 0.999;

        if (isIntro) {
            // Nur während des Aufbaus: Fade-in + Reveal-Clip
            ctx.globalAlpha *= this.introT;

            const clipR = this.radius * this.introT;
            if (clipR > 0.5) {
                ctx.beginPath();
                ctx.arc(x + this.clipJitterX, y + this.clipJitterY, clipR, 0, Math.PI * 2);
                ctx.clip();
            } ctx.beginPath();
            ctx.arc(
                x + this.clipJitterX,
                y + this.clipJitterY,
                clipR,
                0,
                Math.PI * 2
            );
            ctx.clip();
        }

        // Zeichnen wie gehabt
        this.drawBeam(ctx, x, y);
        this.drawGlow(ctx, x, y);
        this.drawRings(ctx, x, y);
        this.drawParticles(ctx, x, y);

        ctx.restore();
    }
    /**
    * Draws the beam effect.
    * @param {CanvasRenderingContext2D} ctx Rendering context.
    * @param {number} x X-coordinate of the effect center.
    * @param {number} y Y-coordinate of the effect center.
    */
    drawBeam(ctx, x, y) {
        const gradBeam = ctx.createLinearGradient(x, y - 80, x, 0);
        gradBeam.addColorStop(0, "rgba(80,180,255,0.07)");
        gradBeam.addColorStop(1, "rgba(80,180,255,0)");
        ctx.fillStyle = gradBeam;
        ctx.fillRect(x - 25, 0, 50, y);
    }

    /**
    * Draws the glow effect.
    * @param {CanvasRenderingContext2D} ctx Rendering context.
    * @param {number} x X-coordinate of the effect center.
    * @param {number} y Y-coordinate of the effect center.
    */
    drawGlow(ctx, x, y) {
        const radius = this.getDynamicRadius();
        const glow = this.createGlowGradient(ctx, x, y, radius);
        ctx.fillStyle = glow;
        this.fillGlowCircle(ctx, x, y, radius);
    }

    /**
    * Creates a radial gradient for the glow.
    * @param {CanvasRenderingContext2D} ctx Rendering context.
    * @param {number} x X-coordinate of the gradient center.
    * @param {number} y Y-coordinate of the effect center.
    * @param {number} radius Base radius value.
    * @returns {CanvasGradient} Radial gradient instance.
    */
    createGlowGradient(ctx, x, y, radius) {
        const glow = ctx.createRadialGradient(
            x, y, radius * 0.2,
            x, y, radius * 1.05
        );
        glow.addColorStop(0, "rgba(0,160,255,0.08)");
        glow.addColorStop(1, "rgba(0,160,255,0)");
        return glow;
    }

    /**
    * Fills the glow circle.
    * @param {CanvasRenderingContext2D} ctx Rendering context.
    * @param {number} x X-coordinate of the circle center.
    * @param {number} y Y-coordinate of the effect center.
    * @param {number} radius Base radius value.
    */
    fillGlowCircle(ctx, x, y, radius) {
        const totalRadius = radius + this.pulse + this.dynamicOffset;

        // ✅ verhindert negative/NaN Radii
        if (!Number.isFinite(totalRadius) || totalRadius <= 0) return;

        ctx.beginPath();
        ctx.arc(x, y, totalRadius, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
    * Draws active rings.
    * @param {CanvasRenderingContext2D} ctx Rendering context.
    * @param {number} x X-coordinate of the effect center.
    * @param {number} y Y-coordinate of the effect center.
    */
    drawRings(ctx, x, y) {
        this.rings.forEach(r => {
            ctx.strokeStyle = `rgba(120,200,255,${r.alpha * 0.4})`;
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.arc(x, y, r.radius, 0, Math.PI * 2);
            ctx.stroke();
        });
    }

    /**
    * Draws active particles.
    * @param {CanvasRenderingContext2D} ctx Rendering context.
    * @param {number} x X-coordinate of the effect center.
    * @param {number} y Y-coordinate of the effect center.
    */
    drawParticles(ctx, x, y) {
        this.particles.forEach(p => {
            const px = x + Math.cos(p.angle) * p.dist;
            const py = y + Math.sin(p.angle) * p.dist;
            ctx.fillStyle = `rgba(120,200,255,${p.alpha})`;
            ctx.beginPath();
            ctx.arc(px, py, 4, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    /**
    * Returns the current dynamic radius.
    * Intro included: radius grows from 0..radius, and pulse/offset ramp in too.
    * @returns {number} Calculated radius value.
    */
    getDynamicRadius() {
        // Nach Intro: exakt wie vorher
        if (this.introT >= 0.999) {
            return this.radius + this.pulse + this.dynamicOffset;
        }

        // Während Intro: Radius wächst sichtbar rein, aber Wobble bleibt klein (optional)
        const base = this.radius * this.introT;
        return base + (this.pulse + this.dynamicOffset) * this.introT;
    }
}