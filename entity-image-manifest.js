const entityImageManifest = {
  // bird: {
  //   idle: Array.from({ length: 18 }, (_, i) => `./assets/img/npcs/bird/idle/image_${i + 1}.webp`)
  // },

  // cow: {
  //   idle: Array.from({ length: 28 }, (_, i) => `./assets/img/npcs/cow/idle/image_${i + 1}.webp`),
  //   walk: Array.from({ length: 5 }, (_, i) => `./assets/img/npcs/cow/walk/image_${i + 1}.webp`),
  //   eat: Array.from({ length: 8 }, (_, i) => `./assets/img/npcs/cow/eat_grass/image_${i + 1}.webp`),
  //   love: Array.from({ length: 8 }, (_, i) => `./assets/img/npcs/cow/love/image_${i + 1}.webp`),
  //   afraid: Array.from({ length: 16 }, (_, i) => `./assets/img/npcs/cow/afraid/image_${i + 1}.webp`),
  //   happy: Array.from({ length: 10 }, (_, i) => `./assets/img/npcs/cow/happy/image_${i + 1}.webp`),
  //   standUp: Array.from({ length: 6 }, (_, i) => `./assets/img/npcs/cow/stand_up/image_${i + 1}.webp`),
  //   swingToMusic: Array.from({ length: 20 }, (_, i) => `./assets/img/npcs/cow/swing_to_music/image_${11 + i}.webp`),
  //   sleep: Array.from({ length: 17 }, (_, i) => `./assets/img/npcs/cow/sleep/image_${i + 1}.webp`),
  //   portrait: Array.from({ length: 10 }, (_, i) => `./assets/img/npcs/cow/portrait/image_${i + 1}.webp`)
  // },

  // pond: {
  //   idle: Array.from({ length: 5 }, (_, i) => `./assets/img/npcs/pond/idle/image_${i + 1}.webp`)
  // },

  // tree: {
  //   idle: Array.from({ length: 7 }, (_, i) => `./assets/img/npcs/tree/idle/image_${2 + i}.webp`)
  // },

  // tree2: {
  //   idle: Array.from({ length: 6 }, (_, i) => `./assets/img/npcs/tree2/idle/image_${i + 1}.webp`)
  // },

  // tree3: {
  //   idle: Array.from({ length: 6 }, (_, i) => `./assets/img/npcs/tree3/idle/image_${i + 1}.webp`)
  // },

  // tree4: {
  //   idle: Array.from({ length: 6 }, (_, i) => `./assets/img/npcs/tree4/idle/image_${i + 1}.webp`)
  // },

  // flower: {
  //   idle: Array.from({ length: 6 }, (_, i) => `./assets/img/npcs/flower/idle/image_${i + 1}.webp`)
  // },

  // flower2: {
  //   idle: Array.from({ length: 6 }, (_, i) => `./assets/img/npcs/flower2/idle/image_${i + 1}.webp`)
  // },

  // flower3: {
  //   idle: Array.from({ length: 6 }, (_, i) => `./assets/img/npcs/flower3/idle/image_${i + 1}.webp`)
  // },

  // chicken: {
  //   idle: Array.from({ length: 7 }, (_, i) => `./assets/img/3_enemies_chicken/chicken_normal/4_sit/image_0${i + 1}.webp`),
  //   walk: Array.from({ length: 3 }, (_, i) => `./assets/img/3_enemies_chicken/chicken_normal/1_walk/${i + 1}_w_2.webp`),
  //   love: Array.from({ length: 8 }, (_, i) => `./assets/img/3_enemies_chicken/chicken_normal/6_love/image_${i + 1}.webp`),
  //   swingToMusic: Array.from({ length: 30 }, (_, i) => `./assets/img/3_enemies_chicken/chicken_normal/7_swing_to_music/image_${i + 1}.webp`),
  //   sleep: Array.from({ length: 18 }, (_, i) => `./assets/img/3_enemies_chicken/chicken_normal/8_sleep/image_${i + 1}.webp`),
  //   portrait: Array.from({ length: 10 }, (_, i) => `./assets/img/3_enemies_chicken/chicken_normal/9_portrait/image_${i + 1}.webp`)
  // },

  // chick: {
  //   idle: Array.from({ length: 7 }, (_, i) => `./assets/img/3_enemies_chicken/chicken_small/4_idle/image_${2 + i}.webp`),
  //   walk: Array.from({ length: 3 }, (_, i) => `./assets/img/3_enemies_chicken/chicken_small/1_walk/${i + 1}_w_2.webp`),
  //   love: Array.from({ length: 8 }, (_, i) => `./assets/img/3_enemies_chicken/chicken_small/5_love/image_${i + 1}.webp`),
  //   swingToMusic: Array.from({ length: 50 }, (_, i) => `./assets/img/3_enemies_chicken/chicken_small/6_swing_to_music/image_${i + 1}.webp`),
  //   sleep: Array.from({ length: 10 }, (_, i) => `./assets/img/3_enemies_chicken/chicken_small/7_sleep/image_${i + 1}.webp`),
  //   portrait: Array.from({ length: 10 }, (_, i) => `./assets/img/3_enemies_chicken/chicken_small/8_portrait/image_${i + 1}.webp`)
  // },

  // drone: {
  //   idle: Array.from({ length: 10 }, (_, i) => `./assets/img/drohne/image_${i + 1}.webp`),
  //   hypno: Array.from({ length: 18 }, (_, i) => `./assets/img/drohne/hypno/image_${3 + i}.webp`)
  // },

  // cowHypno: {
  //   idle: Array.from({ length: 10 }, (_, i) => `./assets/img/npcs/cow/idle/image_${i + 1}.webp`),
  //   walk: Array.from({ length: 5 }, (_, i) => `./assets/img/npcs/cow/hypno2/image_${i + 1}.webp`)
  // },

  // chickenHypno: {
  //   idle: Array.from({ length: 1 }, _ => `./assets/img/3_enemies_chicken/chicken_normal/5_hypno/1_w.webp`),
  //   walk: Array.from({ length: 3 }, (_, i) => `./assets/img/3_enemies_chicken/chicken_normal/5_hypno/${i + 1}_w.webp`)
  // },

  // chickHypno: {
  //   idle: Array.from({ length: 1 }, _ => `./assets/img/3_enemies_chicken/chicken_small/3_walk_hypno/1_w.webp`),
  //   walk: Array.from({ length: 3 }, (_, i) => `./assets/img/3_enemies_chicken/chicken_small/3_walk_hypno/${i + 1}_w.webp`)
  // },

  blackDragon: {
    idle: Array.from({ length: 16 }, (_, i) => `./assets/img/npcs/dragon/test2/image_${i + 1}.webp`),
    flyUp: Array.from({ length: 9 }, (_, i) => `./assets/img/npcs/dragon/fly_up/image_${i + 1}.webp`),
    halfSizeFly: Array.from({ length: 10 }, (_, i) => `./assets/img/npcs/dragon/half-size-fly/image_${i + 1}.webp`),
    fullSizeFly: Array.from({ length: 5 }, (_, i) => `./assets/img/npcs/dragon/full-size-fly/image_${6 + i}.webp`)
  },

  // house: {
  //   idle: Array.from({ length: 1 }, _ => `./assets/img/bauernhof1.webp`),
  //   doorOpens: Array.from({ length: 6 }, (_, i) => `./assets/img/npcs/house/door_opens/image_${i + 1}.webp`),
  //   doorCloses: Array.from({ length: 6 }, (_, i) => `./assets/img/npcs/house/door_closes/image_${i + 1}.webp`),
  //   idleOpen: Array.from({ length: 1 }, _ => `./assets/img/npcs/house/idle_open/image_1.webp`)
  // },

  // stable: {
  //   idle: Array.from({ length: 1 }, _ => `./assets/img/npcs/stable/door_opens/image_1.webp`),
  //   doorOpens: Array.from({ length: 6 }, (_, i) => `./assets/img/npcs/stable/door_opens/image_${i + 1}.webp`),
  //   doorCloses: Array.from({ length: 6 }, (_, i) => `./assets/img/npcs/stable/door_closes/image_${i + 1}.webp`),
  //   idleOpen: Array.from({ length: 1 }, _ => `./assets/img/npcs/stable/idle_open/image_1.webp`)
  // },

  // clock: {
  //   idle: Array.from({ length: 10 }, (_, i) => `./assets/img/npcs/clock/idle/image_${i + 1}.webp`)
  // },

  // campfire: {
  //   idle: Array.from({ length: 1 }, _ => `./assets/img/npcs/campfire/idle/image_1.webp`),
  //   burningFire: Array.from({ length: 7 }, (_, i) => `./assets/img/npcs/campfire/burning_fire/image_${i + 1}.webp`),
  //   fireGoesOn: Array.from({ length: 13 }, (_, i) => `./assets/img/npcs/campfire/fire_goes_on/image_${i + 1}.webp`),
  //   fireGoesOut: Array.from({ length: 6 }, (_, i) => `./assets/img/npcs/campfire/fire_goes_out/image_${i + 1}.webp`)
  // },

  // sun: {
  //   idle: Array.from({ length: 10 }, (_, i) => `./assets/img/npcs/sun/idle/image_${i + 1}.webp`)
  // },

  // moon: {
  //   idle: Array.from({ length: 1 }, _ => `./assets/img/npcs/moon/idle/image_1.webp`),
  //   swingToMusic: Array.from({ length: 10 }, (_, i) => `./assets/img/npcs/moon/idle/image_${i + 1}.webp`)
  // },

  // soul: {
  //   idle: Array.from({ length: 18 }, (_, i) => `./assets/img/npcs/soul/idle/image_${i + 1}.webp`),
  //   findsPeace: Array.from({ length: 22 }, (_, i) => `./assets/img/npcs/soul/finds-peace/image_${i + 1}.webp`),
  //   findsPeaceLoop: Array.from({ length: 9 }, (_, i) => `./assets/img/npcs/soul/finds-peace/image_${13 + i}.webp`)
  // },

  // nayeli: {
  //   idle: Array.from({ length: 10 }, (_, i) => `./assets/img/npcs/nayeli/idle/image_${i + 1}.webp`)
  // },

  // macuahuitl: {
  //   idle: Array.from({ length: 30 }, (_, i) => `./assets/img/npcs/macuahuitl/idle/image_${i + 1}.webp`)
  // },

  // memoryLight: {
  //   idle: Array.from({ length: 10 }, (_, i) => `./assets/img/npcs/memory_light/idle/image_${i + 1}.webp`)
  // },

  // levelCompleteCharacter: {
  //   idle: Array.from({ length: 10 }, (_, i) => `./assets/img/npcs/level_complete/idle/image_${i + 1}.webp`)
  // },

  // endboss: {
  //   idle: Array.from({ length: 12 }, (_, i) => `./assets/img/4_enemie_boss_chicken/0_idle/image_${i + 1}.webp`),
  //   walk: Array.from({ length: 4 }, (_, i) => `./assets/img/4_enemie_boss_chicken/1_walk/G${i + 1}.webp`),
  //   hurt: Array.from({ length: 6 }, (_, i) => `./assets/img/4_enemie_boss_chicken/4_hurt/image_${i + 1}.webp`),
  //   dead: Array.from({ length: 8 }, (_, i) => `./assets/img/4_enemie_boss_chicken/5_dead/image_${i + 1}.webp`),
  //   findsPeace: Array.from({ length: 20 }, (_, i) => `./assets/img/4_enemie_boss_chicken/6_finds_peace/image_${i + 1}.webp`)
  // },

  // endbossAttack: {
  //   idle: Array.from({ length: 10 }, (_, i) => `./assets/img/tornado/image_${i + 1}.webp`)
  // },

  // chickenMutates: {
  //   walk: Array.from({ length: 5 }, (_, i) => `./assets/img/3_enemies_chicken/chicken_mutates/image_${2 + i}.webp`),
  //   dead: Array.from({ length: 1 }, _ => `assets/img/3_enemies_chicken/chicken_mutates/dead/image_1.webp`)
  // },

  // lifeEnergyCharacter: {
  //   status: Array.from({ length: 6 }, (_, i) => `./assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/${i * 20}.webp`)
  // },

  // lifeEnergyBoss: {
  //   status: Array.from({ length: 6 }, (_, i) => `./assets/img/7_statusbars/2_statusbar_endboss/green/green${i * 20}.webp`)
  // },

  // coinBar: {
  //   status: Array.from({ length: 6 }, (_, i) => `./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/${i * 20}.webp`)
  // },

  // bottleBar: {
  //   status: Array.from({ length: 6 }, (_, i) => `./assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/${i * 20}.webp`)
  // },

  // bottleOnGround: Array.from({ length: 2 }, (_, i) => `./assets/img/6_salsa_bottle/${i + 1}_salsa_bottle_on_ground.webp`),

  // coin: Array.from({ length: 2 }, (_, i) => `./assets/img/8_coin/coin_${i + 1}.webp`),

  // tadeo: {
  //   idle: Array.from({ length: 10 }, (_, i) => `./assets/img/npcs/tadeo/idle/image_${i + 1}.webp`)
  // }
}

