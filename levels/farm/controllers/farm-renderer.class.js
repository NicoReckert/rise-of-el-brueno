import { farmHelper } from "../../../events/farm/helpers/farm-helper.js";

/**
 * Renders farm level elements and integrates them into the world renderer.
 */
export class FarmRenderer {
    /**
     * Creates a new renderer helper instance.
     * @param {Object} setup Setup reference.
     * @param {Object} world World reference.
     */
    constructor(setup, world) {
        this.setup = setup;
        this.world = world;
        this.ctx = world.ctx;
        this.addObject = this.world.renderer.addObject.bind(this.world.renderer);
        this.addToWorld = this.world.renderer.addToWorld.bind(this.world.renderer);
        this.character = this.world.character;
    }

    /**
     * Renders the farm scene.
     * @param {number} cameraX Camera X position.
     * @param {number} questStep Current quest step.
     * @returns {void}
     */
    render(cameraX, questStep) {
        this.renderBackgrounds(cameraX);
        this.renderCharacterAndEntities(cameraX, questStep);
    }

    /**
     * Renders background layers for the farm scene.
     * @param {number} cameraX Camera X position.
     * @returns {void}
     */
    renderBackgrounds(cameraX) {
        this.addToWorld(this.setup.farmLevel.sky);
        this.renderParallaxLayer(cameraX, 0.4, this.setup.farmLevel.clouds);
        this.renderParallaxLayer(cameraX, 0.5, this.setup.farmLevel.grounds.backGrounds);
        this.renderParallaxLayer(cameraX, 0.75, this.setup.farmLevel.grounds.midGrounds);
        this.renderParallaxLayer(cameraX, 1.0, this.setup.farmLevel.grounds.foreGrounds);
        this.renderParallaxLayer(cameraX, 1.0, this.setup.farmLevel.sceneryObjects);
    }

    /**
     * Renders a parallax layer with camera offset.
     * @param {number} cameraX Camera X position.
     * @param {number} factor Parallax factor.
     * @param {*} object Renderable object or collection.
     * @returns {void}
     */
    renderParallaxLayer(cameraX, factor, object) {
        this.ctx.save();
        this.ctx.translate(-cameraX * factor, 0);
        this.addObject(object);
        this.ctx.restore();
    }

    /**
     * Renders the character and farm entities.
     * @param {number} cameraX Camera X position.
     * @param {number} questStep Current quest step.
     * @returns {void}
     */
    renderCharacterAndEntities(cameraX, questStep) {
        this.ctx.save();
        this.ctx.translate(-cameraX, 0);
        this.renderFarmEntities(questStep);
        this.renderCharacterBlock(questStep);
        this.addToWorld(this.setup.environment.pond);
        this.ctx.restore();
        if (questStep >= 20) {
            this.windParticleEffect.setVisible(true);
            this.windParticleEffect.draw(this.ctx, cameraX);
        }
    }

    /**
     * Renders farm environment entities based on quest progress.
     * @param {number} questStep Current quest step.
     * @returns {void}
     */
    renderFarmEntities(questStep) {
        if (questStep < 10) this.addToWorld(this.setup.characters.bird);
        this.addObject(this.setup.environment.trees);
        this.addObject(this.setup.environment.flowers);
        if (questStep === 10) this.addToWorld(this.setup.environment.sun);
        this.addToWorld(this.setup.environment.house);
        this.renderSceneryWithShadow();
        this.addToWorld(this.setup.environment.stable);
        if (questStep < 8) this.addToWorld(this.setup.environment.campfire);
    }

    /**
     * Renders scenery objects with a shadow effect.
     * @returns {void}
     */
    renderSceneryWithShadow() {
        this.ctx.save();
        this.ctx.shadowColor = "rgba(0,0,0,0.4)";
        this.ctx.shadowBlur = 10;
        this.ctx.shadowOffsetX = 5;
        this.ctx.shadowOffsetY = 5;
        this.addToWorld(this.setup.farmLevel.sceneryObjects[0]);
        this.ctx.restore();
    }

    /**
     * Renders the main character block and related entities.
     * @param {number} questStep Current quest step.
     * @returns {void}
     */
    renderCharacterBlock(questStep) {
        if (this.setup.state.isGameCharacterInHouse) return;
        if (this.character.isCaress) return this.renderCaressCharacters();
        if (questStep < 8) this.addToWorld(this.setup.characters.cow);
        if (questStep < 8 || questStep > 18) this.addToWorld(this.character);
    }

    /**
     * Renders characters during the caress interaction.
     * @returns {void}
     */
    renderCaressCharacters() {
        this.addToWorld(this.character);
        this.addToWorld(this.setup.characters.cow);
    }

    /**
     * Renders the scene after dark.
     * @param {number} questStep Current quest step.
     * @param {number} cameraX Camera X position.
     * @returns {void}
     */
    renderAfterDark(questStep, cameraX) {
        if (questStep < 8) return;
        this.ctx.save();
        this.ctx.translate(-cameraX, 0);
        this.renderNightScene(questStep);
        this.ctx.restore();
    }

    /**
     * Renders the night scene elements.
     * @param {number} questStep Current quest step.
     * @returns {void}
     */
    renderNightScene(questStep) {
        if (questStep < 14) this.addToWorld(this.setup.characters.cow);
        if (questStep < 13) this.addToWorld(this.character);
        this.addToWorld(this.setup.environment.campfire);
        if (questStep < 14) this.addToWorld(this.setup.characters.pollito);
        if (questStep < 14) this.addToWorld(this.setup.characters.juanito);
        if (questStep < 14) this.addToWorld(this.setup.environment.moon);
        if (questStep >= 14 && questStep < 18) this.renderTranceScene();
    }

    /**
     * Renders the trance scene actors.
     * @returns {void}
     */
    renderTranceScene() {
        this.addToWorld(this.setup.characters.drone);
        this.addToWorld(this.setup.cutsceneActors.chickenTranced);
        this.addToWorld(this.setup.cutsceneActors.cowTranced);
        this.addToWorld(this.setup.cutsceneActors.chickTranced);
    }

    /**
     * Draws the cutscene indicator.
     * @returns {void}
     */
    handleCutsceneIndicator() {
        this.setup.cutsceneIndicator.draw(this.ctx);
    }

    /**
     * Renders the prolog video.
     * @returns {void}
     */
    renderPrologVideo() {
        const video = this.setup.video;
        if (!video) return;
        if (video.readyState < 2) return;
        if (video.paused || video.ended) return;
        this.ctx.drawImage(video, 0, 0, this.world.canvas.width, this.world.canvas.height);
    }

    /**
     * Renders the currently active portrait with radial fade.
     * Clears the portrait reference after fade-out has finished.
     * @returns {void}
     */
    renderActivePortrait() {
        const portrait = this.setup.state.activePortrait;
        if (!portrait) return;
        if (portrait.opacity > 0 || portrait.fading) {
            farmHelper.renderPortraitWithRadialFade(this.setup, portrait, {
                opacity: portrait.opacity
            });
        }
        if (!portrait.fading && portrait.opacity <= 0) {
            this.setup.state.activePortrait = null;
        }
    }
}