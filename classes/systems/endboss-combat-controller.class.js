import { EndbossFireball } from "../effects/endboss-fireball.class.js";
import { EndbossFireBeam } from "../effects/endboss-fire-beam.class.js";

/**
 * Controls combat behavior of an endboss.
 */
export class EndbossCombatController {
    /**
     * Creates a new instance.
     * @param {*} endboss Reference to the endboss object.
     */
    constructor(endboss) {
        this.endboss = endboss;
        this.animCtrl = this.endboss.animCtrl;
        this.airPhaseCtrl = this.endboss.airPhaseCtrl;
    }

    /**
     * Shoots a projectile toward the given character.
     * @param {*} character Target character instance.
     * @returns {void}
     */
    shootProjectile(character) {
        const targetX = character.x + character.width * 0.5;
        const targetY = character.y + character.height * 0.35;
        const direction = targetX > (this.endboss.x + this.endboss.width * 0.5);
        const beakX = direction
            ? this.endboss.x + this.endboss.width * 0.88
            : this.endboss.x + this.endboss.width * 0.12;
        const beakY = this.endboss.y + this.endboss.height * 0.20;
        const fireball = new EndbossFireball(this.endboss.entityImages, beakX, beakY, targetX, targetY, this.endboss.allAudios);
        fireball.world = this.endboss.world;
        this.endboss.world.townLevelSetup.state.projectiles.push(fireball);
    }

    /**
     * Starts the finisher sequence.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    startFinisher(timestamp) {
        this.endboss.finisherStarted = true;
        this.endboss.finisherState = this.endboss.FINISHER.TAKEOFF;
        this.endboss.finisherStartTime = timestamp;
        this.endboss.airState = this.endboss.AIR_STATE.ASCEND;
        this.endboss.isFly = true;
        this.endboss.isJumping = false;
        this.endboss.speedY = 0;
        this.setPhase(this.endboss.ENDBOSS_PHASE.AIR_EGGS);
        this.endboss.isMovingLeft = false;
        this.endboss.isMovingRight = false;
        this.endboss.isFireballAttack = false;
    }

    /**
     * Starts the fire breath attack.
     * @param {*} setup Configuration or state setup object.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    startFireBreath(setup, timestamp) {
        const character = setup.world.character;
        character.combatCtrl.startAirHitStun(timestamp);
        this.applyFireBreathAudio(setup);
        this.maybeStartSpiritEssenceSequence(setup, timestamp);
        this.endboss.isFireBreath = true;
        this.endboss.lastBreathDamageTime = 0;
        this.ensureFireBreathBeam(setup);
        this.activateFireBreathBeam();
    }

    /**
     * Applies audio changes for the fire breath attack.
     * @param {*} setup Configuration or state setup object.
     * @returns {void}
     */
    applyFireBreathAudio(setup) {
        this.endboss.fadeOutAudio(setup.sounds.bossBattleMusic, 1000);
        this.endboss.fadeInAudio(setup.sounds.airHitStunMusic, 2000, 1.0);
    }

    /**
     * Starts the spirit essence sequence if conditions are met.
     * @param {*} setup Configuration or state setup object.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    maybeStartSpiritEssenceSequence(setup, timestamp) {
        const character = setup.world.character;
        const seq = setup.state.spiritEssenceSeq;
        if (!seq?.active && character.isAirHitStun) {
            setup.dialogManager.startDialog(3, timestamp, () => {
                setup.world.townLevelController.questManager.advance(15);
                setup.world.townLevelController.spiritEssenceCtrl.startSpiritEssenceSequence(timestamp);
            });
        }
    }

    /**
     * Ensures the fire breath beam instance exists.
     * @param {*} setup Configuration or state setup object.
     * @returns {void}
     */
    ensureFireBreathBeam(setup) {
        if (this.endboss.fireBreathBeam) return;
        const beam = new EndbossFireBeam(setup.entityImages, this.endboss.allAudios);
        beam.world = setup.world;
        setup.state.effectsBehind.push(beam);
        this.endboss.fireBreathBeam = beam;
    }

