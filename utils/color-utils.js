export function hexToRgb(hex) {
    hex = hex.replace('#', '').trim();
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const n = parseInt(hex, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function rgbToHex({ r, g, b }) {
    const to = (v) => v.toString(16).padStart(2, '0');
    return `#${to(r)}${to(g)}${to(b)}`;
}

// sRGB <-> Linear (Gamma)
function srgbToLinear(u) {
    u /= 255;
    return (u <= 0.04045) ? (u / 12.92) : Math.pow((u + 0.055) / 1.055, 2.4);
}
function linearToSrgb(u) {
    const v = (u <= 0.0031308) ? (u * 12.92) : (1.055 * Math.pow(u, 1 / 2.4) - 0.055);
    return Math.round(Math.max(0, Math.min(1, v)) * 255);
}

export function lerpColorGamma(hexA, hexB, t) {
    const a = hexToRgb(hexA);
    const b = hexToRgb(hexB);

    const ar = srgbToLinear(a.r), ag = srgbToLinear(a.g), ab = srgbToLinear(a.b);
    const br = srgbToLinear(b.r), bg = srgbToLinear(b.g), bb = srgbToLinear(b.b);

    const r = ar + (br - ar) * t;
    const g = ag + (bg - ag) * t;
    const bl = ab + (bb - ab) * t;

    return rgbToHex({
        r: linearToSrgb(r),
        g: linearToSrgb(g),
        b: linearToSrgb(bl),
    });
}

export function buildSkyStops3Smooth(top, mid, bottom) {
    return [
        { stop: 0.00, color: top },
        { stop: 0.18, color: lerpColorGamma(top, mid, 0.25) },
        { stop: 0.38, color: lerpColorGamma(top, mid, 0.55) },
        { stop: 0.55, color: lerpColorGamma(top, mid, 0.80) },

        // Mid deutlich später!
        { stop: 0.72, color: mid },

        // Orange sehr breit ziehen
        { stop: 0.82, color: lerpColorGamma(mid, bottom, 0.25) },
        { stop: 0.90, color: lerpColorGamma(mid, bottom, 0.55) },
        { stop: 0.96, color: lerpColorGamma(mid, bottom, 0.80) },
        { stop: 1.00, color: bottom },
    ];

}