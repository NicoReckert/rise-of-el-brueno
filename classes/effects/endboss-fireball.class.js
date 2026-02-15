import { Projectile } from '../entities/projectile.class.js';

export class EndbossFireball extends Projectile {
    constructor(startX, startY, targetX, targetY, allAudios) {
        const direction = targetX >= startX;
        super("fireball", startX, startY, direction);
        this.allAudios = allAudios;

        this.width = 180;
        this.height = 180;
        this.damage = 4;

        // ✅ Bewegungsbasis: "px pro Frame @60fps"
        const speed = 14;
        const dx = targetX - startX;
        const dy = targetY - startY;
        const len = Math.hypot(dx, dy) || 1;

        this.vx = (dx / len) * speed;
        this.vy = (dy / len) * speed;

        this.world = null;
    }

    updateState(timestamp) {
        if (this.markedForRemoval) return;

        // ✅ Projectile hat jetzt deltaTime
        this.updateDeltaTime(timestamp);

        // 💥 Wenn explodiert: nur noch Animation laufen lassen (Projectile macht "einmal abspielen")
        if (this.state === "explode") {
            this.updateAnimation(timestamp);
            return;
        }

        // ✅ deltaTime Bewegung (vx/vy sind @60fps)
        const step = (this.deltaTime ?? 1 / 60) * 60;
        this.x += this.vx * step;
        this.y += this.vy * step;

        this.direction = this.vx >= 0;

        // 🎯 TREFFER (am besten deine neue isColliding nutzen, dann passt offset + flipped)
        const character = this.world?.character;
        if (character && this.isColliding(character, { x: 0, width: 0 }, { x: 50, width: 50 })) {
            // hier lieber deine hit2 nutzen, falls du i-frames etc willst:
            if (typeof character.hit2 === "function") character.hit2(timestamp, this.damage);
            else if (typeof character.hit === "function") character.hit(this.damage);
            else if ("health" in character) character.health -= this.damage;

            this.explode();
            return;
        }

        // 🪨 BODEN
        const groundY = this.world?.groundY ?? 700;
        if (this.y + this.height >= groundY) {
            this.y = groundY - this.height;
            this.explode();
            return;
        }

        this.updateAnimation(timestamp);
    }

    explode() {
        if (this.state === "explode") return;

        if (this.allAudios?.explodeSound) {
            const audio = this.allAudios.explodeSound.cloneNode();
            audio.volume = 0.9;
            audio.play();
        }

        // ✅ Nutzt Projectile.explode() => state="explode", images wechseln, speed=0
        super.explode();

        // ✅ Zusätzlich X/Y Bewegung stoppen
        this.vx = 0;
        this.vy = 0;
    }

    draw(ctx) {
        ctx.save();
        if (this.state !== "explode" && !this.direction) {
            ctx.scale(-1, 1);
            ctx.drawImage(this.img, -this.x - this.width, this.y, this.width, this.height);
        } else {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
        ctx.restore();
    }
}

