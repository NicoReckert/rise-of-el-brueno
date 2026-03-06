export class EnemyDragonController {
    constructor() {

    }

    // dragonSmall
    updateDragonAI(timestamp, char) {
        this.isMovingLeft = false;
        this.isMovingRight = false;
        if (this.isDead || this.isHurt) return;

        if (this.airState !== 'approach') {
            this.approachBaseY = null;
        }

        const ex = this.x + this.width * 0.5;
        const tx = char.x + char.width * 0.5;
        const dx = tx - ex;
        const distX = Math.abs(dx);

        if (this.airState !== 'approach') {
            this.approachBaseY = null;
        }

        // 🔹 Wenn der Spieler ZU WEIT weg ist → zurück in idle
        const tooFarDistance = this.approachDistance * 1.6; // z.B. 1.4x weiter als "aggro range"
        if (
            distX > tooFarDistance &&
            (this.airState === 'approach' || this.airState === 'air_exit')
        ) {
            this.airState = 'idle';
            this.lockDirection = false;
            this.exitTimer = null;
        }

        switch (this.airState) {
            case 'idle':
                this.dragonIdleFollow(char, distX);

                // Sobald wieder in "Aggro-Reichweite", in approach wechseln
                if (distX <= this.approachDistance) {
                    this.airState = 'approach';
                    this.approachBaseY = null; // neue Basis beim nächsten dragonApproach
                }
                break;

            case 'approach':
                this.dragonApproach(char);

                if (distX <= this.attackDistance && this.canDragonAttack(timestamp)) {
                    const eBox = this.getHitboxRect();
                    const pBox = char.getHitboxRect();

                    this.entryDir = pBox.cx > eBox.cx ? 1 : -1;

                    // etwas höhere Tiefflug-Höhe, damit Hitbox schön trifft
                    const offsetOverPlayer = -140;
                    this.planeY = pBox.cy + offsetOverPlayer;

                    const preOffset = 140;
                    const postOffset = 140;

                    this.preDiveX = pBox.cx - this.entryDir * preOffset;
                    this.postDiveX = pBox.cx + this.entryDir * postOffset;

                    this.diveTargetX = this.preDiveX;
                    this.diveTargetY = this.planeY;

                    // 👉 HIER: horizontale Dive-Geschwindigkeit merken


                    this.lowApproachSpeed = this.flySpeed * 2.5;
                    this.lockDirection = true;
                    this.hasAttackedThisDive = false;
                    this.hasBeenHitThisDive = false;
                    this.airState = 'dive_start';
                    this.diveStartTime = timestamp;
                }
                break;



            case 'dive_start':
                this.dragonDive(char, timestamp);
                if (timestamp - this.diveStartTime >= this.diveStartDuration) {
                    this.airState = 'dive_fast';
                }
                break;

            case 'dive_fast': {
                const dt = this.deltaTime ?? 1 / 60;
                const eBox = this.getHitboxRect();

                const dx = this.diveTargetX - eBox.cx;
                const dy = this.diveTargetY - eBox.cy;
                const dist = Math.hypot(dx, dy) || 1;

                const step = this.diveSpeed * dt;

                if (dist <= step) {
                    // 1) Bis exakt zum Zielpunkt auf der Dive-Linie fliegen
                    this.x += dx;
                    this.y += dy;

                    // 2) Rest der Schrittweite in diesem Frame schon horizontal
                    const remaining = step - dist;
                    if (remaining > 0) {
                        this.x += this.entryDir * remaining;
                    }

                    // Richtung fürs Hochfliegen merken
                    this.exitDir = this.entryDir;
                    this.isFlipped = this.exitDir > 0;

                    // Direkt in den Low-Approach (wir liegen jetzt exakt auf planeY)
                    this.airState = 'approach_low';
                } else {
                    // normaler schräger Dive
                    this.x += (dx / dist) * step;
                    this.y += (dy / dist) * step;
                }
                break;
            }



            case 'retreat':
                this.dragonRetreat();
                break;

            case 'dive_up_shallow':
                this.dragonDiveUp(30);
                this.checkDiveUpEnd();
                break;

            case 'dive_up_medium':
                this.dragonDiveUp(50);
                this.checkDiveUpEnd();
                break;

            case 'dive_up_steep':
                this.dragonDiveUp(70);
                this.checkDiveUpEnd();
                break;
            case 'air_exit':
                this.exitTimer ??= timestamp;
                if (timestamp - this.exitTimer > 150) {
                    this.exitTimer = null;
                    this.airState = 'approach';
                    this.hasAttackedThisDive = false;
                }
                break;

            case 'approach_low': {
                const dt = this.deltaTime ?? 1 / 60;

                // immer exakt auf der Tiefflug-Höhe
                if (this.planeY != null) {
                    this.y = this.planeY;
                }

                // gleiche horizontale Speed wie der Dive
                const speed = this.lowApproachSpeed;
                this.x += this.entryDir * speed * dt;

                const eBox = this.getHitboxRect();
                const pBox = char.getHitboxRect();

                const rel = eBox.cx - pBox.cx;

                const triggerStart = 110;
                const triggerEnd = 10;

                let inBiteZone;
                if (this.entryDir === 1) {
                    inBiteZone = (rel <= -triggerEnd && rel >= -triggerStart);
                } else {
                    inBiteZone = (rel >= triggerEnd && rel <= triggerStart);
                }

                if (inBiteZone &&
                    !this.isAttack &&
                    !this.hasAttackedThisDive &&
                    this.canDragonAttack(timestamp)) {

                    this.isAttack = true;
                    this.hasHitPlayerThisAttack = false;
                    this.hasAttackedThisDive = true;

                    this.frameIndex = 0;
                    this.lastFrameTime = 0;

                    this.lastAttackTime = timestamp;
                    this.pendingDiveUpAngle = this.chooseDiveUpAngle(char);
                }

                const passedPost =
                    this.entryDir === 1
                        ? eBox.cx >= this.postDiveX
                        : eBox.cx <= this.postDiveX;

                if (passedPost && !this.isAttack) {
                    const angle = this.pendingDiveUpAngle || this.chooseDiveUpAngle(char);
                    this.pendingDiveUpAngle = null;
                    this.airState = `dive_up_${angle}`;
                }

                break;
            }


        }

    }

    // Approach bewegt IMMER – Angriff nur wenn Cooldown ok
    dragonApproach(char) {
        const pBox = char.getHitboxRect();
        const eBox = this.getHitboxRect();

        const targetX = pBox.cx - (eBox.right - eBox.left) * 0.5;

        this.moveToX(targetX, {
            speed: this.flySpeed,
            snap: false,
            faceTarget: !this.lockDirection,
            target: char
        });

        if (this.approachBaseY == null) {
            this.approachBaseY = this.y; // aktuelle Höhe als Startpunkt
        }

        const amplitude = 12; // wie vorher
        this.y = this.approachBaseY + Math.sin(performance.now() / 300) * amplitude;
    }

    dragonIdleFollow(char, distX) {
        const pBox = char.getHitboxRect();
        const eBox = this.getHitboxRect();

        // Ziel-X: ungefähr mittig über dem Character
        const targetX = pBox.cx - (eBox.right - eBox.left) * 0.5;

        // Nur bewegen, wenn wir wirklich ein Stück weg sind (sonst Gezappel)
        const desiredDistX = 80; // in Pixeln
        const dx = pBox.cx - eBox.cx;
        if (Math.abs(dx) > desiredDistX) {
            this.moveToX(targetX, {
                speed: this.flySpeed * 0.5,   // langsamer als im Attack-Approach
                snap: false,
                faceTarget: !this.lockDirection,
                target: char
            });
        }

        // Vertikal: weich zurück in Richtung spawnY gleiten, kein harter Snap
        const dt = this.deltaTime ?? 1 / 60;
        const lerpSpeed = 2; // wie stark er pro Sekunde zu spawnY zurückzieht
        this.y += (this.spawnY - this.y) * Math.min(lerpSpeed * dt, 1);

        // ganz leichte Wobble, damit er nicht komplett statisch hängt
        this.y += Math.sin(performance.now() / 400) * 0.5;
    }

    dragonDive() {
        const eBox = this.getHitboxRect();

        const dx = this.diveTargetX - eBox.cx;
        const dy = this.diveTargetY - eBox.cy;
        const len = Math.hypot(dx, dy) || 1;

        const step = this.diveSpeed * (this.deltaTime ?? 1 / 60);
        this.x += (dx / len) * step;
        this.y += (dy / len) * step;
    }



    dragonRetreat() {
        const step = this.flySpeed * (this.deltaTime ?? 1 / 60);
        this.y -= step;

        if (this.y <= this.spawnY - this.retreatHeight) {
            this.y = this.spawnY - this.retreatHeight;

            // 🔥 WICHTIG: ZWANGSWECHSEL
            this.airState = 'approach';

            // Bewegung resetten
            this.isMovingLeft = false;
            this.isMovingRight = false;
        }
    }


    canDragonAttack(timestamp) {
        return (timestamp - this.lastAttackTime) > this.attackCooldownMs;
    }

    reachedDiveTarget() {
        const eBox = this.getHitboxRect();

        const dx = this.diveTargetX - eBox.cx;
        const dy = this.diveTargetY - eBox.cy;
        const dist = Math.hypot(dx, dy);

        const HIT_RADIUS = 20; // kannst du tunen (20–50)

        return dist <= HIT_RADIUS;
    }




    dragonDiveUp(angleDeg) {
        const rad = angleDeg * Math.PI / 180;

        const dx = Math.cos(rad) * this.exitDir;
        const dy = -Math.sin(rad);

        const climbSpeed = this.flySpeed * 3.5;
        const step = climbSpeed * (this.deltaTime ?? 1 / 60);
        this.x += dx * step;
        this.y += dy * step;
    }



    checkDiveUpEnd() {
        if (this.y <= this.spawnY - this.retreatHeight) {
            this.lockDirection = false;
            this.airState = 'air_exit';
        }
    }



    chooseDiveUpAngle(char) {
        const eBox = this.getHitboxRect();
        const pBox = char.getHitboxRect();

        const dx = Math.abs(pBox.cx - eBox.cx);
        const dy = pBox.cy - eBox.cy;

        if (dy > 40 && dx < 60) return 'steep';
        if (dx < 160) return 'medium';
        return 'shallow';
    }

}