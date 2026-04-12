/**
 * @typedef {Object} HazardAnimParams
 * @property {*} images Bild-Registry der Entities.
 */

/**
 * @typedef {Object} HazardLaneYParams
 * @property {*} setup Hazard-Setup.
 * @property {string} lane Ziel-Lane.
 * @property {{width:number,height:number,offsetBottom?:number}} size Hazard-Größe.
 */

/**
 * @typedef {Object} HazardLaneSpeedParams
 * @property {string} lane Ziel-Lane.
 */

/**
 * @typedef {Object} HazardLifeParams
 * @property {number} canvasW Canvas-Breite in Pixeln.
 * @property {number} speedX Horizontale Hazard-Geschwindigkeit.
 */

export const HAZARD_DEFS = {
    tumbleweed: {
        kind: 'tumbleweed',
        size: { width: 220, height: 220, offsetBottom: 50 },
        offset: { top: 55, left: 58, right: 43, bottom: 50 },
        fps: 16,
        defaultLane: 'jump',
        spawnOffsetX: 200,

        /** @param {HazardAnimParams} params */
        getAnim({ images }) {
            return images.tumbleweed?.idle ?? null;
        },

        /** @param {HazardLaneYParams} params */
        laneY({ setup, size }) {
            const c = setup.world.character;
            if (!c) return 485;
            const groundBottom =
                (typeof c.getGroundTopY === 'function')
                    ? (c.getGroundTopY() + c.height)
                    : (c.groundBottom ?? (c.y + c.height));
            const onGroundY = groundBottom - (size.height - (size.offsetBottom ?? 0));
            return onGroundY;
        },

        /** @param {HazardLaneSpeedParams} params */
        laneSpeed({ lane }) {
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
            damage: 10,
            protectDamage: 5,
            invulnMs: 700,
            hurtMs: 350,
            knockback: 12,
            impactSize: { width: 220, height: 220 },
            impactFps: 18,
            impactOffsetFactorY: 0.5,

            /** @param {HazardAnimParams} params */
            getImpactAnim({ images }) {
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

        /** @param {HazardAnimParams} params */
        getAnim({ images }) {
            return images.woodenPlank?.idle ?? null;
        },

        /** @param {HazardLaneYParams} params */
        laneY({ setup, size }) {
            const c = setup.world.character;
            const hb = c?.getHitboxRect?.();
            if (!hb) return 395;
            const DUCK_H = 110;
            const CLEAR = 10;
            const duckTop = hb.bottom - DUCK_H;
            const plankBottom = duckTop - CLEAR;
            return plankBottom - size.height + (size.offsetBottom ?? 0);
        },

        laneSpeed() {
            return -14;
        },

        /** @param {HazardLifeParams} params */
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
            damage: 10,
            protectDamage: 5,
            invulnMs: 700,
            hurtMs: 280,
            knockback: 10,
            impactSize: { width: 220, height: 220 },
            impactFps: 18,
            impactOffsetFactorY: 0.55,

            /** @param {HazardAnimParams} params */
            getImpactAnim({ images }) {
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

        /** @param {HazardAnimParams} params */
        getAnim({ images }) {
            return images.sandTornado?.idle ?? null;
        },

        /** @param {HazardLaneYParams} params */
        laneY({ setup, size }) {
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

        /** @param {HazardLifeParams} params */
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
            damage: 10,
            protectDamage: 5,
            invulnMs: 700,
            hurtMs: 320,
            knockback: 14,
            impactSize: { width: 220, height: 220 },
            impactFps: 18,
            impactOffsetFactorY: 0.55,

            /** @param {HazardAnimParams} params */
            getImpactAnim({ images }) {
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

        /** @param {HazardAnimParams} params */
        getAnim({ images }) {
            return images.featherSwirl?.idle ?? null;
        },

        /** @param {HazardLaneYParams} params */
        laneY({ setup, lane, size }) {
            const c = setup.world.character;
            const hb = c?.getHitboxRect?.();
            if (!hb) return lane === 'safe' ? 375 - 180 : 375;
            const DUCK_H = 110;
            const CLEAR = 10;
            const duckTop = hb.bottom - DUCK_H;
            const hazardHitBottom = duckTop - CLEAR;
            const y = hazardHitBottom - size.height + (size.offsetBottom ?? 0);
            return lane === 'safe' ? y - 180 : y;
        },

        /** @param {HazardLaneSpeedParams} params */
        laneSpeed({ lane }) {
            if (lane === 'safe') return -14;
            return -18;
        },

        /** @param {HazardLifeParams} params */
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
            damage: 10,
            protectDamage: 5,
            invulnMs: 700,
            hurtMs: 280,
            knockback: 10,
            impactSize: { width: 220, height: 220 },
            impactFps: 18,
            impactOffsetFactorY: 0.5,

            /** @param {HazardAnimParams} params */
            getImpactAnim({ images }) {
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

        /** @param {HazardAnimParams} params */
        getAnim({ images }) {
            return images.eagle?.idle ?? null;
        },

        /** @param {HazardLaneYParams} params */
        laneY({ setup, lane, size }) {
            const c = setup.world.character;
            const hb = c?.getHitboxRect?.();
            if (!hb) return lane === 'duck' ? 318 : lane === 'jump' ? 255 : 175;
            const DUCK_H = 110;
            const CLEAR = 10;
            const y = hb.bottom - DUCK_H - CLEAR - size.height + (size.offsetBottom ?? 0);
            if (lane === 'safe') return y - 140;
            if (lane === 'jump') return y + 60;
            return y;
        },

        /** @param {HazardLaneSpeedParams} params */
        laneSpeed({ lane }) {
            if (lane === 'safe') return -10;
            if (lane === 'jump') return -12;
            return -14;
        },

        /** @param {HazardLifeParams} params */
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
            damage: 10,
            protectDamage: 5,
            invulnMs: 700,
            hurtMs: 320,
            knockback: 12,
            impactSize: { width: 220, height: 220 },
            impactFps: 18,
            impactOffsetFactorY: 0.5,

            /** @param {HazardAnimParams} params */
            getImpactAnim({ images }) {
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
        allowedLanes: ['duck', 'safe'],
        spawnOffsetX: 220,

        /** @param {HazardAnimParams} params */
        getAnim({ images }) {
            return images.coat?.idle ?? null;
        },

        /** @param {HazardLaneYParams} params */
        laneY({ lane }) {
            const WALK_Y = 385;
            const DUCK_Y = 406;
            const MAX_UP_SAFE = 40;
            const MAX_UP_DUCK = 24;
            if (lane === 'duck') {
                const up = Math.random() * MAX_UP_DUCK;
                return DUCK_Y - up;
            }
            const up = Math.random() * MAX_UP_SAFE;
            return WALK_Y - up;
        },

        /** @param {HazardLaneSpeedParams} params */
        laneSpeed({ lane }) {
            if (lane === 'safe') return -10;
            return -12;
        },

        /** @param {HazardLifeParams} params */
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
            damage: 10,
            protectDamage: 5,
            invulnMs: 700,
            hurtMs: 260,
            knockback: 8,
            impactSize: { width: 220, height: 220 },
            impactFps: 18,
            impactOffsetFactorY: 0.5,

            /** @param {HazardAnimParams} params */
            getImpactAnim({ images }) {
                return images.projectile?.fireball?.idleExplodeSheet ?? null;
            },
        },
    }
};