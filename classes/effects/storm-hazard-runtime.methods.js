export const stormHazardRuntimeMethods = {
    /**
     * Updates the horizontal position based on delta time.
     * @returns {void}
     */
    moveByDelta() {
        const dt60 = (this.deltaTime ?? 1 / 60) * 60;
        this.x += (this.speedX ?? 0) * dt60;
    },

    /**
     * Checks whether the hazard lifetime has expired and marks it for removal.
     * @param {number} timestamp Current timestamp.
     * @returns {boolean} True if the hazard expired.
     */
    expireIfNeeded(timestamp) {
        if (timestamp < this.dieAt) return false;
        this.markedForRemoval = true;
        return true;
    },

    /**
     * Checks whether the hazard is within its active window.
     * @param {number} timestamp Current timestamp.
     * @returns {boolean} True if within the active window.
     */
    isWithinActiveWindow(timestamp) {
        return timestamp >= this.activeFrom && timestamp <= this.activeUntil;
    },

    /**
     * Returns the character used for hazard state checks.
     * @returns {Object|undefined} Character instance.
     */
    getStateCharacter() {
        return this.setup?.world?.character;
    },

    /**
     * Checks whether the hazard collides with the character.
     * @param {Object} char Character instance.
     * @returns {boolean} True if a collision occurs.
     */
    hasCharacterCollision(char) {
        return this.isColliding(
            char,
            { x: 0, y: 0, width: 0, height: 0 },
            { x: 0, y: 0, width: 0, height: 0 }
        );
    },

    /**
     * Checks if the character can be hit.
     * @param {*} character Character instance.
     * @param {number} now Current time.
     * @returns {boolean}
     */
    canHitCharacter(character, now) {
        return now >= (character.stormHazardHitUntil ?? 0);
    }
}