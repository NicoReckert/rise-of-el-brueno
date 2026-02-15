export class SandstormEffect {
    constructor(canvas, imageSrc = './assets/img/sandstorm_texture.png', worldWidth = 7200) {
        this.canvas = canvas;
        this.ctx = null;

        this.image = new Image();
        this.image.src = imageSrc;

        this.scrollX = 0;
        this.scrollSpeed = 0.5;
        this.enabled = true;
        this.alpha = 0.3;

        this.worldWidth = worldWidth;
        this.pressure = 0;
        this.currentAlpha = this.alpha;
    }

    update() {
        if (!this.enabled) return;
        this.scrollX = (this.scrollX + this.scrollSpeed) % this.image.width;
        this.pressure *= 0.9;
        if (this.pressure < 0.01) this.pressure = 0;

        const p = Math.min(1, Math.max(0, this.pressure));
        const targetAlpha = this.alpha * (1 - p);

        // Sanft in Richtung targetAlpha interpolieren (kein Flackern)
        const smoothing = 0.2; // 0.1–0.3 ist gut
        this.currentAlpha += (targetAlpha - this.currentAlpha) * smoothing;
    }

    draw(ctx, cameraX = 0, shield = null) {
        if (!this.enabled || !this.image.complete) return;

        ctx.save();

        if (shield) {
            const { x, y, radius } = shield;

            ctx.beginPath();
            ctx.rect(0, 0, this.canvas.width, this.canvas.height);

            ctx.moveTo(x, y);
            ctx.arc(x, y, radius * 0.9, 0, Math.PI * 2, true);

            ctx.clip("evenodd");
        }

        this.drawSand(ctx, cameraX);

        ctx.restore();

        // Glow-Rand (optional)
        if (shield) {
            const { x, y, radius } = shield;

            const g = ctx.createRadialGradient(
                x, y, radius * 0.6,
                x, y, radius
            );
            g.addColorStop(0, "rgba(0,160,255,0)");
            g.addColorStop(1, "rgba(0,160,255,0.55)");

            ctx.save();
            ctx.globalCompositeOperation = "lighter";
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }


    drawSand(ctx, cameraX) {
        ctx.save();

        ctx.globalAlpha = this.currentAlpha;  // NICHT mehr alpha - pressure

        const imgWidth = this.image.width;
        const offset = (cameraX + this.scrollX) % imgWidth;
        const startX = -offset;
        const repeats = Math.ceil(this.canvas.width / imgWidth) + 1;

        for (let i = 0; i < repeats; i++) {
            ctx.drawImage(
                this.image,
                startX + i * imgWidth,
                0,
                imgWidth,
                this.canvas.height
            );
        }

        ctx.restore();
    }




    setEnabled(val) {
        this.enabled = val;
    }

    setAlpha(alpha) {
        this.alpha = alpha;
        // optional: currentAlpha beim Setup mitziehen
        if (this.currentAlpha == null) this.currentAlpha = alpha;
    }

    setSpeed(speed) {
        this.scrollSpeed = speed;
    }
}
