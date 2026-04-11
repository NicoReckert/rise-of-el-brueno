/**
 * Creates the farm state object.
 * @returns {Object} Farm state.
 */
export function createFarmState() {
    return {
        ...createFarmFlags(),
        ...createFarmEffectState(),
        popupTexts: [],
        activePortrait: null
    };
}

/**
 * Creates the farm flag state.
 * @returns {Object} Farm flags.
 */
function createFarmFlags() {
    return {
        isGameCharacterInHouse: false,
        doorState: 'closed',
        timeOnStable: null,
        isNight: false,
        comeFromStable: false,
        prologVideoStarted: false,
        prologVideoFinished: false,
    };
}

/**
 * Creates the farm effect state.
 * @returns {Object} Farm effect state.
 */
function createFarmEffectState() {
    return {
        darknessLevel: 0,
        maxDarkness: 0.9,
        lastDarknessTimestamp: null,
        earthquakeStart: false,
        shakeIntensity: 20
    };
}