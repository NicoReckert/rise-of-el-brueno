class IntroScreen {
    constructor(ctx, canvas, text = "Prolog") {
        this.ctx = ctx;
        this.canvas = canvas;
        this.text = text;
        this.alpha = 0;          // Transparenz von 0 (unsichtbar) bis 1 (sichtbar)
        this.fadeInSpeed = 0.02; // Geschwindigkeit des Einblendens
        this.fadeOutSpeed = 0.0035; // Geschwindigkeit des Ausblendens
        this.duration = 2000;    // Zeit, die der Text komplett sichtbar bleibt (ms)
        this.visibleTime = 0;
        this.phase = "fadeIn";   // fadeIn -> visible -> fadeOut
        this.done = false;
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
                this.done = true; // Intro fertig
            }
        }
    }

    draw() {
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
        this.ctx.font = "bold 64px Nunito";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(this.text, this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.restore();
    }
}
