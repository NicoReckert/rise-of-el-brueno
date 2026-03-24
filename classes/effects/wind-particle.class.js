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
     * Resets particle properties.
     * @returns {void}
     */
    reset() {
        this.x = Math.random() * this.viewportW;
        this.y = Math.random() * this.viewportH;
        this.size = Math.random() * 3 + 1;
        this.speedX = -(Math.random() * 0.8 + 0.2);
        this.speedY = Math.random() * 0.4 - 0.2;
        this.alpha = Math.random() * 0.4 + 0.3;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.03;
    }

    /**
     * Updates particle position and respawns if needed.
     * @returns {void}
     */
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        if (this.x < -50 || this.y < -50 || this.y > this.viewportH + 50) {
            this.reset();
            this.x = this.viewportW + 10 + Math.random() * 80;
        }
    }

    /**
     * Draws the particle if visible.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} canvasWidth Canvas width.
     * @param {number} canvasHeight Canvas height.
     * @returns {void}
     */
    draw(ctx, canvasWidth, canvasHeight) {
        const screenX = this.x;
        if (screenX < -50 || screenX > canvasWidth + 50) return;
        if (this.y < -50 || this.y > canvasHeight + 50) return;
        ctx.save();
        ctx.translate(screenX, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.alpha;
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
        this.cameraInfluence = 0.22;
        this.lastCameraX = null;
        this.particles = Array.from({ length: particleCount }, () =>
            new WindParticle(viewportW, viewportH)
        );
    }

    /**
     * Updates particles with camera influence.
     * @param {number} [cameraX=0] Camera x position.
     * @returns {void}
     */
    update(cameraX = 0) {
        if (this.lastCameraX == null) {
            this.lastCameraX = cameraX;
        }
        let cameraDx = cameraX - this.lastCameraX;
        this.lastCameraX = cameraX;
        cameraDx = Math.max(-40, Math.min(40, cameraDx));
        const screenDrift = cameraDx * this.cameraInfluence;
        this.particles.forEach(p => {
            p.x -= screenDrift;
            p.update();
        });
    }

    /**
     * Draws all particles.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} [_cameraX=0] Camera x position.
     * @returns {void}
     */
    draw(ctx, _cameraX = 0) {
        const canvasWidth = ctx.canvas.width;
        const canvasHeight = ctx.canvas.height;
        this.particles.forEach(p => p.draw(ctx, canvasWidth, canvasHeight));
    }
}