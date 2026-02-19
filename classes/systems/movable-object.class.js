import { DrawableObject } from './drawable-object.class.js';

export class MovableObject extends DrawableObject {
    speedY = 0;
    acceleration = 2.5;
    intervalGravity = null;
    energy = 100;
    lastHit = 0;
    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    }
    isFlying = false;
    isLanding = false;

    constructor() {
        super();
        this.lastGravityUpdate = 0;
        this.gravityInterval = 1000 / 25;
        this.groundBottom = 370 + 300; // 670
        this.lastUpdateTime = 0;
        this.deltaTime = 0;
        this.deltaSeconds = 0;
        this.movementSpeed = 0;
        this.speedX = this.speedX ?? 0;

    }

    preloadImages(paths) {
        return paths.map(path => {
            const img = new Image();
            img.src = path;
            return img;
        });
    }

    updateDeltaTime(timestamp, maxDt = 0.1) {
        if (!this.lastUpdateTime) {
            this.lastUpdateTime = timestamp;
            this.deltaTime = 0;
            this.deltaSeconds = 0;
            this.movementSpeed = 0;
            return;
        }
        let dt = (timestamp - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = timestamp;
        if (!Number.isFinite(dt) || dt < 0) dt = 0;
        if (dt > maxDt) dt = 0;
        this.deltaTime = dt;
        this.deltaSeconds = dt;
        this.movementSpeed = (this.speedX ?? 0) * dt * 60;
    }

    applyGravity(timestamp) {
        if (!this.lastGravityUpdate) this.lastGravityUpdate = timestamp;
        const deltaTime = timestamp - this.lastGravityUpdate;

        if (deltaTime > this.gravityInterval) {
            const groundTopY = this.getGroundTopY();

            if (((!this.isFlying && this.isAboveGround()) || this.speedY > 0)) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;

                if (this.y >= groundTopY) {
                    this.y = groundTopY;
                    this.speedY = 0;
                    this.isJumping = false;
                    this.isLanding = true;
                }
            } else {
                this.speedY = 0;
                this.isJumping = false;
            }

            this.lastGravityUpdate = timestamp;
        }
    }

    isAboveGround() {
        if (this.ignoreGroundCollision) return true;
        if (this.customGroundCheck) return this.customGroundCheck();
        return this.y < this.getGroundTopY();
    }

    getGroundTopY() {
        // Standard: alter Boden
        if (!this.groundBottom) return 370;
        return this.groundBottom - this.height;
    }


    // neuste Version für vent Manager
    isColliding(
        object,
        toleranceA = { x: 0, y: 0, width: 0, height: 0 },
        toleranceB = { x: 0, y: 0, width: 0, height: 0 }
    ) {
        const ax = this.getRenderX ? this.getRenderX() : this.x;
        const bx = object.getRenderX ? object.getRenderX() : object.x;

        // --- Hitbox von "this" (A) ---
        const aLeft = this.isFlipped
            ? ax + this.offset.right + toleranceA.x
            : ax + this.offset.left + toleranceA.x;

        const aRight = this.isFlipped
            ? ax + this.width - this.offset.left - toleranceA.width
            : ax + this.width - this.offset.right - toleranceA.width;

        const aTop = this.y + this.offset.top + toleranceA.y;
        const aBottom = this.y + this.height - this.offset.bottom - toleranceA.height;

        // --- Hitbox von "object" (B) ---
        const bLeft = object.isFlipped
            ? bx + object.offset.right + toleranceB.x
            : bx + object.offset.left + toleranceB.x;

        const bRight = object.isFlipped
            ? bx + object.width - object.offset.left - toleranceB.width
            : bx + object.width - object.offset.right - toleranceB.width;

        const bTop = object.y + object.offset.top + toleranceB.y;
        const bBottom = object.y + object.height - object.offset.bottom - toleranceB.height;

        return !(aRight < bLeft || aLeft > bRight || aBottom < bTop || aTop > bBottom);
    }



    // version vor event manager - für normal und isFlipped
    isCollidingBefore(object, collidingToleranceTop = 0, collidingToleranceLeft = 0) {
        const a_left = this.isFlipped
            ? this.x + this.offset.right
            : this.x + this.offset.left;
        const a_right = this.isFlipped
            ? this.x + this.width - this.offset.left
            : this.x + this.width - this.offset.right;
        const a_top = this.y + this.offset.top;
        const a_bottom = this.y + this.height - this.offset.bottom;

        const b_left = object.isFlipped
            ? object.x + object.offset.right
            : object.x + object.offset.left;
        const b_right = object.isFlipped
            ? object.x + object.width - object.offset.left
            : object.x + object.width - object.offset.right;
        const b_top = object.y + object.offset.top;
        const b_bottom = object.y + object.height - object.offset.bottom;

        return a_right > b_left + collidingToleranceLeft &&
            a_left < b_right &&
            a_bottom > b_top + collidingToleranceTop &&
            a_top < b_bottom;
    }

    isCollidingBeforeWithAttackHitbox(object, collidingToleranceTop = 0, collidingToleranceLeft = 0, attackHitbox = null) {
        const hb = attackHitbox && attackHitbox.active ? attackHitbox : this.offset;

        const ax = this.getRenderX ? this.getRenderX() : this.x;
        const bx = object.getRenderX ? object.getRenderX() : object.x;

        // === A-Seiten (dieses Objekt) ===
        const a_left = this.isFlipped
            ? ax + hb.right
            : ax + hb.left;

        const a_right = this.isFlipped
            ? ax + this.width - hb.left
            : ax + this.width - hb.right;

        const a_top = this.y + hb.top;
        const a_bottom = this.y + this.height - hb.bottom;

        // === B-Seiten (Zielobjekt) ===
        const b_left = object.isFlipped
            ? bx + object.offset.right
            : bx + object.offset.left;

        const b_right = object.isFlipped
            ? bx + object.width - object.offset.left
            : bx + object.width - object.offset.right;

        const b_top = object.y + object.offset.top;
        const b_bottom = object.y + object.height - object.offset.bottom;

        return (
            a_right > b_left + collidingToleranceLeft &&
            a_left < b_right &&
            a_bottom > b_top + collidingToleranceTop &&
            a_top < b_bottom
        );
    }




    //letzte funktionierende Funktion
    isCollidingBeforeBefore(object, collidingToleranceTop, collidingToleranceLeft) {
        const a_left = this.x + this.offset.left;
        const a_right = this.x + this.width - this.offset.right;
        const a_top = this.y + this.offset.top;
        const a_bottom = this.y + this.height - this.offset.bottom;

        const b_left = object.x + object.offset.left;
        const b_right = object.x + object.width - object.offset.right;
        const b_top = object.y + object.offset.top;
        const b_bottom = object.y + object.height - object.offset.bottom;

        return a_right > b_left + collidingToleranceLeft &&
            a_left < b_right &&
            a_bottom > b_top + collidingToleranceTop &&
            a_top < b_bottom;
    }

    isJumpOn(object) {
        const ax = this.getRenderX ? this.getRenderX() : this.x;
        const bx = object.getRenderX ? object.getRenderX() : object.x;

        // --- Hitbox A (Character) wie in isColliding, aber ohne Toleranzen ---
        const aLeft = this.isFlipped
            ? ax + this.offset.right
            : ax + this.offset.left;

        const aRight = this.isFlipped
            ? ax + this.width - this.offset.left
            : ax + this.width - this.offset.right;

        const aTop = this.y + this.offset.top;
        const aBottom = this.y + this.height - this.offset.bottom;

        // Bottom aus vorherigem Frame (falls noch nicht gesetzt → aktueller)
        const prevBottom = this.prevBottom ?? aBottom;

        // --- Hitbox B (Enemy) wie in isColliding ---
        const bLeft = object.isFlipped
            ? bx + object.offset.right
            : bx + object.offset.left;

        const bRight = object.isFlipped
            ? bx + object.width - object.offset.left
            : bx + object.width - object.offset.right;

        const bTop = object.y + object.offset.top;
        const bBottom = object.y + object.height - object.offset.bottom;

        // 1) Horizontal muss sich überhaupt was überschneiden
        const horizontallyAligned =
            aRight > bLeft &&
            aLeft < bRight;

        if (!horizontallyAligned) return false;

        // 2) Character muss FALLEN (bei dir: speedY < 0 = nach unten)
        const fallingDown = this.speedY < 0;
        if (!fallingDown) return false;

        // 3) Im letzten Frame waren die Füße noch ÜBER dem Kopf des Gegners
        const wasAboveHead = prevBottom <= bTop;

        // 4) Jetzt sind die Füße auf / knapp unter Kopfhöhe → von oben eingeschlagen
        const V_TOL = 10; // vertikale Toleranz in px
        const nowCrossFromTop =
            aBottom >= bTop - V_TOL &&
            aTop < bBottom; // nicht komplett vorbei schießen

        if (!(wasAboveHead && nowCrossFromTop)) return false;

        // 5) Seitlichen Versatz begrenzen → keine „seitlichen“ stomp-Hits
        const aCenterX = (aLeft + aRight) / 2;
        const bCenterX = (bLeft + bRight) / 2;
        const maxSideOffset = object.width * 0.6; // 0.5–0.7 je nach Gefühl

        const horizontalOk = Math.abs(aCenterX - bCenterX) <= maxSideOffset;
        if (!horizontalOk) return false;

        return true;
    }


    isColliding2(object) {
        return this.x + this.offset.left + this.width - this.offset.left - this.offset.right > object.x &&
            this.y + this.offset.top + this.height - this.offset.top - this.offset.bottom > object.y &&
            this.x < object.x + object.width &&
            this.y < object.y + object.height;
    }

    isColliding3(object) {
        return this.x + this.width > object.x &&
            this.y + this.height > object.y &&
            this.x < object.x + object.width &&
            this.y < object.y + object.height;
    }

    hit() {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    isDead() {
        return this.energy == 0;
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 1;
    }

    getRenderX() {
        const d = this.drawOffset || { x: 0, flipX: 0 };
        // flipX soll nur beim Spiegeln wirken
        const flipShift = this.isFlipped ? (d.flipX || 0) : 0;
        return this.x + (d.x || 0) + flipShift;
    }

    getHitboxRect() {
        const ax = this.getRenderX ? this.getRenderX() : this.x;

        const left = this.isFlipped
            ? ax + this.offset.right
            : ax + this.offset.left;

        const right = this.isFlipped
            ? ax + this.width - this.offset.left
            : ax + this.width - this.offset.right;

        const top = this.y + this.offset.top;
        const bottom = this.y + this.height - this.offset.bottom;

        return {
            left,
            right,
            top,
            bottom,
            cx: (left + right) * 0.5,
            cy: (top + bottom) * 0.5
        };
    }

    /**
    * Applies the next animation frame from the given images.
    * @param {Array} images Animation frame images.
    */
    applyNextFrame(images) {
        if (!images || !images.length) return;
        this.img = images[this.frameIndex % images.length];
        this.frameSource = null;
    }

    /**
    * Applies the next frame from a sprite sheet.
    * @param {Object} sheet Sprite sheet definition.
    */
    applyNextSheetFrame(sheet) {
        if (!sheet?.meta) return;
        const animDef = this.getSheetAnimDef(sheet);
        const range = this.getSheetFrameRange(animDef, sheet.meta);
        const frame = this.getSheetFrameIndex(range.from, range.count);
        const pos = this.getSheetGridPosition(frame, sheet.meta);
        this.setSheetFrameSource(sheet.image, sheet.meta, pos.col, pos.row);
    }

    /**
    * Returns the animation definition for a sprite sheet.
    * @param {Object} sheet Sprite sheet definition.
    * @returns {Object} Animation definition.
    */
    getSheetAnimDef(sheet) {
        const meta = sheet.meta;
        const animName = sheet.anim ?? this.currentAnimation;
        return (
            meta.animations?.[animName] ??
            meta.animations?.default ??
            { from: 0, to: meta.frames - 1 }
        );
    }

    /**
    * Calculates frame range information for a sprite sheet animation.
    * @param {Object} animDef Animation definition.
    * @param {Object} meta Sprite sheet metadata.
    * @returns {{from: number, to: number, count: number}} Frame range data.
    */
    getSheetFrameRange(animDef, meta) {
        const from = animDef.from ?? 0;
        const to = animDef.to ?? (meta.frames - 1);
        const count = to - from + 1;
        return { from, to, count };
    }

    /**
    * Calculates the current frame index for a sprite sheet animation.
    * @param {number} from Starting frame index.
    * @param {number} count Number of frames in the range.
    * @returns {number} Calculated frame index.
    */
    getSheetFrameIndex(from, count) {
        return from + (this.frameIndex % count);
    }

    /**
    * Calculates the grid position for a frame in a sprite sheet.
    * @param {number} frame Frame index.
    * @param {Object} meta Sprite sheet metadata.
    * @returns {{col: number, row: number}} Grid position.
    */
    getSheetGridPosition(frame, meta) {
        const col = frame % meta.columns;
        const row = Math.floor(frame / meta.columns);
        return { col, row };
    }

    /**
    * Sets the current sprite sheet frame source.
    * @param {HTMLImageElement} image Sprite sheet image.
    * @param {Object} meta Sprite sheet metadata.
    * @param {number} col Column index.
    * @param {number} row Row index.
    */
    setSheetFrameSource(image, meta, col, row) {
        this.img = image;
        this.frameSource = {
            sx: col * meta.frameWidth,
            sy: row * meta.frameHeight,
            sw: meta.frameWidth,
            sh: meta.frameHeight
        };
    }

    /**
* Returns the sprite sheet animation definition.
* Mirrors CharacterAnimationController.getSheetDef, aber generisch.
* @param {Object} meta Sprite sheet metadata.
* @param {string} animName Animation state identifier.
* @returns {Object} Animation definition.
*/
    getSheetDef(meta, animName) {
        const anims = meta.animations ?? {};
        return anims[animName] ?? anims.default ?? {
            from: 0,
            to: meta.frames - 1
        };
    }

    /**
    * Calculates the frame count for a sprite sheet animation.
    * Mirrors CharacterAnimationController.getFrameCount.
    * @param {Object} def Animation definition.
    * @param {number} totalFrames Total number of frames in the sheet.
    * @returns {number} Frame count.
    */
    getFrameCount(def, totalFrames) {
        const from = def.from ?? 0;
        const to = def.to ?? (totalFrames - 1);
        return to - from + 1;
    }

    /**
    * Generic animation-stepper für Arrays, sheet und sheetSequence.
    * DELEGIEREND – keine Character-spezifische Logik, keine Transitions.
    *
    * @param {*} anim - Animation source (Array | sheet | sheetSequence)
    * @param {Object} [options={}]
    * @param {boolean} [options.isOneShot=false]       - nicht loopen / fertig nach Ende
    * @param {Function} [options.onFinished=null]      - Callback bei Ende
    * @param {boolean} [options.allowLoop=true]        - Ob loopenden Anim loopen darf
    */
    updateAnimationFromSourceGeneric(anim, {
        isOneShot = false,
        onFinished = null,
        allowLoop = true
    } = {}) {
        if (!anim) return;

        if (Array.isArray(anim)) {
            if (!anim.length) return;
            this.stepArrayAnimation(anim, { isOneShot, onFinished });
            return;
        }

        if (anim.type === 'sheetSequence') {
            this.stepSheetSequenceAnimation(anim, { isOneShot, onFinished, allowLoop });
            return;
        }

        if (anim.type === 'sheet') {
            this.stepSheetAnimation(anim, { isOneShot, onFinished, allowLoop });
        }
    }

    /**
    * Handles animation defined as an image array.
    * Entspricht CharacterAnimationController.handleArrayAnimation,
    * nur ohne Transitions.
    * @param {Array} images Animation frame images.
    */
    stepArrayAnimation(images, { isOneShot, onFinished }) {
        this.applyNextFrame(images);
        // falls Object eine deferredSizeUpdate-Logik hat (Character z.B.)
        if (typeof this.handleDeferredSizeUpdate === 'function') {
            this.handleDeferredSizeUpdate();
        }
        this.frameIndex++;

        if (isOneShot && this.frameIndex >= images.length) {
            this.animationFinished = true;
            onFinished?.();
        }
    }

    /**
    * Handles animation defined as a single sprite sheet.
    * Entspricht CharacterAnimationController.handleSheet,
    * aber ohne Transitions – Ende wird via onFinished gemeldet.
    * @param {Object} anim Animation definition.
    */
    stepSheetAnimation(anim, { isOneShot, onFinished, allowLoop }) {
        this.applyNextSheetFrame(anim);
        if (typeof this.handleDeferredSizeUpdate === 'function') {
            this.handleDeferredSizeUpdate();
        }
        this.frameIndex++;

        const name = anim.anim ?? this.currentAnimation;
        const def = this.getSheetDef(anim.meta, name);
        const count = this.getFrameCount(def, anim.meta.frames);

        if (this.frameIndex >= count) {
            const loopDef = def.loop !== false; // default: loop wenn nicht explizit false

            if (!isOneShot && allowLoop && loopDef) {
                this.frameIndex = 0;
            } else {
                this.animationFinished = true;
                onFinished?.();
            }
        }
    }

    /**
    * Handles animation defined as a sheet sequence.
    * Entspricht CharacterAnimationController.handleSheetSequence/advanceSheetSequence,
    * aber generisch.
    * @param {Object} anim Animation definition (sheetSequence).
    */
    stepSheetSequenceAnimation(anim, { isOneShot, onFinished, allowLoop }) {
        const sheets = anim.sheets ?? [];
        const sheet = sheets[this.sheetIndex];
        if (!sheet) return;

        this.applyNextSheetFrame(sheet);
        if (typeof this.handleDeferredSizeUpdate === 'function') {
            this.handleDeferredSizeUpdate();
        }
        this.frameIndex++;

        const def = this.getSheetDef(sheet.meta, this.currentAnimation);
        const count = this.getFrameCount(def, sheet.meta.frames);

        if (this.frameIndex >= count) {
            this.frameIndex = 0;
            this.sheetIndex++;

            const atEnd = this.sheetIndex >= sheets.length;

            if (!atEnd) return;

            const loopSeq = !!anim.loop;

            if (!isOneShot && allowLoop && loopSeq) {
                this.sheetIndex = 0;
            } else {
                this.sheetIndex = Math.max(0, sheets.length - 1);
                this.animationFinished = true;
                onFinished?.();
            }
        }
    }
}