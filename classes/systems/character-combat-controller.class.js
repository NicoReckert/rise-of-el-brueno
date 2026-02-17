export class CharacterCombatController {
    constructor(character, wolrd) {
        this.char = character;
        this.wolrd = wolrd;
    }

    startAirHitStun(timestamp, duration = 100000) {
        this.isAirHitStun = true;
        this.airHitStunStart = timestamp;
        this.airHitStunDuration = duration;

        // Input/Movement lock:
        this.isCapturedByTornado = true;
        this.speedY = 0;
        this.isJumping = false;
    }


    hit2(timestamp, dmg = 10) {
        if (this.isDead || this.isHurt) return;
        if (timestamp < this.invulnerableUntil) return;

        // Schaden
        this.energy = Math.max(0, this.energy - dmg);

        // i-frames
        this.invulnerableUntil = timestamp + 650;

        // ❗ WENN PROTECT → KEIN HURT
        if (this.isProtect) {
            // Optional: kleines Block-Feedback
            this.setAnimation('protect-loop');
            return;
        }

        // Hurt nur wenn NICHT protect
        if (!this.isHurt) {
            this.isHurt = true;
            this.hurtUntil = timestamp + 450;
            this.setAnimation('hurt');
        }
    }

    handleEnemyTouch(enemy, colliding, timestamp, {
        dmg = 10,
        knockX = 70,
        knockY = 18,
        lockMs = 260
    } = {}) {


        // --- Kontakt beendet → Reset
        if (!colliding) {
            this.touchingEnemies.delete(enemy);
            return false;
        }

        // --- Noch im Kontakt → kein Dauerschaden
        if (this.touchingEnemies.has(enemy)) return false;
        this.touchingEnemies.add(enemy);

        // i-frames / dead
        if (this.isDead) return false;
        if (timestamp < this.invulnerableUntil) return false;

        // 🛡️ PROTECT → blockt alles
        if (this.isProtect || this.isAttack) {
            this.invulnerableUntil = timestamp + 250;
            return false;
        }

        // 💥 Schaden + Hurt
        this.hit2(timestamp, dmg);

        // 🔥 KNOCKBACK-RICHTUNG
        const dir = enemy.x < this.x ? 1 : -1;

        // 👉 SOFORTIGE Distanz
        this.x += dir * knockX;

        // ⬆️ Hit-Jump
        this.isJumping = true;
        this.isLanding = false;
        this.speedY = Math.max(this.speedY, knockY);

        // 🧊 Bewegung kurz sperren
        this.movementLockUntil = timestamp + lockMs;
        this.isMovingLeft = false;
        this.isMovingRight = false;
        this.isAttack = false;
        this.isProtect = false;

        // Gravity sauber starten
        this.lastGravityUpdate = timestamp;

        return true;
    }

    updateAttackHitbox(weapon) {
        switch (weapon) {
            case 'staff':
                this.attackHitbox =
                {
                    top: 220,     // Abstand von oben
                    left: 200,    // Abstand von links
                    right: 8,     // Abstand von rechts
                    bottom: 52,   // Abstand von unten
                    active: false
                }
                break;

            case 'sword':
                this.attackHitbox =
                {
                    top: 200,     // Abstand von oben
                    left: 200,    // Abstand von links
                    right: 8,     // Abstand von rechts
                    bottom: 65,   // Abstand von unten
                    active: false
                }
                break;
        }
    }

}