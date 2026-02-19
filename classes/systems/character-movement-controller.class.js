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
        const cameraOffset = isMobile ? 920 : 1060;
        const t = 0.05 * (this.char.deltaTime * 60);
        this.char.isFlipped = true;
        if (this.char.x > this.char.level_start_x) {
            this.char.x -= this.char.movementSpeed;
            this.world.camera_x += ((this.char.x - cameraOffset) - this.world.camera_x) * t;
        }
    }

    /**
    * Moves the character to the right.
    */
    moveRight() {
        const isMobile = window.innerWidth <= 900;
        const cameraOffset = isMobile ? 150 : 100;
        const t = 0.05 * (this.char.deltaTime * 60);
        this.char.isFlipped = false;
        if (this.char.x < this.world.level_end_x) {
            this.char.x += this.char.movementSpeed;
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
        const maxCameraX = this.world.level_end_x - 720;
        this.world.camera_x = Math.max(0, Math.min(this.world.camera_x, maxCameraX));
    }

    /**
    * Moves the camera towards a target position.
    * @param {number} targetX Target x-coordinate.
    * @param {Object} [options={}] Movement options.
    * @returns {boolean} True if movement is finished, otherwise false.
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
    * Normalizes movement options for horizontal movement.
    * @param {Object} [options={}] Movement options.
    * @param {number} [options.tolerance=3] Distance threshold to consider arrival.
    * @param {boolean} [options.snap=true] Whether to snap to target on arrival.
    * @param {number} [options.speed=5] Movement speed.
    * @param {boolean} [options.faceTarget=true] Whether to face the target direction.
    * @param {boolean} [options.setWalkFlag=false] Whether to set the walk state flag.
    * @param {?Function} [options.onArrive=null] Callback invoked on arrival.
    * @returns {Object} Normalized movement options.
    */
    normalizeMoveToXOptions(options = {}) {
        const {
            tolerance = 3,
            snap = true,
            speed = 5,
            faceTarget = true,
            setWalkFlag = false,
            onArrive = null
        } = options;
        return { tolerance, snap, speed, faceTarget, setWalkFlag, onArrive };
    }

    /**
    * Applies horizontal movement based on configuration.
    * @param {Object} cfg Movement configuration.
    * @returns {boolean} True if movement is finished, otherwise false.
    */
    applyMoveToX(cfg) {
        const char = this.char;
        const { d, targetX, tolerance, snap, speed, onArrive } = cfg;
        if (Math.abs(d) <= tolerance) {
            char.isWalk = false;
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
    * Builds configuration for vertical movement towards a target.
    * @param {number} targetY Target y-coordinate.
    * @param {Object} [options={}] Movement options.
    * @param {number} [options.tolerance=2] Distance threshold to consider arrival.
    * @param {boolean} [options.snap=true] Whether to snap to target on arrival.
    * @param {number} [options.speed=1.5] Movement speed.
    * @param {?Function} [options.onArrive=null] Callback invoked on arrival.
    * @returns {Object} Movement configuration.
    */
    buildMoveToYConfig(targetY, options = {}) {
        const char = this.char;
        const {
            tolerance = 2,
            snap = true,
            speed = 1.5,
            onArrive = null
        } = options;
        const d = targetY - char.y;
        return { d, targetY, tolerance, snap, speed, onArrive };
    }

    /**
    * Applies vertical movement based on configuration.
    * @param {Object} cfg Movement configuration.
    * @returns {boolean} True if movement is finished, otherwise false.
    */
    applyMoveToY(cfg) {
        const char = this.char;
        const { d, targetY, tolerance, snap, speed, onArrive } = cfg;
        if (Math.abs(d) <= tolerance) {
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
}