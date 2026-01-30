export class ComicPanel {
    constructor(canvas, frames) {
        this.canvas = canvas;
        this.frames = frames.filter(f => f.complete && f.naturalWidth > 0);

        this.active = false;
        this.start = 0;

        this.frame = 0;
        this.frameTime = 0;
        this.frameInterval = 1000 / 5.5;

        this.opacity = 0;
        this.fadeDuration = 350;

        this.fadeOutDuration = 350;
        this.totalDuration = 0;

        this.skipFirstDraw = false;


    }

    activate(timestamp) {
        this.active = true;
        this.start = timestamp;
        this.opacity = 0;

        this.frame = 0;
        this.frameTime = timestamp;
        this.skipFirstDraw = true;

        // Dauer der ganzen Animation (Frames + Fade-Out)
        this.totalDuration =
            this.frames.length * this.frameInterval +
            this.fadeOutDuration;
    }

    update(timestamp) {
        if (!this.active || !this.frames.length) return;

        if (this.skipFirstDraw) {
            this.skipFirstDraw = false;
            return; // <--- verhindert den ungewollten ersten Draw
        }

        const elapsed = timestamp - this.start;

        // === Fade-In ===
        if (elapsed < this.fadeDuration) {
            this.opacity = elapsed / this.fadeDuration;
        }
        else {
            this.opacity = 1;
        }

        // === Frame Animation ===
        if (timestamp - this.frameTime > this.frameInterval &&
            this.frame < this.frames.length - 1) {

            this.frame++;
            this.frameTime = timestamp;
        }

        // === Fade-Out starten ===
        const fadeOutStart = this.frames.length * this.frameInterval;

        if (elapsed > fadeOutStart) {
            const fadeElapsed = elapsed - fadeOutStart;
            const f = fadeElapsed / this.fadeOutDuration;
            this.opacity = Math.max(0, 1 - f);
        }

        // === Panel schließen ===
        if (elapsed >= this.totalDuration) {
            this.active = false;
            this.opacity = 0;
        }
    }


    draw(ctx) {
        if (!this.active || !this.frames.length) return;

        const W = this.canvas.width;
        const H = this.canvas.height;

        ctx.save();
        ctx.globalAlpha = this.opacity;

        // === PANEL PARAMETER ===
        const bottomLeftX = 0.50;
        const scale = 1.25;
        const moveX = 0;
        const moveY = 0.25;

        // === BACKGROUND GRADIENT ===
        const gradient = ctx.createLinearGradient(W, 0, W * bottomLeftX, H);
        gradient.addColorStop(0, "rgba(250,245,230,0.95)");
        gradient.addColorStop(1, "rgba(230,220,200,0.94)");





        // === TRIANGLE SHAPE ===
        const topRight = { x: W, y: 0 };
        const bottomRight = { x: W, y: H };
        const bottomLeft = { x: W * bottomLeftX, y: H };

        ctx.beginPath();
        ctx.moveTo(topRight.x, topRight.y);
        ctx.lineTo(bottomRight.x, bottomRight.y);
        ctx.lineTo(bottomLeft.x, bottomLeft.y);
        ctx.closePath();

        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.lineWidth = 10;
        ctx.strokeStyle = "black";
        ctx.stroke();

        // === CLIP PANEL ===
        ctx.save();
        ctx.clip();

        // === VIGNETTE ===
        const vignette = ctx.createRadialGradient(
            W * 0.8, H * 0.5, 10,
            W * 0.8, H * 0.5, W * 0.6
        );
        vignette.addColorStop(0, "rgba(0,0,0,0)");
        vignette.addColorStop(1, "rgba(0,0,0,0.20)");

        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, W, H);

        // === DRAW Tadeo ===
        const img = this.frames[this.frame];
        if (img) {

            const glowX = W * 0.83;
            const glowY = H * 0.53;
            const glow = ctx.createRadialGradient(glowX, glowY, 5, glowX, glowY, 250);
            glow.addColorStop(0, "rgba(80,180,255,0.45)");
            glow.addColorStop(1, "rgba(80,180,255,0)");

            ctx.fillStyle = glow;
            ctx.fillRect(0, 0, W, H);

            const w = img.naturalWidth * scale;
            const h = img.naturalHeight * scale;
            const drawX = W * moveX - w * 0.25;
            const drawY = H * moveY;

            ctx.save();
            ctx.translate(W, 0);
            ctx.scale(-1, 1);

            // === SHADOW ===
            ctx.shadowColor = "rgba(0,0,0,0.45)";
            ctx.shadowBlur = 35;
            ctx.shadowOffsetX = -25;
            ctx.shadowOffsetY = 20;

            ctx.drawImage(img, drawX, drawY, w, h);

            ctx.restore();
        }

        ctx.restore(); // clip restore
        ctx.restore(); // FINAL restore (wichtig!)
    }






}
