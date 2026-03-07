/**
 * Renderer responsible for drawing a task window.
 */
export class TaskWindowRenderer {

    /**
     * Draws the task window and its tasks.
     * @param {Object} taskWindow TaskWindow instance.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     */
    draw(taskWindow, ctx) {
        const fontSize = taskWindow.fontSize;
        const lineHeight = fontSize + taskWindow.lineGap;
        const maxTextWidth = taskWindow.width - 2 * taskWindow.padding;
        ctx.save();
        this.setupTaskFont(ctx, fontSize);
        const { wrapped, totalLines } =
            this.computeWrappedTasks(taskWindow, ctx, maxTextWidth);
        this.updateHeightFromLines(taskWindow, totalLines, lineHeight);
        this.drawBackgroundPanel(taskWindow, ctx);
        this.drawTasksList(taskWindow, ctx, wrapped, lineHeight, maxTextWidth);
        ctx.restore();
    }

    /**
     * Sets the font style used for task text.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} fontSize Font size.
     */
    setupTaskFont(ctx, fontSize) {
        ctx.font =
            `italic bold ${fontSize}px Nunito, Nunito Sans, system-ui,` +
            ` -apple-system, Segoe UI, Roboto, sans-serif`;
        ctx.textBaseline = "top";
    }

    /**
     * Updates the window height based on the number of text lines.
     * @param {Object} taskWindow TaskWindow instance.
     * @param {number} totalLines Number of lines.
     * @param {number} lineHeight Height of a single line.
     */
    updateHeightFromLines(taskWindow, totalLines, lineHeight) {
        taskWindow.height = totalLines * lineHeight + taskWindow.padding * 2;
    }

    /**
     * Computes wrapped text lines for all tasks.
     * @param {Object} taskWindow TaskWindow instance.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} maxTextWidth Maximum width for text.
     * @returns {{wrapped:Array<Array<string>>, totalLines:number}}
     */
    computeWrappedTasks(taskWindow, ctx, maxTextWidth) {
        const wrapped = [];
        let totalLines = 0;
        for (const t of taskWindow.tasks) {
            const lines = this._wrapText(ctx, t.text, maxTextWidth);
            wrapped.push(lines);
            totalLines += lines.length;
        }
        return { wrapped, totalLines };
    }

    /**
     * Draws the background panel of the task window.
     * @param {Object} taskWindow TaskWindow instance.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     */
    drawBackgroundPanel(taskWindow, ctx) {
        ctx.save();
        this._roundedRect(ctx, taskWindow.x, taskWindow.y, taskWindow.width, taskWindow.height, 12);
        ctx.clip();
        if (taskWindow.bgLoaded) this.fillBackgroundImage(taskWindow, ctx);
        else this.fillBackgroundGradient(taskWindow, ctx);
        ctx.restore();
        this.drawBackgroundBorder(taskWindow, ctx);
    }

    /**
     * Fills the background with the configured image and overlay.
     * @param {Object} taskWindow TaskWindow instance.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     */
    fillBackgroundImage(taskWindow, ctx) {
        ctx.drawImage(taskWindow.bgImage, taskWindow.x, taskWindow.y, taskWindow.width, taskWindow.height);
        if (taskWindow.bgOverlayAlpha <= 0) return;
        ctx.fillStyle = `rgba(255, 245, 230, ${taskWindow.bgOverlayAlpha})`;
        ctx.fillRect(taskWindow.x, taskWindow.y, taskWindow.width, taskWindow.height);
    }

    /**
     * Fills the background with a gradient.
     * @param {Object} taskWindow TaskWindow instance.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     */
    fillBackgroundGradient(taskWindow, ctx) {
        const g = ctx.createLinearGradient(
            taskWindow.x,
            taskWindow.y,
            taskWindow.x + taskWindow.width,
            taskWindow.y + taskWindow.height
        );
        g.addColorStop(0, "rgba(245, 235, 210, 0.95)");
        g.addColorStop(1, "rgba(230, 215, 185, 0.95)");
        ctx.fillStyle = g;
        ctx.fillRect(taskWindow.x, taskWindow.y, taskWindow.width, taskWindow.height);
    }

    /**
     * Draws the border around the background panel.
     * @param {Object} taskWindow TaskWindow instance.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     */
    drawBackgroundBorder(taskWindow, ctx) {
        ctx.shadowColor = "rgba(0,0,0,0.15)";
        ctx.shadowBlur = 6;
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "rgba(120, 80, 40, 0.8)";
        this._roundedRect(ctx, taskWindow.x, taskWindow.y, taskWindow.width, taskWindow.height, 12);
        ctx.stroke();
        ctx.shadowBlur = 0;
    }

    /**
     * Draws the list of tasks.
     * @param {Object} taskWindow TaskWindow instance.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {Array<Array<string>>} wrapped Wrapped task lines.
     * @param {number} lineHeight Height of a single line.
     * @param {number} maxTextWidth Maximum text width.
     */
    drawTasksList(taskWindow, ctx, wrapped, lineHeight, maxTextWidth) {
        let y = taskWindow.y + taskWindow.padding;
        for (let i = 0; i < taskWindow.tasks.length; i++) {
            const task = taskWindow.tasks[i];
            const lines = wrapped[i];
            if (taskWindow.highlightActive && task.active) {
                this.drawTaskHighlight(taskWindow, ctx, y, lines.length, lineHeight);
            }
            y = this.drawTaskLines(taskWindow, ctx, task, lines, y, lineHeight);
            if (task.done) {
                this.drawTaskStrikeThrough(taskWindow, ctx, lines, y, lineHeight, maxTextWidth);
            }
        }
    }

