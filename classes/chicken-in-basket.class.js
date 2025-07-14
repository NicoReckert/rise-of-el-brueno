class ChickenInBasket extends MovableObject {
    constructor(x, y) {
        super();
        super.loadImage('./assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.height = 50;
        this.width = 50;
        this.x = x;
        this.y = y;
        this.isFlipped = true;
        this.isGameCharakter = true;
        this.isAttack = false;
        this.isIdle = true;
        this.speedX = 10;
        this.offset.top = 5;
        this.offset.left = 5;
        this.offset.right = 2;
        this.offset.bottom = 5;

        this.startX = 0;
        this.startY = 0;
        this.returnStart = false;
        this.isReturning = false;
        this.returnProgress = 0;
    }

    setCoordinates(x, y) {
        if (!this.isAttack) {
            this.x = x;
            this.y = y;
        }
    }

    chickenAttack(charakterX) {
        if ((charakterX - this.x) >= -300 && this.isAttack) {
            console.log(charakterX - this.x);
            this.x += this.speedX;
        } else {
            this.isAttack = false;
            this.isReturning = false;
            this.startReturn(
                this.x,
                this.y,
                this.charakter.x + 20,
                this.charakter.y + 90
            );
        }
    }

    startReturn(startX, startY, endX, endY) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.returnProgress = 0;
        this.isReturning = true;
    }

    updateReturnFlight() {
        if (!this.isReturning) return;

        this.returnProgress += 0.02; // Geschwindigkeit

        if (this.returnProgress >= 1) {
            this.returnProgress = 1;
            this.isReturning = false;
            this.isIdle = true;
            return;
        }

        // Bogenbewegung mit Quadratischer Bézier-Kurve
        const t = this.returnProgress;
        const cx = (this.startX + this.endX) / 2 - 50; // Kontrollpunkt (hinter Charakter)
        const cy = this.startY - 80; // Kontrollpunkt (Höhe)

        // Quadratische Bézier-Formel
        this.x = (1 - t) ** 2 * this.startX + 2 * (1 - t) * t * cx + t ** 2 * this.endX;
        this.y = (1 - t) ** 2 * this.startY + 2 * (1 - t) * t * cy + t ** 2 * this.endY;
    }

}