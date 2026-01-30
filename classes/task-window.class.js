export class TaskWindow {
    constructor(canvas, tasks = [], width = 360, y = 70) {
        this.tasks = tasks.map((text, i) => ({
            text,
            done: false,
            active: i === 0, // erste Aufgabe aktiv
        }));
        this.width = width;
        this.padding = 40;
        this.canvas = canvas;
        this.lastUpdateTime = null;
        this.deltaTime = 1 / 60;
        this.speed = 15;

        // Typografie / Layout
        this.fontSize = 20;   // etwas größer
        this.lineGap = 12;   // mehr Luft
        this.highlightActive = true; // dezenter Hintergrund für aktive Zeile
        this.textOutline = true;     // mini-outline via strokeText

        // Linke Akzentleiste für aktive Zeile
        this.activeAccentWidth = 4;                   // 0 = aus
        this.activeAccentColor = "rgba(215,140,30,0.9)";

        // Start-Position (oben links)
        this.x = -this.width;
        this.targetX = 20;
        this.y = y;
        this.speed = 15;
        this.isOpen = false;

        // Hintergrundbild
        this.bgImage = new Image();
        this.bgLoaded = false;
        this.bgImage.onload = () => (this.bgLoaded = true);
        this.bgImage.onerror = () => (this.bgLoaded = false);
        this.bgImage.src = "./assets/img/background-task-window.webp";

        // Overlay über dem Bild, um Text klarer zu machen (0 = aus, 0.2 ≈ dezent)
        this.bgOverlayAlpha = 0.30;

        // initiale Höhe (wird im draw per Wrapping neu berechnet)
        const lh = this.fontSize + this.lineGap;
        this.height = this.tasks.length * lh + this.padding * 2;
    }

    toggle() { this.isOpen = !this.isOpen; }
    markDone(index) { if (this.tasks[index]) this.tasks[index].done = true; }
    setActive(index) { this.tasks.forEach((t, i) => (t.active = i === index)); }

    update(timestamp) {
        this.updateDeltaTime(timestamp);

        const step = this.speed * this.deltaTime * 60;

        if (this.isOpen && this.x < this.targetX) {
            this.x += step;
            if (this.x > this.targetX) this.x = this.targetX;
        }
        else if (!this.isOpen && this.x > -this.width) {
            this.x -= step;
            if (this.x < -this.width) this.x = -this.width;
        }
    }


    updateDeltaTime(timestamp) {
        if (!this.lastUpdateTime) this.lastUpdateTime = timestamp;
        this.deltaTime = (timestamp - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = timestamp;
    }


    addTask(text, { active = false, done = false } = {}) {
        const willBeActive = !!active;
        if (willBeActive) {
            this.tasks.forEach(t => (t.active = false)); // nur eine aktiv
        }
        this.tasks.push({ text, done, active: willBeActive });
    }

    draw(ctx) {
        const fontSize = this.fontSize;
        const lineHeight = fontSize + this.lineGap;
        const maxTextWidth = this.width - 2 * this.padding;

        ctx.save();
        ctx.font = `italic bold ${fontSize}px Nunito, Nunito Sans, system-ui, -apple-system, Segoe UI, Roboto, sans-serif`;
        ctx.textBaseline = "top";

        // --- 1) Vorab: Wrap für alle Tasks berechnen & dynamische Höhe bestimmen
        const wrapped = [];
        let totalLines = 0;
        for (const t of this.tasks) {
            const lines = this._wrapText(ctx, t.text, maxTextWidth);
            wrapped.push(lines);
            totalLines += lines.length;
        }
        this.height = totalLines * lineHeight + this.padding * 2;

        // --- 2) Hintergrund (Bild + optionaler Soft-Overlay)
        ctx.save();
        this._roundedRect(ctx, this.x, this.y, this.width, this.height, 12);
        ctx.clip();

        if (this.bgLoaded) {
            ctx.drawImage(this.bgImage, this.x, this.y, this.width, this.height);
            if (this.bgOverlayAlpha > 0) {
                ctx.fillStyle = `rgba(255, 245, 230, ${this.bgOverlayAlpha})`;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        } else {
            const gradient = ctx.createLinearGradient(
                this.x, this.y, this.x + this.width, this.y + this.height
            );
            gradient.addColorStop(0, "rgba(245, 235, 210, 0.95)");
            gradient.addColorStop(1, "rgba(230, 215, 185, 0.95)");
            ctx.fillStyle = gradient;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        ctx.restore();

        // dezenter Schatten + dünner Rand
        ctx.shadowColor = "rgba(0,0,0,0.15)";
        ctx.shadowBlur = 6;
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "rgba(120, 80, 40, 0.8)";
        this._roundedRect(ctx, this.x, this.y, this.width, this.height, 12);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // --- 3) Text zeichnen (mit optionalem Active-Highlight & Outline)
        let y = this.y + this.padding;

        for (let i = 0; i < this.tasks.length; i++) {
            const task = this.tasks[i];
            const lines = wrapped[i];

            // Highlight-Streifen für aktive Aufgabe (über alle Wrap-Zeilen)
            if (this.highlightActive && task.active) {
                const h = lines.length * lineHeight - (this.lineGap); // etwas enger
                ctx.save();
                ctx.fillStyle = "rgba(200,140,40,0.12)";
                this._roundedRect(ctx, this.x + 8, y - 2, this.width - 16, h + 4, 8);
                ctx.fill();
                ctx.restore();
            }

            // Farbe setzen
            let fill = "#3a2c1b";
            if (task.active) fill = "#a8322d";
            if (task.done) fill = "#777";

            // Jeder Wrap-Abschnitt als Zeile
            for (const line of lines) {
                if (this.textOutline) {
                    ctx.lineWidth = 3 / 3; // dünne Outline
                    ctx.strokeStyle = "rgba(0,0,0,0.22)";
                    ctx.strokeText(line, this.x + this.padding, y);
                }
                ctx.fillStyle = fill;
                ctx.fillText(line, this.x + this.padding, y);
                y += lineHeight;
            }

            // Strikethrough bei erledigt – mittig über den Block
            if (task.done) {
                const widest = Math.min(
                    maxTextWidth,
                    Math.max(...lines.map(l => ctx.measureText(l).width))
                );
                const blockTop = y - lines.length * lineHeight;
                const midY = blockTop + (lines.length * lineHeight - this.lineGap) / 2;
                ctx.beginPath();
                ctx.strokeStyle = "rgba(120, 80, 40, 0.6)";
                ctx.lineWidth = 1.5;
                ctx.moveTo(this.x + this.padding, midY);
                ctx.lineTo(this.x + this.padding + widest, midY);
                ctx.stroke();
            }
        }

        ctx.restore();
    }

    // Wortumbruch (einfach & schnell)
    _wrapText(ctx, text, maxWidth) {
        const words = String(text).split(/\s+/);
        const lines = [];
        let line = "";

        for (let i = 0; i < words.length; i++) {
            const test = line ? line + " " + words[i] : words[i];
            if (ctx.measureText(test).width <= maxWidth) {
                line = test;
            } else {
                if (line) lines.push(line);
                // falls einzelnes Wort länger als maxWidth → hart umbrechen
                if (ctx.measureText(words[i]).width > maxWidth) {
                    lines.push(...this._breakLongWord(ctx, words[i], maxWidth));
                    line = "";
                } else {
                    line = words[i];
                }
            }
        }
        if (line) lines.push(line);
        return lines;
    }

    _breakLongWord(ctx, word, maxWidth) {
        const parts = [];
        let chunk = "";
        for (const ch of word) {
            const test = chunk + ch;
            if (ctx.measureText(test).width <= maxWidth) chunk = test;
            else { if (chunk) parts.push(chunk); chunk = ch; }
        }
        if (chunk) parts.push(chunk);
        return parts;
    }

    _roundedRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }
}
