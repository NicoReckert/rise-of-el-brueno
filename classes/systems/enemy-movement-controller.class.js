/**
 * Controls movement behavior for an enemy.
 */
export class EnemyMovementController {
    /**
    * Creates a new instance.
    * @param {object} enemy Enemy instance.
    */
    constructor(enemy) {
        this.enemy = enemy;
    }

    /**
    * Moves the enemy to the left.
    * @returns {void}
    */
    moveLeft() {
        this.enemy.isFlipped = false;
        this.enemy.x -= this.enemy.movementSpeed;
    }

    /**
    * Moves the enemy to the right.
    * @returns {void}
    */
    moveRight() {
        this.enemy.isFlipped = true;
        this.enemy.x += this.enemy.movementSpeed;
    }

    /**
    * Handles enemy movement based on direction flags.
    * @returns {void}
    */
    handleMovement() {
        if (this.enemy.isMovingLeft) return this.moveLeft();
        if (this.enemy.isMovingRight) return this.moveRight();
    }

    /**
    * Applies gravity to the enemy.
    * @returns {void}
    */
    applyGravity() {
        if (!this.enemy.isGravity) return;
        const groundY = this.enemy.spawnY;
        this.enemy.y -= this.enemy.speedY;
        this.enemy.speedY -= this.enemy.acceleration;
        if (this.enemy.y >= groundY) {
            this.enemy.y = groundY;
            this.enemy.speedY = 0;
            this.enemy.isGravity = false;
            this.enemy.knockbackActive = false;
        }
    }

    /**
    * Moves the enemy toward the target x position.
    * @param {?object} [target=null] Target object.
    * @param {object} [options={}] Movement options.
    * @returns {boolean} True if movement was handled, otherwise false.
    */
    moveToTargetX(target = null, options = {}) {
        const t = this.resolveMoveTarget(target);
        if (!t) return false;
        const centers = this.getMoveCenters(t);
        const targetX = this.getDesiredTargetX(centers, options.desiredDist ?? 0);
        const {
            tolerance = 10,
            speed = 60,
            faceTarget = true
        } = options;
        return this.moveToX(targetX, { tolerance, speed, faceTarget, target: t });
    }

    /**
    * Resolves the movement target.
    * @param {?object} target Target object.
    * @returns {object|null} Resolved target or null.
    */
    resolveMoveTarget(target) {
        return target ?? this.enemy.world?.character ?? null;
    }

    /**
    * Returns the horizontal center positions for movement calculations.
    * @param {object} target Target object.
    * @returns {{tCenter: number, eCenter: number}} Target and enemy center positions.
    */
    getMoveCenters(target) {
        const tCenter = target.x + target.width * 0.5;
        const eCenter = this.enemy.x + this.enemy.width * 0.5;
        return { tCenter, eCenter };
    }

    /**
    * Calculates the desired target x position.
    * @param {{tCenter: number, eCenter: number}} centers Target and enemy center positions.
    * @param {number} desiredDist Desired distance to the target.
    * @returns {number} Desired target x position.
    */
    getDesiredTargetX(centers, desiredDist) {
        const dx = centers.tCenter - centers.eCenter;
        const offset = Math.max(0, Math.abs(dx) - desiredDist);
        return this.enemy.x + Math.sign(dx) * offset;
    }

    /**
    * Moves the enemy toward the given x position.
    * @param {number} targetX Target x position.
    * @param {object} [options={}] Movement options.
    * @returns {boolean} True if the target position was reached, otherwise false.
    */
    moveToX(targetX, options = {}) {
        const { tolerance = 3, snap = true, speed = 60, faceTarget = true, onArrive = null, target = null } = options;
        const d = targetX - this.enemy.x;
        this.updateFacingOnMove(faceTarget, target);
        if (this.hasReachedX(d, tolerance, snap, targetX, onArrive)) return true;
        this.stepTowardsX(d, speed);
        return false;
    }

    /**
    * Updates the facing direction during movement.
    * @param {boolean} faceTarget Whether the enemy should face the target.
    * @param {?object} target Target object.
    * @returns {void}
    */
    updateFacingOnMove(faceTarget, target) {
        if (!faceTarget) return;
        if (!target) return;
        this.enemy.isFlipped = target.x > this.enemy.x;
    }

    /**
    * Checks whether the target x position has been reached.
    * @param {number} d Distance to the target x position.
    * @param {number} tolerance Allowed distance tolerance.
    * @param {boolean} snap Whether to snap to the target position.
    * @param {number} targetX Target x position.
    * @param {?Function} onArrive Callback to execute on arrival.
    * @returns {boolean} True if the target position was reached, otherwise false.
    */
    hasReachedX(d, tolerance, snap, targetX, onArrive) {
        if (Math.abs(d) > tolerance) return false;
        this.enemy.isMovingLeft = false;
        this.enemy.isMovingRight = false;
        if (snap) this.enemy.x = targetX;
        onArrive?.();
        return true;
    }

