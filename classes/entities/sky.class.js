import { MovableObject } from '../systems/movable-object.class.js';
import { buildSkyStops3Smooth } from '../../utils/color-utils.js';
import { SKY_PRESETS } from '../../config/sky-presets-config.js';

/**
 * Sky background with optional presets and gradient mode.
 */
export class Sky extends MovableObject {
    /**
     * Creates a new sky background.
     * @param {{x?: number, y?: number, width: number, height: number, preset?: string}} [opts={}] Configuration options.
     */
    constructor({ x = 0, y = 0, width, height, preset = "desertDay" } = {}) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.mode = "gradient";
        this.usePreset(preset);
    }

    /**
     * Sets the gradient colors of the sky.
     * @param {string} top Top color.
     * @param {string} mid Middle color.
     * @param {string} bottom Bottom color.
     */
    setColors(top, mid, bottom) {
        this.stops = buildSkyStops3Smooth(top, mid, bottom);
    }

    /**
     * Applies a predefined sky color preset.
     * @param {string} name Preset name.
     */
    usePreset(name) {
        const p = SKY_PRESETS[name];
        if (!p) return;
        if (p.top) {
            this.stops = buildSkyStops3Smooth(p.top, p.mid, p.bottom);
            return;
        }
        this.stops = p;
    }

    /**
     * Draws the sky gradient onto the canvas.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     */
    draw(ctx) {
        const g = ctx.createLinearGradient(0, 0, 0, this.height);
        for (const s of this.stops) g.addColorStop(s.stop, s.color);
        ctx.fillStyle = g;
        ctx.fillRect(Math.round(this.x), Math.round(this.y), this.width, this.height);
    }
}