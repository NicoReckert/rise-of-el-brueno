/**
 * Controls camera movement and behavior.
 */
export class CameraController {
    /**
    * Creates a new instance.
    * @param {Object} world World instance.
    */
    constructor(world) {
        this.world = world;
    }

    /**
    * Moves the camera towards a target position.
    * @param {number} targetX Target x-coordinate.
    * @param {Object} [options={}] Movement options.
    * @returns {boolean} True if movement is finished, otherwise false.
    */
    moveToX(targetX, options = {}) {
        const cfg = this.prepareMove(targetX, options);
        if (!cfg) return false;
        if (this.tryFinish(cfg)) return true;
        this.advance(cfg);
        return false;
    }

    /**
    * Prepares configuration for a camera movement.
    * @param {number} targetX Target x-coordinate.
    * @param {Object} [options={}] Movement options.
    * @param {number} [options.tolerance=1] Distance threshold to consider arrival.
    * @param {number} [options.speed=6] Movement speed.
    * @param {boolean} [options.snap=true] Whether to snap to target on arrival.
    * @param {boolean} [options.clamp=true] Whether to clamp camera within bounds.
    * @param {?Function} [options.onArrive=null] Callback invoked on arrival.
    * @returns {Object|null} Movement configuration or null if invalid.
    */
    prepareMove(targetX, options = {}) {
        const {
            tolerance = 1,
            speed = 6,
            snap = true,
            clamp = true,
            onArrive = null
        } = options;
        const norm = this.normalizeParams(targetX, speed);
        if (!norm) return null;
        const dt = this.getDeltaTime();
        return { ...norm, tolerance, snap, clamp, onArrive, dt };
    }

    /**
    * Normalizes camera movement parameters.
    * @param {number} targetX Target x-coordinate.
    * @param {number} speed Movement speed.
    * @returns {{targetX: number, speed: number}|null} Normalized parameters or null if invalid.
    */
    normalizeParams(targetX, speed) {
        const world = this.world;
        const tx = Number(targetX);
        const sp = Number(speed);
        if (!Number.isFinite(world.camera_x)) world.camera_x = 0;
        if (!Number.isFinite(tx) || !Number.isFinite(sp)) return null;
        return { targetX: tx, speed: sp };
    }

    /**
    * Returns the delta time used for camera movement.
    * @returns {number} Clamped delta time value.
    */
    getDeltaTime() {
        const world = this.world;
        let dt = Number(world.character?.deltaTime);
        if (!Number.isFinite(dt) || dt <= 0) dt = 1 / 60;
        return Math.min(dt, 0.05);
    }

    /**
    * Attempts to finish the camera movement if within tolerance.
    * @param {Object} cfg Movement configuration.
    * @returns {boolean} True if movement is finished, otherwise false.
    */
    tryFinish(cfg) {
        const world = this.world;
        const d = cfg.targetX - world.camera_x;
        if (Math.abs(d) > cfg.tolerance) return false;
        if (cfg.snap) world.camera_x = cfg.targetX;
        if (cfg.clamp) this.clamp();
        cfg.onArrive?.();
        return true;
    }

    /**
    * Advances the camera position towards the target.
    * @param {Object} cfg Movement configuration.
    */
    advance(cfg) {
        const world = this.world;
        const d = cfg.targetX - world.camera_x;
        const step = cfg.speed * cfg.dt * 60;
        const move = Math.sign(d) * Math.min(Math.abs(d), step);
        world.camera_x += move;
        if (cfg.clamp) this.clamp();
    }

    /**
    * Clamps the camera position within level boundaries.
    */
    clamp() {
        const world = this.world;
        const levelEnd = Number(world.level_end_x);
        if (!Number.isFinite(levelEnd)) return;
        const maxCameraX = levelEnd - 720;
        if (!Number.isFinite(world.camera_x)) world.camera_x = 0;
        world.camera_x = Math.max(0, Math.min(world.camera_x, maxCameraX));
    }
}