export class EnemyMovementController {
    constructor() {

    }

    moveLeft() {
        this.isFlipped = false;
        this.x -= this.movementSpeed;
    }

    moveRight() {
        this.isFlipped = true;
        this.x += this.movementSpeed;
    }

    /**
 * Handles movement logic based on direction flags.
 */
    handleMovement() {
        if (this.isMovingLeft) return this.moveLeft();
        if (this.isMovingRight) return this.moveRight();
    }

    applyGravity3() {
        if (!this.isGravity) return;

        const groundY = this.spawnY;

        this.y -= this.speedY;
        this.speedY -= this.acceleration;

        // ✨ Stabiler Boden-Check
        if (this.y >= groundY) {
            this.y = groundY;
            this.speedY = 0;
            this.isGravity = false;
            this.knockbackActive = false;
        }
    }

    moveToTargetX(target = null, {
        desiredDist = 0,
        tolerance = 10,
        speed = 60,             // px pro Sekunde
        faceTarget = true
    } = {}) {
        const t = target ?? this.world?.character;
        if (!t) return false;

        // Zielpunkt: gewünschte Distanz links/rechts vom Target
        const tCenter = t.x + t.width * 0.5;
        const eCenter = this.x + this.width * 0.5;
        const dx = tCenter - eCenter;

        const targetX = this.x + Math.sign(dx) * Math.max(0, Math.abs(dx) - desiredDist);
        return this.moveToX(targetX, { tolerance, speed, faceTarget, target: t });
    }

    moveToX(targetX, {
        tolerance = 3,
        snap = true,
        speed = 60,            // px pro Sekunde (nicht Frame!)
        faceTarget = true,
        onArrive = null,
        target = null
    } = {}) {
        const d = targetX - this.x;

        // Blickrichtung setzen, wenn gewünscht
        if (faceTarget && target) {
            this.isFlipped = target.x > this.x;
        }

        // Ziel erreicht?
        if (Math.abs(d) <= tolerance) {
            this.isMovingLeft = false;
            this.isMovingRight = false;
            if (snap) this.x = targetX;
            onArrive?.();
            return true;
        }

        // Schrittweite framerate-unabhängig berechnen
        const dt = this.deltaTime ?? 1 / 60;
        const maxStep = speed * dt;
        const step = Math.sign(d) * Math.min(Math.abs(d), maxStep);
        this.x += step;

        this.isMovingRight = d > 0;
        this.isMovingLeft = d < 0;
        return false;
    }

    keepDistanceToTarget(target = null, {
        desiredDist = this.meleeRange,
        tolerance = 6,
        speed = 1.0,        // ruhig etwas langsamer
        faceTarget = true
    } = {}) {
        const t = target ?? this.world?.character;
        if (!t) return false;

        const isAboveGround = typeof t.isAboveGround === 'function' && t.isAboveGround();

        // 🛑 Wenn der Character springt → Chicken bleibt stehen
        if (isAboveGround && t.isJumping) {
            this.isMovingLeft = false;
            this.isMovingRight = false;
            return true;
        }

        const ex = this.x + this.width * 0.5;
        const tx = t.x + t.width * 0.5;
        const dx = tx - ex;
        const dist = Math.abs(dx);

        if (faceTarget) this.isFlipped = dx > 0;

        // ✅ Abstand ist ok → keine Bewegung
        if (dist >= desiredDist - tolerance && dist <= desiredDist + tolerance) {
            this.isMovingLeft = false;
            this.isMovingRight = false;
            return true;
        }

        const wantGoToTarget = dist > desiredDist + tolerance;
        let dir = wantGoToTarget ? Math.sign(dx) : -Math.sign(dx);

        if (dir === 0) {
            dir = this.isFlipped ? 1 : -1;
        }

        // Wenn Charakter springt → kein Rückzug
        if (!wantGoToTarget && t.isJumping) {
            this.isMovingLeft = false;
            this.isMovingRight = false;
            return true;
        }

        let finalSpeed = speed;
        if (!wantGoToTarget && dist < 20) {
            finalSpeed *= 1.3;
            finalSpeed = Math.min(finalSpeed, 1.8);
        }

        const step = finalSpeed * (this.deltaTime ?? 1 / 60) * 60;
        this.x += dir * step;

        this.isMovingRight = false;
        this.isMovingLeft = false;

        return false;
    }
}