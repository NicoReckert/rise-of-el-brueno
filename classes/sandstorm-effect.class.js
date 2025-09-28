class SandstormEffect {
    constructor(canvas, imageSrc = './assets/sandstorm-texture.png', worldWidth = 7200) {
        this.canvas = canvas;
        this.ctx = null;

        this.image = new Image();
        this.image.src = imageSrc;

        this.scrollX = 0;
        this.scrollSpeed = 0.5;
        this.enabled = true;
        this.alpha = 0.3;

        this.worldWidth = worldWidth;
    }

    update() {
        if (!this.enabled) return;
        this.scrollX = (this.scrollX + this.scrollSpeed) % this.image.width;
    }

    draw(ctx, cameraX = 0) {
        if (!this.enabled || !this.image.complete) return;

        ctx.save();
        ctx.globalAlpha = this.alpha;

        const imgWidth = this.image.width;
        const offset = (cameraX + this.scrollX) % imgWidth;
        const startX = -offset;

        // Wieviele Wiederholungen nötig?
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

        ctx.globalAlpha = 1;
        ctx.restore();
    }

    setEnabled(val) {
        this.enabled = val;
    }

    setAlpha(alpha) {
        this.alpha = alpha;
    }

    setSpeed(speed) {
        this.scrollSpeed = speed;
    }
}
