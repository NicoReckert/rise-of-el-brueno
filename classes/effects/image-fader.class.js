/**
 * Handles fade-in and fade-out rendering for an image.
 */
export class ImageFader {
    /**
    * Creates a new instance.
    * @param {*} image Image source.
    * @param {number} x Initial x-coordinate.
    * @param {number} y Initial y-coordinate.
    * @param {number} width Width of the object.
    * @param {number} height Height of the object.
    */
    constructor(image, x, y, width, height) {
        this.image = image;
        this.initPositionAndSize(x, y, width, height);
        this.initFadeState();
    }

    /**
    * Initializes position and size.
    * @param {number} x X-coordinate.
    * @param {number} y Y-coordinate.
    * @param {number} width Width value.
    * @param {number} height Height value.
    */
    initPositionAndSize(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    /**
    * Initializes fade state properties.
    */
    initFadeState() {
        this.alpha = 0;
        this.duration = 2000;
        this.visibleDuration = 3000;
        this.startTime = null;
        this.state = "idle";
    }

    /**
    * Starts the fade process.
    * @param {number} timestamp Frame timestamp.
    */
    start(timestamp) {
        this.startTime = timestamp;
        this.state = "fadeIn";
    }

    /**
    * Updates the fade state.
    * @param {number} timestamp Frame timestamp.
    */
    update(timestamp) {
        if (this.isIdleOrDone()) return;
        const elapsed = timestamp - this.startTime;
        this.updateFadeState(timestamp, elapsed);
    }

    /**
    * Checks whether the fade is idle or completed.
    * @returns {boolean} True if idle or done, otherwise false.
    */
    isIdleOrDone() {
        return this.state === "idle" || this.state === "done";
    }

    /**
    * Updates the fade state based on the current phase.
    * @param {number} timestamp Frame timestamp.
    * @param {number} elapsed Elapsed time since start.
    */
    updateFadeState(timestamp, elapsed) {
        switch (this.state) {
            case "fadeIn":
                this.handleFadeIn(timestamp, elapsed);
                break;
            case "visible":
                this.handleVisible(timestamp, elapsed);
                break;
            case "fadeOut":
                this.handleFadeOut(elapsed);
                break;
        }
    }

    /**
    * Handles the fade-in phase.
    * @param {number} timestamp Frame timestamp.
    * @param {number} elapsed Elapsed time since start.
    */
    handleFadeIn(timestamp, elapsed) {
        this.alpha = Math.min(elapsed / this.duration, 1);
        if (elapsed >= this.duration) {
            this.state = "visible";
            this.startTime = timestamp;
        }
    }

    /**
    * Handles the visible phase.
    * @param {number} timestamp Frame timestamp.
    * @param {number} elapsed Elapsed time since phase start.
    */
    handleVisible(timestamp, elapsed) {
        this.alpha = 1;
        if (elapsed >= this.visibleDuration) {
            this.state = "fadeOut";
            this.startTime = timestamp;
        }
    }

    /**
    * Handles the fade-out phase.
    * @param {number} elapsed Elapsed time since phase start.
    */
    handleFadeOut(elapsed) {
        this.alpha = Math.max(1 - elapsed / this.duration, 0);
        if (elapsed >= this.duration) {
            this.state = "done";
        }
    }

    /**
    * Draws the image with the current fade state.
    * @param {CanvasRenderingContext2D} ctx Rendering context.
    */
    draw(ctx) {
        if (this.state === "idle" || this.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.globalAlpha = 1.0;
        ctx.restore();
    }

    /**
    * Checks whether the fade process is completed.
    * @returns {boolean} True if done, otherwise false.
    */
    isDone() {
        return this.state === "done";
    }
}