/**
 * Represents a floating damage text.
 */
export class DamageText {
    /**
     * Creates a new floating text instance.
     * @param {*} xOrTarget X position or target reference.
     * @param {*} yOrValue Y position or value.
     * @param {*} value Displayed value.
     */
    constructor(xOrTarget, yOrValue, value) {
        this.initPositionAndValue(xOrTarget, yOrValue, value);
        this.initFloatingTextState();
    }

    /**
     * Initializes position and value from either coordinates or a target.
     * @param {*} xOrTarget X position or target reference.
     * @param {*} yOrValue Y position or value.
     * @param {*} value Displayed value.
     * @returns {void}
     */
    initPositionAndValue(xOrTarget, yOrValue, value) {
        const isTarget = this.isTargetObject(xOrTarget);
        if (!isTarget) return this.setDirectPositionAndValue(xOrTarget, yOrValue, value);
        this.setTargetPositionAndValue(xOrTarget, yOrValue);
    }

    /**
     * Checks whether the argument is a target object.
     * @param {*} xOrTarget Value to check.
     * @returns {boolean} True if it is a target object.
     */
    isTargetObject(xOrTarget) {
        return typeof xOrTarget === 'object' && xOrTarget !== null;
    }

    /**
     * Sets position and value directly.
     * @param {number} x X position.
     * @param {number} y Y position.
     * @param {*} value Displayed value.
     * @returns {void}
     */
    setDirectPositionAndValue(x, y, value) {
        this.x = x;
        this.y = y;
        this.value = value;
    }

    /**
     * Sets position and value based on a target object.
     * @param {Object} target Target object.
     * @param {*} value Displayed value.
     * @returns {void}
     */
    setTargetPositionAndValue(target, value) {
        const hb = target.getHitboxRect?.();
        this.x = this.getTargetCenterX(target, hb);
        this.y = this.getTargetTopY(target, hb) - 12;
        this.value = value;
    }

    /**
     * Returns the horizontal center position of a target.
     * @param {Object} target Target object.
     * @param {Object} [hb] Optional hitbox data.
     * @returns {number} Center X position.
     */
    getTargetCenterX(target, hb) {
        return hb ? hb.cx : target.x + target.width * 0.5;
    }

    /**
     * Returns the top Y position of a target.
     * @param {Object} target Target object.
     * @param {Object} [hb] Optional hitbox data.
     * @returns {number} Top Y position.
     */
    getTargetTopY(target, hb) {
        return hb ? hb.top : target.y;
    }

    /**
     * Initializes the floating text state.
     * @returns {void}
     */
    initFloatingTextState() {
        this.startY = this.y;
        this.startTime = performance.now();
        this.lifetime = 700;
        this.alpha = 1;
    }

    /**
     * Updates the floating text position and opacity.
     * @param {number} timestamp Current timestamp.
     * @returns {boolean} True if the text is still active.
     */
    update(timestamp) {
        const t = (timestamp - this.startTime) / this.lifetime;
        this.y = this.startY - t * 30;
        this.alpha = 1 - t;
        return t < 1;
    }

    /**
     * Draws the floating damage text.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {number} [camX=0] Camera X offset.
     * @returns {void}
     */
    draw(ctx, camX = 0) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = 'red';
        ctx.font = 'bold 18px Cinzel, serif';
        ctx.textAlign = 'center';
        ctx.fillText(this.value, this.x - camX, this.y);
        ctx.restore();
    }
}