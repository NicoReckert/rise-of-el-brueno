export class EndbossCombatController {
    constructor() {

    }

    shootProjectile(character) {
        const targetX = character.x + character.width * 0.5;
        const targetY = character.y + character.height * 0.35;

        const direction = targetX > (this.x + this.width * 0.5);

        const beakX = direction
            ? this.x + this.width * 0.88
            : this.x + this.width * 0.12;

        const beakY = this.y + this.height * 0.20;

        const fireball = new EndbossFireball(beakX, beakY, targetX, targetY, this.allAudios);
        fireball.world = this.world; // 🔥 WICHTIG

        this.world.projectiles.push(fireball);
    }

    startFinisher(timestamp, setup) {
        this.finisherStarted = true;
        this.finisherState = this.FINISHER.TAKEOFF;
        this.finisherStartTime = timestamp;

        // Boss sofort in Air-Phase + Ascend
        this.airState = this.AIR_STATE.ASCEND;
        this.isFly = true;
        this.isJumping = false;
        this.speedY = 0;

        this.setPhase(this.ENDBOSS_PHASE.AIR_EGGS);

        // Optional: Movement/Angriffe stoppen
        this.isMovingLeft = false;
        this.isMovingRight = false;
        this.isFireballAttack = false;
    }

    updateFinisher(timestamp, setup) {
        const hero = setup.world.character;
        const tornado = setup.world.tornado;

        switch (this.finisherState) {

            case this.FINISHER.TAKEOFF: {
                // nutzt deine ASCEND-Logik
                this.airState = this.AIR_STATE.ASCEND;
                this.isFly = true;
                this.updateAirEggPhase(timestamp, setup);

                // sobald oben -> Ei droppen
                if (Math.abs(this.y - this.airY) <= 0.0001) {
                    this.finisherState = this.FINISHER.DROP_TORNADO_EGG;
                    this.finisherEggDropped = false;
                }
                break;
            }

            case this.FINISHER.DROP_TORNADO_EGG: {
                if (!this.finisherEggDropped) {
                    setup.endbossAttack.spawnEgg(this, setup, "tornado", 0, { width: 300, height: 300, groundY: 460 });
                    this.finisherEggDropped = true;
                }
                // direkt warten bis Tornado fertig
                this.finisherState = this.FINISHER.WAIT_TORNADO_DONE;
                break;
            }

            case this.FINISHER.WAIT_TORNADO_DONE: {
                // ✅ warten bis Tornado fertig ist und Bruno auf Podest steht
                // (du setzt Bruno.y am Ende von BUILD -> 165)
                if (tornado && tornado.isFinished && hero.y === 165) {
                    this.finisherState = this.FINISHER.MOVE_TO_FIRE_POS;

                    // Boss bleibt oben im Flugmodus
                    this.isFly = true;
                    this.isJumping = false;
                    this.speedY = 0;

                    // optional: Boss schaut Richtung Bruno
                    this.isFlipped = hero.x > this.x;

                }
                break;
            }

            case this.FINISHER.MOVE_TO_FIRE_POS: {
                const hero = setup.world.character;

                this.isFly = true;
                this.isJumping = false;
                this.speedY = 0;

                // ✅ oben bleiben
                this.y = this.airY;

                // ✅ Richtung korrekt (bei dir: isFlipped = true heißt nach rechts)
                this.isFlipped = hero.x > this.x;

                const reached = this.moveToX(this.finisherFireX, 520); // px/sec
                if (reached) {
                    this.airState = this.AIR_STATE.DESCEND;
                    this.setPhase(this.ENDBOSS_PHASE.AIR_EGGS);
                    this.finisherState = this.FINISHER.BOSS_DESCEND;
                }
                break;
            }


            case this.FINISHER.BOSS_DESCEND: {
                const hero = setup.world.character;

                // Beim Descend weiter Richtung Bruno schauen:
                this.isFlipped = hero.x > this.x;

                this.updateAirEggPhase(timestamp, setup);

                if (this.phase === this.ENDBOSS_PHASE.GROUND) {
                    this.finisherState = this.FINISHER.FIRE_BREATH;

                    // ✅ FireBreath starten (HOLD)
                    this.startFireBreath(setup, timestamp);
                }
                break;
            }


            case this.FINISHER.FIRE_BREATH: {
                const hero = setup.world.character;

                // ✅ Boss bleibt stehen und schaut dauerhaft zu Bruno
                this.isMovingLeft = false;
                this.isMovingRight = false;
                this.isFlipped = hero.x > this.x;

                // ✅ Beam updaten (Position + Damage Tick)
                this.updateFireBreath(setup, timestamp);

                // NICHT weiter wechseln -> bleibt so lange aktiv,
                // bis du später stopFireBreath() aufrufst oder finisherState änderst.
                break;
            }


            case this.FINISHER.DONE: {
                // optional: hier kannst du in eine neue Phase wechseln (ENRAGE/Storm etc.)
                break;
            }
        }
    }



    startFireBreath(setup, timestamp) {
        setup.world.character.combatCtrl.startAirHitStun(timestamp);
        this.fadeOutAudio(setup.backgroundMusic, 1000);
        this.fadeInAudio(setup.sounds.airHitStunMusic, 2000, 1.0);
        if (!setup.spiritEssenceSeq?.active && setup.world.character.isAirHitStun) {
            setup.world.townLevelController.startSpiritEssenceSequence(timestamp);
        }


        this.isFireBreath = true;
        this.lastBreathDamageTime = 0;

        // Beam nur 1x erstellen
        if (!this.fireBreathBeam) {
            this.fireBreathBeam = new EndbossFireBeam(setup.entityImages, this.allAudios);
            this.fireBreathBeam.world = setup.world;
            setup.effects.push(this.fireBreathBeam); // oder setup.effects
        }

        // sofort syncen
        this.fireBreathBeam.setOwner(this);
        this.fireBreathBeam.active = true;
        this.fireBreathBeam.updateFromOwner();
    }

    updateFireBreath(setup, timestamp) {
        if (!this.fireBreathBeam) return;

        this.fireBreathBeam.setOwner(this);
        this.fireBreathBeam.active = true;
        this.fireBreathBeam.updateFromOwner();

        // Schaden in Ticks (nicht jeden Frame)
        const hero = setup.world.character;
        if (!hero) return;

        if (!this.lastBreathDamageTime) this.lastBreathDamageTime = timestamp;

        if (timestamp - this.lastBreathDamageTime >= this.fireBreathTickMs) {
            if (this.fireBreathBeam.isHitting(hero)) {
                if (typeof hero.combatCtrl.hit === "function") hero.combatCtrl.hit(this.fireBreathDamage);
                else if ("energy" in hero) hero.energy -= this.fireBreathDamage;
            }
            this.lastBreathDamageTime = timestamp;
        }
    }

    stopFireBreath() {
        this.isFireBreath = false;
        if (this.fireBreathBeam) this.fireBreathBeam.active = false;
    }

    setPhase(newPhase) {
        this.phase = newPhase;
        this.phaseStartTime = performance.now();

        switch (newPhase) {
            case this.ENDBOSS_PHASE.AIR_EGGS:
                this.isFly = true;
                this.isVulnerable = false;
                this.airMinX = 22000;
                this.airMaxX = 23600;
                this.airY = -100;
                this.airDir = 1;
                this.lastAirTime = null;
                // if (this.airState !== this.AIR_STATE.ASCEND) {
                //     this.y = this.airY;
                // }
                this.speedY = 0;
                this.isJumping = false;
                break;

            case this.ENDBOSS_PHASE.STORM:
                this.isFly = true;
                this.isVulnerable = false;
                break;

            case this.ENDBOSS_PHASE.GROUND:
                this.isFly = false;
                // this.land();
                this.isVulnerable = true;
                break;

            case this.ENDBOSS_PHASE.ENRAGE:
                this.isVulnerable = true;
                this.speedX *= 1.3;
                break;
        }
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




}