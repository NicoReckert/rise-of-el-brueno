import { MovableObject } from '../systems/movable-object.class.js'

export class EndbossFireBeam extends MovableObject {
    constructor(entityImages, allAudios) {
        super();
        this.entityImages = entityImages;
        this.allAudios = allAudios;

        this.owner = null;
        this.active = false;

        this.width = 500;   // Länge des Strahls
        this.height = 500;

        this.offset = { top: 40, left: 0, right: 0, bottom: 40 };

        // ✅ Image-Objekte (wie bei AnimatedEntity)
        this.images = this.entityImages.fire?.idle || [];
        this.img = this.images[0] || null;

        this.frameIndex = 0;
        this.lastFrameTime = 0;
        this.frameInterval = 1000 / 8;
    }

    setOwner(endboss) {
        this.owner = endboss;
    }

    updateFromOwner() {
        if (!this.owner) return;

        // Maul-Position (bitte feinjustieren)
        const mouthX = this.owner.isFlipped
            ? this.owner.x + this.owner.width * 0.90
            : this.owner.x + this.owner.width * -1.15;

        const mouthY = this.owner.y + this.owner.height * -0.18;


        this.isFlipped = this.owner.isFlipped;
        // Erklärung: dein draw flippt über isFlipped. Wenn dein Beam nach “rechts” gezeichnet ist,
        // kannst du hier ggf. true/false drehen. Wenn er falsch rum ist: einfach umkehren.

        this.x = mouthX;
        this.y = mouthY;
    }

    updateState(timestamp) {
        if (!this.active) return;

        this.updateAnimation(timestamp);
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

    isHitting(target) {
        // nutze deine vorhandene Collision-Logik
        return this.isCollidingBefore(target, 0, 0);
    }
}