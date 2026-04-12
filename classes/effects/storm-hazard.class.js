import { MovableObject } from '../systems/movable-object.class.js';
import { HAZARD_DEFS } from '../../config/hazard-config.js';
import { getCachedEntityAnimation } from '../../utils/entity-animation-cache.util.js';
import { stormHazardRuntimeMethods } from './storm-hazard-runtime.methods.js';
import { stormHazardHitMethods } from './storm-hazard-hit.methods.js';

/**
 * Represents a storm hazard entity.
 */
export class StormHazard extends MovableObject {
    /**
     * Creates a new storm hazard instance.
     * @param {Object} setup Setup reference.
     * @param {Object} [cfg={}] Configuration options.
     */
    constructor(setup, cfg = {}) {
        super();
        this.setup = setup;
        this.initConfig(cfg);
        this.initPosition(cfg);
        this.initTimingConfig(cfg);
        this.initLifecycle();
        this.initAnimationState();
    }

    /**
     * Initializes the configuration for the hazard.
     * @param {Object} cfg Configuration options.
     * @returns {void}
     */
    initConfig(cfg) {
        this.type = cfg.type ?? 'hazard';
        this.def = cfg.def ?? null;
        this.kind = cfg.kind ?? 'hazard';
        this.anim = cfg.anim;
        this.animName = cfg.animName ?? 'idle';
        this.fps = cfg.fps ?? 10;
        this.offset = cfg.offset ?? { top: 0, left: 0, right: 0, bottom: 0 };
    }

    /**
     * Initializes the position and size of the hazard.
     * @param {Object} cfg Configuration options.
     * @returns {void}
     */
    initPosition(cfg) {
        this.x = cfg.x ?? 0;
        this.y = cfg.y ?? 0;
        this.width = cfg.width ?? 200;
        this.height = cfg.height ?? 200;
        this.speedX = cfg.speedX ?? -10;
    }

    /**
     * Initializes timing configuration for the hazard.
     * @param {Object} cfg Configuration options.
     * @returns {void}
     */
    initTimingConfig(cfg) {
        this.telegraphMs = cfg.telegraphMs ?? 0;
        this.activeMs = cfg.activeMs ?? 900;
        this.lifeMs = cfg.lifeMs ?? 2000;
        this.frameInterval = 1000 / this.fps;
    }

    /**
     * Initializes lifecycle timestamps for the hazard.
     * @returns {void}
     */
    initLifecycle() {
        this.spawnTime = performance.now();
        this.activeFrom = this.spawnTime + this.telegraphMs;
        this.activeUntil = this.activeFrom + this.activeMs;
        this.dieAt = this.spawnTime + this.lifeMs;
    }

    /**
     * Initializes the animation state for the hazard.
     * @returns {void}
     */
    initAnimationState() {
        this.currentAnimation = this.animName;
        this.frameIndex = 0;
        this.sheetIndex = 0;
        this.lastFrameTime = 0;
        this.markedForRemoval = false;
    }

    /**
     * Spawns a hazard instance.
     * @param {Object} setup Setup reference.
     * @param {string} type Hazard type.
     * @param {Object} [opts={}] Spawn options.
     * @returns {StormHazard|null} Spawned hazard instance or null.
     */
    static spawn(setup, type, opts = {}) {
        const def = HAZARD_DEFS[type];
        if (!def) return null;
        const lane = this.resolveSpawnLane(def, opts.lane ?? 'safe');
        const data = this.buildSpawnData(setup, type, def, lane, opts);
        const hazard = new StormHazard(setup, this.buildHazardConfig(type, def, data));
        setup.state.effectsFront.push(hazard);
        return hazard;
    }

    /**
     * Resolves the spawn lane for the hazard.
     * @param {Object} def Hazard definition.
     * @param {string} lane Requested lane.
     * @returns {string} Resolved lane.
     */
    static resolveSpawnLane(def, lane) {
        if (!def.allowedLanes || def.allowedLanes.includes(lane)) return lane;
        return def.defaultLane ?? def.allowedLanes[0] ?? 'safe';
    }

    /**
     * Resolves the animation frames for a hazard entity.
     * @param {Object} setup Setup context object.
     * @param {string} type Hazard entity type.
     * @param {Object} def Hazard definition.
     * @returns {Array|null} Array of animation frames or null if unavailable.
     */
    static resolveHazardAnimation(setup, type, def) {
        const cached = getCachedEntityAnimation(setup.entityImages, type, 'idle');
        if (cached) return cached;
        return def.getAnim?.({ images: setup.entityImages }) ?? null;
    }

