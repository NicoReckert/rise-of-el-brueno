class SpeechBubble {
    constructor(text, target = 'canvas', type = 'speech') {
        this.fullText = text;
        this.displayedText = '';
        this.target = target;
        this.startTime = null;
        this.charDelay = 45; // ms pro Buchstabe
        this.speechSound = new Audio('./assets/audio/speech-sound5.mp3');
        this.speechSound.volume = 0.5;
        this.lastCharCount = 0;
        this.type = type;
    }

    start() {
        this.startTime = performance.now();
        this.displayedText = '';
        this.lastCharCount = 0;
    }

    update(currentTime) {
        const elapsed = currentTime - this.startTime;
        const charsToShow = Math.floor(elapsed / this.charDelay);

        const char = this.fullText.charAt(charsToShow - 1);
        if (charsToShow > this.lastCharCount && charsToShow <= this.fullText.length) {
            if (char !== ' ' && /[aeiouäöü]/i.test(char) && charsToShow % 2 === 0) {
                this.speechSound.currentTime = 0.01;
                this.speechSound.play();
            }
            this.lastCharCount = charsToShow;
        }

        this.displayedText = this.fullText.slice(0, charsToShow);
    }

    draw(ctx, yPosition = 80) {
        const padding = 10;
        const fontSize = 20;
        const maxWidth = 250;

        ctx.font = `bold ${fontSize}px Nunito-Italic`;

        // Mehrzeiliger Text
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

        // Blasenposition
        let x = 0;
        let y = 0;
        if (this.target === 'canvas') {
            x = 25;
            y = 15;
        } else {
            x = this.target.x + this.target.width / 2 - bubbleWidth / 2;
            y = this.target.y - bubbleHeight + yPosition; // +42
        }

        let bubbleFill, bubbleStroke, textColor, drawArrow;
        if (this.type == "speech") {
            bubbleFill = "white";
            bubbleStroke = "orangered";
            textColor = "black";
            drawArrow = true;
        } else {
            bubbleFill = "rgba(0,0,0,0.7)";
            bubbleStroke = "transparent"; // kein sichtbarer Rand
            textColor = "white";
            drawArrow = false;
        }

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

        // Pfeil
        if (drawArrow) {
            ctx.beginPath();
            ctx.fillStyle = bubbleFill;   // gleiche Füllung wie Blase
            ctx.strokeStyle = bubbleStroke;
            ctx.moveTo(this.target.x + this.target.width / 2 - 10, y + bubbleHeight);
            ctx.lineTo(this.target.x + this.target.width / 2 + 10, y + bubbleHeight);
            ctx.lineTo(this.target.x + this.target.width / 2, y + bubbleHeight + 30);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }

        // Text zeichnen
        ctx.fillStyle = textColor;
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], x + padding, y + padding + (i + 1) * fontSize);
        }
    }
}
