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
        this.particles = this.createParticles(count);
        this.fade = 1;
        this.fadeTarget = 1;
        this.fadeSpeed = 0.03;
    }

    /**
     * Creates particles.
     * @param {number} count Particle count.
     * @returns {Array<Object>}
     */
    createParticles(count) {
        return Array.from({ length: count }, () => ({
            worldX: Math.random() * this.viewportW,
            y: Math.random() * this.viewportH,
            r: Math.random() * 1.2 + 0.4,
            speedX: (Math.random() - 0.5) * 0.25,
            speedY: (Math.random() - 0.5) * 0.15,
            alpha: Math.random() * 0.4 + 0.3
        }));
    }

    /**
     * Updates the particles.
     * @param {CanvasRenderingContext2D} ctx Canvas rendering context.
     * @param {number} [cameraX=0] Camera x position.
     * @returns {void}
     */
    update(ctx, cameraX = 0) {
        this.updateFade();
        if (this.fade <= 0.001) return;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const time = performance.now() * 0.002;
        for (const p of this.particles) this.updateParticle(ctx, time, p, cameraX);
        ctx.restore();
    }

    /**
     * Updates a particle.
     * @param {CanvasRenderingContext2D} ctx Canvas rendering context.
     * @param {number} time Current time.
     * @param {Object} particle Particle data.
     * @param {number} cameraX Camera x position.
     * @returns {void}
     */
    updateParticle(ctx, time, particle, cameraX) {
        this.moveParticle(particle);
        this.respawnParticleIfNeeded(particle, cameraX);
        const screenX = particle.worldX - cameraX;
        if (!this.isParticleVisible(screenX)) return;
        const flicker = this.getParticleFlicker(time, particle.worldX);
        const alpha = particle.alpha * flicker * this.fade;
        ctx.globalAlpha = alpha;
        this.drawParticle(ctx, screenX, particle.y, particle.r, alpha);
    }

    /**
     * Respawns a particle if needed.
     * @param {Object} p Particle data.
     * @param {number} cameraX Camera x position.
     * @returns {void}
     */
    respawnParticleIfNeeded(p, cameraX) {
        const screenX = p.worldX - cameraX;
        if (screenX < -20) {
            p.worldX = cameraX + this.viewportW + Math.random() * 300;
            p.y = Math.random() * this.viewportH;
        }
        if (screenX > this.viewportW + 120) {
            p.worldX = cameraX - Math.random() * 300;
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
     * Moves a particle.
     * @param {Object} p Particle data.
     * @returns {void}
     */
    moveParticle(p) {
        p.worldX += p.speedX;
        p.y += p.speedY;
    }

    /**
     * Sets visibility state.
     * @param {boolean} visible Visibility flag.
     * @returns {void}
     */
    setVisible(visible) {
        this.fadeTarget = visible ? 1 : 0;
    }

    /**
     * Updates the fade value.
     * @returns {void}
     */
    updateFade() {
        this.fade += (this.fadeTarget - this.fade) * this.fadeSpeed;
        if (Math.abs(this.fadeTarget - this.fade) < 0.001) {
            this.fade = this.fadeTarget;
        }
    }
}