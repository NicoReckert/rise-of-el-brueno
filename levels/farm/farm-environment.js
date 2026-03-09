import { AnimatedEntity } from "../../classes/entities/animated-entity.class.js";

/**
 * Creates the farm environment entities.
 * @param {Object} entityImages Entity image sources.
 * @returns {Object} Environment map.
 */
export function createFarmEnvironment(entityImages) {
    const environment = {
        pond: createEnvEntity(entityImages, 'pond', 500, 600, -28, 320),
        trees: createFarmTrees(entityImages),
        flowers: createFarmFlowers(entityImages),
        house: createEnvEntity(entityImages, 'house', 900, 900, 800, -30),
        stable: createEnvEntity(entityImages, 'stable', 600, 600, 1550, 177),
        clock: createEnvEntity(entityImages, 'clock', 150, 150, 5320, 400),
        campfire: createEnvEntity(entityImages, 'campfire', 200, 200, 650, 520),
        sun: createEnvEntity(entityImages, 'sun', 250, 250, 3000, 50),
        moon: createEnvEntity(entityImages, 'moon', 200, 200, 3000, 50)
    };
    setupFarmEnvironmentFlip(environment);
    return environment;
}

/**
 * Creates the farm tree entities.
 * @param {Object} entityImages Entity image sources.
 * @returns {Array<Object>} Tree entity list.
 */
function createFarmTrees(entityImages) {
    return [
        createEnvEntity(entityImages, 'treeA', 450, 450, 500, 250),
        createEnvEntity(entityImages, 'treeB', 450, 450, 4600, 250),
        createEnvEntity(entityImages, 'treeC', 450, 450, 5700, 255)
    ];
}

/**
 * Creates the farm flower entities.
 * @param {Object} entityImages Entity image sources.
 * @returns {Array<Object>} Flower entity list.
 */
function createFarmFlowers(entityImages) {
    return [
        createEnvEntity(entityImages, 'flowerA', 65, 65, 5650, 600),
        createEnvEntity(entityImages, 'flowerB', 65, 65, 5600, 600),
        createEnvEntity(entityImages, 'flowerC', 65, 65, 5550, 600),
        createEnvEntity(entityImages, 'flowerA', 65, 65, 5070, 600),
        createEnvEntity(entityImages, 'flowerB', 65, 65, 5120, 600),
        createEnvEntity(entityImages, 'flowerC', 65, 65, 5170, 600),
        createEnvEntity(entityImages, 'flowerA', 65, 65, 4730, 600),
        createEnvEntity(entityImages, 'flowerA', 65, 65, 4800, 600)
    ];
}

/**
 * Creates an environment entity instance.
 * @param {Object} entityImages Entity image sources.
 * @param {string} name Entity name.
 * @param {number} width Entity width.
 * @param {number} height Entity height.
 * @param {number} x Initial X position.
 * @param {number} y Initial Y position.
 * @returns {Object} Animated entity instance.
 */
function createEnvEntity(entityImages, name, width, height, x, y) {
    return new AnimatedEntity(entityImages, name, width, height, x, y);
}

/**
 * Sets initial flip states for farm environment entities.
 * @param {Object} environment Environment map.
 * @returns {void}
 */
function setupFarmEnvironmentFlip(environment) {
    environment.pond.isFlipped = false;
    environment.house.isFlipped = false;
    environment.stable.isFlipped = false;
}