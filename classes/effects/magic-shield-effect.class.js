export class MagicShieldEffect {
    constructor(canvas) {
        this.canvas = canvas;
        this.active = false;

        this.radius = 230;
        this.pulse = 0;
        this.pulseSpeed = 0.03;

        this.ringTimer = 0;
        this.rings = [];

        this.particles = [];

        this.lastTime = 0;          // ⬅ neu
        this.spawnAccumulator = 0;  // ⬅ neu (für Partikel-Rate)
    }

    /** Aktivieren */
    start() {
        this.active = true;
        this.pulse = 0;
        this.rings = [];
        this.particles = [];
        this.lastTime = 0;          // ⬅ wichtig: zurücksetzen
        this.spawnAccumulator = 0;
    }

    /** Deaktivieren */
    stop() {
        this.active = false;
        this.rings = [];
        this.particles = [];
    }

    update(x, y, timestamp) {
        if (!this.active) return;

        // === Delta-Zeit in Sekunden ===
        if (!this.lastTime) this.lastTime = timestamp;
        const dt = (timestamp - this.lastTime) / 1000; // Sekunden
        this.lastTime = timestamp;

        // --- Pulsieren (war schon zeitbasiert) ---
        this.pulse = Math.sin(timestamp * this.pulseSpeed) * 15;

        // --- Dynamischer Radius (war auch zeitbasiert) ---
        this.dynamicOffset =
            Math.sin(timestamp * 0.002) * 6 +
            Math.sin(timestamp * 0.005) * 3;

        // --- Kraftwellen + Shockwave (bereits zeitbasiert) ---
        if (timestamp - this.ringTimer > 350) {
            this.rings.push({ radius: this.getDynamicRadius(), alpha: 0.6 });

            if (this.onShockwave) this.onShockwave();

            this.ringTimer = timestamp;
        }

        // === Geschwindigkeiten so gewählt, dass es bei ~60 FPS wie vorher aussieht ===
        const ringRadiusSpeedPerSec = 4 * 60;   // vorher: +4 pro Frame → 4 * 60
        const ringAlphaFadePerSec  = 0.01 * 60; // vorher: -0.01 pro Frame → 0.6 / Sek

        // --- Kraftwellen expandieren (fps-unabhängig) ---
        this.rings.forEach(r => {
            r.radius += ringRadiusSpeedPerSec * dt;
            r.alpha  -= ringAlphaFadePerSec  * dt;
        });
        this.rings = this.rings.filter(r => r.alpha > 0);

        // === Partikel-Spawn zeitbasiert ===
        // vorher: 3 Partikel pro Frame → bei 60 FPS ≈ 180 / Sekunde
        const particlesPerSecond = 3 * 60;
        this.spawnAccumulator += particlesPerSecond * dt;

        while (this.spawnAccumulator >= 1) {
            // p.speed war vorher "pro Frame": 1..3
            // → jetzt "pro Sekunde": * 60
            const baseSpeedPerFrame = 1 + Math.random() * 2;
            const speedPerSec = baseSpeedPerFrame * 60;

            this.particles.push({
                angle: Math.random() * Math.PI * 2,
                dist: this.getDynamicRadius(),
                speed: speedPerSec,
                alpha: 0.8
            });

            this.spawnAccumulator -= 1;
        }

        // === Partikelbewegung zeitbasiert ===
        // vorher: p.dist += p.speed (1..3 pro Frame)
        //         p.alpha -= 0.02 pro Frame → 0.02 * 60 = 1.2 / Sekunde
        const particleAlphaFadePerSec = 0.02 * 60;

        this.particles.forEach(p => {
            p.dist  += p.speed * dt;
            p.alpha -= particleAlphaFadePerSec * dt;
        });
        this.particles = this.particles.filter(p => p.alpha > 0);

        // Flimmern im Schild – bleibt exakt wie vorher
        this.clipJitterX = Math.sin(timestamp * 0.004) * 4;
        this.clipJitterY = Math.cos(timestamp * 0.003) * 4;
    }

    draw(ctx, x, y) {
        if (!this.active) return;

        ctx.save();
        ctx.globalCompositeOperation = "lighter";

        // --- Lichtstrahl vom Stein ---
        const gradBeam = ctx.createLinearGradient(x, y - 80, x, 0);
        gradBeam.addColorStop(0, "rgba(80,180,255,0.07)");
        gradBeam.addColorStop(1, "rgba(80,180,255,0)");
        ctx.fillStyle = gradBeam;
        ctx.fillRect(x - 25, 0, 50, y);

        // --- Glow ---
        const glow = ctx.createRadialGradient(
            x, y, this.getDynamicRadius() * 0.2,
            x, y, this.getDynamicRadius() * 1.05
        );
        glow.addColorStop(0, "rgba(0,160,255,0.08)");
        glow.addColorStop(1, "rgba(0,160,255,0)");

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, this.getDynamicRadius() + this.pulse + this.dynamicOffset, 0, Math.PI * 2);
        ctx.fill();

        // --- Kraftwellen ---
        this.rings.forEach(r => {
            ctx.strokeStyle = `rgba(120,200,255,${r.alpha * 0.4})`;
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.arc(x, y, r.radius, 0, Math.PI * 2);
            ctx.stroke();
        });

        // --- Partikel ---
        this.particles.forEach(p => {
            const px = x + Math.cos(p.angle) * p.dist;
            const py = y + Math.sin(p.angle) * p.dist;

            ctx.fillStyle = `rgba(120,200,255,${p.alpha})`;
            ctx.beginPath();
            ctx.arc(px, py, 4, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.restore();
    }

    getDynamicRadius() {
        return this.radius + this.pulse + this.dynamicOffset;
    }
}
