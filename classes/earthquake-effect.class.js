export class EarthquakeEffect {
    constructor(setup, ctx) {
        this.setup = setup;
        this.ctx = ctx;
        this.shakeX = 0;
        this.shakeY = 0;
        this.lastTimestamp = 0;
    }

    handle(timestamp) {
        if (!this.setup.earthquakeStart) return;
        const deltaTime = this._computeDeltaTime(timestamp);
        this._updateShakeValues(deltaTime);
        this._applyShake();
    }

    restore() {
        this.ctx.restore();
    }

    _computeDeltaTime(timestamp) {
        if (!this.lastTimestamp) this.lastTimestamp = timestamp;
        const delta = (timestamp - this.lastTimestamp) / 1000;
        this.lastTimestamp = timestamp;
        return delta;
    }

    _updateShakeValues(deltaTime) {
        if (this.setup.shakeIntensity <= 0) {
            this.setup.earthquakeStart = false;
            this.shakeX = 0;
            this.shakeY = 0;
            return;
        }

        this.shakeX = Math.round((Math.random() - 0.5) * this.setup.shakeIntensity);
        this.shakeY = Math.round((Math.random() - 0.5) * this.setup.shakeIntensity);

        const decayRate = 0.9955;
        this.setup.shakeIntensity *= Math.pow(decayRate, deltaTime * 60);
    }

    _applyShake() {
        this.ctx.save();
        this.ctx.translate(this.shakeX, this.shakeY);
    }
}
