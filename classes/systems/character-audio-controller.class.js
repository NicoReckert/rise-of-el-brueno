/**
 * Controls character-related audio.
 */
export class CharacterAudioController {
    /**
     * Creates a new instance.
     * @param {Object} character Character instance.
     * @param {Object} audioManager Audio manager instance.
     */
    constructor(character, audioManager) {
        this.character = character;
        this.audioManager = audioManager;
        this.lastStepCheck = 0;
        this.stepCheckDelay = 400;
    }

    /**
     * Updates character audio state.
     * @param {number} timestamp Frame timestamp.
     */
    update(timestamp) {
        this.playStepIfNeeded(timestamp);
        this.playLandingIfNeeded();
    }

    /**
     * Plays a footstep sound if movement conditions are met.
     * @param {number} timestamp Frame timestamp.
     */
    playStepIfNeeded(timestamp) {
        if (timestamp - this.lastStepCheck < this.stepCheckDelay) return;
        this.lastStepCheck = timestamp;
        const c = this.character;
        const isWalking = c.isMovingLeft || c.isMovingRight;
        if (isWalking && !c.isJumping && !c.isFlying) {
            if (c.walkOnDestroyedHouse) {
                this.audioManager.playOneShot('footStepOnDestroyedHouseSound', { volume: 0.6 });
            } else {
                this.audioManager.playOneShot('footStepSound', { volume: 0.6 });
            }
        }
    }

    /**
     * Plays a landing sound if landing state is active.
     */
    playLandingIfNeeded() {
        const c = this.character;
        if (!c.isLanding) return;
        this.audioManager.playOneShot('landingSound', { volume: 0.8 });
        c.isLanding = false;
    }
}