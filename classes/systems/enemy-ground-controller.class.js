/**
 * Controls ground-related behavior for an enemy.
 */
export class EnemyGroundController {
    /**
     * Creates a new instance.
     * @param {object} enemy Enemy instance.
     */
    constructor(enemy) {
        this.enemy = enemy;
    }

    /**
     * Checks whether the target is within attack range.
     * @param {object} [char=this.enemy.world?.character] Target character.
     * @returns {boolean} True if the target is within attack range, otherwise false.
     */
    inAttackRange(char = this.enemy.world?.character) {
        const t = char;
        if (!t) return false;
        if (this.isTargetAirborne(t)) return false;
        const dist = this.getTargetCenterDistance(t);
        const range = this.getAttackRangeForTarget(t);
        return dist <= range;
    }

    /**
     * Checks whether the target is airborne.
     * @param {object} target Target object.
     * @returns {boolean} True if the target is airborne, otherwise false.
     */
    isTargetAirborne(target) {
        return (
            typeof target.isAboveGround === "function" &&
            target.isAboveGround()
        );
    }

    /**
     * Returns the horizontal center distance to the target.
     * @param {object} target Target object.
     * @returns {number} Horizontal center distance.
     */
    getTargetCenterDistance(target) {
        const ex = this.enemy.x + this.enemy.width * 0.5;
        const tx = target.x + target.width * 0.5;
        return Math.abs(tx - ex);
    }

    /**
     * Returns the attack range for the given target.
     * @param {object} target Target object.
     * @returns {number} Attack range.
     */
    getAttackRangeForTarget(target) {
        if (this.enemy.currentEnemy === "chickenMutatesBig") {
            return this.enemy.rangedRange;
        }
        return this.getDesiredMeleeDistance(target);
    }

    /**
     * Updates AI behavior.
     * @param {number} timestamp Frame timestamp.
     * @param {Object} char Character object.
     * @returns {void}
     */
    updateAI(timestamp, char) {
        if (!char) return;
        if (this.shouldAbortAi()) return this.stopMovement();
        this.runActiveAI(timestamp, char);
    }

    /**
     * Runs active AI behavior.
     * @param {number} timestamp Frame timestamp.
     * @param {Object} char Character object.
     * @returns {void}
     */
    runActiveAI(timestamp, char) {
        if (this.isCharacterFarAbove(char)) return this.handleAirborneTarget(char);
        if (this.enemy.currentEnemy === 'chickenMutatesBig') {
            return this.updateBigChickenAI(timestamp, char);
        }
        this.updateMeleeChickenAI(timestamp, char);
    }

    /**
     * Checks whether AI updates should be aborted.
     * @returns {boolean} True if AI should be aborted, otherwise false.
     */
    shouldAbortAi() {
        const e = this.enemy;
        return e.knockbackActive || e.isHurt || e.isDead || e.isAttack;
    }

    /**
     * Stops enemy movement.
     * @returns {void}
     */
    stopMovement() {
        this.enemy.isMovingLeft = false;
        this.enemy.isMovingRight = false;
    }

    /**
     * Returns the horizontal distance to the character.
     * @param {object} char Character object.
     * @returns {number} Horizontal distance to the character.
     */
    getHorizontalDistanceToChar(char) {
        const ex = this.enemy.x + this.enemy.width * 0.5;
        const tx = char.x + char.width * 0.5;
        return Math.abs(tx - ex);
    }

    /**
     * Updates AI behavior for the ranged chicken enemy.
     * @param {number} timestamp Frame timestamp.
     * @param {object} char Character object.
     * @returns {void}
     */
    updateBigChickenAI(timestamp, char) {
        const e = this.enemy;
        e.isFlipped = char.x > e.x;
        const dist = this.getHorizontalDistanceToChar(char);
        if (dist <= e.rangedRange) {
            this.handleBigChickenRanged(timestamp, char, dist);
        } else {
            this.handleBigChickenApproach(char);
        }
    }

    /**
     * Handles ranged attack behavior for the big chicken enemy.
     * @param {number} timestamp Frame timestamp.
     * @param {object} char Character object.
     * @param {number} dist Horizontal distance to the character.
     * @returns {void}
     */
    handleBigChickenRanged(timestamp, char, dist) {
        const e = this.enemy;
        if (timestamp - e.lastAttackTime > e.attackCooldownMs) {
            this.stopMovement();
            e.combatCtrl.tryStartAttack(timestamp);
            return;
        }
        if (dist < e.meleeRange * 0.7) {
            e.movementCtrl.keepDistanceToTarget(char, { desiredDist: e.meleeRange, faceTarget: true, speed: 1 });
        } else {
            this.stopMovement();
        }
    }

