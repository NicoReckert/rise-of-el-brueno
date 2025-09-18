class IntroScreen {
    constructor(ctx, canvas, text = "Prolog") {
        this.ctx = ctx;
        this.canvas = canvas;
        this.text = text;

        // Fade-Logik
        this.alpha = 0;
        this.fadeInSpeed = 0.02;
        this.fadeOutSpeed = 0.0035;
        this.duration = 2000;
        this.visibleTime = 0;
        this.phase = "fadeIn";
        this.done = false;

        // Hintergrundbild
        this.bgImage = new Image();
        this.bgLoaded = false;
        this.bgImage.onload = () => this.bgLoaded = true;
        this.bgImage.onerror = () => this.bgLoaded = false;
        this.bgImage.src = "./assets/img/background-task-window2.webp";

        // Overlay über dem Bild (optional)
        this.bgOverlayAlpha = 0.20;
    }

    update(deltaTime) {
        if (this.phase === "fadeIn") {
            this.alpha += this.fadeInSpeed;
            if (this.alpha >= 1) {
                this.alpha = 1;
                this.phase = "visible";
            }
        } else if (this.phase === "visible") {
            this.visibleTime += deltaTime;
            if (this.visibleTime >= this.duration) {
                this.phase = "fadeOut";
            }
        } else if (this.phase === "fadeOut") {
            this.alpha -= this.fadeOutSpeed;
            if (this.alpha <= 0) {
                this.alpha = 0;
                this.done = true;
            }
        }
    }

    draw() {
        const ctx = this.ctx;
        ctx.save();
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // --- Hintergrund ---
        if (this.bgLoaded) {
            ctx.globalAlpha = this.alpha;
            ctx.drawImage(this.bgImage, 0, 0, this.canvas.width, this.canvas.height);
            if (this.bgOverlayAlpha > 0) {
                ctx.fillStyle = `rgba(0,0,0,${this.bgOverlayAlpha})`;
                ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            }
            ctx.globalAlpha = 1.0;
        } else {
            ctx.fillStyle = `rgba(0,0,0,${0.5 * this.alpha})`;
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        // --- Text-Hintergrund-Kasten ---
        const boxWidth = 420;
        const boxHeight = 120;
        const boxX = this.canvas.width / 2 - boxWidth / 2;
        const boxY = this.canvas.height / 2 - boxHeight / 2;

        ctx.globalAlpha = this.alpha;
        this._roundedRect(ctx, boxX, boxY, boxWidth, boxHeight, 20);
        ctx.fillStyle = "rgba(0,0,0,0.45)";
        ctx.fill();

        // --- Text mit Glow ---
        ctx.font = "bold 64px Nunito, Nunito Sans, system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.shadowColor = "rgba(0,0,0,0.7)";
        ctx.shadowBlur = 10;
        ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
        ctx.fillText(this.text, this.canvas.width / 2, this.canvas.height / 2);

        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;

        ctx.restore();
    }

    _roundedRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }
}

