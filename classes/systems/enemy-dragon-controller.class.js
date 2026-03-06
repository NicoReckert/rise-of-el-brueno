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
}