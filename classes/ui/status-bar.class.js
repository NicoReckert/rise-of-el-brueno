import { DrawableObject } from '../systems/drawable-object.class.js';

/**
 * Represents a status bar with sprite sheet and fallback support.
 */
export class StatusBar extends DrawableObject {
    /**
    * Creates a new status bar instance.
    * @param {*} [spriteSheet=null] Sprite sheet reference.
    * @param {string} [animPrefix='hp'] Animation name prefix.
    */
    constructor(spriteSheet = null, animPrefix = 'hp') {
        super();
        this.height = 60;
        this.width = 250;
        this.x = 10;
        this.y = 0;
        this.percentage = 100;
        this.spriteSheet = spriteSheet;
        this.statusImages = null;
        this.animPrefix = animPrefix;
    }

    /**
    * Sets the percentage value and updates the visual state.
    * @param {number} percentage Percentage value (0–100).
    */
    setPercentage(percentage) {
        this.percentage = Math.max(0, Math.min(100, percentage));
        if (this.spriteSheet && this.applySpriteSheetFrame()) {
            return;
        }
        this.applyStatusImagesFallback();
    }

    /**
    * Applies the appropriate sprite sheet frame.
    * @returns {boolean}
    */
    applySpriteSheetFrame() {
        const animName = this.resolveAnimName();
        return this.applySheetAnimFrame(this.spriteSheet, animName);
    }

    /**
    * Applies a fallback status image if no sprite sheet is used.
    * @returns {boolean}
    */
    applyStatusImagesFallback() {
        if (!this.statusImages || !this.statusImages.length) return false;
        const index = this.resolveImageIndex();
        this.img = this.statusImages[index] ?? this.statusImages[this.statusImages.length - 1];
        this.frameSource = null;
        return true;
    }

    /**
    * Resolves the animation name based on the current percentage.
    * @returns {string}
    */
    resolveAnimName() {
        const p = this.percentage;
        let step = 0;
        if (p === 100) step = 100;
        else if (p >= 80) step = 80;
        else if (p >= 60) step = 60;
        else if (p >= 40) step = 40;
        else if (p >= 20) step = 20;
        return `${this.animPrefix}_${step}`;
    }

    /**
    * Resolves the fallback image index based on the current percentage.
    * @returns {number}
    */
    resolveImageIndex() {
        if (this.percentage === 100) return 5;
        if (this.percentage >= 80) return 4;
        if (this.percentage >= 60) return 3;
        if (this.percentage >= 40) return 2;
        if (this.percentage >= 20) return 1;
        return 0;
    }
}