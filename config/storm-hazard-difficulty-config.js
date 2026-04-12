export const STORM_HAZARD_DIFFICULTY_PROFILES = {
    normal: {
        minDelay: 1100,
        maxDelay: 1800,
        maxActiveHazards: 4,
        laneWeights: { LOW: 0.45, MID: 0.35, HIGH: 0.20 },
        multiSpawnChance: 0,
    },
    hard: {
        minDelay: 850,
        maxDelay: 1300,
        maxActiveHazards: 4,
        laneWeights: { LOW: 0.48, MID: 0.28, HIGH: 0.24 },
        multiSpawnChance: 0.12,
    }
};