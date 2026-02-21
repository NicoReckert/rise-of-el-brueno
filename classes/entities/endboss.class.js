import { MovableObject } from '../systems/movable-object.class.js';
import { EndbossFireball } from '../effects/endboss-fireball.class.js';
import { EndbossFireBeam } from '../effects/endboss-fire-beam.class.js';
import { AudioManager } from '../../core/audio-manager.class.js';

import { EndbossConfig } from '../systems/endboss-config.class.js';
import { EndbossAnimationController } from '../systems/endboss-animation-controller.class.js';
import { EndbossCombatController } from '../systems/endboss-combat-controller.class.js';
import { EndbossMovementController } from '../systems/endboss-movement-controller.class.js';

/**
 * Represents a complex movable object with gravity, animation, and state handling.
 * Handles movement, jumping, falling, and transitions between animation states.
 * @extends MovableObject
 */
export class Endboss extends MovableObject {
    isGameCharacter = true;

    /**
     * Creates a new instance with default position, speed, and animation settings.
     * @param {Object} entityImages - Image data containing animation frames.
     */
    constructor(entityImages, allAudios, world) {
        super();
        this.world = world;
        this.allAudios = allAudios;
        this.entityImages = entityImages;
        this.config = new EndbossConfig(this, entityImages, allAudios, world);
        this.config.initAll();
        this.animCtrl = new EndbossAnimationController(this);
        this.combatCtrl = new EndbossCombatController(this, this.animCtrl);
        this.movementCtrl = new EndbossMovementController(this, world);
    }

    /** wie beim Character */
    updateAll(timestamp, setup) {
        this.updateDeltaTime(timestamp);
        this.combatCtrl.updateState(timestamp, setup);
        this.movementCtrl.updateState(timestamp, setup);
        this.animCtrl.updateAnimation(timestamp);
    }


    /**
     * Updates movement and animation state each frame.
     */
    updateState(timestamp, setup) {
        this.updateDeltaTime(timestamp);
        if (!this.finisherStarted && this.energy <= this.lowEnergyThreshold) {
            this.finisherStarted = true;
            this.isHurt = false;
            this.isFireballAttack = false;
            this.isJumping = false;
            this.speedY = 0;

            // ✅ Takeoff = Flugstate aktivieren
            this.isFly = true;
            this.airState = this.AIR_STATE.ASCEND;
            this.setPhase(this.ENDBOSS_PHASE.AIR_EGGS);
        }

        if (this.finisherStarted) {
            this.updateFinisher(timestamp, setup);
            this.handleStateAnimations();
            return;
        }

        switch (this.phase) {
            case this.ENDBOSS_PHASE.AIR_EGGS:
                this.updateAirEggPhase(timestamp, setup);
                break;

            case this.ENDBOSS_PHASE.STORM:
                this.updateStormPhase(timestamp, setup);
                break;

            case this.ENDBOSS_PHASE.GROUND:
                this.updateGroundPhase(timestamp, setup);
                break;

            case this.ENDBOSS_PHASE.ENRAGE:
                this.updateEnragePhase(timestamp, setup);
                break;
        }

        if (this.phase === this.ENDBOSS_PHASE.GROUND ||
            this.phase === this.ENDBOSS_PHASE.ENRAGE) {
            this.handleMovement();
        }

        this.handleStateAnimations();
    }

    updateGroundPhase(timestamp, setup) {
        const hero = setup.world.character;
        const dist = Math.abs(hero.x - this.x);

        // 1) Sequenz starten
        if (!this.groundFireballSequenceActive) {
            if (dist <= 400) return;

            this.groundFireballSequenceActive = true;
            this.groundFireballShotsDone = 0;
            this.groundShotInProgress = false;
            this.lastSequenceShotTime = 0;
        }

        // 2) Wenn ein Schuss gestartet wurde: warten bis Animation fertig ist
        // (dein playFireballAttackAnimation setzt isFireballAttack am Ende wieder false)
        if (this.groundShotInProgress) {
            if (!this.isFireballAttack) {
                // Schuss ist komplett abgeschlossen
                this.groundFireballShotsDone++;
                this.groundShotInProgress = false;
                this.lastSequenceShotTime = timestamp;
            } else {
                return; // noch mitten in der Attack
            }
        }

        // 3) Fertig?
        if (this.groundFireballShotsDone >= this.groundFireballShotsMax) {
            this.groundFireballSequenceActive = false;

            // zurück in die Air-Phase
            this.airPointIndex = 0;
            this.airState = this.AIR_STATE.ASCEND;

            // ✅ Takeoff: sofort "Fly" aktivieren und Gravity/Jump neutralisieren
            this.isFly = true;
            this.isJumping = false;
            this.speedY = 0;

            this.setPhase(this.ENDBOSS_PHASE.AIR_EGGS);
            return;
        }

        // 4) Nächsten Schuss starten, wenn Delay + Cooldown ok
        const delayOk = (timestamp - this.lastSequenceShotTime) >= this.groundSequenceShotDelay;
        const cooldownOk = (timestamp - this.lastFireballAttackTime) >= this.fireballCooldown;

        if (!this.isFireballAttack && delayOk && cooldownOk) {
            this.isFireballAttack = true;
            this.hasFiredThisAttack = false;
            this.frameIndex = 0;
            this.lastFireballAttackTime = timestamp;

            const audio = this.allAudios.fireballChargeSound.cloneNode();
            audio.play();

            this.groundShotInProgress = true; // ✅ wichtig
        }
    }







}

// endbossReaction() {
//     const boss = this.townLevelSetup.characters.endboss;
//     const player = this.character;
//     const distance = Math.abs((player.x + player.width / 2) - (boss.x + boss.width / 2));

//     if (distance < 200 && !boss.isDead) {
//         // Wenn noch nicht springt, dann Starte den Sprung
//         if (!boss.isJumping) {
//             boss.speedY = 20;
//             boss.isJumping = true;
//         }
//         if (player.x < boss.x) {
//             boss.isMovingLeft = true;
//             boss.isMovingRight = false;
//         } else {
//             boss.isMovingRight = true;
//             boss.isMovingLeft = false;
//         }
//     } else if (distance < 500 && !boss.isDead) {
//         boss.isJumping = false; // Nur laufen
//         if (player.x < boss.x) {
//             boss.isMovingLeft = true;
//             boss.isMovingRight = false;
//         } else {
//             boss.isMovingRight = true;
//             boss.isMovingLeft = false;
//         }
//     } else {
//         boss.isMovingLeft = false;
//         boss.isMovingRight = false;
//         boss.isJumping = false;
//     }
// }