/**
 * Controls dragon movement behavior for an enemy.
 */
export class EnemyDragonMovementController {
    /**
    * Creates a new instance.
    * @param {object} enemy Enemy instance.
    */
    constructor(enemy) {
        this.enemy = enemy;
    }

    /**
    * Handles dragon approach movement toward the character.
    * @param {object} char Character object.
    * @returns {void}
    */
    dragonApproach(char) {
        const { pBox, eBox } = this.getDragonBoxes(char);
        const targetX = pBox.cx - (eBox.right - eBox.left) * 0.5;
        this.enemy.movementCtrl.moveToX(targetX, {
            speed: this.enemy.flySpeed,
            snap: false,
            faceTarget: !this.enemy.lockDirection,
            target: char
        });
        this.updateApproachBaseY();
        this.applyApproachBob();
    }

    /**
    * Returns the hitbox data for the dragon and character.
    * @param {object} char Character object.
    * @returns {{pBox: object, eBox: object}} Character and enemy hitbox data.
    */
    getDragonBoxes(char) {
        const pBox = char.getHitboxRect();
        const eBox = this.enemy.getHitboxRect();
        return { pBox, eBox };
    }

    /**
    * Initializes the base Y position for dragon approach movement.
    * @returns {void}
    */
    updateApproachBaseY() {
        if (this.enemy.approachBaseY != null) return;
        this.enemy.approachBaseY = this.enemy.y;
    }

    /**
    * Applies vertical bobbing during dragon approach movement.
    * @returns {void}
    */
    applyApproachBob() {
        const amplitude = 12;
        this.enemy.y =
            this.enemy.approachBaseY +
            Math.sin(performance.now() / 300) * amplitude;
    }

    /**
    * Handles dragon idle follow behavior.
    * @param {object} char Character object.
    * @returns {void}
    */
    dragonIdleFollow(char) {
        const { pBox, eBox } = this.getDragonBoxes(char);
        this.followDragonIdleX(char, pBox, eBox);
        this.relaxDragonIdleY();
    }

    /**
    * Updates dragon idle movement on the x axis.
    * @param {object} char Character object.
    * @param {object} pBox Character hitbox.
    * @param {object} eBox Enemy hitbox.
    * @returns {void}
    */
    followDragonIdleX(char, pBox, eBox) {
        const desiredDistX = 80;
        const dx = pBox.cx - eBox.cx;
        if (Math.abs(dx) <= desiredDistX) return;
        const targetX = pBox.cx - (eBox.right - eBox.left) * 0.5;
        this.enemy.movementCtrl.moveToX(targetX, {
            speed: this.enemy.flySpeed * 0.5,
            snap: false,
            faceTarget: !this.enemy.lockDirection,
            target: char
        });
    }

    /**
    * Relaxes the dragon idle Y position toward the base height.
    * @returns {void}
    */
    relaxDragonIdleY() {
        const dt = this.enemy.deltaTime ?? 1 / 60;
        const lerpSpeed = 2;
        const maxStep = Math.min(lerpSpeed * dt, 1);
        const baseY = this.enemy.spawnY;
        this.enemy.y += (baseY - this.enemy.y) * maxStep;
        this.enemy.y += Math.sin(performance.now() / 400) * 0.5;
    }

    /**
    * Moves the dragon toward its current dive target.
    * @returns {void}
    */
    dragonDive() {
        const eBox = this.enemy.getHitboxRect();
        const dx = this.enemy.diveTargetX - eBox.cx;
        const dy = this.enemy.diveTargetY - eBox.cy;
        const len = Math.hypot(dx, dy) || 1;
        const step = this.enemy.diveSpeed * (this.enemy.deltaTime ?? 1 / 60);
        this.enemy.x += (dx / len) * step;
        this.enemy.y += (dy / len) * step;
    }

    /**
    * Handles dragon retreat movement.
    * @returns {void}
    */
    dragonRetreat() {
        const step = this.enemy.flySpeed * (this.enemy.deltaTime ?? 1 / 60);
        this.enemy.y -= step;
        if (this.enemy.y <= this.enemy.spawnY - this.enemy.retreatHeight) {
            this.enemy.y = this.enemy.spawnY - this.enemy.retreatHeight;
            this.enemy.airState = 'approach';
            this.enemy.isMovingLeft = false;
            this.enemy.isMovingRight = false;
        }
    }

    /**
    * Finishes the dragon fast dive phase.
    * @param {number} dx Horizontal delta to the dive target.
    * @param {number} dy Vertical delta to the dive target.
    * @param {number} step Movement step size.
    * @param {number} dist Remaining distance to the dive target.
    * @returns {void}
    */
    finishDragonDiveFast(dx, dy, step, dist) {
        this.enemy.x += dx;
        this.enemy.y += dy;
        const remaining = step - dist;
        if (remaining > 0) this.enemy.x += this.enemy.entryDir * remaining;
        this.enemy.exitDir = this.enemy.entryDir;
        this.enemy.isFlipped = this.enemy.exitDir > 0;
        this.enemy.airState = 'approach_low';
    }

    /**
    * Advances the dragon during the fast dive phase.
    * @param {number} dx Horizontal delta to the dive target.
    * @param {number} dy Vertical delta to the dive target.
    * @param {number} dist Distance to the dive target.
    * @param {number} step Movement step size.
    * @returns {void}
    */
    stepDragonDiveFast(dx, dy, dist, step) {
        this.enemy.x += (dx / dist) * step;
        this.enemy.y += (dy / dist) * step;
    }

    /**
    * Handles the dragon upward dive phase for the given angle.
    * @param {number} angle Dive-up angle.
    * @returns {void}
    */
    handleDragonDiveUpAngle(angle) {
        this.dragonDiveUp(angle);
        this.checkDiveUpEnd();
    }

    /**
    * Moves the dragon upward during the dive-up phase.
    * @param {number} angleDeg Dive-up angle in degrees.
    * @returns {void}
    */
    dragonDiveUp(angleDeg) {
        const rad = angleDeg * Math.PI / 180;
        const dx = Math.cos(rad) * this.enemy.exitDir;
        const dy = -Math.sin(rad);
        const climbSpeed = this.enemy.flySpeed * 3.5;
        const step = climbSpeed * (this.enemy.deltaTime ?? 1 / 60);
        this.enemy.x += dx * step;
        this.enemy.y += dy * step;
    }

    /**
    * Checks whether the dragon dive-up phase has ended.
    * @returns {void}
    */
    checkDiveUpEnd() {
        if (this.enemy.y <= this.enemy.spawnY - this.enemy.retreatHeight) {
            this.enemy.lockDirection = false;
            this.enemy.airState = 'air_exit';
        }
    }
}