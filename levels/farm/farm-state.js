/**
 * Creates the farm state object.
 * @returns {Object} Farm state.
 */
export function createFarmState() {
    return {
        ...createFarmFlags(),
        ...createFarmAudioState(),
        ...createFarmEffectState(),
        popupTexts: []
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
        comeFromStable: false
    };
}

/**
 * Creates the farm audio state.
 * @returns {Object} Farm audio state.
 */
function createFarmAudioState() {
    return {
        volumeLevel: 0.6,
        volumeLevel2: 0.8,
        minVolumeLevel: 0
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
        earthquakeStart: false,
        shakeIntensity: 20
    };
}