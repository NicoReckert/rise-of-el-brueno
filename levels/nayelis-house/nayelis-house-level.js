import { Level } from '../../classes/core/level.class.js';
import { SceneryObject } from '../../classes/entities/scenery-object.class.js';

/**
 * Creates and returns the Nayeli's house level configuration.
 * @param {Object} params Level creation parameters.
 * @param {Object} params.levelImages Level image assets.
 * @returns {Level} Configured Nayeli's house level instance.
 */
export function createNayelisHouseLevel({ levelImages }) {
    return new Level({
        grounds: [],
        sceneryObjects: createNayelisHouseScenery(levelImages)
    });
}

/**
 * Creates scenery objects for Nayeli's house level.
 * @param {Object} levelImages Level image assets.
 * @returns {Array} Array of scenery object instances.
 */
function createNayelisHouseScenery(levelImages) {
    return [
        new SceneryObject(levelImages.nayelisHouse.scenery.interior[0], 240, 325, 800, 400)
    ];
}