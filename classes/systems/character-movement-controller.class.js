/**
 * Controls character movement behavior.
 */
export class CharacterMovementController {
    /**
     * Creates a new instance.
     * @param {Object} character Character instance.
     * @param {Object} world World instance.
     */
    constructor(character, world, animationController) {
        this.char = character;
        this.world = world;
        this.animCtrl = animationController;
    }

    /**
     * Updates the character state.
     * @param {number} timestamp Frame timestamp.
     */
    updateState(timestamp) {
        this.char.prevBottom =
            this.char.y + this.char.height - (this.char.offset?.bottom || 0);
        this.handleMovementLock(timestamp);
        if (this.handleAirHitStun(timestamp)) return;
        if (this.handleTornadoCapture()) return;
        this.char.updateDeltaTime(timestamp);
        this.applyKnockback();
        this.handleMovement();
        this.clampCamera();
        this.animCtrl.handleCharacterAnimation();
    }

    /**
     * Handles movement lock state.
     * @param {number} timestamp Frame timestamp.
     */
    handleMovementLock(timestamp) {
        if (!this.char.movementLockUntil) return;
        if (timestamp < this.char.movementLockUntil) {
            this.char.isMovingLeft = false;
            this.char.isMovingRight = false;
        }
    }

    /**
     * Handles air hit stun state.
     * @param {number} timestamp Frame timestamp.
     * @returns {boolean} True if air hit stun is active, otherwise false.
     */
    handleAirHitStun(timestamp) {
        if (!this.char.isAirHitStun) return false;
        if (timestamp - this.char.airHitStunStart >= this.char.airHitStunDuration) {
            this.char.isAirHitStun = false;
            this.char.isCapturedByTornado = false;
        }
        this.char.isMovingLeft = false;
        this.char.isMovingRight = false;
        this.char.speedY = 0;
        this.animCtrl.handleCharacterAnimation();
        return true;
    }

    /**
     * Handles tornado capture state.
     * @returns {boolean} True if captured by tornado, otherwise false.
     */
    handleTornadoCapture() {
        if (!this.char.isCapturedByTornado) return false;
        this.char.speedY = 0;
        return true;
    }

    /**
     * Applies knockback movement to the character.
     */
    applyKnockback() {
        if (!this.char.knockbackVelocityX) return;
        this.char.x += this.char.knockbackVelocityX;
        this.char.knockbackVelocityX *= 0.85;
        if (Math.abs(this.char.knockbackVelocityX) < 0.5) {
            this.char.knockbackVelocityX = 0;
        }
    }

    /**
     * Handles horizontal character movement.
     */
    handleMovement() {
        if (this.char.isMovingLeft) {
            this.moveLeft();
        } else if (this.char.isMovingRight) {
            this.moveRight();
        }
    }

    /**
     * Moves the character to the left.
     */
    moveLeft() {
        const isMobile = window.innerWidth <= 900;
        const cameraOffset = isMobile ? 725 : 1060;
        const t = 0.05 * (this.char.deltaTime * 60);
        this.char.isFlipped = true;
        const speed = this.getEffectiveMoveSpeed();
        if (this.char.x > this.world.level_start_x) {
            this.char.x -= speed;
            this.world.camera_x += ((this.char.x - cameraOffset) - this.world.camera_x) * t;
        }
    }

    /**
     * Moves the character to the right.
     */
    moveRight() {
        const isMobile = window.innerWidth <= 900;
        const cameraOffset = isMobile ? 275 : 100;
        const t = 0.05 * (this.char.deltaTime * 60);
        this.char.isFlipped = false;
        const speed = this.getEffectiveMoveSpeed();
        if (this.char.x < this.world.level_end_x) {
            this.char.x += speed;
            this.world.camera_x += ((this.char.x - cameraOffset) - this.world.camera_x) * t;
        }
    }

    /**
     * Applies an upward bounce to the character.
     */
    bounce() {
        this.char.speedY = 10;
    }

    /**
     * Clamps the camera position within level boundaries.
     */
    clampCamera() {
        const minCameraX = this.world.camera_start_x ?? 0;
        const maxCameraX = this.world.level_end_x - 720;
        this.world.camera_x = Math.max(minCameraX, Math.min(this.world.camera_x, maxCameraX));
    }

    /**
     * Moves to a target X position.
     * @param {number} targetX Target X position.
     * @param {Object} [options={}] Move options.
     * @returns {boolean} True if the target position was reached, otherwise false.
     */
    moveToX(targetX, options = {}) {
        const cfg = this.buildMoveToXConfig(targetX, options);
        return this.applyMoveToX(cfg);
    }