    /**
     * Handles approach movement for the big chicken enemy.
     * @param {object} char Character object.
     * @returns {void}
     */
    handleBigChickenApproach(char) {
        const e = this.enemy;
        e.movementCtrl.moveToTargetX(char, {
            desiredDist: e.rangedRange * 0.7,
            tolerance: 10,
            snap: false,
            faceTarget: true,
            speed: 40
        });
    }

    /**
     * Updates AI behavior for the melee chicken enemy.
     * @param {number} timestamp Frame timestamp.
     * @param {object} char Character object.
     * @returns {void}
     */
    updateMeleeChickenAI(timestamp, char) {
        const desiredNear = this.getDesiredMeleeDistance(char);
        const behind = this.isBehindCharacter(char);
        if (this.inAttackRange(char)) {
            this.handleMeleeInRange(timestamp, char, desiredNear, behind);
            return;
        }
        this.enemy.movementCtrl.moveToTargetX(char, { desiredDist: desiredNear, tolerance: 10, snap: false, faceTarget: true, speed: 40 });
    }

    /**
     * Handles melee behavior when the enemy is within attack range.
     * @param {number} timestamp Frame timestamp.
     * @param {object} char Character object.
     * @param {number} desiredNear Desired melee distance.
     * @param {boolean} behind Whether the enemy is behind the character.
     * @returns {void}
     */
    handleMeleeInRange(timestamp, char, desiredNear, behind) {
        const e = this.enemy;
        if (timestamp - e.lastAttackTime > e.attackCooldownMs) {
            this.stopMovement();
            e.combatCtrl.tryStartAttack(timestamp);
            return;
        }
        if (!behind) {
            e.movementCtrl.keepDistanceToTarget(char, { desiredDist: desiredNear, faceTarget: true });
        } else {
            this.stopMovement();
        }
    }

    /**
     * Checks whether the character is far above the enemy.
     * @param {object} char Character object.
     * @param {number} [threshold=40] Vertical distance threshold.
     * @returns {boolean} True if the character is far above, otherwise false.
     */
    isCharacterFarAbove(char, threshold = 40) {
        const myBottom = this.enemy.y + this.enemy.height;
        const charBottom = char.y + char.height;
        return (myBottom - charBottom) > threshold;
    }

    /**
     * Returns the desired melee distance to a character.
     * @param {Object} char Character object.
     * @returns {number} Desired melee distance.
     */
    getDesiredMeleeDistance(char) {
        if (!char) return this.enemy.meleeRange;
        let desired = this.enemy.meleeRange;
        if (
            this.enemy.currentEnemy === 'chickenMutatesSmall' &&
            this.isBehindCharacter(char)
        ) {
            desired += this.getStateBasedOffset(char);
        }
        return desired;
    }

    /**
     * Returns state-based distance offset for a character.
     * @param {Object} char Character object.
     * @returns {number} Distance offset.
     */
    getStateBasedOffset(char) {
        const flipped = !!char.isFlipped;
        if (char.currentAnimation === 'protect' || char.currentAnimation === 'protect-loop') {
            return flipped ? -5 : 22;
        }
        if (char.currentAnimation === 'attack-sword') return flipped ? -60 : 80;
        if (char.currentAnimation === 'attack-staff') return flipped ? -45 : 55;
        if (['duck-enter', 'duck-loop', 'duck-exit', 'duck-walk'].includes(char.currentAnimation)) {
            return flipped ? -1 : 26;
        }
        return 12;
    }

    /**
     * Checks whether the enemy is behind the character.
     * @param {object} char Character object.
     * @returns {boolean} True if the enemy is behind the character, otherwise false.
     */
    isBehindCharacter(char) {
        const ex = this.enemy.x + this.enemy.width * 0.5;
        const tx = char.x + char.width * 0.5;
        const charFacingRight = !char.isFlipped;
        const chickenRightOfChar = ex > tx;
        return (
            (charFacingRight && !chickenRightOfChar) ||
            (!charFacingRight && chickenRightOfChar)
        );
    }

    /**
     * Handles behavior for an airborne target.
     * @param {Object} char Character object.
     * @returns {void}
     */
    handleAirborneTarget(char) {
        const e = this.enemy;
        const dist = this.getHorizontalDistanceToChar(char);
        const desired = this.getDesiredMeleeDistance(char) * 1.1;
        if (dist < desired * 0.9) {
            e.movementCtrl.keepDistanceToTarget(char, { desiredDist: desired, faceTarget: true, speed: 1 });
            return;
        }
        if (dist > desired * 1.3) {
            e.movementCtrl.moveToTargetX(char, { desiredDist: desired, tolerance: 10, snap: false, faceTarget: true, speed: 20 });
            return;
        }
        this.stopMovement();
    }
}