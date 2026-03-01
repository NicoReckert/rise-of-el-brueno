// systems/throw-bottle-system.class.js
import { ThrowableObject } from '../entities/throwable-object.class.js';

export class ThrowBottleSystem {
    constructor({
        world,
        setup,
        animName = 'throw',   // deine Character-Throw-Anim heißt "throw"
        releaseFrame = 4,     // du wirfst bei Frame 4 (0-basiert)
        bottleW = 80,
        bottleH = 100,
        gripAx = 18,          // Griff-Anker innerhalb des Bottle-Bilds (px)
        gripAy = 70,
        handKF = null,        // [{x,y,show}, ...] -> x/y sind im CHARACTER-LOCAL SPACE!
        speedY = 30
    }) {
        this.world = world;
        this.setup = setup;
        this.animName = animName;
        this.releaseFrame = releaseFrame;
        this.speedY = speedY;
        this.gripAx = gripAx;
        this.gripAy = gripAy;

        /**
         * handKF.x / handKF.y sind jetzt bewusst im gleichen Koordinatensystem wie der Character:
         * - Nicht gespiegelt: localX/localY = (0..char.width, 0..char.height) ab Sprite-TopLeft
         * - Gespiegelt: gleiche localX/localY Werte! (weil Renderer spiegelt den ganzen Space)
         */
        this.handKF = handKF ?? [
            { x: 0, y: 50, show: true }, // 0 (kein Idle-Flash)
            { x: -5, y: 50, show: true }, // 1
            { x: 0, y: 50, show: true }, // 2
            { x: 75, y: 25, show: true }, // 3 (letzter sichtbarer Hand-Frame)
            { x: 0, y: 0, show: false }, // 4 release
            { x: 0, y: 0, show: false }, // 5 follow-through
        ];

        // Drawable held bottle (zeichnet im gleichen Transform wie WorldRenderer)
        this.heldBottle = {
            localX: 0,
            localY: 0,
            width: bottleW,
            height: bottleH,
            visible: false,
            sheet: null,        // entityImages.throwableBottle.hand (sheet mit 4 frames)
            frameSource: null,  // {sx,sy,sw,sh}

            draw: (ctx) => {
                if (!this.heldBottle.visible) return;

                const char = this.world.character;
                const sheet = this.heldBottle.sheet;
                const meta = sheet?.meta;
                if (!char || !meta) return;

                // kompatibel zu verschiedenen Loader-Strukturen:
                const image = sheet.image ?? sheet.img ?? sheet;
                const fs = this.heldBottle.frameSource;

                // gleiche Offsets wie WorldRenderer (wichtig!)
                const d = char.drawOffset || { x: 0, y: 0, flipX: 0 };
                const dx = d.x || 0;
                const dy = d.y || 0;
                const fx = d.flipX || 0;

                ctx.save();

                if (char.isFlipped) {
                    // exakt wie WorldRenderer.drawFlippedObject()
                    const tx = Math.round(char.x + char.width + dx + fx);
                    const ty = Math.round(char.y + dy);
                    ctx.translate(tx, ty);
                    ctx.scale(-1, 1);

                    // jetzt sind wir im CHAR-LOCAL SPACE (0..width)
                    const x = this.heldBottle.localX;
                    const y = this.heldBottle.localY;

                    if (fs) {
                        ctx.drawImage(
                            image,
                            fs.sx, fs.sy, fs.sw, fs.sh,
                            x - gripAx, y - gripAy,
                            this.heldBottle.width, this.heldBottle.height
                        );
                    } else {
                        ctx.drawImage(
                            image,
                            x - gripAx, y - gripAy,
                            this.heldBottle.width, this.heldBottle.height
                        );
                    }
                } else {
                    // exakt wie WorldRenderer.drawRegularObject() (world coords)
                    const x = Math.round(char.x + dx + this.heldBottle.localX);
                    const y = Math.round(char.y + dy + this.heldBottle.localY);

                    if (fs) {
                        ctx.drawImage(
                            image,
                            fs.sx, fs.sy, fs.sw, fs.sh,
                            x - gripAx, y - gripAy,
                            this.heldBottle.width, this.heldBottle.height
                        );
                    } else {
                        ctx.drawImage(
                            image,
                            x - gripAx, y - gripAy,
                            this.heldBottle.width, this.heldBottle.height
                        );
                    }
                }

                ctx.restore();
            }
        };
    }

    /** Lazy: Hand-Sheet setzen (entityImages.throwableBottle.hand) */
    ensureHandSheet() {
        if (this.heldBottle.sheet?.meta) return;
        this.heldBottle.sheet = this.world.entityImages?.throwableBottle?.hand ?? null;
    }

