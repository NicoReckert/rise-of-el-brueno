import { Level } from '../../classes/core/level.class.js';
import { Ground } from '../../classes/entities/ground.class.js';
import { Cloud } from '../../classes/entities/cloud.class.js';
import { SceneryObject } from '../../classes/entities/scenery-object.class.js';
import { Sky } from '../../classes/entities/sky.class.js';

const FARM_LEVEL_WIDTH = 7200;
const CLOUD_DENSITY = 1 / 700;
const PARALLAX_STEP = 720;
const PARALLAX_START_X = -720;
const PARALLAX_COUNT = 11;
const FARM_TILE_START_X = 1280;
const FARM_TILE_COUNT = 66;
const FARM_TILE_STEP = 50;

/**
 * Creates and returns the farm level configuration.
 * @param {Object} params Level creation parameters.
 * @param {Object} params.levelImages Level image assets.
 * @returns {Level} Configured farm level instance.
 */
export function createFarmLevel({ levelImages }) {
    const clouds = createClouds(levelImages, FARM_LEVEL_WIDTH);
    const grounds = createFarmGrounds(levelImages);
    const sceneryObjects = createFarmScenery(levelImages);
    const sky = new Sky({ width: 1280, height: 720, preset: "desertDay" });
    return new Level({
        clouds,
        grounds,
        sceneryObjects,
        sky
    });
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
 * Creates ground layers for the farm level.
 * @param {Object} levelImages Level image assets.
 * @returns {Object} Ground layer configuration.
 */
function createFarmGrounds(levelImages) {
    const { shared, farm } = levelImages;
    const grounds = createFarmGroundLayers(shared);
    addFarmForegroundExtras(grounds.foreGrounds, farm);
    return grounds;
}

/**
 * Creates the base ground layer sets for the farm level.
 * @param {Object} shared Shared level image assets.
 * @returns {Object} Object containing background, midground, and foreground layers.
 */
function createFarmGroundLayers(shared) {
    return {
        backGrounds: createAlternatingGrounds(shared.desert.backB[0], shared.desert.backA[0]),
        midGrounds: createAlternatingGrounds(shared.desert.midB[0], shared.desert.midA[0]),
        foreGrounds: createAlternatingGrounds(shared.desert.foreB[0], shared.desert.foreA[0])
    };
}

/**
 * Adds additional foreground ground elements for the farm level.
 * @param {Array} foreGrounds Foreground ground elements.
 * @param {Object} farm Farm-specific image assets.
 */
function addFarmForegroundExtras(foreGrounds, farm) {
    foreGrounds.push(new Ground(farm.ground.grass[0], 5033, 575, 720, 100));
    pushFarmForegroundTiles(foreGrounds, farm.ground.town3[0]);
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
 * Adds tiled foreground ground elements for the farm level.
 * @param {Array} foreGrounds Foreground ground elements.
 * @param {string} tileSrc Source of the tile image.
 */
function pushFarmForegroundTiles(foreGrounds, tileSrc) {
    let x = FARM_TILE_START_X;
    for (let i = 0; i < FARM_TILE_COUNT; i++) {
        foreGrounds.push(new Ground(tileSrc, x, 575, 150, 150));
        x += FARM_TILE_STEP;
    }
}

/**
 * Creates scenery objects for the farm level.
 * @param {Object} levelImages Level image assets.
 * @returns {Array} Array of scenery object instances.
 */
function createFarmScenery(levelImages) {
    return [
        new SceneryObject(levelImages.farm.scenery.woodenCart[0], 1310, 408, 300, 300)
    ];
}