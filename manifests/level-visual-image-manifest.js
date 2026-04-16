const sharedLevelVisualImageManifest = {
    desert: {
        backA: ['./assets/img/5_background/layers/3_third_layer/1.webp'],
        backB: ['./assets/img/5_background/layers/3_third_layer/2.webp'],
        midA: ['./assets/img/5_background/layers/2_second_layer/1.webp'],
        midB: ['./assets/img/5_background/layers/2_second_layer/2.webp'],
        foreA: ['./assets/img/5_background/layers/1_first_layer/1.webp'],
        foreB: ['./assets/img/5_background/layers/1_first_layer/2.webp'],
    },
    cloud: {
        variants: Array.from(
            { length: 2 },
            (_, i) => `./assets/img/5_background/layers/4_clouds/${i + 1}.webp`
        )
    }
};

const farmLevelVisualImageManifest = {
    ground: {
        grass: ['./assets/img/shared_visuals/grass.webp'],
        town: ['./assets/img/5_background/layers/ground-town.webp'],
        town2: ['./assets/img/5_background/layers/ground-town2.webp'],
        town3: ['./assets/img/5_background/layers/ground-town3.webp']
    },
    scenery: {
        woodenCart: ['./assets/img/shared_visuals/wooden_cart.webp']
    }
};

const stableLevelVisualImageManifest = {
    ground: {
        woodBackground: ['./assets/img/shared_visuals/wood_background.webp']
    },
    scenery: {
        interior: ['./assets/img/shared_visuals/stable_interior.webp']
    }
};

const nayelisHouseLevelVisualImageManifest = {
    scenery: {
        interior: ['./assets/img/shared_visuals/house_nayeli_interior.png']
    }
};

const townLevelVisualImageManifest = {
    ground: {
        town: ['./assets/img/5_background/layers/ground-town.webp'],
        town2: ['./assets/img/5_background/layers/ground-town2.webp']
    },
    scenery: {
        town1: ['./assets/img/shared_visuals/town1.webp'],
        town2: ['./assets/img/shared_visuals/town2.webp'],
        town3: ['./assets/img/shared_visuals/town3.webp'],
        town4: ['./assets/img/shared_visuals/town4.webp'],
        town5: ['./assets/img/shared_visuals/town5.webp'],
        town6: ['./assets/img/shared_visuals/town6.webp'],
        nayeliHouse: ['./assets/img/shared_visuals/house_nayeli.png']
    }
};

export const levelVisualImageManifest = {
    shared: sharedLevelVisualImageManifest,
    farm: farmLevelVisualImageManifest,
    stable: stableLevelVisualImageManifest,
    nayelisHouse: nayelisHouseLevelVisualImageManifest,
    town: townLevelVisualImageManifest
};