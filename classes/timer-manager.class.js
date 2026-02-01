export class TimerManager {
    constructor() {
        this.timers = new Map();

        this.timestamp = 0;          // 🕒 interne Weltzeit (ms)
        this._lastNow = null;        // für deltaTime
        this.timeScale = 1;          // Pause / SlowMo
        this.paused = false;
    }

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

    cancel(id) {
        this.timers.delete(id);
    }

    update() {
        const now = performance.now();

        if (this._lastNow === null) {
            this._lastNow = now;
            return;
        }

        let deltaTime = now - this._lastNow;
        this._lastNow = now;

        if (this.paused) return;

        deltaTime *= this.timeScale;
        this.timestamp += deltaTime;

        for (const [id, timer] of this.timers.entries()) {
            timer.remaining -= deltaTime;

            if (timer.remaining <= 0) {
                timer.callback();

                if (timer.repeat) {
                    timer.remaining += timer.delay; // kein Drift
                } else {
                    this.timers.delete(id);
                }
            }
        }
    }

    pause() {
        this.paused = true;
    }

    resume() {
        this.paused = false;
    }
}