    /** Wegen Render->Update Reihenfolge im Controller: -1 macht Overlay frame-genau */
    getVisibleCharFrame(char) {
        return Math.max(0, (char?.frameIndex ?? 0) - 1);
    }

    /** Pro Frame callen (nach character.updateAll) */
    update() {
        this.ensureHandSheet();
        this.updateHeldBottlePose();
        this.spawnOnRelease();
        this.resetOnAnimEnd();
    }

    updateHeldBottlePose() {
        const char = this.world.character;
        this.heldBottle.visible = false;

        if (!char?.isThrowing) return;
        if (char.currentAnimation !== this.animName) return;

        const sheet = this.heldBottle.sheet;
        const meta = sheet?.meta;
        if (!meta) return;

        const cf = this.getVisibleCharFrame(char);
        if (cf <= 0) return;

        // ab Release keine Handflasche mehr
        if (cf >= this.releaseFrame) return;

        const kf = this.handKF[Math.min(cf, this.handKF.length - 1)];
        if (!kf?.show) return;

        // Hand-Sheet hat 4 Frames (0..3)
        const handFrame = Math.min(cf, 3);
        const col = handFrame % meta.columns;
        const row = Math.floor(handFrame / meta.columns);

        this.heldBottle.frameSource = {
            sx: col * meta.frameWidth,
            sy: row * meta.frameHeight,
            sw: meta.frameWidth,
            sh: meta.frameHeight
        };

        // local coords (kein Spiegeln nötig!)
        this.heldBottle.localX = kf.x;
        this.heldBottle.localY = kf.y;
        this.heldBottle.visible = true;
    }

    spawnOnRelease() {
        const char = this.world.character;
        if (!char?.isThrowing) return;
        if (char.currentAnimation !== this.animName) return;

        // prevent double spawn
        if (char._thrownThisAnim) return;

        const cf = this.getVisibleCharFrame(char);
        if (cf < this.releaseFrame) return;

        // Spawn startet am letzten sichtbaren Hand-Frame (releaseFrame - 1)
        const spawnKfIndex = Math.max(0, this.releaseFrame - 1);
        const kf = this.handKF[Math.min(spawnKfIndex, this.handKF.length - 1)] ?? this.handKF[0];

        // gleiche Offsets wie Renderer
        const d = char.drawOffset || { x: 0, y: 0, flipX: 0 };
        const dx = d.x || 0;
        const dy = d.y || 0;
        const fx = d.flipX || 0;

        let sx;
        if (char.isFlipped) {
            // Flip-Transform: worldX = tx - localX
            const tx = (char.x + char.width + dx + fx);
            sx = tx - kf.x;
        } else {
            sx = (char.x + dx + kf.x);
        }
        const sy = (char.y + dy + kf.y);

        const bottle = new ThrowableObject(this.world.entityImages, sx, sy);
        bottle.isFlipped = char.isFlipped;
        const gripAx = this.gripAx;
        const gripAy = this.gripAy;
        if (char.isFlipped) {
            bottle.x = sx - (bottle.width - gripAx);
        } else {
            bottle.x = sx - gripAx;
        }
        bottle.y = sy - gripAy;
        const chargeRaw = this.setup.pendingThrowCharge ?? 0;
        this.setup.pendingThrowCharge = null;
        const charge = Math.max(0, Math.min(1, chargeRaw));
        const minX = 5;
        const maxX = 10;
        const minY = 18;
        const maxY = 30;
        bottle.isThrow = true;
        bottle.isBroken = false;
        bottle.isGravity = true;

        bottle.isMovingRight = !char.isFlipped;
        bottle.isMovingLeft = char.isFlipped;

        const enemies = this.setup.townLevel?.enemies ?? [];
        const charCx = char.x + char.width * 0.5;

        let minD = Infinity;
        for (const e of enemies) {
            if (!e || e.isDead || e.isRemoved) continue;
            const d = Math.abs((e.x + e.width * 0.5) - charCx);
            if (d < minD) minD = d;
        }
        const calcX = minX + (maxX - minX) * charge;
        const calcY = minY + (maxY - minY) * charge;
        if (minD < 220) {
            bottle.speedX = Math.min(calcX, 6);
            bottle.speedY = Math.min(calcY, 22);
        } else {
            bottle.speedX = calcX;
            bottle.speedY = calcY;
        }
        this.setup.throwableObjects.push(bottle);
        this.world.audioManager.playOneShot('bottleThrowSound', { volume: 0.6 });
        char._thrownThisAnim = true;
    }

    resetOnAnimEnd() {
        const char = this.world.character;
        if (!char) return;

        if (char.animationFinished && char.currentAnimation === this.animName) {
            char._thrownThisAnim = false;
            char.isThrowing = false;
        }
    }

    setKeyframes(kfArray) {
        if (Array.isArray(kfArray) && kfArray.length) this.handKF = kfArray;
    }
}