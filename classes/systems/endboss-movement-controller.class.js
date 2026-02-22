/**
 * Controls movement behavior of an endboss.
 */
export class EndbossMovementController {
    /**
    * Creates a new instance.
    * @param {*} endboss Reference to the endboss object.
    */
    constructor(endboss) {
        this.endboss = endboss;
    }

    /**
    * Updates the current state.
    * @param {number} timestamp Frame timestamp.
    * @param {*} setup Configuration or state setup object.
    * @returns {void}
    */
    updateState(timestamp, setup) {
        this.maybeStartFinisher();
        if (this.endboss.finisherStarted) {
            this.updateFinisherState(timestamp, setup);
            return;
        }
        this.updatePhaseMovement(timestamp, setup);
        this.handleGroundOrEnrageMovement();
        this.endboss.animCtrl.handleStateAnimations();
    }

    /**
    * Starts the finisher phase if conditions are met.
    * @returns {void}
    */
    maybeStartFinisher() {
        if (this.endboss.finisherStarted) return;
        if (this.endboss.energy > this.endboss.lowEnergyThreshold) return;
        this.endboss.finisherStarted = true;
        this.endboss.isHurt = false;
        this.endboss.isFireballAttack = false;
        this.endboss.isJumping = false;
        this.endboss.speedY = 0;
        this.endboss.isFly = true;
        this.endboss.airState = this.endboss.AIR_STATE.ASCEND;
        this.endboss.combatCtrl.setPhase(this.endboss.ENDBOSS_PHASE.AIR_EGGS);
    }

    /**
    * Updates the finisher state.
    * @param {number} timestamp Frame timestamp.
    * @param {*} setup Configuration or state setup object.
    * @returns {void}
    */
    updateFinisherState(timestamp, setup) {
        this.endboss.updateFinisher(timestamp, setup);
        this.endboss.animCtrl.handleStateAnimations();
    }

    /**
    * Updates movement logic based on the current phase.
    * @param {number} timestamp Frame timestamp.
    * @param {*} setup Configuration or state setup object.
    * @returns {void}
    */
    updatePhaseMovement(timestamp, setup) {
        const phase = this.endboss.phase;
        const phases = this.endboss.ENDBOSS_PHASE;
        if (phase === phases.AIR_EGGS) {
            this.endboss.airPhaseCtrl.updateAirEggPhase(timestamp, setup);
        } else if (phase === phases.STORM) {
            // this.endboss.movementCtrl.updateStormPhase(timestamp, setup);
        } else if (phase === phases.GROUND) {
            this.endboss.groundAttackCtrl.updateGroundPhase(timestamp, setup);
        } else if (phase === phases.ENRAGE) {
            // this.endboss.movementCtrl.updateEnragePhase(timestamp, setup);
        }
    }

    /**
    * Handles movement when in ground or enrage phase.
    * @returns {void}
    */
    handleGroundOrEnrageMovement() {
        const phase = this.endboss.phase;
        const phases = this.endboss.ENDBOSS_PHASE;
        const isGround = phase === phases.GROUND;
        const isEnrage = phase === phases.ENRAGE;
        if (!isGround && !isEnrage) return;
        this.endboss.movementCtrl.handleMovement();
    }

    /**
    * Applies gravity updates based on a time interval.
    * @param {number} timestamp Frame timestamp.
    * @returns {void}
    */
    applyGravityBoss(timestamp) {
        if (!this.endboss.lastGravityUpdate) this.endboss.lastGravityUpdate = timestamp;
        const deltaTime = timestamp - this.endboss.lastGravityUpdate;
        if (deltaTime <= this.endboss.gravityInterval) return;
        this.updateVerticalPosition();
        this.endboss.lastGravityUpdate = timestamp;
    }

    /**
    * Updates the vertical position based on gravity state.
    * @returns {void}
    */
    updateVerticalPosition() {
        if (this.shouldApplyGravity()) {
            this.applyJumpPhysics();
            this.checkGroundCollision();
        } else {
            this.resetVerticalMovement();
        }
    }

    /**
    * Determines whether gravity should be applied.
    * @returns {boolean} True if gravity should be applied, otherwise false.
    */
    shouldApplyGravity() {
        if (this.endboss.isFly) return false;
        return (
            this.endboss.isJumping ||
            this.endboss.y < -35 ||
            this.endboss.speedY > 0
        );
    }

    /**
    * Applies vertical movement based on jump physics.
    * @returns {void}
    */
    applyJumpPhysics() {
        this.endboss.y -= this.endboss.speedY;
        this.endboss.speedY -= this.endboss.acceleration;
    }

