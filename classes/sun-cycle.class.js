class SunCycle {
    constructor(setup) {
        this.setup = setup;
        this.npc = this.setup.environment.sun;
        this.centerX = 640;
        this.centerY = 820;
        this.radius = 850;
        this.angle = Math.PI / 6;
        this.speed = 0.004;
        this.isActive = false;
        this.lastUpdateTime = 0;
    }

    start() {
        this.isActive = true;
    }

    stop() {
        this.isActive = false;
    }

    reset() {
        this.angle = Math.PI / 6;
        this.lastUpdateTime = 0;
    }

    update(timestamp) {
        if (!this.isActive) return;
        if (!this.lastUpdateTime) this.lastUpdateTime = timestamp;
        const delta = (timestamp - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = timestamp;
        if (this.angle < Math.PI) {
            this.angle += this.speed * delta * 60;
        }
        this.npc.x = this.centerX + this.radius * Math.cos(this.angle);
        this.npc.y = this.centerY - this.radius * Math.sin(this.angle);
    }
}