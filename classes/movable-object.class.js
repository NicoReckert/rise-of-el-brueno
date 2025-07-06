class MovableObject extends DrawableObject {
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

    constructor() {
        super();
    }

    applyGravity() {
        if (this.intervalGravity) return;
        this.intervalGravity = setInterval(() => {
            if (!this.isFlying && this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                this.y = 130;
                this.speedY = 0;
                clearInterval(this.intervalGravity);
                this.intervalGravity = null;
            }
        }, 1000 / 25);
    }

    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true
        } else {
            return this.y < 130.0;
        }
    }

    isColliding(object) {
    const a_left   = this.x + this.offset.left;
    const a_right  = this.x + this.width - this.offset.right;
    const a_top    = this.y + this.offset.top;
    const a_bottom = this.y + this.height - this.offset.bottom;

    const b_left   = object.x + object.offset.left;
    const b_right  = object.x + object.width - object.offset.right;
    const b_top    = object.y + object.offset.top;
    const b_bottom = object.y + object.height - object.offset.bottom;

    return a_right > b_left &&
           a_left < b_right &&
           a_bottom > b_top &&
           a_top < b_bottom;
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