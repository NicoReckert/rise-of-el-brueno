/**
 * Controls dragon-specific behavior for an enemy.
 */
export class EnemyDragonController {
    /**
    * Creates a new instance.
    * @param {object} enemy Enemy instance.
    */
    constructor(enemy) {
        this.enemy = enemy;
    }

    /**
    * Updates the dragon AI state.
    * @param {number} timestamp Frame timestamp.
    * @param {object} char Character object.
    * @returns {void}
    */
    updateDragonAI(timestamp, char) {
        this.enemy.isMovingLeft = false;
        this.enemy.isMovingRight = false;
        if (this.enemy.isDead || this.enemy.isHurt) return;
        const distInfo = this.getDragonDistanceInfo(char);
        this.resetDragonApproachBase();
        this.resetDragonIfTooFar(distInfo.distX);
        this.updateDragonStateMachine(timestamp, char, distInfo);
    }

    /**
    * Returns horizontal distance data for dragon AI.
    * @param {object} char Character object.
    * @returns {{ex: number, tx: number, dx: number, distX: number}} Enemy and target positions with horizontal distance.
    */
    getDragonDistanceInfo(char) {
        const ex = this.enemy.x + this.enemy.width * 0.5;
        const tx = char.x + char.width * 0.5;
        const dx = tx - ex;
        const distX = Math.abs(dx);
        return { ex, tx, dx, distX };
    }

    /**
    * Resets the dragon approach base position when not in approach state.
    * @returns {void}
    */
    resetDragonApproachBase() {
        if (this.enemy.airState !== 'approach') this.enemy.approachBaseY = null;
    }

    /**
    * Resets the dragon state when the target is too far away.
    * @param {number} distX Horizontal distance to the target.
    * @returns {void}
    */
    resetDragonIfTooFar(distX) {
        const tooFar = this.enemy.approachDistance * 1.6;
        const s = this.enemy.airState;
        const leaving = s === 'approach' || s === 'air_exit';
        if (!(distX > tooFar && leaving)) return;
        this.enemy.airState = 'idle';
        this.enemy.lockDirection = false;
        this.enemy.exitTimer = null;
    }

    /**
    * Updates the dragon state machine.
    * @param {number} timestamp Frame timestamp.
    * @param {object} char Character object.
    * @param {object} distInfo Dragon distance data.
    * @returns {void}
    */
    updateDragonStateMachine(timestamp, char, distInfo) {
        const s = this.enemy.airState;
        if (s === 'idle') this.handleDragonIdle(char, distInfo.distX);
        else if (s === 'approach') this.handleDragonApproach(timestamp, char, distInfo);
        else if (s === 'dive_start') this.handleDragonDiveStart(timestamp, char);
        else if (s === 'dive_fast') this.handleDragonDiveFast();
        else if (s === 'retreat') this.dragonRetreat();
        else this.updateDragonStateDiveAndExit(s, timestamp, char);
    }

    /**
    * Updates dragon dive and exit related states.
    * @param {string} state Current air state.
    * @param {number} timestamp Frame timestamp.
    * @param {object} char Character object.
    * @returns {void}
    */
    updateDragonStateDiveAndExit(state, timestamp, char) {
        if (state === 'dive_up_shallow') this.handleDragonDiveUpAngle(30);
        else if (state === 'dive_up_medium') this.handleDragonDiveUpAngle(50);
        else if (state === 'dive_up_steep') this.handleDragonDiveUpAngle(70);
        else if (state === 'air_exit') this.handleDragonAirExit(timestamp);
        else if (state === 'approach_low') this.handleDragonApproachLow(timestamp, char);
    }

    /**
    * Handles dragon idle behavior.
    * @param {object} char Character object.
    * @param {number} distX Horizontal distance to the target.
    * @returns {void}
    */
    handleDragonIdle(char, distX) {
        this.dragonIdleFollow(char, distX);
        if (distX > this.enemy.approachDistance) return;
        this.enemy.airState = 'approach';
        this.enemy.approachBaseY = null;
    }

