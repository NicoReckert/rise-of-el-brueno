/**
 * Creates the farm sound map.
 * @param {Object} allAudios Audio sources.
 * @returns {Object} Farm sound map.
 */
export function createFarmSounds(allAudios) {
    return {
        ...createFarmMusicSounds(allAudios),
        ...createFarmAmbientSounds(allAudios),
        ...createFarmActionSounds(allAudios),
        ...createFarmAnimalSounds(allAudios)
    };
}

/**
 * Creates the farm music sound map.
 * @param {Object} allAudios Audio sources.
 * @returns {Object} Music sound map.
 */
function createFarmMusicSounds(allAudios) {
    return {
        farmMusic: allAudios.farmMusic,
        nightMusic: allAudios.nightMusic,
        sadMusic: allAudios.sadMusic,
        happyTogetherMusic: allAudios.happyTogetherMusic,
        determinedMusic: allAudios.determinedMusic,
        sadSoulMusic: allAudios.sadSoulMusic
    };
}

/**
 * Creates the farm ambient sound map.
 * @param {Object} allAudios Audio sources.
 * @returns {Object} Ambient sound map.
 */
function createFarmAmbientSounds(allAudios) {
    return {
        droneSound: allAudios.droneSound,
        droneControlledSound: allAudios.droneControlledSound,
        eveningSound: allAudios.eveningSound,
        yawningSound: allAudios.yawningSound,
        snoringSound: allAudios.snoringSound,
        earthquakeSound: allAudios.earthquakeSound,
        windSound: allAudios.windSound
    };
}

/**
 * Creates the farm action sound map.
 * @param {Object} allAudios Audio sources.
 * @returns {Object} Action sound map.
 */
function createFarmActionSounds(allAudios) {
    return {
        newTaskSound: allAudios.newTaskSound,
        taskCompletedSound: allAudios.taskCompletedSound,
        taskCompletedSound2: allAudios.taskCompletedSound.cloneNode(),
        doorOpeningSound: allAudios.doorOpeningSound,
        doorClosingSound: allAudios.doorClosingSound,
        attackSound: allAudios.attackSound
    };
}

/**
 * Creates the farm animal sound map.
 * @param {Object} allAudios Audio sources.
 * @returns {Object} Animal sound map.
 */
function createFarmAnimalSounds(allAudios) {
    return {
        cowSound: allAudios.cowSound,
        cowSound2: allAudios.cowSound2
    };
}