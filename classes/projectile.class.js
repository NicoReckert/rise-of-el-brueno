class Projectile extends MovableObject {

    constructor(type, x, y, direction = true) {
        super();
        this.type = type;
        this.direction = direction; // true = rechts, false = links
        this.x = x;
        this.y = y;

        this.width = 60;
        this.height = 60;
        this.speed = 10;
        this.damage = 2;
        this.lifetime = 4000;
        this.isActive = true;
        this.markedForRemoval = false;

        this.frameIndex = 0;
        this.lastFrameTime = 0;
        this.frameInterval = 1000 / 12;

        // 🔥 Bilder anhand des Typs laden
        this.imageSets = {
            fireball: [
                './assets/img/npcs/projectile/fireball/image_1.png',
                './assets/img/npcs/projectile/fireball/image_2.png',
                './assets/img/npcs/projectile/fireball/image_3.png',
                './assets/img/npcs/projectile/fireball/image_4.png',
                './assets/img/npcs/projectile/fireball/image_5.png',
                './assets/img/npcs/projectile/fireball/image_6.png'
            ],
            // später: iceball, poison, etc.
        };

        this.images = this.imageSets[type] || [];
        this.img = new Image();
        this.img.src = this.images[0];

        // Lebenszeit-Timer
        setTimeout(() => this.markedForRemoval = true, this.lifetime);
    }

    updateState(timestamp) {
        // Bewegung (wie bei ThrowableObject)
        this.x += this.direction ? this.speed : -this.speed;
        this.updateAnimation(timestamp);
    }

    updateAnimation(timestamp) {
        if (!this.lastFrameTime) this.lastFrameTime = timestamp;
        const deltaTime = timestamp - this.lastFrameTime;

        if (deltaTime > this.frameInterval) {
            if (this.images.length > 0) {
                const framePath = this.images[this.frameIndex % this.images.length];
                this.loadImage(framePath);
                this.frameIndex++;
                this.lastFrameTime = timestamp;
            }
        }
    }

    draw(ctx) {
        ctx.save();
        if (!this.direction) {
            ctx.scale(-1, 1);
            ctx.drawImage(this.img, -this.x - this.width, this.y, this.width, this.height);
        } else {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
        ctx.restore();
    }

    collidesWith(target) {
        return (
            this.x + this.width > target.x + target.offset.left &&
            this.x < target.x + target.width - target.offset.right &&
            this.y + this.height > target.y + target.offset.top &&
            this.y < target.y + target.height - target.offset.bottom
        );
    }
}
