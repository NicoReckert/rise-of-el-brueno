// classes/effects/storm-hazard.class.js
import { MovableObject } from '../systems/movable-object.class.js';
import { ImpactEffect } from './impact-effect.class.js';
import { HAZARD_DEFS } from '../../config/hazard-config.js';

export class StormHazard extends MovableObject {
    constructor(setup, cfg = {}) {
        super();
        this.setup = setup;

        this.type = cfg.type ?? 'hazard';
        this.def = cfg.def ?? null;

        this.kind = cfg.kind ?? 'hazard';
        this.anim = cfg.anim;
        this.animName = cfg.animName ?? 'idle';
        this.fps = cfg.fps ?? 10;

        this.x = cfg.x ?? 0;
        this.y = cfg.y ?? 0;
        this.width = cfg.width ?? 200;
        this.height = cfg.height ?? 200;
        this.speedX = cfg.speedX ?? -10;

        this.offset = cfg.offset ?? { top: 0, left: 0, right: 0, bottom: 0 };

        this.telegraphMs = cfg.telegraphMs ?? 0;
        this.activeMs = cfg.activeMs ?? 900;
        this.lifeMs = cfg.lifeMs ?? 2000;

        this.spawnTime = performance.now();
        this.activeFrom = this.spawnTime + this.telegraphMs;
        this.activeUntil = this.activeFrom + this.activeMs;
        this.dieAt = this.spawnTime + this.lifeMs;

        this.currentAnimation = this.animName;
        this.frameInterval = 1000 / this.fps;
        this.frameIndex = 0;
        this.sheetIndex = 0;
        this.lastFrameTime = 0;

        this.markedForRemoval = false;
    }

    // Zentrale Spawn-Funktion für ALLE Hazard-Typen
    static spawn(setup, type, { x, y, lane = 'safe', speedX, seed } = {}) {
        const def = HAZARD_DEFS[type];
        if (!def) {
            console.warn('[StormHazard] Unknown type:', type);
            return null;
        }

        if (def.allowedLanes && !def.allowedLanes.includes(lane)) {
            // auf definierte Standard-Lane oder erste erlaubte Lane zurückfallen
            lane = def.defaultLane ?? def.allowedLanes[0] ?? 'safe';
        }

        const world = setup.world;
        const camX = world.townLevelController?.renderCameraX ?? 0;
        const canvasW = world.canvas?.width ?? 1280;

        const size = def.size;
        const anim = def.getAnim(setup.entityImages);
        const finalSpeedX = speedX ?? (def.laneSpeed ? def.laneSpeed(lane) : -10);
        const finalX = x ?? (camX + canvasW + (def.spawnOffsetX ?? 240));
        const finalY = y ?? (def.laneY ? def.laneY(setup, lane, size) : (world.character?.y ?? 0));

        let lifeMs = def.timing?.lifeMs ?? 4000;
        if (typeof def.lifeFromTravel === 'function') {
            lifeMs = def.lifeFromTravel({ canvasW, speedX: finalSpeedX });
        }

        const telegraphMs = def.timing?.telegraphMs ?? 0;
        const activeMs = def.timing?.activeMs ?? 9999;

        const hazard = new StormHazard(setup, {
            type,
            def,
            kind: def.kind ?? type,
            anim,
            animName: 'idle',
            fps: def.fps ?? 12,

            x: finalX,
            y: finalY,
            width: size.width,
            height: size.height,
            speedX: finalSpeedX,

            telegraphMs,
            activeMs,
            lifeMs,

            offset: { ...(def.offset ?? {}) },

            seed,
        });

        setup.effects.push(hazard);
        return hazard;
    }

    updateState(timestamp) {
        if (this.markedForRemoval) return;

        this.updateDeltaTime(timestamp);

        const dt60 = (this.deltaTime ?? 1 / 60) * 60;
        this.x += (this.speedX ?? 0) * dt60;

        if (timestamp >= this.dieAt) {
            this.markedForRemoval = true;
            return;
        }

        this.updateAnimation(timestamp);

        if (timestamp < this.activeFrom || timestamp > this.activeUntil) return;

        const char = this.setup?.world?.character;
        if (!char) return;

        if (this.isColliding(char,
            { x: 0, y: 0, width: 0, height: 0 },
            { x: 0, y: 0, width: 0, height: 0 }
        )) {
            this.onHitCharacter(char, this.setup, timestamp);
        }
    }

    updateAnimation(timestamp) {
        if (!this.anim) return;
        if (!this.lastFrameTime) this.lastFrameTime = timestamp;
        const dt = timestamp - this.lastFrameTime;
        if (dt <= this.frameInterval) return;

        this.updateAnimationFromSourceGeneric(this.anim, {
            isOneShot: false,
            allowLoop: true,
        });

        this.lastFrameTime = timestamp;
    }

    onHitCharacter(character, setup, now) {
        const def = this.def;
        const hit = def?.hit;
        if (!hit) {
            this.markedForRemoval = true;
            return;
        }

        const hurtMs = hit.hurtMs ?? 300;
        character.hurtUntil = Math.max(character.hurtUntil ?? 0, now + hurtMs);

        const knock = hit.knockback ?? 0;
        character.knockbackVelocityX = (this.speedX < 0 ? -1 : 1) * knock;

        const impactAnim = hit.getImpactAnim?.(setup.entityImages);
        if (impactAnim) {
            const cx = (this.getRenderX?.() ?? this.x) + this.width * 0.5;
            const factorY = hit.impactOffsetFactorY ?? 0.5;
            const cy = this.y + this.height * factorY;

            const size = hit.impactSize ?? { width: 220, height: 220 };

            setup.effects.push(new ImpactEffect(
                impactAnim,
                cx - size.width / 2,
                cy - size.height / 2,
                { fps: hit.impactFps ?? 18, width: size.width, height: size.height }
            ));
        }

        this.markedForRemoval = true;
    }
}