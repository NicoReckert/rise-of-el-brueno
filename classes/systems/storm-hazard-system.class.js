// classes/systems/storm-hazard-system.class.js
// einfache Difficulty-Profile für das Storm-Hazard-System
const DIFFICULTY_PROFILES = {
    normal: {
        minDelay: 1100,
        maxDelay: 1800,
        maxActiveHazards: 4,
        laneWeights: { LOW: 0.45, MID: 0.35, HIGH: 0.20 },
        multiSpawnChance: 0,
    },
    hard: {
        // deutlich dichter, aber noch nicht unfair
        minDelay: 600,
        maxDelay: 1000,
        maxActiveHazards: 6,
        laneWeights: { LOW: 0.58, MID: 0.27, HIGH: 0.15 },
        multiSpawnChance: 0.35,
    },
};

import { StormHazard } from '../effects/storm-hazard.class.js';

export class StormHazardSystem {
    constructor({ world, setup, canvas }) {
        this.world = world;
        this.setup = setup;
        this.canvas = canvas;

        this.enabled = false;

        // speed range (negativ = von rechts nach links) – bleibt global
        this.speedMin = -6;   // langsamste
        this.speedMax = -14;  // schnellste

        // Standard-Einstellungen (werden gleich vom Profil überschrieben)
        this.minDelay = 1100;
        this.maxDelay = 1800;
        this.maxActiveHazards = 4;

        // Lane-Gewichte (werden auch vom Profil gesetzt)
        this.laneWeights = { LOW: 0.45, MID: 0.35, HIGH: 0.20 };

        // direkt mit "normal" starten
        this.difficulty = 'normal';
        this.applyDifficultyProfile(DIFFICULTY_PROFILES[this.difficulty]);

        // interne Lane-Typen des Systems
        this.lanes = {
            LOW: 'jump',  // bodennah -> springen
            MID: 'duck',  // mittel -> ducken
            HIGH: 'safe', // hoch -> safe
        };

        // Pool der Hazard-Typen – kann man jederzeit erweitern
        this.pool = [
            (ctx) => this.spawnHazard('tumbleweed', ctx),
            (ctx) => this.spawnHazard('sandTornado', ctx),
            (ctx) => this.spawnHazard('featherSwirl', ctx),
            (ctx) => this.spawnHazard('eagle', ctx),
            (ctx) => this.spawnHazard('woodenPlank', ctx),
            (ctx) => this.spawnHazard('coat', ctx)
        ];

        this.lastLaneKey = null;
        this.lastSpawnAt = 0;

        this.lastDangerLane = null;
        this.dangerLockUntil = 0;
        this.dangerLockMs = 1100;

        this.nextSpawnAt = 0;
        this.multiSpawnChance = 0;
    }

    /**
 * Von außen aufrufbar, z.B. aus deinem Positions-Event:
 * world.stormHazardSystem.setDifficulty('hard');
 */
    setDifficulty(name) {
        const profile = DIFFICULTY_PROFILES[name];
        if (!profile) {
            console.warn('[StormHazardSystem] Unknown difficulty:', name);
            return;
        }
        this.difficulty = name;
        this.applyDifficultyProfile(profile);
    }

    applyDifficultyProfile(profile) {
        if (!profile) return;

        this.minDelay = profile.minDelay ?? this.minDelay;
        this.maxDelay = profile.maxDelay ?? this.maxDelay;
        this.maxActiveHazards = profile.maxActiveHazards ?? this.maxActiveHazards;
        this.multiSpawnChance = profile.multiSpawnChance ?? this.multiSpawnChance;

        // Lane-Gewichte übernehmen (für pickLaneKey)
        if (profile.laneWeights) {
            this.laneWeights = {
                LOW: profile.laneWeights.LOW ?? this.laneWeights.LOW,
                MID: profile.laneWeights.MID ?? this.laneWeights.MID,
                HIGH: profile.laneWeights.HIGH ?? this.laneWeights.HIGH,
            };
        }
    }

