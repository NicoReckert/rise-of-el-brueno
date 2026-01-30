import { StatusBar } from './status-bar.class.js';

/**
 * Represents a status bar that displays a fill level or progress value.
 * @extends StatusBar
 */
export class BottleBar extends StatusBar {
    /**
     * Creates a new status bar instance.
     * @param {Object} entityImages - Image data containing status bar graphics.
     */
    constructor(entityImages) {
        super();
        this.entityImages = entityImages;
        this.statusImages = this.entityImages.bottleBar.status || [];
        this.setPercentage(0);
        this.y = 100;
    }
}