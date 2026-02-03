export const farmEntityManifestImmediate = {
  cow: {
    idle: {
      type: 'sheetSequence',
      sheets: [
        { json: './assets/img/entities/cow/idle/idle_sheet_01.json' },
        { json: './assets/img/entities/cow/idle/idle_sheet_02.json' }
      ]
    },
    happy: {
      type: 'sheet',
      json: './assets/img/entities/cow/happy/happy_sheet.json'
    },
    walk: {
      type: 'sheet',
      json: './assets/img/entities/cow/walk_and_stand_up/walk_and_stand_up_sheet.json'
    },
    standUp: {
      type: 'sheet',
      json: './assets/img/entities/cow/walk_and_stand_up/walk_and_stand_up_sheet.json'
    },
    afraid: {
      type: 'sheet',
      json: './assets/img/entities/cow/afraid/afraid_sheet.json'
    },
    eat: {
      type: 'sheet',
      json: './assets/img/entities/cow/eat_and_love/eat_and_love_sheet.json'
    },
    love: {
      type: 'sheet',
      json: './assets/img/entities/cow/eat_and_love/eat_and_love_sheet.json'
    },
  },
  bird: {
    idle: {
      type: 'sheetSequence',
      sheets: [
        { json: './assets/img/entities/bird/idle/idle_sheet_01.json' },
        { json: './assets/img/entities/bird/idle/idle_sheet_02.json' }
      ]
    }
  },
  pond: {
    idle: {
      type: 'sheet',
      json: './assets/img/entities/pond/idle/idle_sheet.json',
      anim: 'treeA_idle'
    },
  },
  treeA: {
    idle: {
      type: 'sheet',
      json: './assets/img/entities/tree_A_and_B/idle/idle_tree_A_and_B_sheet.json',
      anim: 'treeA_idle'
    },
  },
  treeB: {
    idle: {
      type: 'sheet',
      json: './assets/img/entities/tree_A_and_B/idle/idle_tree_A_and_B_sheet.json',
      anim: 'treeB_idle'
    },
  },
  treeC: {
    idle: {
      type: 'sheet',
      json: './assets/img/entities/tree_C_and_D/idle/idle_tree_C_and_D_sheet.json',
      anim: 'treeC_idle'
    },
  },
  treeD: {
    idle: {
      type: 'sheet',
      json: './assets/img/entities/tree_C_and_D/idle/idle_tree_C_and_D_sheet.json',
      anim: 'treeD_idle'
    },
  },
  flowerA: {
    idle: {
      type: 'sheet',
      json: './assets/img/entities/flowers/idle/idle_A_B_C_sheet.json',
      anim: 'flowerA_idle'
    }
  },
  flowerB: {
    idle: {
      type: 'sheet',
      json: './assets/img/entities/flowers/idle/idle_A_B_C_sheet.json',
      anim: 'flowerB_idle'
    }
  },
  flowerC: {
    idle: {
      type: 'sheet',
      json: './assets/img/entities/flowers/idle/idle_A_B_C_sheet.json',
      anim: 'flowerC_idle'
    }
  },
  house: {
    idle: {
      type: 'sheet',
      json: './assets/img/entities/house/door_open_close/door_open_close_sheet.json'
    },
  },
  stable: {
    idle: {
      type: 'sheet',
      json: './assets/img/entities/stable/door_open_close/door_open_close_sheet.json'
    },
    doorOpens: {
      type: 'sheet',
      json: './assets/img/entities/stable/door_open_close/door_open_close_sheet.json'
    },
    doorCloses: {
      type: 'sheet',
      json: './assets/img/entities/stable/door_open_close/door_open_close_sheet.json'
    },
    idleOpen: {
      type: 'sheet',
      json: './assets/img/entities/stable/door_open_close/door_open_close_sheet.json'
    }
  },
  campfire: {
    idle: {
      type: 'sheet',
      json: './assets/img/entities/campfire/idle_and_burning_fire/idle_and_burning_fire_sheet.json'
    },
  },
  juanito: {
    idle: {
      type: 'sheet',
      json: './assets/img/entities/juanito/idle_and_love/idle_and_love_sheet.json'
    },
    love: {
      type: 'sheet',
      json: './assets/img/entities/juanito/idle_and_love/idle_and_love_sheet.json'
    },
  },
  pollito: {
    idle: {
      type: 'sheet',
      json: './assets/img/entities/pollito/idle_and_love/idle_and_love_sheet.json'
    },
    love: {
      type: 'sheet',
      json: './assets/img/entities/pollito/idle_and_love/idle_and_love_sheet.json'
    },
  },
  lifeEnergyCharacter: {
    status: Array.from({ length: 6 }, (_, i) => `./assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/${i * 20}.webp`)
  },
  clock: {
    idle: {
      type: 'sheet',
      json: './assets/img/entities/clock/idle/idle_sheet.json'
    }
  }
}

