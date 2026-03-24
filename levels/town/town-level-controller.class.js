import { EventManager } from '../../classes/systems/event-manager.class.js';
import { QuestManager } from '../../classes/systems/quest-manager.class.js';
import { TownRenderer } from './controllers/town-renderer.class.js';
import { TownSandstormController } from './controllers/town-sandstorm-controller.class.js';
import { TownSpiritEssenceController } from './controllers/town-spirit-essence-controller.class.js';

/**
 * Controller responsible for managing the town level logic and systems.
 */
export class TownLevelController {
    /**
     * Creates a new TownLevelController instance.
     * @param {Object} setup Town level setup reference.
     */
    constructor(setup) {
        this.setup = setup;
        this.world = setup.world;
        this.ctx = this.world.ctx;
        this.canvas = this.world.canvas;
        this.gameplayInputController = this.world.gameplayInputController;
        this.addObject = this.world.renderer.addObject.bind(this.world.renderer);
        this.addToWorld = this.world.renderer.addToWorld.bind(this.world.renderer);
        this.character = this.world.character;
        this.keyboard = this.world.keyboard;
        this.sandstormIntensity = 0;
        this.init();
    }

    /**
     * Initializes managers, runtime references, and sub-controllers.
     * @returns {void}
     */
    init() {
        this.initManagers();
        this.initRuntimeRefs();
        this.initSubControllers();
    }

    /**
     * Initializes event and quest managers for the town level.
     * @returns {void}
     */
    initManagers() {
        this.eventManager = new EventManager(this.setup);
        this.eventManager.debug = true;
        this.questManager = new QuestManager(this.setup, this.eventManager, this.setup.townEvents);
        this.eventManager.questManager = this.questManager;
    }

    /**
     * Initializes runtime references used by the town level controller.
     * @returns {void}
     */
    initRuntimeRefs() {
        this.timerManager = this.setup.timerManager;
        this.sandstorm = this.setup.sandstorm;
        this.sandstormNear = this.setup.sandstormNear;
        this.sandstormFar = this.setup.sandstormFar;
        this.magicShield = this.setup.magicShield;
        this.windParticleEffect = this.setup.windParticleEffect;
        this.dustParticleEffect = this.setup.dustParticleEffect;
        this.throwBottleSystem = this.setup.throwBottleSystem;
        this.darkEnergyEffect = this.setup.darkEnergyEffect;
        this.stormHazards = this.setup.stormHazards;
    }

    /**
     * Initializes sub-controllers for rendering, sandstorm, and spirit essence.
     * @returns {void}
     */
    initSubControllers() {
        this.renderer = new TownRenderer(this.setup, this.world, this.questManager);
        this.sandstormCtrl = new TownSandstormController(
            this.sandstorm,
            this.sandstormNear,
            this.sandstormFar
        );
        this.sandstormCtrl.setSandstorm(this.sandstormIntensity);
        this.spiritEssenceCtrl = new TownSpiritEssenceController(this.setup, this.character);
    }

    /**
     * Updates the town level state for the current frame.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    update(timestamp) {
        this.prepareFrame(timestamp);
        this.updateScene(timestamp);
        this.updateRuntimeEffects(timestamp);
        this.updateUi(timestamp);
    }

    /**
     * Prepares the frame by clearing the canvas, updating effects, and camera.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    prepareFrame(timestamp) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.magicShield.update(timestamp);
        this.updateCamera();
    }

    /**
     * Updates scene rendering, entities, and events.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    updateScene(timestamp) {
        this.renderer.render(this.renderCameraX);
        this.updateCharacter(timestamp);
        this.updateDynamicObjects(timestamp);
        this.updateEntities(timestamp);
        this.updateEndboss(timestamp);
        this.updateCoins(timestamp);
        for (const cloud of this.setup.townLevel.clouds) {
            cloud.update(timestamp);
        }
        this.eventManager.update();
    }

    /**
     * Updates runtime effects such as sandstorm, particles, and hazards.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    updateRuntimeEffects(timestamp) {
        this.sandstorm.update();
        this.sandstormNear.update();
        this.sandstormFar.update();
        this.spiritEssenceCtrl.updateSpiritEssenceSequence(timestamp);
        this.timerManager.update();
        this.darkEnergyEffect.update(timestamp, this.renderCameraX, this.canvas.width);
        this.windParticleEffect.update(this.renderCameraX);
        this.stormHazards.update(timestamp);
    }

    /**
     * Updates UI elements and renders dialogs and panels.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    updateUi(timestamp) {
        this.renderer.renderStatusBar();
        this.setup.panel.update(timestamp);
        this.setup.panel.draw(this.ctx);
        this.handlePopup();
        this.updateDamageTexts(timestamp);
        this.setup.dialogManager.update(timestamp);
        this.setup.dialogManager.draw(this.ctx);
    }

    /**
     * Updates and filters active damage text elements.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    updateDamageTexts(timestamp) {
        if (!Array.isArray(this.setup.state.damageTexts)) return;
        this.setup.state.damageTexts =
            this.setup.state.damageTexts.filter(dt => dt?.update?.(timestamp) !== false);
    }

    /**
     * Updates camera position references used for rendering.
     * @returns {void}
     */
    updateCamera() {
        this.camera_x = this.setup.world.camera_x;
        this.renderCameraX = Math.round(this.camera_x);

    }

