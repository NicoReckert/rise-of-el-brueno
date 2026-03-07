export class SpeechBubble {
    constructor(text, target = 'canvas', type = 'speech', allAudios = null, yOffset = 60) {
        this.allAudios = allAudios;
        this.fullText = text;
        this.displayedText = '';
        this.target = target;
        this.type = type;
        this.yOffset = yOffset;

        this.startTime = null;
        this.fadeOutStart = null;
        this.fadeDuration = 600;
        this.charDelay = 45;
        this.lastCharCount = 0;
        this.active = false;

        // Visual state wird jetzt in update() berechnet
        this.scale = 0.9;
        this.opacity = 1;
        this.floatOffset = 0;

        if (this.type === "speech" && this.allAudios?.speechSound) {
            this.speechSound = this.allAudios.speechSound;
            this.speechSound.volume = 0.5;
        }
    }

    start(duration = null, now = performance.now()) {
        this.startTime = now;
        this.displayedText = this.type === "info" ? this.fullText : '';
        this.lastCharCount = 0;
        this.active = true;

        this.scale = 0.9;
        this.opacity = 0;
        this.floatOffset = 0;

        if (duration == null) duration = this.getRecommendedHoldMs();
        this.fadeOutStart = this.startTime + duration;
    }

    fadeOut(after = 3000, now = performance.now()) {
        if (this.startTime == null) return;
        this.fadeOutStart = now + after;
    }

    update(currentTime) {
        if (!this.active || this.startTime == null) return;
        const elapsed = Math.max(0, currentTime - this.startTime);
        const fadeInTime = 250;
        this.opacity = elapsed < fadeInTime ? elapsed / fadeInTime : 1;
        if (this.fadeOutStart != null && currentTime > this.fadeOutStart) {
            const fadeProgress = Math.min((currentTime - this.fadeOutStart) / this.fadeDuration, 1);
            this.opacity = 1 - fadeProgress;
            if (fadeProgress >= 1) {
                this.opacity = 0;
                this.active = false;
                return;
            }
        }
        this.scale = elapsed < 200 ? 0.9 + 0.1 * (elapsed / 200) : 1;
        this.floatOffset = Math.sin(elapsed / 600) * 2;
        if (this.type === "info") {
            this.displayedText = this.fullText;
            return;
        }
        const charsToShow = Math.max(0, Math.floor(elapsed / this.charDelay));
        const safeCharCount = Math.max(0, Math.min(charsToShow, this.fullText.length));
        const char = safeCharCount > 0 ? this.fullText.charAt(safeCharCount - 1) : '';
        if (safeCharCount > this.lastCharCount) {
            if (
                this.speechSound &&
                char &&
                char !== ' ' &&
                /[aeiouäöü]/i.test(char) &&
                safeCharCount % 2 === 0
            ) {
                this.speechSound.currentTime = 0.01;
                this.speechSound.play();
            }

            this.lastCharCount = safeCharCount;
        }

        this.displayedText = this.fullText.slice(0, safeCharCount);
    }

    draw(ctx, yOffsetOverride = null) {
        if (!this.active || this.startTime == null) return;

        const paddingX = 15;
        const paddingY = 10;
        const fontSize = 20;
        const maxWidth = 280;

        ctx.font = `bold ${fontSize}px Nunito-Italic`;

        const words = this.displayedText.split(' ');
        const lines = [];
        let currentLine = '';

        for (const word of words) {
            const testLine = currentLine + word + ' ';
            if (ctx.measureText(testLine).width < maxWidth) {
                currentLine = testLine;
            } else {
                lines.push(currentLine.trim());
                currentLine = word + ' ';
            }
        }

        lines.push(currentLine.trim());

        const longestLine = Math.max(...lines.map(line => ctx.measureText(line).width));
        const bubbleWidth = Math.max(40, longestLine + paddingX * 2);
        const bubbleHeight = Math.max(28, lines.length * (fontSize + 5) + paddingY * 2);
        const yOff = yOffsetOverride ?? this.yOffset;

        let x, y;
        if (this.type === "info" && this.target === "canvas") {
            x = ctx.canvas.width / 2 - bubbleWidth / 2;
            y = 20;
        } else {
            const anchor = this.getTargetAnchor();
            if (!anchor) return;

            x = anchor.headX - bubbleWidth / 2;
            y = anchor.headY - bubbleHeight - yOff + this.floatOffset;
        }

        const gradient = ctx.createLinearGradient(0, y, 0, y + bubbleHeight);
        gradient.addColorStop(0, "#fffefb");
        gradient.addColorStop(1, "#f2f2f2");

        const bubbleStroke = "rgba(255, 100, 0, 0.6)";
        const textColor = "black";

        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(x + bubbleWidth / 2, y + bubbleHeight / 2);
        ctx.scale(this.scale, this.scale);
        ctx.translate(-bubbleWidth / 2, -bubbleHeight / 2);

        ctx.shadowColor = "rgba(0,0,0,0.35)";
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 2;

        ctx.fillStyle = gradient;
        ctx.strokeStyle = bubbleStroke;
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.roundRect?.(0, 0, bubbleWidth, bubbleHeight, 12);
        ctx.fill();
        ctx.stroke();

        if (!(this.type === "info" && this.target === "canvas")) {
            ctx.beginPath();
            ctx.moveTo(bubbleWidth / 2 - 12, bubbleHeight);
            ctx.lineTo(bubbleWidth / 2, bubbleHeight + 16);
            ctx.lineTo(bubbleWidth / 2 + 12, bubbleHeight);
            ctx.quadraticCurveTo(bubbleWidth / 2, bubbleHeight + 5, bubbleWidth / 2 - 12, bubbleHeight);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }

        ctx.fillStyle = textColor;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const textX = bubbleWidth / 2;
        for (let i = 0; i < lines.length; i++) {
            const lineY = paddingY + (i + 0.5) * (fontSize + 5);
            ctx.fillText(lines[i], textX, lineY);
        }

        ctx.restore();
    }

    render(ctx, renderCameraX = 0, customYOffset = null) {
        if (!this.active) return;

        ctx.save();
        if (this.target !== 'canvas') ctx.translate(-renderCameraX, 0);
        this.draw(ctx, customYOffset);
        ctx.restore();
    }

    getRecommendedHoldMs() {
        if (this.type === "info") return 1200;
        const typeMs = this.fullText.length * this.charDelay;
        const holdMs = 450;
        return typeMs + holdMs;
    }

    getTargetAnchor() {
        if (!this.target || this.target === 'canvas') return null;

        const hb = this.target.getHitboxRect?.();

        return {
            headX: hb ? hb.cx : (this.target.x + this.target.width * 0.5),
            headY: hb ? hb.top : this.target.y
        };
    }
}