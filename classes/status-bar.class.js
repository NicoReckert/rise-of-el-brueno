import { DrawableObject } from './drawable-object.class.js';

/**
 * Represents a status bar with percentage-based state.
 */
export class StatusBar extends DrawableObject {
    /**
    * Creates a new instance.
    * @param {*} [spriteSheet=null] Sprite sheet reference.
    */
    constructor(spriteSheet = null) {
        super();
        this.height = 60;
        this.width = 250;
        this.x = 10;
        this.y = 0;
        this.percentage = 100;
        this.spriteSheet = spriteSheet;
    }

    /**
    * Sets the status percentage and updates the sprite frame.
    * @param {number} percentage Percentage value (0–100).
    */
    setPercentage(percentage) {
        this.percentage = Math.max(0, Math.min(100, percentage));
        if (!this.spriteSheet) return;
        const { image, meta } = this.spriteSheet;
        if (!image || !meta) return;
        const animName = this.resolveAnimName();
        const def =
            meta.animations?.[animName] ??
            meta.animations?.default ??
            null;
        if (!def) return;
        const frame = def.from ?? 0;
        this.setFrameFromSheetMeta(image, meta, frame);
    }

    /**
    * Resolves the animation name based on the current percentage.
    * @returns {string}
    */
    resolveAnimName() {
        if (this.percentage === 100) return 'hp_100';
        if (this.percentage >= 80) return 'hp_80';
        if (this.percentage >= 60) return 'hp_60';
        if (this.percentage >= 40) return 'hp_40';
        if (this.percentage >= 20) return 'hp_20';
        return 'hp_0';
    }
}