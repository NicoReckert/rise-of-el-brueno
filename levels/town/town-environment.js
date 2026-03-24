import { AnimatedEntity } from '../../classes/entities/animated-entity.class.js';

/**
 * Creates the environment objects for the town level.
 * @param {Object} entityImages Image resources for environment entities.
 * @returns {Object} Town environment entities.
 */
export function createTownEnvironment(entityImages) {
    const environment = {
        ...createTownSpiritEnvironment(entityImages),
        ...createTownEssenceEnvironment(entityImages),
        ...createTownSceneEnvironment(entityImages)
    };
    initTownEnvironmentState(environment);
    initTownEnvironmentAnimations(environment);
    return environment;
}

/**
 * Creates spirit environment entities for the town level.
 * @param {Object} entityImages Image resources for environment entities.
 * @returns {Object} Spirit environment entities.
 */
function createTownSpiritEnvironment(entityImages) {
    return {
        juanitoSpirit: new AnimatedEntity(entityImages, 'juanitoSpirit', 150, 150, 23455, 280),
        pollitoSpirit: new AnimatedEntity(entityImages, 'pollitoSpirit', 120, 120, 23450, 350),
        lolaSpirit: new AnimatedEntity(entityImages, 'lolaSpirit', 200, 200, 23295, 330),
        nayeliSpirit: new AnimatedEntity(entityImages, 'nayeliSpirit', 180, 180, 15500, 485)
    };
}

/**
 * Creates spirit essence environment entities for the town level.
 * @param {Object} entityImages Image resources for environment entities.
 * @returns {Object} Spirit essence environment entities.
 */
function createTownEssenceEnvironment(entityImages) {
    return {
        spiritEssence1: new AnimatedEntity(entityImages, 'spiritEssence', 90, 90, 0, 0),
        spiritEssence2: new AnimatedEntity(entityImages, 'spiritEssence', 90, 90, 0, 0),
        spiritEssence3: new AnimatedEntity(entityImages, 'spiritEssence', 90, 90, 0, 0),
        macuahuitl: new AnimatedEntity(entityImages, 'macuahuitl', 120, 120, 27350, 180)
    };
}

/**
 * Creates scene environment entities for the town level.
 * @param {Object} entityImages Image resources for environment entities.
 * @returns {Object} Scene environment entities.
 */
function createTownSceneEnvironment(entityImages) {
    return {
        rockyDesertPedestal: new AnimatedEntity(entityImages, 'rockyDesertPedestal', 400, 400, 23300, 300),
        fire: new AnimatedEntity(entityImages, 'fire', 500, 500, 23455, 110),
        houseDestroyed: new AnimatedEntity(entityImages, 'houseDestroyed', 900, 800, 2000, -50),
        stableDestroyed: new AnimatedEntity(entityImages, 'stableDestroyed', 600, 600, 2720, 200),
        millDestroyed: new AnimatedEntity(entityImages, 'millDestroyed', 1100, 800, 3200, -285),
        claw: new AnimatedEntity(entityImages, 'claw', 170, 170, 3600, 450),
        feather: new AnimatedEntity(entityImages, 'feather', 80, 80, 3450, 420)
    };
}

/**
 * Initializes the default state values for town environment entities.
 * @param {Object} environment Town environment entities.
 * @returns {void}
 */
function initTownEnvironmentState(environment) {
    environment.rockyDesertPedestal.opacity = 0;
    environment.nayeliSpirit.opacity = 0;
    environment.juanitoSpirit.opacity = 0;
    environment.pollitoSpirit.opacity = 0;
    environment.lolaSpirit.opacity = 0;
    environment.spiritEssence1.opacity = 0;
    environment.spiritEssence2.opacity = 0;
    environment.spiritEssence3.opacity = 0;
    environment.fire.isFlipped = false;
    environment.macuahuitl.isFlipped = false;
    environment.pollitoSpirit.isFlipped = false;
}

/**
 * Initializes animation states for town environment entities.
 * @param {Object} environment Town environment entities.
 * @returns {void}
 */
function initTownEnvironmentAnimations(environment) {
    environment.fire.updateAnimationState('idle', 1000 / 8);
    environment.houseDestroyed.updateAnimationState('idle', 1000 / 8);
}