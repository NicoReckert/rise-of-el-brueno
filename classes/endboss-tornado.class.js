import { MovableObject } from './movable-object.class.js';

export class EndbossTornado extends MovableObject {
    constructor(entityImages, x, y, allAudios) {
        super();
        this.entityImages = entityImages;
        this.allAudios = allAudios;
        this.lastUpdateTime = 0;
        this.deltaTime = 0;
        this.x = x;
        this.y = y;

        this.groundY = y;           // Tornado bleibt auf diesem Y
        this.width = 360;
        this.height = 460;

        this.speed = 10;            // Bewegung zum Target / zur Build-Position
        this.liftSpeed = 2.2;       // wie schnell Brünö hoch geht (langsam)
        this.state = "SEEK";

        this.target = null;
        this.captured = false;
        this.isFinished = false;

        // Zielposition fürs “Bauen”
        this.buildX = x;            // wird später gesetzt
        this.buildYHero = 135;      // Zielhöhe für Brünö

        // Wiggle
        this.wiggleStart = 0;
        this.wiggleDuration = 1200; // ms
        this.wiggleAmp = 25;

        // Animation (WICHTIG: images sind Image-Objekte)
        this.frameIndex = 0;
        this.lastFrameTime = 0;
        this.frameInterval = 1000 / 10;

        this.images = this.entityImages.endboss?.tornadoAttack || [];
        this.img = this.images[0] || null;

        this.releaseStart = 0;
        this.releaseDuration = 600; // ms
        this.opacity = 1;           // World.addToWorld nutzt opacity schon ✅

    }

    setTarget(character) {
        this.target = character;
    }

    setBuildTargetX(x) {
        this.buildX = x;
    }

    hasCaptured(character) {
        return this.captured && this.target === character;
    }

    updateState(timestamp) {
        if (this.isFinished) return;
        this.updateDeltaTime(timestamp);

        // Tornado soll NICHT nach oben wandern:
        this.y = this.groundY;

        switch (this.state) {
            case "SEEK": this.seekTarget(); break;
            case "LIFT": this.liftTarget(); break;
            case "MOVE_TO_BUILD": this.moveToBuildSpot(timestamp); break;
            case "BUILD": this.buildPedestal(timestamp); break;
            case "RELEASE": this.releaseTarget(timestamp); break;
        }

        this.updateAnimation(timestamp);
    }

    seekTarget() {
        if (!this.target) return;

        const tx = this.target.x + this.target.width * 0.5;
        const cx = this.x + this.width * 0.5;

        const dx = tx - cx;
        const absDx = Math.abs(dx);

        // ✅ 60 FPS-Basis: speed = px pro 60FPS-Frame
        const dt60 = (this.deltaTime ?? 1 / 60) * 60;
        const maxStep = this.speed * dt60;
        const step = Math.min(absDx, maxStep);

        this.x += Math.sign(dx) * step;

        // capture über isCollidingBefore wie gehabt
        if (this.isCollidingBefore(this.target, 0, 0)) {
            this.captured = true;
            this.state = "LIFT";

            this.target.isCapturedByTornado = true;
            this.target.speedY = 0;
        }
    }


    liftTarget() {
        if (!this.target) return;

        const targetHeroY = this.buildYHero;

        // ✅ 60 FPS-Basis
        const dt60 = (this.deltaTime ?? 1 / 60) * 60;
        const dy = this.liftSpeed * dt60;

        // langsam nach oben ziehen, aber nicht unter targetHeroY
        this.target.y = Math.max(targetHeroY, this.target.y - dy);

        // Brünö im Tornado zentrieren
        this.target.x = this.x + this.width * 0.35;

        // Wenn Brünö oben genug ist -> Tornado wandert zur Build-X
        if (this.target.y <= targetHeroY + 1) {
            this.state = "MOVE_TO_BUILD";
        }
    }


    moveToBuildSpot(timestamp) {
        if (!this.target) return;

        const reached = this.moveToCenterX(this.buildX);

        // Bruno festhalten (wichtig: konstant, kein drifting)
        this.target.x = this.x + this.width * 0.35;
        this.target.y = this.buildYHero;

        if (reached) {
            // exakt snappen
            this.x = this.buildX - this.width * 0.5;
            this.state = "BUILD";
            this.wiggleStart = timestamp; // besser timestamp statt performance.now()
        }
    }


    buildPedestal(timestamp) {
        if (!this.target) return;

        const t = Math.min(1, (timestamp - this.wiggleStart) / this.wiggleDuration);

        // 🌪️ Wiggle links/rechts
        const wiggle = Math.sin(t * Math.PI * 6) * this.wiggleAmp;
        const baseX = this.buildX - this.width * 0.5;
        this.x = baseX + wiggle;

        // 🧍 Brünö fixiert halten
        this.target.x = this.x + this.width * 0.35;
        this.target.y = this.buildYHero;

        // 🪨 Podest holen (einmal sauber)
        const pedestal =
            this.world?.townLevelSetup?.environment?.rockyDesertPedestal ?? null;

        // ✅ Phase 1: Podest aktivieren (nur einmal)
        if (!this.pedestalSpawned && t > 0.35 && pedestal) {
            this.pedestalSpawned = true;

            pedestal.x = this.buildX - pedestal.width * 0.5;
            pedestal.y = 300; // dein Podest-Y
            pedestal.opacity = 0; // sicherheitshalber
        }

        // ✅ Phase 2: Podest EINBLENDEN (JEDEN FRAME)
        if (this.pedestalSpawned && pedestal) {
            pedestal.opacity = Math.min(1, pedestal.opacity + 0.03);
        }

        // ✅ Ende der Build-Phase
        if (t >= 1) {
            this.state = "RELEASE";
            this.releaseStart = timestamp;
            this.target.y = 165;
            this.target.yNormal = 165;
            this.target.yVoidless = 282;
            this.target.isCapturedByTornado = false;
            return;
        }
    }


    releaseTarget(timestamp) {
        // Safety
        if (!this.target) {
            this.isFinished = true;
            return;
        }

        // 1) Nur 1x initialisieren
        if (!this.releaseStart) {
            this.releaseStart = timestamp;

            // ✅ Bruno loslassen
            this.target.isCapturedByTornado = false;
            this.captured = false;

            // ✅ Tornado Fade-Start
            this.opacity = (this.opacity ?? 1);
        }

        // 2) Ab hier: Bruno NICHT mehr anfassen!
        const duration = this.releaseDuration ?? 600;
        const t = Math.min(1, (timestamp - this.releaseStart) / duration);
        this.opacity = 1 - t;

        // 3) Ende -> entfernen
        if (t >= 1) {
            this.opacity = 0;
            this.isFinished = true;
        }
    }

    updateAnimation(timestamp) {
        if (!this.images || this.images.length === 0) return;
        if (!this.lastFrameTime) this.lastFrameTime = timestamp;
        const dt = timestamp - this.lastFrameTime;
        if (dt <= this.frameInterval) return;

        this.img = this.images[this.frameIndex % this.images.length];
        this.frameIndex++;
        this.lastFrameTime = timestamp;
    }

    moveToCenterX(targetCenterX) {
        const centerX = this.x + this.width * 0.5;
        const dx = targetCenterX - centerX;
        const absDx = Math.abs(dx);

        const dt60 = (this.deltaTime ?? 1 / 60) * 60;
        const maxStep = this.speed * dt60;
        const step = Math.min(absDx, maxStep);

        this.x += Math.sign(dx) * step;

        // "angekommen", wenn der Rest kleiner als ein Schritt ist
        return absDx <= maxStep;
    }

}