    /**
     * Activates the fire breath beam.
     * @returns {void}
     */
    activateFireBreathBeam() {
        const beam = this.endboss.fireBreathBeam;
        if (!beam) return;
        beam.setOwner(this.endboss);
        beam.active = true;
        beam.updateFromOwner();
    }

    /**
     * Updates the fire breath attack.
     * @param {*} setup Configuration or state setup object.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    updateFireBreath(setup, timestamp) {
        const beam = this.endboss.fireBreathBeam;
        if (!beam) return;
        this.refreshFireBreathBeam(beam);
        const char = setup.world.character;
        if (!char) return;
        this.initBreathDamageTime(timestamp);
        this.applyBreathDamageIfDue(beam, char, timestamp);
    }

    /**
     * Refreshes the fire breath beam state.
     * @param {*} beam Fire breath beam instance.
     * @returns {void}
     */
    refreshFireBreathBeam(beam) {
        beam.updateFromOwner();
    }

    /**
     * Initializes the timestamp for fire breath damage.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    initBreathDamageTime(timestamp) {
        if (!this.endboss.lastBreathDamageTime) {
            this.endboss.lastBreathDamageTime = timestamp;
        }
    }

    /**
     * Applies fire breath damage if the interval has elapsed.
     * @param {*} beam Fire breath beam instance.
     * @param {*} char Target character instance.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    applyBreathDamageIfDue(beam, char, timestamp) {
        const last = this.endboss.lastBreathDamageTime || timestamp;
        const interval = this.endboss.fireBreathTickMs;
        if (timestamp - last < interval) return;
        if (beam.isHitting(char)) {
            this.applyFireBreathDamage(char);
        }
        this.endboss.lastBreathDamageTime = timestamp;
    }

    /**
     * Applies fire breath damage to the target character.
     * @param {*} char Target character instance.
     * @returns {void}
     */
    applyFireBreathDamage(char) {
        const dmg = this.endboss.fireBreathDamage;
        if (typeof char.combatCtrl.hit === "function") {
            char.combatCtrl.hit(dmg);
        } else if ("energy" in char) {
            char.energy -= dmg;
        }
    }

    /**
     * Stops the fire breath attack.
     * @returns {void}
     */
    stopFireBreath() {
        this.endboss.isFireBreath = false;
        if (this.endboss.fireBreathBeam) this.endboss.fireBreathBeam.active = false;
    }

    /**
     * Sets a new phase and applies corresponding settings.
     * @param {*} newPhase Phase identifier.
     * @returns {void}
     */
    setPhase(newPhase) {
        this.endboss.phase = newPhase;
        this.endboss.phaseStartTime = performance.now();
        this.applyPhaseSettings(newPhase);
    }

    /**
     * Applies settings for the specified phase.
     * @param {*} newPhase Phase identifier.
     * @returns {void}
     */
    applyPhaseSettings(newPhase) {
        const phase = this.endboss.ENDBOSS_PHASE;
        switch (newPhase) {
            case phase.AIR_EGGS: this.applyAirEggsPhase(); break;
            case phase.STORM: this.applyStormPhase(); break;
            case phase.GROUND: this.applyGroundPhase(); break;
            case phase.ENRAGE: this.applyEnragePhase(); break;
        }
    }

    /**
     * Applies settings for the air eggs phase.
     * @returns {void}
     */
    applyAirEggsPhase() {
        this.endboss.isFly = true;
        this.endboss.isVulnerable = false;
        this.endboss.airMinX = 22000;
        this.endboss.airMaxX = 23600;
        this.endboss.airY = -100;
        this.endboss.airDir = 1;
        this.endboss.lastAirTime = null;
        this.endboss.speedY = 0;
        this.endboss.isJumping = false;
    }

    /**
     * Applies settings for the storm phase.
     * @returns {void}
     */
    applyStormPhase() {
        this.endboss.isFly = true;
        this.endboss.isVulnerable = false;
    }

    /**
     * Applies settings for the ground phase.
     * @returns {void}
     */
    applyGroundPhase() {
        this.endboss.isFly = false;
        this.endboss.isVulnerable = true;
    }

    /**
     * Applies settings for the enrage phase.
     * @returns {void}
     */
    applyEnragePhase() {
        this.endboss.isVulnerable = true;
        this.endboss.speedX *= 1.3;
    }
}