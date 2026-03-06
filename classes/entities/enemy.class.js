import { MovableObject } from '../systems/movable-object.class.js'
import { EnemyAnimationController } from '../systems/enemy-animation-controller.class.js';
import { EnemyMovementController } from '../systems/enemy-movement-controller.class.js';
import { EnemyCombatController } from '../systems/enemy-combat-controller.class.js';
import { EnemyGroundController } from '../systems/enemy-ground-controller.class.js';
import { EnemyDragonController } from '../systems/enemy-dragon-controller.class.js';

/**
 * Represents a movable non-player character with simple movement and animation behavior.
 * Handles walking, idle, and death states.
 * @extends MovableObject
 */
export class Enemy extends MovableObject {
    isGamecharacter = false;

    /**
     * Creates a new instance with randomized speed and default animation settings.
     * @param {Object} entityImages - Image data containing animation frames.
     */
    constructor(currentEnemy, entityImages, width = 120, height = 120, y = 545, x = null, allAudios, world) {
        super();
        this.config.initAll();
        this.animCtrl = new EnemyAnimationController(this);
        this.movementCtrl = new EnemyMovementController(this);
        this.combatCtrl = new EnemyCombatController(this);
        this.dragonCtrl = new EnemyDragonController(this);
        this.groundCtrl = new EnemyGroundController(this);
    }

    updateState(timestamp) {
        this.updateDeltaTime(timestamp);
        this.updateDeadState(timestamp);
        const char = this.world.character;
        if (this.currentEnemy === 'dragonSmall') {
            this.updateDragonAI(timestamp, char);
            this.handleAnimation();
            return;
        }
        this.applyGravity(timestamp);
        this.snapBackToSpawnY();
        this.updateAI(timestamp, char);
        this.updateKnockbackMovement();
    }
}