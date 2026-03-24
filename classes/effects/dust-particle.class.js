/**
 * Represents a dust particle system.
 */
export class DustParticle {
    /**
     * Creates a particle system.
     * @param {HTMLCanvasElement} canvas Canvas element.
     * @param {number} [count=500] Number of particles.
     * @param {number} [_parallaxFactor=0.9] Unused parallax factor.
     * @returns {void}
     */
    constructor(canvas, count = 500, _parallaxFactor = 0.9) {
        this.canvas = canvas;
        this.viewportW = canvas.width;
        this.viewportH = canvas.height;
        this.cameraInfluence = 0.08;
        this.lastCameraX = null;
        this.particles = this.createParticles(count);
    }

    /**
     * Creates particle data.
     * @param {number} count Number of particles.
     * @returns {Array<Object>} Particle data.
     */
    createParticles(count) {
        return Array.from({ length: count }, () => ({
            x: Math.random() * this.viewportW,
            y: Math.random() * this.viewportH,
            r: Math.random() * 1.2 + 0.4,
            speedX: (Math.random() - 0.5) * 0.25,
            speedY: (Math.random() - 0.5) * 0.15,
            alpha: Math.random() * 0.4 + 0.3
        }));
    }

    /**
     * Updates all particles with camera drift.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} [cameraX=0] Camera x position.
     * @returns {void}
     */
    update(ctx, cameraX = 0) {
        const screenDrift = this.getScreenDrift(cameraX);
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const time = performance.now() * 0.002;
        for (const p of this.particles) this.updateDriftingParticle(ctx, time, p, screenDrift);
        ctx.restore();
    }

    /**
     * Calculates screen drift based on camera movement.
     * @param {number} cameraX Camera x position.
     * @returns {number} Screen drift value.
     */
    getScreenDrift(cameraX) {
        if (this.lastCameraX == null) this.lastCameraX = cameraX;
        let cameraDx = cameraX - this.lastCameraX;
        this.lastCameraX = cameraX;
        cameraDx = Math.max(-40, Math.min(40, cameraDx));
        return cameraDx * this.cameraInfluence;
    }

    /**
     * Updates a particle with camera drift and draws it.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} time Time value.
     * @param {Object} p Particle data.
     * @param {number} screenDrift Screen drift value.
     * @returns {void}
     */
    updateDriftingParticle(ctx, time, p, screenDrift) {
        p.x -= screenDrift;
        this.updateParticle(ctx, time, p);
    }

    /**
     * Updates and draws a particle if visible.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} time Time value.
     * @param {Object} particle Particle data.
     * @returns {void}
     */
    updateParticle(ctx, time, particle) {
        this.moveParticle(particle);
        this.respawnParticleIfNeeded(particle);
        const screenX = particle.x;
        if (!this.isParticleVisible(screenX)) return;
        const flicker = this.getParticleFlicker(time, particle.x);
        const alpha = particle.alpha * flicker;
        ctx.globalAlpha = alpha;
        this.drawParticle(ctx, screenX, particle.y, particle.r, alpha);
    }

    /**
     * Respawns a particle if it leaves the viewport bounds.
     * @param {Object} p Particle data.
     * @returns {void}
     */
    respawnParticleIfNeeded(p) {
        if (p.x < -20) {
            p.x = this.viewportW + Math.random() * 80;
            p.y = Math.random() * this.viewportH;
        }
        if (p.x > this.viewportW + 120) {
            p.x = -Math.random() * 80;
            p.y = Math.random() * this.viewportH;
        }
        if (p.y < -10 || p.y > this.viewportH + 10) {
            p.y = Math.random() * this.viewportH;
        }
    }

    /**
     * Checks whether a particle is visible.
     * @param {number} x Particle x position.
     * @returns {boolean} True if the particle is visible, otherwise false.
     */
    isParticleVisible(x) {
        return x >= -20 && x <= this.viewportW + 20;
    }
    /**
     * Calculates the flicker factor of a particle.
     * @param {number} time Current time value.
     * @param {number} posX Particle x position.
     * @returns {number} Flicker multiplier.
     */
    getParticleFlicker(time, posX) {
        const phase = time + posX * 0.005;
        return 0.7 + Math.sin(phase) * 0.2;
    }

    /**
     * Draws a particle.
     * @param {*} ctx Rendering context.
     * @param {number} x Horizontal position.
     * @param {number} y Vertical position.
     * @param {number} r Particle radius.
     * @param {number} alpha Opacity value.
     */
    drawParticle(ctx, x, y, r, alpha) {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r * 2.2);
        g.addColorStop(0, `rgba(255,255,255,${alpha})`);
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r * 2, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * Moves a particle based on its speed.
     * @param {Object} p Particle data.
     * @returns {void}
     */
    moveParticle(p) {
        p.x += p.speedX;
        p.y += p.speedY;
    }
}