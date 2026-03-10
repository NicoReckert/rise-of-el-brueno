
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
        this.renderCharacterAndEntities(cameraX);
    }

    /**
     * Renders background layers and parallax scenery.
     * @param {number} cameraX Camera x-position used for rendering.
     * @returns {void}
     */
    renderBackgrounds(cameraX) {
        this.addToWorld(this.setup.townLevel.sky);
        this.setup.darkEnergyEffect.draw(this.ctx, cameraX);
        this.renderCloudLayer(cameraX);
        this.renderParallaxLayer(cameraX, 0.5, this.setup.townLevel.grounds.backGrounds);
        this.renderParallaxLayer(cameraX, 0.75, this.setup.townLevel.grounds.midGrounds);
        this.renderParallaxLayer(cameraX, 1.0, this.setup.townLevel.grounds.foreGrounds);
        this.renderParallaxLayer(cameraX, 1.0, this.setup.townLevel.sceneryObjects);
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
     * Renders characters, entities, and front-layer effects.
     * @param {number} cameraX Camera x-position used for rendering.
     * @returns {void}
     */
    renderCharacterAndEntities(cameraX) {
        this.ctx.save();
        this.ctx.translate(-cameraX, 0);
        this.renderTownBaseActors();
        this.renderTownCollections();
        this.renderTownFrontActors();
        this.ctx.restore();
        this.renderShieldAndSandstorm(cameraX);
    }

    /**
     * Renders base actors such as buildings, main characters, and spirits.
     * @returns {void}
     */
    renderTownBaseActors() {
        this.renderTownDestroyedBuildings();
        this.renderTownMainActors();
        this.renderTownSpirits();
    }

    /**
     * Renders destroyed building environment objects.
     * @returns {void}
     */
    renderTownDestroyedBuildings() {
        this.addToWorld(this.setup.environment.houseDestroyed);
        this.addToWorld(this.setup.environment.stableDestroyed);
        this.addToWorld(this.setup.environment.millDestroyed);
    }

    /**
     * Renders main actors including the character and related elements.
     * @returns {void}
     */
    renderTownMainActors() {
        this.addToWorld(this.setup.characters.tadeo);
        this.addToWorld(this.character);
        this.addToWorld(this.setup.throwBottleSystem.heldBottle);
        this.setup.state.damageTexts.forEach(dt => dt.draw(this.ctx));
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
        this.addToWorld(this.setup.environment.spiritEssence1);
        this.addToWorld(this.setup.environment.spiritEssence2);
        this.addToWorld(this.setup.environment.spiritEssence3);
    }

    /**
     * Renders collectible items, enemies, projectiles, and effects.
     * @returns {void}
     */
    renderTownCollections() {
        this.addObject(this.setup.townLevel.coins);
        this.addObject(this.setup.townLevel.bottles);
        this.addObject(this.setup.endbossAttack.eggs);
        this.addObject(this.setup.townLevel.enemies);
        this.addObject(this.setup.state.projectiles);
        this.addObject(this.setup.state.effects);
        this.addToWorld(this.setup.endbossAttack);
        this.addObject(this.setup.state.throwableObjects);
    }

    /**
     * Renders front-layer actors and special characters.
     * @returns {void}
     */
    renderTownFrontActors() {
        this.addToWorld(this.setup.environment.rockyDesertPedestal);
        if (!this.setup.characters.endboss.isUnderTheGround) {
            this.addToWorld(this.setup.characters.soul);
            this.addToWorld(this.setup.characters.endboss);
        }
        this.addToWorld(this.setup.characters.sollita);
        this.addToWorld(this.setup.characters.musician);
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
        this.addToWorld(this.setup.statusBar);
        if (this.questManager.step >= 10) this.addToWorld(this.setup.statusBar2);
        this.addToWorld(this.setup.coinBar);
        this.addToWorld(this.setup.bottleBar);
    }
}