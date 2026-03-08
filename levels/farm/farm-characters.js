import { AnimatedEntity } from "../../classes/entities/animated-entity.class.js";

/**
 * Creates and initializes farm character instances.
 * @param {Object} entityImages Entity image sources.
 * @returns {Object} Character map.
 */
export function createFarmCharacters(entityImages) {
    const characters = buildFarmCharacters(entityImages);
    setupFarmCharacterAnimations(characters);
    return characters;
}

/**
 * Builds the farm character instances.
 * @param {Object} entityImages Entity image sources.
 * @returns {Object} Character map.
 */
function buildFarmCharacters(entityImages) {
    return {
        juanito: createFarmEntity(entityImages, 'juanito', 150, 150, 1600, 540),
        pollito: createFarmEntity(entityImages, 'pollito', 120, 120, 1680, 587),
        cow: createFarmEntity(entityImages, 'cow', 200, 200, 500, 495),
        bird: createFarmEntity(entityImages, 'bird', 80, 80, 1400, 178),
        drone: createFarmEntity(entityImages, 'drone', 300, 300, 5000, 190),
        portraits: buildFarmPortraits(entityImages)
    };
}

/**
 * Builds the farm character portrait instances.
 * @param {Object} entityImages Entity image sources.
 * @returns {Object} Portrait map.
 */
function buildFarmPortraits(entityImages) {
    return {
        juanito: createFarmEntity(entityImages, 'juanito', 400, 400, 5200, 100),
        pollito: createFarmEntity(entityImages, 'pollito', 400, 400, 5200, 100),
        cow: createFarmEntity(entityImages, 'cow', 400, 400, 5200, 100)
    };
}

/**
 * Creates a farm entity instance.
 * @param {Object} entityImages Entity image sources.
 * @param {string} name Entity name.
 * @param {number} width Entity width.
 * @param {number} height Entity height.
 * @param {number} x Initial X position.
 * @param {number} y Initial Y position.
 * @returns {Object} Animated entity instance.
 */
function createFarmEntity(entityImages, name, width, height, x, y) {
    return new AnimatedEntity(entityImages, name, width, height, x, y);
}

/**
 * Configures default animations for farm characters.
 * @param {Object} characters Character map.
 * @returns {void}
 */
function setupFarmCharacterAnimations(characters) {
    characters.bird.updateAnimationState('idle', 1000 / 7);
    characters.drone.updateAnimationState('idle', 1000 / 7);
}