const farmEntityManifestImmediate = {
  cow: {
    idle: Array.from({ length: 28 }, (_, i) => `./assets/img/npcs/cow/idle/image_${i + 1}.webp`),
    happy: Array.from({ length: 10 }, (_, i) => `./assets/img/npcs/cow/happy/image_${i + 1}.webp`),
    walk: Array.from({ length: 5 }, (_, i) => `./assets/img/npcs/cow/walk/image_${i + 1}.webp`),
    standUp: Array.from({ length: 6 }, (_, i) => `./assets/img/npcs/cow/stand_up/image_${i + 1}.webp`),
    afraid: Array.from({ length: 16 }, (_, i) => `./assets/img/npcs/cow/afraid/image_${i + 1}.webp`),
    eat: Array.from({ length: 8 }, (_, i) => `./assets/img/npcs/cow/eat_grass/image_${i + 1}.webp`),
    love: Array.from({ length: 8 }, (_, i) => `./assets/img/npcs/cow/love/image_${i + 1}.webp`)
  },

  bird: {
    idle: Array.from({ length: 18 }, (_, i) => `./assets/img/npcs/bird/idle/image_${i + 1}.webp`)
  },

  pond: {
    idle: Array.from({ length: 5 }, (_, i) => `./assets/img/npcs/pond/idle/image_${i + 1}.webp`)
  },

  tree: {
    idle: Array.from({ length: 7 }, (_, i) => `./assets/img/npcs/tree/idle/image_${2 + i}.webp`)
  },

  tree2: {
    idle: Array.from({ length: 6 }, (_, i) => `./assets/img/npcs/tree2/idle/image_${i + 1}.webp`)
  },

  tree3: {
    idle: Array.from({ length: 6 }, (_, i) => `./assets/img/npcs/tree3/idle/image_${i + 1}.webp`)
  },

  tree4: {
    idle: Array.from({ length: 6 }, (_, i) => `./assets/img/npcs/tree4/idle/image_${i + 1}.webp`)
  },

  flower: {
    idle: Array.from({ length: 6 }, (_, i) => `./assets/img/npcs/flower/idle/image_${i + 1}.webp`)
  },

  flower2: {
    idle: Array.from({ length: 6 }, (_, i) => `./assets/img/npcs/flower2/idle/image_${i + 1}.webp`)
  },

  flower3: {
    idle: Array.from({ length: 6 }, (_, i) => `./assets/img/npcs/flower3/idle/image_${i + 1}.webp`)
  },

  house: {
    idle: Array.from({ length: 1 }, _ => `./assets/img/bauernhof1.webp`),
  },

  stable: {
    idle: Array.from({ length: 1 }, _ => `./assets/img/npcs/stable/door_opens/image_1.webp`),
    doorOpens: Array.from({ length: 6 }, (_, i) => `./assets/img/npcs/stable/door_opens/image_${i + 1}.webp`),
    doorCloses: Array.from({ length: 6 }, (_, i) => `./assets/img/npcs/stable/door_closes/image_${i + 1}.webp`),
    idleOpen: Array.from({ length: 1 }, _ => `./assets/img/npcs/stable/idle_open/image_1.webp`)
  },
  campfire: {
    idle: Array.from({ length: 1 }, _ => `./assets/img/npcs/campfire/idle/image_1.webp`),
  },

  chicken: {
    idle: Array.from({ length: 7 }, (_, i) => `./assets/img/3_enemies_chicken/chicken_normal/4_sit/image_0${i + 1}.webp`),
    love: Array.from({ length: 8 }, (_, i) => `./assets/img/3_enemies_chicken/chicken_normal/6_love/image_${i + 1}.webp`),
  },

  chick: {
    idle: Array.from({ length: 7 }, (_, i) => `./assets/img/3_enemies_chicken/chicken_small/4_idle/image_${2 + i}.webp`),
    love: Array.from({ length: 8 }, (_, i) => `./assets/img/3_enemies_chicken/chicken_small/5_love/image_${i + 1}.webp`),
  },

  lifeEnergyCharacter: {
    status: Array.from({ length: 6 }, (_, i) => `./assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/${i * 20}.webp`)
  },

}

