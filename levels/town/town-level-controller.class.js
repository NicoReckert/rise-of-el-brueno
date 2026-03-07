import { EventManager } from '../../classes/systems/event-manager.class.js';
import { QuestManager } from '../../classes/systems/quest-manager.class.js';
import { SandstormEffect } from '../../classes/effects/sandstorm-effect.class.js';
import { MagicShieldEffect } from '../../classes/effects/magic-shield-effect.class.js';
import { EssenceTrailParticle } from '../../classes/effects/essence-trail-particle.class.js';
import { WindParticleEffect } from '../../classes/effects/wind-particle.class.js';
import { TimerManager } from '../../classes/systems/timer-manager.class.js';
import { ThrowBottleSystem } from '../../classes/systems/throw-bottle-system.class.js';
import { DarkEnergyEffect } from '../../classes/effects/dark-energy-effect.class.js';
import { StormHazardSystem } from '../../classes/systems/storm-hazard-system.class.js';

export class TownLevelController {
    constructor(setup) {
        this.setup = setup;
        this.world = setup.world;
        this.ctx = this.world.ctx;
        this.canvas = this.world.canvas;
        this.inputManager = this.world.inputManager;
        this.addObject = this.world.renderer.addObject.bind(this.world.renderer);
        this.addToWorld = this.world.renderer.addToWorld.bind(this.world.renderer);
        this.character = this.world.character;
        this.keyboard = this.world.keyboard;
        this.sandstorm = new SandstormEffect(this.canvas, this.setup.entityImages);
        this.sandstormNear = new SandstormEffect(this.canvas, this.setup.entityImages); // schneller, heller
        this.sandstormFar = new SandstormEffect(this.canvas, this.setup.entityImages); // langsamer, dunkler
        this.dialogManager = this.setup.dialogManager;

        // this.sandstormFar.setAlpha(0.04);
        // this.sandstormFar.setSpeed(0.20);
        // this.sandstorm.setAlpha(0.10);
        // this.sandstorm.setSpeed(0.5);
        // this.sandstormNear.setAlpha(0.16);
        // this.sandstormNear.setSpeed(1.2);
        this.sandstormIntensity = 0;
        this.setSandstorm(this.sandstormIntensity);
        this.eventManager = new EventManager(this.setup);
        this.eventManager.debug = true;
        this.questManager = new QuestManager(this.setup, this.eventManager, this.setup.townEvents);
        this.eventManager.questManager = this.questManager;
        this.timerManager = new TimerManager();
        this.magicShield = new MagicShieldEffect(this.canvas);
        this.magicShield.onShockwave = () => {
            this.sandstorm.pressure = 0.4;
            this.sandstormNear.pressure = 0.6;
            this.sandstormFar.pressure = 0.2;
        };
        this.windParticleEffect = new WindParticleEffect(this.canvas.width * 38, this.canvas.height, 1200);
        this.setup.damageTexts ||= [];
        this.throwBottleSystem = new ThrowBottleSystem({
            world: this.world,
            setup: this.setup,
            animName: 'throw',
            releaseFrame: 4,
        });
        this.darkEnergyEffect = new DarkEnergyEffect(this.canvas.width, this.canvas.height, 6, {
            yMin: this.canvas.height * 0.06,
            yMax: this.canvas.height * 0.38,
            alphaMin: 0.12,
            alphaMax: 0.28,
            minWidth: 4,
            maxWidth: 11,
            minLen: 320,
            maxLen: 820,
        });
        this.stormHazards = new StormHazardSystem({
            world: this.world,
            setup: this.setup,
            canvas: this.canvas
        });
    }

    update(timestamp) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.magicShield.update(timestamp);

        this.updateCamera();

