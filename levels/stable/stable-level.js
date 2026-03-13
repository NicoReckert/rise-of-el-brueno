import { Level } from '../../classes/core/level.class.js';
import { Ground } from '../../classes/entities/ground.class.js';
import { SceneryObject } from '../../classes/entities/scenery-object.class.js';

/**
 * Creates and returns the stable level configuration.
 * @param {Object} params Level creation parameters.
 * @param {Object} params.levelImages Level image assets.
 * @returns {Level} Configured stable level instance.
 */
export function createStableLevel({ levelImages }) {
    return new Level({
        grounds: createStableGrounds(levelImages),
        sceneryObjects: createStableScenery(levelImages)
    });
}

/**
 * Creates ground elements for the stable level.
 * @param {Object} levelImages Level image assets.
 * @returns {Array} Array of ground instances.
 */
function createStableGrounds(levelImages) {
    const background = levelImages.stable.ground.woodBackground[0];
    return [
        new Ground(background, 0, 0, 1280, 720),
        new Ground(background, 1278, 0, 1280, 720),
    ];
}

/**
 * Creates scenery objects for the stable level.
 * @param {Object} levelImages Level image assets.
 * @returns {Array} Array of scenery object instances.
 */
function createStableScenery(levelImages) {
    return [
        new SceneryObject(levelImages.stable.scenery.interior[0], 280, 260, 720, 480)
    ];
}