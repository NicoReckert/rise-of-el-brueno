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
     * Loads an image and assigns it to the object.
     * @param {string} path Image source path.
     */
    loadImage(path) {
        const img = new Image();
        img.src = path;
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