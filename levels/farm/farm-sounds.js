/**
 * Creates the farm sound collection.
 * @param {Object} allAudios Audio source collection.
 * @param {Object} audioManager Audio manager instance.
 * @returns {Object} Farm sound collection.
 */
export function createFarmSounds(allAudios, audioManager) {
    return {
        ...createFarmMusicSounds(allAudios, audioManager),
        ...createFarmAmbientSounds(allAudios, audioManager),
        ...createFarmActionSounds(allAudios),
        ...createFarmAnimalSounds(allAudios)
    };
}

/**
 * Creates the farm music sound collection.
 * @param {Object} allAudios Audio source collection.
 * @param {Object} audioManager Audio manager instance.
 * @returns {Object} Farm music sound collection.
 */
function createFarmMusicSounds(allAudios, audioManager) {
    return {
        farmDayMusic: allAudios.farmDayMusic,
        farmNightMusic: audioManager.get('farmNightMusic'),
        sadMusic: allAudios.sadMusic,
        happyTogetherMusic: allAudios.happyTogetherMusic,
        determinedMusic: allAudios.determinedMusic
    };
}

/**
 * Creates the farm ambient sound collection.
 * @param {Object} allAudios Audio source collection.
 * @param {Object} audioManager Audio manager instance.
 * @returns {Object} Farm ambient sound collection.
 */
function createFarmAmbientSounds(allAudios, audioManager) {
    return {
        droneIdleSfx: audioManager.get('droneIdleSfx'),
        droneControlledSfx: audioManager.get('droneControlledSfx'),
        farmNightAmbience: allAudios.farmNightAmbience,
        yawningSfx: audioManager.get('yawningSfx'),
        snoringSfx: audioManager.get('snoringSfx'),
        earthquakeSfx: audioManager.get('earthquakeSfx')
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