import { ComicPanelRenderer } from "./comic-panel-renderer.class.js";

/**
 * Displays and controls a comic panel animation.
 */
export class ComicPanel {
    /**
     * Creates a new sprite animation instance.
     * @param {HTMLCanvasElement} canvas Target canvas.
     * @param {*} source Animation source data.
     */
    constructor(canvas, source) {
        this.canvas = canvas;
        this.source = source;
        this.renderer = new ComicPanelRenderer(canvas);
        this.initSourceType(source);
        this.initState();
        this.initTiming();
        this.totalFrames = this.getTotalFrames();
        this.skipFirstDraw = false;
    }

    /**
     * Initializes the source type for the panel.
     * @param {*} source Animation source data.
     * @returns {void}
     */
    initSourceType(source) {
        if (Array.isArray(source)) return this.setFrameSource(source);
        if (source?.type === 'sheet') return this.setSheetSource();
        if (source?.type === 'sheetSequence') return this.setSheetSequenceSource();
        this.setEmptyFrameSource();
    }

    /**
     * Sets a frame array as the animation source.
     * @param {Array<HTMLImageElement>} source Frame images.
     * @returns {void}
     */
    setFrameSource(source) {
        this.type = 'frames';
        this.frames = source.filter(f => f && f.complete && f.naturalWidth > 0);
    }

    /**
     * Sets a single sprite sheet as the animation source.
     * @returns {void}
     */
    setSheetSource() {
        this.type = 'sheet';
        this.frames = null;
    }

    /**
     * Sets a sprite sheet sequence as the animation source.
     * @returns {void}
     */
    setSheetSequenceSource() {
        this.type = 'sheetSequence';
        this.frames = null;
    }

    /**
     * Sets an empty frame source.
     * @returns {void}
     */
    setEmptyFrameSource() {
        this.type = 'frames';
        this.frames = [];
    }

    /**
     * Initializes the animation state.
     * @returns {void}
     */
    initState() {
        this.active = false;
        this.start = 0;
        this.frame = 0;
        this.frameTime = 0;
        this.opacity = 0;
        this.totalDuration = 0;
    }

    /**
     * Initializes animation timing settings.
     * @returns {void}
     */
    initTiming() {
        this.frameInterval = 1000 / 5.5;
        this.fadeDuration = 350;
        this.fadeOutDuration = 350;
    }

    /**
     * Returns the total number of frames for the current source.
     * @returns {number} Total frame count.
     */
    getTotalFrames() {
        if (this.type === 'frames') return this.frames?.length ?? 0;
        if (this.type === 'sheet') return this.getSheetFrameCount(this.source);
        if (this.type === 'sheetSequence') return this.getSheetSequenceFrameCount();
        return 0;
    }

    /**
     * Returns the frame count for a sprite sheet animation.
     * @param {Object} sheet Sprite sheet source.
     * @returns {number} Frame count.
     */
    getSheetFrameCount(sheet) {
        const meta = sheet.meta;
        const def = meta.animations?.default || {};
        const from = def.from ?? 0;
        const to = def.to ?? (meta.frames - 1);
        return to - from + 1;
    }

    /**
     * Returns the total frame count for a sprite sheet sequence.
     * @returns {number} Total frame count.
     */
    getSheetSequenceFrameCount() {
        const { sheets } = this.source;
        if (!Array.isArray(sheets)) return 0;
        let sum = 0;
        for (const sheet of sheets) {
            sum += this.getSheetFrameCount(sheet);
        }
        return sum;
    }

    /**
     * Activates the panel animation.
     * @param {number} timestamp Activation timestamp.
     * @returns {void}
     */
    activate(timestamp) {
        this.active = true;
        this.start = timestamp;
        this.opacity = 0;
        this.frame = 0;
        this.frameTime = timestamp;
        this.skipFirstDraw = true;
        this.totalFrames = this.getTotalFrames();
        this.totalDuration =
            this.totalFrames * this.frameInterval +
            this.fadeOutDuration;
    }

    /**
     * Updates the panel animation state.
     * @param {number} timestamp Current timestamp.
     * @returns {void}
     */
    update(timestamp) {
        if (!this.canUpdateEffect()) return;
        if (this.consumeSkipFirstDraw()) return;
        const elapsed = timestamp - this.start;
        this.updateFadeIn(elapsed);
        this.updateFrameAdvance(timestamp);
        this.updateFadeOut(elapsed);
        this.finishIfExpired(elapsed);
    }

    /**
     * Checks whether the panel animation can be updated.
     * @returns {boolean} True if the animation can be updated.
     */
    canUpdateEffect() {
        return this.active && this.totalFrames !== 0;
    }

    /**
     * Consumes the skip-first-draw flag.
     * @returns {boolean} True if the first draw was skipped.
     */
    consumeSkipFirstDraw() {
        if (!this.skipFirstDraw) return false;
        this.skipFirstDraw = false;
        return true;
    }

    /**
     * Updates the fade-in opacity.
     * @param {number} elapsed Elapsed time since activation.
     * @returns {void}
     */
    updateFadeIn(elapsed) {
        if (elapsed < this.fadeDuration) return void (this.opacity = elapsed / this.fadeDuration);
        this.opacity = 1;
    }

    /**
     * Advances the animation frame if the frame interval has passed.
     * @param {number} timestamp Current timestamp.
     * @returns {void}
     */
    updateFrameAdvance(timestamp) {
        const canAdvance = timestamp - this.frameTime > this.frameInterval;
        if (!canAdvance || this.frame >= this.totalFrames - 1) return;
        this.frame++;
        this.frameTime = timestamp;
    }

