export class DustParticle {
    constructor(canvas, worldWidthFactor = 9, count = 500) {
        this.canvas = canvas;
        this.worldW = canvas.width * worldWidthFactor;
        this.worldH = canvas.height;
        this.particles = this.createParticles(count);
    }

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

    update(ctx, cameraX) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const time = Date.now() * 0.002;

        this.particles.forEach(p => {
            const x = p.x - cameraX * 0.9;
            if (x < -50 || x > this.canvas.width + 50) return;

            const flicker = 0.7 + Math.sin(time + p.x * 0.005) * 0.2;
            const alpha = p.alpha * flicker;

            ctx.globalAlpha = alpha;
            this.drawParticle(ctx, x, p.y, p.r, alpha);
            this.moveParticle(p);
        });

        ctx.restore();
    }

    drawParticle(ctx, x, y, r, alpha) {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r * 2.2);
        g.addColorStop(0, `rgba(255,255,255,${alpha})`);
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r * 2, 0, Math.PI * 2);
        ctx.fill();
    }

    moveParticle(p) {
        p.x = (p.x + p.speedX + this.worldW) % this.worldW;
        p.y = (p.y + p.speedY + this.worldH) % this.worldH;
    }
}