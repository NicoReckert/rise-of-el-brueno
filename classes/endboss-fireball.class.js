class EndbossFireball extends Projectile {
    constructor(type, startX, startY, targetX, targetY) {
        // direction ist fürs Draw-Flipping weiter nutzbar, aber Bewegung steuern wir selbst
        const direction = targetX >= startX;
        super(type, startX, startY, direction);

        // 🔥 viel größer
        this.width = 180;   // z.B. 3x (60 -> 180)
        this.height = 180;

        // Ziel einfrieren
        this.startX = startX;
        this.startY = startY;
        this.targetX = targetX;
        this.targetY = targetY;

        // Flugzeit statt speed
        this.startTime = performance.now();
        this.duration = 900;     // ms -> anpassen (schneller/langsamer)

        // Ellipse-Feeling (anpassen)
        this.arcHeight = 260;    // Bogen nach oben
        this.sideAmp = 140;      // seitliches “oval”
    }

    updateState(timestamp) {
        const elapsed = timestamp - this.startTime;
        const t = Math.min(1, elapsed / this.duration);

        // lineare Basis
        const xLine = this.startX + (this.targetX - this.startX) * t;
        const yLine = this.startY + (this.targetY - this.startY) * t;

        // Ellipsen-Kurve:
        // - vertikal: sin(pi*t) = 0..1..0 (Bogen)
        // - horizontal: sin(2*pi*t) = links/rechts “oval”
        const yArc = -this.arcHeight * Math.sin(Math.PI * t);
        const xSide = this.sideAmp * Math.sin(2 * Math.PI * t);

        this.x = xLine + xSide;
        this.y = yLine + yArc;

        // Richtung fürs Draw (Flip) an aktuelle Bewegung koppeln
        this.direction = this.targetX >= this.startX;

        this.updateAnimation(timestamp);

        // am Ende entfernen
        if (t >= 1) this.markedForRemoval = true;
    }
}
