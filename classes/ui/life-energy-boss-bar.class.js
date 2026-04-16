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
        this.y = 50;
        this.setPercentage(100);
    }
}