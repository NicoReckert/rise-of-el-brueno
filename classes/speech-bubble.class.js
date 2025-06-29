class SpeechBubble {
    constructor(text, target, startTime) {
        this.fullText = text;
        this.displayedText = '';
        this.target = target;
        this.startTime = startTime;
        this.charDelay = 50; // ms pro Buchstabe
    }

    update(currentTime) {
        const elapsed = currentTime - this.startTime;
        const charsToShow = Math.floor(elapsed / this.charDelay);
        this.displayedText = this.fullText.slice(0, charsToShow);
    }

    draw(ctx) {
        const padding = 10;
        const fontSize = 16;
        const maxWidth = 250;

        ctx.font = `${fontSize}px Arial`;

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
        const x = this.target.x + this.target.width / 2 - bubbleWidth / 2;
        const y = this.target.y - bubbleHeight + 80;

        // Blase zeichnen (oval mit Pfeil)
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.roundRect?.(x, y, bubbleWidth, bubbleHeight, 20);
        ctx.fill();
        ctx.stroke();

        // Pfeil
        ctx.beginPath();
        ctx.moveTo(this.target.x + this.target.width / 2 - 10, y + bubbleHeight);
        ctx.lineTo(this.target.x + this.target.width / 2 + 10, y + bubbleHeight);
        ctx.lineTo(this.target.x + this.target.width / 2, y + bubbleHeight + 20);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Text zeichnen
        ctx.fillStyle = 'black';
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], x + padding, y + padding + (i + 1) * fontSize);
        }
    }
}
