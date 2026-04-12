
/**
 * Renderer responsible for drawing the town level and related elements.
 */
export class TownRenderer {
    /**
     * Creates a new TownRenderer instance.
     * @param {Object} setup Town level setup reference.
     * @param {Object} world World reference containing renderer and context.
     * @param {Object} questManager Quest manager instance.
     */
    constructor(setup, world, questManager) {
        this.setup = setup;
        this.world = world;
        this.questManager = questManager;
        this.ctx = world.ctx;
        this.addObject = world.renderer.addObject.bind(world.renderer);
        this.addToWorld = world.renderer.addToWorld.bind(world.renderer);
        this.character = world.character;
    }

    /**
     * Renders the town scene for the current frame.
     * @param {number} cameraX Camera x-position used for rendering.
     * @returns {void}
     */
    render(cameraX) {
        this.renderBackgrounds(cameraX);
        this.renderTownFlowers(cameraX);
        this.renderCharacterAndEntities(cameraX);
        this.handleHint(cameraX);
        this.handleCutsceneIndicator();
    }

    /**
     * Renders background layers and parallax scenery.
     * @param {number} cameraX Camera x-position used for rendering.
     * @returns {void}
     */
    renderBackgrounds(cameraX) {
        this.addToWorld(this.setup.townLevel.sky);
        if (this.questManager.step < 31) {
            this.setup.darkEnergyEffect.draw(this.ctx, cameraX);
        }
        this.renderCloudLayer(cameraX);
        this.renderParallaxLayer(cameraX, 0.5, this.setup.townLevel.grounds.backGrounds);
        this.renderParallaxLayer(cameraX, 0.75, this.setup.townLevel.grounds.midGrounds);
        this.renderParallaxLayer(cameraX, 1.0, this.setup.townLevel.grounds.foreGrounds);
        this.renderParallaxLayer(cameraX, 1.0, this.setup.townLevel.sceneryObjects);
        this.renderParticleEffects(cameraX);
    }

    /**
     * Renders flowers in the town based on quest progress.
     * @returns {void}
     */
    renderTownFlowers(cameraX) {
        if (this.questManager.step < 31) return;
        this.ctx.save();
        this.ctx.translate(-cameraX, 0);
        this.addObject(this.setup.environment.flowers);
        this.ctx.restore();
    }

    /**
     * Renders particle effects based on quest progress.
     * @param {number} cameraX Camera x position.
     * @returns {void}
     */
    renderParticleEffects(cameraX) {
        if (this.questManager.step >= 23) {
            this.setup.windParticleEffect.setVisible(true);
            this.setup.windParticleEffect.draw(this.ctx, cameraX);
            this.setup.dustParticleEffect.setVisible(true);
            this.setup.dustParticleEffect.update(this.ctx, cameraX);
        }
    }

    /**
     * Renders the cloud layer with parallax and visual effects.
     * @param {number} cameraX Camera x-position used for rendering.
     * @returns {void}
     */
    renderCloudLayer(cameraX) {
        this.ctx.save();
        this.ctx.translate(-cameraX * 0.4, 0);
        this.ctx.globalAlpha = 0.55;
        this.ctx.filter = 'blur(1px)';
        this.addObject(this.setup.townLevel.clouds);
        this.ctx.restore();
        this.ctx.filter = 'none';
    }

    /**
     * Renders a parallax layer with the specified scroll factor.
     * @param {number} cameraX Camera x-position used for rendering.
     * @param {number} factor Parallax scroll factor.
     * @param {Object|Object[]} object Object or objects to render.
     * @returns {void}
     */
    renderParallaxLayer(cameraX, factor, object) {
        this.ctx.save();
        this.ctx.translate(-cameraX * factor, 0);
        this.addObject(object);
        this.ctx.restore();
    }

    /**
     * Renders the character and entities with camera offset.
     * @param {number} cameraX Camera x position.
     * @returns {void}
     */
    renderCharacterAndEntities(cameraX) {
        this.ctx.save();
        this.ctx.translate(-cameraX, 0);
        this.renderTownBaseActors();
        this.renderTownEggs();
        this.renderTownEnemies();
        this.renderTownCollections();
        this.renderBehindEffects();
        this.renderTownPreCharacterActors();
        this.renderTownFrontActors();
        this.renderTownCharacter();
        this.renderFrontEffects();
        this.renderTownSpirits();
        this.ctx.restore();
        this.renderShieldAndSandstorm(cameraX);
        this.renderWhiteFlashTransition();
    }