    /**
     * Draws the highlight background for the active task.
     * @param {Object} taskWindow TaskWindow instance.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} y Vertical start position.
     * @param {number} lineCount Number of lines in the task.
     * @param {number} lineHeight Height of a single line.
     */
    drawTaskHighlight(taskWindow, ctx, y, lineCount, lineHeight) {
        const h = lineCount * lineHeight - taskWindow.lineGap;
        ctx.save();
        ctx.fillStyle = "rgba(200,140,40,0.12)";
        this._roundedRect(ctx, taskWindow.x + 8, y - 2, taskWindow.width - 16, h + 4, 8);
        ctx.fill();
        ctx.restore();
    }

    /**
     * Draws the lines of a single task.
     * @param {Object} taskWindow TaskWindow instance.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {{text:string, done:boolean, active:boolean}} task Task object.
     * @param {Array<string>} lines Wrapped text lines.
     * @param {number} y Current vertical position.
     * @param {number} lineHeight Height of a single line.
     * @returns {number} Updated vertical position.
     */
    drawTaskLines(taskWindow, ctx, task, lines, y, lineHeight) {
        const fill = this.getTaskFillColor(task);
        for (const line of lines) {
            if (taskWindow.textOutline) {
                ctx.lineWidth = 1;
                ctx.strokeStyle = "rgba(0,0,0,0.22)";
                ctx.strokeText(line, taskWindow.x + taskWindow.padding, y);
            }
            ctx.fillStyle = fill;
            ctx.fillText(line, taskWindow.x + taskWindow.padding, y);
            y += lineHeight;
        }
        return y;
    }

    /**
     * Returns the fill color for a task.
     * @param {{done:boolean, active:boolean}} task Task object.
     * @returns {string} Fill color.
     */
    getTaskFillColor(task) {
        if (task.done) return "#777";
        if (task.active) return "#a8322d";
        return "#3a2c1b";
    }

    /**
     * Draws a strike-through line for completed tasks.
     * @param {Object} taskWindow TaskWindow instance.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {Array<string>} lines Wrapped text lines.
     * @param {number} y Current vertical position.
     * @param {number} lineHeight Height of a single line.
     * @param {number} maxTextWidth Maximum text width.
     */
    drawTaskStrikeThrough(taskWindow, ctx, lines, y, lineHeight, maxTextWidth) {
        const widest = this.getTaskWidestLineWidth(ctx, lines, maxTextWidth);
        const blockTop = y - lines.length * lineHeight;
        const midY =
            blockTop + (lines.length * lineHeight - taskWindow.lineGap) / 2;
        ctx.beginPath();
        ctx.strokeStyle = "rgba(120, 80, 40, 0.6)";
        ctx.lineWidth = 1.5;
        ctx.moveTo(taskWindow.x + taskWindow.padding, midY);
        ctx.lineTo(taskWindow.x + taskWindow.padding + widest, midY);
        ctx.stroke();
    }

    /**
     * Returns the width of the widest line, clamped to the maximum text width.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {Array<string>} lines Wrapped text lines.
     * @param {number} maxTextWidth Maximum text width.
     * @returns {number} Widest line width.
     */
    getTaskWidestLineWidth(ctx, lines, maxTextWidth) {
        const widths = lines.map(l => ctx.measureText(l).width);
        const max = Math.max(...widths);
        return Math.min(maxTextWidth, max);
    }

    /**
     * Wraps text into multiple lines based on the maximum width.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {string} text Input text.
     * @param {number} maxWidth Maximum line width.
     * @returns {Array<string>} Wrapped text lines.
     */
    _wrapText(ctx, text, maxWidth) {
        const words = String(text).split(/\s+/);
        const lines = [];
        let line = "";
        for (const word of words) {
            line = this._processWrappedWord(ctx, word, maxWidth, lines, line);
        }
        if (line) lines.push(line);
        return lines;
    }

    /**
     * Processes a word for wrapped text layout.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {string} word Word to process.
     * @param {number} maxWidth Maximum line width.
     * @param {Array<string>} lines Collected lines.
     * @param {string} currentLine Current line content.
     * @returns {string} Updated line content.
     */
    _processWrappedWord(ctx, word, maxWidth, lines, currentLine) {
        const test = currentLine ? currentLine + " " + word : word;
        if (ctx.measureText(test).width <= maxWidth) {
            return test;
        }
        if (currentLine) lines.push(currentLine);
        if (ctx.measureText(word).width > maxWidth) {
            const broken = this._breakLongWord(ctx, word, maxWidth);
            lines.push(...broken);
            return "";
        }
        return word;
    }

    /**
     * Breaks a long word into smaller parts that fit within the maximum width.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {string} word Word to break.
     * @param {number} maxWidth Maximum line width.
     * @returns {Array<string>} Word parts.
     */
    _breakLongWord(ctx, word, maxWidth) {
        const parts = [];
        let chunk = "";
        for (const ch of word) {
            const test = chunk + ch;
            if (ctx.measureText(test).width <= maxWidth) chunk = test;
            else {
                if (chunk) parts.push(chunk);
                chunk = ch;
            }
        }
        if (chunk) parts.push(chunk);
        return parts;
    }

    /**
     * Creates a rounded rectangle path.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} x X position.
     * @param {number} y Y position.
     * @param {number} w Width.
     * @param {number} h Height.
     * @param {number} r Corner radius.
     */
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