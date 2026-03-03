// classes/effects/vulture-hazard.class.js
import { StormHazard } from './storm-hazard.class.js';
import { ImpactEffect } from './impact-effect.class.js';

export class VultureHazard extends StormHazard {
    static spawn(setup, { x, y, lane = 'duck', speedX, seed } = {}) {
        const camX = setup.world.townLevelController?.renderCameraX ?? 0;
        const canvasW = setup.world.canvas?.width ?? 1280;

        const h = new VultureHazard(setup, {
            x: x ?? (camX + canvasW + 220),
            y: y ?? VultureHazard.laneY(setup, lane),
            speedX: speedX ?? VultureHazard.laneSpeed(lane),
            seed
        });

        setup.effects.push(h);
        return h;
    }

    // lanes für vulture:
    // - duck: fliegt auf duck-höhe -> muss ducken (oder duck-walk)
    // - safe: fliegt hoch -> kann einfach weiterlaufen
    // - jump: (optional) eher selten; wenn du willst: sehr low -> muss springen
    static laneY(setup, lane) {
        const c = setup.world.character;
        const baseY = c ? c.y : 400;
        const h = c ? c.height : 300;

        // eher am oberen Körper orientieren, damit "duck" wirklich relevant ist
        if (lane === 'safe') return baseY + h * 0.18;  // hoch
        if (lane === 'jump') return baseY + h * 0.52;  // tiefer (optional)
        return baseY + h * 0.30;                       // duck-line (mid)
    }

    static laneSpeed(lane) {
        if (lane === 'jump') return -18;
        if (lane === 'duck') return -20;
        return -16;
    }

    constructor(setup, cfg = {}) {
        const flyAnim = setup.entityImages.vulture?.fly;

        super(setup, {
            kind: 'vulture',
            anim: flyAnim,
            animName: 'fly',
            fps: 10,

            width: 260,
            height: 180,

            // vulture ist eher ein "swoop": kurze aktive Phase
            telegraphMs: 350,
            activeMs: 350,
            lifeMs: 1600,

            speedX: -18,

            // hitbox eher “Körper” (Flügel rausnehmen)
            offset: { top: 55, left: 95, right: 95, bottom: 55 },

            ...cfg,
        });

        // interne defaults (nicht im Controller)
        this.damage = 1;
        this.knockback = 10;

        // optional impact (wenn du bei Hit kurz puffen willst)
        this.hitAnim = setup.entityImages.projectile?.fireball?.idleExplodeSheet ?? null;

        // anti-multi-hit
        this._hitOnce = false;
    }

    onHitCharacter(character, setup, now) {
        if (this._hitOnce) return;
        this._hitOnce = true;

        // Damage/Hurt
        character.hurtUntil = Math.max(character.hurtUntil ?? 0, now + 300);

        // Knockback: wenn von rechts kommt (speedX < 0) -> schub nach links (negativ)
        const dir = (this.speedX ?? -1) < 0 ? -1 : 1;
        character.knockbackVelocityX = dir * this.knockback;

        // Optional Impact
        if (this.hitAnim) {
            const cx = this.x + this.width * 0.5;
            const cy = this.y + this.height * 0.5;
            setup.effects.push(new ImpactEffect(setup, {
                anim: this.hitAnim,
                animName: 'explode',
                fps: 18,
                width: 220,
                height: 220,
                x: cx - 110,
                y: cy - 110,
                jitter: 6
            }));
        }

        // nach Hit weg
        this.markedForRemoval = true;
    }
}