    /**
     * Builds spawn data for a hazard entity.
     * @param {Object} setup Setup context object.
     * @param {string} type Hazard entity type.
     * @param {Object} def Hazard definition.
     * @param {number} lane Spawn lane index.
     * @param {Object} [options={}] Spawn configuration overrides.
     * @param {number} [options.x] Custom spawn x-position.
     * @param {number} [options.y] Custom spawn y-position.
     * @param {number} [options.speedX] Custom horizontal speed.
     * @param {number} [options.seed] Random seed value.
     * @returns {{lane:number, seed:number, size:Object, anim:Array|null, finalSpeedX:number, finalX:number, finalY:number, lifeMs:number}} Spawn data.
     */
    static buildSpawnData(setup, type, def, lane, { x, y, speedX, seed } = {}) {
        const world = setup.world;
        const camX = world.townLevelController?.renderCameraX ?? 0;
        const canvasW = world.canvas?.width ?? 1280;
        const size = def.size;
        const anim = this.resolveHazardAnimation(setup, type, def) ?? null;
        const finalSpeedX = speedX ?? this.getLaneSpeed(def, lane);
        const finalX = x ?? this.getSpawnX(def, camX, canvasW);
        const finalY = y ?? this.getSpawnY(def, setup, lane, size, world);
        const lifeMs = this.getLifeMs(def, canvasW, finalSpeedX);
        return { lane, seed, size, anim, finalSpeedX, finalX, finalY, lifeMs };
    }

    /**
     * Returns the horizontal speed for a hazard lane.
     * @param {Object} def Hazard definition.
     * @param {string} lane Lane identifier.
     * @returns {number} Horizontal speed.
     */
    static getLaneSpeed(def, lane) {
        return def.laneSpeed ? def.laneSpeed({ lane }) : -10;
    }

    /**
     * Calculates the spawn X position for a hazard.
     * @param {Object} def Hazard definition.
     * @param {number} camX Camera X position.
     * @param {number} canvasW Canvas width.
     * @returns {number} Spawn X position.
     */
    static getSpawnX(def, camX, canvasW) {
        return camX + canvasW + (def.spawnOffsetX ?? 240);
    }

    /**
     * Calculates the spawn Y position for a hazard.
     * @param {Object} def Hazard definition.
     * @param {Object} setup Setup reference.
     * @param {string} lane Lane identifier.
     * @param {Object} size Hazard size.
     * @param {Object} world World reference.
     * @returns {number} Spawn Y position.
     */
    static getSpawnY(def, setup, lane, size, world) {
        if (def.laneY) return def.laneY({ setup, lane, size });
        return world.character?.y ?? 0;
    }

    /**
     * Calculates the lifetime for a hazard instance.
     * @param {Object} def Hazard definition.
     * @param {number} canvasW Canvas width.
     * @param {number} finalSpeedX Final horizontal speed.
     * @returns {number} Lifetime in milliseconds.
     */
    static getLifeMs(def, canvasW, finalSpeedX) {
        let lifeMs = def.timing?.lifeMs ?? 4000;
        if (typeof def.lifeFromTravel === 'function') {
            lifeMs = def.lifeFromTravel({ canvasW, speedX: finalSpeedX });
        }
        return lifeMs;
    }

    /**
     * Builds the configuration object for a hazard instance.
     * @param {string} type Hazard type.
     * @param {Object} def Hazard definition.
     * @param {Object} data Spawn data.
     * @returns {Object} Hazard configuration.
     */
    static buildHazardConfig(type, def, data) {
        return {
            type, def, anim: data.anim, seed: data.seed,
            kind: def.kind ?? type,
            animName: 'idle',
            fps: def.fps ?? 12,
            x: data.finalX, y: data.finalY,
            width: data.size.width, height: data.size.height,
            speedX: data.finalSpeedX, lifeMs: data.lifeMs,
            telegraphMs: def.timing?.telegraphMs ?? 0,
            activeMs: def.timing?.activeMs ?? 9999,
            offset: { ...(def.offset ?? {}) }
        };
    }

    /**
     * Updates the state.
     * @param {number} timestamp Current timestamp.
     * @returns {void}
     */
    updateState(timestamp) {
        if (this.markedForRemoval) return;
        this.updateDeltaTime(timestamp);
        this.moveByDelta();
        if (this.expireIfNeeded(timestamp)) return;
        this.updateAnimation(timestamp);
        if (!this.isWithinActiveWindow(timestamp)) return;
        const char = this.getStateCharacter();
        if (!char) return;
        if (this.hasCharacterCollision(char) && this.canHitCharacter(char, timestamp)) {
            this.onHitCharacter(char, this.setup, timestamp);
        }
    }

    /**
     * Updates the hazard animation based on the current timestamp.
     * @param {number} timestamp Current timestamp.
     * @returns {void}
     */
    updateAnimation(timestamp) {
        if (!this.anim) return;
        if (!this.lastFrameTime) this.lastFrameTime = timestamp;
        const dt = timestamp - this.lastFrameTime;
        if (dt <= this.frameInterval) return;
        this.updateAnimationFromSourceGeneric(this.anim, {
            isOneShot: false,
            allowLoop: true,
        });
        this.lastFrameTime = timestamp;
    }
}

/**
 * Assigns runtime and hit methods to the StormHazard prototype.
 */
Object.assign(StormHazard.prototype, stormHazardRuntimeMethods, stormHazardHitMethods);