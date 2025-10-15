class NayelisHouseLevelController {
    constructor(setup, farmLevelSetup) {
        this.setup = setup;
        this.world = setup.world;
        this.farmLevelSetup = farmLevelSetup;
        this.ctx = this.world.ctx;
        this.canvas = this.world.canvas;
        this.addObject = this.world.addObject.bind(this.world);
        this.addToWorld = this.world.addToWorld.bind(this.world);
        this.character = this.world.character;
        this.checkPressKey = this.world.checkPressKey.bind(this.world);
        this.keyboard = this.world.keyboard;
        this.stepSoundCharacter = this.world.stepSoundCharacter.bind(this.world);
        this.landingSoundCharacter = this.world.landingSoundCharacter.bind(this.world);
        this.eventManager = new EventManager(this.setup);
        this.questManager = new QuestManager(this.setup, this.eventManager, this.setup.nayelisHouseEvents);
        this.eventManager.questManager = this.questManager;
        this.init();
    }

    init() {
       
    }

    update(timestamp) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateCamera();
        this.renderBackgrounds();
        this.renderStatusBar();
        this.renderNPCsAndCharacter();
        this.updateCharacter(timestamp);
        this.updateEntities(timestamp);
        this.handlePopup();
        this.eventManager.update();
        this.eventManager.debug = true;
    }

    updateCamera() {
        this.camera_x = this.setup.world.camera_x;
        this.renderCameraX = Math.round(this.camera_x);
        // this.renderCameraX = 0;
    }

    renderBackgrounds() {
        const house = this.setup.nayelisHouseLevel.towns[0];
        const fadeStrength = 0.05; // 5% links und rechts

        // === 1. Hintergrundvideo zeichnen ===
        if (this.setup.video.readyState >= 2) {
            this.ctx.save();
            this.ctx.globalAlpha = 0.8;
            this.ctx.filter = 'brightness(0.8)';
            this.ctx.drawImage(this.setup.video, 0, 0, this.canvas.width, this.canvas.height);
            this.ctx.restore();
        }

        // === 2. Offscreen-Canvas für das Haus ===
        const houseCanvas = document.createElement('canvas');
        houseCanvas.width = house.width;
        houseCanvas.height = house.height;
        const houseCtx = houseCanvas.getContext('2d');

        // Haus (oder alle Objekte im Haus) auf Offscreen zeichnen
        this.addToWorld({ ...house, x: 0, y: 0 }, houseCtx);

        // === 3. ECHTER, SANFTER ALPHA-Fade an den Rändern ===
        const fs = fadeStrength;
        const fsMid = fs * 0.45; // 0.4
        const fade = houseCtx.createLinearGradient(0, 0, house.width, 0);

        fade.addColorStop(0.0, 'rgba(0,0,0,0)');
        fade.addColorStop(fsMid, 'rgba(0,0,0,0.0)'); // 0.4
        fade.addColorStop(fs, 'rgba(0,0,0,1)');
        fade.addColorStop(1 - fs, 'rgba(0,0,0,1)');
        fade.addColorStop(1 - fsMid, 'rgba(0,0,0,0.0)'); // 0.4
        fade.addColorStop(1.0, 'rgba(0,0,0,0)');

        houseCtx.globalCompositeOperation = 'destination-in';
        houseCtx.fillStyle = fade;
        houseCtx.fillRect(0, 0, house.width, house.height);
        houseCtx.globalCompositeOperation = 'source-over';

        // === 4. Hausbild mit Fade auf Hauptcanvas zeichnen ===
        this.ctx.save();
        this.ctx.translate(house.x - this.renderCameraX, house.y);
        this.ctx.filter = 'brightness(1.1)';
        this.ctx.drawImage(houseCanvas, 0, 0);
        this.ctx.restore();
    }

    renderStatusBar() {
        this.addToWorld(this.setup.statusBar);
    }

    renderNPCsAndCharacter() {
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX, 0);
        this.ctx.shadowColor = 'rgba(255, 255, 200, 0.8)';
        this.ctx.shadowBlur = 20;
        this.addToWorld(this.character);
        this.ctx.shadowBlur = 0;
        this.ctx.shadowColor = 'rgba(255, 255, 200, 0.8)';
        this.ctx.shadowBlur = 20;
        this.addToWorld(this.setup.characters.nayeli);
        this.ctx.shadowBlur = 0;
        this.ctx.restore();
    }

    updateCharacter(timestamp) {
        this.checkPressKey();
        this.character.updateState(timestamp);
        this.character.updateAnimation(timestamp);
        if (this.character.isJumping) this.character.applyGravity(timestamp);
        this.stepSoundCharacter(timestamp);
        this.landingSoundCharacter();
    }

    updateEntities(timestamp) {
        Object.values(this.setup.characters).forEach(element => {
            element.updateState(timestamp);
        });
    }


    handlePopup() {
        const now = performance.now();
        this.setup.popupTexts.forEach(p => p.draw(this.ctx, now));
        this.setup.popupTexts = this.setup.popupTexts.filter(p => p.active);
    }
}