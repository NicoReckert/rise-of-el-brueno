/**
 * Manages timers and scaled time updates.
 */
export class TimerManager {
    /**
     * Creates a new timer manager instance.
     */
    constructor() {
        this.timers = new Map();
        this.timestamp = 0;
        this._lastNow = null;
        this.timeScale = 1;
        this.paused = false;
    }

    /**
     * Adds a unique timer.
     * @param {string|number} id Timer identifier.
     * @param {number} delay Delay in milliseconds.
     * @param {Function} callback Callback function.
     * @param {boolean} [repeat=false] Whether the timer repeats.
     * @returns {void}
     */
    addUnique(id, delay, callback, repeat = false) {
        if (this.timers.has(id)) return;
        this.timers.set(id, {
            id,
            remaining: delay,
            delay,
            callback,
            repeat
        });
    }

    /**
     * Cancels a timer by its identifier.
     * @param {string|number} id Timer identifier.
     * @returns {void}
     */
    cancel(id) {
        this.timers.delete(id);
    }

    /**
     * Updates the internal clock and processes active timers.
     * @returns {void}
     */
    update() {
        const now = performance.now();
        if (this.initUpdateClock(now)) return;
        let deltaTime = this.getDeltaTime(now);
        if (this.paused) return;
        deltaTime = this.applyTimeScale(deltaTime);
        this.timestamp += deltaTime;
        this.updateTimers(deltaTime);
    }

    /**
     * Initializes the update clock.
     * @param {number} now Current timestamp.
     * @returns {boolean} True if initialization occurred, otherwise false.
     */
    initUpdateClock(now) {
        if (this._lastNow !== null) return false;
        this._lastNow = now;
        return true;
    }

    /**
     * Calculates the delta time since the last update.
     * @param {number} now Current timestamp.
     * @returns {number} Delta time in milliseconds.
     */
    getDeltaTime(now) {
        const deltaTime = now - this._lastNow;
        this._lastNow = now;
        return deltaTime;
    }

    /**
     * Applies the current time scale to the delta time.
     * @param {number} deltaTime Delta time in milliseconds.
     * @returns {number} Scaled delta time.
     */
    applyTimeScale(deltaTime) {
        return deltaTime * this.timeScale;
    }

    /**
     * Updates all active timers.
     * @param {number} deltaTime Delta time in milliseconds.
     * @returns {void}
     */
    updateTimers(deltaTime) {
        for (const [id, timer] of this.timers.entries()) {
            if (!this.tickTimer(timer, deltaTime)) continue;
            timer.callback();
            this.resolveTimerAfterCallback(id, timer);
        }
    }

    /**
     * Updates a timer countdown.
     * @param {Object} timer Timer instance.
     * @param {number} deltaTime Delta time in milliseconds.
     * @returns {boolean} True if the timer reached zero or below.
     */
    tickTimer(timer, deltaTime) {
        timer.remaining -= deltaTime;
        return timer.remaining <= 0;
    }

    /**
     * Resolves the timer state after the callback execution.
     * @param {string|number} id Timer identifier.
     * @param {Object} timer Timer instance.
     * @returns {void}
     */
    resolveTimerAfterCallback(id, timer) {
        if (timer.repeat) return void (timer.remaining += timer.delay);
        this.timers.delete(id);
    }

    /**
     * Pauses the time manager.
     * @returns {void}
     */
    pause() {
        this.paused = true;
    }

    /**
     * Resumes the time manager.
     * @returns {void}
     */
    resume() {
        this.paused = false;
    }
}