class LevelCompleteController {
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
        this.eventManager = new EventManager(this.setup);
        this.questManager = new QuestManager(this.setup, this.eventManager, this.setup.levelCompleteEvents);
        this.eventManager.questManager = this.questManager;
        this.character.x = 290;
        this.world.camera_x = 0;

        this.heroTextAlpha = 0;
        this.heroTextScale = 0.5;

        this.charCanvas = document.createElement("canvas");
        this.charCanvas.width = this.setup.characters.levelCompleteCharacter.width;
        this.charCanvas.height = this.setup.characters.levelCompleteCharacter.height;
        this.charCtx = this.charCanvas.getContext("2d");
    }

    update(timestamp) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateCamera();
        this.renderBackgrounds();
        this.renderNPCs();
        this.updateEntities(timestamp);
        this.eventManager.update();
        // this.eventManager.debug = true;
        this.animateHeroText();
    }

    updateCamera() {
        this.camera_x = this.setup.world.camera_x;
        this.renderCameraX = Math.round(this.camera_x);
        this.renderCameraX = 0;
    }

    renderBackgrounds() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const video = this.setup.video;

        if (video.readyState >= 2) {
            ctx.save();

            // 1) Video zeichnen (leicht getuned)
            ctx.filter = 'brightness(0.9) contrast(1.2) saturate(1.2)';
            ctx.drawImage(video, 0, 0, w, h);
            ctx.filter = 'none';

            // 2) Unten Strahlen abdämpfen (sichtbar!)
            ctx.save();
            ctx.globalCompositeOperation = 'multiply';
            const gBottom = ctx.createLinearGradient(0, h * 0.7, 0, h);
            gBottom.addColorStop(0, 'rgba(0,0,0,0)');
            gBottom.addColorStop(1, 'rgba(0,0,0,0.65)'); // Stärke unten
            ctx.fillStyle = gBottom;
            ctx.fillRect(0, h * 0.7, w, h * 0.3);
            ctx.restore();

            // 3) Vignette ringsum (verstärktes Verschmelzen)
            ctx.save();
            ctx.globalCompositeOperation = 'multiply';
            const rIn = Math.min(w, h) * 0.35;
            const rOut = Math.min(w, h) * 0.75;
            const vignette = ctx.createRadialGradient(w * 0.5, h * 0.5, rIn, w * 0.5, h * 0.5, rOut);
            vignette.addColorStop(0, 'rgba(0,0,0,0)');
            vignette.addColorStop(1, 'rgba(0,0,0,0.5)'); // Vignette-Stärke
            ctx.fillStyle = vignette;
            ctx.fillRect(0, 0, w, h);
            ctx.restore();

            // 4) Spotlight hinter dem Charakter (trennt Figur vom BG)
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            const cx = this.setup.characters.levelCompleteCharacter.x + this.setup.characters.levelCompleteCharacter.width * 0.5;
            const cy = this.setup.characters.levelCompleteCharacter.y + this.setup.characters.levelCompleteCharacter.height * 0.6;
            const spot = ctx.createRadialGradient(cx, cy, 0, cx, cy,
                Math.max(this.setup.characters.levelCompleteCharacter.width, this.setup.characters.levelCompleteCharacter.height) * 1.2);
            spot.addColorStop(0, 'rgba(0,150,255,0.35)'); // innerer Glow
            spot.addColorStop(1, 'rgba(0,150,255,0)');
            ctx.fillStyle = spot;
            ctx.fillRect(0, 0, w, h);
            ctx.restore();

            ctx.restore();
        }
    }


    renderNPCs() {
        this.charCtx.clearRect(0, 0, this.charCanvas.width, this.charCanvas.height);
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX, 0);

        // === 1. Offscreen-Canvas für den Charakter ===


        // Charakter normal ins Offscreen zeichnen
        this.addToWorld({ ...this.setup.characters.levelCompleteCharacter, x: 0, y: 0 }, this.charCtx);

        // === 2. Eine Maske über das gesamte Bild legen ===
        const mask = this.charCtx.createLinearGradient(0, 0, this.charCanvas.width, 0);

        const fs = 0.1; // 10% links/rechts Fade
        mask.addColorStop(0.0, "rgba(0,0,0,0)");
        mask.addColorStop(fs, "rgba(0,0,0,1)");
        mask.addColorStop(1 - fs, "rgba(0,0,0,1)");
        mask.addColorStop(1.0, "rgba(0,0,0,0)");

        // Maske auftragen
        this.charCtx.globalCompositeOperation = "destination-in";
        this.charCtx.fillStyle = mask;
        this.charCtx.fillRect(0, 0, this.charCanvas.width, this.charCanvas.height);

        // Extra: Fade von oben
        const topMask = this.charCtx.createLinearGradient(0, 0, 0, this.charCanvas.height);
        topMask.addColorStop(0.0, "rgba(0,0,0,0)");
        topMask.addColorStop(0.15, "rgba(0,0,0,1)");
        topMask.addColorStop(1.0, "rgba(0,0,0,1)");

        this.charCtx.fillStyle = topMask;
        this.charCtx.fillRect(0, 0, this.charCanvas.width, this.charCanvas.height);

        this.charCtx.globalCompositeOperation = "source-over";

        // === 3. Charakter mit Glow ins Hauptcanvas bringen ===
        this.ctx.shadowColor = "rgba(0, 200, 255, 0.9)";
        this.ctx.shadowBlur = 40;
        this.ctx.drawImage(this.charCanvas, this.setup.characters.levelCompleteCharacter.x, this.setup.characters.levelCompleteCharacter.y);

        this.ctx.shadowBlur = 0;
        this.ctx.restore();
        // this.windParticles.draw(this.ctx, this.renderCameraX);

    }

    updateEntities(timestamp) {
        Object.values(this.setup.characters).forEach(element => {
            element.updateState(timestamp);
        });
    }

    drawHeroText(text, alpha, scale) {
        this.ctx.save();

        // Schriftstil
        this.ctx.font = `${100 * scale}px 'Adventure', serif`;
        this.ctx.textAlign = 'center';

        // Goldene Schrift
        this.ctx.fillStyle = `rgba(255, 230, 180, ${alpha})`;

        // Magischer blauer Glow
        this.ctx.shadowColor = 'rgba(0, 180, 255, 1)';
        this.ctx.shadowBlur = 35;

        // Text in die Mitte oben zeichnen
        this.ctx.fillText(text, this.canvas.width / 2, 150);

        this.ctx.restore();
    }

    animateHeroText() {
        if (this.heroTextAlpha < 1) this.heroTextAlpha += 0.02;
        if (this.heroTextScale < 1) this.heroTextScale += 0.01;

        this.drawHeroText("Level Geschafft", this.heroTextAlpha, this.heroTextScale);
    }

}