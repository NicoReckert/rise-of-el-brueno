class DamageText {
    constructor(x, y, value) {
        this.x = x;
        this.y = y;
        this.value = value;

        this.startY = y;
        this.startTime = performance.now();
        this.lifetime = 700; // ms
        this.alpha = 1;
    }

    update(timestamp) {
        const t = (timestamp - this.startTime) / this.lifetime;

        // nach oben schweben
        this.y = this.startY - t * 30;

        // ausfaden
        this.alpha = 1 - t;

        return t < 1; // true = noch leben
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = 'red';
        ctx.font = 'bold 18px Cinzel, serif'; // oder fallback
        ctx.textAlign = 'center';
        ctx.fillText(this.value, this.x, this.y);
        ctx.restore();
    }
}
