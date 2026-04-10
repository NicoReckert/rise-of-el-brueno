/**
 * Represents a wind particle within the world.
 */
class WindParticle {
    /**
     * Creates a wind particle instance.
     * @param {number} viewportW Viewport width.
     * @param {number} viewportH Viewport height.
     * @returns {void}
     */
    constructor(viewportW, viewportH) {
        this.viewportW = viewportW;
        this.viewportH = viewportH;
        this.reset();
    }

    /**
     * Resets the particle.
     * @returns {void}
     */
    reset() {
        this.worldX = Math.random() * this.viewportW;
        this.y = Math.random() * this.viewportH;
        this.size = Math.random() * 3 + 1;
        this.speedX = -(Math.random() * 0.8 + 0.2);
        this.speedY = Math.random() * 0.4 - 0.2;
        this.alpha = Math.random() * 0.4 + 0.3;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.03;
    }

    /**
     * Updates the particle.
     * @param {number} cameraX Camera x position.
     * @returns {void}
     */
    update(cameraX) {
        this.worldX += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        const screenX = this.worldX - cameraX;
        if (screenX < -50 || this.y < -50 || this.y > this.viewportH + 50) {
            this.reset();
            this.worldX = cameraX + this.viewportW + 10 + Math.random() * 300;
        }
    }

    /**
     * Draws the particle.
     * @param {CanvasRenderingContext2D} ctx Canvas rendering context.
     * @param {number} canvasWidth Canvas width.
     * @param {number} canvasHeight Canvas height.
     * @param {number} cameraX Camera x position.
     * @param {number} [fade=1] Fade value.
     * @returns {void}
     */
    draw(ctx, canvasWidth, canvasHeight, cameraX, fade = 1) {
        const screenX = this.worldX - cameraX;
        if (screenX < -50 || screenX > canvasWidth + 50) return;
        if (this.y < -50 || this.y > canvasHeight + 50) return;
        ctx.save();
        ctx.translate(screenX, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.alpha * fade;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 1.5, this.size * 0.6, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }
}

/**
 * Manages a wind particle effect within the world.
 */
export class WindParticleEffect {
    /**
     * Creates a wind particle system.
     * @param {number} viewportW Viewport width.
     * @param {number} viewportH Viewport height.
     * @param {number} [particleCount=200] Number of particles.
     * @param {number} [_parallaxFactor=1] Unused parallax factor.
     * @returns {void}
     */
    constructor(viewportW, viewportH, particleCount = 200, _parallaxFactor = 1) {
        this.viewportW = viewportW;
        this.viewportH = viewportH;
        this.particles = Array.from({ length: particleCount }, () =>
            new WindParticle(viewportW, viewportH)
        );
        this.fade = 0;
        this.fadeTarget = 0;
        this.fadeSpeed = 0.03;
    }

    /**
     * Updates the particles.
     * @param {number} [cameraX=0] Camera x position.
     * @returns {void}
     */
    update(cameraX = 0) {
        this.updateFade();
        this.particles.forEach(p => p.update(cameraX));
    }

    /**
     * Draws the particles.
     * @param {CanvasRenderingContext2D} ctx Canvas rendering context.
     * @param {number} [cameraX=0] Camera x position.
     * @returns {void}
     */
    draw(ctx, cameraX = 0) {
        if (this.fade <= 0.001) return;
        const canvasWidth = ctx.canvas.width;
        const canvasHeight = ctx.canvas.height;
        this.particles.forEach(p => p.draw(ctx, canvasWidth, canvasHeight, cameraX, this.fade));
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