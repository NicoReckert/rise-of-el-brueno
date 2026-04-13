/**
 * Creates the initial state object for the town level.
 * @returns {Object} Town state.
 */
export function createTownState() {
    return {
        ...createTownCollections(),
        ...createTownFlags(),
        ...createTadeoState(),
        ...createTownEnemyState()
    };
}

/**
 * Creates collection containers for the town state.
 * @returns {Object} Collection state properties.
 */
function createTownCollections() {
    return {
        popupTexts: [],
        damageTexts: [],
        effectsFront: [],
        effectsBehind: [],
        throwableObjects: [],
        projectiles: [],
        spiritEssenceSeq: null,
        throwHoldProgress: 0
    };
}

/**
 * Creates the town flag collection.
 * @returns {Object} Town flag collection.
 */
function createTownFlags() {
    return {
        ...createTownProgressFlags(),
        ...createTownGameStateFlags()
    };
}

/**
 * Creates the town progress flag collection.
 * @returns {Object} Town progress flag collection.
 */
function createTownProgressFlags() {
    return {
        isNearMusician: false,
        isNearSollita: false,
        isNearDestroyedHouse: false,
        isTadeoAfraid: false,
        isTadeoPanic: false,
        isTadeoArrivedNayelisHouse: false,
        comeFromNayelisHouse: false
    };
}

/**
 * Creates the town game state flag collection.
 * @returns {Object} Town game state flag collection.
 */
function createTownGameStateFlags() {
    return {
        isGameOverSequenceStarted: false,
        isGameOverFlashStarted: false,
        gameOverSwitchAt: 0,
        earthquakeStart: false,
        shakeIntensity: 0
    };
}

/**
 * Creates state values related to Tadeo.
 * @returns {Object} Tadeo state properties.
 */
function createTadeoState() {
    return {
        tadeoHelpGivenEmpty: false,
        tadeoSpeechLockUntil: 0,
        tadeoHelpUntil: 0,
        tadeoPanicProjIdx: 0,
        tadeoPanicNearIdx: 0,
        tadeoAfraidIdx: 0,
        tadeoPanicUntil: 0
    };
}

/**
 * Creates the town enemy state.
 * @returns {Object} Enemy state.
 */
function createTownEnemyState() {
    return {
        enemyHealth: 3
    };
}