export class EndbossMovementController {
    constructor() {

    }

    /**
 * Applies gravity by updating the vertical position over time.
 * @param {number} timestamp - Current time in milliseconds.
 */
    applyGravityBoss(timestamp) {
        if (!this.lastGravityUpdate) this.lastGravityUpdate = timestamp;
        const deltaTime = timestamp - this.lastGravityUpdate;
        if (deltaTime <= this.gravityInterval) return;
        this.updateVerticalPosition();
        this.lastGravityUpdate = timestamp;
    }

    /**
     * Updates the vertical position based on gravity and collisions.
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
     * Determines whether gravity should currently be applied.
     * @returns {boolean} True if gravity should be applied.
     */
    shouldApplyGravity() {
        if (this.isFly) return false;
        return this.isJumping || this.y < -35 || this.speedY > 0;
    }


    /**
     * Applies basic jump physics.
     */
    applyJumpPhysics() {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
    }

    /**
     * Checks for ground collision and resets vertical movement if necessary.
     */
    checkGroundCollision() {
        if (this.y >= -35) {
            this.y = -35;
            this.speedY = 0;
            this.isJumping = false;
        }
    }

    /**
     * Resets vertical movement and jump state.
     */
    resetVerticalMovement() {
        this.speedY = 0;
        this.isJumping = false;
    }

    /**
     * Moves the object downward after death until it goes below the ground level.
     * @param {number} timestamp - Current time in milliseconds.
     */
    moveDownAfterDead(timestamp) {
        if (!this.lastMoveDownTime) this.lastMoveDownTime = timestamp;
        const deltaTime = timestamp - this.lastMoveDownTime;
        if (deltaTime <= 1000 / 60) return;
        if (this.isDead && !this.isUnderTheGround) {
            this.y += this.fallSpeed || 5;
            if (this.y > 600) {
                this.isUnderTheGround = true;
            }
        }
        this.lastMoveDownTime = timestamp;
    }

    /**
 * Handles horizontal movement based on direction flags.
 */
    handleMovement() {
        if (this.isMovingLeft) return this.moveLeft();
        if (this.isMovingRight) return this.moveRight();
    }

    /**
     * Moves the object to the left.
     */
    moveLeft() {
        this.isFlipped = false;
        if (this.x > 0) {
            this.x -= this.movementSpeed;
        }
    }

    /**
     * Moves the object to the right.
     */
    moveRight() {
        this.isFlipped = true;
        this.x += this.movementSpeed;
    }

    flyPatrol(timestamp) {
        if (!this.lastAirTime) this.lastAirTime = timestamp;
        const dt = (timestamp - this.lastAirTime) / 1000;
        this.lastAirTime = timestamp;

        const bob = this.airBobAmp
            ? Math.sin(timestamp * this.airBobSpeed) * this.airBobAmp
            : 0;

        this.y = this.airY + bob;

        this.x += this.airDir * this.airSpeed * dt;

        if (this.x >= this.airMaxX) {
            this.x = this.airMaxX;
            this.airDir = -1;
        } else if (this.x <= this.airMinX) {
            this.x = this.airMinX;
            this.airDir = 1;
        }

        this.isFlipped = this.airDir === 1;
    }

    moveToX(targetX, speedPxPerSec) {
        const dx = targetX - this.x;
        const step = speedPxPerSec * this.deltaSeconds;
        if (Math.abs(dx) <= step) {
            this.x = targetX;
            return true;
        }
        this.x += Math.sign(dx) * step;
        return false;
    }