const farmEntityManifestDeferred = {
  cow: {
    swingToMusic: Array.from({ length: 20 }, (_, i) => `./assets/img/npcs/cow/swing_to_music/image_${11 + i}.webp`),
    sleep: Array.from({ length: 17 }, (_, i) => `./assets/img/npcs/cow/sleep/image_${i + 1}.webp`),
    portrait: Array.from({ length: 10 }, (_, i) => `./assets/img/npcs/cow/portrait/image_${i + 1}.webp`)
  },

  house: {
    doorOpens: Array.from({ length: 6 }, (_, i) => `./assets/img/npcs/house/door_opens/image_${i + 1}.webp`),
    doorCloses: Array.from({ length: 6 }, (_, i) => `./assets/img/npcs/house/door_closes/image_${i + 1}.webp`),
    idleOpen: Array.from({ length: 1 }, _ => `./assets/img/npcs/house/idle_open/image_1.webp`)
  },

  campfire: {
    burningFire: Array.from({ length: 7 }, (_, i) => `./assets/img/npcs/campfire/burning_fire/image_${i + 1}.webp`),
    fireGoesOn: Array.from({ length: 13 }, (_, i) => `./assets/img/npcs/campfire/fire_goes_on/image_${i + 1}.webp`),
    fireGoesOut: Array.from({ length: 6 }, (_, i) => `./assets/img/npcs/campfire/fire_goes_out/image_${i + 1}.webp`)
  },

  chicken: {
    walk: Array.from({ length: 3 }, (_, i) => `./assets/img/3_enemies_chicken/chicken_normal/1_walk/${i + 1}_w_2.webp`),
    swingToMusic: Array.from({ length: 30 }, (_, i) => `./assets/img/3_enemies_chicken/chicken_normal/7_swing_to_music/image_${i + 1}.webp`),
    sleep: Array.from({ length: 18 }, (_, i) => `./assets/img/3_enemies_chicken/chicken_normal/8_sleep/image_${i + 1}.webp`),
    portrait: Array.from({ length: 10 }, (_, i) => `./assets/img/3_enemies_chicken/chicken_normal/9_portrait/image_${i + 1}.webp`)
  },

  chick: {
    walk: Array.from({ length: 3 }, (_, i) => `./assets/img/3_enemies_chicken/chicken_small/1_walk/${i + 1}_w_2.webp`),
    swingToMusic: Array.from({ length: 50 }, (_, i) => `./assets/img/3_enemies_chicken/chicken_small/6_swing_to_music/image_${i + 1}.webp`),
    sleep: Array.from({ length: 10 }, (_, i) => `./assets/img/3_enemies_chicken/chicken_small/7_sleep/image_${i + 1}.webp`),
    portrait: Array.from({ length: 10 }, (_, i) => `./assets/img/3_enemies_chicken/chicken_small/8_portrait/image_${i + 1}.webp`)
  },

  drone: {
    idle: Array.from({ length: 10 }, (_, i) => `./assets/img/drohne/image_${i + 1}.webp`),
    hypno: Array.from({ length: 18 }, (_, i) => `./assets/img/drohne/hypno/image_${3 + i}.webp`)
  },

  cowHypno: {
    idle: Array.from({ length: 10 }, (_, i) => `./assets/img/npcs/cow/idle/image_${i + 1}.webp`),
    walk: Array.from({ length: 5 }, (_, i) => `./assets/img/npcs/cow/hypno2/image_${i + 1}.webp`)
  },

  chickenHypno: {
    idle: Array.from({ length: 1 }, _ => `./assets/img/3_enemies_chicken/chicken_normal/5_hypno/1_w.webp`),
    walk: Array.from({ length: 3 }, (_, i) => `./assets/img/3_enemies_chicken/chicken_normal/5_hypno/${i + 1}_w.webp`)
  },

  chickHypno: {
    idle: Array.from({ length: 1 }, _ => `./assets/img/3_enemies_chicken/chicken_small/3_walk_hypno/1_w.webp`),
    walk: Array.from({ length: 3 }, (_, i) => `./assets/img/3_enemies_chicken/chicken_small/3_walk_hypno/${i + 1}_w.webp`)
  },

  clock: {
    idle: Array.from({ length: 10 }, (_, i) => `./assets/img/npcs/clock/idle/image_${i + 1}.webp`)
  },

  sun: {
    idle: Array.from({ length: 10 }, (_, i) => `./assets/img/npcs/sun/idle/image_${i + 1}.webp`)
  },

  moon: {
    idle: Array.from({ length: 1 }, _ => `./assets/img/npcs/moon/idle/image_1.webp`),
    swingToMusic: Array.from({ length: 10 }, (_, i) => `./assets/img/npcs/moon/idle/image_${i + 1}.webp`)
  },
}

