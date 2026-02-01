import { AnimatedEntity } from './animated-entity.class.js';
import { EventManager } from './event-manager.class.js';
import { QuestManager } from './quest-manager.class.js';
import { EarthquakeEffect } from './earthquake-effect.class.js';
import { WindParticle } from './wind-particle.class.js';


export class FarmLevelController {
    constructor(setup) {
        this.setup = setup;
        this.world = setup.world;
        this.ctx = this.world.ctx;
        this.canvas = this.world.canvas;
        this.addObject = this.world.addObject.bind(this.world);
        this.addToWorld = this.world.addToWorld.bind(this.world);
        this.character = this.world.character;
        this.checkPressKey = this.world.checkPressKey.bind(this.world);
        this.keyboard = this.world.keyboard;
        this.stepSoundCharacter = this.world.stepSoundCharacter.bind(this.world);
        this.landingSoundCharacter = this.world.landingSoundCharacter.bind(this.world);
        this.earthquake = new EarthquakeEffect(this.setup, this.ctx);
        this.init();
    }

    init() {
        this.collections = [
            this.setup.characters,
            this.setup.cutsceneActors,
            this.setup.environment
        ]
        this.initManager();
        this.initWind();
        const worldWidth = this.canvas.width * 9;   // ganze Spielweltbreite
        const worldHeight = this.canvas.height;

        // 🌫️ Feiner, dichter Staub
        this.dustParticles = Array.from({ length: 500 }, () => ({
            x: Math.random() * worldWidth,
            y: Math.random() * worldHeight,
            r: Math.random() * 1.2 + 0.4,          // kleine Partikel
            speedX: (Math.random() - 0.5) * 0.25,  // sanfte horizontale Bewegung
            speedY: (Math.random() - 0.5) * 0.15,
            alpha: Math.random() * 0.4 + 0.3       // leicht sichtbar
        }));
    }

    initManager() {
        this.eventManager = new EventManager(this.setup);
        this.questManager = new QuestManager(this.setup, this.eventManager, this.setup.farmEvents);
        this.eventManager.questManager = this.questManager;
        this.questManager.step = 1;
        this.timerManager = this.setup.timerManager;
    }

    initWind() {
        this.windParticles = new WindParticle(this.canvas.width * 9, this.canvas.height, 1000);
    }

    update(timestamp) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateCamera();
        this.earthquake.handle(timestamp);
        this.renderBackgrounds();
        this.renderStatusBar();
        this.renderNPCsAndCharacter();
        this.earthquake.restore();
        this.drawDustParticles();
        // this.drawAtmosphere();
        // this.drawSunGlow()

