/**
 * Visual effect representing a magical shield.
 */
export class MagicShieldEffect {
    /**
     * Creates a new particle effect renderer.
     * @param {HTMLCanvasElement} canvas Rendering canvas.
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.initEffectState();
    }

    /**
     * Initializes the magic shield effect state.
     */
    initEffectState() {
        this.initEffectTiming();
        this.initEffectVisuals();
        this.initEffectCollections();
    }

    /**
     * Initializes timing properties for the magic shield effect.
     */
    initEffectTiming() {
        this.active = false;
        this.introDuration = 5000;
        this.introStart = 0;
        this.introT = 0;
        this.lastTime = 0;
        this.spawnAccumulator = 0;
        this.ringTimer = 0;
    }

    /**
     * Initializes visual properties for the magic shield effect.
     */
    initEffectVisuals() {
        this.radius = 230;
        this.pulse = 0;
        this.pulseSpeed = 0.03;
        this.clipJitterX = 0;
        this.clipJitterY = 0;
        this.dynamicOffset = 0;
    }

    /**
     * Initializes collections for rings and particles in the magic shield effect.
     */
    initEffectCollections() {
        this.rings = [];
        this.particles = [];
    }

    /**
     * Starts the magic shield effect.
     * @param {number} [timestamp=performance.now()] Start timestamp.
     */
    start(timestamp = performance.now()) {
        this.active = true;
        this.introStart = timestamp;
        this.introT = 0;
        this.pulse = 0;
        this.rings = [];
        this.particles = [];
        this.lastTime = 0;
        this.spawnAccumulator = 0;
        this.ringTimer = timestamp;
    }

    /**
     * Stops the magic shield effect and clears all rings and particles.
     */
    stop() {
        this.active = false;
        this.rings = [];
        this.particles = [];
        this.introT = 0;
    }

    /**
     * Updates the magic shield effect state for the current frame.
     * @param {number} timestamp Frame timestamp.
     */
    update(timestamp) {
        if (!this.active) return;
        const dt = this.computeDeltaTime(timestamp);
        const raw = Math.min(1, (timestamp - this.introStart) / this.introDuration);
        this.introT = 1 - Math.pow(1 - raw, 3);
        this.updatePulseAndOffset(timestamp);
        if (this.introT > 0.2) {
            this.maybeSpawnRing(timestamp);
            this.spawnNewParticles(dt);
        }
        this.updateRings(dt);
        this.updateParticles(dt);
        this.updateClipJitter(timestamp);
    }

    /**
     * Computes delta time since the last frame.
     * @param {number} timestamp Current frame timestamp.
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
     * Updates the pulse and dynamic offset for the magic shield effect.
     * @param {number} timestamp Current frame timestamp.
     */
    updatePulseAndOffset(timestamp) {
        this.pulse = Math.sin(timestamp * this.pulseSpeed) * 15;
        const slowWave = Math.sin(timestamp * 0.002) * 6;
        const fastWave = Math.sin(timestamp * 0.005) * 3;
        this.dynamicOffset = slowWave + fastWave;
    }

    /**
     * Spawns a new shockwave ring if enough time has passed.
     * @param {number} timestamp Current frame timestamp.
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
     * Updates all active rings, increasing radius and fading alpha.
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
     * Spawns new particles around the magic shield effect based on elapsed time.
     * @param {number} dt Delta time in seconds.
     */
    spawnNewParticles(dt) {
        this.spawnAccumulator += 3 * 60 * dt;
        const spawnCount = Math.floor(this.spawnAccumulator);
        for (let i = 0; i < spawnCount; i++) {
            const speedPerSec = (1 + Math.random() * 2) * 60;
            this.particles.push({
                angle: Math.random() * Math.PI * 2,
                dist: this.getDynamicRadius(),
                speed: speedPerSec,
                alpha: 0.8
            });
        }
        this.spawnAccumulator -= spawnCount;
    }

    /**
     * Updates particles' positions and alpha, removing faded ones.
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
     * Updates the clip jitter offsets for the magic shield effect.
     * @param {number} timestamp Current frame timestamp.
     */
    updateClipJitter(timestamp) {
        this.clipJitterX = Math.sin(timestamp * 0.004) * 4;
        this.clipJitterY = Math.cos(timestamp * 0.003) * 4;
    }

    /**
     * Draws the magic shield effect on the canvas.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} x X position.
     * @param {number} y Y position.
     */
    draw(ctx, x, y) {
        if (!this.active) return;
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        this.applyIntroClip(ctx, x, y);
        this.drawBeam(ctx, x, y);
        this.drawGlow(ctx, x, y);
        this.drawRings(ctx, x, y);
        this.drawParticles(ctx, x, y);
        ctx.restore();
    }

    /**
     * Applies an intro circular clipping effect based on intro progress.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} x X position.
     * @param {number} y Y position.
     */
    applyIntroClip(ctx, x, y) {
        if (this.introT >= 0.999) return;
        ctx.globalAlpha *= this.introT;
        const clipR = this.radius * this.introT;
        if (clipR > 0.5) {
            ctx.beginPath();
            ctx.arc(x + this.clipJitterX, y + this.clipJitterY, clipR, 0, Math.PI * 2);
            ctx.clip();
        }
    }

    /**
     * Draws the vertical beam effect of the magic shield.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} x X position.
     * @param {number} y Y position.
     */
    drawBeam(ctx, x, y) {
        const gradBeam = ctx.createLinearGradient(x, y - 80, x, 0);
        gradBeam.addColorStop(0, "rgba(80,180,255,0.07)");
        gradBeam.addColorStop(1, "rgba(80,180,255,0)");
        ctx.fillStyle = gradBeam;
        ctx.fillRect(x - 25, 0, 50, y);
    }

    /**
     * Draws the glowing aura around the magic shield.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} x X position.
     * @param {number} y Y position.
     */
    drawGlow(ctx, x, y) {
        const radius = this.getDynamicRadius();
        const glow = this.createGlowGradient(ctx, x, y, radius);
        ctx.fillStyle = glow;
        this.fillGlowCircle(ctx, x, y, radius);
    }

    /**
     * Creates a radial gradient for the magic shield glow.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} x X position.
     * @param {number} y Y position.
     * @param {number} radius Radius of the glow.
     * @returns {CanvasGradient} Radial gradient.
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
     * Fills a circular area for the magic shield glow.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} x X position.
     * @param {number} y Y position.
     * @param {number} radius Base radius of the glow.
     */
    fillGlowCircle(ctx, x, y, radius) {
        const totalRadius = radius + this.pulse + this.dynamicOffset;
        if (!Number.isFinite(totalRadius) || totalRadius <= 0) return;
        ctx.beginPath();
        ctx.arc(x, y, totalRadius, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * Draws all active rings of the magic shield effect.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} x X position.
     * @param {number} y Y position.
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
     * Draws all active particles of the magic shield effect.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} x X position.
     * @param {number} y Y position.
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
     * Computes the current dynamic radius for the magic shield, including pulse and offset.
     * @returns {number} Dynamic radius.
     */
    getDynamicRadius() {
        if (this.introT >= 0.999) {
            return this.radius + this.pulse + this.dynamicOffset;
        }
        const base = this.radius * this.introT;
        return base + (this.pulse + this.dynamicOffset) * this.introT;
    }
}