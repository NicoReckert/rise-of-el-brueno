import { MovableObject } from '../systems/movable-object.class.js';
import { buildSkyStops3Smooth } from '../../utils/color-utils.js';

export class Sky extends MovableObject {

    static PRESETS = {
        desertDay: [
            // Blau oben (mehr Zwischenstufen, aber nicht Richtung Weiß)
            { stop: 0.00, color: "#1CA6CF" },
            { stop: 0.12, color: "#33AFD2" },
            { stop: 0.28, color: "#59C1DA" },
            { stop: 0.38, color: "#7CCFE1" },

            // "Haze"-Zone (heller, aber NICHT weißlich -> verhindert Kante)
            { stop: 0.44, color: "#9EDAE8" },
            { stop: 0.52, color: "#B7E4EE" },

            // Warm wird eingeleitet (weicher Übergang)
            { stop: 0.60, color: "#E7D7B6" },
            { stop: 0.70, color: "#F0D2A2" }, // neu: zwischen creme und sand
            { stop: 0.80, color: "#F1C98C" },
            { stop: 0.90, color: "#F7E1C2" },
            { stop: 1.00, color: "#FFF4E4" },
        ],

        sunset: [
            { stop: 0.00, color: "#5E3A9B" },
            { stop: 0.35, color: "#B75E9A" },
            { stop: 0.60, color: "#F28B5C" },
            { stop: 0.85, color: "#F6C06A" },
            { stop: 1.00, color: "#F3E3C3" }
        ],

        night: [
            { stop: 0.00, color: "#0F1C2E" },
            { stop: 0.40, color: "#1F2F4A" },
            { stop: 0.70, color: "#3A4A6A" },
            { stop: 1.00, color: "#6C7A96" }
        ],
        dystopicFire: [
            { stop: 0.00, color: "#243B55" },  // dunkles Petrol
            { stop: 0.18, color: "#2F4F6A" },
            { stop: 0.35, color: "#4A6C7E" },

            // Rauchige Zone
            { stop: 0.50, color: "#6B7E86" },
            { stop: 0.62, color: "#8B8C7A" },

            // Warmes Feuer-Reflex-Licht
            { stop: 0.75, color: "#B89A6A" },
            { stop: 0.88, color: "#D1A66F" },
            { stop: 1.00, color: "#E7C69A" },
        ],
        tragicDay: [
            // Kaltes, entsättigtes Blau
            { stop: 0.00, color: "#255A6F" },
            { stop: 0.18, color: "#3F7F97" },
            { stop: 0.35, color: "#5F94A8" },

            // Rauchiger Haze
            { stop: 0.52, color: "#8FA6A8" },
            { stop: 0.62, color: "#B4B0A1" },

            // Gedämpftes, tragisches Warm
            { stop: 0.78, color: "#C9A983" },
            { stop: 0.90, color: "#D9B792" },
            { stop: 1.00, color: "#E6C9A8" },
        ],
    };

    constructor({ x = 0, y = 0, width, height, preset = "desertDay" } = {}) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.mode = "gradient";
        this.usePreset(preset);
    }

    setColors(top, mid, bottom) {
        this.stops = buildSkyStops3Smooth(top, mid, bottom);
    }

    usePreset(name) {
        const p = Sky.PRESETS[name];
        if (!p) return;

        // 3-Farben Preset -> Smooth Stops bauen
        if (p.top) {
            this.stops = buildSkyStops3Smooth(p.top, p.mid, p.bottom);
            return;
        }

        // oder: direkt Stops-Liste
        this.stops = p;
    }

    draw(ctx) {
        const g = ctx.createLinearGradient(0, 0, 0, this.height);
        for (const s of this.stops) g.addColorStop(s.stop, s.color);
        ctx.fillStyle = g;

        // WICHTIG: x/y respektieren, falls du doch mal anders zeichnest
        ctx.fillRect(Math.round(this.x), Math.round(this.y), this.width, this.height);
    }
}