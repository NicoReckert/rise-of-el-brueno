import { MovableObject } from '../systems/movable-object.class.js';
import { EndbossConfig } from '../systems/endboss-config.class.js';
import { EndbossAnimationController } from '../systems/endboss-animation-controller.class.js';
import { EndbossCombatController } from '../systems/endboss-combat-controller.class.js';
import { EndbossMovementController } from '../systems/endboss-movement-controller.class.js';
import { EndbossAirPhaseController } from '../systems/endboss-air-phase-controller.class.js';
import { EndbossGroundAttackController } from '../systems/endboss-ground-attack-controller.class.js';

/**
 * Represents the endboss entity.
 */
export class Endboss extends MovableObject {
    /**
     * Creates a new endboss instance.
     * @param {*} entityImages Entity image resources.
     * @param {*} allAudios Audio resources.
     * @param {*} world World instance.
     */
    constructor(entityImages, allAudios, world) {
        super();
        this.world = world;
        this.allAudios = allAudios;
        this.entityImages = entityImages;
        this.config = new EndbossConfig(this, entityImages, allAudios, world);
        this.config.initAll();
        this.animCtrl = new EndbossAnimationController(this);
        this.combatCtrl = new EndbossCombatController(this);
        this.movementCtrl = new EndbossMovementController(this);
        this.airPhaseCtrl = new EndbossAirPhaseController(this);
        this.groundAttackCtrl = new EndbossGroundAttackController(this);
    }

    /**
     * Updates all subsystems for the current frame.
     * @param {number} timestamp Frame timestamp.
     * @param {*} setup Configuration or state setup object.
     * @returns {void}
     */
    updateAll(timestamp, setup) {
        this.updateDeltaTime(timestamp);
        this.movementCtrl.updateState(timestamp, setup);
        this.animCtrl.updateAnimation(timestamp);
        if (this.finisherStarted) {
            this.updateFinisher(timestamp, setup);
        }
    }

    /**
     * Updates the finisher sequence state.
     * @param {number} timestamp Frame timestamp.
     * @param {*} setup Configuration or state setup object.
     * @returns {void}
     */
    updateFinisher(timestamp, setup) {
        const char = setup.world.character;
        const tornado = setup.world.tornado;
        const state = this.finisherState;
        if (
            state === this.FINISHER.TAKEOFF ||
            state === this.FINISHER.DROP_TORNADO_EGG ||
            state === this.FINISHER.WAIT_TORNADO_DONE
        ) {
            this.updateFinisherEarlyStates(state, timestamp, setup, char, tornado);
            return;
        }
        this.updateFinisherLateStates(state, timestamp, setup, char);
    }

    /**
     * Updates early states of the finisher sequence.
     * @param {*} state Current finisher state.
     * @param {number} timestamp Frame timestamp.
     * @param {*} setup Configuration or state setup object.
     * @param {*} char Character instance.
     * @param {*} tornado Tornado instance.
     * @returns {void}
     */
    updateFinisherEarlyStates(state, timestamp, setup, char, tornado) {
        if (state === this.FINISHER.TAKEOFF) {
            this.handleFinisherTakeoff(timestamp, setup);
            return;
        }
        if (state === this.FINISHER.DROP_TORNADO_EGG) {
            this.handleFinisherDropEgg(setup);
            return;
        }
        if (state === this.FINISHER.WAIT_TORNADO_DONE) {
            this.handleFinisherWaitTornado(char, tornado);
        }
    }

    /**
     * Updates late states of the finisher sequence.
     * @param {*} state Current finisher state.
     * @param {number} timestamp Frame timestamp.
     * @param {*} setup Configuration or state setup object.
     * @param {*} char Character instance.
     * @returns {void}
     */
    updateFinisherLateStates(state, timestamp, setup, char) {
        if (state === this.FINISHER.MOVE_TO_FIRE_POS) {
            this.handleFinisherMoveToFirePos(char);
            return;
        }
        if (state === this.FINISHER.BOSS_DESCEND) {
            this.handleFinisherBossDescend(timestamp, setup, char);
            return;
        }
        if (state === this.FINISHER.FIRE_BREATH) {
            this.handleFinisherFireBreath(timestamp, setup, char);
        }
    }

