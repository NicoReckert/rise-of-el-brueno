/**
 * Represents a dust particle system.
 */
export class DustParticle {
    /**
     * Creates a new instance.
     * @param {{width: number, height: number}} canvas Canvas element.
     * @param {number} [worldWidthFactor=9] Multiplier for world width.
     * @param {number} [count=500] Number of particles to create.
     */
    constructor(canvas, worldWidthFactor = 9, count = 500) {
        this.canvas = canvas;
        this.worldW = canvas.width * worldWidthFactor;
        this.worldH = canvas.height;
        this.particles = this.createParticles(count);
    }

    /**
     * Creates particle data.
     * @param {number} count Number of particles.
     * @returns {Array<{x: number, y: number, r: number, speedX: number, speedY: number, alpha: number}>} Particle list.
     */
    createParticles(count) {
        return Array.from({ length: count }, () => ({
            x: Math.random() * this.worldW,
            y: Math.random() * this.worldH,
            r: Math.random() * 1.2 + 0.4,
            speedX: (Math.random() - 0.5) * 0.25,
            speedY: (Math.random() - 0.5) * 0.15,
            alpha: Math.random() * 0.4 + 0.3
        }));
    }

    /**
     * Updates all particles.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} cameraX Camera x position.
     * @returns {void}
     */
    update(ctx, cameraX) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const time = performance.now() * 0.002;
        for (const p of this.particles) {
            this.updateParticle(ctx, cameraX, time, p);
        }
        ctx.restore();
    }

    /**
     * Updates and draws a particle if visible.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} cameraX Camera x position.
     * @param {number} time Time value.
     * @param {Object} particle Particle data.
     * @returns {void}
     */
    updateParticle(ctx, cameraX, time, particle) {
        this.moveParticle(particle);
        const screenX = particle.x - cameraX * 0.9;
        if (!this.isParticleVisible(screenX)) return;
        const flicker = this.getParticleFlicker(time, particle.x);
        const alpha = particle.alpha * flicker;
        ctx.globalAlpha = alpha;
        this.drawParticle(ctx, screenX, particle.y, particle.r, alpha);
    }

    /**
     * Checks whether a particle is visible.
     * @param {number} x Particle x position.
     * @returns {boolean} True if the particle is visible, otherwise false.
     */
    isParticleVisible(x) {
        return x >= -20 && x <= this.canvas.width + 20;
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
     * Moves a particle within the world bounds.
     * @param {{x: number, y: number, speedX: number, speedY: number}} p Particle data.
     */
    moveParticle(p) {
        p.x = (p.x + p.speedX + this.worldW) % this.worldW;
        p.y = (p.y + p.speedY + this.worldH) % this.worldH;
    }
}