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

        // Für Flacker-Effekt
        this.time = 0;
    }

    update(deltaTime) {
        this.time += deltaTime * 0.005; // langsame Animation

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

        // --- Hero-Text (Gold + Outline + Glow + Flackern) ---
        ctx.globalAlpha = this.alpha;
        ctx.font = "bold 90px 'UncialAntiqua', serif"; // große, edle Schrift
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Farbverlauf (Gold)
        const gradient = ctx.createLinearGradient(
            0, this.canvas.height / 2 - 60,
            0, this.canvas.height / 2 + 60
        );
        gradient.addColorStop(0, "#fff8dc"); // helles Gold oben
        gradient.addColorStop(1, "#e6b800"); // kräftiges Gold unten
        ctx.fillStyle = gradient;

        // Outline (dunkelbraun)
        ctx.lineWidth = 6;
        ctx.strokeStyle = "rgba(30,15,0,0.9)";
        ctx.strokeText(this.text, this.canvas.width / 2, this.canvas.height / 2);

        // Glow-Effekt (flackert leicht mit der Zeit)
        const glowStrength = 40 + Math.sin(this.time * 3) * 10; 
        ctx.shadowColor = "rgba(255,200,50,0.9)";
        ctx.shadowBlur = glowStrength;

        // Füllen
        ctx.fillText(this.text, this.canvas.width / 2, this.canvas.height / 2);

        // Highlight oben (metallischer Glanz)
        const highlight = ctx.createLinearGradient(
            0, this.canvas.height / 2 - 60,
            0, this.canvas.height / 2
        );
        highlight.addColorStop(0, "rgba(255,255,255,0.8)");
        highlight.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = highlight;
        ctx.shadowBlur = 0; // kein Glow beim Highlight
        ctx.fillText(this.text, this.canvas.width / 2, this.canvas.height / 2);

        // Reset
        ctx.globalAlpha = 1.0;
        ctx.restore();
    }
}



