/**
 * Renders speech bubble visuals.
 */
export class SpeechBubbleRenderer {
    
    /**
     * Draws the dialog bubble.
     * @param {Object} bubble SpeechBubble instance.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number | null} [yOffsetOverride=null] Vertical offset override.
     * @returns {void}
     */
    draw(bubble, ctx, yOffsetOverride = null) {
        if (!bubble.active || bubble.startTime == null) return;
        const { paddingX, paddingY, fontSize, maxWidth } = this.getTextLayoutConfig();
        ctx.font = `bold ${fontSize}px Nunito-Italic`;
        const lines = this.buildLines(ctx, bubble.displayedText, maxWidth);
        const metrics = this.getBubbleMetrics(ctx, lines, paddingX, paddingY, fontSize);
        const pos = this.getBubblePosition(bubble, ctx, metrics, yOffsetOverride);
        if (!pos) return;
        this.renderBubble(bubble, ctx, lines, metrics, pos, paddingY, fontSize);
    }

    /**
     * Gets the text layout configuration.
     * @returns {{ paddingX: number, paddingY: number, fontSize: number, maxWidth: number }} Text layout configuration.
     */
    getTextLayoutConfig() {
        return {
            paddingX: 15,
            paddingY: 10,
            fontSize: 20,
            maxWidth: 280
        };
    }

    /**
     * Builds wrapped text lines.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {string} text Source text.
     * @param {number} maxWidth Maximum line width.
     * @returns {Array} Wrapped text lines.
     */
    buildLines(ctx, text, maxWidth) {
        const words = text.split(" ");
        const lines = [];
        let currentLine = "";
        for (const word of words) {
            currentLine = this.appendWordToLines(ctx, word, maxWidth, lines, currentLine);
        }
        this.pushRemainingLine(lines, currentLine);
        return this.ensureNonEmptyLines(lines);
    }

    /**
     * Appends a word to the wrapped text lines.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {string} word Current word.
     * @param {number} maxWidth Maximum line width.
     * @param {Array} lines Wrapped text lines.
     * @param {string} currentLine Current line text.
     * @returns {string} Updated current line.
     */
    appendWordToLines(ctx, word, maxWidth, lines, currentLine) {
        const testLine = currentLine + word + " ";
        if (ctx.measureText(testLine).width < maxWidth) {
            return testLine;
        }
        const trimmed = currentLine.trim();
        if (trimmed) lines.push(trimmed);
        return word + " ";
    }

    /**
     * Pushes the remaining line if it is not empty.
     * @param {Array} lines Wrapped text lines.
     * @param {string} currentLine Current line text.
     * @returns {void}
     */
    pushRemainingLine(lines, currentLine) {
        const trimmed = currentLine.trim();
        if (trimmed) lines.push(trimmed);
    }

    /**
     * Ensures that the lines array is not empty.
     * @param {Array} lines Wrapped text lines.
     * @returns {Array} Non-empty lines array.
     */
    ensureNonEmptyLines(lines) {
        return lines.length ? lines : [""];
    }

    /**
     * Gets the dialog bubble metrics.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {Array} lines Wrapped text lines.
     * @param {number} paddingX Horizontal padding.
     * @param {number} paddingY Vertical padding.
     * @param {number} fontSize Font size.
     * @returns {{ bubbleWidth: number, bubbleHeight: number }} Bubble metrics.
     */
    getBubbleMetrics(ctx, lines, paddingX, paddingY, fontSize) {
        const longest = Math.max(...lines.map(line => ctx.measureText(line).width));
        const bubbleWidth = Math.max(40, longest + paddingX * 2);
        const bubbleHeight = Math.max(
            28,
            lines.length * (fontSize + 5) + paddingY * 2
        );
        return { bubbleWidth, bubbleHeight };
    }

    /**
     * Gets the dialog bubble position.
     * @param {Object} bubble SpeechBubble instance.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {{ bubbleWidth: number, bubbleHeight: number }} metrics Bubble metrics.
     * @param {number | null} yOffsetOverride Vertical offset override.
     * @returns {{ x: number, y: number } | null} Bubble position or null if unavailable.
     */
    getBubblePosition(bubble, ctx, metrics, yOffsetOverride) {
        const { bubbleWidth, bubbleHeight } = metrics;
        const yOff = yOffsetOverride ?? bubble.yOffset;
        if (bubble.type === "info" && bubble.target === "canvas") {
            const x = ctx.canvas.width / 2 - bubbleWidth / 2;
            const y = 20;
            return { x, y };
        }
        const anchor = bubble.getTargetAnchor();
        if (!anchor) return null;
        const x = anchor.headX - bubbleWidth / 2;
        const y = anchor.headY - bubbleHeight - yOff + bubble.floatOffset;
        return { x, y };
    }

