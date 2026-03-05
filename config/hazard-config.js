// config/hazard-config.js

// Zentrale Definitionen für alle Storm-Hazards
export const HAZARD_DEFS = {
    tumbleweed: {
        kind: 'tumbleweed',
        // Sprite-Größe & Boden-Offset
        size: { width: 220, height: 220, offsetBottom: 50 },
        // Hitbox-Offsets (Collision)
        offset: { top: 55, left: 58, right: 43, bottom: 50 },

        fps: 16,
        defaultLane: 'jump', // jump | duck | safe
        spawnOffsetX: 200,   // wie weit rechts vom Screen gespawnt wird

        getAnim(images) {
            return images.tumbleweed?.idle ?? images.tumbleweed?.roll;
        },

        laneY(setup, lane, size) {
            const c = setup.world.character;
            if (!c) return 485; // Fallback wie vorher

            // stabile Boden-Referenz, unabhängig von Pose/Hitbox
            const groundBottom =
                (typeof c.getGroundTopY === 'function')
                    ? (c.getGroundTopY() + c.height)
                    : (c.groundBottom ?? (c.y + c.height));

            const onGroundY = groundBottom - (size.height - (size.offsetBottom ?? 0));

            // Tumbleweed wird im System nur als LOW/jump benutzt -> immer Boden-Y
            return onGroundY;
        },

        laneSpeed(lane) {
            if (lane === 'jump') return -16;
            if (lane === 'duck') return -14;
            return -12;
        },

        timing: {
            telegraphMs: 200,
            activeMs: 9999,
            lifeMs: 4000,
        },

        hit: {
            hurtMs: 350,
            knockback: 12,
            impactSize: { width: 220, height: 220 },
            impactFps: 18,
            impactOffsetFactorY: 0.5,
            getImpactAnim(images) {
                return images.projectile?.fireball?.idleExplodeSheet ?? null;
            },
        },
    },

    woodenPlank: {
        kind: 'woodenPlank',
        size: { width: 150, height: 150, offsetBottom: 30 },
        offset: { top: 28, left: 25, right: 25, bottom: 30 },

        fps: 12,
        defaultLane: 'duck',
        spawnOffsetX: 240,

        getAnim(images) {
            return images.woodenPlank?.idle;
        },

        laneY(setup, lane, size) {
            const c = setup.world.character;
            const hb = c?.getHitboxRect?.();
            if (!hb) return 395; // dein walk-Test

            const DUCK_H = 110;
            const CLEAR = 10;

            const duckTop = hb.bottom - DUCK_H;
            const plankBottom = duckTop - CLEAR;

            return plankBottom - size.height + (size.offsetBottom ?? 0);
        },

        laneSpeed() {
            return -14;
        },

        lifeFromTravel({ canvasW, speedX }) {
            const sx = Math.abs(speedX || -14);
            const dist = canvasW + 800;
            const travelMs = (dist / Math.max(1, sx)) * (1000 / 60);
            const ms = travelMs + 300;
            return Math.max(2600, Math.min(5200, ms));
        },

        timing: {
            telegraphMs: 0,
            activeMs: 9999,
        },

        hit: {
            hurtMs: 280,
            knockback: 10,
            impactSize: { width: 220, height: 220 },
            impactFps: 18,
            impactOffsetFactorY: 0.55,
            getImpactAnim(images) {
                return images.projectile?.fireball?.idleExplodeSheet ?? null;
            },
        },
    },

    sandTornado: {
        kind: 'sandTornado',
        size: { width: 160, height: 160, offsetBottom: 22 },
        offset: { top: 22, left: 28, right: 30, bottom: 22 },

        fps: 12,
        defaultLane: 'jump',
        spawnOffsetX: 260,

        getAnim(images) {
            return images.sandTornado?.idle;
        },

        laneY(setup, lane, size) {
            const c = setup.world.character;
            if (!c) return 520;

            const groundBottom =
                (typeof c.getGroundTopY === 'function')
                    ? (c.getGroundTopY() + c.height)
                    : (c.groundBottom ?? (c.y + c.height));

            return groundBottom - (size.height - (size.offsetBottom ?? 0));
        },

        laneSpeed() {
            return -12;
        },

        lifeFromTravel({ canvasW, speedX }) {
            const sx = Math.abs(speedX || -12);
            const dist = canvasW + 900;
            const travelMs = (dist / Math.max(1, sx)) * (1000 / 60);
            const ms = travelMs + 400;
            return Math.max(3200, Math.min(5200, ms));
        },

        timing: {
            telegraphMs: 0,
            activeMs: 9999,
        },

        hit: {
            hurtMs: 320,
            knockback: 14,
            impactSize: { width: 220, height: 220 },
            impactFps: 18,
            impactOffsetFactorY: 0.55,
            getImpactAnim(images) {
                return images.projectile?.fireball?.idleExplodeSheet ?? null;
            },
        },
    },

    featherSwirl: {
        kind: 'featherSwirl',
        size: { width: 180, height: 180, offsetBottom: 40 },
        offset: { top: 30, left: 35, right: 30, bottom: 40 },

        fps: 14,
        defaultLane: 'duck',
        spawnOffsetX: 240,

        getAnim(images) {
            return images.featherSwirl?.idle;
        },

        laneY(setup, lane, size) {
            const c = setup.world.character;
            const hb = c?.getHitboxRect?.();
            if (!hb) {
                if (lane === 'safe') return 375 - 180;
                return 375;
            }

            const DUCK_H = 110;
            const CLEAR = 10;

            const duckTop = hb.bottom - DUCK_H;
            const hazardHitBottom = duckTop - CLEAR;
            const y = hazardHitBottom - size.height + (size.offsetBottom ?? 0);

            if (lane === 'safe') return y - 180;
            return y;
        },

        laneSpeed(lane) {
            if (lane === 'safe') return -14;
            return -18;
        },

        lifeFromTravel({ canvasW, speedX }) {
            const sx = Math.abs(speedX || -18);
            const dist = canvasW + 800;
            const travelMs = (dist / Math.max(1, sx)) * (1000 / 60);
            const ms = travelMs + 350;
            return Math.max(2200, Math.min(4200, ms));
        },

        timing: {
            telegraphMs: 0,
            activeMs: 9999,
        },

        hit: {
            hurtMs: 280,
            knockback: 10,
            impactSize: { width: 220, height: 220 },
            impactFps: 18,
            impactOffsetFactorY: 0.5,
            getImpactAnim(images) {
                return images.projectile?.fireball?.idleExplodeSheet ?? null;
            },
        },
    },

    eagle: {
        kind: 'eagle',
        size: { width: 300, height: 300, offsetBottom: 82 },
        offset: { top: 150, left: 85, right: 65, bottom: 82 },

        fps: 12,
        defaultLane: 'duck',
        spawnOffsetX: 260,

        getAnim(images) {
            return images.eagle?.idle;
        },

        laneY(setup, lane, size) {
            const c = setup.world.character;
            const hb = c?.getHitboxRect?.();
            if (!hb) {
                if (lane === 'duck') return 318;
                if (lane === 'jump') return 295 - 40;
                return 295 - 120;
            }

            const DUCK_H = 110;
            const CLEAR = 10;

            const duckTop = hb.bottom - DUCK_H;
            const bottom = duckTop - CLEAR;
            const y = bottom - size.height + (size.offsetBottom ?? 0);

            if (lane === 'safe') return y - 140;
            if (lane === 'jump') return y + 60;
            return y; // duck
        },

        laneSpeed(lane) {
            if (lane === 'safe') return -10;
            if (lane === 'jump') return -12;
            return -14;
        },

        lifeFromTravel({ canvasW, speedX }) {
            const sx = Math.abs(speedX || -14);
            const dist = canvasW + 800;
            const travelMs = (dist / Math.max(1, sx)) * (1000 / 60);
            const ms = travelMs + 350;
            return Math.max(2200, Math.min(5200, ms));
        },

        timing: {
            telegraphMs: 0,
            activeMs: 9999,
        },

        hit: {
            hurtMs: 320,
            knockback: 12,
            impactSize: { width: 220, height: 220 },
            impactFps: 18,
            impactOffsetFactorY: 0.5,
            getImpactAnim(images) {
                return images.projectile?.fireball?.idleExplodeSheet ?? null;
            },
        },
    },
    coat: {
        kind: 'coat',
        size: { width: 180, height: 180, offsetBottom: 50 },
        offset: { top: 10, left: 30, right: 18, bottom: 50 },

        fps: 12,
        defaultLane: 'safe',
        // LOW (jump) + HIGH (walk/safe)
        allowedLanes: ['duck', 'safe'],
        spawnOffsetX: 220,

        getAnim(images) {
            // ggf. Namen anpassen (coat / jacket / trenchCoat ...)
            return images.coat?.idle ?? images.coat?.float ?? null;
        },

        laneY(setup, lane, size) {
            // Basis-Werte aus deinem Test
            const WALK_Y = 385; // safe / walk
            const DUCK_Y = 406; // duck

            // Wie weit der Mantel maximal höher fliegen darf
            const MAX_UP_SAFE = 40; // px über WALK_Y
            const MAX_UP_DUCK = 24; // px über DUCK_Y

            if (lane === 'duck') {
                // Basis: 406, gelegentlich etwas höher (kleinere Y)
                const up = Math.random() * MAX_UP_DUCK;
                return DUCK_Y - up;      // 406 bis 382
            }

            // safe / walk:
            // Basis: 385, gelegentlich etwas höher
            const up = Math.random() * MAX_UP_SAFE;
            return WALK_Y - up;          // 385 bis 345
        },

        laneSpeed(lane) {
            // etwas langsamer als tumbleweed, damit "flatteriger" wirkt
            if (lane === 'safe') return -10;
            return -12;
        },

        lifeFromTravel({ canvasW, speedX }) {
            const sx = Math.abs(speedX || -12);
            const dist = canvasW + 800;
            const travelMs = (dist / Math.max(1, sx)) * (1000 / 60);
            const ms = travelMs + 350;
            return Math.max(2200, Math.min(5200, ms));
        },

        timing: {
            telegraphMs: 0,
            activeMs: 9999,
        },

        hit: {
            hurtMs: 260,
            knockback: 8,
            impactSize: { width: 220, height: 220 },
            impactFps: 18,
            impactOffsetFactorY: 0.5,
            getImpactAnim(images) {
                // du kannst auch eine eigene kleine Staubwolke nehmen
                return images.projectile?.fireball?.idleExplodeSheet ?? null;
            },
        },
    }

};