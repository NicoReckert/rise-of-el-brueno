import { StormHazard } from '../effects/storm-hazard.class.js';
import { STORM_HAZARD_DIFFICULTY_PROFILES } from '../../config/storm-hazard-difficulty-config.js';

/**
 * System managing storm hazards, including spawn lanes, pools, and difficulty.
 */
export class StormHazardSystem {
    /**
     * Creates a new spawner for world entities.
     * @param {{world: *, setup: *, canvas: HTMLCanvasElement}} options Configuration options.
     */
    constructor({ world, setup, canvas }) {
        this.world = world;
        this.setup = setup;
        this.canvas = canvas;
        this.enabled = false;
        this.initSpawnSettings();
        this.initDifficulty('normal');
        this.initLanes();
        this.initPool();
        this.initStateTracking();
    }

    /**
     * Initializes spawn settings for storm hazards.
     */
    initSpawnSettings() {
        this.speedMin = -6;
        this.speedMax = -14;
        this.minDelay = 1100;
        this.maxDelay = 1800;
        this.maxActiveHazards = 4;
        this.multiSpawnChance = 0;
    }

    /**
     * Initializes the hazard system difficulty and lane weights.
     * @param {string} difficulty Difficulty level.
     */
    initDifficulty(difficulty) {
        this.difficulty = difficulty;
        this.laneWeights = { LOW: 0.45, MID: 0.35, HIGH: 0.20 };
        this.applyDifficultyProfile(STORM_HAZARD_DIFFICULTY_PROFILES[difficulty]);
    }

    /**
     * Initializes spawn lanes and their types.
     */
    initLanes() {
        this.lanes = {
            LOW: 'jump',
            MID: 'duck',
            HIGH: 'safe'
        };
    }

    /**
     * Initializes the pool of hazard types and their spawn functions.
     */
    initPool() {
        this.pool = [
            (ctx) => this.spawnHazard('tumbleweed', ctx),
            (ctx) => this.spawnHazard('sandTornado', ctx),
            (ctx) => this.spawnHazard('featherSwirl', ctx),
            (ctx) => this.spawnHazard('eagle', ctx),
            (ctx) => this.spawnHazard('woodenPlank', ctx),
            (ctx) => this.spawnHazard('coat', ctx)
        ];
    }

    /**
     * Initializes state tracking for hazard spawning.
     */
    initStateTracking() {
        this.lastLaneKey = null;
        this.lastSpawnAt = 0;
        this.lastDangerLane = null;
        this.dangerLockUntil = 0;
        this.dangerLockMs = 1100;
        this.nextSpawnAt = 0;
    }

    /**
     * Sets the difficulty level for the hazard system.
     * @param {string} name Difficulty name.
     */
    setDifficulty(name) {
        const profile = STORM_HAZARD_DIFFICULTY_PROFILES[name];
        if (!profile) return;
        this.difficulty = name;
        this.applyDifficultyProfile(profile);
    }

    /**
     * Applies a difficulty profile to the hazard system.
     * @param {*} profile Difficulty profile object.
     */
    applyDifficultyProfile(profile) {
        if (!profile) return;
        this.minDelay = profile.minDelay ?? this.minDelay;
        this.maxDelay = profile.maxDelay ?? this.maxDelay;
        this.maxActiveHazards = profile.maxActiveHazards ?? this.maxActiveHazards;
        this.multiSpawnChance = profile.multiSpawnChance ?? this.multiSpawnChance;
        if (profile.laneWeights) {
            this.laneWeights = {
                LOW: profile.laneWeights.LOW ?? this.laneWeights.LOW,
                MID: profile.laneWeights.MID ?? this.laneWeights.MID,
                HIGH: profile.laneWeights.HIGH ?? this.laneWeights.HIGH,
            };
        }
    }

    /**
     * Updates the storm hazard system, spawning hazards if conditions are met.
     * @param {number} timestamp Current frame timestamp.
     */
    update(timestamp) {
        if (!this.enabled || this.isMaxHazards()) return;
        if (!this.nextSpawnAt) this.scheduleNext(timestamp);
        if (timestamp < this.nextSpawnAt) return;
        const ctx = this.buildSpawnContext(timestamp);
        if (!ctx.laneKey) return this.scheduleNext(timestamp);
        this.spawnHazardContext(ctx);
        this.handleDangerAndLane(ctx, timestamp);
        this.lastSpawnAt = timestamp;
        this.scheduleNext(timestamp);
    }

    /**
     * Checks if the maximum number of active hazards has been reached.
     * @returns {boolean} True if max hazards are active.
     */
    isMaxHazards() {
        return this.setup.effects.filter(
            (e) => e instanceof StormHazard && !e.markedForRemoval
        ).length >= this.maxActiveHazards;
    }

