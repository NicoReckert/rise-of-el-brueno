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
 * Creates boolean flags used in the town state.
 * @returns {Object} Flag state properties.
 */
function createTownFlags() {
    return {
        isNearMusician: false,
        isNearSollita: false,
        isNearDestroyedHouse: false,
        isTadeoAfraid: false,
        isTadeoPanic: false,
        isTadeoArrivedNayelisHouse: false,
        comeFromNayelisHouse: false,
        isGameOverSequenceStarted: false,
        isGameOverFlashStarted: false,
        gameOverSwitchAt: 0
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