export const farmEntityManifestDeferred = {
  cow: {
    swingToMusic: {
      type: 'sheetSequence',
      sheets: [
        { json: './assets/img/entities/cow/swing_to_music/swing_to_music_sheet_01.json' },
        { json: './assets/img/entities/cow/swing_to_music/swing_to_music_sheet_02.json' }
      ]
    },
    sleep: {
      type: 'sheetSequence',
      sheets: [
        { json: './assets/img/entities/cow/sleep/sleep_sheet_01.json' },
        { json: './assets/img/entities/cow/sleep/sleep_sheet_02.json' }
      ]
    },
    portrait: {
      type: 'sheet',
      json: './assets/img/entities/cow/portrait/portrait_sheet.json'
    },
  },

  house: {
    doorOpens: {
      type: 'sheet',
      json: './assets/img/entities/house/door_open_close/door_open_close_sheet.json'
    },
    doorCloses: {
      type: 'sheet',
      json: './assets/img/entities/house/door_open_close/door_open_close_sheet.json'
    },
    idleOpen: {
      type: 'sheet',
      json: './assets/img/entities/house/door_open_close/door_open_close_sheet.json'
    },
  },

  campfire: {
    burningFire: {
      type: 'sheet',
      json: './assets/img/entities/campfire/idle_and_burning_fire/idle_and_burning_fire_sheet.json'
    },
    fireGoesOn: {
      type: 'sheet',
      json: './assets/img/entities/campfire/fire_goes_on_and_out/fire_goes_on_and_out_sheet.json'
    },
    fireGoesOut: {
      type: 'sheet',
      json: './assets/img/entities/campfire/fire_goes_on_and_out/fire_goes_on_and_out_sheet.json'
    }
  },

  juanito: {
    walk: {
      type: 'sheet',
      json: './assets/img/entities/juanito/walk_and_portrait/walk_and_portrait_sheet.json'
    },
    swingToMusic: {
      type: 'sheetSequence',
      sheets: [
        { json: './assets/img/entities/juanito/swing_to_music/swing_to_music_sheet_01.json' },
        { json: './assets/img/entities/juanito/swing_to_music/swing_to_music_sheet_02.json' }
      ]
    },
    sleep: {
      type: 'sheet',
      json: './assets/img/entities/juanito/sleep/sleep_sheet.json'
    },
    portrait: {
      type: 'sheet',
      json: './assets/img/entities/juanito/walk_and_portrait/walk_and_portrait_sheet.json'
    }
  },

  pollito: {
    walk: {
      type: 'sheet',
      json: './assets/img/entities/pollito/walk_and_portrait/walk_and_portrait_sheet.json'
    },
    swingToMusic: {
      type: 'sheetSequence',
      sheets: [
        { json: './assets/img/entities/pollito/swing_to_music/swing_to_music_sheet_01.json' },
        { json: './assets/img/entities/pollito/swing_to_music/swing_to_music_sheet_02.json' },
        { json: './assets/img/entities/pollito/swing_to_music/swing_to_music_sheet_03.json' }
      ]
    },
    sleep: {
      type: 'sheet',
      json: './assets/img/entities/pollito/sleep/sleep_sheet.json'
    },
    portrait: {
      type: 'sheet',
      json: './assets/img/entities/pollito/walk_and_portrait/walk_and_portrait_sheet.json'
    }
  },

  drone: {
    idle: {
      type: 'sheet',
      json: './assets/img/entities/drone/idle/idle_sheet.json'
    },
    controlled: {
      type: 'sheet',
      json: './assets/img/entities/drone/controlled/controlled_sheet.json'
    }
  },

  cowTranced: {
    walk: {
      type: 'sheet',
      json: './assets/img/entities/cow_tranced/walk/walk_sheet.json'
    }
  },

  chickenTranced: {
    walk: {
      type: 'sheet',
      json: './assets/img/entities/chicken_tranced/walk/walk_sheet.json'
    }
  },

  chickTranced: {
    walk: {
      type: 'sheet',
      json: './assets/img/entities/chick_tranced/walk/walk_sheet.json'
    }
  },

  sun: {
    idle: Array.from({ length: 10 }, (_, i) => `./assets/img/entities/sun/idle/image_${i + 1}.webp`)
  },

  moon: {
    idle: Array.from({ length: 1 }, _ => `./assets/img/entities/moon/idle/image_1.webp`),
    swingToMusic: Array.from({ length: 10 }, (_, i) => `./assets/img/entities/moon/idle/image_${i + 1}.webp`)
  },
}

