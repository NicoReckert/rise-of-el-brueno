class MovableObject extends DrawableObject {
    speedY = 0;
    speedX;
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

    }

    preloadImages(paths) {
        return paths.map(path => {
            const img = new Image();
            img.src = path;
            return img;
        });
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
        if (this instanceof ThrowableObject) return true;
        if (this instanceof Endboss) return this.y < -35;
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


}