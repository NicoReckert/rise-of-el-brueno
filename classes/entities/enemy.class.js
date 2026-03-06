import { MovableObject } from '../systems/movable-object.class.js'
import { Projectile } from './projectile.class.js';

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
        // this.currentAnimation = 'walk';
        this.y = this.spawnY;
        this.x = x;
        this.height = height;
        this.width = width;
        this.init(this.currentEnemy);
        this.movementSpeed = 0;
        this.lastUpdateTime = 0;
    }

    /**
     * Updates movement and animation each frame.
     */
    updateState(timestamp) {
        // 🔹 DeltaTime aktualisieren
        this.updateDeltaTime(timestamp);

        // 🔹 Tod: nur Death-Animation + Remove-Timer
        if (this.isDead) {
            const dt = this.deltaTime ?? 1 / 60;

            if (this.currentEnemy === 'dragonSmall') {
                if (this.deathPhase === 'fall') {
                    // runterfallen
                    this.y += this.deathFallSpeed * dt;

                    if (this.y >= this.deathGroundY) {
                        this.y = this.deathGroundY;
                        this.deathPhase = 'impact';
                        this.frameIndex = 0;
                        this.lastFrameTime = 0;
                    }
                }
            }

            this.handleAnimation();

            if (this.removeAt && timestamp >= this.removeAt) {
                this.isRemoved = true;
            }
            return;
        }



        const char = this.world.character;

        // 🐉 DRAGON AI
        if (this.currentEnemy === 'dragonSmall') {
            this.updateDragonAI(timestamp, char);
            this.handleAnimation();
            return;
        }

        // 🔹 Gravity / Knockback-Y
        this.applyGravity3(timestamp);

        // 🔹 Nach Knockback/Gravity sauber auf Spawn-Y zurückschnappen
        if (!this.isGravity && !this.knockbackActive) {
            const diff = this.y - this.spawnY;
            if (Math.abs(diff) > 0.5) this.y = this.spawnY;
        }

        this.updateAI(timestamp, char);

        // 🔹 Knockback-Bewegung in X
        if (this.knockbackActive) {
            const dt60 = (this.deltaTime ?? 1 / 60) * 60;
            this.x += (this.speedXKnock || 0) * dt60;
            this.speedXKnock *= Math.pow(this.knockFriction, dt60);

            if (Math.abs(this.speedXKnock) < this.knockStopThreshold) {
                this.speedXKnock = 0;
                this.knockbackActive = false;
            }
        } else {
            // 🔹 Normale Bewegung durch isMovingLeft / isMovingRight
            this.handleMovement();
        }

    }

    inAttackRange(char = this.world?.character) {
        const t = char;
        if (!t) return false;

        // Wenn der Character springt → nicht angreifen
        if (t.isAboveGround && typeof t.isAboveGround === 'function' && t.isAboveGround()) {
            return false;
        }

        const ex = this.x + this.width * 0.5;
        const tx = t.x + t.width * 0.5;
        const dist = Math.abs(tx - ex);

        let range;
        if (this.currentEnemy === "chickenMutatesBig") {
            range = this.rangedRange;
        } else {
            // 🔴 HIER: dynamische Nahkampfreichweite inkl. Rücken-Bonus
            range = this.getDesiredMeleeDistance(t);
        }

        return dist <= range;
    }

    /**
    * Entscheidet, ob und wie das Huhn auf den Charakter reagiert
    * (laufen, Abstand halten, angreifen).
    */
    updateAI(timestamp, char) {
        if (!char) return;

        // während Knockback / Hurt / Tot / Attack keine AI-Steuerung
        if (this.knockbackActive || this.isHurt || this.isDead || this.isAttack) {
            this.isMovingLeft = false;
            this.isMovingRight = false;
            return;
        }

        const charIsHigh = this.isCharacterFarAbove(char);
        if (charIsHigh) {
            // Charakter deutlich über mir → nicht nachziehen
            this.isMovingLeft = false;
            this.isMovingRight = false;
            return;
        }

        // 🔹 SPEZIAL-LOGIK FÜR BIG-CHICKEN (RANGED)
        if (this.currentEnemy === 'chickenMutatesBig') {
            // Immer zum Charakter schauen
            this.isFlipped = char.x > this.x;

            // Abstand in X
            const ex = this.x + this.width * 0.5;
            const tx = char.x + char.width * 0.5;
            const dist = Math.abs(tx - ex);

            // In Schuss-Reichweite?
            if (dist <= this.rangedRange) {
                if (timestamp - this.lastAttackTime > this.attackCooldownMs) {
                    // Angriff möglich → stehen + schießen
                    this.isMovingLeft = false;
                    this.isMovingRight = false;
                    this.tryStartAttack(timestamp);
                } else {
                    // Cooldown → ggf. etwas zurückgehen, wenn der Spieler VIEL zu nah ist
                    if (dist < this.meleeRange * 0.7) {
                        this.keepDistanceToTarget(char, {
                            desiredDist: this.meleeRange,
                            faceTarget: true,
                            speed: 1.0
                        });
                    } else {
                        this.isMovingLeft = false;
                        this.isMovingRight = false;
                    }
                }
            } else {
                // Noch ausserhalb der Range → hinlaufen, bis ein guter Distanzbereich erreicht ist
                this.moveToTargetX(char, {
                    desiredDist: this.rangedRange * 0.7,
                    tolerance: 10,
                    snap: false,
                    faceTarget: true,
                    speed: 40
                });
            }

            // WICHTIG: Big-Chicken fertig, kleine Hühner unten
            return;
        }

        // 🔹 AB HIER: LOGIK FÜR KLEINE HÜHNER (dein bisheriger Code)
        const desiredDistNear = this.getDesiredMeleeDistance(char); // mit Rücken-Bonus
        const desiredDistApproach = this.meleeRange;                // Basis zum Hinlaufen
        const behind = this.isBehindCharacter(char);

        if (this.inAttackRange(char)) {
            // im Nahkampfradius
            if (timestamp - this.lastAttackTime > this.attackCooldownMs) {
                // Angriff möglich
                this.isMovingLeft = false;
                this.isMovingRight = false;
                this.tryStartAttack(timestamp);
            } else {
                // Angriff im Cooldown
                if (!behind) {
                    // VOR dem Charakter → leicht Abstand regeln
                    this.keepDistanceToTarget(char, {
                        desiredDist: desiredDistNear,
                        faceTarget: true
                    });
                } else {
                    // HINTER dem Rücken → einfach stehen bleiben, kein Gezappel
                    this.isMovingLeft = false;
                    this.isMovingRight = false;
                }
            }
        } else {
            // Noch nicht in AttackRange → hinlaufen bis Basis-Melee erreicht ist
            this.moveToTargetX(char, {
                desiredDist: desiredDistApproach,
                tolerance: 10,
                snap: false,
                faceTarget: true,
                speed: 40
            });
        }
    }

    /**
     * True, wenn der Character deutlich über den Füßen des Huhns ist.
     */
    isCharacterFarAbove(char, threshold = 40) {
        const myBottom = this.y + this.height;
        const charBottom = char.y + char.height;
        return (myBottom - charBottom) > threshold;
    }

    /**
     * Basis-Melee-Range + Rücken-Bonus bei kleinen Hühnern.
     */
    getDesiredMeleeDistance(char) {
        if (!char) return this.meleeRange;

        let desired = this.meleeRange;

        if (this.currentEnemy === 'chickenMutatesSmall' && this.isBehindCharacter(char)) {
            !char.isProtect ? desired += 12 : desired += 22;   // kleiner Bonus, nicht zu groß (sonst zappelt er leichter)
        }

        return desired;
    }

    isBehindCharacter(char) {
        const ex = this.x + this.width * 0.5;
        const tx = char.x + char.width * 0.5;

        const charFacingRight = !char.isFlipped;   // bei dir: isFlipped = nach links
        const chickenRightOfChar = ex > tx;

        // Char schaut rechts → Huhn links davon = hinten
        // Char schaut links  → Huhn rechts davon = hinten
        return (
            (charFacingRight && !chickenRightOfChar) ||
            (!charFacingRight && chickenRightOfChar)
        );
    }
}