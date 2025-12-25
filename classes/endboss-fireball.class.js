class EndbossFireball extends Projectile {
    constructor(startX, startY, targetX, targetY, allAudios) {
        const direction = targetX >= startX;
        super("fireball", startX, startY, direction);
        this.allAudios = allAudios;

        // Größe + Schaden
        this.width = 180;
        this.height = 180;
        this.damage = 4;

        // 🔒 Richtung EINMAL beim Start
        const speed = 14;
        const dx = targetX - startX;
        const dy = targetY - startY;
        const len = Math.hypot(dx, dy) || 1;

        this.vx = (dx / len) * speed;
        this.vy = (dy / len) * speed;

        // Explosion
        this.isExploding = false;
        this.explosionFrames = this.imageSets.fireball_explode || [];

        // Projectile braucht Zugriff auf World
        this.world = null;
    }

    updateState(timestamp) {
        if (this.markedForRemoval) return;

        if (this.isExploding) {
            // ✅ Explosion: einmalig Frames durchlaufen
            if (!this.lastFrameTime) this.lastFrameTime = timestamp;
            const delta = timestamp - this.lastFrameTime;

            if (delta > this.frameInterval) {
                if (this.images.length > 0) {
                    // next frame
                    this.explosionIndex++;

                    if (this.explosionIndex >= this.images.length) {
                        this.markedForRemoval = true; // ✅ nach letztem Frame weg
                        return;
                    }

                    this.loadImage(this.images[this.explosionIndex]);
                    this.lastFrameTime = timestamp;
                }
            }

            return;
        }


        /* 🔥 FLUG (X + Y, KEIN Homing) */
        this.x += this.vx;
        this.y += this.vy;

        this.direction = this.vx >= 0;

        /* 🎯 TREFFER */
        const character = this.world?.character;
        if (character && this.collidesWith(character)) {
            if (typeof character.hit === "function") character.hit(this.damage);
            else if ("health" in character) character.health -= this.damage;

            this.explode();
            return;
        }

        /* 🪨 BODEN */
        const groundY = this.world?.groundY ?? 700;
        if (this.y + this.height >= groundY) {
            this.y = groundY - this.height;
            this.explode();
            return;
        }

        this.updateAnimation(timestamp);
    }

    explode() {
        this.isExploding = true;
        this.vx = 0;
        this.vy = 0;

        if (this.allAudios?.explodeSound) {
            const audio = this.allAudios.explodeSound.cloneNode();
            audio.volume = 0.9;
            audio.play();
        }

        this.images = this.explosionFrames;
        this.explosionIndex = 0;     // ✅ neu
        this.lastFrameTime = 0;

        if (this.images.length > 0) {
            this.loadImage(this.images[0]);
        } else {
            this.markedForRemoval = true;
        }
    }


    draw(ctx) {
        ctx.save();
        if (!this.isExploding && !this.direction) {
            ctx.scale(-1, 1);
            ctx.drawImage(this.img, -this.x - this.width, this.y, this.width, this.height);
        } else {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
        ctx.restore();
    }
}
