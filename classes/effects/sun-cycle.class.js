/**
 * Manages the sun cycle behavior.
 */
export class SunCycle {
    /**
    * Creates a new instance.
    * @param {*} setup Initialization setup object.
    */
    constructor(setup) {
        this.setup = setup;
        this.npc = this.setup.environment.sun;
        this.initOrbit();
        this.initState();
    }

    /**
    * Initializes orbit parameters.
    */
    initOrbit() {
        this.centerX = 640;
        this.centerY = 820;
        this.radius = 850;
        this.angle = Math.PI / 6;
        this.speed = 0.004;
    }

    /**
    * Initializes internal state.
    */
    initState() {
        this.isActive = false;
        this.lastUpdateTime = 0;
    }

    /**
    * Activates the sun cycle.
    */
    start() {
        this.isActive = true;
    }

    /**
    * Deactivates the sun cycle.
    */
    stop() {
        this.isActive = false;
    }

    /**
    * Resets the sun cycle state.
    */
    reset() {
        this.angle = Math.PI / 6;
        this.lastUpdateTime = 0;
    }

    /**
    * Updates the sun cycle position.
    * @param {number} timestamp Frame timestamp.
    */
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