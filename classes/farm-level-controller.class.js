import { AnimatedEntity } from './animated-entity.class.js';
import { EventManager } from './event-manager.class.js';
import { QuestManager } from './quest-manager.class.js';
import { EarthquakeEffect } from './earthquake-effect.class.js';
import { WindParticleEffect } from './wind-particle.class.js';
import { FarmRenderer } from '../levels/farm/controllers/farm-renderer.class.js';
import { DustParticle } from './dust-particle.class.js';

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
        this.renderer = new FarmRenderer(setup, this.world);
        this.dustParticle = new DustParticle(this.canvas);
        this.init();
        this.eventManager.debug = true;
    }

    init() {
        this.collections = [
            this.setup.characters,
            this.setup.cutsceneActors,
            this.setup.environment
        ]
        this.initManager();
        this.initWind();
    }

    initManager() {
        this.eventManager = new EventManager(this.setup);
        this.questManager = new QuestManager(this.setup, this.eventManager, this.setup.farmEvents);
        this.eventManager.questManager = this.questManager;
        this.questManager.step = 1;
        this.timerManager = this.setup.timerManager;
    }

    initWind() {
        this.windParticleEffect = new WindParticleEffect(this.canvas.width * 9, this.canvas.height, 1000);
    }

    update(timestamp) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateCamera();
        this.earthquake.render(timestamp, () => {
            this.renderer.render(this.renderCameraX, this.questManager.step);
            this.renderStatusBar();
        });
        this.dustParticle.update(this.ctx, this.renderCameraX);
        this.updateCharacter(timestamp);
        this.updateEntities(timestamp, this.collections);
        this.updateSunAndMoonCycle(timestamp);
        this.eventManager.update();
        this.questManager.update();
        this.renderer.renderAfterDark(this.questManager.step, this.renderCameraX);
        if (this.questManager.step >= 20) this.windParticleEffect.update();
        for (const cloud of this.setup.farmLevel.clouds) {
            cloud.update(timestamp);
        }
        this.handleHint();
        this.handlePopup();
        this.timerManager.update();
    }

    updateCamera() {
        this.camera_x = this.setup.world.camera_x;
        this.renderCameraX = Math.round(this.camera_x);

    }

    renderStatusBar() {
        if (this.setup.state.isGamecharacterInHouse) {
            return;
        }
        this.addToWorld(this.setup.statusBar);
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
        this.setup.state.popupTexts.forEach(p => p.draw(this.ctx, now));
        this.setup.state.popupTexts = this.setup.state.popupTexts.filter(p => p.active);
    }

    updateSunAndMoonCycle(timestamp) {
        this.setup.sunCycle.update(timestamp);
        this.setup.moonCycle.update(timestamp);
    }

    handleHint() {
        this.setup.hints.forEach(hint => hint.draw(this.ctx, this.renderCameraX));

    }
}