class SpeechBubble {
    /**
     * @param {string} text - Textinhalt der Sprechblase
     * @param {Object|string} target - Zielobjekt oder "canvas"
     * @param {string} type - "speech" oder "info"
     * @param {Object|null} allAudios - Audiosammlungen (optional)
     * @param {number} yOffset - vertikaler Abstand über dem Zielobjekt
     */
    constructor(text, target = 'canvas', type = 'speech', allAudios = null, yOffset = 80) {
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
        this.active = true;
        this.scale = 0.9; // Pop-In Startgröße

        if (this.type === "speech" && this.allAudios?.speechSound) {
            this.speechSound = this.allAudios.speechSound;
            this.speechSound.volume = 0.5;
        }
    }

    /**
     * Startet die Bubble und optional den Auto-Fade nach `duration` ms
     */
    start(duration = null) {
        this.startTime = performance.now();
        this.displayedText = '';
        this.lastCharCount = 0;
        this.active = true;
        this.scale = 0.9;
        if (duration) this.fadeOutStart = this.startTime + duration;

        if (this.type === "info") this.displayedText = this.fullText;
    }

    /**
     * Starte ein Fade-Out nach `after` ms (ab jetzt)
     */
    fadeOut(after = 3000) {
        this.fadeOutStart = performance.now() + after;
    }

    update(currentTime) {
        if (!this.startTime || this.type === "info") return;

        const elapsed = currentTime - this.startTime;
        const charsToShow = Math.floor(elapsed / this.charDelay);
        const char = this.fullText.charAt(charsToShow - 1);

        if (charsToShow > this.lastCharCount && charsToShow <= this.fullText.length) {
            if (this.speechSound && char !== ' ' && /[aeiouäöü]/i.test(char) && charsToShow % 2 === 0) {
                this.speechSound.currentTime = 0.01;
                this.speechSound.play();
            }
            this.lastCharCount = charsToShow;
        }

        this.displayedText = this.fullText.slice(0, charsToShow);
    }

    /**
     * Zeichnet die Bubble. Optional kann ein yOffset überschrieben werden.
     */
    draw(ctx, yOffsetOverride = null) {
        if (!this.active) return;

        const now = performance.now();
        const fadeInTime = 250;
        let opacity = 1;

        // Fade-In
        const elapsed = now - this.startTime;
        if (elapsed < fadeInTime) opacity = elapsed / fadeInTime;

        // Fade-Out
        if (this.fadeOutStart && now > this.fadeOutStart) {
            const fadeProgress = Math.min((now - this.fadeOutStart) / this.fadeDuration, 1);
            opacity = 1 - fadeProgress;
            if (opacity <= 0) this.active = false;
        }

        // Pop-In Effekt
        this.scale = elapsed < 200 ? 0.9 + 0.1 * (elapsed / 200) : 1;

        // Subtiler „Schwebe-Effekt“
        const floatOffset = Math.sin((now - this.startTime) / 600) * 2;

        const paddingX = 15;
        const paddingY = 10;
        const fontSize = 20;
        const maxWidth = 280;
        ctx.font = `bold ${fontSize}px Nunito-Italic`;

        // Zeilen umbrechen
        const words = this.displayedText.split(' ');
        const lines = [];
        let currentLine = '';
        for (let word of words) {
            const testLine = currentLine + word + ' ';
            if (ctx.measureText(testLine).width < maxWidth) currentLine = testLine;
            else {
                lines.push(currentLine.trim());
                currentLine = word + ' ';
            }
        }
        lines.push(currentLine.trim());

        const longestLine = Math.max(...lines.map(line => ctx.measureText(line).width));
        const bubbleWidth = Math.max(40, longestLine + paddingX * 2); // min-breite 40px
        const bubbleHeight = Math.max(28, lines.length * (fontSize + 5) + paddingY * 2); // min-höhe 28px

        // Position
        const yOff = yOffsetOverride ?? this.yOffset;
        let x, y;
        if (this.type === "info" && this.target === "canvas") {
            x = ctx.canvas.width / 2 - bubbleWidth / 2;
            y = 20; // HUD-Info fix
        } else {
            // speech + sonstige: an target ausrichten
            x = this.target.x + this.target.width / 2 - bubbleWidth / 2;
            y = this.target.y - bubbleHeight + yOff + floatOffset;
        }

        // Farben / Stile (sanfter Verlauf)
        const gradient = ctx.createLinearGradient(0, y, 0, y + bubbleHeight);
        gradient.addColorStop(0, "#fffefb");
        gradient.addColorStop(1, "#f2f2f2");
        const bubbleStroke = "rgba(255, 100, 0, 0.6)";
        const textColor = "black";

        ctx.save();
        ctx.globalAlpha = opacity;

        // Für den Scale-Effekt um das Bubble-Zentrum transformieren
        ctx.translate(x + bubbleWidth / 2, y + bubbleHeight / 2);
        ctx.scale(this.scale, this.scale);
        ctx.translate(-bubbleWidth / 2, -bubbleHeight / 2);

        // Schatten
        ctx.shadowColor = "rgba(0,0,0,0.35)";
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 2;

        // Blase
        ctx.fillStyle = gradient;
        ctx.strokeStyle = bubbleStroke;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect?.(0, 0, bubbleWidth, bubbleHeight, 12);
        ctx.fill();
        ctx.stroke();

        // Pfeil (nicht bei canvas-Info)
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

        // Text mittig
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

    /**
     * Rendert die Sprechblase automatisch mit Kameraoffset und optionalem yOffset-Override
     */
    render(ctx, renderCameraX = 0, customYOffset = null) {
        if (!this.active) return;
        ctx.save();

        if (this.target !== 'canvas') ctx.translate(-renderCameraX, 0);
        if (!this.startTime) this.start();

        this.update(performance.now());
        this.draw(ctx, customYOffset);

        ctx.restore();
    }
}