    /**
     * Processes input and updates the character state.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    updateCharacter(timestamp) {
        this.gameplayInputController.processGameInput(this.world, timestamp);
        this.character.updateAll(timestamp);
    }

    /**
     * Updates dynamic objects such as throwable items, projectiles, and effects.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    updateDynamicObjects(timestamp) {
        this.updateThrowableObjects(timestamp);
        this.updateProjectiles(timestamp);
        this.updateThrowSystems();
        this.updateSceneEffects(timestamp);
    }

    /**
     * Updates throwable objects and removes those marked for deletion.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    updateThrowableObjects(timestamp) {
        this.setup.state.throwableObjects?.forEach(bottle => {
            bottle.updateState(timestamp);
            bottle.updateAnimation(timestamp);
        });
        this.setup.state.throwableObjects =
            this.setup.state.throwableObjects.filter(b => !b.markedForRemoval);
    }

    /**
     * Updates projectiles and removes those marked for deletion.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    updateProjectiles(timestamp) {
        this.setup.state.projectiles.forEach(projectile => {
            projectile.updateState(timestamp);
        });
        this.setup.state.projectiles =
            this.setup.state.projectiles.filter(p => !p.markedForRemoval);
    }

    /**
     * Updates the throw bottle system.
     * @returns {void}
     */
    updateThrowSystems() {
        this.throwBottleSystem.update();
    }

    /**
     * Updates scene effects and removes those marked for deletion.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    updateSceneEffects(timestamp) {
        this.setup.state.effects.forEach(effect => effect.updateState(timestamp));
        this.setup.state.effects =
            this.setup.state.effects.filter(effect => !effect.markedForRemoval);
    }

    /**
     * Updates characters, environment entities, and enemies in the town level.
     * @param {number} timestamp Frame timestamp.
     */
    updateEntities(timestamp) {
        Object.values(this.setup.characters)
            .filter(c => c !== this.setup.characters.endboss)
            .forEach(c => c.updateState(timestamp));
        Object.values(this.setup.environment)
            .forEach(c => {
                if (!this.shouldUpdateEnvironmentEntity(c)) return;
                c.updateState(timestamp);
            });
        this.setup.townLevel.enemies.forEach(enemy => {
            enemy.updateState(timestamp);
        });
    }

    /**
     * Determines whether an environment entity should be updated.
     * @param {Object} c Environment entity.
     * @returns {boolean} True if the entity should be updated, otherwise false.
     */
    shouldUpdateEnvironmentEntity(c) {
        if (!this.isHeavyDestroyedBuilding(c)) return true;
        return this.renderer.isVisible(c, this.renderCameraX, this.canvas.width, 400);
    }

    /**
     * Checks whether the environment entity is a heavy destroyed building.
     * @param {Object} c Environment entity.
     * @returns {boolean} True if the entity is a destroyed building, otherwise false.
     */
    isHeavyDestroyedBuilding(c) {
        return c === this.setup.environment.houseDestroyed ||
            c === this.setup.environment.stableDestroyed ||
            c === this.setup.environment.millDestroyed;
    }

    /**
     * Updates the endboss state, attacks, and gravity behavior.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    updateEndboss(timestamp) {
        this.setup.characters.endboss.updateAll(timestamp, this.setup);
        this.setup.endbossAttack.updateState(timestamp, this.setup.characters.endboss, this.setup);
        this.setup.endbossAttack.updateAnimation(timestamp);
        if (this.setup.characters.endboss.isJumping) this.setup.characters.endboss.applyGravityBoss(timestamp);
    }

    /**
     * Updates coin animations.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    updateCoins(timestamp) {
        this.setup.townLevel.coins.forEach(coin => coin.updateAnimation(timestamp));
    }

    /**
     * Draws active popup texts and removes inactive ones.
     * @returns {void}
     */
    handlePopup() {
        const now = performance.now();
        this.setup.state.popupTexts.forEach(p => p.draw(this.ctx, now));
        this.setup.state.popupTexts = this.setup.state.popupTexts.filter(p => p.active);
    }
}