        this.renderBackgrounds();
        this.renderNPCsAndCharacter();
        this.updateCharacter(timestamp);
        this.updateEntities(timestamp);
        this.updateEndboss(timestamp);
        this.updateCoins(timestamp);
        this.handlePopup();
        for (const cloud of this.setup.townLevel.clouds) {
            cloud.update(timestamp);
        }
        this.sandstorm.update();
        this.sandstormNear.update();
        this.sandstormFar.update();
        this.eventManager.update();
        this.renderStatusBar();
        this.setup.panel.update(timestamp);
        this.setup.panel.draw(this.ctx);
        // this.windParticleEffect.update();
        this.updateSpiritEssenceSequence(timestamp);
        if (Array.isArray(this.setup.damageTexts)) {
            this.setup.damageTexts = this.setup.damageTexts.filter(dt => dt?.update?.(timestamp) !== false);
        }
        this.timerManager.update();
        this.darkEnergyEffect.update(timestamp, this.renderCameraX, this.canvas.width);
        // immer pro frame:
        this.stormHazards.update(timestamp);
        this.dialogManager.update(timestamp);
        this.dialogManager.draw(this.ctx);
    }

    updateCamera() {
        this.camera_x = this.setup.world.camera_x;
        this.renderCameraX = Math.round(this.camera_x);

    }

    renderBackgrounds() {
        this.addToWorld(this.setup.townLevel.sky);
        this.darkEnergyEffect.draw(this.ctx, this.renderCameraX);
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX * 0.4, 0);
        this.ctx.globalAlpha = 0.55;        // deutlich sichtbar
        this.ctx.filter = "blur(1px)";
        this.addObject(this.setup.townLevel.clouds);
        this.ctx.restore();
        this.ctx.filter = "none";
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX * 0.5, 0);
        this.addObject(this.setup.townLevel.grounds.backGrounds);
        this.ctx.restore();
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX * 0.75, 0);
        this.addObject(this.setup.townLevel.grounds.midGrounds);
        this.ctx.restore();
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX * 1.0, 0);
        this.addObject(this.setup.townLevel.grounds.foreGrounds);
        this.ctx.restore();
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX * 1.0, 0);
        this.addObject(this.setup.townLevel.sceneryObjects);
        this.ctx.restore();
    }

    renderStatusBar() {
        this.addToWorld(this.setup.statusBar);
        if (this.questManager.step >= 10) this.addToWorld(this.setup.statusBar2);
        this.addToWorld(this.setup.coinBar);
        this.addToWorld(this.setup.bottleBar);
    }

    renderNPCsAndCharacter() {
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX, 0);
        // this.addToWorld(this.setup.environment.fire);

        this.addToWorld(this.setup.environment.houseDestroyed);
        this.addToWorld(this.setup.environment.stableDestroyed);
        this.addToWorld(this.setup.environment.millDestroyed);
        this.addToWorld(this.setup.characters.tadeo);

        this.addToWorld(this.character);
        this.addToWorld(this.throwBottleSystem.heldBottle);
        this.setup.damageTexts.forEach(dt => dt.draw(this.ctx));
        this.addToWorld(this.setup.environment.juanitoSpirit);
        this.addToWorld(this.setup.environment.pollitoSpirit);
        this.addToWorld(this.setup.environment.lolaSpirit);
        this.addToWorld(this.setup.environment.nayeliSpirit);
        this.addToWorld(this.setup.environment.spiritEssence1);
        this.addToWorld(this.setup.environment.spiritEssence2);
        this.addToWorld(this.setup.environment.spiritEssence3);
        // this.addToWorld(this.setup.environment.macuahuitl);
        this.addObject(this.setup.townLevel.coins);
        this.addObject(this.setup.townLevel.bottles);
        this.addObject(this.setup.endbossAttack.eggs);
        this.addObject(this.setup.townLevel.enemies);
        this.addObject(this.setup.townLevel.projectiles);
        this.addObject(this.setup.effects);
        this.addToWorld(this.setup.endbossAttack);
        this.addObject(this.setup.throwableObjects);
        this.addToWorld(this.setup.environment.rockyDesertPedestal);

        if (!this.setup.characters.endboss.isUnderTheGround) {
            this.addToWorld(this.setup.characters.soul);
            // this.setup.characters.soul.updateState('idle', 1000 / 6);

            this.addToWorld(this.setup.characters.endboss);
        }
        this.addToWorld(this.setup.characters.sollita);
        this.addToWorld(this.setup.characters.musician);
        // this.windParticleEffect.draw(this.ctx, this.renderCameraX);
        this.ctx.restore();
        // this.sandstorm.draw(this.ctx, this.renderCameraX);
        // this.sandstormFar.draw(this.ctx, this.renderCameraX);
        // this.sandstormNear.draw(this.ctx, this.renderCameraX);
        // Tadeo screen position
        const sx = this.setup.characters.tadeo.x - this.renderCameraX + this.setup.characters.tadeo.width / 2;
        const sy = this.setup.characters.tadeo.y + this.setup.characters.tadeo.height * 0.2;

        this.magicShield.draw(this.ctx, sx, sy);

        // Shield "hole" info für sandstorm
        const r = this.magicShield.radius * this.magicShield.introT;
        const shieldInfo = (this.magicShield.active && r > 1)
            ? { x: sx + this.magicShield.clipJitterX, y: sy + this.magicShield.clipJitterY, radius: r }
            : null;


        this.sandstormFar.draw(this.ctx, this.renderCameraX, shieldInfo);
        this.sandstorm.draw(this.ctx, this.renderCameraX, shieldInfo);
        this.sandstormNear.draw(this.ctx, this.renderCameraX, shieldInfo);
    }

    updateCharacter(timestamp) {
        this.inputManager.processGameInput(this.world, timestamp);
        this.character.updateAll(timestamp);
        this.setup.throwableObjects?.forEach(bottle => {
            bottle.updateState(timestamp);
            bottle.updateAnimation(timestamp);
        });
        this.setup.throwableObjects = this.setup.throwableObjects.filter(b => !b.markedForRemoval);
        this.setup.townLevel.projectiles.forEach(projectile => {
            projectile.updateState(timestamp);
        });
        this.setup.townLevel.projectiles =
            this.setup.townLevel.projectiles.filter(p => !p.markedForRemoval);
        // this.setup.effects.forEach(effect => {
        //     effect.updateState(timestamp);
        // });
        this.throwBottleSystem.update();

        this.setup.effects.forEach(e => e.updateState(timestamp));
        this.setup.effects = this.setup.effects.filter(e => !e.markedForRemoval);
    }

    updateEntities(timestamp) {
        Object.values(this.setup.characters)
            .filter(c => c !== this.setup.characters.endboss)
            .forEach(c => c.updateState(timestamp));

        Object.values(this.setup.environment)
            .forEach(c => c.updateState(timestamp));

        this.setup.townLevel.enemies.forEach(enemy => {
            enemy.updateState(timestamp);
        });
    }

    updateEndboss(timestamp) {
        this.setup.characters.endboss.updateAll(timestamp, this.setup);
        this.setup.endbossAttack.updateState(timestamp, this.setup.characters.endboss, this.setup);
        this.setup.endbossAttack.updateAnimation(timestamp);
        if (this.setup.characters.endboss.isJumping) this.setup.characters.endboss.applyGravityBoss(timestamp);
    }

    updateCoins(timestamp) {
        this.setup.townLevel.coins.forEach(coin => coin.updateAnimation(timestamp));
    }

    handlePopup() {
        const now = performance.now();
        this.setup.popupTexts.forEach(p => p.draw(this.ctx, now));
        this.setup.popupTexts = this.setup.popupTexts.filter(p => p.active);
    }

    cutSandstormInsideShield(ctx, x, y, radius) {
        ctx.save();
        ctx.globalCompositeOperation = "destination-out";

        ctx.beginPath();
        ctx.arc(x, y, radius * 0.9, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    setSandstorm(t) {
        t = Math.max(0, Math.min(1, t));

        // Weiche Grundkurve
        const eased = t * t * (3 - 2 * t);

        // Extra Boost nur in der letzten Phase (ab 0.7 -> 1.0)
        const boostT = Math.max(0, (t - 0.7) / 0.3); // 0..1
        const boost = boostT * boostT * (3 - 2 * boostT);

        // Near erst ab der Hälfte
        const nearT = Math.max(0, (t - 0.5) * 2);
        const nearE = nearT * nearT * (3 - 2 * nearT);

        // FAR: subtil
        this.sandstormFar.setAlpha(0.02 + (0.08 - 0.02) * eased);
        this.sandstormFar.setSpeed(0.15 + (0.70 - 0.15) * eased + 0.30 * boost);

        // MID: Hauptsturm – Speed wird am Ende sehr schnell
        this.sandstorm.setAlpha(0.05 + (0.17 - 0.05) * eased);
        this.sandstorm.setSpeed(0.40 + (2.10 - 0.40) * eased + 1.10 * boost);

        // NEAR: Akzent – am Ende richtig schnell, Alpha bleibt kontrolliert
        this.sandstormNear.setAlpha(0.00 + (0.20 - 0.00) * nearE);
        this.sandstormNear.setSpeed(0.90 + (4.80 - 0.90) * nearE + 1.80 * boost);
    }

    startSpiritEssenceSequence(timestamp) {
        const hero = this.character;

        const spirits = [
            this.setup.environment.juanitoSpirit,
            this.setup.environment.pollitoSpirit,
            this.setup.environment.lolaSpirit
        ];

        const essences = [
            this.setup.environment.spiritEssence1,
            this.setup.environment.spiritEssence2,
            this.setup.environment.spiritEssence3
        ];

        // Startposition (aus Bruno "Herz/Brust")
        const start = {
            x: hero.x + hero.width * 0.45,
            y: hero.y + hero.height * 0.35
        };

        this.setup.spiritEssenceSeq = {
            active: true,
            index: 0,
            nextTime: timestamp,
            essences,
            spirits,
            fadeOutDur: 220, // ms
            fadeOuts: [null, null, null],

            // Offsets relativ zu Bruno (werden jedes Frame zu absoluten Targets umgerechnet)
            targetOffsets: [
                { x: 20, y: -5 },
                { x: 15, y: 80 },
                { x: -140, y: 35 }
            ],

            start,

            // Bogen-Parameter (leicht, nicht kompliziert)
            arcAmp: 26,          // Höhe des Bogens
            arcWobble: 0.0,      // optional (0 lassen für clean)
            speed: 2.2,

            // Timing / Visuals
            fadeInSpeed: 0.04,
            arrivalDist: 10,
            delayBetween: 900,

            // pro Spirit separates reveal (damit nix "zu früh" erscheint)
            reveals: [null, null, null]
        };

        essences.forEach((e) => {
            e.x = start.x;
            e.y = start.y;
            e.opacity = 0; // erst leicht einblenden
            e.updateAnimationState("idle", 1000 / 10);
        });

        // Spirits erstmal unsichtbar lassen (wichtig, sonst “zu früh” sichtbar)
        spirits.forEach((s) => {
            s.opacity = 0;
        });
    }


    updateSpiritEssenceSequence(timestamp) {
        const seq = this.setup.spiritEssenceSeq;
        if (!seq?.active) return;

        const hero = this.character;

        if (timestamp < seq.nextTime) {
            // reveals laufen trotzdem weiter
        } else {
            const i = seq.index;
            const e = seq.essences[i];
            const s = seq.spirits[i];
            const off = seq.targetOffsets[i];

            if (!e || !s || !off) {
                seq.active = false;
                return;
            }

            // Ziel JETZT berechnen (Offsets -> absolute)
            const tx = hero.x + off.x;
            const ty = hero.y + off.y;

            // 1) Essence einblenden (früher sichtbar)
            e.opacity = Math.min(1, (e.opacity ?? 0) + seq.fadeInSpeed);

            // 2) Bogenflug (leicht):
            // Wir bewegen intern in Richtung Ziel, aber addieren eine kleine Arc-Komponente,
            // die gegen Ende verschwindet.
            const dx = tx - e.x;
            const dy = ty - e.y;
            const dist = Math.hypot(dx, dy) || 1;

            // normalisierter Richtungsvektor
            const nx = dx / dist;
            const ny = dy / dist;

            // Perpendikular (90°) für Arc
            const px = -ny;
            const py = nx;

            // Arc-Faktor: am Anfang stärker, am Ende 0
            const tArc = Math.min(1, dist / 220);   // 0..1 (wenn weit weg => stärker)
            const arc = seq.arcAmp * tArc;

            const step = Math.min(dist, seq.speed);

            // Basis Bewegung + Arc
            e.x += nx * step + px * (arc * 0.02);
            e.y += ny * step + py * (arc * 0.02);

            // 3) Trail Partikel (sitzt genau "auf" der Essence, leicht hinter Flugrichtung)
            // -> Center der Essence + hinten entlang -nx/-ny
            const back = 14;
            const pX = (e.x + e.width * 0.5) - nx * back;
            const pY = (e.y + e.height * 0.5) - ny * back;

            // particle half size (wenn deine Partikel 18x18 sind)
            const half = 9;
            this.setup.effects.push(new EssenceTrailParticle(e.img, pX - half, pY - half));

            // 4) angekommen?
            // 4) angekommen?
            if (dist <= seq.arrivalDist) {

                // ✅ Essence Fade-Out starten (weich)
                if (!seq.fadeOuts[i]) {
                    seq.fadeOuts[i] = { start: timestamp, dur: seq.fadeOutDur, from: e.opacity ?? 1 };
                }

                // ✅ Spirit wird erst revealed, wenn Essence wirklich weg ist
                const fo = seq.fadeOuts[i];
                const ft = Math.min(1, (timestamp - fo.start) / fo.dur);
                e.opacity = fo.from * (1 - ft);

                if (ft >= 1) {
                    e.opacity = 0;
                    seq.fadeOuts[i] = null;

                    // Spirit exakt ans Ziel setzen + reveal starten
                    s.x = tx;
                    s.y = ty;
                    s.opacity = 0;
                    s.updateAnimationState("spiritCuddle", 1000 / 4);
                    seq.reveals[i] = { start: timestamp, dur: 700 };

                    // nächstes Essence
                    seq.index++;
                    seq.nextTime = timestamp + seq.delayBetween;
                }

                // ganz wichtig: während Fade-Out hier stoppen, sonst läuft Move weiter
                return;
            }

        }

        // 5) reveals parallel updaten (alle Spirits)
        seq.reveals.forEach((r, idx) => {
            if (!r) return;
            const spirit = seq.spirits[idx];
            const tt = Math.min(1, (timestamp - r.start) / r.dur);
            spirit.opacity = tt;
            if (tt >= 1) seq.reveals[idx] = null;
        });

        if (seq.index >= seq.essences.length && seq.reveals.every(r => !r)) {
            seq.active = false;
        }
    }
}