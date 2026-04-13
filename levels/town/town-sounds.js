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
        taskCompletedSfx: allAudios.taskCompletedSfx,
        newTaskSfx: allAudios.newTaskSfx,
        houseFireSfx: allAudios.houseFireSfx,
        healSfx: allAudios.healSfx,
        spiritAppearsSfx: allAudios.spiritAppearsSfx
    };
}

/**
 * Creates character-related sound references for the town level.
 * @param {Object} allAudios Audio resources.
 * @returns {Object} Character sound objects.
 */
function createTownCharacterSounds(allAudios) {
    return {
        voSoulSpeak01: allAudios.voSoulSpeak01,
        voNayeliSpirit01: allAudios.voNayeliSpirit01,
        voNayeliSpirit02: allAudios.voNayeliSpirit02,
        voTadeoSpeak01: allAudios.voTadeoSpeak01,
        voTadeoSpeak02: allAudios.voTadeoSpeak02,
        voTadeoSpeak03: allAudios.voTadeoSpeak03,
        voTadeoSpeak04: allAudios.voTadeoSpeak04,
        voTadeoSpeak05: allAudios.voTadeoSpeak05,
        voTadeoSpeak06: allAudios.voTadeoSpeak06,
        voTadeoSpeak07: allAudios.voTadeoSpeak07
    };
}

/**
 * Creates battle-related sound references for the town level.
 * @param {Object} allAudios Audio resources.
 * @returns {Object} Battle sound objects.
 */
function createTownBattleSounds(allAudios) {
    return {
        enemyHurtSfx: allAudios.enemyHurtSfx,
        attackSfx: allAudios.attackSfx,
        bossFlappingWingsSfx: allAudios.bossFlappingWingsSfx,
        fireballChargeStartSfx: allAudios.fireballChargeStartSfx,
        bossFireballChargeSfx: allAudios.bossFireballChargeSfx
    };
}

/**
 * Creates the town music sound collection.
 * @param {Object} allAudios Audio source collection.
 * @returns {Object} Town music sound collection.
 */
function createTownMusicSounds(allAudios) {
    return {
        ...createTownCoreMusicSounds(allAudios),
        ...createTownEventMusicSounds(allAudios),
        ...createTownVoiceSoundsA(allAudios),
        ...createTownVoiceSoundsB(allAudios)
    };
}

/**
 * Creates the town core music sound collection.
 * @param {Object} allAudios Audio source collection.
 * @returns {Object} Town core music sound collection.
 */
function createTownCoreMusicSounds(allAudios) {
    return {
        soulThemeMusic: allAudios.soulThemeMusic,
        tadeoThemeMusic: allAudios.tadeoThemeMusic,
        tadeoHoldStoneMusic: allAudios.tadeoHoldStoneMusic,
        musicianTownMusic: allAudios.musicianTownMusic,
        sollitaThemeMusic: allAudios.sollitaThemeMusic,
        airHitStunMusic: allAudios.airHitStunMusic
    };
}

/**
 * Creates the town event music sound collection.
 * @param {Object} allAudios Audio source collection.
 * @returns {Object} Town event music sound collection.
 */
function createTownEventMusicSounds(allAudios) {
    return {
        townDayMusic: allAudios.townDayMusic,
        sadMomentMusic: allAudios.sadMomentMusic,
        nayeliThemeMusic: allAudios.nayeliThemeMusic,
        stormHazardMusic: allAudios.stormHazardMusic,
        finalStormHazardMusic: allAudios.finalStormHazardMusic,
        bossBattleMusic: allAudios.bossBattleMusic,
        endSceneMusic: allAudios.endSceneMusic,
        happyEndMusic: allAudios.happyEndMusic
    };
}

/**
 * Creates the town voice sound collection A.
 * @param {Object} allAudios Audio source collection.
 * @returns {Object} Town voice sound collection A.
 */
function createTownVoiceSoundsA(allAudios) {
    return {
        voSollitaSpiritEcho01: allAudios.voSollitaSpiritEcho01,
        voTadeoSpiritEcho01: allAudios.voTadeoSpiritEcho01,
        voSollitaSpeak01: allAudios.voSollitaSpeak01,
        voSollitaSpeak02: allAudios.voSollitaSpeak02,
        voSollitaSpeak03: allAudios.voSollitaSpeak03,
        voSollitaSpeak04: allAudios.voSollitaSpeak04
    };
}

/**
 * Creates the town voice sound collection B.
 * @param {Object} allAudios Audio source collection.
 * @returns {Object} Town voice sound collection B.
 */
function createTownVoiceSoundsB(allAudios) {
    return {
        voUnknownSpeak01: allAudios.voUnknownSpeak01,
        voNayeliSpiritEcho01: allAudios.voNayeliSpiritEcho01,
        voSollitaSpiritEcho02: allAudios.voSollitaSpiritEcho02,
        voTadeoSpiritEcho02: allAudios.voTadeoSpiritEcho02
    };
}