    /**
    * Handles dragon approach behavior.
    * @param {number} timestamp Frame timestamp.
    * @param {object} char Character object.
    * @param {object} distInfo Dragon distance data.
    * @returns {void}
    */
    handleDragonApproach(timestamp, char, distInfo) {
        this.dragonApproach(char);
        if (distInfo.distX > this.enemy.attackDistance) return;
        if (!this.canDragonAttack(timestamp)) return;
        this.startDragonDiveSetup(timestamp, char);
    }

    /**
    * Starts the dragon dive setup.
    * @param {number} timestamp Frame timestamp.
    * @param {object} char Character object.
    * @returns {void}
    */
    startDragonDiveSetup(timestamp, char) {
        const eBox = this.enemy.getHitboxRect();
        const pBox = char.getHitboxRect();
        this.setDragonDiveGeometry(pBox, eBox);
        this.setDragonDiveState(timestamp);
    }

    /**
    * Sets dragon dive geometry based on the target and enemy hitboxes.
    * @param {object} pBox Target hitbox.
    * @param {object} eBox Enemy hitbox.
    * @returns {void}
    */
    setDragonDiveGeometry(pBox, eBox) {
        this.enemy.entryDir = pBox.cx > eBox.cx ? 1 : -1;
        const over = -140, pre = 140, post = 140;
        this.enemy.planeY = pBox.cy + over;
        this.enemy.preDiveX = pBox.cx - this.enemy.entryDir * pre;
        this.enemy.postDiveX = pBox.cx + this.enemy.entryDir * post;
        this.enemy.diveTargetX = this.enemy.preDiveX;
        this.enemy.diveTargetY = this.enemy.planeY;
    }

    /**
    * Sets the dragon dive state.
    * @param {number} timestamp Frame timestamp.
    * @returns {void}
    */
    setDragonDiveState(timestamp) {
        this.enemy.lowApproachSpeed = this.enemy.flySpeed * 2.5;
        this.enemy.lockDirection = true;
        this.enemy.hasAttackedThisDive = false;
        this.enemy.hasBeenHitThisDive = false;
        this.enemy.airState = 'dive_start';
        this.enemy.diveStartTime = timestamp;
    }

    /**
    * Handles the dragon dive start phase.
    * @param {number} timestamp Frame timestamp.
    * @param {object} char Character object.
    * @returns {void}
    */
    handleDragonDiveStart(timestamp, char) {
        this.dragonDive(char, timestamp);
        const elapsed = timestamp - this.enemy.diveStartTime;
        if (elapsed < this.enemy.diveStartDuration) return;
        this.enemy.airState = 'dive_fast';
    }

