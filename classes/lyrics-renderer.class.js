/**
 * Renders synchronized song lyrics and manages character animations.
 */
class LyricsRenderer {
    /**
     * Creates a LyricsRenderer instance.
     * @param {object} world - The game world object.
     * @param {HTMLAudioElement} audio - The audio element for synchronization.
     */
    constructor(world, audio) {
        this.world = world;
        this.ctx = this.world.ctx;
        this.canvas = this.world.canvas;
        this.audio = audio;
        this.lyrics = this.createLyrics();
    }

    /**
     * Creates the full lyrics sequence.
     * @returns {object[]} The complete lyrics array.
     */
    createLyrics() {
        return [
            ...this.createLyricsPart1(),
            ...this.createLyricsPart2(),
            ...this.createLyricsPart3()
        ];
    }

    /**
     * Creates the first part of the lyrics.
     * @returns {object[]} The first lyrics segment.
     */
    createLyricsPart1() {
        return [
            { time: 7.2, text: "Bailamos en la plaza," },
            { time: 9.3, text: "Cantando sin parar," },
            { time: 11.4, text: "Con mis amigos cerca," },
            { time: 13.5, text: "Es un día para amar." },
            { time: 15.7, text: "Juanito, Pollito, Lola, we sing," },
            { time: 20.2, text: "Happy together, joy that we bring," },
            { time: 24.1, text: "Juanito, Pollito, Lola, my friends," },
            { time: 28.2, text: "Our love and our laughter will never end." }
        ];
    }

    /**
     * Creates the second part of the lyrics.
     * @returns {object[]} The second lyrics segment.
     */
    createLyricsPart2() {
        return [
            { time: 32.1, text: "" },
            { time: 39.5, text: "Caminamos la calle," },
            { time: 41, text: "con sonrisas y fe," },
            { time: 43, text: "cada paso juntos," },
            { time: 45.5, text: "la vida se ve bien." },
            { time: 46.8, text: "Juanito, Pollito, Lola my friends," },
            { time: 52, text: "Singing together, the joy never ends," },
            { time: 55.5, text: "Juanito, Pollito, Lola we sing," }
        ];
    }

    /**
     * Creates the third part of the lyrics.
     * @returns {object[]} The third lyrics segment.
     */
    createLyricsPart3() {
        return [
            { time: 60, text: "Friendship forever, the joy that we bring." },
            { time: 64.5, text: "" },
            { time: 71.2, text: "Siempre cantando, amigos de verdad," },
            { time: 75.7, text: "Juanito, Pollito, y Lola están," },
            { time: 79.7, text: "Juanito, Pollito, Lola my friends," },
            { time: 84.1, text: "Amigos por siempre, love never ends.", duration: 1 },
            { time: 89.9, text: "" }
        ];
    }

    /**
     * Renders the current lyric line and character animation.
     * @param {HTMLAudioElement} [audio=this.audio] - The audio reference.
     * @param {object[]} [lyrics=this.lyrics] - The lyrics array.
     */
    render(audio = this.audio, lyrics = this.lyrics) {
        if (!audio || !lyrics?.length) return;
        const currentTime = audio.currentTime;
        const { line, nextLine } = this.findLines(lyrics, currentTime);
        if (!line) return;
        this.updateCharacterState(currentTime);
        const { elapsed, total, opacity } =
            this.computeTiming(line, nextLine, audio, currentTime);
        this.drawBackground(opacity);
        this.drawText(line.text, elapsed / total, opacity);
    }

    /**
     * Finds the current and next lyric lines.
     * @param {object[]} lyrics - The lyrics array.
     * @param {number} time - The current audio time.
     * @returns {{line: object|null, nextLine: object|null}} The current and next lines.
     */
    findLines(lyrics, time) {
        return {
            line: lyrics.findLast(l => time >= l.time),
            nextLine: lyrics.find(l => l.time > time)
        };
    }

    /**
     * Updates the character animation based on audio time.
     * @param {number} time - The current audio time.
     */
    updateCharacterState(time) {
        const c = this.world.character;
        c.isSitDownAndPlayGuitar = false;
        c.isPlayGuitarAndSing = false;
        c.isPlayGuitar = false;
        if (this.isIntro(time)) this.setIntroPose(c);
        else if (this.isFirstVerse(time)) this.setSingPose(c);
        else if (this.isBridgeStart(time)) this.setGuitarPose(c);
        else if (this.isSecondVerse(time)) this.setSingPose(c);
        else if (this.isBridgeEnd(time)) this.setGuitarPose(c);
        else if (this.isFinalVerse(time)) this.setSingPose(c);
        else if (this.isOutro(time)) this.setGuitarPose(c);
    }

    /** @param {number} t - Time. @returns {boolean} True if intro. */
    isIntro(t) { return t >= 0 && t <= 7.2; }

    /** @param {number} t - Time. @returns {boolean} True if first verse. */
    isFirstVerse(t) { return t > 7.2 && t <= 32.1; }

    /** @param {number} t - Time. @returns {boolean} True if bridge start. */
    isBridgeStart(t) { return t > 32.1 && t <= 39.5; }

    /** @param {number} t - Time. @returns {boolean} True if second verse. */
    isSecondVerse(t) { return t > 39.5 && t <= 64.5; }

    /** @param {number} t - Time. @returns {boolean} True if bridge end. */
    isBridgeEnd(t) { return t > 64.5 && t <= 71.2; }

    /** @param {number} t - Time. @returns {boolean} True if final verse. */
    isFinalVerse(t) { return t > 71.2 && t <= 89.9; }

