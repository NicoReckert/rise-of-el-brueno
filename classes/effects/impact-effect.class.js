import { MovableObject } from '../systems/movable-object.class.js';

export class ImpactEffect extends MovableObject {
    constructor(anim, x, y, {
        animName = 'explode',
        fps = 18,
        width = 220,
        height = 220,
    } = {}) {
        super();
        this.anim = anim;
        this.currentAnimation = animName;

        this.frameInterval = 1000 / fps;
        this.frameIndex = 0;
        this.sheetIndex = 0;
        this.lastFrameTime = 0;
        this.animationFinished = false;

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.markedForRemoval = false;
        this.opacity = 1;

        // ✅ sofort erstes Frame setzen, damit Renderer (img != null) zeichnen kann
        if (this.anim) {
            this.updateAnimationFromSourceGeneric(this.anim, {
                isOneShot: false,
                allowLoop: false
            });
        }
    }

    updateState(timestamp) {
        if (this.markedForRemoval) return;
        const ts = (typeof timestamp === 'number') ? timestamp : performance.now();
        this.updateAnimation(ts);
    }

    updateAnimation(timestamp) {
        if (!this.anim) {
            this.markedForRemoval = true;
            return;
        }

        if (!this.lastFrameTime) this.lastFrameTime = timestamp;
        const dt = timestamp - this.lastFrameTime;
        if (dt <= this.frameInterval) return;

        this.updateAnimationFromSourceGeneric(this.anim, {
            isOneShot: true,
            allowLoop: false,
            onFinished: () => { this.markedForRemoval = true; }
        });

        this.lastFrameTime = timestamp;
    }
}