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
        this.sandstorm = new SandstormEffect(this.canvas);
        this.sandstormNear = new SandstormEffect(this.canvas); // schneller, heller
        this.sandstormFar = new SandstormEffect(this.canvas); // langsamer, dunkler


        // this.sandstormFar.setAlpha(0.04);
        // this.sandstormFar.setSpeed(0.20);
        // this.sandstorm.setAlpha(0.10);
        // this.sandstorm.setSpeed(0.5);
        // this.sandstormNear.setAlpha(0.16);
        // this.sandstormNear.setSpeed(1.2);
        this.sandstormIntensity = 0; 
        this.setSandstorm(this.sandstormIntensity);

        this.eventManager = new EventManager(this.setup);
        this.questManager = new QuestManager(this.setup, this.eventManager, this.setup.townEvents);
        this.eventManager.questManager = this.questManager;
        this.magicShield = new MagicShieldEffect(this.canvas);
        this.magicShield.onShockwave = () => {
            this.sandstorm.pressure = 0.4;
            this.sandstormNear.pressure = 0.6;
            this.sandstormFar.pressure = 0.2;
        };


    }

    update(timestamp) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateCamera();
        this.renderBackgrounds();
        this.renderNPCsAndCharacter();
        this.setup.taskWindow.update();
        this.setup.taskWindow.draw(this.ctx);
        this.updateCharacter(timestamp);
        this.updateEntities(timestamp);
        this.updateEndboss(timestamp);
        this.updateCoins(timestamp);
        this.handlePopup();
        this.sandstorm.update();
        this.sandstormNear.update();
        this.sandstormFar.update();
        this.eventManager.update();
        this.eventManager.debug = true;
        this.renderStatusBar();
        this.setup.panel.update(timestamp);
        this.setup.panel.draw(this.ctx);
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
        if (this.questManager.step >= 10) this.addToWorld(this.setup.statusBar2);
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
        this.addObject(this.setup.townLevel.projectiles);
        this.addToWorld(this.endbossAttack);
        this.addObject(this.setup.throwableObjects);
        if (!this.setup.characters.endboss.isUnderTheGround) {
            this.addToWorld(this.setup.characters.soul);
            // this.setup.characters.soul.updateState('idle', 1000 / 6);
            this.addToWorld(this.setup.characters.endboss);
        }
        this.addToWorld(this.setup.characters.tadeo);
        this.ctx.restore();
        // this.sandstorm.draw(this.ctx, this.renderCameraX);
        // this.sandstormFar.draw(this.ctx, this.renderCameraX);
        // this.sandstormNear.draw(this.ctx, this.renderCameraX);
        // Tadeo screen position
        const sx = this.setup.characters.tadeo.x - this.renderCameraX + this.setup.characters.tadeo.width / 2;
        const sy = this.setup.characters.tadeo.y + this.setup.characters.tadeo.height * 0.2;

        const now = performance.now();
        this.magicShield.update(sx, sy, now);
        this.magicShield.draw(this.ctx, sx, sy);


        const shieldInfo = this.magicShield.active
            ? {
                x: sx + this.magicShield.clipJitterX,
                y: sy + this.magicShield.clipJitterY,
                radius: this.magicShield.radius
            }
            : null;


        this.sandstormFar.draw(this.ctx, this.renderCameraX, shieldInfo);
        this.sandstorm.draw(this.ctx, this.renderCameraX, shieldInfo);
        this.sandstormNear.draw(this.ctx, this.renderCameraX, shieldInfo);
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
        this.setup.townLevel.projectiles.forEach(projectile => {
            projectile.updateState(timestamp);
        });
    }

    updateEntities(timestamp) {
        Object.values(this.setup.characters).forEach(element => {
            element.updateState(timestamp);
        });
        this.setup.townLevel.enemies.forEach(enemy => {
            enemy.updateState(timestamp);
            enemy.updateAnimation(timestamp);
            // enemy.applyGravity3(timestamp);
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

        this.sandstormFar.setAlpha(0.04 + (0.15 - 0.04) * t);
        this.sandstormFar.setSpeed(0.20 + (0.60 - 0.20) * t);

        this.sandstorm.setAlpha(0.10 + (0.35 - 0.10) * t);
        this.sandstorm.setSpeed(0.50 + (1.60 - 0.50) * t);

        this.sandstormNear.setAlpha(0.16 + (0.45 - 0.16) * t);
        this.sandstormNear.setSpeed(1.20 + (4.50 - 1.20) * t);
    }

}