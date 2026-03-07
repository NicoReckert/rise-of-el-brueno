/**
 * Represents an earthquake screen shake effect.
 */
export class EarthquakeEffect {
    /**
     * Creates a new instance.
     * @param {*} setup Configuration object.
     * @param {*} ctx Rendering context.
     */
    constructor(setup, ctx) {
        this.setup = setup;
        this.ctx = ctx;
        this.shakeX = 0;
        this.shakeY = 0;
        this.lastTimestamp = 0;
    }

    /**
     * Renders the earthquake effect.
     * @param {number} timestamp Current frame timestamp.
     * @param {Function} drawFn Render callback.
     */
    render(timestamp, drawFn) {
        if (!this.setup.state.earthquakeStart) {
            drawFn();
            return;
        }
        const deltaTime = this._computeDeltaTime(timestamp);
        this._updateShakeValues(deltaTime);
        this.ctx.save();
        this.ctx.translate(this.shakeX, this.shakeY);
        drawFn();
        this.ctx.restore();
    }

    /**
     * Computes the time difference between frames.
     * @param {number} timestamp Current frame timestamp.
     * @returns {number} Delta time in seconds.
     */
    _computeDeltaTime(timestamp) {
        if (!this.lastTimestamp) this.lastTimestamp = timestamp;
        const delta = (timestamp - this.lastTimestamp) / 1000;
        this.lastTimestamp = timestamp;
        return delta;
    }

    /**
     * Updates the shake offset values.
     * @param {number} deltaTime Delta time in seconds.
     */
    _updateShakeValues(deltaTime) {
        if (this.setup.state.shakeIntensity <= 0) {
            this.setup.state.earthquakeStart = false;
            this.shakeX = 0;
            this.shakeY = 0;
            return;
        }
        this.shakeX = Math.round((Math.random() - 0.5) * this.setup.state.shakeIntensity);
        this.shakeY = Math.round((Math.random() - 0.5) * this.setup.state.shakeIntensity);
        const decayRate = 0.9955;
        this.setup.state.shakeIntensity *= Math.pow(decayRate, deltaTime * 60);
    }
}