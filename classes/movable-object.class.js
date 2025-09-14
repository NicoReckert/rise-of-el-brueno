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

            if (!this.isFlying && this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
                if (this.y >= 370) {
                    this.y = 370;
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
        if (this instanceof ThrowableObject) {
            return true
        } else if (this instanceof Endboss) {
            return this.y < -35;
        } else {
            return this.y < 370.0;
        }
    }


    // neuste Version für vent Manager
    isColliding(
        object,
        toleranceA = { x: 0, y: 0, width: 0, height: 0 },
        toleranceB = { x: 0, y: 0, width: 0, height: 0 }
    ) {
        // --- Hitbox von "this" (A) ---
        const aLeft = this.isFlipped
            ? this.x + this.offset.right + toleranceA.x
            : this.x + this.offset.left + toleranceA.x;
        const aRight = this.isFlipped
            ? this.x + this.width - this.offset.left - toleranceA.width
            : this.x + this.width - this.offset.right - toleranceA.width;
        const aTop = this.y + this.offset.top + toleranceA.y;
        const aBottom = this.y + this.height - this.offset.bottom - toleranceA.height;

        // --- Hitbox von "object" (B) ---
        const bLeft = object.isFlipped
            ? object.x + object.offset.right + toleranceB.x
            : object.x + object.offset.left + toleranceB.x;
        const bRight = object.isFlipped
            ? object.x + object.width - object.offset.left - toleranceB.width
            : object.x + object.width - object.offset.right - toleranceB.width;
        const bTop = object.y + object.offset.top + toleranceB.y;
        const bBottom = object.y + object.height - object.offset.bottom - toleranceB.height;

        // --- Kollision prüfen ---
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
        const a_left = this.x + this.offset.left;
        const a_right = this.x + this.width - this.offset.right;
        const a_bottom = this.y + this.height - this.offset.bottom;

        const b_left = object.x + object.offset.left;
        const b_right = object.x + object.width - object.offset.right;
        const b_top = object.y + object.offset.top;

        const horizontallyAligned =
            a_right > b_left &&
            a_left < b_right;

        const verticalHit =
            a_bottom >= b_top - 10 &&  // 10 = Toleranz
            a_bottom <= b_top + 10;    // nur von oben

        return horizontallyAligned && verticalHit;
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
}