        // this.drawHeatHaze()
        this.updateCharacter(timestamp);
        this.updateEntities(timestamp, this.collections);
        this.updateSunAndMoonCycle(timestamp);
        this.eventManager.update();
        this.questManager.update();
        // this.eventManager.debug = true;
        this.renderAfterDark()
        if (this.questManager.step >= 20) this.windParticles.update();
        for (const cloud of this.setup.farmLevel.clouds) {
            cloud.update(timestamp);
        }
        this.handleCharacterHitbox();
        this.handleHint();
        this.handlePopup();
        this.timerManager.update();
    }

    updateCamera() {
        this.camera_x = this.setup.world.camera_x;
        this.renderCameraX = Math.round(this.camera_x);

    }

    renderBackgrounds() {
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX * 0.2, 0);
        this.addObject(this.setup.farmLevel.sky);
        this.ctx.restore();
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX * 0.4, 0);
        this.addObject(this.setup.farmLevel.clouds);
        this.ctx.restore();
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX * 0.5, 0);
        this.addObject(this.setup.farmLevel.grounds.backGrounds);
        this.ctx.restore();
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX * 0.75, 0);
        this.addObject(this.setup.farmLevel.grounds.midGrounds);
        this.ctx.restore();
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX * 1.0, 0);
        this.addObject(this.setup.farmLevel.grounds.foreGrounds);
        this.ctx.restore();
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX * 1.0, 0);
        this.addObject(this.setup.farmLevel.towns);
        this.ctx.restore();
    }

    renderStatusBar() {
        if (this.setup.isGamecharacterInHouse) {
            return;
        }
        this.addToWorld(this.setup.statusBar);
    }

    renderNPCsAndCharacter() {
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX, 0);
        if (this.questManager.step < 10) this.addToWorld(this.setup.characters.bird);
        this.addObject(this.setup.environment.trees);
        this.addObject(this.setup.environment.flowers);
        if (this.questManager.step === 10) this.addToWorld(this.setup.environment.sun);
        this.addToWorld(this.setup.environment.house);


        this.ctx.save();
        this.ctx.shadowColor = "rgba(0,0,0,0.4)";
        this.ctx.shadowBlur = 10;
        this.ctx.shadowOffsetX = 5;
        this.ctx.shadowOffsetY = 5;
        this.addToWorld(this.setup.farmLevel.towns[0]);
        this.ctx.restore();
        this.addToWorld(this.setup.environment.stable);
        if (this.questManager.step < 8) this.addToWorld(this.setup.environment.campfire);
        this.setup.environment.house.isFlipped = false;
        this.setup.environment.stable.isFlipped = false;
        if (!this.setup.isGamecharacterInHouse) {
            if (this.character.isCaress) {
                this.addToWorld(this.character);
                this.addToWorld(this.setup.characters.cow);
            } else {
                if (this.questManager.step < 8) this.addToWorld(this.setup.characters.cow);
                if (this.questManager.step < 8 || this.questManager.step > 18) this.addToWorld(this.character);
            }
        }
        this.addToWorld(this.setup.environment.pond);


        this.ctx.restore();
        if (this.questManager.step >= 20) this.windParticles.draw(this.ctx, this.renderCameraX);
    }

    renderAfterDark() {
        if (this.questManager.step >= 8) {
            this.ctx.save();
            this.ctx.translate(-this.renderCameraX, 0);
            if (this.questManager.step < 14) this.world.addToWorld(this.setup.characters.cow);
            if (this.questManager.step < 13) this.world.addToWorld(this.setup.world.character);
            this.world.addToWorld(this.setup.environment.campfire);
            if (this.questManager.step < 14) this.world.addToWorld(this.setup.characters.chick);
            if (this.questManager.step < 14) this.world.addToWorld(this.setup.characters.chicken);
            if (this.questManager.step < 14) this.world.addToWorld(this.setup.environment.moon);
            if (this.questManager.step >= 14 && this.questManager.step < 18) {
                this.addToWorld(this.setup.characters.drone);
                this.addToWorld(this.setup.cutsceneActors.chickenHypno);
                this.addToWorld(this.setup.cutsceneActors.cowHypno);
                this.addToWorld(this.setup.cutsceneActors.chickHypno);
            }
            this.ctx.restore();
        }
    }

    updateCharacter(timestamp) {
        this.checkPressKey();
        this.character.updateState(timestamp);
        this.character.updateAnimation(timestamp);
        if (this.character.isJumping) this.character.applyGravity(timestamp);
        this.stepSoundCharacter(timestamp);
        this.landingSoundCharacter();
    }

    updateEntities(timestamp, collections) {
        for (const collection of collections) {
            const entities = Object.values(collection);
            for (const entity of entities) {
                if (!entity) continue;
                if (Array.isArray(entity)) {
                    for (const e of entity) {
                        e.updateState(timestamp);
                    }
                }
                else if (typeof entity === "object" && !Array.isArray(entity) && !(entity instanceof AnimatedEntity)) {
                    for (const sub of Object.values(entity)) {
                        sub.updateState(timestamp);
                    }
                }
                else {
                    entity.updateState(timestamp);
                }
            }
        }
    }

    handlePopup() {
        const now = performance.now();
        this.setup.popupTexts.forEach(p => p.draw(this.ctx, now));
        this.setup.popupTexts = this.setup.popupTexts.filter(p => p.active);
    }

    updateSunAndMoonCycle(timestamp) {
        this.setup.sunCycle.update(timestamp);
        this.setup.moonCycle.update(timestamp);
    }

    drawAtmosphere() {
        const ctx = this.ctx;
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        const t = Date.now() * 0.0002; // langsame Animation
        const flicker = 0.35 + Math.sin(t) * 0.05; // 0.3 – 0.4 Alpha Variation

        const h = ctx.canvas.height;
        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, `rgba(160, 190, 255, ${flicker + 0.1})`);
        gradient.addColorStop(0.5, `rgba(210, 220, 255, ${flicker * 0.6})`);
        gradient.addColorStop(1, `rgba(40, 30, 60, ${flicker + 0.2})`);

        ctx.globalCompositeOperation = 'soft-light';
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, ctx.canvas.width, h);
        ctx.restore();
    }





    drawDustParticles() {
        const ctx = this.ctx;
        const cameraX = this.renderCameraX;
        const canvasW = this.canvas.width;
        const canvasH = this.canvas.height;
        const worldW = canvasW * 9;

        ctx.save();
        ctx.globalCompositeOperation = 'lighter'; // additiver Glanz

        const time = Date.now() * 0.002;

        this.dustParticles.forEach(p => {
            const screenX = p.x - cameraX * 0.9; // leichte Parallax-Bewegung
            if (screenX < -50 || screenX > canvasW + 50) return;

            // sanftes Flimmern
            const flicker = 0.7 + Math.sin(time + p.x * 0.005) * 0.2;
            const alpha = p.alpha * flicker;

            ctx.globalAlpha = alpha;

            // leichter Glow mit radialem Verlauf
            const gradient = ctx.createRadialGradient(screenX, p.y, 0, screenX, p.y, p.r * 2.2);
            gradient.addColorStop(0, `rgba(255,255,255,${alpha})`);
            gradient.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = gradient;

            ctx.beginPath();
            ctx.arc(screenX, p.y, p.r * 2, 0, Math.PI * 2);
            ctx.fill();

            // Bewegung
            p.x += p.speedX;
            p.y += p.speedY;

            // Loop
            if (p.x < 0) p.x = worldW;
            if (p.x > worldW) p.x = 0;
            if (p.y < 0) p.y = canvasH;
            if (p.y > canvasH) p.y = 0;
        });

        ctx.restore();
    }

    drawHeatHaze() {
        const ctx = this.ctx;
        const w = ctx.canvas.width;
        const h = ctx.canvas.height;
        const t = Date.now() * 0.002;

        ctx.save();
        ctx.globalAlpha = 0.05;
        ctx.globalCompositeOperation = 'overlay';

        for (let y = h * 0.6; y < h; y += 4) {
            const wave = Math.sin(y * 0.1 + t) * 4;
            ctx.fillStyle = 'rgba(255,255,255,0.2)';
            ctx.fillRect(wave, y, w, 1);
        }

        ctx.restore();
    }


    drawSunGlow() {
        const ctx = this.ctx;
        ctx.save();

        const gradient = ctx.createRadialGradient(
            ctx.canvas.width * 0.8,  // Position der Sonne (rechts oben)
            ctx.canvas.height * 0.2,
            0,
            ctx.canvas.width * 0.8,
            ctx.canvas.height * 0.2,
            400
        );

        gradient.addColorStop(0, 'rgba(255, 255, 200, 0.15)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.restore();
    }

    handleHint() {
        this.setup.hints.forEach(hint => hint.draw(this.ctx, this.renderCameraX));

    }

    handleCharacterHitbox() {
        const c = this.character;
        const ctx = this.ctx;

        if (!c || !c.attackHitbox || !c.attackHitbox.active) return;

        const hb = c.attackHitbox;
        ctx.save();

        if (c.isFlipped) {
            // Gespiegelt zeichnen
            ctx.translate(c.x + c.width, Math.round(c.y));
            ctx.scale(-1, 1);

            // Spiegle X-Position symmetrisch am Mittelpunkt des Sprites
            const hbX = c.width - (hb.left + (hb.width ?? (c.width - hb.left - hb.right)));
            const hbY = hb.top;
            const hbW = hb.width ?? (c.width - hb.left - hb.right);
            const hbH = hb.height ?? (c.height - hb.top - hb.bottom);

            ctx.strokeStyle = "rgba(0,255,255,0.8)";
            ctx.lineWidth = 2;
            ctx.strokeRect(hbX, hbY, hbW, hbH);
        } else {
            // Normale Richtung
            const drawX = Math.round(c.x + hb.left);
            const drawY = Math.round(c.y + hb.top);
            const hbW = hb.width ?? (c.width - hb.left - hb.right);
            const hbH = hb.height ?? (c.height - hb.top - hb.bottom);

            ctx.strokeStyle = "rgba(0,255,255,0.8)";
            ctx.lineWidth = 2;
            ctx.strokeRect(drawX, drawY, hbW, hbH);
        }

        ctx.restore();
    }





}