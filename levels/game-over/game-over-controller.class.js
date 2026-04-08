import { EventManager } from '../../classes/systems/event-manager.class.js';
import { QuestManager } from '../../classes/systems/quest-manager.class.js';

/**
 * Game over controller.
 */
export class GameOverController {
    /**
     * Creates a new game over controller.
     * @param {Object} setup Game over setup.
     */
    constructor(setup) {
        this.setup = setup;
        this.world = setup.world;
        this.ctx = this.world.ctx;
        this.canvas = this.world.canvas;
        this.bindRendererMethods();
        this.charSpirit = this.setup.characters?.gameOverCharacterSpirit ?? null;
        this.treeSpirit = this.setup.environment?.treeSpirit ?? null;
        this.initManagers();
        this.initVisualState();
    }

    /**
     * Binds renderer methods.
     * @returns {void}
     */
    bindRendererMethods() {
        this.addToWorld = this.world.renderer.addToWorld.bind(this.world.renderer);
    }

    /**
     * Initializes managers.
     * @returns {void}
     */
    initManagers() {
        this.eventManager = new EventManager(this.setup);
        this.questManager = new QuestManager(this.setup, this.eventManager, this.setup.gameOverEvents);
        this.eventManager.questManager = this.questManager;
    }

    /**
     * Initializes visual state.
     * @returns {void}
     */
    initVisualState() {
        this.titleAlpha = 0;
        this.titleScale = 0.92;
    }

    /**
     * Updates the game over scene.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    update(timestamp) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.eventManager.update();
        this.updateCharacters(timestamp);
        this.updateEnvironment(timestamp);
        this.renderEnvironment(timestamp);
        this.renderCharacters(timestamp);
        this.animateTitle();
    }

    /**
     * Renders character visuals.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    renderCharacters(timestamp) {
        if (!this.charSpirit) return;
        const t = timestamp || performance.now();
        const floatY = Math.sin(t * 0.002) * 6;
        const pulse = 0.72 + Math.sin(t * 0.003) * 0.08;
        this.drawSpiritCharacter(floatY, pulse);
    }

    /**
     * Draws the spirit character.
     * @param {number} floatY Vertical offset.
     * @param {number} pulse Pulse factor.
     * @returns {void}
     */
    drawSpiritCharacter(floatY, pulse) {
        this.ctx.save();
        this.ctx.globalAlpha = (this.charSpirit.opacity ?? 1) * pulse;
        this.ctx.shadowColor = 'rgba(120, 210, 255, 0.9)';
        this.ctx.shadowBlur = 30;
        this.addToWorld({ ...this.charSpirit, y: this.charSpirit.y + floatY });
        this.ctx.restore();
    }

    /**
     * Renders environment visuals.
     * @returns {void}
     */
    renderEnvironment() {
        if (!this.treeSpirit) return;
        this.ctx.save();
        this.ctx.globalAlpha = this.treeSpirit.opacity ?? 1;
        this.ctx.shadowColor = 'rgba(140, 230, 255, 0.45)';
        this.ctx.shadowBlur = 18;
        this.addToWorld(this.treeSpirit);
        this.ctx.restore();
    }

    /**
     * Updates characters.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    updateCharacters(timestamp) {
        this.charSpirit?.updateState?.(timestamp);
    }

    /**
     * Updates environment.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    updateEnvironment(timestamp) {
        this.treeSpirit?.updateState?.(timestamp);
    }

    /**
     * Draws the title.
     * @param {string} text Title text.
     * @param {number} alpha Alpha value.
     * @param {number} scale Scale factor.
     * @returns {void}
     */
    drawTitle(text, alpha, scale) {
        this.ctx.save();
        this.ctx.font = `${120 * scale}px 'Adventure', serif`;
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = `rgba(240, 245, 255, ${alpha})`;
        this.ctx.shadowColor = 'rgba(120, 210, 255, 0.95)';
        this.ctx.shadowBlur = 28;
        this.ctx.fillText(text, this.canvas.width / 2, 130);
        this.ctx.restore();
    }

    /**
     * Draws the subtitle.
     * @param {string} text Subtitle text.
     * @returns {void}
     */
    drawSubtitle(text) {
        this.ctx.save();
        this.ctx.font = `28px 'Adventure', serif`;
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = 'rgba(235, 240, 245, 0.92)';
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
        this.ctx.shadowBlur = 8;
        this.ctx.fillText(text, this.canvas.width / 2, 195);
        this.ctx.restore();
    }

    /**
     * Animates and renders the title.
     * @returns {void}
     */
    animateTitle() {
        if (this.titleAlpha < 1) this.titleAlpha += 0.02;
        if (this.titleScale < 1) this.titleScale += 0.004;
        this.drawTitle('Game Over', this.titleAlpha, this.titleScale);
        this.drawSubtitle('Brünös Geist sammelt neue Kraft');
    }
}