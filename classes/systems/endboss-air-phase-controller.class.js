/**
 * Controls air phase behavior of an endboss.
 */
export class EndbossAirPhaseController {
    /**
    * Creates a new instance.
    * @param {*} endboss Reference to the endboss object.
    */
    constructor(endboss) {
        this.endboss = endboss;
    }

    /**
    * Updates behavior during the air eggs phase.
    * @param {number} timestamp Frame timestamp.
    * @param {*} setup Configuration or state setup object.
    * @returns {void}
    */
    updateAirEggPhase(timestamp, setup) {
        const attack = setup.endbossAttack;
        if (this.shouldSkipAirEggPhase()) return;
        this.ensureAirYPosition();
        this.endboss.isVulnerable = false;
        const state = this.endboss.airState;
        const air = this.endboss.AIR_STATE;
        if (state === air.MOVE) this.handleAirMove(timestamp);
        else if (state === air.DROP) this.handleAirDrop(timestamp, setup, attack);
        else if (state === air.WAIT) this.handleAirWait(timestamp);
        else if (state === air.DESCEND) this.handleAirDescend();
        else if (state === air.ASCEND) this.handleAirAscend();
    }

    /**
    * Determines whether the air eggs phase should be skipped.
    * @returns {boolean} True if the phase should be skipped, otherwise false.
    */
    shouldSkipAirEggPhase() {
        if (!this.endboss.finisherStarted) return false;
        const state = this.endboss.airState;
        const air = this.endboss.AIR_STATE;
        if (state === air.MOVE) return true;
        if (state === air.DROP) return true;
        if (state === air.WAIT) return true;
        return false;
    }

    /**
    * Ensures the correct vertical position during the air phase.
    * @returns {void}
    */
    ensureAirYPosition() {
        const state = this.endboss.airState;
        const air = this.endboss.AIR_STATE;
        if (state === air.DESCEND) return;
        if (state === air.ASCEND) return;
        this.endboss.y = this.endboss.airY;
    }

    /**
    * Handles horizontal movement toward the current air target.
    * @param {number} timestamp Frame timestamp.
    * @returns {void}
    */
    handleAirMove(timestamp) {
        const boss = this.endboss;
        const points = boss.airPoints;
        const idx = boss.airPointIndex;
        const targetX = points[idx];
        if (boss.x < targetX) boss.airDir = 1;
        else if (boss.x > targetX) boss.airDir = -1;
        const dt = boss.deltaSeconds ?? 0;
        boss.x += boss.airDir * boss.airSpeed * dt;
        boss.isFlipped = boss.airDir === 1;
        if (!this.hasReachedAirTarget(targetX)) return;
        this.onReachedAirTarget(timestamp, targetX);
    }

    /**
    * Determines whether the current air target has been reached.
    * @param {number} targetX Target x-coordinate.
    * @returns {boolean} True if the target is reached, otherwise false.
    */
    hasReachedAirTarget(targetX) {
        const boss = this.endboss;
        const dir = boss.airDir;
        if (dir === 1 && boss.x >= targetX) return true;
        if (dir === -1 && boss.x <= targetX) return true;
        return false;
    }

    /**
    * Handles logic after reaching the current air target.
    * @param {number} timestamp Frame timestamp.
    * @param {number} targetX Target x-coordinate.
    * @returns {void}
    */
    onReachedAirTarget(timestamp, targetX) {
        const boss = this.endboss;
        boss.x = targetX;
        boss.airState = boss.AIR_STATE.DROP;
        boss.airDropIndex = 0;
        boss.airLastActionTime = timestamp;
        boss.airDropStartTime = timestamp;
    }

    /**
    * Handles the air drop sequence.
    * @param {number} timestamp Frame timestamp.
    * @param {*} setup Configuration or state setup object.
    * @param {*} attack Attack controller instance.
    * @returns {void}
    */
    handleAirDrop(timestamp, setup, attack) {
        const boss = this.endboss;
        const seq = boss.airDropSequence;
        const step = seq[boss.airDropIndex];
        if (!step) {
            boss.airState = boss.AIR_STATE.WAIT;
            boss.airLastActionTime = timestamp;
            return;
        }
        const elapsed = timestamp - boss.airDropStartTime;
        if (elapsed < step.delay) return;
        attack.spawnEgg(boss, setup, step.type, 0);
        boss.airDropIndex++;
    }

    /**
    * Handles the wait state during the air phase.
    * @param {number} timestamp Frame timestamp.
    * @returns {void}
    */
    handleAirWait(timestamp) {
        const boss = this.endboss;
        const elapsed = timestamp - boss.airLastActionTime;
        if (elapsed <= 800) return;
        const lastIndex = boss.airPoints.length - 1;
        if (boss.airPointIndex >= lastIndex) {
            boss.airState = boss.AIR_STATE.DESCEND;
            return;
        }
        boss.airPointIndex++;
        boss.airState = boss.AIR_STATE.MOVE;
    }

    /**
    * Handles descending movement during the air phase.
    * @returns {void}
    */
    handleAirDescend() {
        const boss = this.endboss;
        const groundY = 205;
        this.moveTowardsY(boss, groundY, 300);
        boss.isFlipped = boss.airDir === -1;
        if (Math.abs(groundY - boss.y) > 0.0001) return;
        this.onFinishDescend();
    }

    /**
    * Finalizes the descend action and switches to ground phase.
    * @returns {void}
    */
    onFinishDescend() {
        const boss = this.endboss;
        boss.y = 205;
        boss.isFly = false;
        boss.speedY = 0;
        boss.isJumping = false;
        boss.combatCtrl.setPhase(boss.ENDBOSS_PHASE.GROUND);
    }

    /**
    * Handles ascending movement during the air phase.
    * @returns {void}
    */
    handleAirAscend() {
        const boss = this.endboss;
        const targetY = boss.airY;
        this.prepareAscend(boss);
        this.moveTowardsY(boss, targetY, 300);
        boss.isFlipped = boss.airDir === 1;
        if (Math.abs(targetY - boss.y) > 0.0001) return;
        this.onReachAscendTarget();
    }

    /**
    * Prepares the entity for ascending.
    * @param {*} boss Endboss instance.
    * @returns {void}
    */
    prepareAscend(boss) {
        boss.isFly = true;
        boss.isJumping = false;
        boss.speedY = 0;
    }

    /**
    * Handles logic after reaching the ascend target.
    * @returns {void}
    */
    onReachAscendTarget() {
        const boss = this.endboss;
        const targetY = boss.airY;
        boss.y = targetY;
        if (boss.finisherStarted) return;
        boss.airState = boss.AIR_STATE.MOVE;
    }

    /**
    * Moves the entity toward a target y-position.
    * @param {*} boss Endboss instance.
    * @param {number} targetY Target y-coordinate.
    * @param {number} speed Movement speed in units per second.
    * @returns {void}
    */
    moveTowardsY(boss, targetY, speed) {
        const dt = boss.deltaSeconds ?? 0;
        const dy = targetY - boss.y;
        const step = speed * dt;
        const dir = Math.sign(dy);
        if (dir === 0) {
            boss.y = targetY;
            return;
        }
        const move = Math.min(Math.abs(dy), step);
        boss.y += dir * move;
    }
}