    /**
     * Builds configuration for horizontal movement towards a target.
     * @param {number} targetX Target x-coordinate.
     * @param {Object} [options={}] Movement options.
     * @returns {Object} Movement configuration.
     */
    buildMoveToXConfig(targetX, options = {}) {
        const char = this.char;
        const cfg = this.normalizeMoveToXOptions(options);
        const d = targetX - char.x;
        if (cfg.faceTarget) {
            char.isFlipped = d < 0;
        }
        if (cfg.setWalkFlag) {
            char.isWalk = Math.abs(d) > cfg.tolerance;
        }
        return { ...cfg, d, targetX };
    }

    /**
     * Normalizes move-to-X options.
     * @param {Object} [options={}] Move options.
     * @returns {Object} Normalized move-to-X options.
     */
    normalizeMoveToXOptions(options = {}) {
        const {
            tolerance = 3,
            snap = true,
            speed = 5,
            faceTarget = true,
            setWalkFlag = false,
            stopWalkOnArrive = true,
            onArrive = null
        } = options;
        return { tolerance, snap, speed, faceTarget, setWalkFlag, stopWalkOnArrive, onArrive };
    }

    /**
     * Applies horizontal movement based on configuration.
     * @param {Object} cfg Movement configuration.
     * @returns {boolean} True if movement is finished, otherwise false.
     */
    applyMoveToX(cfg) {
        const char = this.char;
        const { d, targetX, tolerance, snap, speed, onArrive, stopWalkOnArrive } = cfg;
        if (Math.abs(d) <= tolerance) {
            if (stopWalkOnArrive) char.isWalk = false;
            if (snap) char.x = targetX;
            onArrive?.();
            return true;
        }
        const dt = char.deltaTime ?? 1 / 60;
        const step = speed * dt * 60;
        char.x += Math.sign(d) * step;
        return false;
    }

    /**
     * Moves the character vertically towards a target position.
     * @param {number} targetY Target y-coordinate.
     * @param {Object} [options={}] Movement options.
     * @returns {boolean} True if movement is finished, otherwise false.
     */
    moveToY(targetY, options = {}) {
        const cfg = this.buildMoveToYConfig(targetY, options);
        return this.applyMoveToY(cfg);
    }

    /**
     * Builds move-to-Y configuration.
     * @param {number} targetY Target Y position.
     * @param {Object} [options={}] Move options.
     * @returns {Object} Move-to-Y configuration.
     */
    buildMoveToYConfig(targetY, options = {}) {
        const char = this.char;
        const {
            tolerance = 2,
            snap = true,
            speed = 1.5,
            stopWalkOnArrive = false,
            onArrive = null
        } = options;
        const d = targetY - char.y;
        return { d, targetY, tolerance, snap, speed, stopWalkOnArrive, onArrive };
    }

    /**
     * Applies vertical movement based on configuration.
     * @param {Object} cfg Movement configuration.
     * @returns {boolean} True if movement is finished, otherwise false.
     */
    applyMoveToY(cfg) {
        const char = this.char;
        const { d, targetY, tolerance, snap, speed, stopWalkOnArrive, onArrive } = cfg;
        if (Math.abs(d) <= tolerance) {
            if (stopWalkOnArrive) char.isWalk = false;
            if (snap) char.y = targetY;
            onArrive?.();
            return true;
        }
        const dt = char.deltaTime ?? 1 / 60;
        const step = speed * dt * 60;
        char.y += Math.sign(d) * step;
        return false;
    }

    /**
     * Clamps an object's x-position within bounds.
     * @param {Object} object Object with an x property.
     * @param {number} minX Minimum x-value.
     * @param {number} maxX Maximum x-value.
     */
    clampX(object, minX, maxX) {
        if (object.x < minX) object.x = minX;
        if (object.x > maxX) object.x = maxX;
    }

    /**
     * Returns the effective movement speed based on the current state.
     * @returns {number} Effective movement speed.
     */
    getEffectiveMoveSpeed() {
        const duckMoving =
            this.char.duckState === 'loop' &&
            (this.char.isMovingLeft || this.char.isMovingRight);
        if (duckMoving) {
            const duckSpeedX = this.char.duckSpeedX ?? 3.2;
            const dt60 = (this.char.deltaTime ?? 1 / 60) * 60;
            return duckSpeedX * dt60;
        }
        return this.char.movementSpeed;
    }
}