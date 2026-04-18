import { StatusBar } from './status-bar.class.js';

/**
 * Represents the life energy status bar for the boss.
 */
export class LifeEnergyBossBar extends StatusBar {
    /**
     * Creates a new boss life energy bar instance.
     * @param {Object} entityImages Entity image configuration.
     */
    constructor(entityImages) {
        const spriteSheet = entityImages?.lifeEnergyBoss?.statusSheet ?? null;
        super(spriteSheet, 'boss');
        this.entityImages = entityImages;
        if (!spriteSheet) {
            this.statusImages = this.entityImages.lifeEnergyBoss?.status ?? [];
        }
        this.x = 1020;
        this.updatePosition();
        this.setPercentage(100);
        this.handleResize = () => this.updatePosition();
        window.addEventListener('resize', this.handleResize);
    }

    /**
     * Updates the position.
     * @returns {void}
     */
    updatePosition() {
        this.y = this.isTouchSmallScreen() ? 100 : 50;
    }

    /**
     * Destroys the instance.
     * @returns {void}
     */
    destroy() {
        window.removeEventListener('resize', this.handleResize);
    }

    /**
     * Checks whether the device is a touch small screen.
     * @returns {boolean} True if the device is a touch small screen, otherwise false.
     */
    isTouchSmallScreen() {
        return window.matchMedia('(pointer: coarse)').matches && window.innerWidth <= 950;
    }
}