    /**
    * Moves the enemy one step toward the target x position.
    * @param {number} d Distance to the target x position.
    * @param {number} speed Movement speed.
    * @returns {void}
    */
    stepTowardsX(d, speed) {
        const dt = this.enemy.deltaTime ?? 1 / 60;
        const maxStep = speed * dt;
        const step = Math.sign(d) * Math.min(Math.abs(d), maxStep);
        this.enemy.x += step;
        this.enemy.isMovingRight = d > 0;
        this.enemy.isMovingLeft = d < 0;
    }

    /**
    * Keeps distance to the target within the configured range.
    * @param {?object} [target=null] Target object.
    * @param {object} [options={}] Distance control options.
    * @returns {boolean} True if no further movement is needed or processing stops, otherwise false.
    */
    keepDistanceToTarget(target = null, options = {}) {
        const { desiredDist = this.enemy.meleeRange, tolerance = 6, speed = 1.0, faceTarget = true } = options;
        const t = target ?? this.enemy.world?.character;
        if (!t) return false;
        if (this.shouldAbortForJump(t)) return true;
        const { dx, dist } = this.getDistanceToTarget(t);
        this.updateFacing(dx, faceTarget);
        if (this.isWithinRange(dist, desiredDist, tolerance)) return true;
        const move = this.getMoveDirectionInfo(dx, dist, desiredDist, tolerance, t);
        if (!move) return true;
        const finalSpeed = this.getFinalDistanceSpeed(speed, move.wantGoToTarget, dist);
        this.applyDistanceStep(move.dir, finalSpeed);
        return false;
    }

    /**
    * Checks whether distance handling should stop because the target is jumping.
    * @param {object} target Target object.
    * @returns {boolean} True if handling should stop, otherwise false.
    */
    shouldAbortForJump(target) {
        const isAboveGround =
            typeof target.isAboveGround === "function" && target.isAboveGround();
        if (!(isAboveGround && target.isJumping)) return false;
        this.stopMovement();
        return true;
    }

    /**
    * Returns the horizontal distance to the target.
    * @param {object} target Target object.
    * @returns {{dx: number, dist: number}} Horizontal delta and distance.
    */
    getDistanceToTarget(target) {
        const ex = this.enemy.x + this.enemy.width * 0.5;
        const tx = target.x + target.width * 0.5;
        const dx = tx - ex;
        const dist = Math.abs(dx);
        return { dx, dist };
    }

    /**
    * Updates the facing direction based on the target delta.
    * @param {number} dx Horizontal delta to the target.
    * @param {boolean} faceTarget Whether the enemy should face the target.
    * @returns {void}
    */
    updateFacing(dx, faceTarget) {
        if (!faceTarget) return;
        this.enemy.isFlipped = dx > 0;
    }

    /**
    * Checks whether the current distance is within the desired range.
    * @param {number} dist Current distance.
    * @param {number} desiredDist Desired distance.
    * @param {number} tolerance Allowed tolerance.
    * @returns {boolean} True if the distance is within range, otherwise false.
    */
    isWithinRange(dist, desiredDist, tolerance) {
        const min = desiredDist - tolerance;
        const max = desiredDist + tolerance;
        if (dist < min || dist > max) return false;
        this.stopMovement();
        return true;
    }

    /**
    * Returns movement direction data for distance control.
    * @param {number} dx Horizontal delta to the target.
    * @param {number} dist Current distance.
    * @param {number} desiredDist Desired distance.
    * @param {number} tolerance Allowed tolerance.
    * @param {object} target Target object.
    * @returns {{dir: number, wantGoToTarget: boolean}|null} Direction data or null.
    */
    getMoveDirectionInfo(dx, dist, desiredDist, tolerance, target) {
        const wantGoToTarget = dist > desiredDist + tolerance;
        let dir = wantGoToTarget ? Math.sign(dx) : -Math.sign(dx);
        if (dir === 0) {
            dir = this.enemy.isFlipped ? 1 : -1;
        }
        if (!wantGoToTarget && target.isJumping) {
            this.stopMovement();
            return null;
        }
        return { dir, wantGoToTarget };
    }

    /**
    * Returns the final movement speed for distance control.
    * @param {number} baseSpeed Base movement speed.
    * @param {boolean} wantGoToTarget Whether the enemy should move toward the target.
    * @param {number} dist Current distance to the target.
    * @returns {number} Final movement speed.
    */
    getFinalDistanceSpeed(baseSpeed, wantGoToTarget, dist) {
        if (wantGoToTarget) return baseSpeed;
        if (dist >= 20) return baseSpeed;
        let finalSpeed = baseSpeed * 1.3;
        return Math.min(finalSpeed, 1.8);
    }

    /**
    * Applies one movement step for distance control.
    * @param {number} dir Movement direction.
    * @param {number} speed Movement speed.
    * @returns {void}
    */
    applyDistanceStep(dir, speed) {
        const dt = this.enemy.deltaTime ?? 1 / 60;
        const step = speed * dt * 60;
        this.enemy.x += dir * step;
        this.enemy.isMovingRight = false;
        this.enemy.isMovingLeft = false;
    }

    /**
    * Stops enemy movement.
    * @returns {void}
    */
    stopMovement() {
        this.enemy.isMovingLeft = false;
        this.enemy.isMovingRight = false;
    }
}