    updateAirEggPhase(timestamp, setup) {
        const attack = setup.endbossAttack;
        if (this.finisherStarted && (this.airState === this.AIR_STATE.MOVE || this.airState === this.AIR_STATE.DROP || this.airState === this.AIR_STATE.WAIT)) {
            return;
        }

        if (this.airState !== this.AIR_STATE.DESCEND && this.airState !== this.AIR_STATE.ASCEND) {
            this.y = this.airY;
        }


        // if (this.airState === this.AIR_STATE.DESCEND) {
        //     this.isFly = false;
        // } else {
        //     this.isFly = true;
        // }

        this.isVulnerable = false;

        switch (this.airState) {

            // 1️⃣ Fliegen zur nächsten Position
            case this.AIR_STATE.MOVE: {
                const targetX = this.airPoints[this.airPointIndex];

                if (this.x < targetX) this.airDir = 1;
                else if (this.x > targetX) this.airDir = -1;

                this.x += this.airDir * this.airSpeed * this.deltaSeconds;
                this.isFlipped = this.airDir === 1;

                if (
                    (this.airDir === 1 && this.x >= targetX) ||
                    (this.airDir === -1 && this.x <= targetX)
                ) {
                    this.x = targetX;
                    this.airState = this.AIR_STATE.DROP;
                    this.airDropIndex = 0;
                    this.airLastActionTime = timestamp;
                    this.airDropStartTime = timestamp;
                }
                break;
            }

            // 2️⃣ Eier droppen
            case this.AIR_STATE.DROP: {
                const seq = this.airDropSequence;
                const step = seq[this.airDropIndex];
                if (!step) {
                    this.airState = this.AIR_STATE.WAIT;
                    this.airLastActionTime = timestamp;
                    return;
                }

                const elapsed = timestamp - this.airDropStartTime;

                if (elapsed >= step.delay) {
                    attack.spawnEgg(this, setup, step.type, 0);
                    this.airDropIndex++;
                }
                break;
            }


            case this.AIR_STATE.WAIT: {
                if (timestamp - this.airLastActionTime > 800) {

                    // 🔚 letzter Air-Point erreicht?
                    if (this.airPointIndex >= this.airPoints.length - 1) {
                        this.airState = this.AIR_STATE.DESCEND;
                    } else {
                        this.airPointIndex++;
                        this.airState = this.AIR_STATE.MOVE;
                    }
                }
                break;
            }

            case this.AIR_STATE.DESCEND: {
                const groundY = 205;
                const descendSpeed = 300; // px pro Sekunde

                const dy = groundY - this.y;                 // Ziel-Differenz
                const step = descendSpeed * this.deltaSeconds;

                // Richtung: +1 wenn groundY > y, sonst -1
                const dir = Math.sign(dy);

                // Wenn wir schon da sind (oder extrem nah)
                if (dir === 0) {
                    this.y = groundY;
                } else {
                    // Move towards ohne zu überschießen
                    const move = Math.min(Math.abs(dy), step);
                    this.y += dir * move;
                }

                // Flip behalten wie zuletzt
                this.isFlipped = this.airDir === -1;

                // Landen (mit Toleranz gegen Floating-Point)
                if (Math.abs(groundY - this.y) <= 0.0001) {
                    this.y = groundY;
                    this.isFly = false;
                    this.speedY = 0;
                    this.isJumping = false;
                    this.setPhase(this.ENDBOSS_PHASE.GROUND);
                }

                break;
            }

            case this.AIR_STATE.ASCEND: {
                this.isFly = true;       // ✅ sofort fliegen
                this.isJumping = false;  // ✅ kein Jump-State
                this.speedY = 0;         // ✅ keine Rest-SpeedY

                const targetY = this.airY;
                const ascendSpeed = 300;
                const dy = targetY - this.y;
                const step = ascendSpeed * this.deltaSeconds;
                const dir = Math.sign(dy);

                if (dir !== 0) {
                    const move = Math.min(Math.abs(dy), step);
                    this.y += dir * move;
                } else {
                    this.y = targetY;
                }

                // Flip behalten wie zuletzt
                this.isFlipped = this.airDir === 1;

                if (Math.abs(targetY - this.y) <= 0.0001) {
                    this.y = targetY;
                    if (this.finisherStarted) return
                    this.airState = this.AIR_STATE.MOVE; // ✅ weiter
                }
                break;
            }






        }

        // Phase endet nach z.B. 4 Stops
        // if (this.airPointIndex >= 4) {
        //     this.setPhase(this.ENDBOSS_PHASE.STORM);
        // }
    }




}