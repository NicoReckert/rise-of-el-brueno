class SpeechBubble {
    constructor(text, target = 'canvas', type = 'speech') {
        this.fullText = text;
        this.displayedText = '';
        this.target = target; // 'canvas' = HUD, sonst Character/NPC
        this.startTime = null;
        this.charDelay = 45;
        this.lastCharCount = 0;
        this.type = type;

        // Tipp-Sound nur bei speech
        if (this.type === "speech") {
            this.speechSound = new Audio('./assets/audio/speech-sound5.mp3');
            this.speechSound.volume = 0.5;
        }
    }

    start() {
        this.startTime = performance.now();
        this.displayedText = '';
        this.lastCharCount = 0;

        // Info-Bubbles sofort komplett anzeigen
        if (this.type === "info") {
            this.displayedText = this.fullText;
        }
    }

    update(currentTime) {
        if (this.type === "info") return; // Info-Bubbles werden nicht animiert

        const elapsed = currentTime - this.startTime;
        const charsToShow = Math.floor(elapsed / this.charDelay);

        const char = this.fullText.charAt(charsToShow - 1);
        if (charsToShow > this.lastCharCount && charsToShow <= this.fullText.length) {
            if (
                this.speechSound && // <-- Check hinzufügen!
                char !== ' ' &&
                /[aeiouäöü]/i.test(char) &&
                charsToShow % 2 === 0
            ) {
                this.speechSound.currentTime = 0.01;
                this.speechSound.play();
            }
            this.lastCharCount = charsToShow;
        }

        this.displayedText = this.fullText.slice(0, charsToShow);
    }

    draw(ctx, yOffset = 80) {
        const padding = 10;
        const fontSize = 20;
        const maxWidth = 250;

        ctx.font = `bold ${fontSize}px Nunito-Italic`;

        // Zeilen umbrechen
        const words = this.displayedText.split(' ');
        const lines = [];
        let currentLine = '';
        for (let word of words) {
            const testLine = currentLine + word + ' ';
            if (ctx.measureText(testLine).width < maxWidth) {
                currentLine = testLine;
            } else {
                lines.push(currentLine.trim());
                currentLine = word + ' ';
            }
        }
        lines.push(currentLine.trim());

        const bubbleWidth = maxWidth + padding * 2;
        const bubbleHeight = lines.length * (fontSize + 5) + padding * 2;

        // Position
        let x, y;
        if (this.type === "speech") {
            x = this.target.x + this.target.width / 2 - bubbleWidth / 2;
            y = this.target.y - bubbleHeight + yOffset;
        } else if (this.type === "info" && this.target === "canvas") {
            x = ctx.canvas.width / 2 - bubbleWidth / 2;
            y = 20;
        } else {
            x = this.target.x + this.target.width / 2 - bubbleWidth / 2;
            y = this.target.y - bubbleHeight + yOffset;
        }

        // Farben
        let bubbleFill, bubbleStroke, textColor, drawArrow;
        if (this.type === "speech") {
            bubbleFill = "white";
            bubbleStroke = "orangered";
            textColor = "black";
            drawArrow = true;
        } else {
            bubbleFill = "rgba(0,0,0,0.7)";
            bubbleStroke = "transparent";
            textColor = "white";
            drawArrow = false;
        }

        // Hintergrund
        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.4)";
        ctx.shadowBlur = 8;

        ctx.beginPath();
        ctx.fillStyle = bubbleFill;
        ctx.strokeStyle = bubbleStroke;
        ctx.lineWidth = 2;
        ctx.roundRect?.(x, y, bubbleWidth, bubbleHeight, 12);
        ctx.fill();
        if (bubbleStroke !== "transparent") ctx.stroke();
        ctx.restore();

        // Pfeil (nur bei Speech)
        if (drawArrow) {
            ctx.beginPath();
            ctx.fillStyle = bubbleFill;
            ctx.strokeStyle = bubbleStroke;
            ctx.moveTo(this.target.x + this.target.width / 2 - 10, y + bubbleHeight);
            ctx.lineTo(this.target.x + this.target.width / 2 + 10, y + bubbleHeight);
            ctx.lineTo(this.target.x + this.target.width / 2, y + bubbleHeight + 30);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }

        // Text
        ctx.fillStyle = textColor;
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], x + padding, y + padding + (i + 1) * fontSize);
        }
    }
}
