/**
 * Represents a status bar that displays progress or collected items.
 * @extends StatusBar
 */
class CoinBar extends StatusBar {
    /**
     * Creates a new status bar instance.
     * @param {Object} entityImages - Image data containing status bar graphics.
     */
    constructor(entityImages) {
        super();
        this.entityImages = entityImages;
        this.statusImages = this.entityImages.coinBar.status || [];
        this.setPercentage(0);
        this.y = 50;
    }
}