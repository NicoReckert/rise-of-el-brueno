/**
 * Manages the moon cycle behavior.
 */
export class MoonCycle {
    /**
    * Creates a new instance.
    * @param {*} setup Initialization setup object.
    */
    constructor(setup) {
        this.setup = setup;
        this.npc = this.setup.environment.moon;
        this.initOrbit();
        this.initState();
    }

    /**
    * Initializes orbit parameters.
    */
    initOrbit() {
        this.centerX = 1200;
        this.centerY = 320;
        this.radius = 700;
        this.angle = Math.PI / 2;
        this.speed = 0.004;
    }

    /**
    * Initializes internal state.
    */
    initState() {
        this.isActive = false;
        this.lastUpdateTime = 0;
        this.finished = false;
    }

    /**
    * Activates the moon cycle.
    */
    start() {
        this.isActive = true;
    }

    /**
    * Deactivates the moon cycle.
    */
    stop() {
        this.isActive = false;
    }

    /**
    * Resets the moon cycle state.
    */
    reset() {
        this.angle = Math.PI / 2;
        this.lastUpdateTime = 0;
    }

    /**
    * Updates the moon cycle position.
    * @param {number} timestamp Frame timestamp.
    */
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