/**
 * Represents a drawable object with position and rendering data.
 */
export class DrawableObject {
    /**
     * Creates a new drawable object with default properties.
     */
    constructor() {
        this.x = 0;
        this.y = 0;
        this.img = null;
        this.width = 100;
        this.height = 100;
        this.frameSource = null;
    }

    /**
     * Loads or assigns an image and sets it on the object.
     * @param {string|HTMLImageElement} source Image path or preloaded image.
     */
    loadImage(source) {
        if (!source) return;
        if (source instanceof HTMLImageElement) {
            this.img = source;
            this.frameSource = null;
            return;
        }
        const img = new Image();
        img.src = source;
        this.img = img;
        this.frameSource = null;
    }

    /**
     * Applies a specific animation frame from a sprite sheet.
     * @param {Object} spriteSheet Sprite sheet configuration.
     * @param {string} animName Animation name.
     * @returns {boolean}
     */
    applySheetAnimFrame(spriteSheet, animName) {
        const { image, meta } = spriteSheet || {};
        if (!image || !meta) return false;
        const def =
            meta.animations?.[animName] ??
            meta.animations?.default ?? null;
        if (!def) return false;
        const frame = def.from ?? 0;
        return this.setFrameFromSheetMeta(image, meta, frame);
    }

    /**
     * Sets frame source data from sprite sheet metadata.
     * @param {HTMLImageElement} image Sprite sheet image.
     * @param {Object} meta Sprite sheet metadata.
     * @param {number} frame Frame index.
     * @returns {boolean}
     */
    setFrameFromSheetMeta(image, meta, frame) {
        if (!meta || !meta.columns || !meta.frameWidth || !meta.frameHeight) return false;
        const col = frame % meta.columns;
        const row = Math.floor(frame / meta.columns);
        this.img = image;
        this.frameSource = {
            sx: col * meta.frameWidth,
            sy: row * meta.frameHeight,
            sw: meta.frameWidth,
            sh: meta.frameHeight
        };
        return true;
    }
}