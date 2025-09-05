class TaskWindow {
    constructor(canvas, tasks = [], width = 300, height = 200) {
        this.tasks = tasks.map(text => ({ text, done: false }));
        this.width = width;
        this.height = height;
        this.padding = 15;
        this.canvas = canvas;

        // Startposition: links außerhalb des Bildschirms
        this.x = -this.width;
        this.targetX = 5; // Endposition links unten
        this.y = this.canvas.height - this.height - 50;
        this.speed = 15; // Slidegeschwindigkeit px/frame
    }

    toggle() {
        this.isOpen = !this.isOpen;
    }

    markDone(index) {
        if (this.tasks[index]) this.tasks[index].done = true;
    }

    update() {
        if (this.isOpen && this.x < this.targetX) {
            this.x += this.speed;
            if (this.x > this.targetX) this.x = this.targetX;
        } else if (!this.isOpen && this.x > -this.width) {
            this.x -= this.speed;
            if (this.x < -this.width) this.x = -this.width;
        }
    }

    draw(ctx) {
        const fontSize = 18;
        const lineHeight = fontSize + 8;

        ctx.save();

        // Panel Hintergrund
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y + this.height);
        gradient.addColorStop(0, "rgba(245, 230, 200, 0.9)");
        gradient.addColorStop(1, "rgba(220, 200, 170, 0.9)");
        ctx.fillStyle = gradient; // <-- Hier Gradient setzen

        ctx.shadowColor = "rgba(0,0,0,0.2)";
        ctx.shadowBlur = 12;
        ctx.strokeStyle = "rgba(200, 120, 30, 0.8)"; // Rand
        ctx.lineWidth = 2;

        this.roundRect(ctx, this.x, this.y, this.width, this.height, 12);
        ctx.fill();
        ctx.stroke();

        // Aufgaben-Text
        ctx.fillStyle = "#4b3e2a"
        ctx.font = `bold ${fontSize}px Nunito-Italic`;
        let offsetY = this.y + this.padding + fontSize;

        for (let task of this.tasks) {
            ctx.fillText(task.text, this.x + this.padding, offsetY);

            if (task.done) {
                const textMetrics = ctx.measureText(task.text);
                const textMiddle = offsetY - textMetrics.actualBoundingBoxAscent / 2;

                ctx.beginPath();
                ctx.strokeStyle = "rgba(200, 120, 30, 0.8)"; // gleiche Farbe wie Rahmen, harmonisch
                ctx.lineWidth = 2;
                ctx.moveTo(this.x + this.padding, textMiddle);
                ctx.lineTo(this.x + this.padding + textMetrics.width, textMiddle);
                ctx.stroke();
            }

            offsetY += lineHeight;
        }


        ctx.restore();
    }

    // Eigenes roundRect, funktioniert in allen Browsern
    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }
}
