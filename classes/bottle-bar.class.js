/**
 * Represents a status bar that displays a fill level or progress value.
 * @extends StatusBar
 */
class BottleBar extends StatusBar {
    /**
     * Creates a new status bar instance.
     * @param {Object} npcImages - Image data containing status bar graphics.
     */
    constructor(npcImages) {
        super();
        this.npcImages = npcImages;
        this.statusImages = this.npcImages.bottleBar_status || [];
        this.setPercentage(0);
        this.y = 100;
    }
}