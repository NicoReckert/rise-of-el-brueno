import { AnimatedEntity } from '../../classes/entities/animated-entity.class.js';
import { EventManager } from '../../classes/systems/event-manager.class.js';
import { QuestManager } from '../../classes/systems/quest-manager.class.js';
import { EarthquakeEffect } from '../../classes/effects/earthquake-effect.class.js';
import { WindParticleEffect } from '../../classes/effects/wind-particle.class.js';
import { FarmRenderer } from './controllers/farm-renderer.class.js';
import { DustParticle } from '../../classes/effects/dust-particle.class.js';

export class FarmLevelController {
    constructor(setup) {
        this.setup = setup;
        this.world = setup.world;
        this.ctx = this.world.ctx;
        this.canvas = this.world.canvas;
        this.addObject = this.world.renderer.addObject.bind(this.world.renderer);
        this.addToWorld = this.world.renderer.addToWorld.bind(this.world.renderer);
        this.character = this.world.character;
        this.inputManager = this.world.inputManager;
        this.keyboard = this.world.keyboard;
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
        this.renderer.windParticleEffect = this.windParticleEffect;
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
        this.inputManager.processGameInput(this.world, timestamp);
        this.character.updateAll(timestamp);
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