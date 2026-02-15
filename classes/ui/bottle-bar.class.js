import { StatusBar } from './status-bar.class.js';

/**
 * Represents the bottle status bar.
 */
export class BottleBar extends StatusBar {
    /**
    * Creates a new bottle status bar instance.
    * @param {Object} entityImages Entity image configuration.
    */
    constructor(entityImages) {
        const spriteSheet = entityImages?.bottleBar?.statusSheet ?? null;
        super(spriteSheet, 'bottle');
        this.entityImages = entityImages;
        if (!spriteSheet) {
            this.statusImages = this.entityImages.bottleBar?.status ?? [];
        }
        this.setPercentage(0);
        this.y = 100;
    }
}
