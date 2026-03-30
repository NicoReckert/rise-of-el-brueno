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
        ...createTownSceneEnvironment(entityImages),
        flowers: createTownFlowers(entityImages)
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
        nayeliSpirit: new AnimatedEntity(entityImages, 'nayeliSpirit', 180, 180, 15500, 485),
        nayeliSpiritEcho: new AnimatedEntity(entityImages, 'nayeliSpirit', 300, 300, 27000, 150),
        sollitaSpiritEcho: new AnimatedEntity(entityImages, 'sollitaSpirit', 300, 300, 27000, 150),
        tadeoSpiritEcho: new AnimatedEntity(entityImages, 'tadeoSpirit', 250, 250, 27000, 150)
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
        macuahuitl: new AnimatedEntity(entityImages, 'macuahuitl', 150, 180, 27350, 220)
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
        fireBlue: new AnimatedEntity(entityImages, 'fireBlue', 500, 200, 27460, 120),
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
    environment.nayeliSpiritEcho.opacity = 0;
    environment.sollitaSpiritEcho.opacity = 0;
    environment.nayeliSpiritEcho.isFlipped = false
    environment.juanitoSpirit.opacity = 0;
    environment.pollitoSpirit.opacity = 0;
    environment.lolaSpirit.opacity = 0;
    environment.spiritEssence1.opacity = 0;
    environment.spiritEssence2.opacity = 0;
    environment.spiritEssence3.opacity = 0;
    environment.macuahuitl.isFlipped = false;
    environment.macuahuitl.opacity = 0;
    environment.pollitoSpirit.isFlipped = false;
    environment.fireBlue.opacity = 0;
}

/**
 * Initializes animation states for town environment entities.
 * @param {Object} environment Town environment entities.
 * @returns {void}
 */
function initTownEnvironmentAnimations(environment) {
    environment.fireBlue.updateAnimationState('idle', 1000 / 12);
    environment.houseDestroyed.updateAnimationState('idle', 1000 / 8);
}

/**
 * Creates town flower entities.
 * @param {Object} entityImages Entity images.
 * @returns {Array<Object>} Flower entities.
 */
function createTownFlowers(entityImages) {
    return [
        new AnimatedEntity(entityImages, 'flowerA', 65, 65, 27600, 600),
        new AnimatedEntity(entityImages, 'flowerA', 65, 65, 27650, 600),
        new AnimatedEntity(entityImages, 'flowerA', 65, 65, 27700, 600),
        new AnimatedEntity(entityImages, 'flowerB', 65, 65, 27750, 600),
        new AnimatedEntity(entityImages, 'flowerB', 65, 65, 27800, 600),
        new AnimatedEntity(entityImages, 'flowerB', 65, 65, 27850, 600),
        new AnimatedEntity(entityImages, 'flowerC', 65, 65, 27900, 600),
        new AnimatedEntity(entityImages, 'flowerC', 65, 65, 27950, 600),
        new AnimatedEntity(entityImages, 'flowerC', 65, 65, 28000, 600)
    ];
}