    /**
     * Renders base actors in the town.
     * @returns {void}
     */
    renderTownBaseActors() {
        this.renderTownDestroyedBuildings();
        this.renderTownTadeo();
    }

    /**
     * Renders enemies in the town.
     * @returns {void}
     */
    renderTownEnemies() {
        this.addObject(this.setup.townLevel.enemies);
    }

    /**
     * Renders destroyed town buildings when they are within the visible camera range.
     */
    renderTownDestroyedBuildings() {
        const cameraX = this.world.camera_x;
        const canvasWidth = this.world.canvas.width;
        const house = this.setup.environment.houseDestroyed;
        const stable = this.setup.environment.stableDestroyed;
        const mill = this.setup.environment.millDestroyed;
        const claw = this.setup.environment.claw;
        const feather = this.setup.environment.feather;
        if (this.isVisible(house, cameraX, canvasWidth, 400)) this.addToWorld(house);
        if (this.isVisible(stable, cameraX, canvasWidth, 400)) this.addToWorld(stable);
        if (this.isVisible(mill, cameraX, canvasWidth, 400)) this.addToWorld(mill);
        if (this.isVisible(claw, cameraX, canvasWidth, 400)) this.addToWorld(claw);
        if (this.isVisible(feather, cameraX, canvasWidth, 400)) this.addToWorld(feather);
    }

    /**
     * Renders Tadeo in the town.
     * @returns {void}
     */
    renderTownTadeo() {
        this.addToWorld(this.setup.characters.tadeo);
    }

    /**
     * Renders the main character and related elements in the town.
     * @returns {void}
     */
    renderTownCharacter() {
        this.addToWorld(this.character);
        this.addToWorld(this.setup.throwBottleSystem.heldBottle);
        this.setup.state.damageTexts.forEach(dt => dt.draw(this.ctx));
    }

    /**
     * Renders pre-character actors in the town.
     * @returns {void}
     */
    renderTownPreCharacterActors() {
        this.renderTownSollitaAndMusician();
    }

    /**
     * Renders spirit characters and spirit essence objects.
     * @returns {void}
     */
    renderTownSpirits() {
        this.addToWorld(this.setup.environment.juanitoSpirit);
        this.addToWorld(this.setup.environment.pollitoSpirit);
        this.addToWorld(this.setup.environment.lolaSpirit);
        this.addToWorld(this.setup.environment.nayeliSpirit);
        this.addToWorld(this.setup.environment.nayeliSpiritEcho);
        this.addToWorld(this.setup.environment.sollitaSpiritEcho);
        this.addToWorld(this.setup.environment.tadeoSpiritEcho);
        this.addToWorld(this.setup.environment.spiritEssence1);
        this.addToWorld(this.setup.environment.spiritEssence2);
        this.addToWorld(this.setup.environment.spiritEssence3);
        this.ctx.shadowColor = 'rgba(255, 255, 200, 0.8)';
        this.ctx.shadowBlur = 10;
        this.addToWorld(this.setup.environment.macuahuitl);
        this.ctx.shadowBlur = 0;
    }

    /**
     * Renders Sollita and musician characters in the town.
     * @returns {void}
     */
    renderTownSollitaAndMusician() {
        this.addToWorld(this.setup.characters.musician);
        this.addToWorld(this.setup.characters.sollita);
    }

    /**
     * Renders front effects.
     * @returns {void}
     */
    renderFrontEffects() {
        this.addToWorld(this.setup.environment.rockyDesertPedestal);
        this.addToWorld(this.setup.environment.fireBlue);
        this.addObject(this.setup.state.effectsFront);
    }
    /**
     * Renders behind effects.
     * @returns {void}
     */
    renderBehindEffects() {
        this.addObject(this.setup.state.effectsBehind);
    }

    /**
     * Renders eggs in the town.
     * @returns {void}
     */
    renderTownEggs() {
        this.addObject(this.setup.endbossAttack.eggs);
    }

