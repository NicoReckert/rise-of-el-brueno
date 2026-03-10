/**
 * Controller responsible for managing sandstorm layers and intensity.
 */
export class TownSandstormController {
    /**
     * Creates a new TownSandstormController instance.
     * @param {Object} sandstorm Main sandstorm layer.
     * @param {Object} sandstormNear Near sandstorm layer.
     * @param {Object} sandstormFar Far sandstorm layer.
     */
    constructor(sandstorm, sandstormNear, sandstormFar) {
        this.sandstorm = sandstorm;
        this.sandstormNear = sandstormNear;
        this.sandstormFar = sandstormFar;
    }

    /**
     * Sets sandstorm intensity and applies it to all layers.
     * @param {number} t Sandstorm intensity value.
     * @returns {void}
     */
    setSandstorm(t) {
        const values = this.getSandstormValues(t);
        this.applyFarSandstorm(values);
        this.applyMainSandstorm(values);
        this.applyNearSandstorm(values);
    }

    /**
     * Calculates eased sandstorm intensity values.
     * @param {number} t Sandstorm intensity value.
     * @returns {{eased:number, boost:number, nearE:number}} Computed intensity values.
     */
    getSandstormValues(t) {
        t = Math.max(0, Math.min(1, t));
        const eased = this.smoothStep(t);
        const boostT = Math.max(0, (t - 0.7) / 0.3);
        const boost = this.smoothStep(boostT);
        const nearT = Math.max(0, (t - 0.5) * 2);
        const nearE = this.smoothStep(nearT);
        return { eased, boost, nearE };
    }

    /**
     * Applies a smoothstep interpolation to the given value.
     * @param {number} t Input value in the range [0, 1].
     * @returns {number} Interpolated value.
     */
    smoothStep(t) {
        return t * t * (3 - 2 * t);
    }

    /**
     * Applies intensity values to the far sandstorm layer.
     * @param {{eased:number, boost:number}} values Sandstorm intensity values.
     * @returns {void}
     */
    applyFarSandstorm({ eased, boost }) {
        this.sandstormFar.setAlpha(0.02 + (0.08 - 0.02) * eased);
        this.sandstormFar.setSpeed(0.15 + (0.70 - 0.15) * eased + 0.30 * boost);
    }

    /**
     * Applies intensity values to the main sandstorm layer.
     * @param {{eased:number, boost:number}} values Sandstorm intensity values.
     * @returns {void}
     */
    applyMainSandstorm({ eased, boost }) {
        this.sandstorm.setAlpha(0.05 + (0.17 - 0.05) * eased);
        this.sandstorm.setSpeed(0.40 + (2.10 - 0.40) * eased + 1.10 * boost);
    }

    /**
     * Applies intensity values to the near sandstorm layer.
     * @param {{nearE:number, boost:number}} values Sandstorm intensity values.
     * @returns {void}
     */
    applyNearSandstorm({ nearE, boost }) {
        this.sandstormNear.setAlpha(0.00 + (0.20 - 0.00) * nearE);
        this.sandstormNear.setSpeed(0.90 + (4.80 - 0.90) * nearE + 1.80 * boost);
    }
}