export const otherLevelEntityManifestLazy = {
  soul: {
    idle: Array.from({ length: 18 }, (_, i) => `./assets/img/entities/soul/idle/image_${i + 1}.webp`),
    findsPeace: Array.from({ length: 22 }, (_, i) => `./assets/img/entities/soul/finds-peace/image_${i + 1}.webp`),
    findsPeaceLoop: Array.from({ length: 9 }, (_, i) => `./assets/img/entities/soul/finds-peace/image_${13 + i}.webp`)
  },

  nayeli: {
    idle: Array.from({ length: 10 }, (_, i) => `./assets/img/entities/nayeli/idle/image_${i + 1}.webp`)
  },

  macuahuitl: {
    idle: Array.from({ length: 30 }, (_, i) => `./assets/img/entities/macuahuitl/idle/image_${i + 1}.webp`)
  },

  memoryLight: {
    idle: Array.from({ length: 10 }, (_, i) => `./assets/img/entities/memory_light/idle/image_${i + 1}.webp`)
  },

  levelCompleteCharacter: {
    idle: Array.from({ length: 10 }, (_, i) => `./assets/img/entities/level_complete/idle/image_${i + 1}.webp`)
  },

  endboss: {
    idle: Array.from({ length: 12 }, (_, i) => `./assets/img/4_enemie_boss_chicken/0_idle/image_${i + 1}.webp`),
    walk: Array.from({ length: 4 }, (_, i) => `./assets/img/4_enemie_boss_chicken/1_walk/G${i + 1}.webp`),
    hurt: Array.from({ length: 6 }, (_, i) => `./assets/img/4_enemie_boss_chicken/4_hurt/image_${i + 1}.webp`),
    dead: Array.from({ length: 8 }, (_, i) => `./assets/img/4_enemie_boss_chicken/5_dead/image_${i + 1}.webp`),
    findsPeace: Array.from({ length: 20 }, (_, i) => `./assets/img/4_enemie_boss_chicken/6_finds_peace/image_${i + 1}.webp`),
    fly: Array.from({ length: 8 }, (_, i) => `./assets/img/4_enemie_boss_chicken/7_fly/image_${i + 1}.png`),
    fireballAttack: Array.from({ length: 14 }, (_, i) => `./assets/img/4_enemie_boss_chicken/8_fireball_attack/image_${i + 1}.png`),
    tornadoAttack: {
      type: 'sheet',
      json: './assets/img/entities/tornado/idle/idle_sheet.json'
    },
    fireBreathAttack: Array.from({ length: 3 }, (_, i) => `./assets/img/4_enemie_boss_chicken/8_fireball_attack/image_${12 + i}.png`)
  },

  chickenMutatesSmall: {
    walk: Array.from({ length: 5 }, (_, i) => `./assets/img/3_enemies_chicken/chicken_mutates/walk/image_${2 + i}.webp`),
    dead: Array.from({ length: 1 }, _ => `./assets/img/3_enemies_chicken/chicken_mutates/dead/image_1.webp`),
    hurt: Array.from({ length: 6 }, (_, i) => `./assets/img/3_enemies_chicken/chicken_mutates/hurt/image_${i + 1}.webp`),
    attack: Array.from({ length: 8 }, (_, i) => `./assets/img/3_enemies_chicken/chicken_mutates/attack/image_${i + 1}.png`)

  },

  chickenMutatesBig: {
    walk: Array.from({ length: 9 }, (_, i) => `./assets/img/3_enemies_chicken/chicken_mutates/walk2/image_${i + 1}.png`),
    dead: Array.from({ length: 1 }, _ => `./assets/img/3_enemies_chicken/chicken_mutates/dead/image_1.webp`),
    hurt: Array.from({ length: 8 }, (_, i) => `./assets/img/3_enemies_chicken/chicken_mutates/hurt2/image_${i + 1}.png`),
    attack: Array.from({ length: 9 }, (_, i) => `./assets/img/3_enemies_chicken/chicken_mutates/attack2/image_${i + 1}.png`)
  },

  dragonSmall: {
    idle: Array.from({ length: 6 }, (_, i) => `./assets/img/3_enemies_chicken/dragon_small/idle/image_${i + 1}.png`),
    airApproach: Array.from({ length: 4 }, (_, i) => `./assets/img/3_enemies_chicken/dragon_small/air_approach/image_${i + 1}.png`),
    diveStart: Array.from({ length: 4 }, (_, i) => `./assets/img/3_enemies_chicken/dragon_small/dive_start/image_${i + 1}.png`),
    diveFast: Array.from({ length: 4 }, (_, i) => `./assets/img/3_enemies_chicken/dragon_small/dive_fast/image_${i + 1}.png`),
    attack: Array.from({ length: 3 }, (_, i) => `./assets/img/3_enemies_chicken/dragon_small/attack/image_${i + 1}.png`),
    diveUpShallow: Array.from({ length: 4 }, (_, i) => `./assets/img/3_enemies_chicken/dragon_small/dive_up_shallow/image_${i + 1}.png`),
    diveUpMedium: Array.from({ length: 4 }, (_, i) => `./assets/img/3_enemies_chicken/dragon_small/dive_up_medium/image_${i + 1}.png`),
    diveUpSteep: Array.from({ length: 4 }, (_, i) => `./assets/img/3_enemies_chicken/dragon_small/dive_up_steep/image_${i + 1}.png`),
    hurt: Array.from({ length: 5 }, (_, i) => `./assets/img/3_enemies_chicken/dragon_small/hurt/image_${i + 1}.png`),
    fallDown: Array.from({ length: 8 }, (_, i) => `./assets/img/3_enemies_chicken/dragon_small/fall_down/image_${i + 1}.png`),
    impact: Array.from({ length: 3 }, (_, i) => `./assets/img/3_enemies_chicken/dragon_small/impact/image_${i + 1}.png`),
    dead: Array.from({ length: 1 }, _ => `./assets/img/3_enemies_chicken/dragon_small/dead/image_1.png`)
  },

  lifeEnergyBoss: {
    status: Array.from({ length: 6 }, (_, i) => `./assets/img/7_statusbars/2_statusbar_endboss/green/green${i * 20}.webp`)
  },

  coinBar: {
    status: Array.from({ length: 6 }, (_, i) => `./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/${i * 20}.webp`)
  },

  bottleBar: {
    status: Array.from({ length: 6 }, (_, i) => `./assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/${i * 20}.webp`)
  },

  bottleOnGround: Array.from({ length: 2 }, (_, i) => `./assets/img/6_salsa_bottle/${i + 1}_salsa_bottle_on_ground.webp`),

  coin: Array.from({ length: 2 }, (_, i) => `./assets/img/8_coin/coin_${i + 1}.webp`),

  tadeo: {
    idle: Array.from({ length: 10 }, (_, i) => `./assets/img/entities/tadeo/idle/image_${i + 1}.webp`),
    walk: Array.from({ length: 8 }, (_, i) => `./assets/img/entities/tadeo/walk/image_${i + 1}.png`),
    walkWithStone: Array.from({ length: 5 }, (_, i) => `./assets/img/entities/tadeo/walk_with_stone/image_${i + 1}.png`),
    idleWithStone: Array.from({ length: 20 }, (_, i) => `./assets/img/entities/tadeo/idle_with_stone/image_${i + 1}.png`),
    stoneActivated: Array.from({ length: 55 }, (_, i) => `./assets/img/entities/tadeo/stone_activated/image_${i + 1}.png`)
  },

  projectile: {
    fireball: Array.from({ length: 6 }, (_, i) => `./assets/img/entities/projectile/fireball/idle/image_${i + 1}.png`)
  },

  musician: {
    idle: Array.from({ length: 6 }, (_, i) => `./assets/img/entities/musician/idle/image_${i + 1}.png`)
  },

  sollita: {
    idle: Array.from({ length: 20 }, (_, i) => `./assets/img/entities/sollita/idle/image_${i + 1}.png`)
  },

  egg: {
    idle: Array.from({ length: 1 }, _ => `./assets/img/entities/egg/idle/image_1.png`),
    broken: Array.from({ length: 6 }, (_, i) => `./assets/img/entities/egg/broken/image_${i + 1}.png`)
  },

  rockyDesertPedestal: {
    idle: Array.from({ length: 1 }, _ => `./assets/img/entities/rocky-desert-pedestal/idle/image_1.png`)
  },

  fire: {
    idle: Array.from({ length: 8 }, (_, i) => `./assets/img/entities/fire/idle/image_${i + 1}.png`)
  },

  juanitoSpirit: {
    idle: Array.from({ length: 8 }, (_, i) => `./assets/img/entities/juanito-ghost/idle/image_${i + 1}.png`),
    spiritCuddle: Array.from({ length: 8 }, (_, i) => `./assets/img/entities/juanito-ghost/spirit-cuddle/image_${i + 1}.png`),
    spiritCuddleLoop: Array.from({ length: 6 }, (_, i) => `./assets/img/entities/juanito-ghost/spirit-cuddle-loop/image_${i + 1}.png`)
  },

  pollitoSpirit: {
    idle: Array.from({ length: 6 }, (_, i) => `./assets/img/entities/pollito-spirit/idle/image_${i + 1}.png`),
    spiritCuddle: Array.from({ length: 8 }, (_, i) => `./assets/img/entities/pollito-spirit/spirit-cuddle/image_${i + 1}.png`),
    spiritCuddleLoop: Array.from({ length: 6 }, (_, i) => `./assets/img/entities/pollito-spirit/spirit-cuddle-loop/image_${i + 1}.png`)
  },

  lolaSpirit: {
    idle: Array.from({ length: 6 }, (_, i) => `./assets/img/entities/lola-spirit/idle/image_${i + 1}.png`),
    spiritCuddle: Array.from({ length: 8 }, (_, i) => `./assets/img/entities/lola-spirit/spirit-cuddle/image_${i + 1}.png`),
    spiritCuddleLoop: Array.from({ length: 8 }, (_, i) => `./assets/img/entities/lola-spirit/spirit-cuddle-loop/image_${i + 1}.png`)
  },

  spiritEssence: {
    idle: Array.from({ length: 8 }, (_, i) => `./assets/img/entities/spirit-essence/idle/image_${i + 1}.png`)
  }
}