import { StatusBar } from './status-bar.class.js';

/**
 * Represents the life energy status bar for the character.
 */
export class LifeEnergyCharacterBar extends StatusBar {
    /**
    * Creates a new life energy character bar instance.
    * @param {Object} entityImages Entity image configuration.
    */
    constructor(entityImages) {
        const spriteSheet = entityImages?.lifeEnergyCharacter?.statusSheet ?? null;
        super(spriteSheet, 'hp');
        this.entityImages = entityImages;
        if (!spriteSheet) {
            this.statusImages = this.entityImages.lifeEnergyCharacter.status || [];
        }
        this.setPercentage(100);
    }
}