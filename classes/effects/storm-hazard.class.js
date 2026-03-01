// classes/effects/storm-hazard.class.js
import { MovableObject } from "../systems/movable-object.class.js";

export class StormHazard extends MovableObject {
    /**
     * @param {object} setup TownLevelSetup
     * @param {object} cfg
     * @param {string} cfg.kind
     * @param {object} cfg.anim   sheet or sheetSequence (wie in entityImages)
     * @param {string} [cfg.animName="idle"] currentAnimation name (für sheet.meta.animations)
     * @param {number} [cfg.fps=10]
     * @param {number} cfg.x
     * @param {number} cfg.y
     * @param {number} cfg.width
     * @param {number} cfg.height
     * @param {object} [cfg.offset] hitbox offsets
     * @param {number} [cfg.speedX=-12]
     * @param {number} [cfg.speedY=0]
     * @param {number} [cfg.telegraphMs=500]
     * @param {number} [cfg.activeMs=350]
     * @param {number} [cfg.lifeMs] default telegraph+active+300
     * @param {boolean} [cfg.drawShadow=true]
     * @param {function} [cfg.onHit]
     */
    constructor(setup, cfg = {}) {
        super();
        this.setup = setup;
        this.world = setup.world;

        // identity
        this.kind = cfg.kind ?? "hazard";

        // sprite / animation
        this.anim = cfg.anim ?? null;              // sheet or sheetSequence
        this.currentAnimation = cfg.animName ?? "idle";
        this.frameInterval = 1000 / (cfg.fps ?? 10);
        this.frameIndex = 0;
        this.sheetIndex = 0;
        this.lastFrameTime = 0;
        this.animationFinished = false;

        // spatial
        this.x = cfg.x ?? 0;
        this.y = cfg.y ?? 0;
        this.width = cfg.width ?? 200;
        this.height = cfg.height ?? 200;

        // collision hitbox (tight by default)
        const off = cfg.offset ?? {};
        this.offset.top = off.top ?? 40;
        this.offset.left = off.left ?? 60;
        this.offset.right = off.right ?? 60;
        this.offset.bottom = off.bottom ?? 40;

        // movement
        this.speedX = cfg.speedX ?? -12;
        this.speedY = cfg.speedY ?? 0;

        // optional bobbing
        this.bobAmp = cfg.bobAmp ?? 0;
        this.bobSpeed = cfg.bobSpeed ?? 0.006; // sin(timestamp * speed)
        this._baseY = this.y;

        // lifecycle
        const now = performance.now();
        this.spawnAt = cfg.spawnAt ?? now;
        this.telegraphMs = cfg.telegraphMs ?? 500;
        this.activeMs = cfg.activeMs ?? 350;
        this.lifeMs = cfg.lifeMs ?? (this.telegraphMs + this.activeMs + 300);
        this.activeAt = this.spawnAt + this.telegraphMs;
        this.endAt = this.spawnAt + this.lifeMs;

        // visuals
        this.drawShadow = cfg.drawShadow ?? true;
        this.shadowScale = cfg.shadowScale ?? 1.0;
        this.shadowYOffset = cfg.shadowYOffset ?? 0;

        // hooks
        this.onHit = cfg.onHit ?? null;
        this.hitOnce = cfg.hitOnce ?? true;
        this._hasHit = false;

        // cleanup
        this.markedForRemoval = false;

        // init first frame so it renders immediately
        this.updateAnimationFromSourceGeneric(this.anim, { allowLoop: true });
    }

    isTelegraph(t) {
        return t < this.activeAt;
    }
    isActive(t) {
        return t >= this.activeAt && t < (this.activeAt + this.activeMs);
    }

    updateState(timestamp) {
        const t = timestamp ?? performance.now();

        if (t >= this.endAt) {
            this.markedForRemoval = true;
            return;
        }

        // movement
        this.updateDeltaTime(t);
        const step = (this.deltaTime ?? 1 / 60) * 60;

        this.x += (this.speedX ?? 0) * step;
        this.y += (this.speedY ?? 0) * step;

        if (this.bobAmp) {
            this.y = this._baseY + Math.sin(t * this.bobSpeed) * this.bobAmp;
        }

        // animate
        this.updateAnimation(t);

        // collision only in active window
        if (this.isActive(t)) this.checkHit(t);
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

    checkHit(t) {
        if (this.hitOnce && this._hasHit) return;
        const c = this.world?.character;
        if (!c) return;

        // nutze deine robuste Collision-Logik (Offsets + Flip + renderX)
        if (!c.isColliding(this)) return;

        this._hasHit = true;
        this.onHit?.(this.setup, c, this, t);
    }

    // draw() wird vom WorldRenderer bevorzugt genutzt (falls vorhanden).
    // Wir nutzen es nur für Shadow – Sprite selber zeichnet der Renderer via img/frameSource.
    draw(ctx) {
        // shadow
        if (this.drawShadow) {
            const t = performance.now();
            const char = this.world?.character;
            const groundBottom = char?.groundBottom ?? 670;
            const groundY = groundBottom;

            const cx = this.x + this.width * 0.5;
            const y = groundY + this.shadowYOffset;
            const w = this.width * 0.28 * this.shadowScale;
            const h = this.height * 0.06 * this.shadowScale;

            const p = Math.min(1, Math.max(0, (t - this.spawnAt) / Math.max(1, this.telegraphMs)));
            const alpha = this.isTelegraph(t) ? (0.08 + 0.25 * p) : 0.16;

            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.ellipse(cx, y, w, h, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // sprite (frameSource kompatibel)
        if (!this.img) return;
        ctx.save();
        if (this.opacity !== undefined) ctx.globalAlpha = this.opacity;

        if (this.frameSource) {
            const f = this.frameSource;
            ctx.drawImage(this.img, f.sx, f.sy, f.sw, f.sh, this.x, this.y, this.width, this.height);
        } else {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
        ctx.restore();
    }
}