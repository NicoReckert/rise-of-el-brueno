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
  { stop: 0.00, color: "#21363A" },
  { stop: 0.16, color: "#2F5651" },
  { stop: 0.34, color: "#5E7E72" },

  // “kranker” Dunst
  { stop: 0.52, color: "#8A8F78" },
  { stop: 0.66, color: "#A79B6D" },

  // staubige Hitze unten
  { stop: 0.82, color: "#C2A06F" },
  { stop: 1.00, color: "#D1B086" },
],

tragicDay1: [
  // Rauchdeckel (oben)
  { stop: 0.00, color: "#1C2F38" },
  { stop: 0.12, color: "#2D4956" },
  { stop: 0.28, color: "#4F6A73" },

  // Dunst / Asche
  { stop: 0.48, color: "#7C8A88" },
  { stop: 0.60, color: "#9A9A86" },

  // Staubiger Horizont (Sonne blockiert)
  { stop: 0.78, color: "#B79D70" },
  { stop: 0.92, color: "#C9A67A" },
  { stop: 1.00, color: "#D2AE85" },
],

tragicDay3: [
  // oben: etwas schwerer/dunkler
  { stop: 0.00, color: "#182A2E" },
  { stop: 0.14, color: "#254245" },
  { stop: 0.30, color: "#3D615C" },
  { stop: 0.42, color: "#5E7E72" },

  // “kranker” Dunst (mehr Übergang)
  { stop: 0.56, color: "#7E8773" },
  { stop: 0.68, color: "#A1966A" },

  // staubige Hitze unten (weicher auslaufend)
  { stop: 0.82, color: "#BE9E6F" },
  { stop: 0.92, color: "#D1B088" },
  { stop: 1.00, color: "#E0C3A0" },
],

tragicDay: [
  // Rauchdeckel oben (mehr Bedrohung)
  { stop: 0.00, color: "#152326" },
  { stop: 0.10, color: "#203436" },
  { stop: 0.24, color: "#2E4D4A" },

  // kalter/kranker Mittelton, aber nicht zu grün
  { stop: 0.40, color: "#55706A" },
  { stop: 0.54, color: "#7D8773" },

  // Staubschicht (sandig/ashy) – wichtig für Sturm-Look
  { stop: 0.68, color: "#A89E74" },
  { stop: 0.80, color: "#C2A16F" },

  // unten heller für Lesbarkeit trotz Sturm
  { stop: 0.92, color: "#D7B791" },
  { stop: 1.00, color: "#E6CBA9" },
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