    /**
    * Handles the dragon fast dive phase.
    * @returns {void}
    */
    handleDragonDiveFast() {
        const dt = this.enemy.deltaTime ?? 1 / 60;
        const eBox = this.enemy.getHitboxRect();
        const dx = this.enemy.diveTargetX - eBox.cx;
        const dy = this.enemy.diveTargetY - eBox.cy;
        const dist = Math.hypot(dx, dy) || 1;
        const step = this.enemy.diveSpeed * dt;
        if (dist <= step) this.finishDragonDiveFast(dx, dy, step, dist);
        else this.stepDragonDiveFast(dx, dy, dist, step);
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
    * Handles the dragon air exit state.
    * @param {number} timestamp Frame timestamp.
    * @returns {void}
    */
    handleDragonAirExit(timestamp) {
        this.enemy.exitTimer ??= timestamp;
        const elapsed = timestamp - this.enemy.exitTimer;
        if (elapsed <= 150) return;
        this.enemy.exitTimer = null;
        this.enemy.airState = 'approach';
        this.enemy.hasAttackedThisDive = false;
    }

    /**
    * Handles the dragon low approach phase.
    * @param {number} timestamp Frame timestamp.
    * @param {object} char Character object.
    * @returns {void}
    */
    handleDragonApproachLow(timestamp, char) {
        const dt = this.enemy.deltaTime ?? 1 / 60;
        if (this.enemy.planeY != null) this.enemy.y = this.enemy.planeY;
        this.enemy.x += this.enemy.entryDir * this.enemy.lowApproachSpeed * dt;
        const info = this.getDragonApproachLowInfo(char);
        if (this.shouldDragonBite(timestamp, info)) this.startDragonBite(timestamp, char);
        this.handleDragonPostDiveTransition(char, info);
    }

    /**
    * Returns distance and hitbox data for the dragon low approach phase.
    * @param {object} char Character object.
    * @returns {object} Dragon low approach data.
    */
    getDragonApproachLowInfo(char) {
        const eBox = this.enemy.getHitboxRect();
        const pBox = char.getHitboxRect();
        const rel = eBox.cx - pBox.cx;
        return { eBox, pBox, rel };
    }

    /**
    * Checks whether the dragon should perform a bite attack.
    * @param {number} timestamp Frame timestamp.
    * @param {object} info Dragon low approach data.
    * @returns {boolean} True if the dragon should bite, otherwise false.
    */
    shouldDragonBite(timestamp, info) {
        const start = 110, end = 10;
        const rel = info.rel;
        const dir = this.enemy.entryDir;
        const inZone = dir === 1
            ? rel <= -end && rel >= -start
            : rel >= end && rel <= start;
        if (!inZone) return false;
        if (this.enemy.isAttack || this.enemy.hasAttackedThisDive) return false;
        if (!this.canDragonAttack(timestamp)) return false;
        return true;
    }

    /**
    * Starts the dragon bite attack.
    * @param {number} timestamp Frame timestamp.
    * @param {object} char Character object.
    * @returns {void}
    */
    startDragonBite(timestamp, char) {
        this.enemy.isAttack = true;
        this.enemy.hasHitPlayerThisAttack = false;
        this.enemy.hasAttackedThisDive = true;
        this.enemy.frameIndex = 0;
        this.enemy.lastFrameTime = 0;
        this.enemy.lastAttackTime = timestamp;
        this.enemy.pendingDiveUpAngle = this.chooseDiveUpAngle(char);
    }

    /**
    * Handles the dragon transition after the dive phase.
    * @param {object} char Character object.
    * @param {object} info Dragon low approach data.
    * @returns {void}
    */
    handleDragonPostDiveTransition(char, info) {
        const eBox = info.eBox;
        const dir = this.enemy.entryDir;
        const passedPost = dir === 1
            ? eBox.cx >= this.enemy.postDiveX
            : eBox.cx <= this.enemy.postDiveX;
        if (!passedPost || this.enemy.isAttack) return;
        const angle = this.enemy.pendingDiveUpAngle || this.chooseDiveUpAngle(char);
        this.enemy.pendingDiveUpAngle = null;
        this.enemy.airState = `dive_up_${angle}`;
    }

    /**
    * Handles dragon approach movement toward the character.
    * @param {object} char Character object.
    * @returns {void}
    */
    dragonApproach(char) {
        const { pBox, eBox } = this.getDragonBoxes(char);
        const targetX = pBox.cx - (eBox.right - eBox.left) * 0.5;
        this.enemy.moveToX(targetX, {
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
        this.enemy.moveToX(targetX, {
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
    * Checks whether the dragon can perform an attack.
    * @param {number} timestamp Frame timestamp.
    * @returns {boolean} True if the dragon can attack, otherwise false.
    */
    canDragonAttack(timestamp) {
        return (timestamp - this.enemy.lastAttackTime) > this.enemy.attackCooldownMs;
    }

    /**
    * Checks whether the dragon has reached the current dive target.
    * @returns {boolean} True if the dive target was reached, otherwise false.
    */
    reachedDiveTarget() {
        const eBox = this.enemy.getHitboxRect();
        const dx = this.enemy.diveTargetX - eBox.cx;
        const dy = this.enemy.diveTargetY - eBox.cy;
        const dist = Math.hypot(dx, dy);
        const HIT_RADIUS = 20;
        return dist <= HIT_RADIUS;
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

    /**
    * Chooses the dragon dive-up angle based on the character position.
    * @param {object} char Character object.
    * @returns {string} Dive-up angle.
    */
    chooseDiveUpAngle(char) {
        const eBox = this.enemy.getHitboxRect();
        const pBox = char.getHitboxRect();
        const dx = Math.abs(pBox.cx - eBox.cx);
        const dy = pBox.cy - eBox.cy;
        if (dy > 40 && dx < 60) return 'steep';
        if (dx < 160) return 'medium';
        return 'shallow';
    }
}