    /**
     * Spawns a hazard based on the provided context, potentially spawning multiple hazards.
     * @param {*} ctx Spawn context.
     */
    spawnHazardContext(ctx) {
        this.spawnRandom(ctx);
        if (this.multiSpawnChance <= 0 || Math.random() >= this.multiSpawnChance) return;
        const laneKey2 = this.pickLaneKey(this.lastSpawnAt);
        if (!laneKey2 || laneKey2 === ctx.laneKey) return;
        this.spawnRandom({ ...ctx, laneKey: laneKey2, x: ctx.x + 140 });
    }

    /**
     * Updates danger lane tracking and timing after a hazard spawn.
     * @param {*} ctx Spawn context.
     * @param {number} timestamp Current frame timestamp.
     */
    handleDangerAndLane(ctx, timestamp) {
        if (ctx.laneKey === 'LOW' || ctx.laneKey === 'MID') {
            this.lastDangerLane = ctx.laneKey;
            this.dangerLockUntil = timestamp + this.dangerLockMs;
        }
        this.lastLaneKey = ctx.laneKey;
    }

    /**
     * Builds the context object used for spawning a hazard.
     * @param {number} now Current timestamp.
     * @returns {{x:number, speedX:number, laneKey:string|null}} Spawn context.
     */
    buildSpawnContext(now) {
        const camX = this.world.townLevelController?.renderCameraX ?? 0;
        const cw = this.canvas?.width ?? 1280;
        const laneKey = this.pickLaneKey(now);
        const speedX = this.rand(this.speedMin, this.speedMax);
        const x = camX + cw + this.getSpawnLeadPx(Math.abs(speedX), laneKey);
        return { x, speedX, laneKey };
    }

    /**
     * Schedules the next hazard spawn time.
     * @param {number} now Current timestamp.
     */
    scheduleNext(now) {
        const d = this.minDelay + Math.random() * (this.maxDelay - this.minDelay);
        this.nextSpawnAt = now + d;
    }

    /**
     * Spawns a random hazard from the pool.
     * @param {*} ctx Spawn context.
     */
    spawnRandom(ctx) {
        if (!this.pool.length) return;
        const fn = this.pool[(Math.random() * this.pool.length) | 0];
        fn?.(ctx);
    }

    /**
     * Spawns a specific hazard type if it is valid for the given lane.
     * @param {string} type Hazard type.
     * @param {{x:number, speedX:number, laneKey:string}} ctx Spawn context.
     */
    spawnHazard(type, { x, speedX, laneKey }) {
        if (
            (type === 'eagle' && laneKey === 'LOW') ||
            (type === 'featherSwirl' && laneKey === 'LOW') ||
            (type === 'tumbleweed' && laneKey !== 'LOW') ||
            (type === 'coat' && laneKey === 'LOW')
        ) return;
        const lane = laneKey === 'LOW' ? 'jump' : laneKey === 'MID' ? 'duck' : 'safe';
        StormHazard.spawn(this.setup, type, { x, speedX, lane });
    }

    /**
     * Selects a lane key based on the current lock and lane state.
     * @param {number} now Current timestamp.
     * @returns {string|null} Selected lane key.
     */
    pickLaneKey(now) {
        const locked = now < (this.dangerLockUntil ?? 0);
        const last = this.lastDangerLane;
        if (locked && (last === 'LOW' || last === 'MID')) {
            return this.pickLaneWhileLocked(last);
        }
        return this.rollLane();
    }

    /**
     * Rolls a lane key based on configured lane weights.
     * @returns {string} Selected lane key.
     */
    rollLane() {
        const w = this.laneWeights ?? { LOW: 0.45, MID: 0.35, HIGH: 0.20 };
        const r = Math.random();
        if (r < w.LOW) return 'LOW';
        if (r < w.LOW + w.MID) return 'MID';
        return 'HIGH';
    }

    /**
     * Selects a lane key while danger lock is active.
     * @param {string} last Last danger lane key.
     * @returns {string} Selected lane key.
     */
    pickLaneWhileLocked(last) {
        for (let i = 0; i < 6; i++) {
            const k = this.rollLane();
            if (k === 'HIGH') return 'HIGH';
            if (k === last) return last;
        }
        return 'HIGH';
    }

    /**
     * Calculates the horizontal lead distance for spawning a hazard.
     * @param {number} speedAbs Absolute hazard speed.
     * @param {string} laneKey Lane key.
     * @returns {number} Lead distance in pixels.
     */
    getSpawnLeadPx(speedAbs, laneKey) {
        let reactionMs = 520;
        if (laneKey === 'LOW' || laneKey === 'MID') {
            reactionMs += 200;
        }
        const frames = reactionMs / (1000 / 60);
        const lead = speedAbs * frames;
        return Math.max(260, lead);
    }

    /**
     * Returns a random number between the given range.
     * @param {number} min Minimum value.
     * @param {number} max Maximum value.
     * @returns {number} Random number.
     */
    rand(min, max) {
        return min + Math.random() * (max - min);
    }
}