    /**
     * Renders collectible and interactive objects in the town.
     * @returns {void}
     */
    renderTownCollections() {
        this.addObject(this.setup.townLevel.coins);
        this.addObject(this.setup.townLevel.bottles);
        this.addObject(this.setup.state.projectiles);
        this.addToWorld(this.setup.endbossAttack);
        this.addObject(this.setup.state.throwableObjects);
    }

    /**
     * Renders front-layer actors and special characters.
     * @returns {void}
     */
    renderTownFrontActors() {
        this.addToWorld(this.setup.characters.soul);
        this.addToWorld(this.setup.characters.endboss);
    }

    /**
     * Renders the magic shield and sandstorm layers.
     * @param {number} cameraX Camera x-position used for rendering.
     * @returns {void}
     */
    renderShieldAndSandstorm(cameraX) {
        const shieldPos = this.getShieldScreenPosition(cameraX);
        this.drawMagicShieldAt(shieldPos);
        const shieldInfo = this.getSandstormShieldInfo(shieldPos);
        this.drawSandstormLayers(cameraX, shieldInfo);
    }

    /**
     * Calculates the shield position in screen coordinates.
     * @param {number} cameraX Camera x-position used for rendering.
     * @returns {{x:number, y:number}} Shield screen position.
     */
    getShieldScreenPosition(cameraX) {
        const tadeo = this.setup.characters.tadeo;
        return {
            x: tadeo.x - cameraX + tadeo.width / 2,
            y: tadeo.y + tadeo.height * 0.2
        };
    }

    /**
     * Draws the magic shield at the specified screen position.
     * @param {{x:number, y:number}} position Shield screen position.
     * @returns {void}
     */
    drawMagicShieldAt({ x, y }) {
        this.setup.magicShield.draw(this.ctx, x, y);
    }

    /**
     * Returns sandstorm shield clipping information.
     * @param {{x:number, y:number}} position Shield screen position.
     * @returns {{x:number, y:number, radius:number}|null} Shield clip info or null if inactive.
     */
    getSandstormShieldInfo({ x, y }) {
        const shield = this.setup.magicShield;
        const r = shield.radius * shield.introT;
        if (!shield.active || r <= 1) return null;
        return {
            x: x + shield.clipJitterX,
            y: y + shield.clipJitterY,
            radius: r
        };
    }

    /**
     * Draws sandstorm layers with optional shield clipping.
     * @param {number} cameraX Camera x-position used for rendering.
     * @param {{x:number, y:number, radius:number}|null} shieldInfo Shield clipping information.
     * @returns {void}
     */
    drawSandstormLayers(cameraX, shieldInfo) {
        this.setup.sandstormFar.draw(this.ctx, cameraX, shieldInfo);
        this.setup.sandstorm.draw(this.ctx, cameraX, shieldInfo);
        this.setup.sandstormNear.draw(this.ctx, cameraX, shieldInfo);
    }

    /**
     * Renders status bars for health, coins, and bottles.
     * @returns {void}
     */
    renderStatusBar() {
        this.addToWorld(this.setup.statusBarCharacter);
        if (this.questManager.step >= 20) this.addToWorld(this.setup.statusBarEndboss);
        this.addToWorld(this.setup.coinBar);
        this.addToWorld(this.setup.bottleBar);
    }

    /**
     * Renders the white flash transition.
     * @returns {void}
     */
    renderWhiteFlashTransition() {
        this.setup.whiteFlashTransition.draw(this.ctx);
    }

    /**
     * Checks whether an object is within the visible camera range.
     * @param {Object} obj Renderable object with position and width.
     * @param {number} cameraX Current camera x-position.
     * @param {number} canvasWidth Canvas width.
     * @param {number} [margin=300] Additional margin outside the viewport.
     * @returns {boolean} True if the object is visible, otherwise false.
     */
    isVisible(obj, cameraX, canvasWidth, margin = 300) {
        if (!obj) return false;
        return (
            obj.x + obj.width >= cameraX - margin &&
            obj.x <= cameraX + canvasWidth + margin
        );
    }

    /**
     * Renders hint elements.
     * @returns {void}
     */
    handleHint(cameraX) {
        this.setup.hints.forEach(hint => hint.draw(this.ctx, cameraX));
    }

    /**
     * Draws the cutscene indicator.
     * @returns {void}
     */
    handleCutsceneIndicator() {
        this.setup.cutsceneIndicator.draw(this.ctx);
    }
}