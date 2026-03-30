/**
 * Controls ground attack behavior of an endboss.
 */
export class EndbossGroundAttackController {
    /**
     * Creates a new instance.
     * @param {*} endboss Reference to the endboss object.
     */
    constructor(endboss) {
        this.endboss = endboss;
    }

    /**
     * Updates the ground phase logic.
     * @param {number} timestamp Frame timestamp.
     * @param {Object} setup Setup object.
     * @returns {void}
     */
    updateGroundPhase(timestamp, setup) {
        if (!this.endboss.groundFireballSequenceActive) {
            if (!this.shouldStartGroundPhase(setup)) return;
            this.startGroundFireballSequence();
        }
        this.updateGroundShotProgress(timestamp);
        if (this.handleGroundSequenceCompletion()) return;
        this.tryStartNextGroundShot(timestamp);
    }

    /**
     * Checks whether the ground phase should start.
     * @param {Object} setup Setup object.
     * @returns {boolean} True if the ground phase should start, otherwise false.
     */
    shouldStartGroundPhase(setup) {
        const char = setup.world.character;
        const dist = Math.abs(
            (char.x + char.width * 0.5) -
            (this.endboss.x + this.endboss.width * 0.5)
        );
        return dist >= 200 && dist <= 900;
    }

    /**
     * Initializes the ground fireball sequence.
     * @returns {void}
     */
    startGroundFireballSequence() {
        this.endboss.groundFireballSequenceActive = true;
        this.endboss.groundFireballShotsDone = 0;
        this.endboss.groundShotInProgress = false;
        this.endboss.lastSequenceShotTime = 0;
    }

    /**
     * Updates progress of the current ground shot.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    updateGroundShotProgress(timestamp) {
        if (!this.endboss.groundShotInProgress) return;
        if (this.endboss.isFireballAttack) return;
        this.endboss.groundFireballShotsDone++;
        this.endboss.groundShotInProgress = false;
        this.endboss.lastSequenceShotTime = timestamp;
    }

    /**
     * Handles completion of the ground fireball sequence.
     * @returns {boolean} True if the sequence was completed and handled, otherwise false.
     */
    handleGroundSequenceCompletion() {
        if (!this.isGroundSequenceFinished()) {
            return false;
        }
        this.resetToAirEggsPhase();
        return true;
    }

    /**
     * Determines whether the ground fireball sequence is finished.
     * @returns {boolean} True if the sequence is finished, otherwise false.
     */
    isGroundSequenceFinished() {
        const shotsDone = this.endboss.groundFireballShotsDone;
        const shotsMax = this.endboss.groundFireballShotsMax;
        return shotsDone >= shotsMax;
    }

    /**
     * Resets state and switches to the air eggs phase.
     * @returns {void}
     */
    resetToAirEggsPhase() {
        this.endboss.groundFireballSequenceActive = false;
        this.endboss.airPointIndex = 0;
        this.endboss.airState = this.endboss.AIR_STATE.ASCEND;
        this.endboss.isFly = true;
        this.endboss.isJumping = false;
        this.endboss.speedY = 0;
        this.endboss.combatCtrl.setPhase(this.endboss.ENDBOSS_PHASE.AIR_EGGS);
    }

    /**
     * Attempts to start the next ground shot.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    tryStartNextGroundShot(timestamp) {
        const boss = this.endboss;
        if (!this.canStartNextGroundShot(boss, timestamp)) return;
        this.startGroundShot(boss, timestamp);
    }

    /**
     * Checks whether the next ground shot can be started.
     * @param {*} boss Endboss instance.
     * @param {number} timestamp Frame timestamp.
     * @returns {boolean} True if the next shot can start, otherwise false.
     */
    canStartNextGroundShot(boss, timestamp) {
        if (boss.isFireballAttack) return false;
        const delayOk =
            timestamp - boss.lastSequenceShotTime >= boss.groundSequenceShotDelay;
        const cooldownOk =
            timestamp - boss.lastFireballAttackTime >= boss.fireballCooldown;
        if (!delayOk) return false;
        if (!cooldownOk) return false;
        return true;
    }

    /**
     * Starts a ground shot attack.
     * @param {*} boss Endboss instance.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    startGroundShot(boss, timestamp) {
        boss.isFireballAttack = true;
        boss.hasFiredThisAttack = false;
        boss.frameIndex = 0;
        boss.lastFireballAttackTime = timestamp;
        const audio = boss.allAudios.bossFireballChargeSfx.cloneNode();
        audio.play();
        boss.groundShotInProgress = true;
    }
}