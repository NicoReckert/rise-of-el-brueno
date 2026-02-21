/**
 * Represents a wind particle within the world.
 */
class WindParticle {
    /**
    * Creates a new instance.
    * @param {number} worldWidth Width of the world.
    * @param {number} worldHeight Height of the world.
    */
    constructor(worldWidth, worldHeight) {
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.reset();
    }

    /**
    * Resets the particle with randomized properties.
    */
    reset() {
        this.x = Math.random() * this.worldWidth;
        this.y = Math.random() * this.worldHeight;
        this.size = Math.random() * 3 + 1;
        this.speedX = -(Math.random() * 1.5 + 0.5);
        this.speedY = Math.random() * 0.4 - 0.2;
        this.alpha = Math.random() * 0.4 + 0.3;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.03;
    }

    /**
    * Updates the particle position and state.
    */
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        if (this.x < -50 || this.y < 0 || this.y > this.worldHeight) {
            this.reset();
            this.x = this.worldWidth + 10;
        }
    }

    /**
    * Draws the particle.
    * @param {CanvasRenderingContext2D} ctx Rendering context.
    * @param {number} renderCameraX Camera x-offset.
    * @param {number} canvasWidth Canvas width.
    * @param {number} canvasHeight Canvas height.
    */
    draw(ctx, renderCameraX, canvasWidth, canvasHeight) {
        const screenX = this.x - renderCameraX;
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
    * Creates a new instance.
    * @param {number} worldWidth Width of the world.
    * @param {number} worldHeight Height of the world.
    * @param {number} [particleCount=200] Number of particles.
    */
    constructor(worldWidth, worldHeight, particleCount = 200) {
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.particles = Array.from({ length: particleCount }, () =>
            new WindParticle(worldWidth, worldHeight)
        );
    }

    /**
    * Updates all particles.
    */
    update() {
        this.particles.forEach(p => p.update());
    }

    /**
    * Draws all particles.
    * @param {CanvasRenderingContext2D} ctx Rendering context.
    * @param {number} renderCameraX Camera x-offset.
    */
    draw(ctx, renderCameraX) {
        const canvasWidth = ctx.canvas.width * 38;
        const canvasHeight = ctx.canvas.height;
        this.particles.forEach(p => p.draw(ctx, renderCameraX, canvasWidth, canvasHeight));
    }
}