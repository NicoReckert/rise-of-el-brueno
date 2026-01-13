class MoonCycle {
    constructor(setup) {
        this.setup = setup;
        this.npc = this.setup.environment.moon;
        this.centerX = 1200;
        this.centerY = 320;
        this.radius = 700;
        this.angle = Math.PI / 2;
        this.speed = 0.004;
        this.isActive = false;
        this.lastUpdateTime = 0;
        this.finished = false;
    }

    start() {
        this.isActive = true;
    }

    stop() {
        this.isActive = false;
    }

    reset() {
        this.angle = Math.PI / 2;
        this.lastUpdateTime = 0;
    }

    update(timestamp) {
        if (!this.isActive) return;

        if (!this.lastUpdateTime) this.lastUpdateTime = timestamp;
        const delta = (timestamp - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = timestamp;

        if (this.angle < Math.PI * 0.85) {
            this.angle += this.speed * delta * 60;
        } else this.finished = true;

        this.npc.x = this.centerX + this.radius * Math.cos(this.angle);
        this.npc.y = this.centerY - this.radius * Math.sin(this.angle);
    }
}