export class ComicPanel {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {Array<HTMLImageElement> | {type:'sheet'|'sheetSequence', ...}} source
     */
    constructor(canvas, source) {
        this.canvas = canvas;

        // --- Quelle merken + Typ bestimmen ---
        this.source = source;
        if (Array.isArray(source)) {
            // alter Fall: Einzelbilder
            this.type = 'frames';
            this.frames = source.filter(f => f && f.complete && f.naturalWidth > 0);
        } else if (source && source.type === 'sheet') {
            this.type = 'sheet';
            this.frames = null;
        } else if (source && source.type === 'sheetSequence') {
            this.type = 'sheetSequence';
            this.frames = null;
        } else {
            this.type = 'frames';
            this.frames = [];
        }

        this.active = false;
        this.start = 0;

        this.frame = 0;          // globaler Frame-Index
        this.frameTime = 0;
        this.frameInterval = 1000 / 5.5;

        this.opacity = 0;
        this.fadeDuration = 350;
        this.fadeOutDuration = 350;

        this.totalDuration = 0;
        this.totalFrames = this.getTotalFrames();

        this.skipFirstDraw = false;
    }

    /**
     * Gesamtanzahl aller Frames (für Timing/FadeOut)
     */
    getTotalFrames() {
        if (this.type === 'frames') {
            return this.frames?.length ?? 0;
        }

        if (this.type === 'sheet') {
            const { meta } = this.source;
            const def = meta.animations?.default || {};
            const from = def.from ?? 0;
            const to = def.to ?? (meta.frames - 1);
            return (to - from + 1);
        }

        if (this.type === 'sheetSequence') {
            const { sheets } = this.source;
            if (!Array.isArray(sheets)) return 0;

            let sum = 0;
            for (const sheet of sheets) {
                const meta = sheet.meta;
                const def = meta.animations?.default || {};
                const from = def.from ?? 0;
                const to = def.to ?? (meta.frames - 1);
                sum += (to - from + 1);
            }
            return sum;
        }

        return 0;
    }

    activate(timestamp) {
        this.active = true;
        this.start = timestamp;
        this.opacity = 0;

        this.frame = 0;
        this.frameTime = timestamp;
        this.skipFirstDraw = true;

        // neu berechnen (falls Panel reused wird)
        this.totalFrames = this.getTotalFrames();

        // Dauer der ganzen Animation (Frames + Fade-Out)
        this.totalDuration =
            this.totalFrames * this.frameInterval +
            this.fadeOutDuration;
    }

    update(timestamp) {
        if (!this.active || this.totalFrames === 0) return;

        if (this.skipFirstDraw) {
            this.skipFirstDraw = false;
            return; // verhindert den ungewollten ersten Draw
        }

        const elapsed = timestamp - this.start;

        // === Fade-In ===
        if (elapsed < this.fadeDuration) {
            this.opacity = elapsed / this.fadeDuration;
        } else {
            this.opacity = 1;
        }

        // === Frame Animation ===
        if (timestamp - this.frameTime > this.frameInterval &&
            this.frame < this.totalFrames - 1) {

            this.frame++;
            this.frameTime = timestamp;
        }

        // === Fade-Out starten ===
        const fadeOutStart = this.totalFrames * this.frameInterval;

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

    /**
     * Liefert für den aktuellen globalen Frame:
     *  - image (HTMLImageElement)
     *  - frameWidth, frameHeight
     *  - optional frameSource (sx,sy,sw,sh) für drawImage
     */
    getCurrentFrameInfo() {
        // --- alter Fall: Einzelbilder ---
        if (this.type === 'frames') {
            const img = this.frames?.[this.frame];
            if (!img) return null;

            return {
                image: img,
                frameWidth: img.naturalWidth,
                frameHeight: img.naturalHeight,
                frameSource: null
            };
        }

        // --- ein einzelnes Sheet mit "default"-Animation ---
        if (this.type === 'sheet') {
            const { image, meta } = this.source;
            const def = meta.animations?.default || {};
            const from = def.from ?? 0;
            const to = def.to ?? (meta.frames - 1);
            const count = to - from + 1;

            const localIndex = Math.min(this.frame, count - 1);
            const absoluteFrame = from + localIndex;

            const col = absoluteFrame % meta.columns;
            const row = Math.floor(absoluteFrame / meta.columns);

            return {
                image,
                frameWidth: meta.frameWidth,
                frameHeight: meta.frameHeight,
                frameSource: {
                    sx: col * meta.frameWidth,
                    sy: row * meta.frameHeight,
                    sw: meta.frameWidth,
                    sh: meta.frameHeight
                }
            };
        }

        // --- Sheet-Sequence ---
        if (this.type === 'sheetSequence') {
            const { sheets } = this.source;
            if (!Array.isArray(sheets) || sheets.length === 0) return null;

            let remaining = this.frame;

            for (const sheet of sheets) {
                const { image, meta } = sheet;
                const def = meta.animations?.default || {};
                const from = def.from ?? 0;
                const to = def.to ?? (meta.frames - 1);
                const count = to - from + 1;

                if (remaining < count) {
                    const absoluteFrame = from + remaining;
                    const col = absoluteFrame % meta.columns;
                    const row = Math.floor(absoluteFrame / meta.columns);

                    return {
                        image,
                        frameWidth: meta.frameWidth,
                        frameHeight: meta.frameHeight,
                        frameSource: {
                            sx: col * meta.frameWidth,
                            sy: row * meta.frameHeight,
                            sw: meta.frameWidth,
                            sh: meta.frameHeight
                        }
                    };
                }

                remaining -= count;
            }

            // Fallback: letztes Sheet, letzter Frame
            const lastSheet = sheets[sheets.length - 1];
            const { image, meta } = lastSheet;
            const def = meta.animations?.default || {};
            const from = def.from ?? 0;
            const to = def.to ?? (meta.frames - 1);
            const absoluteFrame = to;
            const col = absoluteFrame % meta.columns;
            const row = Math.floor(absoluteFrame / meta.columns);

            return {
                image,
                frameWidth: meta.frameWidth,
                frameHeight: meta.frameHeight,
                frameSource: {
                    sx: col * meta.frameWidth,
                    sy: row * meta.frameHeight,
                    sw: meta.frameWidth,
                    sh: meta.frameHeight
                }
            };
        }

        return null;
    }

    drawFrame(ctx, img, frameSource, dx, dy, dw, dh) {
        if (frameSource) {
            ctx.drawImage(
                img,
                frameSource.sx,
                frameSource.sy,
                frameSource.sw,
                frameSource.sh,
                dx,
                dy,
                dw,
                dh
            );
        } else {
            ctx.drawImage(img, dx, dy, dw, dh);
        }
    }

    draw(ctx) {
        if (!this.active || this.totalFrames === 0) return;

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

        // === DRAW Charakter / Panel-Content ===
        const info = this.getCurrentFrameInfo();
        if (info) {
            const { image: img, frameWidth, frameHeight, frameSource } = info;

            const glowX = W * 0.83;
            const glowY = H * 0.53;
            const glow = ctx.createRadialGradient(glowX, glowY, 5, glowX, glowY, 250);
            glow.addColorStop(0, "rgba(80,180,255,0.45)");
            glow.addColorStop(1, "rgba(80,180,255,0)");

            ctx.fillStyle = glow;
            ctx.fillRect(0, 0, W, H);

            const w = frameWidth * scale;
            const h = frameHeight * scale;
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

            this.drawFrame(ctx, img, frameSource, drawX, drawY, w, h);

            ctx.restore();
        }

        ctx.restore(); // clip restore
        ctx.restore(); // FINAL restore
    }
}
