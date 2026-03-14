import { MovableObject } from '../systems/movable-object.class.js';
import { ImpactEffect } from './impact-effect.class.js';
import { HAZARD_DEFS } from '../../config/hazard-config.js';
import { getCachedEntityAnimation } from '../../utils/entity-animation-cache.util.js';

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
        setup.state.effects.push(hazard);
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
     * Updates the hazard state and handles movement, animation, and collisions.
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
        if (this.hasCharacterCollision(char)) {
            this.onHitCharacter(char, this.setup, timestamp);
        }
    }

    /**
     * Updates the horizontal position based on delta time.
     * @returns {void}
     */
    moveByDelta() {
        const dt60 = (this.deltaTime ?? 1 / 60) * 60;
        this.x += (this.speedX ?? 0) * dt60;
    }

    /**
     * Checks whether the hazard lifetime has expired and marks it for removal.
     * @param {number} timestamp Current timestamp.
     * @returns {boolean} True if the hazard expired.
     */
    expireIfNeeded(timestamp) {
        if (timestamp < this.dieAt) return false;
        this.markedForRemoval = true;
        return true;
    }

    /**
     * Checks whether the hazard is within its active window.
     * @param {number} timestamp Current timestamp.
     * @returns {boolean} True if within the active window.
     */
    isWithinActiveWindow(timestamp) {
        return timestamp >= this.activeFrom && timestamp <= this.activeUntil;
    }

    /**
     * Returns the character used for hazard state checks.
     * @returns {Object|undefined} Character instance.
     */
    getStateCharacter() {
        return this.setup?.world?.character;
    }

    /**
     * Checks whether the hazard collides with the character.
     * @param {Object} char Character instance.
     * @returns {boolean} True if a collision occurs.
     */
    hasCharacterCollision(char) {
        return this.isColliding(
            char,
            { x: 0, y: 0, width: 0, height: 0 },
            { x: 0, y: 0, width: 0, height: 0 }
        );
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

    /**
     * Handles collision effects when the hazard hits the character.
     * @param {Object} character Character instance.
     * @param {Object} setup Setup reference.
     * @param {number} now Current timestamp.
     * @returns {void}
     */
    onHitCharacter(character, setup, now) {
        const hit = this.def?.hit;
        if (!hit) {
            this.markedForRemoval = true;
            return;
        }
        this.applyCharacterHurt(character, hit, now);
        this.applyCharacterKnockback(character, hit);
        const impactAnim = this.getImpactAnim(hit, setup);
        if (impactAnim) this.spawnImpactEffect(hit, setup, impactAnim);
        this.markedForRemoval = true;
    }

    /**
     * Applies a hurt state to the character.
     * @param {Object} character Character instance.
     * @param {Object} hit Hit configuration.
     * @param {number} now Current timestamp.
     * @returns {void}
     */
    applyCharacterHurt(character, hit, now) {
        const hurtMs = hit.hurtMs ?? 300;
        character.hurtUntil = Math.max(character.hurtUntil ?? 0, now + hurtMs);
    }

    /**
     * Applies knockback to the character.
     * @param {Object} character Character instance.
     * @param {Object} hit Hit configuration.
     * @returns {void}
     */
    applyCharacterKnockback(character, hit) {
        const knock = hit.knockback ?? 0;
        character.knockbackVelocityX = (this.speedX < 0 ? -1 : 1) * knock;
    }

    /**
     * Returns the impact animation for a hit configuration.
     * @param {Object} hit Hit configuration.
     * @param {Object} setup Setup reference.
     * @returns {Object|null} Impact animation source.
     */
    getImpactAnim(hit, setup) {
        return hit.getImpactAnim?.({ images: setup.entityImages }) ?? null;
    }

    /**
     * Spawns an impact effect at the hazard position.
     * @param {Object} hit Hit configuration.
     * @param {Object} setup Setup reference.
     * @param {Object} impactAnim Impact animation source.
     * @returns {void}
     */
    spawnImpactEffect(hit, setup, impactAnim) {
        const { cx, cy } = this.getImpactCenter(hit);
        const size = hit.impactSize ?? { width: 220, height: 220 };
        setup.state.effects.push(this.createImpactEffect(hit, impactAnim, cx, cy, size));
    }

    /**
     * Returns the impact center position.
     * @param {Object} hit Hit configuration.
     * @returns {{cx:number,cy:number}} Impact center coordinates.
     */
    getImpactCenter(hit) {
        const cx = (this.getRenderX?.() ?? this.x) + this.width * 0.5;
        const factorY = hit.impactOffsetFactorY ?? 0.5;
        const cy = this.y + this.height * factorY;
        return { cx, cy };
    }

    /**
     * Creates an impact effect instance.
     * @param {Object} hit Hit configuration.
     * @param {Object} impactAnim Impact animation source.
     * @param {number} cx Impact center X.
     * @param {number} cy Impact center Y.
     * @param {{width:number,height:number}} size Impact size.
     * @returns {Object} Impact effect instance.
     */
    createImpactEffect(hit, impactAnim, cx, cy, size) {
        return new ImpactEffect(
            impactAnim,
            cx - size.width / 2,
            cy - size.height / 2,
            { fps: hit.impactFps ?? 18, width: size.width, height: size.height }
        );
    }
}