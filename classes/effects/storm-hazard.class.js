import { MovableObject } from '../systems/movable-object.class.js';

export class StormHazard extends MovableObject {
    constructor(setup, cfg = {}) {
        super();
        this.setup = setup;

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

    updateState(timestamp) {
        if (this.markedForRemoval) return;
        this.updateDeltaTime(timestamp);

        // movement
        const dt60 = (this.deltaTime ?? 1 / 60) * 60;
        this.x += (this.speedX ?? 0) * dt60;

        // lifetime
        if (timestamp >= this.dieAt) {
            this.markedForRemoval = true;
            return;
        }

        // animation
        this.updateAnimation(timestamp);

        // collision only in active window
        if (timestamp < this.activeFrom || timestamp > this.activeUntil) return;

        const char = this.setup?.world?.character;
        if (!char) return;

        // duck/jump logic kannst du hier optional berücksichtigen (z.B. je nach lane)
        if (this.isColliding(char, { x: 0, y: 0, width: 0, height: 0 }, { x: 0, y: 0, width: 0, height: 0 })) {
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
            allowLoop: true
        });

        this.lastFrameTime = timestamp;
    }

    // default: einfach weg
    onHitCharacter(character, setup, now) {
        this.markedForRemoval = true;
    }
}