    update(timestamp) {
        if (!this.enabled) return;

        // zu viele aktive Hazards? kurz Pause
        const active = this.setup.effects.filter(
            (e) => e instanceof StormHazard && !e.markedForRemoval
        );
        if (active.length >= this.maxActiveHazards) return;

        if (!this.nextSpawnAt) {
            this.scheduleNext(timestamp);
        }
        if (timestamp < this.nextSpawnAt) return;

        const ctx = this.buildSpawnContext(timestamp);

        // SAFETY: falls Lane durch Lock oder Randbedingungen ungültig
        if (!ctx.laneKey) {
            this.scheduleNext(timestamp);
            return;
        }

        this.spawnRandom(ctx);

        if (this.multiSpawnChance > 0 && Math.random() < this.multiSpawnChance) {
            // zweite Lane wählen – darf gerne anders sein als die erste
            const laneKey2 = this.pickLaneKey(timestamp);

            // einfache Safety: nicht exakt gleiche Lane + Typ-Kombination erzwingen
            if (laneKey2 && laneKey2 !== ctx.laneKey) {
                const ctx2 = {
                    ...ctx,
                    laneKey: laneKey2,
                    // leicht nach hinten versetzt, damit man noch reagieren kann
                    x: ctx.x + 140,
                };
                this.spawnRandom(ctx2);
            }
        }

        if (ctx.laneKey === 'LOW' || ctx.laneKey === 'MID') {
            this.lastDangerLane = ctx.laneKey;
            this.dangerLockUntil = timestamp + this.dangerLockMs;
        }

        this.lastLaneKey = ctx.laneKey;
        this.lastSpawnAt = timestamp;

        this.scheduleNext(timestamp);
    }

    buildSpawnContext(now) {
        const camX = this.world.townLevelController?.renderCameraX ?? 0;
        const cw = this.canvas?.width ?? 1280;

        const laneKey = this.pickLaneKey(now);

        const speedX = this.rand(this.speedMin, this.speedMax);
        const x = camX + cw + this.getSpawnLeadPx(Math.abs(speedX), laneKey);

        return { x, speedX, laneKey };
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

    /**
     * Spawnt einen Hazard-Typ über das generische StormHazard-System.
     * type: 'tumbleweed' | 'sandTornado' | 'featherSwirl' | 'eagle' | 'woodenPlank'
     */
    spawnHazard(type, { x, speedX, laneKey }) {
        // Eagle nie LOW
        if (type === 'eagle' && laneKey === 'LOW') {
            return;
        }

        // FeatherSwirl nie LOW
        if (type === 'featherSwirl' && laneKey === 'LOW') {
            return;
        }

        // Tumbleweed NUR LOW (Jump-Hazard)
        if (type === 'tumbleweed' && laneKey !== 'LOW') {
            return;
        }

        // Coat nur MID (duck) oder HIGH (safe), nie LOW (jump)
        if (type === 'coat' && laneKey === 'LOW') {
            return;
        }

        // LaneKey -> konkrete Lane
        let lane = 'safe';
        if (laneKey === 'LOW') lane = 'jump';
        else if (laneKey === 'MID') lane = 'duck';

        StormHazard.spawn(this.setup, type, { x, speedX, lane });
    }

    pickLaneKey(now) {
        const locked = now < (this.dangerLockUntil ?? 0);
        const last = this.lastDangerLane;

        const weights = this.laneWeights || { LOW: 0.45, MID: 0.35, HIGH: 0.20 };
        const pLow = weights.LOW;
        const pMidCum = pLow + weights.MID; // kumuliert (LOW + MID)

        const roll = () => {
            const r = Math.random();
            if (r < pLow) return 'LOW';
            if (r < pMidCum) return 'MID';
            return 'HIGH';
        };

        if (locked && (last === 'LOW' || last === 'MID')) {
            // keine direkt wechselnden "LOW -> MID" oder "MID -> LOW" Kombos
            for (let i = 0; i < 6; i++) {
                const k = roll();
                if (k === 'HIGH') return 'HIGH';
                if (last === 'LOW' && k === 'LOW') return 'LOW';
                if (last === 'MID' && k === 'MID') return 'MID';
            }
            return 'HIGH';
        }

        return roll();
    }

    // Lead abhängig von Lane (mehr Zeit für gefährliche Lanes)
    getSpawnLeadPx(speedAbs, laneKey) {
        let reactionMs = 520; // Basis
        if (laneKey === 'LOW' || laneKey === 'MID') {
            // mehr Reaktionszeit für echte Gefahren
            reactionMs += 200;
        }

        const frames = reactionMs / (1000 / 60);
        const lead = speedAbs * frames;
        return Math.max(260, lead);
    }

    // einfache Random-Hilfe, funktioniert auch mit "verkehrten" min/max
    rand(min, max) {
        return min + Math.random() * (max - min);
    }
}