    /**
     * Handles the takeoff state of the finisher sequence.
     * @param {number} timestamp Frame timestamp.
     * @param {*} setup Configuration or state setup object.
     * @returns {void}
     */
    handleFinisherTakeoff(timestamp, setup) {
        this.airState = this.AIR_STATE.ASCEND;
        this.isFly = true;
        this.airPhaseCtrl.updateAirEggPhase(timestamp, setup);
        const dy = this.y - this.airY;
        if (Math.abs(dy) > 0.0001) return;
        this.finisherState = this.FINISHER.DROP_TORNADO_EGG;
        this.finisherEggDropped = false;
    }

    /**
     * Handles dropping the tornado egg during the finisher sequence.
     * @param {*} setup Configuration or state setup object.
     * @returns {void}
     */
    handleFinisherDropEgg(setup) {
        if (!this.finisherEggDropped) {
            setup.endbossAttack.spawnEgg(
                this,
                setup,
                "tornado",
                0,
                { width: 300, height: 300, groundY: 460 }
            );
            this.finisherEggDropped = true;
        }
        this.finisherState = this.FINISHER.WAIT_TORNADO_DONE;
    }

    /**
     * Handles waiting for the tornado to finish during the finisher sequence.
     * @param {*} char Character instance.
     * @param {*} tornado Tornado instance.
     * @returns {void}
     */
    handleFinisherWaitTornado(char, tornado) {
        if (!tornado) return;
        if (!tornado.isFinished) return;
        if (char.y !== 165) return;
        this.finisherState = this.FINISHER.MOVE_TO_FIRE_POS;
        this.isFly = true;
        this.isJumping = false;
        this.speedY = 0;
        this.isFlipped = char.x > this.x;
    }

    /**
     * Handles movement to the fire position during the finisher sequence.
     * @param {*} char Character instance.
     * @returns {void}
     */
    handleFinisherMoveToFirePos(char) {
        this.isFly = true;
        this.isJumping = false;
        this.speedY = 0;
        this.y = this.airY;
        this.isFlipped = char.x > this.x;
        const reached = this.movementCtrl.moveToX(this.finisherFireX, 520);
        if (!reached) return;
        this.airState = this.AIR_STATE.DESCEND;
        this.combatCtrl.setPhase(this.ENDBOSS_PHASE.AIR_EGGS);
        this.finisherState = this.FINISHER.BOSS_DESCEND;
    }

    /**
     * Handles boss descend during the finisher sequence.
     * @param {number} timestamp Frame timestamp.
     * @param {*} setup Configuration or state setup object.
     * @param {*} char Character instance.
     * @returns {void}
     */
    handleFinisherBossDescend(timestamp, setup, char) {
        this.isFlipped = char.x > this.x;
        this.airPhaseCtrl.updateAirEggPhase(timestamp, setup);
        const groundPhase = this.ENDBOSS_PHASE.GROUND;
        if (this.phase !== groundPhase) return;
        this.finisherState = this.FINISHER.FIRE_BREATH;
        this.combatCtrl.startFireBreath(setup, timestamp);
    }

    /**
     * Handles the fire breath state during the finisher sequence.
     * @param {number} timestamp Frame timestamp.
     * @param {*} setup Configuration or state setup object.
     * @param {*} char Character instance.
     * @returns {void}
     */
    handleFinisherFireBreath(timestamp, setup, char) {
        this.isMovingLeft = false;
        this.isMovingRight = false;
        this.isFlipped = char.x > this.x;
        this.combatCtrl.updateFireBreath(setup, timestamp);
    }

    /**
     * Moves the object to the target x position.
     * @param {number} targetX Target x position.
     * @param {number} speedPxPerSec Movement speed in pixels per second.
     * @returns {*}
     */
    moveToX(targetX, speedPxPerSec) {
        return this.movementCtrl.moveToX(targetX, speedPxPerSec);
    }

    /**
     * Sets the combat phase.
     * @param {*} newPhase New phase value.
     * @returns {void}
     */
    setPhase(newPhase) {
        this.combatCtrl.setPhase(newPhase);
    }
}