    /**
     * Renders the dialog bubble.
     * @param {Object} bubble SpeechBubble instance.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {Array} lines Wrapped text lines.
     * @param {{ bubbleWidth: number, bubbleHeight: number }} metrics Bubble metrics.
     * @param {{ x: number, y: number }} pos Bubble position.
     * @param {number} paddingY Vertical padding.
     * @param {number} fontSize Font size.
     * @returns {void}
     */
    renderBubble(bubble, ctx, lines, metrics, pos, paddingY, fontSize) {
        const { bubbleWidth, bubbleHeight } = metrics;
        const { x, y } = pos;
        const gradient = this.createBubbleGradient(ctx, y, bubbleHeight);
        ctx.save();
        this.applyBubbleTransform(bubble, ctx, x, y, bubbleWidth, bubbleHeight);
        this.drawBubbleShape(ctx, bubbleWidth, bubbleHeight, gradient);
        this.drawBubbleTailIfNeeded(bubble, ctx, bubbleWidth, bubbleHeight);
        this.drawBubbleText(ctx, lines, bubbleWidth, paddingY, fontSize);
        ctx.restore();
    }

    /**
     * Creates the dialog bubble gradient.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} y Bubble y position.
     * @param {number} bubbleHeight Bubble height.
     * @returns {CanvasGradient} Bubble gradient.
     */
    createBubbleGradient(ctx, y, bubbleHeight) {
        const g = ctx.createLinearGradient(0, y, 0, y + bubbleHeight);
        g.addColorStop(0, "#fffefb");
        g.addColorStop(1, "#f2f2f2");
        return g;
    }

    /**
     * Applies the dialog bubble transform.
     * @param {Object} bubble SpeechBubble instance.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} x Bubble x position.
     * @param {number} y Bubble y position.
     * @param {number} bubbleWidth Bubble width.
     * @param {number} bubbleHeight Bubble height.
     * @returns {void}
     */
    applyBubbleTransform(bubble, ctx, x, y, bubbleWidth, bubbleHeight) {
        ctx.globalAlpha = bubble.opacity;
        ctx.translate(x + bubbleWidth / 2, y + bubbleHeight / 2);
        ctx.scale(bubble.scale, bubble.scale);
        ctx.translate(-bubbleWidth / 2, -bubbleHeight / 2);
    }

    /**
     * Draws the dialog bubble shape.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} bubbleWidth Bubble width.
     * @param {number} bubbleHeight Bubble height.
     * @param {CanvasGradient} gradient Bubble gradient.
     * @returns {void}
     */
    drawBubbleShape(ctx, bubbleWidth, bubbleHeight, gradient) {
        ctx.shadowColor = "rgba(0,0,0,0.35)";
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 2;
        ctx.fillStyle = gradient;
        ctx.strokeStyle = "rgba(255, 100, 0, 0.6)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect?.(0, 0, bubbleWidth, bubbleHeight, 12);
        ctx.fill();
        ctx.stroke();
    }

    /**
     * Draws the dialog bubble tail if needed.
     * @param {Object} bubble SpeechBubble instance.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} bubbleWidth Bubble width.
     * @param {number} bubbleHeight Bubble height.
     * @returns {void}
     */
    drawBubbleTailIfNeeded(bubble, ctx, bubbleWidth, bubbleHeight) {
        if (bubble.type === "info" && bubble.target === "canvas") return;
        this.buildBubbleTailPath(ctx, bubbleWidth, bubbleHeight);
        ctx.fill();
        ctx.stroke();
    }

    /**
     * Builds the dialog bubble tail path.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} bubbleWidth Bubble width.
     * @param {number} bubbleHeight Bubble height.
     * @returns {void}
     */
    buildBubbleTailPath(ctx, bubbleWidth, bubbleHeight) {
        const mid = bubbleWidth / 2;
        const bottom = bubbleHeight;
        ctx.beginPath();
        ctx.moveTo(mid - 12, bottom);
        ctx.lineTo(mid, bottom + 16);
        ctx.lineTo(mid + 12, bottom);
        ctx.quadraticCurveTo(mid, bottom + 5, mid - 12, bottom);
        ctx.closePath();
    }

    /**
     * Draws the dialog bubble text.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {Array} lines Wrapped text lines.
     * @param {number} bubbleWidth Bubble width.
     * @param {number} paddingY Vertical padding.
     * @param {number} fontSize Font size.
     * @returns {void}
     */
    drawBubbleText(ctx, lines, bubbleWidth, paddingY, fontSize) {
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const textX = bubbleWidth / 2;
        for (let i = 0; i < lines.length; i++) {
            const lineY = paddingY + (i + 0.5) * (fontSize + 5);
            ctx.fillText(lines[i], textX, lineY);
        }
    }
}