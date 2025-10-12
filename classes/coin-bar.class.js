/**
 * Represents a status bar that displays progress or collected items.
 * @extends StatusBar
 */
class CoinBar extends StatusBar {
    /**
     * Creates a new status bar instance.
     * @param {Object} npcImages - Image data containing status bar graphics.
     */
    constructor(npcImages) {
        super();
        this.npcImages = npcImages;
        this.statusImages = this.npcImages.coinBar_status || [];
        this.setPercentage(0);
        this.y = 50;
    }
}