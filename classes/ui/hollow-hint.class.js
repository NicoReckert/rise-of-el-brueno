export class HollowHint {
    constructor(text, target, yOffset = 60, theme = "desert", sound = null) {
        this.text = text.toUpperCase();
        this.target = target;
        this.yOffset = yOffset;
        this.opacity = 0;
        this.showing = false;
        this.active = false;
        this.fadeSpeed = 0.05;
        this.theme = theme;

        // 🔊 Optionaler Sound
        this.sound = sound;
        this.lastPlayed = 0;
        this.soundCooldown = 2000;
    }

    show() {
        const wasHidden = !this.showing && !this.active;
        this.showing = true;
        this.active = true;

        if (wasHidden && this.sound) {
            const now = performance.now();
            if (now - this.lastPlayed > this.soundCooldown) {
                try {
                    this.sound.currentTime = 0;
                    this.sound.play();
                    this.lastPlayed = now;
                } catch (e) {
                    console.warn("HollowHint sound playback failed:", e);
                }
            }
        }
    }

    hide() {
        this.showing = false;
    }

    update() {
        this.opacity += this.showing ? this.fadeSpeed : -this.fadeSpeed;
        this.opacity = Math.max(0, Math.min(1, this.opacity));
        if (this.opacity <= 0 && !this.showing) this.active = false;
    }

    getThemeColors() {
        switch (this.theme) {
            case "gold":
                return {
                    hue: 45,
                    highlight: "#fff6d0",
                    mid: "#ffd27f",
                    shadow: "#7a4a00",
                    ornament: "rgba(255,220,160,1)",
                    glow: "rgba(255,200,100,1)"
                };
            case "spirit":
                return {
                    hue: 280,
                    highlight: "#f8e8ff",
                    mid: "#d6b6ff",
                    shadow: "#3a0a80",
                    ornament: "rgba(230,200,255,1)",
                    glow: "rgba(200,160,255,1)"
                };
            case "rose":
                return {
                    hue: 320,
                    highlight: "#ffd8f5",
                    mid: "#ff91c6",
                    shadow: "#5a0030",
                    ornament: "rgba(255,180,220,1)",
                    glow: "rgba(255,140,200,1)"
                };
            case "desert":
                return {
                    hue: 30,
                    highlight: "#ffe9b8",
                    mid: "#ffad42",
                    shadow: "#6a3200",
                    ornament: "rgba(255,180,70,0.95)",
                    glow: "rgba(255,180,80,1)"
                };
            default: // blue
                return {
                    hue: 210,
                    highlight: "#eaf2ff",
                    mid: "#bcd4ff",
                    shadow: "#001a33",
                    ornament: "rgba(200,220,255,1)",
                    glow: "rgba(150,190,255,1)"
                };
        }
    }

    drawOrnament(ctx, x, y, textWidth, opacity = 1, color = "rgba(255,180,80,0.9)") {
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.2;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;

        // Abstand proportional zur Textbreite (min 30, max 100)
        const offset = Math.min(Math.max(textWidth * 0.25, 30), 100);

        // Linker Swirl
        ctx.beginPath();
        ctx.moveTo(x - offset, y);
        ctx.quadraticCurveTo(x - offset - 15, y + 5, x - offset - 20, y + 20);
        ctx.quadraticCurveTo(x - offset - 15, y + 10, x - offset, y + 8);
        ctx.stroke();

        // Rechter Swirl
        ctx.beginPath();
        ctx.moveTo(x + offset, y);
        ctx.quadraticCurveTo(x + offset + 15, y + 5, x + offset + 20, y + 20);
        ctx.quadraticCurveTo(x + offset + 15, y + 10, x + offset, y + 8);
        ctx.stroke();

        // Diamant
        ctx.beginPath();
        ctx.moveTo(x, y + 4);
        ctx.lineTo(x + 4, y + 8);
        ctx.lineTo(x, y + 12);
        ctx.lineTo(x - 4, y + 8);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();

        ctx.restore();
    }

    draw(ctx, cameraX = 0) {
        if (!this.active) return;
        this.update();

        const now = performance.now();
        const breathing = 0.97 + Math.sin(now / 1000) * 0.03;
        const shimmer = 0.5 + 0.5 * Math.sin(now / 600);
        const anchor = this.getTargetAnchor();
        if (!anchor) return;

        const x = anchor.headX - cameraX;
        const y = anchor.headY - this.yOffset;
        const { hue, highlight, mid, shadow, ornament, glow } = this.getThemeColors();

        ctx.save();
        ctx.translate(x, y);
        ctx.scale(breathing, breathing);
        ctx.globalAlpha = this.opacity;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // 📏 Textbreite messen für Skalierung
        ctx.font = `900 34px 'AlegreyaSC', 'Trajan Pro', serif`;
        const textWidth = ctx.measureText(this.text).width;

        // 🌞 Aura dynamisch an Textgröße anpassen
        const baseRadius = 80;
        const auraRadius = Math.min(baseRadius + textWidth * 0.35, 250);

        const aura = ctx.createRadialGradient(0, 0, 5, 0, 0, auraRadius);
        aura.addColorStop(0, `hsla(${hue}, 100%, 85%, 0.25)`);
        aura.addColorStop(0.6, `hsla(${hue}, 100%, 65%, 0.1)`);
        aura.addColorStop(1, `hsla(${hue}, 100%, 45%, 0)`);
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(0, 0, auraRadius, 0, Math.PI * 2);
        ctx.fill();

        // ✨ Text
        const textGrad = ctx.createLinearGradient(0, -20, 0, 20);
        textGrad.addColorStop(0, highlight);
        textGrad.addColorStop(0.5, mid);
        textGrad.addColorStop(1, mid);

        ctx.strokeStyle = shadow;
        ctx.lineWidth = 4;
        ctx.strokeText(this.text, 0, 0);

        ctx.shadowColor = glow;
        ctx.shadowBlur = 20 + shimmer * 10;
        ctx.fillStyle = textGrad;
        ctx.fillText(this.text, 0, 0);

        // 💎 Ornament proportional zur Textbreite
        this.drawOrnament(ctx, 0, 26, textWidth, this.opacity, ornament);

        ctx.restore();
    }

    getTargetAnchor() {
        if (!this.target) return null;

        const hb = this.target.getHitboxRect?.();

        return {
            headX: hb ? hb.cx : (this.target.x + this.target.width * 0.5),
            headY: hb ? hb.top : this.target.y
        };
    }
}