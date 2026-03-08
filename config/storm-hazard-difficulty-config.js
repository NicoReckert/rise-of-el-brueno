export const STORM_HAZARD_DIFFICULTY_PROFILES = {
    normal: {
        minDelay: 1100,
        maxDelay: 1800,
        maxActiveHazards: 4,
        laneWeights: { LOW: 0.45, MID: 0.35, HIGH: 0.20 },
        multiSpawnChance: 0,
    },
    hard: {
        minDelay: 600,
        maxDelay: 1000,
        maxActiveHazards: 6,
        laneWeights: { LOW: 0.58, MID: 0.27, HIGH: 0.15 },
        multiSpawnChance: 0.35,
    },
};