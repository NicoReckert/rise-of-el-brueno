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
    }

    /** Aktivieren */
    start() {
        this.active = true;
        this.pulse = 0;
        this.rings = [];
        this.particles = [];
    }

    /** Deaktivieren */
    stop() {
        this.active = false;
        this.rings = [];
        this.particles = [];
    }

    update(x, y, timestamp) {
        if (!this.active) return;

        // --- Pulsieren ---
        this.pulse = Math.sin(timestamp * this.pulseSpeed) * 15;

        // --- Dynamischer Radius ---
        this.dynamicOffset =
            Math.sin(timestamp * 0.002) * 6 +
            Math.sin(timestamp * 0.005) * 3;

        // --- Kraftwellen + Shockwave ---
        if (timestamp - this.ringTimer > 350) {
            this.rings.push({ radius: this.getDynamicRadius(), alpha: 0.6 });

            if (this.onShockwave) this.onShockwave();

            this.ringTimer = timestamp;
        }

        // --- Kraftwellen expandieren ---
        this.rings.forEach(r => {
            r.radius += 4;
            r.alpha -= 0.01;
        });
        this.rings = this.rings.filter(r => r.alpha > 0);

        // --- Partikel ---
        for (let i = 0; i < 3; i++) {
            this.particles.push({
                angle: Math.random() * Math.PI * 2,
                dist: this.getDynamicRadius(),
                speed: 1 + Math.random() * 2,
                alpha: 0.8
            });
        }

        this.particles.forEach(p => {
            p.dist += p.speed;
            p.alpha -= 0.02;
        });
        this.particles = this.particles.filter(p => p.alpha > 0);

        // Flimmern im Schild – bewegt den Clip minimal
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