/**
 * Creates all sound objects used in the town level.
 * @param {Object} allAudios Audio resources.
 * @returns {Object} Town sound objects.
 */
export function createTownSounds(allAudios) {
    return {
        ...createTownCoreSounds(allAudios),
        ...createTownCharacterSounds(allAudios),
        ...createTownBattleSounds(allAudios),
        ...createTownMusicSounds(allAudios)
    };
}

/**
 * Creates core sound references for the town level.
 * @param {Object} allAudios Audio resources.
 * @returns {Object} Core sound objects.
 */
function createTownCoreSounds(allAudios) {
    return {
        taskCompletedSound: allAudios.taskCompletedSound,
        newTaskSound: allAudios.newTaskSound,
        houseFireSound: allAudios.houseFireSound,
        healSound: allAudios.healSound,
        spiritAppearsSound: allAudios.spiritAppearsSound
    };
}

/**
 * Creates character-related sound references for the town level.
 * @param {Object} allAudios Audio resources.
 * @returns {Object} Character sound objects.
 */
function createTownCharacterSounds(allAudios) {
    return {
        soulSpeakSound: allAudios.soulSpeakSound,
        nayelisSpiritSpeakSound: allAudios.nayelisSpiritSpeakSound,
        nayelisSpiritSpeakSound_B: allAudios.nayelisSpiritSpeakSound_B,
        tadeosSpeakSound: allAudios.tadeosSpeakSound
    };
}

/**
 * Creates battle-related sound references for the town level.
 * @param {Object} allAudios Audio resources.
 * @returns {Object} Battle sound objects.
 */
function createTownBattleSounds(allAudios) {
    return {
        enemyHurtSound: allAudios.enemyHurtSound,
        attackSound: allAudios.attackSound,
        endbossFlappingWingsSound: allAudios.endbossFlappingWingsSound,
        fireballChargeSound: allAudios.fireballChargeSound
    };
}

/**
 * Creates music sound references for the town level.
 * @param {Object} allAudios Audio resources.
 * @returns {Object} Music sound objects.
 */
function createTownMusicSounds(allAudios) {
    return {
        soulMusic: allAudios.soulMusic,
        tadeosMusic: allAudios.tadeosMusic,
        tadeoHoldStoneMusic: allAudios.tadeoHoldStoneMusic,
        musicianTownMusic: allAudios.musicianTownMusic,
        sollitasMusic: allAudios.sollitasMusic,
        airHitStunMusic: allAudios.airHitStunMusic,
        backgroundMusic: allAudios.backgroundMusic,
        sadMomentMusic: allAudios.sadMomentMusic,
        nayelisMusic: allAudios.nayelisMusic,
        stormHazardMusic: allAudios.stormHazardMusic,
        finalStormHazardMusic: allAudios.finalStormHazardMusic,
        endbossMusic: allAudios.endbossMusic,
        endSceneMusic: allAudios.endSceneMusic
    };
}