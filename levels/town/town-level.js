import { Level } from '../../classes/core/level.class.js';
import { Ground } from '../../classes/entities/ground.class.js';
import { Cloud } from '../../classes/entities/cloud.class.js';
import { SceneryObject } from '../../classes/entities/scenery-object.class.js';
import { Sky } from '../../classes/entities/sky.class.js';
import { Bottle } from '../../classes/entities/bottle.class.js';

const TOWN_LEVEL_WIDTH = 26640;
const CLOUD_DENSITY = 1 / 700;
const PARALLAX_STEP = 720;
const PARALLAX_START_X = -720;
const PARALLAX_COUNT = 38;
const TOWN_TILE_START_X = 22676;
const TOWN_TILE_COUNT = 41;
const TOWN_TILE_STEP = 100;

/**
 * Creates and returns the town level instance.
 * @param {Object} params Level creation parameters.
 * @param {Object} params.entityImages Entity image assets.
 * @param {Object} params.levelImages Level image assets.
 * @returns {Level} Configured town level instance.
 */
export function createTownLevel({ entityImages, levelImages }) {
    const townLevel = new Level(createTownLevelConfig(entityImages, levelImages));
    addTownForegroundTiles(townLevel, levelImages);
    return townLevel;
}

/**
 * Creates the configuration object for the town level.
 * @param {Object} entityImages Entity image assets.
 * @param {Object} levelImages Level image assets.
 * @returns {Object} Town level configuration.
 */
function createTownLevelConfig(entityImages, levelImages) {
    return {
        clouds: createClouds(levelImages, TOWN_LEVEL_WIDTH),
        grounds: createTownGrounds(levelImages),
        sceneryObjects: createTownScenery(levelImages),
        sky: new Sky({ width: 1280, height: 720, preset: "tragicDay" }),
        coins: [],
        bottles: createTownBottles(entityImages)
    };
}

/**
 * Adds foreground ground tiles to the town level.
 * @param {Level} townLevel Town level instance.
 * @param {Object} levelImages Level image assets.
 */
function addTownForegroundTiles(townLevel, levelImages) {
    pushTownForegroundTiles(
        townLevel.grounds.foreGrounds,
        levelImages.town.ground.town2[0]
    );
}

/**
 * Creates cloud objects for the level.
 * @param {Object} levelImages Level image assets.
 * @param {number} levelWidth Width of the level.
 * @returns {Array} Array of cloud instances.
 */
function createClouds(levelImages, levelWidth) {
    const clouds = [];
    const cloudCount = Math.round(levelWidth * CLOUD_DENSITY);
    for (let i = 0; i < cloudCount; i++) {
        clouds.push(
            new Cloud({ existingClouds: clouds, minDistance: 280, levelWidth, levelImages })
        );
    }
    return clouds;
}

/**
 * Creates ground layers for the town level.
 * @param {Object} levelImages Level image assets.
 * @returns {Object} Ground layer configuration.
 */
function createTownGrounds(levelImages) {
    const { shared } = levelImages;
    return createTownGroundLayers(shared);
}

/**
 * Creates the base ground layer sets for the town level.
 * @param {Object} shared Shared level image assets.
 * @returns {Object} Object containing background, midground, and foreground layers.
 */
function createTownGroundLayers(shared) {
    return {
        backGrounds: createAlternatingGrounds(shared.desert.backB[0], shared.desert.backA[0]),
        midGrounds: createAlternatingGrounds(shared.desert.midB[0], shared.desert.midA[0]),
        foreGrounds: createAlternatingGrounds(shared.desert.foreB[0], shared.desert.foreA[0])
    };
}

/**
 * Creates a sequence of alternating ground elements.
 * @param {string} firstSrc Source of the first ground image.
 * @param {string} secondSrc Source of the second ground image.
 * @returns {Array} Array of ground instances.
 */
function createAlternatingGrounds(firstSrc, secondSrc) {
    const grounds = [];
    for (let i = 0; i < PARALLAX_COUNT; i++) {
        const src = i % 2 === 0 ? firstSrc : secondSrc;
        const x = PARALLAX_START_X + i * PARALLAX_STEP;
        grounds.push(new Ground(src, x));
    }
    return grounds;
}

/**
 * Adds tiled foreground ground elements for the town level.
 * @param {Array} foreGrounds Foreground ground elements.
 * @param {string} tileSrc Source of the tile image.
 */
function pushTownForegroundTiles(foreGrounds, tileSrc) {
    let x = TOWN_TILE_START_X;
    for (let i = 0; i < TOWN_TILE_COUNT; i++) {
        foreGrounds.push(new Ground(tileSrc, x, 572, 300, 150));
        x += TOWN_TILE_STEP;
    }
}

/**
 * Creates scenery objects for the town level.
 * @param {Object} levelImages Level image assets.
 * @returns {Array} Array of scenery object instances.
 */
function createTownScenery(levelImages) {
    const { scenery } = levelImages.town;
    return [
        new SceneryObject(scenery.nayeliHouse[0], 20000, 275, 550, 450),
        new SceneryObject(scenery.town1[0], 22676, 5, 1000, 800),
        new SceneryObject(scenery.town2[0], 23618, -105, 1000, 1000),
        new SceneryObject(scenery.town4[0], 24523, -35, 800, 800),
        new SceneryObject(scenery.town5[0], 25338, -18, 800, 800),
        new SceneryObject(scenery.town6[0], 26038, -17, 1000, 800)
    ];
}

/**
 * Creates bottle entities for the town level.
 * @param {Object} entityImages Entity image assets.
 * @returns {Array} Array of bottle instances.
 */
function createTownBottles(entityImages) {
    return [
        new Bottle(entityImages, 1500),
        new Bottle(entityImages, 1550)
    ];
}