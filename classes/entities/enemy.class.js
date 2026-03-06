import { MovableObject } from '../systems/movable-object.class.js'

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
        this.world = world;
        this.currentEnemy = currentEnemy;
        this.entityImages = entityImages;
        this.allAudios = allAudios;
        this.setAnimation('walk')
        this.y = this.spawnY;
        this.x = x;
        this.height = height;
        this.width = width;
        this.init(this.currentEnemy);
        this.movementSpeed = 0;
        this.lastUpdateTime = 0;
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