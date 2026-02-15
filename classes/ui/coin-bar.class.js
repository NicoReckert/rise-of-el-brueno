import { StatusBar } from './status-bar.class.js';

/**
 * Represents a status bar that displays progress or collected items.
 * @extends StatusBar
 */
export class CoinBar extends StatusBar {
    /**
     * Creates a new status bar instance.
     * @param {Object} entityImages - Image data containing status bar graphics.
     */
    constructor(entityImages) {
        const spriteSheet = entityImages?.coinBar?.statusSheet ?? null;
        super(spriteSheet, 'coin');
        this.entityImages = entityImages;
        if (!spriteSheet) {
            this.statusImages = this.entityImages.coinBar?.status ?? [];
        }
        this.y = 50;
        this.setPercentage(0);
    }
}