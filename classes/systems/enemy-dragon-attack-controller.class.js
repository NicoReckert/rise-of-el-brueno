/**
 * Controls dragon attack behavior for an enemy.
 */
export class EnemyDragonAttackController {
    /**
    * Creates a new instance.
    * @param {object} enemy Enemy instance.
    */
    constructor(enemy) {
        this.enemy = enemy;
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