    /**
     * Updates the fade-out opacity.
     * @param {number} elapsed Elapsed time since activation.
     * @returns {void}
     */
    updateFadeOut(elapsed) {
        const fadeOutStart = this.totalFrames * this.frameInterval;
        if (elapsed <= fadeOutStart) return;
        const fadeElapsed = elapsed - fadeOutStart;
        const f = fadeElapsed / this.fadeOutDuration;
        this.opacity = Math.max(0, 1 - f);
    }

    /**
     * Deactivates the animation if its duration has expired.
     * @param {number} elapsed Elapsed time since activation.
     * @returns {void}
     */
    finishIfExpired(elapsed) {
        if (elapsed < this.totalDuration) return;
        this.active = false;
        this.opacity = 0;
    }

    /**
     * Returns the current frame rendering information.
     * @returns {Object|null} Frame info or null if unavailable.
     */
    getCurrentFrameInfo() {
        if (this.type === 'frames') return this.getFrameImageInfo();
        if (this.type === 'sheet') return this.getSheetCurrentFrameInfo(this.source);
        if (this.type === 'sheetSequence') return this.getSheetSequenceCurrentFrameInfo();
        return null;
    }

    /**
     * Returns rendering information for a frame image.
     * @returns {Object|null} Frame info or null if unavailable.
     */
    getFrameImageInfo() {
        const img = this.frames?.[this.frame];
        if (!img) return null;
        return {
            image: img,
            frameWidth: img.naturalWidth,
            frameHeight: img.naturalHeight,
            frameSource: null
        };
    }

    /**
     * Returns rendering information for the current sprite sheet frame.
     * @param {Object} sheet Sprite sheet source.
     * @returns {Object|null} Frame info or null if unavailable.
     */
    getSheetCurrentFrameInfo(sheet) {
        const { image, meta } = sheet;
        const { from, to } = this.getDefaultAnimRange(meta);
        const count = to - from + 1;
        const localIndex = Math.min(this.frame, count - 1);
        const absoluteFrame = from + localIndex;
        return this.buildSheetFrameInfo(image, meta, absoluteFrame);
    }

    /**
     * Returns rendering information for the current frame in a sprite sheet sequence.
     * @returns {Object|null} Frame info or null if unavailable.
     */
    getSheetSequenceCurrentFrameInfo() {
        const { sheets } = this.source;
        if (!Array.isArray(sheets) || sheets.length === 0) return null;
        const match = this.findSheetSequenceFrame(sheets);
        if (match) return match;
        return this.getLastSheetFrameInfo(sheets);
    }

    /**
     * Finds the sprite sheet and frame for the current sequence frame.
     * @param {Array<Object>} sheets Sprite sheet sequence.
     * @returns {Object|null} Frame info or null if not found.
     */
    findSheetSequenceFrame(sheets) {
        let remaining = this.frame;
        for (const sheet of sheets) {
            const { meta } = sheet;
            const { from, to } = this.getDefaultAnimRange(meta);
            const count = to - from + 1;
            if (remaining < count) return this.buildSequenceMatchInfo(sheet, meta, from, remaining);
            remaining -= count;
        }
        return null;
    }

    /**
     * Builds frame info for a matched sprite sheet sequence frame.
     * @param {Object} sheet Sprite sheet source.
     * @param {Object} meta Sprite sheet metadata.
     * @param {number} from Start frame index of the animation range.
     * @param {number} remaining Local frame offset within the range.
     * @returns {Object|null} Frame info or null if unavailable.
     */
    buildSequenceMatchInfo(sheet, meta, from, remaining) {
        const absoluteFrame = from + remaining;
        return this.buildSheetFrameInfo(sheet.image, meta, absoluteFrame);
    }

    /**
     * Returns rendering information for the last frame of a sheet sequence.
     * @param {Array<Object>} sheets Sprite sheet sequence.
     * @returns {Object|null} Frame info or null if unavailable.
     */
    getLastSheetFrameInfo(sheets) {
        const lastSheet = sheets[sheets.length - 1];
        const { image, meta } = lastSheet;
        const { to } = this.getDefaultAnimRange(meta);
        return this.buildSheetFrameInfo(image, meta, to);
    }

    /**
     * Returns the default animation frame range from sprite sheet metadata.
     * @param {Object} meta Sprite sheet metadata.
     * @returns {{from: number, to: number}} Frame range.
     */
    getDefaultAnimRange(meta) {
        const def = meta.animations?.default || {};
        const from = def.from ?? 0;
        const to = def.to ?? (meta.frames - 1);
        return { from, to };
    }

    /**
     * Builds rendering information for a sprite sheet frame.
     * @param {HTMLImageElement|Object} image Image source.
     * @param {Object} meta Sprite sheet metadata.
     * @param {number} absoluteFrame Absolute frame index.
     * @returns {Object} Frame rendering information.
     */
    buildSheetFrameInfo(image, meta, absoluteFrame) {
        const col = absoluteFrame % meta.columns;
        const row = Math.floor(absoluteFrame / meta.columns);
        return {
            image,
            frameWidth: meta.frameWidth,
            frameHeight: meta.frameHeight,
            frameSource: this.buildFrameSource(meta, col, row)
        };
    }

    /**
     * Builds a frame source rectangle for a sprite sheet.
     * @param {Object} meta Sprite sheet metadata.
     * @param {number} col Frame column index.
     * @param {number} row Frame row index.
     * @returns {{sx: number, sy: number, sw: number, sh: number}} Source rectangle.
     */
    buildFrameSource(meta, col, row) {
        return {
            sx: col * meta.frameWidth,
            sy: row * meta.frameHeight,
            sw: meta.frameWidth,
            sh: meta.frameHeight
        };
    }

    /**
     * Draws the object using its renderer.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @returns {void}
     */
    draw(ctx) {
        this.renderer.draw(ctx, this);
    }
}