    /** @param {number} t - Time. @returns {boolean} True if outro. */
    isOutro(t) { return t > 89.9 && t <= 97.0; }

    /**
     * Sets the intro pose.
     * @param {object} c - The character.
     */
    setIntroPose(c) { c.isSitDownAndPlayGuitar = true; }

    /**
     * Sets the singing pose.
     * @param {object} c - The character.
     */
    setSingPose(c) { c.isPlayGuitarAndSing = true; }

    /**
     * Sets the guitar-playing pose.
     * @param {object} c - The character.
     */
    setGuitarPose(c) { c.isPlayGuitar = true; }

    /**
     * Computes timing and opacity for the current lyric line.
     * @param {object} line - The current line.
     * @param {object|null} nextLine - The next line.
     * @param {HTMLAudioElement} audio - The audio element.
     * @param {number} time - The current time.
     * @returns {{elapsed: number, total: number, opacity: number}} Timing data.
     */
    computeTiming(line, nextLine, audio, time) {
        const lineEnd = nextLine
            ? nextLine.time
            : (line.duration ? line.time + line.duration : audio.duration);
        const elapsed = time - line.time;
        const total = lineEnd - line.time;
        const remaining = lineEnd - time;
        const opacity = this.fade(elapsed, remaining, nextLine);
        return { elapsed, total, opacity };
    }

    /**
     * Calculates opacity based on fade-in and fade-out.
     * @param {number} elapsed - Elapsed time.
     * @param {number} remaining - Remaining time.
     * @param {object|null} nextLine - The next lyric line.
     * @returns {number} The opacity value.
     */
    fade(elapsed, remaining, nextLine) {
        const fadeIn = 0.35, fadeOut = 0.35;
        if (elapsed < fadeIn) return elapsed / fadeIn;
        if (nextLine && remaining < fadeOut) return remaining / fadeOut;
        return 1;
    }

    /**
     * Draws the background gradient behind lyrics.
     * @param {number} opacity - The opacity factor.
     */
    drawBackground(opacity) {
        const ctx = this.ctx, c = this.canvas;
        const padding = 20, boxHeight = 115;
        const grad = ctx.createLinearGradient(0, c.height - boxHeight - padding, 0, c.height);
        grad.addColorStop(0, "rgba(0,0,0,0)");
        grad.addColorStop(1, `rgba(252,112,5,${0.2 * opacity})`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, c.height - boxHeight - padding, c.width, boxHeight + padding);
    }

    /**
     * Draws a lyric text with progressive highlight.
     * @param {string} text - The lyric line.
     * @param {number} progress - The progress ratio.
     * @param {number} opacity - The opacity.
     */
    drawText(text, progress, opacity) {
        const ctx = this.ctx, c = this.canvas;
        const x = c.width / 2, y = c.height - 25;
        const lines = this.wrapText(text, ctx, c.width * 0.8);
        ctx.save();
        ctx.font = "bold 32px Adventure, Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        lines.forEach((txt, i) => {
            const yPos = y - ((lines.length - 1) * 20) + i * 40;
            this.drawLine(txt, x, yPos, progress, opacity);
        });
        ctx.restore();
    }

    /**
     * Wraps text to fit within the given width.
     * @param {string} text - The text to wrap.
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @param {number} maxWidth - The maximum width for a line.
     * @returns {string[]} The wrapped lines.
     */
    wrapText(text, ctx, maxWidth) {
        const words = text.split(" ");
        const lines = [];
        let current = words[0];
        for (let i = 1; i < words.length; i++) {
            const test = current + " " + words[i];
            if (ctx.measureText(test).width < maxWidth) current = test;
            else { lines.push(current); current = words[i]; }
        }
        lines.push(current);
        return lines;
    }

    /**
     * Draws a single line of text with highlight.
     * @param {string} txt - The text line.
     * @param {number} x - X position.
     * @param {number} y - Y position.
     * @param {number} progress - The progress ratio.
     * @param {number} opacity - The opacity value.
     */
    drawLine(txt, x, y, progress, opacity) {
        const ctx = this.ctx;
        this.drawBaseText(ctx, txt, x, y, opacity);
        this.drawHighlight(ctx, txt, x, y, progress, opacity);
    }

    /**
     * Draws the base text with shadow.
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @param {string} txt - The text content.
     * @param {number} x - X position.
     * @param {number} y - Y position.
     * @param {number} opacity - The opacity.
     */
    drawBaseText(ctx, txt, x, y, opacity) {
        ctx.shadowColor = "rgba(0,0,0,0.9)";
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.lineWidth = 4;
        ctx.strokeStyle = "black";
        ctx.strokeText(txt, x, y);
        ctx.fillStyle = `rgba(200,200,200,${opacity})`;
        ctx.fillText(txt, x, y);
    }

    /**
     * Draws the highlighted part of the text.
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @param {string} txt - The text.
     * @param {number} x - X position.
     * @param {number} y - Y position.
     * @param {number} progress - The progress ratio.
     * @param {number} opacity - The opacity.
     */
    drawHighlight(ctx, txt, x, y, progress, opacity) {
        const width = ctx.measureText(txt).width;
        const highlight = width * Math.min(progress, 1);
        ctx.save();
        ctx.beginPath();
        ctx.rect(x - width / 2, y - 25, highlight, 50);
        ctx.clip();
        const g = ctx.createLinearGradient(x - width / 2, 0, x + width / 2, 0);
        g.addColorStop(0, `rgba(255,215,0,${opacity})`);
        g.addColorStop(1, `rgba(255,140,0,${opacity})`);
        ctx.fillStyle = g;
        ctx.fillText(txt, x, y);
        ctx.restore();
    }
}