const otherLevelEntityManifestLazy = {
  soul: {
    idle: Array.from({ length: 18 }, (_, i) => `./assets/img/npcs/soul/idle/image_${i + 1}.webp`),
    findsPeace: Array.from({ length: 22 }, (_, i) => `./assets/img/npcs/soul/finds-peace/image_${i + 1}.webp`),
    findsPeaceLoop: Array.from({ length: 9 }, (_, i) => `./assets/img/npcs/soul/finds-peace/image_${13 + i}.webp`)
  },

  nayeli: {
    idle: Array.from({ length: 10 }, (_, i) => `./assets/img/npcs/nayeli/idle/image_${i + 1}.webp`)
  },

  macuahuitl: {
    idle: Array.from({ length: 30 }, (_, i) => `./assets/img/npcs/macuahuitl/idle/image_${i + 1}.webp`)
  },

  memoryLight: {
    idle: Array.from({ length: 10 }, (_, i) => `./assets/img/npcs/memory_light/idle/image_${i + 1}.webp`)
  },

  levelCompleteCharacter: {
    idle: Array.from({ length: 10 }, (_, i) => `./assets/img/npcs/level_complete/idle/image_${i + 1}.webp`)
  },

  endboss: {
    idle: Array.from({ length: 12 }, (_, i) => `./assets/img/4_enemie_boss_chicken/0_idle/image_${i + 1}.webp`),
    walk: Array.from({ length: 4 }, (_, i) => `./assets/img/4_enemie_boss_chicken/1_walk/G${i + 1}.webp`),
    hurt: Array.from({ length: 6 }, (_, i) => `./assets/img/4_enemie_boss_chicken/4_hurt/image_${i + 1}.webp`),
    dead: Array.from({ length: 8 }, (_, i) => `./assets/img/4_enemie_boss_chicken/5_dead/image_${i + 1}.webp`),
    findsPeace: Array.from({ length: 20 }, (_, i) => `./assets/img/4_enemie_boss_chicken/6_finds_peace/image_${i + 1}.webp`),
    fly: Array.from({ length: 8 }, (_, i) => `./assets/img/4_enemie_boss_chicken/7_fly/image_${i + 1}.png`),
    fireballAttack: Array.from({ length: 14 }, (_, i) => `./assets/img/4_enemie_boss_chicken/8_fireball_attack/image_${i + 1}.png`),
    tornadoAttack: Array.from({ length: 10 }, (_, i) => `./assets/img/tornado/image_${i + 1}.webp`),
    fireBreathAttack: Array.from({ length: 3 }, (_, i) => `./assets/img/4_enemie_boss_chicken/8_fireball_attack/image_${12 + i}.png`)
  },

  chickenMutatesSmall: {
    walk: Array.from({ length: 5 }, (_, i) => `./assets/img/3_enemies_chicken/chicken_mutates/walk/image_${2 + i}.webp`),
    dead: Array.from({ length: 1 }, _ => `assets/img/3_enemies_chicken/chicken_mutates/dead/image_1.webp`),
    hurt: Array.from({ length: 5 }, (_, i) => `./assets/img/3_enemies_chicken/chicken_mutates/hurt/image_${2 + i}.webp`)
  },

  chickenMutatesBig: {
    walk: Array.from({ length: 9 }, (_, i) => `./assets/img/3_enemies_chicken/chicken_mutates/walk2/image_${i + 1}.png`),
    dead: Array.from({ length: 1 }, _ => `assets/img/3_enemies_chicken/chicken_mutates/dead/image_1.webp`),
    hurt: Array.from({ length: 8 }, (_, i) => `./assets/img/3_enemies_chicken/chicken_mutates/hurt2/image_${i + 1}.png`),
    attack: Array.from({ length: 9 }, (_, i) => `./assets/img/3_enemies_chicken/chicken_mutates/attack2/image_${i + 1}.png`)
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
    idle: Array.from({ length: 10 }, (_, i) => `./assets/img/npcs/tadeo/idle/image_${i + 1}.webp`),
    walk: Array.from({ length: 8 }, (_, i) => `./assets/img/npcs/tadeo/walk/image_${i + 1}.png`),
    walkWithStone: Array.from({ length: 5 }, (_, i) => `./assets/img/npcs/tadeo/walk_with_stone/image_${i + 1}.png`),
    idleWithStone: Array.from({ length: 20 }, (_, i) => `./assets/img/npcs/tadeo/idle_with_stone/image_${i + 1}.png`),
    stoneActivated: Array.from({ length: 55 }, (_, i) => `./assets/img/npcs/tadeo/stone_activated/image_${i + 1}.png`)
  },

  projectile: {
    fireball: Array.from({ length: 6 }, (_, i) => `./assets/img/npcs/projectile/fireball/idle/image_${i + 1}.png`)
  },

  musician: {
    idle: Array.from({ length: 6 }, (_, i) => `./assets/img/npcs/musician/idle/image_${i + 1}.png`)
  },

  sollita: {
    idle: Array.from({ length: 20 }, (_, i) => `./assets/img/npcs/sollita/idle/image_${i + 1}.png`)
  },

  egg: {
    idle: Array.from({ length: 1 }, _ => `./assets/img/npcs/egg/idle/image_1.png`),
    broken: Array.from({ length: 6 }, (_, i) => `./assets/img/npcs/egg/broken/image_${i + 1}.png`)
  },

  rockyDesertPedestal: {
    idle: Array.from({ length: 1 }, _ => `./assets/img/npcs/rocky-desert-pedestal/idle/image_1.png`)
  },

  fire: {
    idle: Array.from({ length: 8 }, (_, i) => `./assets/img/npcs/fire/idle/image_${i + 1}.png`)
  },

  juanitoSpirit: {
    idle: Array.from({ length: 8 }, (_, i) => `./assets/img/npcs/juanito-ghost/idle/image_${i + 1}.png`),
    spiritCuddle: Array.from({ length: 8 }, (_, i) => `./assets/img/npcs/juanito-ghost/spirit-cuddle/image_${i + 1}.png`),
    spiritCuddleLoop: Array.from({ length: 6 }, (_, i) => `./assets/img/npcs/juanito-ghost/spirit-cuddle-loop/image_${i + 1}.png`)
  },

  pollitoSpirit: {
    idle: Array.from({ length: 6 }, (_, i) => `./assets/img/npcs/pollito-spirit/idle/image_${i + 1}.png`),
    spiritCuddle: Array.from({ length: 8 }, (_, i) => `./assets/img/npcs/pollito-spirit/spirit-cuddle/image_${i + 1}.png`),
    spiritCuddleLoop: Array.from({ length: 6 }, (_, i) => `./assets/img/npcs/pollito-spirit/spirit-cuddle-loop/image_${i + 1}.png`)
  },

  lolaSpirit: {
    idle: Array.from({ length: 6 }, (_, i) => `./assets/img/npcs/lola-spirit/idle/image_${i + 1}.png`),
    spiritCuddle: Array.from({ length: 8 }, (_, i) => `./assets/img/npcs/lola-spirit/spirit-cuddle/image_${i + 1}.png`),
    spiritCuddleLoop: Array.from({ length: 8 }, (_, i) => `./assets/img/npcs/lola-spirit/spirit-cuddle-loop/image_${i + 1}.png`)
  },

  spiritEssence: {
    idle: Array.from({ length: 8 }, (_, i) => `./assets/img/npcs/spirit-essence/idle/image_${i + 1}.png`)
  }

}