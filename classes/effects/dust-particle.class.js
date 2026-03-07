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
     * Updates and renders all particles.
     * @param {*} ctx Rendering context.
     * @param {number} cameraX Current camera x position.
     */
    update(ctx, cameraX) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const time = Date.now() * 0.002;
        this.particles.forEach(p => {
            this.updateParticle(ctx, cameraX, time, p);
        });
        ctx.restore();
    }

    /**
     * Updates and renders a single particle.
     * @param {*} ctx Rendering context.
     * @param {number} cameraX Current camera x position.
     * @param {number} time Current time value.
     * @param {{x: number, y: number, r: number, speedX: number, speedY: number, alpha: number}} particle Particle data.
     */
    updateParticle(ctx, cameraX, time, particle) {
        const x = particle.x - cameraX * 0.9;
        if (!this.isParticleVisible(x)) return;
        const flicker = this.getParticleFlicker(time, particle.x);
        const alpha = particle.alpha * flicker;
        ctx.globalAlpha = alpha;
        this.drawParticle(ctx, x, particle.y, particle.r, alpha);
        this.moveParticle(particle);
    }

    /**
     * Checks whether a particle is visible on the canvas.
     * @param {number} x Horizontal position.
     * @returns {boolean} True if visible, otherwise false.
     */
    isParticleVisible(x) {
        if (x < -50) return false;
        if (x > this.canvas.width + 50) return false;
        return true;
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