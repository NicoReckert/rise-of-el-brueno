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
        farmDayMusic: allAudios.farmDayMusic,
        farmNightMusic: allAudios.farmNightMusic,
        sadMusic: allAudios.sadMusic,
        happyTogetherMusic: allAudios.happyTogetherMusic,
        determinedMusic: allAudios.determinedMusic
    };
}

/**
 * Creates the farm ambient sound map.
 * @param {Object} allAudios Audio sources.
 * @returns {Object} Ambient sound map.
 */
function createFarmAmbientSounds(allAudios) {
    return {
        droneIdleSfx: allAudios.droneIdleSfx,
        droneControlledSfx: allAudios.droneControlledSfx,
        farmNightAmbience: allAudios.farmNightAmbience,
        yawningSfx: allAudios.yawningSfx,
        snoringSfx: allAudios.snoringSfx,
        earthquakeSfx: allAudios.earthquakeSfx,
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
        newTaskSfx: allAudios.newTaskSfx,
        taskCompletedSfx: allAudios.taskCompletedSfx,
        doorOpenSfx: allAudios.doorOpenSfx,
        doorCloseSfx: allAudios.doorCloseSfx,
        attackSfx: allAudios.attackSfx
    };
}

/**
 * Creates the farm animal sound map.
 * @param {Object} allAudios Audio sources.
 * @returns {Object} Animal sound map.
 */
function createFarmAnimalSounds(allAudios) {
    return {
        cowSfx01: allAudios.cowSfx01,
        cowSfx02: allAudios.cowSfx02
    };
}