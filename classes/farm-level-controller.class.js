class FarmLevelController {
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
    }

    initManager() {
        this.eventManager = new EventManager(this.setup);
        this.questManager = new QuestManager(this.setup, this.eventManager, this.setup.farmEvents);
        this.eventManager.questManager = this.questManager;
        this.questManager.step = 1;
        this.timerManager = this.setup.timerManager;
    }

    initWind() {
        this.windParticles = new WindParticleEffect(this.canvas.width * 9, this.canvas.height, 1000);
    }

    update(timestamp) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateCamera();
        this.earthquake.handle(timestamp);
        this.renderBackgrounds();
        this.renderStatusBar();
        this.renderNPCsAndCharacter();
        this.earthquake.restore();
        this.handlePopup();
        this.setup.taskWindow.update();
        this.setup.taskWindow.draw(this.ctx);
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
    }

    updateCamera() {
        this.camera_x = this.setup.world.camera_x;
        this.renderCameraX = Math.round(this.camera_x);

    }

    renderBackgrounds() {
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX, 0);
        this.addObject(this.setup.farmLevel.sky);
        this.addObject(this.setup.farmLevel.clouds);
        this.addObject(this.setup.farmLevel.grounds);
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
            if (this.questManager.step < 14) this.world.addToWorld(this.setup.characters.chick);
            if (this.questManager.step < 14) this.world.addToWorld(this.setup.characters.chicken);
            this.world.addToWorld(this.setup.environment.campfire);
            if (this.questManager.step < 13) this.world.addToWorld(this.setup.world.character);
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
}