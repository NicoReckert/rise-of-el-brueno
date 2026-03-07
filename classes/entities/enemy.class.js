import { MovableObject } from '../systems/movable-object.class.js'
import { EnemyConfig } from '../systems/enemy-config.class.js';
import { EnemyAnimationController } from '../systems/enemy-animation-controller.class.js';
import { EnemyAnimationTransitionsController } from '../systems/enemy-animation-transitions-controller.class.js';
import { EnemyAnimationAttackController } from '../systems/enemy-animation-attack-controller.class.js';
import { EnemyMovementController } from '../systems/enemy-movement-controller.class.js';
import { EnemyCombatController } from '../systems/enemy-combat-controller.class.js';
import { EnemyGroundController } from '../systems/enemy-ground-controller.class.js';
import { EnemyDragonController } from '../systems/enemy-dragon-controller.class.js';
import { EnemyDragonMovementController } from '../systems/enemy-dragon-movement-controller.class.js';
import { EnemyDragonAttackController } from '../systems/enemy-dragon-attack-controller.class.js';

/**
 * Enemy entity with animation, movement, combat, and AI controllers.
 */
export class Enemy extends MovableObject {
    /**
     * Creates a new instance.
     * @param {string} currentEnemy Enemy identifier.
     * @param {object} entityImages Image collection.
     * @param {number} [width=120] Enemy width.
     * @param {number} [height=120] Enemy height.
     * @param {number} [y=545] Vertical position.
     * @param {?number} [x=null] Horizontal position.
     * @param {object} allAudios Audio collection.
     * @param {object} world World reference.
     */
    constructor(currentEnemy, entityImages, width = 120, height = 120, y = 545, x = null, allAudios, world) {
        super();
        this.config = new EnemyConfig(this, currentEnemy, entityImages, width, height, x, y, allAudios, world);
        this.animCtrl = new EnemyAnimationController(this);
        this.animTransitionsCtrl = new EnemyAnimationTransitionsController(this);
        this.animAttackCtrl = new EnemyAnimationAttackController(this);
        this.movementCtrl = new EnemyMovementController(this);
        this.combatCtrl = new EnemyCombatController(this);
        this.groundCtrl = new EnemyGroundController(this);
        this.dragonCtrl = new EnemyDragonController(this);
        this.dragonMovementCtrl = new EnemyDragonMovementController(this);
        this.dragonAttackCtrl = new EnemyDragonAttackController(this);
        this.config.initAll();
    }

    /**
     * Updates the enemy state for the current frame.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    updateState(timestamp) {
        this.updateDeltaTime(timestamp);
        if (this.handleDeadState(timestamp)) return;
        const char = this.world?.character;
        if (!char) {
            this.animCtrl.updateAnimation(timestamp);
            return;
        }
        if (this.handleDragonState(timestamp, char)) return;
        this.updateGroundEnemyState(timestamp, char);
    }

    /**
     * Handles the enemy dead state.
     * @param {number} timestamp Frame timestamp.
     * @returns {boolean} True if the dead state was handled, otherwise false.
     */
    handleDeadState(timestamp) {
        if (!this.movementCtrl.updateDeadState(timestamp)) return false;
        this.animCtrl.updateAnimation(timestamp);
        return true;
    }

    /**
     * Handles the dragon-specific state update.
     * @param {number} timestamp Frame timestamp.
     * @param {object} char Character object.
     * @returns {boolean} True if the dragon state was handled, otherwise false.
     */
    handleDragonState(timestamp, char) {
        if (this.currentEnemy !== "dragonSmall") return false;
        this.dragonCtrl.updateDragonAI(timestamp, char);
        this.animCtrl.updateAnimation(timestamp);
        return true;
    }

    /**
     * Updates the state of a ground-based enemy.
     * @param {number} timestamp Frame timestamp.
     * @param {object} char Character object.
     * @returns {void}
     */
    updateGroundEnemyState(timestamp, char) {
        this.movementCtrl.applyGravity();
        this.movementCtrl.snapBackToSpawnY();
        this.groundCtrl.updateAI(timestamp, char);
        this.movementCtrl.updateKnockbackMovement();
        this.animCtrl.updateAnimation(timestamp);
    }
}