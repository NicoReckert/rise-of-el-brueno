class TownLevelController {
    constructor(setup) {
        this.setup = setup;
        this.world = setup.world;
        this.ctx = this.world.ctx;
        this.canvas = this.world.canvas;
        this.addObject = this.world.addObject.bind(this.world);
        this.addToWorld = this.world.addToWorld.bind(this.world);
        this.character = this.world.character;
        this.checkPressKey = this.world.checkPressKey.bind(this.world);
        this.checkCollisions = this.world.checkCollisions.bind(this.world);
        this.checkThrowObjects = this.world.checkThrowObjects.bind(this.world);
        this.keyboard = this.world.keyboard;
        this.stepSoundCharacter = this.world.stepSoundCharacter.bind(this.world);
        this.landingSoundCharacter = this.world.landingSoundCharacter.bind(this.world);
        this.popupTexts = [];
        this.sandstorm = new SandstormEffect(this.canvas);
        this.sandstormNear = new SandstormEffect(this.canvas); // schneller, heller
        this.sandstormFar = new SandstormEffect(this.canvas); // langsamer, dunkler

        this.sandstorm.setAlpha(0.5);
        this.sandstorm.setSpeed(20); // 1.2

        this.sandstormNear.setAlpha(0.12);
        this.sandstormNear.setSpeed(10); // 1.2

        this.sandstormFar.setAlpha(0.08);
        this.sandstormFar.setSpeed(5); // 0.3

        this.eventManager = new EventManager(this.setup);
        this.questManager = new QuestManager(this.setup, this.eventManager, this.setup.townEvents);
        this.eventManager.questManager = this.questManager;

    }

    update(timestamp) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateCamera();
        this.renderBackgrounds();
        this.renderStatusBar();
        this.renderNPCsAndCharacter();
        this.setup.taskWindow.update();
        this.setup.taskWindow.draw(this.ctx);
        this.updateCharacter(timestamp);
        this.updateEntities(timestamp);
        this.updateEndboss(timestamp);
        this.updateCoins(timestamp);
        this.handleInteractions();
        this.handlePopup();
        this.sandstorm.update();
        this.sandstormNear.update();
        this.sandstormFar.update();
        this.eventManager.update();
        this.eventManager.debug = true;
    }

    updateCamera() {
        this.camera_x = this.setup.world.camera_x;
        this.renderCameraX = Math.round(this.camera_x);

    }

    renderBackgrounds() {
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX, 0);
        this.addObject(this.setup.townLevel.sky);
        this.addObject(this.setup.townLevel.clouds);
        this.addObject(this.setup.townLevel.grounds);
        this.addObject(this.setup.townLevel.towns);
        this.ctx.restore();
    }

    renderStatusBar() {
        this.addToWorld(this.setup.statusBar);
        this.addToWorld(this.setup.statusBar2);
        this.addToWorld(this.setup.coinBar);
        this.addToWorld(this.setup.bottleBar);
    }

    renderNPCsAndCharacter() {
        this.ctx.save();
        this.ctx.translate(-this.renderCameraX, 0);
        this.addToWorld(this.character);
        this.addObject(this.setup.townLevel.coins);
        this.addObject(this.setup.townLevel.bottles);
        this.addObject(this.setup.townLevel.enemies);
        this.addToWorld(this.endbossAttack);
        this.addObject(this.setup.throwableObjects);
        if (!this.setup.characters.endboss.isUnderTheGround) {
            this.addToWorld(this.setup.characters.soul);
            // this.setup.characters.soul.updateState('idle', 1000 / 6);
            this.addToWorld(this.setup.characters.endboss);
        }
        this.ctx.restore();
        this.sandstorm.draw(this.ctx, this.renderCameraX);
        this.sandstormFar.draw(this.ctx, this.renderCameraX);
        this.sandstormNear.draw(this.ctx, this.renderCameraX);

    }

    updateCharacter(timestamp) {
        this.checkPressKey();
        this.checkCollisions();
        this.checkThrowObjects(timestamp);
        this.character.updateState(timestamp);
        this.character.updateAnimation(timestamp);
        if (this.character.isJumping) this.character.applyGravity(timestamp);
        this.stepSoundCharacter(timestamp);
        this.landingSoundCharacter();
        this.setup.throwableObjects?.forEach(bottle => {
            bottle.updateState(timestamp);
            bottle.updateAnimation(timestamp);
            bottle.applyGravity2(timestamp);
        });

    }

    updateEntities(timestamp) {
        Object.values(this.setup.characters).forEach(element => {
            element.updateState(timestamp);
        });
        this.setup.townLevel.enemies.forEach(enemy => {
            enemy.updateState();
            enemy.updateAnimation(timestamp);
        });
    }

    updateEndboss(timestamp) {
        this.setup.characters.endboss.updateState(timestamp);
        this.setup.characters.endboss.updateAnimation(timestamp);
        this.setup.endbossAttack.updateState();
        this.setup.endbossAttack.updateAnimation(timestamp);
        if (this.setup.characters.endboss.isJumping) this.setup.characters.endboss.applyGravityBoss(timestamp);
    }

    updateCoins(timestamp) {
        this.setup.townLevel.coins.forEach(coin => coin.updateAnimation(timestamp));
    }

    handleInteractions() {
        // if (this.keyboard.F && this.character.x > 1550 && this.character.x < 1700) {
        //     this.camera_x = 0;
        //     this.character.x = 380;
        //     this.world.currentScene = 'stableLevel';
        //     this.keyboard.F = false;
        //     this.setup.farmLevel.level_end_x = 720;
        //     this.world.character.level_start_x = 360;
        // }
    }

    handlePopup() {
        const now = performance.now();
        this.popupTexts.forEach(p => p.draw(this.ctx, now));
        this.popupTexts = this.popupTexts.filter(p => p.active);
    }
}
