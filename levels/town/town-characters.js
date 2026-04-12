import { AnimatedEntity } from '../../classes/entities/animated-entity.class.js';
import { Endboss } from '../../classes/entities/endboss.class.js';

/**
 * Creates the town character instances.
 * @param {Object} entityImages Entity image sources.
 * @param {Object} allAudios Audio sources.
 * @param {Object} world World reference.
 * @returns {Object} Character map.
 */
export function createTownCharacters(entityImages, allAudios, world) {
    const endboss = new Endboss(entityImages, allAudios, world);
    const soul = new AnimatedEntity(entityImages, 'soul', 200, 200, endboss.x + endboss.width / 2, endboss.y + 100);
    const tadeo = new AnimatedEntity(entityImages, 'tadeo', 150, 150, 17500, 515);
    const sollita = new AnimatedEntity(entityImages, 'sollita', 180, 180, 24500, 480);
    const musician = new AnimatedEntity(entityImages, 'musician', 230, 230, 24000, 435);
    sollita.isFlipped = false;
    soul.opacity = 0;
    endboss.opacity = 0;
    return { endboss, soul, tadeo, sollita, musician };
}