const characterImageManifest = {
    jetPackImages: Array.from({ length: 1 }, _ => `./assets/img/Pepe_Jetpack.webp`),
};

export const characterManifestImmediate = {
    idleWalkSheet: {
        type: 'sheet',
        json: './assets/img/2_character_pepe/idle_and_walk/idle/idle_and_walk_sheet.json'
    },
    jumpSheet: {
        type: 'sheet',
        json: './assets/img/2_character_pepe/jump/jump_sheet.json'
    },
    caressSheet: {
        type: 'sheet',
        json: './assets/img/2_character_pepe/caress/caress_sheet.json'
    },
    duckSheet: {
        type: 'sheet',
        json: './assets/img/2_character_pepe/duck/duck_sheet.json'
    },
    duckWalkSheet: {
        type: 'sheet',
        json: './assets/img/2_character_pepe/duck_walk/duck_walk_sheet.json'
    }

}

export const characterManifestDeferred = {
    kneelCryStandUpDeterminedSheet: {
        type: 'sheet',
        json: './assets/img/2_character_pepe/kneel_cry_and_stand_up_determined/kneel_cry_and_stand_up_determined_sheet.json'
    },
    determinedRiseSheet: {
        type: 'sheet',
        json: './assets/img/2_character_pepe/determined_rise/determined_rise_sheet.json'
    },
    sitDownAndPlayGuitarSheet: {
        type: 'sheet',
        json: './assets/img/2_character_pepe/sit_down_and_play_guitar/sit_down_and_play_guitar_sheet.json'
    },
    playGuitarAndSingSheet: {
        type: 'sheet',
        json: './assets/img/2_character_pepe/play_guitar_and_sing/play_guitar_and_sing_sheet.json'
    },
    playGuitarSheet: {
        type: 'sheet',
        json: './assets/img/2_character_pepe/play_guitar/play_guitar_sheet.json'
    },
    lightCampfireStandUpSheet: {
        type: 'sheet',
        json: './assets/img/2_character_pepe/light_campfire_and_stand_up/light_campfire_and_stand_up_sheet.json'
    },
    walkStandDeterminedSheet: {
        type: 'sheet',
        json: './assets/img/2_character_pepe/walk_and_stand_determined/walk_and_stand_determined_sheet.json'
    },
    attackStaffSheet: {
        type: 'sheet',
        json: './assets/img/2_character_pepe/attack_staff/attack_staff_sheet.json'
    }
}

export const otherLevelCharacterManifestLazy = {
    hurtDeadSheet: {
        type: 'sheet',
        json: './assets/img/2_character_pepe/hurt_and_dead/hurt_and_dead_sheet.json'
    },
    attackSwordSheet: {
        type: 'sheet',
        json: './assets/img/2_character_pepe/attack_sword/attack_sword_sheet.json'
    },
    throwSheet: {
        type: 'sheet',
        json: './assets/img/2_character_pepe/throw/throw_sheet.json'
    },
    meditationSheet: {
        type: 'sheet',
        json: './assets/img/2_character_pepe/meditation/meditation_sheet.json'
    },
    healSheet: {
        type: 'sheet',
        json: './assets/img/2_character_pepe/heal/heal_sheet.json'
    },
    newWeaponStartSheet: {
        type: 'sheetSequence',
        sheets: [
            { json: './assets/img/2_character_pepe/new_weapon_start_and_loop/start/new_weapon_start_sheet_01.json' },
            { json: './assets/img/2_character_pepe/new_weapon_start_and_loop/start/new_weapon_start_sheet_02.json' },
            { json: './assets/img/2_character_pepe/new_weapon_start_and_loop/start/new_weapon_start_sheet_03.json' }
        ]
    },
    newWeaponLoopSheet: {
        type: 'sheet',
        json: './assets/img/2_character_pepe/new_weapon_start_and_loop/loop/new_weapon_loop_sheet.json'
    },
    walkInStormCollapseSheet: {
        type: 'sheet',
        json: './assets/img/2_character_pepe/walk_in_storm_and_collapse/walk_in_storm_and_collapse_sheet.json'
    },
    standUpAfterCollapseSheet: {
        type: 'sheet',
        json: './assets/img/2_character_pepe/stand_up_after_collapse/stand_up_after_collapse_sheet.json'
    },
    protectSheet: {
        type: 'sheet',
        json: './assets/img/2_character_pepe/protect/protect_sheet.json'
    },
    airHitPainStunSheet: {
        type: 'sheet',
        json: './assets/img/2_character_pepe/air_hit_stun_and_pain_stun/air_hit_stun_and_pain_stun_sheet.json'
    }
}