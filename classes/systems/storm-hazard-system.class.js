// classes/systems/storm-hazard-system.class.js
import { TumbleweedHazard } from '../effects/tumbleweed-hazard.class.js';
import { VultureHazard } from '../effects/vulture-hazard.class.js'; // falls noch nicht vorhanden: Skeleton erstellen

/**
 * Spawner/Director für Storm-Hazards.
 * - hält alle Spawn-Logik + Lane/Speed-Random
 * - spawnt Subklassen (keine riesigen cfg Blöcke hier!)
 */
export class StormHazardSystem {
    constructor({ world, setup, canvas }) {
        this.world = world;
        this.setup = setup;
        this.canvas = canvas;

        this.enabled = true;

        // spawn timing
        this.nextSpawnAt = 0;
        this.minDelay = 900;
        this.maxDelay = 1600;

        // speed range (negativ = von rechts nach links)
        this.speedMin = -5; // -10
        this.speedMax = -10; // -22

        // lanes (relativ zu Character top/height)
        this.lanes = {
            HIGH: 0.18, // eher "über Kopf"
            MID: 0.40,  // duck-line
            LOW: 0.78,  // jump-line (bodennah)
        };

        // hazard pool = Funktionen (sauberer als Strings + if/else)
        this.pool = [
            (ctx) => this.spawnTumbleweed(ctx),
            (ctx) => this.spawnVulture(ctx),
        ];
    }

    update(timestamp) {
        if (!this.enabled) return;

        if (!this.nextSpawnAt) this.scheduleNext(timestamp);
        if (timestamp < this.nextSpawnAt) return;

        const ctx = this.buildSpawnContext();
        this.spawnRandom(ctx);

        this.scheduleNext(timestamp);
    }

    buildSpawnContext() {
        const camX = this.world.townLevelController?.renderCameraX ?? 0;
        const cw = this.canvas?.width ?? 1280;

        const laneKey = this.pickLaneKey();
        const y = this.computeLaneY(laneKey);

        const speedX = this.rand(this.speedMax, this.speedMin); // negatives
        const x = camX + cw + 220;

        return { x, y, speedX, laneKey };
    }

    scheduleNext(now) {
        const d = this.minDelay + Math.random() * (this.maxDelay - this.minDelay);
        this.nextSpawnAt = now + d;
    }

    spawnRandom(ctx) {
        if (!this.pool.length) return;
        const fn = this.pool[(Math.random() * this.pool.length) | 0];
        fn?.(ctx);
    }

    pickLaneKey() {
        // erstmal simple weights, später pro hazard unterscheiden:
        const r = Math.random();
        if (r < 0.45) return 'LOW';
        if (r < 0.80) return 'MID';
        return 'HIGH';
    }

    computeLaneY(laneKey) {
        const c = this.world.character;
        const hb = c?.getHitboxRect?.();
        const ground = hb ? hb.bottom : (c.y + c.height);

        switch (laneKey) {
            case "LOW": return ground - 160;   // bodennah → muss springen
            case "MID": return ground - 320;  // mittig → muss ducken
            case "HIGH": return ground - 380;  // hoch → einfach laufen
            default: return ground - 160;
        }
    }
    spawnTumbleweed({ x, y, speedX, laneKey }) {
        // laneMapping: LOW=jump, MID=duck, HIGH=safe (oder was du willst)
        const lane =
            laneKey === 'LOW' ? 'jump' :
                laneKey === 'MID' ? 'duck' :
                    'safe';

        return TumbleweedHazard.spawn(this.setup, { x, y, speedX, lane });
    }

    spawnVulture({ x, y, speedX, laneKey }) {
        // meistens MID/HIGH sinnvoll
        const lane =
            laneKey === 'LOW' ? 'duck' :
                laneKey === 'MID' ? 'duck' :
                    'safe';

        return VultureHazard.spawn(this.setup, { x, y, speedX, lane });
    }

    rand(a, b) {
        return a + Math.random() * (b - a);
    }
}