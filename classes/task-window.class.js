class TaskWindow {
    constructor(tasks = [], width = 300, height = 200) {
        this.tasks = tasks.map(text => ({ text, done: false }));
        this.width = width;
        this.height = height;
        this.padding = 15;

        // Startposition: links außerhalb des Bildschirms
        this.x = -this.width;
        this.targetX = 50; // Endposition links unten
        this.y = window.innerHeight - this.height - 50;

        this.isOpen = true; // Direkt sichtbar für Test
        this.speed = 15; // Slidegeschwindigkeit px/frame
    }

    toggle() {
        this.isOpen = !this.isOpen;
    }

    markDone(index) {
        if (this.tasks[index]) this.tasks[index].done = true;
    }

    update(timestamp) {
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
        ctx.shadowColor = "rgba(0,0,0,0.4)";
        ctx.shadowBlur = 8;
        ctx.fillStyle = "rgba(50,50,50,0.9)";
        ctx.strokeStyle = "orangered";
        ctx.lineWidth = 2;

        this.roundRect(ctx, this.x, this.y, this.width, this.height, 12);
        ctx.fill();
        ctx.stroke();

        // Aufgaben-Text
        ctx.fillStyle = "white";
        ctx.font = `bold ${fontSize}px Nunito`;
        let offsetY = this.y + this.padding + fontSize;

        for (let task of this.tasks) {
            ctx.fillText(task.text, this.x + this.padding, offsetY);

            if (task.done) {
                const textWidth = ctx.measureText(task.text).width;
                ctx.beginPath();
                ctx.strokeStyle = "white";
                ctx.lineWidth = 2;
                ctx.moveTo(this.x + this.padding, offsetY - fontSize / 2);
                ctx.lineTo(this.x + this.padding + textWidth, offsetY - fontSize / 2);
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
