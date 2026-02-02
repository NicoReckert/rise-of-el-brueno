export class EarthquakeEffect {
    constructor(setup, ctx) {
        this.setup = setup;
        this.ctx = ctx;
        this.shakeX = 0;
        this.shakeY = 0;
        this.lastTimestamp = 0;
    }

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

    _computeDeltaTime(timestamp) {
        if (!this.lastTimestamp) this.lastTimestamp = timestamp;
        const delta = (timestamp - this.lastTimestamp) / 1000;
        this.lastTimestamp = timestamp;
        return delta;
    }

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
