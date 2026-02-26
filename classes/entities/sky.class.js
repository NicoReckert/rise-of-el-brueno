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
        tragicDay2: [
  // Daytime, aber kühler und leicht entsättigt
  { stop: 0.00, color: "#2F90AC" },
  { stop: 0.14, color: "#49A5BC" },
  { stop: 0.30, color: "#6DBDCC" },
  { stop: 0.40, color: "#8FD0DD" },

  // Staub/Haze (hell, nicht grau-kalt)
  { stop: 0.52, color: "#B8DEE5" },
  { stop: 0.60, color: "#D6D9C9" },

  // Gedämpftes Warm (tragisch, aber noch Tag)
  { stop: 0.72, color: "#E3C49B" },
  { stop: 0.86, color: "#EED4B2" },
  { stop: 1.00, color: "#F6E6D2" },
],

tragicDay: [
  // Kühl, aber nicht dunkel
  { stop: 0.00, color: "#2A7E98" },
  { stop: 0.15, color: "#3E8FA6" },
  { stop: 0.30, color: "#5AA4B7" },

  // Staubiger Übergang (weniger hell, weniger sauber)
  { stop: 0.45, color: "#8FB1B6" },
  { stop: 0.55, color: "#B5B6A5" },

  // Trockene, entsättigte Wärme
  { stop: 0.70, color: "#D3BA95" },
  { stop: 0.85, color: "#E2C8A6" },
  { stop: 1.00, color: "#EEDCC7" },
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