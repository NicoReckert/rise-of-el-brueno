import { StormHazard } from './storm-hazard.class.js';
import { ImpactEffect } from './impact-effect.class.js';

export class TumbleweedHazard extends StormHazard {
    static spawn(setup, { x, y, lane = 'ground', speedX, seed } = {}) {
        const camX = setup.world.townLevelController?.renderCameraX ?? 0;
        const canvasW = setup.world.canvas?.width ?? 1280;

        const h = new TumbleweedHazard(setup, {
            x: x ?? (camX + canvasW + 200),
            y: y ?? TumbleweedHazard.laneY(setup, lane),
            speedX: speedX ?? TumbleweedHazard.laneSpeed(lane),
            seed
        });

        setup.effects.push(h);
        return h;
    }

    static laneY(setup, lane) {
        const c = setup.world.character;
        const groundY = c ? (c.y + c.height * 0.70) : 520;
        if (lane === 'jump') return groundY + 10;     // low -> muss springen
        if (lane === 'duck') return groundY - 120;    // mid -> muss ducken
        return groundY;                               // safe/high -> kann laufen
    }

    static laneSpeed(lane) {
        if (lane === 'jump') return -16;
        if (lane === 'duck') return -14;
        return -12;
    }

    constructor(setup, cfg = {}) {
        const rollAnim = setup.entityImages.tumbleweed?.roll;
        super(setup, {
            kind: 'tumbleweed',
            anim: rollAnim,
            animName: 'roll',
            fps: 16,

            width: 220,
            height: 220,

            telegraphMs: 0,
            activeMs: 9999,
            lifeMs: 4000,

            speedX: -14,

            ...cfg,
        });

        // interne Defaults (nicht im Controller)
        this.damage = 1;
        this.knockback = 12;
        this.explodeAnim = setup.entityImages.projectile?.fireball?.idleExplodeSheet ?? null;
        this.setOffset();
        this.isGamecharacter = true;
    }

    setOffset() {
        this.offset.top = 55;
        this.offset.left = 55;
        this.offset.right = 48;
        this.offset.bottom = 50;
    }


    onHitCharacter(character, setup, now) {
        character.hurtUntil = now + 350;
        character.knockbackVelocityX = (this.speedX < 0 ? -1 : 1) * this.knockback;

        if (this.explodeAnim) {
            const rx = this.getRenderX?.() ?? this.x;
            const cx = rx + this.width * 0.5;
            const cy = this.y + this.height * 0.5;

            setup.effects.push(new ImpactEffect(
                this.explodeAnim,
                cx - 110,
                cy - 110,
                { fps: 18, width: 220, height: 220 } // erstmal ohne animName testen
            ));
        }

        this.markedForRemoval = true;
    }
}