    /**
    * Checks and resolves collision with the ground.
    * @returns {void}
    */
    checkGroundCollision() {
        if (this.endboss.y >= -35) {
            this.endboss.y = -35;
            this.endboss.speedY = 0;
            this.endboss.isJumping = false;
        }
    }

    /**
    * Resets vertical movement state.
    * @returns {void}
    */
    resetVerticalMovement() {
        this.endboss.speedY = 0;
        this.endboss.isJumping = false;
    }

    /**
    * Moves the entity downward after death.
    * @param {number} timestamp Frame timestamp.
    * @returns {void}
    */
    moveDownAfterDead(timestamp) {
        if (!this.endboss.lastMoveDownTime) this.endboss.lastMoveDownTime = timestamp;
        const deltaTime = timestamp - this.endboss.lastMoveDownTime;
        if (deltaTime <= 1000 / 60) return;
        if (this.endboss.isDead && !this.endboss.isUnderTheGround) {
            this.endboss.y += this.endboss.fallSpeed || 5;
            if (this.endboss.y > 600) {
                this.endboss.isUnderTheGround = true;
            }
        }
        this.endboss.lastMoveDownTime = timestamp;
    }

    /**
    * Handles horizontal movement based on direction flags.
    * @returns {void}
    */
    handleMovement() {
        if (this.endboss.isMovingLeft) return this.moveLeft();
        if (this.endboss.isMovingRight) return this.moveRight();
    }

    /**
    * Moves the entity to the left.
    * @returns {void}
    */
    moveLeft() {
        this.endboss.isFlipped = false;
        if (this.endboss.x > 0) {
            this.endboss.x -= this.endboss.movementSpeed;
        }
    }

    /**
    * Moves the entity to the right.
    * @returns {void}
    */
    moveRight() {
        this.endboss.isFlipped = true;
        this.endboss.x += this.endboss.movementSpeed;
    }

    /**
    * Updates aerial patrol movement.
    * @param {number} timestamp Frame timestamp.
    * @returns {void}
    */
    flyPatrol(timestamp) {
        const dt = this.computeAirDeltaTime(timestamp);
        this.updateAirBobPosition(timestamp);
        this.updateAirX(dt);
        this.clampAirX();
        this.endboss.isFlipped = this.endboss.airDir === 1;
    }

    /**
    * Computes the delta time for aerial movement.
    * @param {number} timestamp Frame timestamp.
    * @returns {number} Delta time in seconds.
    */
    computeAirDeltaTime(timestamp) {
        if (!this.endboss.lastAirTime) {
            this.endboss.lastAirTime = timestamp;
        }
        const dt = (timestamp - this.endboss.lastAirTime) / 1000;
        this.endboss.lastAirTime = timestamp;
        return dt;
    }

    /**
    * Updates vertical bobbing position while in air.
    * @param {number} timestamp Frame timestamp.
    * @returns {void}
    */
    updateAirBobPosition(timestamp) {
        const amp = this.endboss.airBobAmp;
        let bob = 0;
        if (amp) {
            bob = Math.sin(timestamp * this.endboss.airBobSpeed) * amp;
        }
        this.endboss.y = this.endboss.airY + bob;
    }

    /**
    * Updates horizontal position during aerial movement.
    * @param {number} dt Delta time in seconds.
    * @returns {void}
    */
    updateAirX(dt) {
        this.endboss.x += this.endboss.airDir * this.endboss.airSpeed * dt;
    }

    /**
    * Clamps horizontal air position within defined bounds.
    * @returns {void}
    */
    clampAirX() {
        const boss = this.endboss;
        if (boss.x >= boss.airMaxX) {
            boss.x = boss.airMaxX;
            boss.airDir = -1;
        } else if (boss.x <= boss.airMinX) {
            boss.x = boss.airMinX;
            boss.airDir = 1;
        }
    }

    /**
    * Moves the entity toward a target x-position.
    * @param {number} targetX Target x-coordinate.
    * @param {number} speedPxPerSec Movement speed in pixels per second.
    * @returns {boolean} True if the target position is reached, otherwise false.
    */
    moveToX(targetX, speedPxPerSec) {
        const dx = targetX - this.endboss.x;
        const step = speedPxPerSec * (this.endboss.deltaSeconds ?? 0);
        if (Math.abs(dx) <= step) {
            this.endboss.x = targetX;
            return true;
        }
        this.endboss.x += Math.sign(dx) * step;
        return false;
    }
}