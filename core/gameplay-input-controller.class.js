/**
 * Handles gameplay-related input logic.
 */
export class GameplayInputController {
    /**
     * Creates a new GameplayInputController instance.
     * @param {Object} keyboard Keyboard input handler.
     */
    constructor(keyboard) {
        this.keyboard = keyboard;
    }

    /**
     * Processes gameplay input for movement, actions, and interactions.
     * @param {Object} game Game instance.
     * @param {number} timestamp Frame timestamp.
     */
    processGameInput(game, timestamp) {
        if (game.isKeysStopp) return;
        this.handleDuck(game);
        this.resetMovementState(game.character);
        if (this.duckIsBlocking(game.character)) {
            this.handleTaskWindowToggle(game);
            return;
        }
        this.handleHorizontalInput(game, timestamp);
        this.handleJump(game);
        this.handleTaskWindowToggle(game);
        this.handleCombatInput(game, timestamp);
    }

    /**
     * Resets horizontal movement state of the character.
     * @param {Object} char Character instance.
     */
    resetMovementState(char) {
        char.isMovingLeft = false;
        char.isMovingRight = false;
    }

    /**
     * Handles horizontal movement input.
     * @param {Object} game Game instance.
     * @param {number} timestamp Frame timestamp.
     */
    handleHorizontalInput(game, timestamp) {
        const kb = this.keyboard;
        const char = game.character;
        this.handleLeftInput(kb, char, game, timestamp);
        this.handleRightInput(kb, char, game, timestamp);
    }

    /**
     * Handles left movement input.
     * @param {Object} kb Keyboard input state.
     * @param {Object} char Character instance.
     * @param {Object} game Game instance.
     * @param {number} now Frame timestamp.
     */
    handleLeftInput(kb, char, game, now) {
        if (!kb.LEFT) return;
        if (char.isProtect) char.isProtect = false;
        if (this.isAttackMovementBlocked(char, game, now)) {
            char.isMovingLeft = false;
            return;
        }
        char.isMovingLeft = true;
    }

    /**
     * Handles right movement input.
     * @param {Object} kb Keyboard input state.
     * @param {Object} char Character instance.
     * @param {Object} game Game instance.
     * @param {number} now Frame timestamp.
     */
    handleRightInput(kb, char, game, now) {
        if (!kb.RIGHT) return;
        if (char.isProtect) char.isProtect = false;
        if (this.isAttackMovementBlocked(char, game, now)) {
            char.isMovingRight = false;
            return;
        }
        char.isMovingRight = true;
    }

    /**
     * Checks whether movement is blocked due to an active attack.
     * @param {Object} char Character instance.
     * @param {Object} game Game instance.
     * @param {number} now Frame timestamp.
     * @returns {boolean} True if movement is blocked, otherwise false.
     */
    isAttackMovementBlocked(char, game, now) {
        return char.isAttack && now < game.attackCommitUntil;
    }

    /**
     * Handles jump input and triggers the jump action.
     * @param {Object} game Game instance.
     */
    handleJump(game) {
        const kb = this.keyboard;
        const char = game.character;
        if (kb.UP && !char.isAboveGround() && !char.isJumping) {
            if (char.isAttack || char.isProtect) {
                char.isAttack = false;
                char.isProtect = false;
            }
            char.isJumping = true;
            char.speedY = 25;
            game.audioManager.playOneShot('jumpSound');
        }
    }

    /**
     * Handles toggling of the task window via keyboard input.
     * @param {Object} game Game instance.
     */
    handleTaskWindowToggle(game) {
        if (this.keyboard.T && !game.tKeyPressed) {
            game.taskWindow.toggle();
            game.tKeyPressed = true;
            return;
        }
        if (!this.keyboard.T) game.tKeyPressed = false;
    }

    /**
     * Handles combat-related input such as attack and protection.
     * @param {Object} game Game instance.
     * @param {number} timestamp Frame timestamp.
     */
    handleCombatInput(game, timestamp) {
        const kb = this.keyboard;
        const char = game.character;
        this.handleAttackInput(kb, char, game, timestamp);
        this.handleProtectInput(kb, char);
    }

    /**
     * Handles attack input and triggers the attack action.
     * @param {Object} kb Keyboard input state.
     * @param {Object} char Character instance.
     * @param {Object} game Game instance.
     * @param {number} timestamp Frame timestamp.
     */
    handleAttackInput(kb, char, game, timestamp) {
        if (!kb.A || char.isAttack || char.isMovingLeft || char.isMovingRight) return;
        char.isAttack = true;
        game.attackStartTime = timestamp;
        game.attackCommitUntil = timestamp + 180;
        game.audioManager.playOneShot('attackSound');
    }

    /**
     * Handles protection input and updates the protection state.
     * @param {Object} kb Keyboard input state.
     * @param {Object} char Character instance.
     */
    handleProtectInput(kb, char) {
        if (kb.S && !char.isProtect && !char.isMovingLeft && !char.isMovingRight) {
            char.isProtect = true;
        }
        if (!kb.S && char.isProtect) {
            char.isProtect = false;
        }
    }

    /**
     * Handles duck input and updates the duck state.
     * @param {Object} game Game instance.
     */
    handleDuck(game) {
        const kb = this.keyboard;
        const char = game.character;
        if (kb.DOWN && this.canDuck(char)) {
            this.startDuckEnter(char);
            return;
        }
        if (!kb.DOWN && this.duckIsActive(char)) {
            this.startDuckExit(char);
        }
    }

    /**
     * Checks whether the character can enter the duck state.
     * @param {Object} char Character instance.
     * @returns {boolean} True if the character can duck, otherwise false.
     */
    canDuck(char) {
        return !char.isAboveGround()
            && !char.isJumping
            && !char.isAttack
            && !char.isProtect;
    }

    /**
     * Starts the duck enter state for the character.
     * @param {Object} char Character instance.
     */
    startDuckEnter(char) {
        if (char.duckState) return;
        char.duckState = 'enter';
        this.resetDuckAnimationState(char);
    }

    /**
     * Resets the character's duck animation state.
     * @param {Object} char Character instance.
     */
    resetDuckAnimationState(char) {
        char.frameIndex = 0;
        char.sheetIndex = 0;
        char.animationFinished = false;
        char.lastFrameTime = null;
    }

    /**
     * Checks whether the duck state is currently active.
     * @param {Object} char Character instance.
     * @returns {boolean} True if duck is active, otherwise false.
     */
    duckIsActive(char) {
        return char.duckState === 'enter' || char.duckState === 'loop';
    }

    /**
     * Checks whether duck transition blocks other actions.
     * @param {Object} char Character instance.
     * @returns {boolean} True if duck transition blocks actions, otherwise false.
     */
    duckIsBlocking(char) {
        return char.duckState === 'enter' || char.duckState === 'exit';
    }

    /**
     * Starts the duck exit state for the character.
     * @param {Object} char Character instance.
     */
    startDuckExit(char) {
        if (!this.duckIsActive(char)) return;
        char.duckState = 'exit';
        this.resetDuckAnimationState(char);
    }
}